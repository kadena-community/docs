---
title: Kadena Exchanges
description: A summary of the key features supported by the exchanges trading KDA.
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Exchanges

A summary of the key features supported by the exchanges trading KDA.

---

Blockchain transactions are irreversible and if you make a mistake, your coins may not be recoverable. A best practice with any blockchain is to always perform a small test transaction when executing a transfer for the first time. For added security, send those coins back to the sender to verify that the receiver's account works as expected.

The main purpose of a cryptocurrency exchange is to allow users to buy and sell coins. They may also allow users to transfer their coins to some other wallet. Exchanges generally do not support the full range of features enabled by many blockchains, including Kadena.&#x20;

Here is a summary of notable features regarding the exchanges that support KDA, for informational purposes only.

### [Kucoin](https://www.kucoin.com)

- Official KDA exchange
- Accessible globally
- KYC not required
- As of August 6th 2021, deposit of KDA in all 20 chains (chain 0 to chain 19) is now supported.
- When withdrawing KDA, Kucoin will transfer your KDA to your Chain 1 address.

### [CoinMetro](https://coinmetro.com)

- Official KDA exchange
- Accessible globally
- KYC required
- Supports transfers on all chains (Chain ID 0 - 19), including cross-chain transfers
- Supports TxBuilder, which allows for withdrawal transfers that can create named accounts or multi-signature accounts

### [Bittrex Global](https://global.bittrex.com)

- Official KDA exchange
- Accessible to non-US residents
- KYC required
- Supports transfers on Chain ID 0 only

### [HotBit](https://www.hotbit.io)

- Unofficial KDA exchange
- Accessible globally
- KYC not required
- Supports transfers on Chain ID 0 - 9 only
- Reported user issues:
  - Depositing KDA via cross-chain transfer is unreliable
  - Withdrawing KDA to existing accounts is unreliable
- Reported best practices:
  - When depositing KDA, perform a simple same-chain transfer
  - When withdrawing KDA, either (1) withdraw to an unnamed account that does not yet exist or (2) withdraw to an existing account that was already created by HotBit from a previous withdrawal
