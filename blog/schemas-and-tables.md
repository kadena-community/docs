---
title: Schemas and Tables
description: Kadena makes blockchain work for everyone.
tags: [pact, beginner]
hide_table_of_contents: false
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Pact Schemas and Tables

Welcome to this introduction to Pact Schemas and Tables!

**Topics covered in this tutorial**

- Introduction to Schemas and Tables
- Define Schemas
- Define Tables
- Create Tables
- Table built-in functions

The goal of this tutorial is to get you familiar with what schemas and tables are, why they’re useful, and to demonstrate how to implement these within a Pact smart contract.

:::note Key Takeaway

Tables are one of the three core elements of Pact smart contracts. Tables are defined using **deftable**, which references a schema defined by **defschema**, and are later created using **create-table**. There are many ways to build functions that store, manipulate, and read data from smart contract tables.

:::

<!--truncate-->

## Pact Schemas and Tables

<iframe width="720" height="405" src="https://www.youtube.com/embed/MwzsAvEyaQk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Subscribe to our <a href="https://www.youtube.com/channel/UCB6-MaxD2hlcGLL70ukHotA" target="_blank">YouTube channel </a> to access the latest Pact tutorials.

## Introduction to Tables and Schemas

Tables in Pact are responsible for holding all of the data for application. Data is stored in a key-row structure similar to other relational databases. Tables are defined by schemas that define both the field values and field types.

Before completing this tutorial, it may be helpful to read through some of the existing materials on schemas, types, and tables. This material includes some of the prerequisites needed to understand the conceptual foundations behind what tables are and how they provide value to your Pact smart contracts.

**Pact Language Reference**

- <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#table-creation" target="_blank">Table Creation</a>
- <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html#types-and-schemas" target="_blank">Types and Schemas</a>

### Define Schemas

Before creating a table in Pact, you need to define its schema, which describes the structure of the table. Schemas specify the columns and data types that are meant to be in a table. Schemas are defined within Pact modules using <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=tables%20and%20schemas#defschema" target="_blank">defschema</a> and consist of a series of **field names** and **field types**.

Each field name specifies a column in the table, and each field type specifies the type of data held in that table.

The example table below contains field names and field types. In this example, there are 3 fields; **balance**, **amount**, and **ccy** (currency), each with their own field type.

**Accounts Table**

| field name | field type |
| ---------- | ---------- |
| balance    | decimal    |
| amount     | decimal    |
| ccy        | string     |

You can create this schema in Pact using **defschema** as shown below.

```clojure
(defschema accounts
  "Schema for accounts table."
  balance:decimal
  amount:decimal
  ccy:string
  )
```

All table schemas you create will look similar to this but will contain different field names and types. Field names can include whatever works best for your application, and fields types can include any of the types supported by Pact.

:::info

The data types supported by Pact can be found <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=types#data-types" target="_blank">here</a>.

:::

### Define Tables

Tables hold data created by the smart contract.

These are defined within Pact modules and there is no limit to the number of tables you can define. This data can be added, read, or changed using functions, and access to this data can be restricted using what is known as <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=table%20guards#module-table-guards" target="_blank">table guards</a>.

Tables are defined after the prerequisite schema is defined, using <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=deftable#deftable" target="_blank">deftable</a> followed by the table name and a reference to the table’s schema.

**Accounts Example**

```clojure
(deftable table-name:{schema-name})
```

Given the schema from the earlier defined schema, you can define the table as shown below.

```clojure
(deftable accounts-table:{accounts})
```

:::info Notes on Syntax

_ Notice that the table and schema are represented as a pair, separated by a “:”.
_ The { } around the schema-name are there because the schema is an object.

:::

The schema name and table names must be different from one another. It’s best practice to make names that resemble each other but are not identical.

```clojure
(deftable cat-table:{cat})
(deftable asset-tracker:{asset})
```

Keeping names similar helps you track your schemas and tables more effectively while avoiding confusion between their names.

