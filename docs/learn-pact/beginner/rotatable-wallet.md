---
title: Rotatable Wallet
description: Kadena makes blockchain work for everyone.
tags: [pact, beginner]
hide_table_of_contents: false
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pact Rotatable Wallet

Welcome to this **Rotatable Wallet** project tutorial!

Here you’ll create a smart contract named **Rotatable Wallets** that demonstrates many important Pact features that you learned throughout previous tutorials.

**Topics covered in this tutorial**

- Project Overview
- Define Keysets
- Define Module
- Define Schema and Table
- Functions
- Create Table
- Deploy the Contract

:::note Key Takeaway

Modules can be permissioned to ensure the security of running your code on a decentralized network and allow for row level permissions when necessary.

:::

<!--truncate-->

## Rotatable Wallet Module Demonstration

The module you will build is called the **Auth** Module and allows for a feature known as a Rotatable Wallet.

This builds on earlier knowledge and helps demonstrate how keysets can be used at the "row level" to guard assets. It’s an example of how a Pact smart contract can manage user keysets in a decentralized fashion allowing users to update information based on their keyset. The ability to change keyset values is referred to as **rotating keysets**.

By creating this module, you’ll be able to effectively create smart contracts that guard assets at a row level and take advantage of functions that allow users to update information in tables.

## Project Overview

Before getting into the code, take some time to review what you’ll be building. This smart contract can be broken down into steps focused on 4 core areas that include the keysets, module, table, and functions.

![1-project-overview](./assets/beginner-tutorials/project-rotatable-wallet/1-project-overview.png)

The details of each step will be described as you progress through the tutorial. Each step will include a short description ending with a code challenge. If you get stuck, you can always look at the hints or solutions we provide.

## Project Environment Setup

To get started, choose a project directory and clone the <a href="https://github.com/kadena-io/pact-lang.org-code" target="_blank">project resources</a> into your local environment.

```terminal
git clone https://github.com/kadena-io/pact-lang.org-code.git
```

Change into the **loans** directory to begin working on this project.

```terminal
cd pact-lang.org-code/rotatable-wallet
```

Open this directory in atom to see each of the files provided.

```terminal
atom .
```

As you’ll see, there are a few separate folders available to you.

|                |                                                                                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **start**      | Provides a starting point with all comments for every challenge.                                                                                                            |
| **challenges** | Challenges in the demo are broken out into separate files, allowing you to build your application over time while having the flexibility to experiment with your own ideas. |
| **finish**     | Includes all comments and code for the final application.                                                                                                                   |
| **loans**      | Includes final application without the challenge comments.                                                                                                                  |

Each of these options are meant to help support you as you work through these challenges. Feel free to use them however you’d like to.

When you’re set up to begin, follow along with each step to create your own Rotatable Wallet Smart Contract!

## 1. Define Keysets

Get started with your smart contract by defining it’s keysets.

The 2 keysets required for this smart contract are a **module-admin-keyset** that will allow users to define and update modules, and an **module-operate-keyset** that will allow users to create accounts.

Each of these keysets play a specific role that will be defined later in the application.

:::caution Code Challenge

Complete define and read the **module-admin-keyset** and the **module-operate-keyset**.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/1-define-keysets/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/1-define-keysets/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#define-keyset" target="_blank">define-keyset</a> for more information on defining and reading keysets.

:::

## 2. Define Module

The next step is to create the module that will contain the logic of your smart contract.

:::caution Code Challenge

Define a module named **auth** that specifies access to the **module-admin** keyset.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/2-define-module/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/2-define-module/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=keysets#module" target="_blank">module</a> for more information on creating modules.

:::

## 3. Define Schema and Table

This smart contract contains a schema named **user** with 2 columns; **nickname** held as a string and **keyset** which is held as a keyset. Use this schema to both define and create a table named **users**.

:::caution Code Challenge

Define the user schema and table.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/3-define-schema-and-table/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/3-define-schema-and-table/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#defschema" target="_blank">defschema</a> and <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#defschema" target="_blank">deftable</a> for more information on creating schemas and tables.

:::

## 4. Create Functions

You're now ready to complete the functions for this module.

| function              | purpose                                                      |
| --------------------- | ------------------------------------------------------------ |
| **create-user**       | Allows operate-admin to add rows to the user table.          |
| **enforce-user-auth** | Restrict access permissions to users with a given id.        |
| **change-nickname**   | Allow users with a specific keyset to update their nickname. |
| **rotate-keyset**     | Allow the owner of a keyset to change their keyset.          |

The goal of these functions is to allow users the flexibility they need to create and manage their accounts.

### 4.1 Create User

In this step, you will create a function that allows the **operate-admin** to add rows to the users table.

:::caution Code Challenge

