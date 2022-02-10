---
title: Contribute to Kadena Docs
description: A summary of the key features supported by the exchanges trading KDA.
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Contribute to the Kadena Docs

How to contribute to the docs from docs.kadena.io, GitHub, or a local environment.

---

The Kadena documentation is open source and hosted on GitHub. Using our public-facing [Docs](https://github.com/kadena-community/docs) repo in the [Kadena Community GitHub](https://github.com/kadena-community), you can make suggested changes using pull requests. This allows community members to improve the documentation and helps improve the Kadena developer experience.

There are 3 ways to contribute to the Docs depending on where you are starting from.

- From the Docs
- From GitHub
- From a Local Environment.

This article goes over each of these options to help you suggest changes to the [Kadena Docs](https://github.com/kadena-community/docs).

## Before Getting Started {#before-getting-started}

**GitHub**

Create a GitHub account [here](https://github.com/) and read their [documentation](https://docs.github.com/en) if you have trouble getting started.

![github](/img/docs/contribute-to-docs/1.png)

**Markdown**

Learn about [Markdown](https://www.markdownguide.org/) to better understand the syntax for editing documentation.

![github](/img/docs/contribute-to-docs/2.png)

**Docusaurus**

Read the [Docusaurus Docs](https://docusaurus.io/) to get familiar with the tool used to publish the Kadena Documentation.

![github](/img/docs/contribute-to-docs/3.png)

## Edit from the Docs {#edit-from-the-docs}

At the bottom of any page of the Kadena Documentation, you’ll see a link titled **Edit this page. **

![github](/img/docs/contribute-to-docs/4.png)

Selecting this link takes you to the **kadena-community/docs** editor window for this page within GitHub.

![github](/img/docs/contribute-to-docs/5.png)

Make adjustments as needed and preview your changes using the **Preview tab**.

![github](/img/docs/contribute-to-docs/6.png)

Select the **Show diff **checkbox to view the changes inline.

![github](/img/docs/contribute-to-docs/7.png)

To propose your changes, scroll to the bottom of the page, add notes about your changes, and select the radio button option to **Create a new branch**. Name your branch and select propose changes.

![github](/img/docs/contribute-to-docs/8.png)

You have now proposed edits to the repo from the documentation. The Kadena team will review your request and merge your changes as soon as possible. View your pull request at any time to see any comments, questions, or suggestions throughout the duration of your pull request.

## Edit from the GitHub Repo {#edit-from-the-github-repo}

Navigate to the [Kadena Community GitHub ](https://github.com/kadena-community)and navigate to the [Docs Repo](https://github.com/kadena-community/docs).

![github](/img/docs/contribute-to-docs/9.png)

Using the folder structure, navigate to the page you would like to edit (**example: docs/basics/overview.md**).The location of this file corresponds to the URL found from within the documentation site.

![github](/img/docs/contribute-to-docs/10.png)

Select the edit icon on the right side of the screen to begin editing the document.

![github](/img/docs/contribute-to-docs/11.png)

Make adjustments as needed and preview your changes using the **Preview tab**.

![github](/img/docs/contribute-to-docs/12.png)

Select the **Show diff **checkbox to view the changes inline.

![github](/img/docs/contribute-to-docs/13.png)

To propose your changes, scroll to the bottom of the page, add notes about your changes, and select the radio button option to **Create a new branch**. Name your branch and select propose changes.

![github](/img/docs/contribute-to-docs/14.png)

You have now proposed edits to the repo from GitHub. The Kadena team will review your request and merge your changes as soon as possible. View your pull request at any time to see any comments, questions, or suggestions throughout the duration of your pull request.

## Edit from a Local Environment {#edit-from-a-local-environment}

Navigate to [kadena-community/docs](https://github.com/kadena-community/docs) and select **Fork **on the top right of your screen.

![github](/img/docs/contribute-to-docs/15.png)

Select your profile to create a fork of this repo on your personal GitHub account.

![github](/img/docs/contribute-to-docs/16.png)

Navigate to your docs repo fork and copy the URL from the code dropdown.

![github](/img/docs/contribute-to-docs/17.png)

Open your terminal, navigate to your preferred folder, and clone the repository.

**Example**

```
git clone https://github.com/kadena-community/docs.git
```

![github](/img/docs/contribute-to-docs/18.png)

Change into the **docs/** directory

```
cd docs
```

![github](/img/docs/contribute-to-docs/19.png)

Run **yarn** to install the project dependencies.

```
yarn
```

![github](/img/docs/contribute-to-docs/20.png)

Run **yarn start** to run the local server.

```
yarn start
```

![github](/img/docs/contribute-to-docs/21.png)

Navigate to [localhost:3000](http://localhost:3000/) to view the documentation on local device.

![github](/img/docs/contribute-to-docs/22.png)

Open the **docs **folder in your favorite code editor to make changes to the documentation (**example:** **docs > basics > what-is-kda.md)**. Use markdown to edit the page and save the file to view your changes.

![github](/img/docs/contribute-to-docs/23.png)

When you are done editing, check the status of your changes from your terminal window.

```
git status
```

![github](/img/docs/contribute-to-docs/24.png)

Use **git add **to add stage your changes to commit to your local repository.

```
git add .
```

![github](/img/docs/contribute-to-docs/25.png)

Use **git commit **to commit your changes to your local repository.

```
git commit -m 'how to edit docs'
```

![github](/img/docs/contribute-to-docs/26.png)

Use **git push **to push your changes to your remote repository.

```
git push origin master
```

![github](/img/docs/contribute-to-docs/27.png)

Select **Contribute > Open pull request** from within your remote repository.

![github](/img/docs/contribute-to-docs/28.png)

You have now created a pull request to the repo from a local environment. The Kadena team will review your request and merge your changes as soon as possible. View your pull request at any time to see any comments, questions, or suggestions throughout the duration of your pull request.
