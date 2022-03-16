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

A unique feature of Kadena is the ability to allow gas to be paid by a different entity than the one who initiated the transaction. This entity is what we call a "gas station".

Let's create our own gas station that will allow users to submit votes without paying for gas, instead gas will be subsidized by the gas station.

Each gas station needs to implement the `gas-payer-v1` interface which is shown below:

```clojure
(interface gas-payer-v1

  (defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )
    @doc
    " Provide a capability indicating that declaring module supports \
    \ gas payment for USER for gas LIMIT and PRICE. Functionality \
    \ should require capability (coin.FUND_TX), and should validate \
    \ the spend of (limit * price), possibly updating some database \
    \ entry. \
    \ Should compose capability required for 'create-gas-payer-guard'."
    @model
    [ (property (user != ""))
      (property (limit > 0))
      (property (price > 0.0))
    ]
  )

  (defun create-gas-payer-guard:guard ()
    @doc
    " Provide a guard suitable for controlling a coin account that can \
    \ pay gas via GAS_PAYER mechanics. Generally this is accomplished \
    \ by having GAS_PAYER compose an unparameterized, unmanaged capability \
    \ that is required in this guard. Thus, if coin contract is able to \
    \ successfully acquire GAS_PAYER, the composed 'anonymous' cap required \
    \ here will be in scope, and gas buy will succeed."
  )
)
```

This interface tells us we need to define the `GAS_PAYER` capability as well as implement the `create-gas-payer-guard` function.

:::info

Pact interfaces are similar to Java's interfaces, Scala's traits, Haskell's typeclasses or Solidity's interfaces.
If you're not familiar with this concept you can read more about it <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#interfaces">**here**</a>.

:::

In one sentence, a gas station allows someone to debit from a coin account that they do not own to pay the gas fee for a transaction under certain conditions. How exactly that happens, let's see below. We're going to implement the `gas-payer-v1` interface and explain each step.

Create a new file `gas-station.pact` and paste the following snippet:

```clojure
(module simple-vote-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    "Only admin account can update the smart contract"
    (enforce-keyset 'vote-admin-keyset))
  )

  ; Implement the gas-payer-v1 interface
  (implements gas-payer-v1)
  ; Import the coin module
  (use coin)
)
  ```

  We declared that we're implementing `gas-payer-v1` interface so let's do that:

```clojure
(defcap GAS_PAYER:bool
    ( user:string
      limit:integer
      price:decimal
    )
    (enforce (= "exec" (at "tx-type" (read-msg))) "Inside an exec")
    (enforce (= 1 (length (at "exec-code" (read-msg)))) "Tx of only one pact function")
    (enforce (= "(free.simple-vote." (take 18 (at 0 (at "exec-code" (read-msg))))) "only simple-vote contract is allowed")
    (compose-capability (ALLOW_GAS))
  )
```
The `GAS_PAYER` capability implementation performs a few checks and composes the `ALLOW_GAS` capability which is a key component. We'll see below why. Let's continue the interface implementation.

```clojure

(defcap ALLOW_GAS () true)

(defun create-gas-payer-guard:guard ()
  (create-user-guard (gas-payer-guard))
)

(defun gas-payer-guard ()
  (require-capability (GAS))
  (require-capability (ALLOW_GAS))
)

(defun init ()
  (coin.create-account GAS_STATION
    (guard-any
      [
        (create-gas-payer-guard)
        (keyset-ref-guard 'vote-admin-keyset)
      ]))
)
```
First we define the `ALLOW_GAS` capability which is brought in scope by the `GAS_PAYER` capability.

Then we implement the `gas-payer-guard` function which tests if `GAS` (defined in coin contract) and `ALLOW_GAS` capabilities have been granted. This function is then used in `create-gas-payer-guard` to create a guard for the coin contract account from where the gas fees are paid.

Last thing we need is to create an account where the funds will be stored which is what happens in the `init` function. As you can see, the guard of that account is using the `guard-any` predicate and 2 guards are listed, the `vote-admin-keyset` and the guard returned by `create-gas-payer-guard`. This allows transactions where either of this guards is valid to perform operations on this account.

To recap, the key part is where we define a guard, `gas-payer-guard` that's valid if those capabilities are granted and `ALLOW_GAS` capability is brought into scope by `GAS_PAYER` capability which limits access to this gas station. If you're wondering how `GAS_PAYER` is installed, the answer is [signature capabilities](https://pact-language.readthedocs.io/en/latest/pact-reference.html#signature-capabilities). We will see how this works when we create a transaction.


### Testing

### Deployment

## Frontend

### Read Data

### Events
