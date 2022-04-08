---
title: Atom IDE with Pact Package
description: How to setup Atom for development with pact
tags: [pact, beginner]
hide_table_of_contents: false
---

import PageRef from '@components/PageRef'
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import AtomImageUrl from '@site/static/img/docs/build/tools/atom/linting-trace.png';

# Atom IDE with Pact Package

Atom with Pact package provides syntax highlighting, linter, line-by-line tracing over multiple files and LCOV code coverage.

Requires the Pact 4.1 executable or later. You need either Linux or MacOS to run a Pact build from Kadena. These instructions assume you are using Ubuntu LTS Desktop but would work with minor modifications for most flavors of Linux.

:::note

Because Pact is non-trivial to build on Windows it is not available. If you need to work from Windows consider using a virtual machine with Ubuntu.

:::

## Installing the Pact executable

Before installing pact we install the z3 dependency. Open a terminal (ctrl+alt+t) and past the following instructions:
```
sudo apt install z3 unzip
```

Download the latest Pact build from [github.com/kadena-io/pact/releases](https://github.com/kadena-io/pact/releases).
Assuming you have the zip in the folder Downloads :
```
cd ~/Downloads
```
```
unzip pact-4*
```
```
mkdir ~/bin && mv pact ~/bin
```
```
chmod +x ~/bin/pact
```

To test if the installation was successful open a new terminal run `pact`. 
```
$ pact
pact> (+ "hello " "world")
"hello world"
pact>
```

Press ctrl-d to exit the Pact prompt.

## Install Atom IDE

Download Atom IDE from [atom.io](https://atom.io/). Run the installer either by clicking it or running
```
sudo dpkg -i atom-amd64.deb
```

Start Atom by searching from the main menu.


## Add the Pact Package to Atom

In the menu choose `Edit > Preferences`.
A new tab will open in you main pane with the Settings. Select the `+Install` section from the settings and search for Pact. You will find the `language-pact` package. After installation you can find it back from the `Packages` section. Select it to tune to your preferences. 

## Testing linting and tracing

To check if your setup was succesful clone kadenaswap.

If you don't have git yet:
```
apt install git
```

```
git clone https://github.com/kadena-io/kadenaswap.git
```

From the Atom menu open the folder where you cloned kadenaswap. Double click on the file `exchange.repl` in the folder `pact`:



<img src={AtomImageUrl} />

You can open and close the linter from the bottom of the editor. The tracing and coverage can be activated from the menu or with key bindings. It might take a few seconds before you see the tracing while pact is processing the code in the background.
