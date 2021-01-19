## Caviste scraper

A scraper and label generator for wine bottles purchased at Caviste

### Background

My favorite French/Swedish wine grocer Caviste (https://www.caviste.se) has a very informative webpage.
The thing is I like to have written notes on each individual bottle, so that when I pick something from 
the cellar, I can read right away what it's all about.

### Features

* Fetches and scrapes the cav release you're interested in.
* Looks up title, description, drinking window, price
* Generates a PDF that you can print and then cut out notes to put on each bottlea
* Only in Swedish, as that's the language that Caviste uses!

### Usage

Install the few dependencies:

```yarn install```

Run the script:

```node index.js [cav release]```

where [cav release] is the id of the release, i.e "cav0126".


