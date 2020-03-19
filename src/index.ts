#!/usr/bin/env node

// https://github.com/yargs/yargs
// https://levelup.gitconnected.com/how-to-build-a-cli-npm-package-3ba98d6f9d4e
// https://github.com/yargs/yargs
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://www.freecodecamp.org/news/how-to-enable-es6-and-beyond-syntax-with-node-and-express-68d3e11fe1ab/
// https://developer.akamai.com/blog/2017/06/19/introducing-akamai-cli/

var formats = ["jpeg", "jp2", "webp"];
import yargs from "yargs";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

var { size, format } = yargs
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
console.log(size);
console.log(format);

const templateContent = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/ResponsibleImage.tsx.template"),
  "UTF-8"
);

const template = handlebars.compile(templateContent);
const result = template({
  imageImports: "here imports",
  srcSet: "the srcSets"
});

console.log(result);
