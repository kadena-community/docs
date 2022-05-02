---
title: dApp Tutorial
description: Build a complete dApp on Kadena
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Building a voting dApp

One of the best ways to learn a new technology is to get your hands dirty and build applications with it. In this tutorial we'll learn to use Kadena's smart contract language, Pact, to build a minimal voting application that runs on the Chainweb blockchain.

Along the way, we'll learn how to write and test smart contracts in Pact, the basic architecture of dApps on Chainweb, and about major concepts like gas stations and deploying contracts. We'll also get acquainted with several useful tools in the Kadena ecosystem, including the Pact local test server and JavaScript libraries you can use to interact with nodes running Pact.

**Voting on the Blockchain**

Elections are a necessary part of democracies and democratic organizations. The voting systems used to administer elections must ensure a fair process and trustworthy result — easier said than done! Election security is a deep, fascinating topic, especially when it comes to online voting.

Blockchain technologies are well-suited to help secure online elections. A public blockchain gives participants a single view of all transactions, which makes it easy to verify votes without trusting a central election authority to tally and report the results. Kadena's rapid transaction speeds (480,000 per second, when using 20 chains) scale voting to even large elections.

Blockchain technologies don't solve all election security issues, but they're a strong foundation and [researchers have proposed fully-secure online voting systems based on them](https://eprint.iacr.org/2019/1406.pdf). They've also seen success in the real world: Thailand's Democrat party held an election in which [more than 120,000 registered Democrats voted via blockchain](https://bitcoinmagazine.com/culture/thailand-uses-blockchain-supported-electronic-voting-system-primaries).

**What We're Building**

We'll build a tiny voting dApp prototype that lets anyone with a Kadena wallet address vote for a candidate from a selection of candidates. Each voter (ie. address) can vote once. Some Kadena accounts are chosen as "election officials", and the smart contract grants them special privileges to select the candidates. Election officials can add new candidates at any time (but they can't remove candidates or adjust their votes).

Once the app is deployed, the election has begun! The frontend for our dapp will help users submit their votes and will display the total votes received by each candidate.

---

## Table of Contents

