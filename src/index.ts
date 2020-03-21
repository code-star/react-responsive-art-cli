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
import glob from "glob";

var { outputSizes, outputFormats, inputFilePattern } = yargs
  .option("outputSizes", {
    alias: "s",
    type: "array",
    description: "Output image sizes",
    demandOption: true
  })
  .option("outputFormats", {
    alias: "f",
    type: "array",
    choices: formats,
    description: "Output images formats",
    demandOption: true
  })
  .option("inputFilePattern", {
    alias: "-p",
    type: "string",
    description: "Glob pattern",
    default: "**/*.jpeg"
  }).argv;

console.log(outputSizes);
console.log(outputFormats);
console.log(inputFilePattern);

const templateContent = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/ResponsibleImage.tsx.template"),
  "UTF-8"
);

const template: string = handlebars.compile(templateContent)({
  imageImports: "here imports",
  srcSet: "the srcSets"
});
console.log(template);

const getQualityCommand = (ext: string) => {
  return ext === "jp2" ? "-define jp2:rate=32" : "-quality 90";
};

const getSizesCommand = (format: string) => {
  const qualityCommand = getQualityCommand(format);
  return outputSizes.reduce<string>((accSize, currSize) => {
    return `${accSize}
      ( -clone 0 -resize ${currSize} ${qualityCommand} -set filename:width %t_%w -write output/$imageName/%[filename:width].${format} +delete ) )`;
  }, "");
};

const getConvertCommand = (file: string) => {
  return outputFormats.reduce<string>((accFormats, currFormat) => {
    return `${accFormats}
        ${getSizesCommand(currFormat.toString())}`;
  }, `magick convert ${file} `);
};

glob(inputFilePattern, (err, files) => {
  console.log(err);
  console.log(files);

  files.forEach(file => {
    const convertCommand = getConvertCommand(file);
    console.log(convertCommand);
  });
});
