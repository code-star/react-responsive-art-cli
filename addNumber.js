#!/usr/bin/env node

function addNumber(a, b) {
  return a + b;
}

console.log(process.argv);
console.log(
  "Sums: " + addNumber(Number(process.argv[3]), Number(process.argv[4]))
);
