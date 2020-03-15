#!/usr/bin/env node

function addNumber(a, b) {
  return a + b;
}

console.log(process.argv);
console.log(
  "Sums: " + addNumber(Number(process.argv[3]), Number(process.argv[4]))
);

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