Define a function named **create-user** that takes 3 arguments; id, nickname, and keyset. Next, restrict access for function calls to the **operate-admin**. Finally, insert a row into the **users** table using the inputs specified by the user.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.1-create-user/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.1-create-user/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#enforce-keyset" target="_blank">enforce-keyset</a> and <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#insert" target="_blank">insert</a> for more information related to completing this challenge.

:::

### 4.2 Enforce User

It’s sometimes useful to restrict access to data to specific users. For example, users may not want others to see the balance of their account or other sensitive information. This can be done in Pact by enforcing access to rows of data using row-level keysets.

The first step toward making this happen is to be able to view the keyset associated with a specific id. The following function shows an example of reading a keyset in a specific row from a given id.

```clojure
(defun enforce-keyset-of-id (id)
  (with-read table id { "keyset":= keyset }
  (enforce-keyset keyset)
  keyset)
)
```

This function doesn’t yet give any access to the data in a row. It’s purpose is for other functions to call on it in the case that they want to do something like place row level restrictions on data. This will be valuable shortly when you write code that needs to call this function.

:::caution Code Challenge

Define a function named **enforce-user-auth** that returns the keyset associated with a given id.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.2-enforce-user/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.2-enforce-user/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#enforce-keyset" target="_blank">enforce-keyset</a>, <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=bindings#with-read" target="_blank">with-read</a>, and <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=bindings#bind" target="_blank">bind</a> for more information related to completing this challenge.

:::

### 4.3 Change Nickname

Once you can restrict access to data, you’re ready to allow users to take specific actions based on the data they have access to. For example, a user may want to update their profile name, or make changes to sensitive information that other users should not be able to access.

To do that, you can write a function that utilizes the previous function you created. From there, you can add in functionality that allows users to update their data.

Here is an example function **update-data** that allows users to update existing information. It leverages the previous example function **enforce-keyset-of-id** to make an update to a row in the table **example-table**.

```clojure
(defun update-data (id new-data)
  (enforce-keyset-of-id id)
  (update example-table id { "data": new-data })
  (format "Data updated in row {} to {}" [id new-data]))
```

This function combined with the previous function allows users with a specific keyset to make updates to restricted information.

:::caution Code Challenge

Define a function named **change-nickname** that allows users with a specific keyset to update their nickname in the **users** table.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.3-change-nickname/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.3-change-nickname/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=update#update" target="_blank">update</a> and <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=update#format" target="_blank">format</a> for more information related to completing this challenge.

:::

### 4.4 Rotate Keyset

Now that users can update their name, you can apply this same functionality to other information.

For example, you can allow users to update their keyset. The ability to update keysets is known as ‘rotating keysets’ and this is where the name ‘Rotatable wallets’ came from for this demonstration. This feature is comparable to being able to update a password, and it’s an extremely useful feature to have in an application.

For this final function, use the information learned from previous steps to add rotating keysets as a feature of your smart contract.

:::caution Code Challenge

Define a function named rotate-keyset that allows the owner of a keyset to change their keyset.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.4-rotate-keyset/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/4-functions/4.4-rotate-keyset/solution.pact" target="_blank">Solution</a>

:::

:::info

View <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=update#update" target="_blank">update</a> and <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=update#format" target="_blank">format</a> for more information related to completing this challenge.

:::

## 5. Create Table

The last step is to create the **user** table defined within the module.

:::caution Code Challenge

Create the user table.

    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/5-create-table/challenge.pact" target="_blank">Challenge</a>
    * <a href="https://github.com/kadena-io/pact-lang.org-code/blob/master/rotatable-wallet/2-challenges/5-create-table/solution.pact" target="_blank">Solution</a>

:::

## Deploy the Smart Contract

Your Rotatable Wallet smart contract is complete! If you’d like, you can deploy this contract similar to how you would deploy other smart contracts.

For more information on deploying this smart contract, view the following tutorials.

- <a href="https://pactlang.org/beginner/hello-world-with-pact/" target="_blank">Hello World with Pact</a>
- <a href="https://pactlang.org/beginner/online-editor/" target="_blank">Pact Online Editor</a>
- <a href="https://pactlang.org/beginner/pact-on-atom-sdk/" target="_blank">Pact Development on Atom SDK</a>

## Review

That wraps up this tutorial on the **Rotatable Wallet** application.

Throughout this tutorial, you built a smart contract named **Rotatable Wallets** that demonstrated many important Pact features that you learned throughout previous tutorials.

Most importantly, you showed how modules can be permissioned to ensure the security of running your code on a decentralized network and allow for row level permissions when necessary.

Having the ability to permission modules is an extremely valuable feature of Pact, and you can use this in many other applications in the future. Take some time now to experiment with this feature to try applying it in new situations.

When you’re ready, move to the next tutorial to continue building Pact applications!