### Create Tables

Once tables are defined, they still need to be created.

Though tables are defined within the module, creating tables in Pact is done outside of the module. This is done to ensure that the module may be redefined or updated later without having to re-create the table.

The relationship of modules to tables is important, as described in <a href="https://pact-language.readthedocs.io/en/latest/pact-reference.html?highlight=table%20creation#module-table-guards" target="_blank">table guards</a>

Tables are created outside of the module using <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=create-table#create-table" target="_blank">create-table</a> followed by the table name as defined within the module.

```clojure
(deftable cat-table:{cat})
(deftable asset-tracker:{asset})
```

This syntax for creating tables is simple. The main concern here is to make sure that you follow through with creating each of the tables that are defined within the module.

### Table Built-in Functions

When working with tables, there are many built-in functions available for you to work with table data.

| function type                                                                                                  | purpose                       |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#insert" target="_blank">Insert</a> | Insert new rows into a table. |
| <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#read" target="_blank">Read</a>     | Read values from a table.     |
| <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#update" target="_blank">Update</a> | Update values within a table. |
| Delete                                                                                                         | Not possible in Pact.         |

Notice that these functions are similar to common options available in other databases (CRUD - create, read, update, delete).

:::info

Delete is not available because, as you may know, you cannot delete data from a blockchain. Also, rather than create, the Pact built-in function is named insert.

:::

### Insert

<a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#insert" target="_blank">Insert</a> functions are used to add new data into a table. These are useful when creating new artifacts such as entities, loans, accounts, and in any other case where you may want to add data.

For an example of an **insert** function, pretend you have the following empty table.

**entity-table**

| key | entityName |
| --- | ---------- |
|     |            |
|     |            |
|     |            |

To add a row to this table with an **entityName** of “My Entity” at the key of **entity-1**, you would write the following Pact code.

```clojure
(insert entity-table “entity-1” { "entityName": "My Entity"})
```

:::info

It is required that the key be entered as a string.

:::

You can also place **insert** within a function and using the inputs to add new data to rows within a table. This will help you add rows more dynamically from within your application.

Here is an example using insert from within a function.

```clojure
(defun create-entity (entityName)
  (insert entity-table entityId {
      "entityName": entityName
      }
  )
)
```

In each of the previous cases, the final result would insert the data similar to the following into the **entity-table**.

| key      | entityName |
| -------- | ---------- |
| entity-1 | My Entity  |

### Read

<a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#read" target="_blank">Read</a> allows you to read rows from a table for a given key.

For this example, imagine you had the following table and you wanted to read the balance and currency at the key of **entity-1**.

**Accounts Table**

| key       | balance | ccy |
| --------- | ------- | --- |
| account-1 | 4.00    | USD |
| account-2 | 3.00    | USD |

Using read, you can specify the id and you’ll get back the information you request.

```clojure
(read accounts account-1 ['balance 'ccy])
```

Here is an example of how to get similar functionality by using read from within a function.

```clojure
(defun read-accounts (1)
  (read accounts id [‘balance ‘ccy])
  )
)
```

In each of the cases shown above, the functions would return the following values.

| balance | ccy |
| ------- | --- |
| 4.00    | USD |

### Update

<a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html#update" target="_blank">Update</a> functions can be used to update a values in an existing row of a table. Updating is helpful in situations where you need to change the status of a column or amend the initial dataset to a new value.

Using **update**, you can specify the row id to update a value within that row. This value would generally be passed in by the user as a function parameter.

```clojure
(update table-name id {"value": new-value}
```

For example, pretend you had the following table and wanted to update the **assetPrice**.

**Assets Table**

| key      | assetName | assetPrice | status |
| -------- | --------- | ---------- | ------ |
| entity-1 | My Asset  | 5.0        | todo   |

The **amend-assetPrice** function below updates the **assetId** column of an **assets-table**. It then **reads** the value of the updated column.

