#!/usr/bin/env node

var formats = ["jpeg", "jp2", "webp"];
var yargs = require("yargs");

var results = yargs
  .option("size", {
    alias: "s",
    type: "array",
    description: "Image size",
    demandOption: true
  })
  .option("format", {
    alias: "f",
    type: "array",
    choices: formats,
    description: "Images format",
    demandOption: true
  }).argv;
console.log(results);
