---
title: dApp Tutorial
description: Build a complete dApp on Kadena
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Building a voting dApp

In its most basic form, Kadena blockchain is a digital ledger. This ledger is never stored, but rather exists on the “chain” supported by thousands of nodes simultaneously. Thanks to encryption and decentralization, Kadena blockchain’s database of transactions is incorruptible, and each record is easily verifiable. The network cannot be taken down or influenced by a single party because it doesn’t exist in one place.

Blockchain can solve the many problems discovered in these early attempts at online voting. A blockchain-based voting application does not concern itself with the security of its Internet connection, because any hacker with access to the terminal will not be able to affect other nodes. Voters can effectively submit their vote without revealing their identity or political preferences to the public. Officials can count votes with absolute certainty, knowing that each ID can be attributed to one vote, no fakes can be created, and that tampering is impossible.

---

## Overview

In this tutorial we will be building a voting application on the Kadena blockchain. The application will consist of three distinct layers:

1. Smart contract (back-end)
2. Web app (front-end)
3. Gas Station

## Environment Setup

### Install Pact

#### Mac

  ```bash
  brew update
  brew install kadena-io/pact/pact
  ```

#### Linux
  * Using **nix**

  To build with **Nix** follow the setup instructions [here](https://github.com/kadena-io/pact/wiki/Building-Kadena-Projects).
  Once the build is finished, you can run Pact with the following command:

  `./result/ghc/pact/bin/pact`

  For other options to build from source please refer to [this section](https://github.com/kadena-io/pact#building-from-source).

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

```bash
mkdir election-dapp && cd election-dapp
mkdir pact
mkdir src
```

### Atom IDE (Optional)

You can use any text editor to write Pact but if you prefer the benefits of an IDE, "language-pact" is a package for [Atom](https://atom.io) that provides syntax highlighting and linting.

To install it, go to `Preferences -> Packages -> Type "language-pact"` and click the `Install` button.

![atom-language-pact](/img/docs/voting-dapp/atom-language-pact.png)

## Smart Contracts

Our voting app will allow you to submit a vote while preventing an address to vote more than once.
Additionally we will use a *gas station* to fund the gas fees for interacting with our contract, meaning our users don't have to worry about paying for gas.

:::info
**Gas** is the cost necessary to perform a transaction on the network. Gas is paid to miners and its price varies based on supply and demand. It's a critical piece of the puzzle, but at the same time it brings up a UX problem. Every user needs to be aware of what gas is as well as how much gas they need to pay for their transaction. This causes significant friction and a less than ideal experience.

To help mitigate this problem Kadena brings an innovation to the game. Hello [gas stations](https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836)!

Gas stations are a way for dApps to subsidize gas costs for their users. This means that your user doesn't need to know what gas is or how much the gas price is, which translates into a smooth experience when interacting with your dApp.
:::

### Voting

A typical developer workflow looks like this:

1. Write contract code in `.pact` files
2. Write tests in `.repl` files
3. Execute your tests in the repl
4. Deploy to local pact server
5. Deploy to testnet

In this section we will be focusing on steps 1-3 and later deploy to local pact server and testnet.

Assuming you are still in your project directory, let's create the `election.pact` and `election.repl` files:

```clojure
touch pact/election.pact pact/election.repl
```

Remember, `election.pact` is the contract source code while in `election.repl` we'll write tests.

We will also need the `coin` contract which requires the `fungible-v2` interface for our tests. You can get the latest `coin-v3` [here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v3/coin-v3.pact) and `fungible-v2` [here](https://github.com/kadena-io/chainweb-node/blob/master/pact/coin-contract/v2/fungible-v2.pact). Add these to your project in the following directory: `pact/root/`.

We are now set to start implementing our contract, so let's copy the following code in the `election.pact` file:

```clojure
(define-keyset 'election-admin-keyset)

(module election GOVERNANCE
  "Election demo module"

  (defcap GOVERNANCE ()
    "Only admin can update this module"
    (enforce-keyset 'election-admin-keyset))

  (defun vote (key:string)
    "Submit a new vote"
    (format "Voted {}!" [key]))
)

(vote "A")
```

In this snippet we defined a module named `election` that includes a `vote` function which simply displays its parameter value as part of a formatter string.

You can also notice the `GOVERNANCE` keyword next to the module name and the capability with the same name defined below. It is called *module governance capability* and it can be as simple as our example, enforcing a keyset or more complex like tallying a stakeholder vote on an upgrade hash.

:::note
Module names and keyset definitions are required to be unique. We will mention this again when we get to deploy our contract to testnet.
:::

We've got some code written, now let's test it. Copy the code below in the `election.repl` file:

```clojure
;; begin a transaction
(begin-tx)
;; set transaction signature key to my-key
(env-keys ["admin-key"])

;; Add the election-admin-keyset to environment data
(env-data {
  'election-admin-keyset: { "keys": ["admin-key"], "pred": "keys-all" }
})
;; load election.pact into the REPL
(load "election.pact")
;; commit the transaction
(commit-tx)
```

:::info
`begin-tx`, `env-keys`, `env-data` are "repl-only" functions, they are automatically loaded in the REPL to help simulate blockchain environment but they are not available for blockchain-based execution. You can find the complete "REPL-only" functions list [here](https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=repl%20only#repl-only-functions).
:::

:::info
Each Pact transaction is submitted with raw JSON data that can be read by functions like `read-msg`. In REPL scripts we are using `env-data` to attach any data to this JSON, including keysets which are then read with `read-keyset`.
:::

Run the script in your terminal:
```clojure
$ pact
pact> (load "election.repl")
```
The output should be similar to the one below:
```clojure
"Loading election.repl..."
"Begin Tx 0"
"Setting transaction keys"
"Setting transaction data"
"Loading election.pact..."
"Keyset defined"
"Loaded module election, hash jOBJiSEH5HVsAmLNSdHq_D3Kl6TkFpCJcEWPtJD86Gc"
"Voted A!"
"Commit Tx 0"
```

Pact smart contracts store data in tables so let's define the ones that we need for our voting contract. Copy the code below after the governance capability definition:

```clojure
  (defschema candidates-schema
    "Candidates table schema"
    name:string
    votes:integer)

  (defschema votes-schema
    "Votes table schema"
    cid:string
  )

  (deftable votes:{votes-schema})

  (deftable candidates:{candidates-schema})
  ```
What we did here:
* `defschema candidates-schema` -> defines the schema for our **candidates** table where we will keep track of the candidates that users can vote for
* `defschema votes-schema` -> defines the schema for our **votes** table where we will store each vote
* `deftable votes:{votes-schema}` -> defines the `votes` table that will use the schema defined above
* `deftable candidates:{candidates-schema}` -> defines the `candidates` table that will use the schema defined above

:::note
Pact implements a key-row model which means a row is accessed by a single key. It is our responsibility as developers to design the schema in a way that we can retrieve the information that we need using a single row query. Multiple row queries are very expensive and shoud not be used.

The row key is always a simple string, to not be confused with the cryptographic keys used for signing transaction.
:::

Since we have defined our data storage, we can now implement the `vote` function:

```clojure
  ; import coin.details function
  (use coin [ details ])

  (defcap ACCOUNT-OWNER (account:string)
    "Make sure the requester owns the KDA account"
    (enforce-guard (at 'guard (coin.details account)))
  )

  (defun user-voted:bool (account:string)
    "Check if a user already voted"

    (with-default-read votes account
      { "cid": "" }
      { "cid":= cid }
      (> (length cid) 0))
  )

  (defun candidate-exists:bool (cid:string)
    "Check if a candidate exists"

    (with-default-read candidates cid
      { "name": "" }
      { "name" := name }
      (> (length name) 0))

  (defun vote-protected (account:string candidateId:string)
    (require-capability (ACCOUNT-OWNER account))

    (with-read candidates candidateId { "votes" := votesCount }
      (update candidates candidateId { "votes": (+ votesCount 1) })
      (insert votes account { "cid": candidateId })
      (emit-event (VOTED candidateId))
    )
  )

  (defun vote (account:string cid:string)
    "Submit a new vote"

    (let ((double-vote (user-voted account)))
      (enforce (= double-vote false) "Multiple voting not allowed"))

    (let ((exists (candidate-exists cid)))
      (enforce (= exists true) "Candidate doesn't exist"))

    (with-capability (ACCOUNT-OWNER account)
      (vote-protected account cid))

    (format "Voted for candidate {}!" [cid])
  )
```

Quite a lot happening here but don't worry we'll explain everything:
* to prevent double voting, we have to check if the user already voted which we are doing through `user-voted` function and we `enforce` it returns `false`
* to prevent voting for a candidate that doesn't exist we implemented `candidate-exists` function and we `enforce` it returns `true`
* we are trying to acquire the `ACCOUNT-OWNER` capability which checks that the transaction owner is also the owner of the KDA account provided as parameter to our `vote` function.
* while the `ACCOUNT-OWNER` capability is in scope we are calling `vote-protected` which is the function that updates the database. First it checks that we already have the capability (this means the function cannot be called directly) then proceed to update the votes of a candidate and record the vote in the votes table. At the end we emit the `VOTED` event which is useful for our frontend to update itself in real-time by listening to this event.

:::tip
Spend a bit of time understanding the `vote` function implementation before moving forward.
:::

Now that we can record votes, we also need to read them:

```clojure
(defun get-votes:integer (cid:string)
  "Get the votes count by cid"
  (at 'votes (read candidates cid ['votes]))
)
```

Last thing on the list is adding candidates:

```clojure
(defun insert-candidate (candidate)
  "Insert a new candidate, admin operation"
  (with-capability (GOVERNANCE)
    (let ((name (at 'name candidate)))
    (insert candidates (at 'key candidate) { "name": (at 'name candidate), "votes": 0 })))
)

(defun insert-candidates (candidates:list)
  (map (insert-candidate) candidates)
)
```

Inserting a new candidate is an "admin-only" operation and we reused the already defined `GOVERNANCE` capability to enforce this.

With this we have esentially completed our module. All the required functionality is implemented.

When a module is deployed, the tables that it defines need to be created. This is done through `create-table` function. Insert the snippet below after the module's closing parenthesis:

```clojure
(if (read-msg "upgrade")
  ["upgrade"]
  [
    (create-table candidates)
    (create-table votes)
  ]
)
```

:::info
 Code outside the module will be called when the module is loaded the first time, when its deployed or upgraded. In the snippet above we are checking if the `upgrade` key that comes from transaction data is `true` and only execute the `create-table` calls if it's not since we cannot recreate tables when upgrading a module.
:::

:::tip
You can find the source code of the `election.pact` contract [here]. TODO: Insert repo link
:::

We have written our contract but our work is not done yet. We need tests to validate that the functionality is correct. Clear the contents of the `election.repl` file and copy the following snippet:

```clojure
;; begin a transaction
(begin-tx)
(env-data {
  ;; set environment data to the admin-keyset with keys admin-key and predicate function of keys-all
  'election-admin-keyset: { "keys": ["admin-key"], "pred": "keys-all" },
  'alice-keyset: { "keys": ["alice-key"], "pred": "keys-all" },
  'bob-keyset: { "keys": ["bob-key"], "pred": "keys-all" },
  'upgrade: false
})

;; load fungible-v2 interface required by coin module
(load "root/fungible-v2.pact")
;; load coin module
(load "root/coin-v3.pact")
;; load election module
(load "election.pact")
;; commit the transaction
(commit-tx)

(begin-tx)
;; create "alice" KDA account
(coin.create-account "alice" (read-keyset "alice-keyset"))
;; create "bob" KDA account
(coin.create-account "bob" (read-keyset "bob-keyset"))
(commit-tx)

(begin-tx)
;; import election module
(use election)
(env-sigs [{ "key": "alice-key", "caps": []}])
(expect-failure "Can't vote for a non-existing candidate" (vote "alice" "5"))
(commit-tx)
```

We are using `expect-failure` to test if `vote` correctly fails if we try to vote for a candidate that does not exist.

:::info
`expect` is one the functions that's only available in the REPL but there are many more, check them out <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#repl-only-functions">here</a>.
:::

And more tests:

```clojure
(begin-tx)
(use election)
;; test if votes count for candidate "1" is initialized with 0
(expect "votes for Candidate A initialized" (get-votes "1") 0)
;; test if votes count for candidate "2" is initialized with 0
(expect "votes for Candidate B initialized" (get-votes "2") 0)
(commit-tx)

(begin-tx)
(use election)
(env-sigs [{ "key": "alice-key", "caps": [(coin.GAS), (election.ACCOUNT-OWNER "alice")]}])

;; test if votes count for candidate "1" is correctly increased by 1
(let ((count (get-votes "1")))
  (vote "alice" "1")
  (expect "votes count is increased by 1" (get-votes "1") (+ count 1)))

(expect "voted event"
  [ { "name": "election.VOTED", "params": ["1"], "module-hash": (at 'hash (describe-module "election"))}]
  (env-events true))

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

(expect-failure "Double voting not allowed" (vote "bob" "1"))

(commit-tx)
```
Here we are testing that the `vote` function correctly increments the vote count and the `VOTED` event is emitted. We are also checking if we correctly handled the double voting scenario.

:::tip
Can you think of some cases that we didn't cover? Hint: ACCOUNT-OWNER

Try to write a test that validates that only the correct owner of an account can vote.
:::

 Notice the `let` construct which is helpful when you need to bind some variables to be in the same scope as some other logic that uses them. In our case we first loaded the number of votes and binded the result to `count` variable which we compared with the new count after submitting a vote. You can read more about `let` and `let*` <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#let"> here</a>.

Run those tests again to make sure everything works as expected:

```clojure
$ pact
pact> (load "election.repl")
```

:::info
The REPL preserves state between subsequent runs unless the optional parameter `reset` is set to true `(load "election.repl" true)`.
:::

### Gas Station

A unique feature of Kadena is the ability to allow gas to be paid by a different entity than the one who initiated the transaction. This entity is what we call a *gas station*.

 In our voting app this will allow users to submit votes without paying for gas, instead gas will be subsidized by the gas station.

The standard for gas station implementation is defined by the `gas-payer-v1` interface. The `gas-payer-v1` interface is deployed to all chains on `testnet` and `mainnet` so you can directly use it in your contract. We can specify that a module implements an interface using the `(implements INTERFACE)` construct.

:::info

Pact interfaces are similar to Java's interfaces, Scala's traits, Haskell's typeclasses or Solidity's interfaces.
If you're not familiar with this concept you can read more about it <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#interfaces">**here**</a>.

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

Our module needs to implement all the functions and capabilities defined by the `gas-payer-v1` interface:
* `GAS_PAYER` capability
* `create-gas-payer-guard` function

A gas station allows someone to debit from a coin account that they do not own, gas station account, to pay the gas fee for a transaction under certain conditions. How exactly that happens, let's see below.

Create a new file `election-gas-station.pact` and paste the following snippet:

```clojure
(module election-gas-station GOVERNANCE
  (defcap GOVERNANCE ()
    "Only admin account can update the smart contract"
    (enforce-keyset 'election-admin-keyset))

  ; Implement the gas-payer-v1 interface
  (implements gas-payer-v1)

  ; Import the coin module
  (use coin)
)
```

Now let's implement the `gas-payer-v1` interface:

```clojure
(defun chain-gas-price ()
  "Return gas price from chain-data"
  (at 'gas-price (chain-data)))

(defun enforce-below-or-at-gas-price:bool (gasPrice:decimal)
  (enforce (<= (chain-gas-price) gasPrice)
    (format "Gas Price must be smaller than or equal to {}" [gasPrice])))

(defcap GAS_PAYER:bool
  ( user:string
    limit:integer
    price:decimal
  )

  ;; Transaction has to be of type `exec`
  (enforce (= "exec" (at "tx-type" (read-msg))) "Inside an exec")

  (enforce (= 1 (length (at "exec-code" (read-msg)))) "Tx of only one pact function")

  ;; Gas station can only be used to pay for gas consumed by functions defined in `free-election` module
  (enforce
    (= "(free.election." (take 15 (at 0 (at "exec-code" (read-msg)))))
    "Only election module calls allowed")

  ;; Limit the gas price that the gas station can pay
  (enforce-below-or-at-gas-price 0.000001)

  (compose-capability (ALLOW_GAS))
)
```

The `GAS_PAYER` capability implementation performs a few checks and composes the `ALLOW_GAS` capability that we will define next. `chain-gas-price` and `enforce-below-or-at-gas-price` are helper functions to limit the gas price that our gas station is willing to pay.

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
First we define the `ALLOW_GAS` capability which is brought in scope by the `GAS_PAYER` capability.

Then we implement the `gas-payer-guard` function which tests if `GAS` (magic capability defined in coin contract) and `ALLOW_GAS` capabilities have been granted which are needed to be able to pay for gas fees. By composing `ALLOW_GAS` in `GAS_PAYER` we hide the implementation details of `GAS_PAYER` that `gas-payer-guard` function does not need to know about. This is then used in `create-gas-payer-guard` to create a special guard for the coin contract account from where the gas fees are paid.

Last thing we need is to create an account where the funds will be stored which is what happens in the `init` function. As you can see, the guard of that account is the guard returned by `create-gas-payer-guard`, essentially allowing access to the account as long as `GAS` and `ALLOW_GAS` capabilities have already been granted.

To recap, a gas station is a coin account with a special guard that's valid if both `GAS` and `ALLOW_GAS` capabilities are granted. If you're wondering how `GAS_PAYER` is granted, the answer is [signature capabilities](https://pact-language.readthedocs.io/en/latest/pact-reference.html#signature-capabilities). We will see how this works in the [frontend](#frontend) section of this tutorial where we interact with the smart contracts.

:::info
Guards and capabilities are an entire topic that we cannot cover in detail in this tutorial. To learn more check the [Guards, Capabilities and Events](https://pact-language.readthedocs.io/en/latest/pact-reference.html#guards-capabilities-and-events) section of the Pact documentation.
:::

## Testing

There are several ways you can test your smart contracts before going to mainnet. We recommend the following flow as best practice:

1. REPL scripts
2. Pact Server
3. Testnet

### REPL Scripts

REPL stands for read - eval - print - loop. This acronym refers to the idea that given a Pact file, a REPL file is responsible for reading, evaluating, printing, and looping through the code as needed to both run and provide the output of the Pact file. It allows us to quickly test the smart contracts that we're building.

We've already used the REPL earlier when we wrote tests in the `election.repl` file. I encourage you to have a look at the list of [REPL-only functions](https://pact-language.readthedocs.io/en/stable/pact-functions.html?highlight=repl-functions#repl-only-functions) and try them in your scripts, they offer a great way to quickly setup a feedback loop when you work on your contracts.

### Pact Server

Pact interpreter comes with a built-in local http server and SQLite DB which effectively simulates a single-node blockchain environment, with the same API supported by *Chainweb*, Kadena's scalable PoW blockchain.

Let's create a `config.yaml` file and the `log` directory for the pact http server:

```bash
touch config.yaml
mkdir log
```
Now copy the code below and save the file:

```yaml
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

And start the server by running the following command in your terminal:

```
$ pact -s config.yaml

2022/03/18-09:29:59 [PactService] INIT Initializing pact SQLLite
2022/03/18-09:29:59 [history] Persistence Enabled: log/commands.sqlite
2022/03/18-09:29:59 [api] starting on port 8080
2022/03/18-09:29:59 [PactService] INIT Creating Pact Schema
2022/03/18-09:29:59 [PactPersist] DDL createTable: TableId "SYS_usertables"
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: DataTable (TableId "SYS_usertables")
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: TxTable (TableId "SYS_usertables")
2022/03/18-09:29:59 [PactPersist] DDL createTable: TableId "SYS_keysets"
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: DataTable (TableId "SYS_keysets")
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: TxTable (TableId "SYS_keysets")
2022/03/18-09:29:59 [PactPersist] DDL createTable: TableId "SYS_modules"
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: DataTable (TableId "SYS_modules")
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: TxTable (TableId "SYS_modules")
2022/03/18-09:29:59 [PactPersist] DDL createTable: TableId "SYS_namespaces"
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: DataTable (TableId "SYS_namespaces")
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: TxTable (TableId "SYS_namespaces")
2022/03/18-09:29:59 [PactPersist] DDL createTable: TableId "SYS_pacts"
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: DataTable (TableId "SYS_pacts")
2022/03/18-09:29:59 [Persist-SQLite] DDL createTable: TxTable (TableId "SYS_pacts")
2022/03/18-09:29:59 [disk replay]: No replay found
```

There are several endpoints available that we can use to interact with the Pact server:

| Endpoint | Description |
| -------- | ----------- |
| /send   | Takes in cmd object and returns tx hash. |
| /listen | Takes in a hash and returns tx result. |
| /poll   | Similar to /listen but works with multiple hashes and returns multiple tx results.|
| /local  | Takes in cmd object with code that queries from blockchain. It performs a read-only operation without persisting changes and returns tx result. |

:::info
You can find detailed specifications of the above mentioned endpoints [here](https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=YAML#endpoints)
:::

There are 2 ways to interact with these endpoints:

**1. Pact Request Formatter and `curl`**

Create a new file `request.yaml` with the following content:

```
code: "(+ 1 2)"
data:
  name: Stuart
  language: Pact
keyPairs:
  - public: ba54b224d1924dd98403f5c751abdd10de6cd81b0121800bf7bdbdcfaec7388d
    secret: 8693e641ae2bbe9ea802c736f42027b03f86afe63cae315e7169c9c496c17332
```

Run the following command in your terminal to send the request to the `/local` endpoint:

```
pact -a request.yaml -l | curl -H "Content-Type: application/json" -d @- http://localhost:8080/api/v1/local
```

You should see an output similar to the one below:

```json
{ "gas":0,
  "result":{
    "status":"success","data":3
  },
  "reqKey":"Ice7sTvYu4fDekYFsfErhYPmjM1Q8C-MC4lOBWM4x-0","logs":"wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8",
  "metaData":null,
  "continuation":null,
  "txId":null
}
```

:::info
By default `-a` formats the YAML file into API requests for the `/send` endpoint. Adding the `-l` flag after the command formats the api request for the `/local` endpoint.
:::

I encourage you to try the other endpoints as well. The complete specs of the request file format are [here](https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=YAML#request-yaml-file-format).

#### 2. `pact-lang-api` Javascript library

We will be using this approach for our voting app so let's start by installing the lib:

```bash
npm install pact-lang-api
```

**Deploy Contract**

> Deploy a Pact smart contract to Pact Server

```javascript
const Pact = require('pact-lang-api');
const fs = require('fs');

const API_HOST = 'http://localhost:8080';
const CONTRACT_PATH = './pact/election.pact';
const KEY_PAIR = Pact.crypto.genKeyPair();

const pactCode = fs.readFileSync(CONTRACT_PATH, 'utf8');

deployContract(pactCode);

async function deployContract(pactCode) {
  const cmd = {
    keyPairs: KEY_PAIR,
    pactCode: pactCode,
    envData: {
      'election-admin-keyset': [KEY_PAIR['publicKey']],
      'upgrade': false
    }
  };
  const response = await Pact.fetch.send(cmd, API_HOST);
  const txResult = await Pact.fetch.listen({ listen: response.requestKeys[0] }, API_HOST);
  console.log(txResult);
};

```
Notice that we defined the `election-admin-keyset` which is required by our module guard and we set `upgrade` to "false" so our initialization functions are executed.
Run the snippet and you should see a success message like the one below:

```json
{
  gas: 0,
  result: {
    status: 'success',
    data: 'Loaded module election, hash niQoaBy1p4j4ifyozj26VvA2o8m5nyGCcLiSngXgcwA'
  },
  reqKey: 't7g2mAwbfvZdjPSoaLch2HQlS5H5Z4lvvloVGf2eG1Q',
  logs: 'yr3G_Fjatl8SavWruAusVcAt7OpYV8Gd0P4ge4euHaA',
  metaData: null,
  continuation: null,
  txId: 33
}
```

**Read State**
> Read data stored in the database using the `/local` endpoint

```javascript
const Pact = require('pact-lang-api');
const fs = require('fs');

const API_HOST = 'http://localhost:8080';
const KEY_PAIR = Pact.crypto.genKeyPair();

readState();

async function readState() {
  const cmd = {
    keyPairs: KEY_PAIR,
    pactCode: '(election.get-votes "1")'
  };
  const state = await Pact.fetch.local(cmd, API_HOST);
  console.log(state);
};
```
To call a contract function we add the corresponding Pact code under the `pactCode` key. In comparison, when we deployed the contract we sent the entire contract source code.

The returned result is `0` because we didn't submit any vote yet.

```json
{
  gas: 0,
  result: { status: 'success', data: 0 },
  reqKey: 'ebStUzTU6Nd08gLWofbyeFmGFebHw4x9P8gG0Zf1Sgk',
  logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
  metaData: null,
  continuation: null,
  txId: null
}
```

**Submit a vote**
> Since submitting a vote requires a database update, we are using the `/send` endpoint

```javascript
const Pact = require('pact-lang-api');
const fs = require('fs');

const API_HOST = 'http://localhost:8080';
const KEY_PAIR = Pact.crypto.genKeyPair();

submitVote();

async function submitVote() {
  const cmd = {
    keyPairs: KEY_PAIR,
    pactCode: '(election.vote "alice" "1")'
  };
  const response = await Pact.fetch.send(cmd, API_HOST);
  const txResult = await Pact.fetch.listen({ listen: response.requestKeys[0] }, API_HOST);
  console.log(txResult);
};
```

This time we are calling the `vote` function of our contract and we should see a message which confirms the vote was recorded:

```json
{
  gas: 0,
  result: { status: 'success', data: 'Voted for candidate "1" !' },
  reqKey: 'Zx4N95rKThx2WcVJP-INuoFeYvNwSzs5K-CatPYI0N8',
  logs: 'YK5ar4xVOe0q8SEeFdMF5FMpiq5QublFxpXx_IAmzU4',
  metaData: null,
  continuation: null,
  txId: 34
}
```

> Now you can submit a few more votes and check the result using the snippets provided above.

**Conclusion**

We demonstrated how you can make use of *Pact Server* and `pact-lang-api` library to simulate blockchain interaction on your local development machine. It's recommended that you test your contracts using *Pact Server* first since it provides a much faster feedback loop that you can use to quickly iterate and fix any bugs before you move to `testnet` and finally `mainnet`.

## Deploy Contract

In order to deploy our contract to the real blockchain network, wether it's testnet or mainnet we need to pay for the transaction using gas fees.

We also need a key/pair to create an account so let's generate one by running `pact -g` in your terminal or by using the `Pact.crypto.genKeyPair()` method available in the `pact-lang-api` lib.

Next step is to fund your `testnet` account using this [faucet](http://faucet.testnet.chainweb.com). You will receive 20 testnet KDA.

:::note
There are two more things that we need to keep in mind when we deploy to a real network:

**Namespaces**

Each module or interface needs to be part of a namespace. The `free` namespace is available to use on both `mainnet` and `testnet`.

To set the namespace of a module we have to use the `namespace` function. Insert the following line at the beginning of `election.pact` file:

```clojure
(namespace 'free)
```
**Unique module and keyset names**

Within the same namespace, each module name needs to be unique, similar requirement for defined keysets.

Also when accessing a module's function we have to use the fully qualified name {namespace}.{module-name}.{function-name}, eg. `free.election.vote`.
You can read more about namespaces [here](https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=namespace#namespace-declaration).
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

If you made it until here, congrats. We wrote, tested and deployed our smart contract but we're still missing a key component, a way for users to interact with our dApp, so let's get this done.

We've already introduced `pact-lang-api` in the [Pact Server](#2-pact-lang-api-javascript-library) section and it's the building block of any frontend application on Kadena.

Start by adding it as a dependency to your project either via CDN or add it to your asset pipeline similar to any other Javascript library.

```js
<script src="https://cdn.jsdelivr.net/npm/pact-lang-api@4.1.2/pact-lang-api-global.min.js"></script>
```

```bash
npm install pact-lang-api
```

:::note
In this tutorial we're using [ReactJS](https://reactjs.org) but you are free to use any framework that you are comfortable with. The main focus will be on blockchain and wallet interaction.
:::

The main aspects concerning a frontend implementation of a blockchain application are:
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
 >Remember to always use the fully qualified name, *namespace.module.function*.

Here's a screenshot from our demo app where we display the candidates and the number of votes received by each candidate:

![Election dApp](/img/docs/voting-dapp/election-dapp-1.png)

The source code is available here: //TODO -> Insert link to repo file

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

:::info
The complete source-code of this application is available here: TODO add repo link
:::

## Conclusion

It took a while but we are now at the end of this tutorial. Congratulations! You've managed to implement a complete dApp on Kadena blockchain and we hope you found this guide useful.

Stay tuned for more tutorials and we cannot wait to see what dApps **YOU** will build next!
