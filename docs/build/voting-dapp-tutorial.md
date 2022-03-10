---
title: dApp Tutorial
description: Build a complete dApp on Kadena
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Complete dApp Tutorial

Build a complete on-chain voting dApp

---

## Overview

In this tutorial you will build a complete dApp, smart contracts and frontend that allows users to submit a vote. You will also deploy your own gas station that will be used to pay for the gas needed to interact with your dApp.

## Environment Setup

### Install Pact

**Using Brew**

```clojure
brew update
brew install kadena-io/pact/pact
```
**Build from source**
- follow the instructions [here](https://github.com/kadena-io/pact#building-from-source)

**Verifying Installation**

Type `pact` in a terminal and try out some commands:

```clojure
$ pact
pact> (+ 1 2)
3
pact> (+ "hello, " "world")
"hello, world"
pact> (< 0 1)
true
```

### Create Project Structure

Copy paste the instructions below to create a basic project structure:

```clojure
mkdir my-pact-project && cd my-pact-project
mkdir pact
mkdir app
```

### Pact Http Server

Create a `config.yaml` file for pact http server. We will later use it simulate blockchains transactions locally.

For more details about pact http server check <a href="/blog/deploy-to-a-local-server">this</a> tutorial.

```clojure
touch config.yaml
```
Copy the code below and save the file:

```clojure
# Config file for pact http server. Launch with `pact -s config.yaml`

# HTTP server port
port: 8080

# directory for HTTP logs
logDir: log

# persistence directory
persistDir: log

# SQLite pragmas for pact back-end
pragmas: []

# verbose: provide log output
verbose: True
```

### Atom IDE (Optional)

You can use any text editor to write Pact but if you prefer the benefits of an IDE, "language-pact" is a package for [Atom](https://atom.io) that provides syntax highlighting and linting.

To install it, go to Preferences -> Packages -> Type "language-pact" and click the Install button.

![atom-language-pact](/img/docs/voting-dapp/atom-language-pact.png)

## Smart Contracts

Our voting app should allow you to submit a vote while not allowing an address to vote more than once.
Additionally we will use a *gas station* to fund the gas fees for interacting with our contract, meaning our users don't have to worry about paying gas.

### Voting

Let's start to implement our voting contract.

Assuming you are still in your project directory, create the `vote.pact` and `vote.repl` files:

```clojure
touch pact/vote.pact pact/vote.repl
```

`vote.pact` is the contract source code while in `vote.repl` we'll write tests.

Copy the following code in the `vote.pact` file:

```clojure
(define-keyset 'vote-admin-keyset)

(module simple-vote 'vote-admin-keyset
  "Simple voting module"

  (defun vote (key)
    "Submit a new vote"
    (format "Voted {}!" [key]))
)

(vote "A")
```

This snippet defines a module "simple-vote" that holds a function "vote" that takes a parameter and displays a formatted string that includes the parameter.

Before we move forward, let's quickly test our code. Copy the code below in the `vote.repl` file:

```clojure
;; begin a transaction
(begin-tx)
;; set transaction signature key to my-key
(env-keys ["my-key"])
;; set environment data to the admin-keyset with keys my-key and predicate function of keys-all
(env-data { 'vote-admin-keyset: { "keys": ["my-key"], "pred": "keys-all" } })
;; load vote.pact into the REPL
(load "vote.pact")
;; commit the transaction
(commit-tx)
```

To run the test type the following command in your terminal:
```clojure
$ pact
pact> (load "vote.repl")
```
And you should see an output similar to the one below (the hash will be different):
```clojure
"Loading vote.repl..."
"Begin Tx 0"
"Setting transaction keys"
"Setting transaction data"
"Loading vote.pact..."
"Keyset defined"
"Loaded module simple-vote, hash jOBJiSEH5HVsAmLNSdHq_D3Kl6TkFpCJcEWPtJD86Gc"
"Voted A!"
"Commit Tx 0"
```

Let's continue by adding a bit more logic. Copy this snippet just below the module declaration:

```clojure
  (defschema votes-schema
    "Votes table schema"
    option:string
    count:integer)

  (deftable votes:{votes-schema})
  ```
In the snippet we've got 2 new declaration:
* `defschema votes-schema` -> defines the schema for our table where we will keep track of the number of votes
* `deftable votes:{votes-schema}` -> defines the `votes` table that will use the schema defined above

Now we need to update our `vote` function:

```clojure
(defun vote (key:string)
    "Submit a new vote"
    (enforce (contains key ["A" "B"]) "You can only vote for A or B")
    (with-read votes key { "count" := count }
      (update votes key { "count": (+ count 1) })
    )
    (format "Voted {}!" [key])
  )
```

Again, quick recap of what's happening above:
* we use `enforce` to ensure that only the given list of vote keys are allowed
* we use `with-read` to first read the row data for the given key followed by an `update` call to increment the `count` column by 1

We're missing a way to read the current number of votes so here it is:

```clojure
(defun getVotes:integer (key:string)
    "Get the votes count by key"
    (at 'count (read votes key ['count]))
)
```

And we also need a way to initialize our table:

```clojure
(defun init ()
    "Initialize the rows in votes table"
    (insert votes "A" { "option": "A", "count" : 0 })
    (insert votes "B" { "option": "B", "count" : 0 })
)
```

If you followed the steps correctly, your code should look similar to this:
```clojure
(define-keyset 'vote-admin-keyset)

(module simple-vote 'vote-admin-keyset
  "Simple voting module"

  (defschema votes-schema
    "Votes table schema"
    option:string
    count:integer)

  (deftable votes:{votes-schema})

  (defun vote (key:string)
    "Submit a new vote"
    (enforce (contains key ["A" "B"]) "You can only vote for A or B")
    (with-read votes key { "count" := count }
      (update votes key { "count": (+ count 1) })
    )
    (format "Voted {}!" [key])
  )

  (defun getVotes:integer (key:string)
    "Get the votes count by key"
    (at 'count (read votes key ['count]))
  )

  (defun init ()
    "Initialize the rows in votes table"
    (insert votes "A" { "option": "A", "count" : 0 })
    (insert votes "B" { "option": "B", "count" : 0 })
  )
)

(create-table votes)
(init)
```

Notice how we're calling `create-table` and `init` outside of our module. That's an important step, so don't miss it.

We've got our module logic so now let's add a few more tests to make sure everything is right. Open the `vote.repl` file and copy the following snippet:

```clojure
(begin-tx)
(use simple-vote)
(expect-failure "Vote fails if C" (vote "C"))
(commit-tx)

(begin-tx)

;; import simple-vote module
(use simple-vote)
;; test if votes count for key "A" is initialized with 0
(expect "votes for A initialized" (getVotes "A") 0)

;; test if votes count for key "B" is initialized with 0
(expect "votes for B initialized" (getVotes "B") 0)

(commit-tx)

(begin-tx)
(use simple-vote)

;; test if votes count for key "A" is correctly increased by 1
(let ((count (getVotes "A")))
  (vote "A")
  (expect "votes count is increased by 1" (getVotes "A") (+ count 1)))

;; test if votes count for key "B" is correctly increased by 1
(let ((count (getVotes "B")))
  (vote "B")
  (expect "votes count is increased by 1" (getVotes "B") (+ count 1)))

(commit-tx)
```
Notice how we are using `expect` to test if `getVotes` returns the correct result.
`expect` is one the functions that's only available in the REPL but there are many more, check them out <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#repl-only-functions">here</a>.

I also want to mention the `let` construct which is helpful when you need to bind some variables be in the same scope as some other logic that makes use of them. In our case we first loaded the number of votes and binded the result to `count` variable which we used later in the `expect` function.

You can read more about `let` and `let*` <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#let"> here</a>.

Let's run those tests again to make sure everything works as expected:

```clojure
$ pact
pact> (load "vote.repl")
```





### Gas Station

### Testing

### Deployment

## Frontend

### Read Data

### Events