1. [Building the Smart Contract Backend](#writing-the-smart-contract)
2. [Testing our Smart Contract](#testing-the-contract)
3. [Implementing a Gas Station](#implementing-the-gas-station)
4. [Deploying to Chainweb](#deploying-to-chainweb)
5. [Building the Frontend Voting App](#frontend)


## Setup

### Requirements

1. [Pact](http://github.com/kadena-io/pact)
2. [NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
3. [Pact-Lang-API](http://github.com/kadena-io/pact-lang-api)

### Create Project Structure

Let's start by creating a basic project structure. Open your terminal and run the commands below:

```bash
mkdir election-dapp && cd election-dapp
mkdir pact
mkdir src
```

We've got the `election-dapp` directory and two additional sub-directories:
* `pact`, which holds the smart contracts
* `src`, which holds the front-end part of our application

## Implementing the Voting Smart Contract

A typical developer workflow looks like this:

1. Write contract code in `.pact` files
2. Write tests in `.repl` files
3. Execute your tests in the repl
4. Deploy to local pact server
5. Deploy to testnet

In this section we will focus on steps 1 to 3. Later, we'll deploy our smart contract to a local Pact server and to testnet (the test version of Chainweb).

In your project directory, let's create two files:

* `pact/election.pact`, which will hold the source code for our smart contract
* `pact/election.repl`, which will hold our tests

:::info What is Pact REPL?
The Pact REPL is an environment where we can load our Pact source code and work with it interactively. It's a best practice to include a `.repl` file next to your source code which imports your contract, calls functions from it, and inspects its current state to ensure everything is correct.
:::

We also have to import some dependencies to our project but first let's provide some context to better understand why we need them. In introduction we explained that our voting smart contract allows anyone with a wallet address to vote for a candidate. Kadena uses an account model so creating a wallet means creating an account for the native coin, KDA, which is a smart contract deployed on Kadena blockchain. The name of this contract is intuitively `coin`.

 The `coin` contract itself has two additional dependencies:
 * `fungible-v2`, an interface that each fungible token deployed on Kadena should implement
 * `fungible-xchain-v1`, an interface that provides standard capability for cross-chain transfers.

To be able to properly test our voting contract we will need to invoke functions defined in the `coin` contract so we have to include it in our project together with its dependencies, the `fungible-v2` and `fungible-xchain-v1` interfaces.

You can get the latest version of the `coin` module [here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v4/coin-v4.pact), the `fungible-v2` interface [here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v2/fungible-v2.pact) and the `fungible-xchain-v1` interface [here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v4/fungible-xchain-v1.pact). Make sure to add these files to your project in the `pact/root/` directory. You should have 3 new files: `coin-v4.pact`, `fungible-v2.pact`, `fungible-xchain-v1.pact`.

Before we begin writing code, let's recap the features of our voting contract:

1. Voters can record 1 vote for a candidate of their choice from the list of options. In response to voting, we'll return confirmation of their vote by returning their vote back to them.

2. Election administrators can add candidates (so the "add candidate" functionality should be guarded to only allow access to keys belonging to the election administrator accounts).

### Election module

We're going to start by creating a Pact module called `election` and define a keyset named `election-admin-keyset` which is used to guard certain features of the module.

Let's copy the following code in the `election.pact` file:

```clojure
;; election.pact

;; Define a keyset with name `election-admin-keyset`
(define-keyset 'election-admin-keyset)

;; Define `election` module
(module election GOVERNANCE
  "Election demo module"

  (defcap GOVERNANCE ()
    "Module governance capability that only allows the admin to update this module"
    ;; Check if the tx was signed with the provided keyset, fail if not
    (enforce-keyset 'election-admin-keyset))
)
```

The `GOVERNANCE` keyword on the module definition line is the *module governance capability* and it references the capability defined right below using the `defcap` construct. It's purpose is to restrict access to the module upgrade and administration operations, for example later on we'll add an `insert-candidate` function that only administrators should be able to call and we'll use the GOVERNANCE capability to guard it. The implementation can be as simple as in our example, enforcing a keyset or more complex like tallying a stakeholder vote on an upgrade hash.

:::note
Module names and keyset definitions are required to be unique. We will mention this again when we get to deploy our contract to testnet, but you should keep this mind when you think about choosing a name for your modules and keysets.
:::

### Capabilities

Capabilities offer a system to manage user rights in an explicit way, i.e. allow a user to perform some sensitive task if the required capability has been succcessfully acquired. If not, the transaction will fail.

Our module already defines one capability, the module governance capability. In addition to that, we're going to define the `ACCOUNT-OWNER` capability that validates the ownership of the KDA account that's used to identify a user. This might not be clear at first but let's look at the code:

```clojure
;; election.pact

  ;; Import `coin` module while only making the `details` function available
  ;; in the `election` module body
  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"

    ;; Get the guard of the given KDA account using coin.details function
    ;; and execute it using `enforce-guard`
    (enforce-guard (at 'guard (coin.details account)))
  )
```

The user submitting the vote is identified by the `account` parameter that we will pass to the `vote` function that we'll implement later on. This parameter can take any value which is why we need to make sure the value provided is the correct one, in our case it should be the KDA account controlled by the tx initiator. Every KDA account has a *guard* which controls access to it and we're using the `coin.details` function that returns an object of type `fungible-v2.account-details` to retrieve this guard for the provided account. Finally we execute the guard using the built-in Pact function `enforce-guard`.

Don't forget to add the snippet above in the `election` module body.

:::info

To learn more about guards and capabilities, please visit the [Guards, Capabilities and Events](https://pact-language.readthedocs.io/en/latest/pact-reference.html#guards) section of the Pact official documentation.

:::

### Tables and data storage

So far we've defined a module and implemented some capabilities. Now we're going to talk about storing data. We have to store who the candidates are so you can vote for them and as well as who voted already so we can prevent double-voting.

Pact smart contracts store data in tables and each table has its own schema. For our voting contract we need 2 tables: `candidates` and `votes`.

```clojure
  ;; election.pact

  ;; Define the `candidates-schema` schema
  (defschema candidates-schema
    "Candidates table schema"

    ;; Candidates table has 2 columns, `name` of type string
    ;; and `votes` which is an `integer`
    name:string
    votes:integer)

  ;; Define the `votes-schema` schema
  (defschema votes-schema
    "Votes table schema"

    ;; Votes table has one column, `cid` - Candidate id of type string
    cid:string
  )

  ;; Define the `votes` table that's using the `votes-schema`
  (deftable votes:{votes-schema})

  ;; Define the `candidates` table that's using the `candidates-schema`
  (deftable candidates:{candidates-schema})
  ```

To summarize, we created a table to store candidates and their associated vote counts and one for storing what accounts have already voted to prevent double-voting.

:::info
To find out about all Pact's supported types you can check the [Data Types](https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=types#data-types) section in the Pact official documentation.
:::

:::note
Pact implements a key-row model which means a row is accessed by a single key. The key is implicitly present in the schema but it is our responsibility as developers to design the schema in a way that we can retrieve the information that we need using a single row query. Multiple row queries are very expensive and shoud not be used.

The row key is always a simple string, to not be confused with the cryptographic keys used for signing transaction.
:::

### Functionality

We've defined our data storage so now we can add functions to read and write data, i.e. candidates and votes.
One of the core features of our voting contract is to allow users to vote for a candidate while preventing double-voting so let's implement it:

```clojure
  ;; election.pact

  (defun user-voted:bool (account:string)
    "Check if a user already voted"

    ;; Read from the votes table using `account` param value as key
    ;; with-default-read allows us to set default values for the table columns
    ;; that are returned if the row does not exist.
    (with-default-read votes account

      ;; In this case we're setting the `cid` column default value to an empty string
      { "cid": "" }
      { "cid":= cid }

      ;; Check if `cid` is an empty string or not, return true if not,
      ;; i.e. user already voted and false otherwise,
      ;; meaning the user did not vote yet
      (> (length cid) 0))
  )

  (defun candidate-exists:bool (cid:string)
    "Check if a candidate exists"

    ;; Using a similar approach as in `user-voted` function,
    ;; in this case to check if a candidate exists
    (with-default-read candidates cid
      { "name": "" }
      { "name" := name }
      (> (length name) 0))

  (defun vote-protected (account:string candidateId:string)
    "Safe vote"

    ;; Check that the ACCOUNT-OWNER capability has already been granted, fail if not
    (require-capability (ACCOUNT-OWNER account))

    ;; Read the current number of votes the candidate has
    (with-read candidates candidateId { "votes" := votesCount }

      ;; Increment the number of votes by 1
      (update candidates candidateId { "votes": (+ votesCount 1) })

      ;; Record the vote in the `votes` table (prevent double-voting)
      (insert votes account { "cid": candidateId })

      ;; Emit an event that can be used by the front-end component to update the number of
      ;; votes displayed for a candidate
      (emit-event (VOTED candidateId))
    )
  )

  (defun vote (account:string cid:string)
    "Vote for a candidate"

    ;; Prevent double-voting by checking if the user already voted through `user-voted` function
    ;; and `enforce` the returned value is `false`
    (let ((double-vote (user-voted account)))
      (enforce (= double-vote false) "Multiple voting not allowed"))

    ;; Prevent voting for a candidate that doesn't exist through `candidate-exists`
    ;; function and `enforce` the returned value is `true`
    (let ((exists (candidate-exists cid)))
      (enforce (= exists true) "Candidate doesn't exist"))

    ;; Try to acquire the `ACCOUNT-OWNER` capability which checks
    ;; that the transaction owner is also the owner of the KDA account provided as parameter to our `vote` function.
    (with-capability (ACCOUNT-OWNER account)

      ;; While the `ACCOUNT-OWNER` capability is in scope we are calling `vote-protected` which is the function that updates the database
      (vote-protected account cid))

    (format "Voted for candidate {}!" [cid])
  )
```

A quick recap: we implemented a `vote` function that allows to vote for a candidate while **preventing double-voting, voting for a candidate that doesn't exist or voting with an account that the user doesn't own**.

Now that we can vote, we also need a function to read the number of votes a candidate received:

```clojure
(defun get-votes:integer (cid:string)
  "Get the votes count by cid"

  ;; Read the row using cid as key and select only the `votes` column
  (at 'votes (read candidates cid ['votes]))
)
```

Last thing on the list is adding candidates:

```clojure
(defun insert-candidate (candidate)
  "Insert a new candidate, admin operation"

  ;; Try to acquire the GOVERNANCE capability
  (with-capability (GOVERNANCE)
    ;; While GOVERNANCE capability is in scope, insert the candidate
    (let ((name (at 'name candidate)))
      ;; The key has to be unique, otherwise this operation will fail
      (insert candidates (at 'key candidate) { "name": (at 'name candidate), "votes": 0 })))
)

(defun insert-candidates (candidates:list)
  "Insert a list of candidates"
  ;; Using the above defined `insert-candidate` to bulk-insert a list of candidates
  (map (insert-candidate) candidates)
)
```

Inserting a new candidate is an "admin-only" operation and we reused the already defined `GOVERNANCE` capability to guard it.

We have now esentially completed our module. All the required functionality is implemented.

When a module is deployed, the tables that it defines need to be created. This is done using the `create-table` function. Insert the snippet below after the module's closing parenthesis:

```clojure
;; election.pact

;; Read the `upgrade` key from transaction data
(if (read-msg "upgrade")
  ;; If its value is true, it means we're upgrading the module
  ["upgrade"]
  ;; Otherwise, the transaction is deploying the module and we need to create the tables
  [
    (create-table candidates)
    (create-table votes)
  ]
)
```

:::info
 Code outside the module will be called when the module is loaded the first time, when its deployed or upgraded. In the snippet above we are checking if the `upgrade` key that comes from transaction data is `true` and only execute the `create-table` calls if it's not since we cannot recreate tables when upgrading a module.
:::

You can find the complete source code of the `election.pact` contract [here]. TODO: Insert repo link

It's time to summarize what we've learned so far:
* we can use Pact capabilities to protect certain features of our smart contract
* dynamic data is stored in tables, it's accessed using a key and we should design our tables in such way that
we can retrieve the information using a single row query.
* we can validate the owner of an account by executing its guard

These are general concepts that you should keep in mind when you develop Pact smart contracts.

### Testing the contract

We wrote quite a bit of code but at this point we don't know if it's working correctly. A critical step in smart-contract development process is writing a proper set of tests which is what we're going to focus on now.

:::tip
  We separated writing functionality and writing tests to make it easier to follow this tutorial but in a real-world scenario you should work on these in parallel.
:::

We're going to start by setting up the environment data that we need for our tests, load the required modules, i.e. `coin` module and of our `election` module and create some KDA accounts that we will use to vote later on.

Open the `election.repl` file and copy the snippet below:

```clojure
;; election.repl

;; begin-tx and commit-tx simulate a transaction
(begin-tx "Load modules")

;; set transaction JSON data
(env-data {
  ;; Here we set the required keysets.
  ;; Note:
  ;; - in a real transaction, `admin-key` would be a public key
  ;; - "keys-all" is a built-in predicate that specifies all keys are needed to sign a tx,
  ;;   in this case we only set one key
  'election-admin-keyset: { "keys": ["admin-key"], "pred": "keys-all" },
  'alice-keyset: { "keys": ["alice-key"], "pred": "keys-all" },
  'bob-keyset: { "keys": ["bob-key"], "pred": "keys-all" },

  ;; Upgrade key is set to false because we are deploying the modules
  'upgrade: false
})

;; load fungible-v2 interface
(load "root/fungible-v2.pact")

;; load fungible-xchain-v1 interace
(load "root/fungible-xchain-v1.pact")

;; load coin module
(load "root/coin-v4.pact")

;; load election module
(load "election.pact")

;; commit the transaction
(commit-tx)

(begin-tx "Create KDA accounts")

;; create "alice" KDA account
(coin.create-account "alice" (read-keyset "alice-keyset"))
;; create "bob" KDA account
(coin.create-account "bob" (read-keyset "bob-keyset"))

(commit-tx)
```

Now that this initial setup is done, we can go on and write some tests. Notice that we did not add any candidates just yet so any attempt to vote at this point should fail. Let's try it:

```clojure
;; election.repl

(begin-tx "Vote for non-existing candidate")

;; set the key signing this transaction, `alice-key`
;; setting `caps` as an empty array translates into `unrestricted mode`, meaning our keyset
;; can be used to sign anything, it's not restricted to a specific set of capabilities
(env-sigs [{ "key": "alice-key", "caps": []}])
;; this test passes because the election.vote call fails
(expect-failure "Can't vote for a non-existing candidate" (election.vote "alice" "5"))

(commit-tx)
```

In the snippet above we've learned that we can use `expect-failure` to test that an expression will fail and that we can configure the keys and capabilities signing a transaction using `env-sigs`.

:::note REPL-Only Functions
`expect-failure` and `env-sigs` are two of the many REPL-only functions that we can use in `.repl` files to test Pact smart-contracts by simulating blockchain environment. You can check the [complete list of REPL-only functions](https://pact-language.readthedocs.io/en/latest/pact-functions.html#repl-only-functions) in the Pact official documentation.
:::

Next we're going to add some candidates and check if their number of votes is correctly initialized.

```
;; election.repl

(begin-tx "Add candidates")

;; Call `insert-candidates` to add 3 candidates
(election.insert-candidates [{ "key": "1", "name": "Candidate A" } { "key": "2", "name": "Candidate B" } { "key": "3", "name": "Candidate B" }])

;; test if votes count for candidate "1" is initialized with 0
(expect "votes for Candidate A initialized" (election.get-votes "1") 0)

;; test if votes count for candidate "2" is initialized with 0
(expect "votes for Candidate B initialized" (election.get-votes "2") 0)

;; test if votes count for candidate "3" is initialized with 0
(expect "votes for Candidate C initialized" (election.get-votes "3") 0)

(commit-tx)
```

We can use `expect` function to test that any 2 expressions value is equal, in this case we checked if `get-votes` returns 0 for each candidate.

Moving on, we want to validate that votes are correctly recorded, the `VOTED` event is emitted and double-voting is not allowed.

```
;; election.repl

(begin-tx)
(use election)
;; we set the key signing this tx and the capabilities that can be signed
;; coin.GAS is a capability that allows gas payments, we will talk more about gas and gas stations in the
;; next section
;; election.ACCOUNT-OWNER is the capability we implemented that validates the owner of the KDA account
(env-sigs [{ "key": "alice-key", "caps": [(coin.GAS), (election.ACCOUNT-OWNER "alice")]}])

;; test if votes count for candidate "1" is correctly increased by 1
;; 1. Retrieve the number of votes
(let ((count (get-votes "1")))
  ;; 2. Vote
  (vote "alice" "1")
  ;; 3. Check if the vote was correctly recorded
  (expect "votes count is increased by 1" (get-votes "1") (+ count 1)))

;; Test if the `VOTED` event with parameter "1" was emitted in this transaction
(expect "voted event"
  [ { "name": "election.VOTED", "params": ["1"], "module-hash": (at 'hash (describe-module "election"))}]
  (env-events true))

;; execute the same test using a different account
(env-sigs [{ "key": "bob-key", "caps": [(coin.GAS), (election.ACCOUNT-OWNER "bob")]}]}])
;; test if votes count for candidate "2" is correctly increased by 1
(let ((count (get-votes "2")))
  (vote "bob" "2")
  (expect "votes count is increased by 1" (get-votes "2") (+ count 1)))

(expect "voted event"
  [ { "name": "election.VOTED",
      "params": ["2"],
      "module-hash": (at 'hash (describe-module "election"))
    }
  ]
  (env-events true))

;; test that bob's attempt to vote twice fails
(expect-failure "Double voting not allowed" (vote "bob" "1"))

(commit-tx)
```

Notice the `let` construct that we used above, it is helpful when you need to bind some variables to be in the same scope as other logic that uses them. In our case we first loaded the number of votes and binded the result to `count` variable which we compared with the new count after submitting a vote. Feel free to read more about [`let` and `let*`](https://pact-language.readthedocs.io/en/latest/pact-reference.html#let) in Pact official documentation.

:::info Write a test
Can you think of some cases that we didn't cover? Hint: ACCOUNT-OWNER.

Try to write a test that validates that only the correct owner of an account can vote.
:::

The only thing left is to run these tests and confirm everything is working:

```clojure
$ pact
pact> (load "election.repl")
```

:::tip
The REPL preserves state between subsequent runs unless the optional parameter `reset` is set to true `(load "election.repl" true)`.
:::

Let's recap what we've learned in this section:
* we can test Pact smart-contracts using `.repl` scripts that simulate blockchain environment through a set of REPL-only functions
* before writing tests we need to make sure all required modules are loaded as well as KDA accounts are created if we need them
* we can test functions returned values, emitted events, failure scenarios (and much more that we couldn't cover)

## Implementing the Gas Station

A unique feature of Kadena is the ability to allow gas to be paid by a different entity than the one who initiated the transaction. This entity is what we call a *gas station*.

:::info
**Gas** is the cost necessary to perform a transaction on the network. Gas is paid to miners and its price varies based on supply and demand. It's a critical piece of the puzzle, but at the same time it brings up a UX problem. Every user needs to be aware of what gas is as well as how much gas they need to pay for their transaction. This causes significant friction and a less than ideal experience.

To help mitigate this problem Kadena brings an innovation to the game. Hello [gas stations](https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836)!

Gas stations are a way for dApps to subsidize gas costs for their users. This means that your user doesn't need to know what gas is or how much the gas price is, which translates into a smooth experience when interacting with your dApp.
:::

In our voting app this will allow users to submit votes without paying for gas, instead gas will be subsidized by the gas station. In short, this means that miners will still be paid, but our users can vote for free.

The standard for gas station implementation is defined by the `gas-payer-v1` interface. The `gas-payer-v1` interface is deployed to all chains on `testnet` and `mainnet` so you can directly use it in your contract. We can specify that a module implements an interface using the `(implements INTERFACE)` construct.

:::info

Pact interfaces are similar to Java's interfaces, Scala's traits, Haskell's typeclasses or Solidity's interfaces.
If you're not familiar with this concept you can [read more about it](https://pact-language.readthedocs.io/en/latest/pact-reference.html#interfaces) in Pact reference.

:::

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

:::tip

`@doc` is a metadata field used to provide documentation and `@model` is used by Pact tooling to verify the correctness of the implementation. You can [read more about docs and metadata](https://pact-language.readthedocs.io/en/stable/pact-reference.html?highlight=doc#docs-and-metadata) in Pact reference.

:::

Our module needs to implement all the functions and capabilities defined by the `gas-payer-v1` interface:
* `GAS_PAYER` capability
* `create-gas-payer-guard` function

A gas station allows someone to debit from a coin account that they do not own, gas station account, to pay the gas fee for a transaction under certain conditions. How exactly that happens, let's see below.

Create a new file `election-gas-station.pact` and paste the following snippet:

```clojure
;; election-gas-station.pact

(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    "Only admin can update the smart contract"
    (enforce-keyset 'election-admin-keyset))

  ; Signal that the module implements the gas-payer-v1 interface
  (implements gas-payer-v1)

  ; Import the coin module, we need it to create a KDA account that will be controlled
  ; by the gas station
  (use coin)
)
```

Next we will implement the `gas-payer-v1` interface. We don't want to let users abuse our gas station so we'll have to add a limit for the maximum gas price we're willing to pay or make sure it can only be used to pay for transactions that are calling the `election` module. Let's get to it:

```clojure
(defun chain-gas-price ()
  "Return gas price from chain-data"
  ; chain-data is a built-in function that returns tx public metadata
  ; we are using it to retrieve the tx gas price
  (at 'gas-price (chain-data)))

(defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
  (enforce (<= (chain-gas-price) gasPrice)
    (format "Gas Price must be smaller than or equal to {}" [gasPrice])))

(defcap GAS_PAYER:bool
  ( user:string
    limit:integer
    price:decimal
  )

  ; There are 2 types of Pact transactions: exec and cont
  ; `cont` is used for multi-step pacts, `exec` is for regular transactions.
  ; In our case transaction has to be of type `exec`.
  (enforce (= "exec" (at "tx-type" (read-msg))) "Inside an exec")

  ; A Pact transaction can have multiple function calls, but we only want to allow one
  (enforce (= 1 (length (at "exec-code" (read-msg)))) "Tx of only one pact function")

  ; Gas station can only be used to pay for gas consumed by functions defined in `free-election` module
  (enforce
    ; We take the first 15 characters and compare it with `(free.election`
    ; to make sure a function from our module is called.
    ; `free` is the namespace where our module will be deployed.
    (= "(free.election." (take 15 (at 0 (at "exec-code" (read-msg)))))
    "Only election module calls allowed")

  ;; Limit the gas price that the gas station can pay
  (enforce-below-or-at-gas-price 0.000001)

  ; Import the `ALLOW_GAS` capability
  (compose-capability (ALLOW_GAS))
)
```

To recap, the `GAS_PAYER` capability implementation performs a few checks and composes the `ALLOW_GAS` capability that we will define next. `chain-gas-price` and `enforce-below-or-at-gas-price` are helper functions to limit the gas price that our gas station is willing to pay.

```clojure

  (defcap ALLOW_GAS () true)

  (defun create-gas-payer-guard:guard ()
    (create-user-guard (gas-payer-guard))
  )

  (defun gas-payer-guard ()
    (require-capability (GAS))
    (require-capability (ALLOW_GAS))
  )

  (defconst GAS_STATION "election-gas-station")

  (defun init ()
    (coin.create-account GAS_STATION (create-gas-payer-guard))
  )
)

(if (read-msg 'upgrade)
  ["upgrade"]
  [
    (init)
  ]
)
```
First we define the `ALLOW_GAS` capability which is brought in scope by the `GAS_PAYER` capability through `compose-capability` function.

:::note
Composing capabilities allows for modular factoring of guard code, eg. an "outer" capability could be composed out of multiple "inner" capabilities. Also composed capabilities are only in scope when their parent capability is granted.
:::

Then we implement the `gas-payer-guard` function which tests if `GAS` (magic capability defined in coin contract) and `ALLOW_GAS` capabilities have been granted which are needed to be able to pay for gas fees. By composing `ALLOW_GAS` in `GAS_PAYER` we hide the implementation details of `GAS_PAYER` that `gas-payer-guard` function does not need to know about. This is then used in `create-gas-payer-guard` to create a special guard for the coin contract account from where the gas fees are paid.

Last thing we need is to create an account where the funds will be stored which is what happens in the `init` function. As you can see, the guard of that account is the guard returned by `create-gas-payer-guard`, essentially allowing access to the account as long as `GAS` and `ALLOW_GAS` capabilities have already been granted.

To summarize, a gas station is a coin account with a special guard that's valid if both `GAS` and `ALLOW_GAS` capabilities are granted. If you're wondering how `GAS_PAYER` is granted, the answer is [signature capabilities](https://pact-language.readthedocs.io/en/latest/pact-reference.html#signature-capabilities). We will see how this works in the [frontend](#frontend) section of this tutorial where we interact with the smart contracts.

:::info
Guards and capabilities are an entire topic that we cannot cover in detail in this tutorial. To learn more check the [Guards, Capabilities and Events](https://pact-language.readthedocs.io/en/latest/pact-reference.html#guards-capabilities-and-events) section of the Pact documentation.
:::

## Deploying to Chainweb

In order to deploy our contracts to the real blockchain network, wether it's testnet or mainnet we need to pay for the transaction using gas fees.

We also need a key/pair to create an account so let's generate one by running `pact -g` in your terminal or by using the `Pact.crypto.genKeyPair()` method available in the `pact-lang-api` lib.

Next step is to fund your `testnet` account using this [faucet](http://faucet.testnet.chainweb.com). You will receive 20 testnet KDA.

:::note Namespaces & Modules Names

Each module or interface needs to be part of a namespace. The `free` namespace is available to use on both `mainnet` and `testnet`.

To set the namespace of a module we have to use the `namespace` function. Insert the following line at the beginning of `election.pact` file:

```clojure
(namespace 'free)
```

Within the same namespace, each module name needs to be unique, similar requirement for defined keysets.

Also when accessing a module's function we have to use the fully qualified name {namespace}.{module-name}.{function-name}, eg. `free.election.vote`.
You can [read more about namespaces] [here](https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=namespace#namespace-declaration).
:::

:::tip
Here's a snippet that you can use to list all deployed modules by using the top-level `list-modules` built-in function:

```javascript
const Pact = require('pact-lang-api');

const NETWORK_ID = 'testnet04';
const CHAIN_ID = '0';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const KEY_PAIR = Pact.crypto.genKeyPair();

const creationTime = () => Math.round((new Date).getTime() / 1000) - 15;

listModules();

async function listModules() {
  const cmd = {
    keyPairs: KEY_PAIR,
    pactCode: Pact.lang.mkExp('list-modules'),
    meta: Pact.lang.mkMeta("", "", 0.0001, 6000, creationTime(), 600)
  };
  const response = await Pact.fetch.local(cmd, API_HOST);
  console.log(response.result.data);
};
```
:::

You can use the snippets below to deploy your contract to **chain 1** on `testnet` and `mainnet`:

<Tabs>
  <TabItem value="testnet" label="Testnet">

  ```js
  const Pact = require('pact-lang-api');
  const fs = require('fs');

  const NETWORK_ID = 'testnet04';
  const CHAIN_ID = '1';
  const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
  const CONTRACT_PATH = './pact/election.pact';
  const KEY_PAIR = {
    'publicKey': 'some-public-key',
    'secretKey': 'some-private-key'
  }

  const pactCode = fs.readFileSync(CONTRACT_PATH, 'utf8');
  const creationTime = () => Math.round((new Date).getTime() / 1000);

  deployContract(pactCode);

  async function deployContract(pactCode) {
    const cmd = {
      networkId: NETWORK_ID,
      keyPairs: KEY_PAIR,
      pactCode: pactCode,
      envData: {
        'election-admin-keyset': [KEY_PAIR['publicKey']],
        'upgrade': false
      },
      meta: {
        creationTime: creationTime(),
        ttl: 28000,
        gasLimit: 65000,
        chainId: CHAIN_ID,
        gasPrice: 0.000001,
        sender: KEY_PAIR.publicKey // the account paying for gas
      }
    };
    const response = await Pact.fetch.send(cmd, API_HOST);
    console.log(response);
    const txResult = await Pact.fetch.listen({ listen: response.requestKeys[0] }, API_HOST);
    console.log(txResult);
  };
  ```
  </TabItem>

  <TabItem value="mainnet" label="Mainnet">

  ```js
  const Pact = require('pact-lang-api');
  const fs = require('fs');

  const NETWORK_ID = 'mainnet01';
  const CHAIN_ID = '1';
  const API_HOST = `https://api.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
  const CONTRACT_PATH = './pact/election.pact';
  const KEY_PAIR = {
    'publicKey': 'some-public-key',
    'secretKey': 'some-private-key'
  }

  const pactCode = fs.readFileSync(CONTRACT_PATH, 'utf8');
  const creationTime = () => Math.round((new Date).getTime() / 1000);

  deployContract(pactCode);

  async function deployContract(pactCode) {
    const cmd = {
      networkId: NETWORK_ID,
      keyPairs: KEY_PAIR,
      pactCode: pactCode,
      envData: {
        'election-admin-keyset': [KEY_PAIR['publicKey']],
        'upgrade': false
      },
      meta: {
        creationTime: creationTime(),
        ttl: 28000,
        gasLimit: 65000,
        chainId: CHAIN_ID,
        gasPrice: 0.000001,
        sender: KEY_PAIR.publicKey // the account paying for gas
      }
    };
    const response = await Pact.fetch.send(cmd, API_HOST);
    console.log(response);
    const txResult = await Pact.fetch.listen({ listen: response.requestKeys[0] }, API_HOST);
    console.log(txResult);
  };
  ```

  </TabItem>
</Tabs>

:::info
In order to pay transaction fees on `mainnet` you will have to fund your account with real KDA.
:::

## Frontend

If you made it until here, congrats! We wrote, tested and deployed our smart contract but we're still missing a key component, a UI for users to interact with our dApp, so let's get this done.

Start by adding [Pact-Lang-API](http://github.com/kadena-io/pact-lang-api) as a dependency to your project either via CDN or add it to your asset pipeline similar to any other Javascript library.

```js
<script src="https://cdn.jsdelivr.net/npm/pact-lang-api@4.1.2/pact-lang-api-global.min.js"></script>
```

```bash
npm install pact-lang-api
```

:::note
In this tutorial we're using [ReactJS](https://reactjs.org) but you are free to use any framework that you are comfortable with. The main focus will be on blockchain and wallet interaction.
:::

There are a few key aspects concerning a frontend implementation of a blockchain application:
* reading data from smart contracts
* allowing users to sign and submit transactions
* notify users when various actions take place like a transaction being mined or a smart contract event was emitted

### Read Data

For this demo application we would like to display the number of votes that each candidate received. To do that we have to call the `get-votes` function from our `election` module.
Here's how that looks like:

```js
import Pact from 'pact-lang-api';

const GAS_PRICE = 0.0000001;
const GAS_LIMIT = 400;
const TTL = 28000;
const NETWORK_ID = 'testnet04';
const API_HOST = `https://api.testnet.chainweb.com/chainweb/0.0/${NETWORK_ID}/chain/${CHAIN_ID}/pact`;
const GAS_STATION='election-gas-station';
export const CHAIN_ID = '1';

const creationTime = () => Math.round((new Date).getTime() / 1000) - 15;

export const get-votes = async (candidate) => {
  const cmd = {
    pactCode: `(free.election.get-votes "${candidate}")`,
    meta: {
      creationTime: creationTime(),
      ttl: TTL,
      gasLimit: GAS_LIMIT,
      chainId: CHAIN_ID,
      gasPrice: GAS_PRICE,
      // IMPORTANT: the API requires this attribute even if it's an empty value like in this case
      sender: ''
    }
  };
  return Pact.fetch.local(cmd, API_HOST);
}
```
We're sending a command to the `/local` endpoint where the `pactCode` attribute is a call to our module function which returns the number of votes for the given candidate.

:::note
Remember to always use the fully qualified name, *namespace.module.function*.
:::

Here's a screenshot from our demo app where we display the candidates and the number of votes received by each candidate:

![Election dApp](/img/docs/voting-dapp/election-dapp-1.png)

### Sign & Send Transaction

The next step is to allow users to vote for a candidate. When it comes to updating on-chain data, each dApp has to implement the following flow:
1. Create transaction
2. Sign transaction
3. Send transaction
4. Notify when transaction is mined

:::info
In this tutorial we are using Chainweaver wallet to sign transactions, other wallets might have a different API but the steps mentioned above are similar. There might be the case where a wallet takes care of more than signing a transaction (eg. it also sends it to the network) and you will have to adapt your implementation accordingly.
:::

Here's a diagram of the above:

![kadena-frontend-dapp-arch](/img/docs/voting-dapp/kadena-frontend-dapp-arch.001.jpeg)

**pact-lang-api** provides a couple of useful methods here: `Pact.wallet.sign` to interact with the Chainweaver signing API and `Pact.wallet.sendSigned` to submit the signed transaction to the network.

In the snippet below we are constructing a transaction that calls the `free.election.vote` contract function to vote for a candidate.

```js
export const signTx = async (account, candidateId) => {
  const cmd = {
    networkId: NETWORK_ID,
    pactCode: `(free.election.vote "${account}" "${candidateId}")`,
    caps: [
      Pact.lang.mkCap("Gas payer", "Capability to allow gas payment by gas station", "free.election-gas-station.GAS_PAYER", ["", { int: 1 }, 1.0]),
      Pact.lang.mkCap("Account Owner", "Capability to validate KDA account ownership", "free.election.ACCOUNT-OWNER", [account])
    ],
    creationTime: creationTime(),
    ttl: TTL,
    gasLimit: GAS_LIMIT,
    chainId: CHAIN_ID,
    gasPrice: GAS_PRICE,
    sender: GAS_STATION,
  };
  return Pact.wallet.sign(cmd);
}

export const sendTx = async (signedCmd) => {
    return Pact.wallet.sendSigned(signedCmd, API_HOST);
}

export const listenTx = async (requestKey) => {
    return Pact.fetch.listen({ listen: requestKey }, API_HOST);
}
```

Notice the `caps` attribute where we define the capabilities that the user's keyset will have to sign using the `Pact.lang.mkCap` helper method. In this case we have two:
* `free.election.ACCOUNT-OWNER` -> checks if the user is the owner of the KDA account
* `free.election-gas-station.GAS_PAYER` -> enables the payment of gas fees by the gas station that we deployed

:::note Scoping signatures
Keep in mind, for security reasons a keyset should only sign specific capabilities and using a keyset in "unrestricted mode" is not recommended. Scoping the signature allows the signer to safely call untrusted code which is an important security feature of Pact and Kadena.

"Unrestricted mode" means that we do not define any capabilities when creating a transaction.
:::

:::note
When reading values from a JSON, Pact converts numbers to `decimal` type but the second parameter of the `GAS_PAYER` capability requires an integer so we have to force the correct type using this approach: `{ int: 1 }`.
:::

Since this is a transaction that requires gas fees, we now set `sender` (account paying for gas) to the name of the KDA account owned by our gas station.

Lastly, to get the result of a transaction we are using the `Pact.fetch.listen` method.

Going back to the UI, we implemented this signing flow using a modal window where users have to enter their KDA account and click on the **Sign Transaction** button which automatically opens the Chainweaver signing wizard.

![Election dApp Modal](/img/docs/voting-dapp/election-dapp-2.png)

Below is the first step of the Chainweaver request signing wizard:

![Chainweaver Sign Wizard](/img/docs/voting-dapp/election-dapp-3.png)

Once the transaction is signed, clicking on **Send Transaction** button in our dApp modal window will submit it to the network.

The request key together with the transaction result are displayed as notifications in the right side of the screen as the promises complete.

*Note: Since mining is an external process, while waiting for our transaction to be included in the blockchain, the user should be able to keep using the application freely.*

![Notifications](/img/docs/voting-dapp/election-dapp-4.png)

## Conclusion

It took a while but we are now at the end of this tutorial. Congratulations! You've managed to implement a complete dApp on Kadena blockchain and we hope you found this guide useful.

Stay tuned for more tutorials and we cannot wait to see what dApps **YOU** will build next!
