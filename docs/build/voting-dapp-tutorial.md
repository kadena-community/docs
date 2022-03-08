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
  (defun vote (option)
    (format "Voted {}!" [option]))
)

(vote "A")
```

This snippet defines a module "simple-vote" that holds a function "vote" that takes a parameter and simply displays it.

Before we move forward, let's quickly test our code. Copy the code below in the `vote.repl` file:

```clojure
;; begin a transaction
(begin-tx)
;; set transaction signature key to my-key
(env-keys ["my-key"])
;; set environment data to the admin-keyset with keys loansadmin and predicate function of keys-all
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

### Gas Station

### Testing

### Deployment

## Frontend

### Read Data

### Events
