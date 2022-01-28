---
title: Kadena Quickstart
description: Learn Kadena’s core concepts & tools for development in 15 minutes
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

Learn Kadena’s core concepts & tools for development in 15 minutes.

---

## Welcome to the developer-friendly blockchain.

Building useful applications on a blockchain doesn’t have to be hard or expensive. This Developer Quickstart is designed to remove the friction from onboarding so that you can understand how to build with Kadena quickly and easily.

## Sign the Memory Wall

Engrave your name on the Kadena “Memory Wall” smart contract.

**What you will accomplish**

- Perform a real mainnet transaction
- View your transaction on the Block Explorer

### Step-by-step instructions

1. Go to [hello.chainweb.com](https://hello.chainweb.com)
2. Type your name, then submit
3. Wait for the transaction to be mined in a block
4. Upon success, click the Block Explorer link or go to explorer.chainweb.com to find your transaction under “Recent Transactions”

:::note Key takaway

Something hidden just allowed you to instantly interact with a real blockchain, yet you did not have to create an account or own tokens to pay the transaction’s gas. This is possible thanks to gas stations, an autonomous account that exists only to fund gas payments on behalf of other users under specific conditions. By having a gas station pay user onboarding costs, we remove the friction of acquiring tokens in advance of signup, which allows a user’s first interaction with a dApp to become as easy as filling out a web form.

:::s

### Additional Resources

- Read more about gas stations [here](https://medium.com/kadena-io/the-first-crypto-gas-station-is-now-on-kadenas-blockchain-6dc43b4b3836).
- [See the Smart Contract Code For Memory Wall](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/memory-wall)

## Install Chainweaver

Download Chainweaver, Kadena’s official wallet and developer workbench.

### What you will accomplish

- Setup a secure KDA wallet
- Get introduced to Kadenar's primary developer workbench & IDE

### Step-by-step instructions

1. Go to [kadena.io/chainweaver](https://kadena.io/chainweaver-tos/)
2. Download desktop version for macOS, Linux or Windows
3. Open Chainweaver and follow the 3-step process for creating a new wallet:

- Set password
- Record recovery phrase
- Verify recovery phrase

Detailed set-up instructions can be found in the [Chainweaver User Guide](chainweaver/chainweaver-user-guide).

:::note Key Takeaways

While many blockchains require a suite of tools to perform various tasks, Kadena’s Chainweaver is designed as a one-stop-shop for interacting with the blockchain.

As a cryptocurrency wallet, Chainweaver can:

• Deterministically generate multiple key pairs
• Configure and manage multiple accounts, each with custom access controls
• Send & receive KDA across any Kadena chain, and adjust gas preferences
• Watch the status of existing accounts (like an address book of known accounts)
• Change networks to interact with Mainnet, Testnet, or a custom network

As a development environment, Chainweaver can:

• Expose all the features available in the Pact smart contract language
• Perform common IDE functionality: code editor, automation tools, error messages
• Facilitate the testing of contracts with a REPL
• Preview results and deploy smart contracts to any Kadena network
• Display a list of example contracts
• View code and call functions from any deployed smart contract
• Automate transaction signing between dApps and accounts

:::

## Testnet Account Setup

Create and fund a Testnet account using the “Coin Faucet” smart contract

### What you will accomplish

- Create an account
- Get some testnet KDA coins

### Step-by-step instructions

1. In the Keys section of Chainweaver, copy your public key
2. Go to faucet.testnet.chainweb.com
3. Select “Create and fund new account”
4. In the “Public Key” field, enter your public key
5. In the “Account Name” field, enter some unique name.

:::note

For beginners it is recommended that you name your account after your public key. This is a standard convention in blockchain and may help to reduce confusion about which key is associated with your account.

:::

6. Select “Create and fund new account”
7. Wait about 30 seconds, then select “Check Request Status” to see the transaction confirmation message.

:::note Key Takeaway

Keys and Accounts are not the same thing. In brief, Keys sign transactions and Accounts may be governed by one or multiple keys.

With most blockchains, accounts are modeled as simply public/private keypairs. This one-to-one model keeps things simple, but runs into problems when account control requires a many-to-many model (such as with jointly owned or majority ruled accounts).

Kadena natively supports multiple keys governing the same account, and this dynamic account control allows developers to more easily construct governance models that satisfy their workflow requirements.

:::

### Additional Resources

- [See The Smart Contract Code For Coin Faucet](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/faucet)

## Pacty Parrots

Play “Pacty Parrots” game to see how dApps and wallets interact.

### What you will accomplish

- Sign a transaction
- See how dApps interact with wallets
- Win some coins! (maybe)

### Step-by-step instructions

1. Make sure Chainweaver is still open on your computer
2. Go to [pactyparrots.testnet.chainweb.com](http://pactyparrots.testnet.chainweb.com/)
3. Skim through the game rules, then enter the account name you recently created
4. Select “Start new round” to begin the game
5. When Chainweaver pops up you will be prompted with a signing request which has 3 parts:

- Configuration: Vew transaction info and adjust settings if desired
- Sign: Select your account name in each of the 3 “Grant Capabilities” fields
- Preview: You should see a Raw Response of “Write succeeded!” If so, select “Submit”

6. Watch the parrots dance and wait for your result.
7. Choose to “Spin again” or “Cash out” which will prompt another transaction to sign via Chainweaver.

:::note Key Takeaways

For developers and end users, navigating wallet-dApp interaction can be a challenging experience. For example, developing with Ethereum requires wallets and dApps to integrate intricate web3.js code in order to perform necessary signing operations.

Kadena simplifies this interaction with a signing API. There is no need to embed a web browser or to store private keys in a browser plug-in.

As a developer on Kadena, when your dApp needs to send a signed transaction, simply make an AJAX request to the signing API on localhost port 9467. Then the user's wallet will handle the details of transaction signing.

:::

### Additional Resources

- [See The Smart Contract Code for Pacty Parrots](https://github.com/kadena-io/developer-scripts/tree/master/pact/dapp-contracts/pacty-parrot)
- [See The Documentation For Implementing Signing API](https://kadena-io.github.io/signing-api/)

## Apply your knowledge to build a brand new dApp

### What you’ve accomplished

1. Created and funded an account
2. Performed multiple transactions
3. Interacted with Mainnet and Testnet
4. Used a gas station and signing API
5. Used Block Explorer and Chainweaver

## What’s Next?

You are now familiar with the core concepts and tools for developing powerful and user-friendly applications with Kadena. Take you learning to the next level with any of these paths:

Follow a guided template to create a complete dApp with a React frontend.

- [Go to create-pact-app](https://github.com/kadena-io/create-pact-app)

Learn Pact, Kadena’s human-readable smart contract language

- [Go to Pact Developer Tutorials](/blog)

Already have a dApp idea? Apply to our Developer Program to get technical and marketing support from Kadena.

- [Go to Developer Program](https://kadena.io/developerprogram)