```clojure
(defun amend-assetPrice (assetPrice:decimal)
    (update assets-table assetPrice {
        "assetPrice":assetPrice
    }
  )
  (read asset-table assetId)
)
```

This same pattern can be used in many different ways.

For example, you may be creating an asset and want to track its progress throughout the creation process with fields like todo, in progress, or done. In this case, you could use the function below **asset-update**, to change the status of the asset as it progresses through the process.

```clojure
(defun asset-update (assetId:string new-status:string)
  (update assets-table assetId {
    "status": new-status
  })
  (read asset-table assetId)
)
```

### Select

<a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=constantly%20true#select" target="_blank">Select</a> is used to read values from a table.

This is similar to **read** but select includes more specificity allowing you greater flexibility in what information you choose to select. The syntax for selecting from tables closely resembles SQL statements.

The simplest select statement you can create would be to select all values of an existing table.

```clojure
(select table-name)
```

Similar to other built-in functions, you can run this from within another function.

For example, here is the **assets-table** from earlier.

**Assets Table**

| key      | assetName | assetPrice | status      |
| -------- | --------- | ---------- | ----------- |
| entity-1 | My Asset  | 5.0        | todo        |
| entity-2 | Asset 2   | 6.0        | in progress |
| entity-3 | Asset 3   | 7.0        | done        |

You can run the following **select** statement to return all values from this table.

```clojure
  (defun select-assets ()
    (select assets-table (constantly true))
  )
```

This query will return the following values from the **assets-table**.

| key      | assetName | assetPrice | status      |
| -------- | --------- | ---------- | ----------- |
| entity-1 | My Asset  | 5.0        | todo        |
| entity-2 | Asset 2   | 6.0        | in progress |
| entity-3 | Asset 3   | 7.0        | done        |

Along with select, you can also use a <a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=constantly%20true#where" target="_blank">where</a> statement to further refine your query as shown below.

```clojure
  (select assets-table ['assetName,'assetPrice] (where 'assetName (= "Asset 2")))
```

This query would return the following values from the **assets-table**.

| assetName | assetPrice |
| --------- | ---------- |
| Asset 2   | 6.0        |

You can also specify operators such as greater than or less than from within the WHERE clause as shown below.

```clojure
  (select assets-table (where 'assetPrice (> 6.0)))
```

This query would return the following values from the **assets-table**.

| key      | assetName | assetPrice | status |
| -------- | --------- | ---------- | ------ |
| entity-3 | Asset 3   | 7.0        | done   |

### Keys

<a href="https://pact-language.readthedocs.io/en/latest/pact-functions.html?highlight=constantly%20true#keys" target="_blank">Keys</a> allows you to return all the **key** values in a table.

Given the previously shown **assets-table**, you could return each of the keys using the code below.

```clojure
  (keys assets-table)
```

This can also be done within a function as shown below.

```clojure
    (defun get-keys (table-name)
    (keys table-name)
  )
```

### Review

That wraps up this tutorial on schemas and tables with Pact.

By completing this tutorial, you’ve mastered many of the core ideas surrounding schemas and tables. You’ve also seen some of the basic functions that are useful for manipulating data from within a table.

You can try building out your own database from scratch or by using existing database examples to work from. An excellent resource for finding existing schemas for well designed databases can be found <a href="http://www.databaseanswers.org/data_models/" target="_blank">here</a>. If you’re unfamiliar with database design, you can review most of what you need to know <a href="https://www.tutorialspoint.com/dbms/dbms_data_schemas.htm" target="_blank">here</a>. That website goes into a lots of detail, so if you’d like to focus more on specifically what might be useful to you right now, you can find that <a href="https://www.lucidchart.com/pages/database-diagram/database-design" target="_blank">here</a>.

Try finding a database you’re interested in to practice recreating some of its functionality. And if you’re not quite ready to try that, you can check out the next tutorial instead. You’ll see many more examples of tables, schemas, and their related functions throughout the rest of this series.
