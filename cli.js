#!/usr/bin/env node

var addNumber = require("./addNumber");

console.log(process.argv);
console.log(
  "Sums: " + addNumber(Number(process.argv[3]), Number(process.argv[4]))
);
