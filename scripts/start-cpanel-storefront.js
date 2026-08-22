#!/usr/bin/env node

const path = require("path")

process.chdir(path.join(__dirname, "..", "apps", "storefront"))
require("./start-next")
