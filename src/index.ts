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
import { execSync } from "child_process";

var {
  outputSizes,
  outputFormats,
  inputFileGlob,
  outputDirectoryPath,
  verbose,
  quality
} = yargs
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
  .option("outputDirectoryPath", {
    alias: "p",
    type: "string",
    description: "Output path",
    default: "output"
  })
  .option("quality", {
    alias: "q",
    type: "number",
    description: "Output image quality",
    default: 90
  })
  .option("inputFileGlob", {
    alias: "-g",
    type: "string",
    description: "Glob pattern",
    default: "**/*.jpeg"
  })
  .option("verbose", {
    type: "boolean",
    description: "Verbose",
    default: false
  }).argv;

// console.log(outputSizes);
// console.log(outputFormats);
// console.log(inputFileGlob);
// console.log(outputDirectoryPath);

const templateContent = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/ResponsibleImage.tsx.template"),
  "UTF-8"
);

const template: string = handlebars.compile(templateContent)({
  imageImports: "here imports",
  srcSet: "the srcSets"
});
console.log(template);

const getQualityCommand = (ext: string, quality: number) => {
  return ext === "jp2" ? "-define jp2:rate=32" : `-quality ${quality}`;
};

const getSizesCommand = (
  fileName: string,
  format: string,
  outputPath: string,
  quality: number
) => {
  const qualityCommand = getQualityCommand(format, quality);

  execSync(`mkdir -p ${outputPath}/${fileName}`);

  return outputSizes.reduce<string>((accSize, currSize) => {
    return `${accSize}\\( -clone 0 -resize ${currSize} ${qualityCommand} -set filename:width %t_%w -write '${outputPath}/${fileName}/%[filename:width].${format}' +delete \\) `;
  }, "");
};

const getConvertCommand = (
  filePath: string,
  outputPath: string,
  quality: number
) => {
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1].split(".")[0];

  return (
    outputFormats.reduce<string>((accFormats, currFormat) => {
      return `${accFormats} ${getSizesCommand(
        fileName,
        currFormat.toString(),
        outputPath,
        quality
      )}`;
    }, `magick convert ${filePath}`) + "null:"
  );
};

glob(inputFileGlob, (_err, files) => {
  // console.log(err);
  // console.log(files);

  // const outputPath = path.resolve(__dirname, outputDirectoryPath);
  const outputPath = outputDirectoryPath;

  files.forEach(filePath => {
    const convertCommand = getConvertCommand(filePath, outputPath, quality);

    if (verbose) {
      console.log(`Converting file ${filePath}:`);
      console.log(convertCommand);
      console.log("");
    }
    execSync(convertCommand);
  });
});
