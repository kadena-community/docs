---
title: Built in Functions
description: Kadena makes blockchain work for everyone.
tags: [pact, intermediate]
hide_table_of_contents: false
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Built-in Functions

Welcome to this introduction to some more advanced Pact built-in functions.

In this guide, we will go through and explain specific built-in functions that are listed in the [pact reference page](https://pact-language.readthedocs.io/en/stable/pact-functions.html#built-in-functions).

## Simple Payment Verification

The quick explanation of the `verify-spv` function can be found [here](https://pact-language.readthedocs.io/en/stable/pact-functions.html?highlight=verify-spv#spv-1).

`verify-spv` takes some blob, a binary data type, provided by the user and runs code on it that would be too expensive to do in pact. Thus, in the statement `(verify-spv "ETH")`, "ETH" has code in the chainweb-node binary to validate that the data is well-formed and returns a normal Pact object with all of the data. It is NOT an oracle; it is a tool that an oracle would use to guarantee data integrity.
[Here](https://github.com/kadena-io/kadenaswap/blob/master/pact/relay/kerc/kERC.pact#L210-L245) is example code using the chain relay to validate a proof that the sender has retrieved from infura.

In a repl script, all you can do is simulate this, as the "ETH" support does not ship with Pact. The [`mock-spv`](https://pact-language.readthedocs.io/en/stable/pact-functions.html#mock-spv) REPL native allows you to mock a call to verify-spv ([github](https://github.com/kadena-io/kadenaswap/blob/master/pact/relay/kerc/kERC.repl#L44-L81)).

You can simulate any protocol desired. However, getting a protocol added to chainweb requires support in the chainweb binary and is a hard fork. Therefore, the community would need to spearhead by opening a pull request for a KIP, Kadena Improvement Process. For instance, to support BTC proofs, a KIP would be opened to add `verify-spv "BTC"` to discuss and specify what is needed. Afterwards, the Haskell support would need to be implemented and released with a Chainweb version upgrade.
Currently chainweb supports "ETH" and "TXOUT" only ([github](https://github.com/kadena-io/chainweb-node/blob/f0b47973f1653878d7a51b73b4422f980b67dd84/src/Chainweb/Pact/SPV.hs#L120-L152)).

::: note

TXOUT is the same as what is used for crosschain, but should not be used for "once-and-only-once" which demands using a cross-chain defpact to enforce. TXOUT can be used for "broadcast" of e.g. a price feed to other chains.

::
