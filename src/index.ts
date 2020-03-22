#!/usr/bin/env node

// https://github.com/yargs/yargs
// https://levelup.gitconnected.com/how-to-build-a-cli-npm-package-3ba98d6f9d4e
// https://github.com/yargs/yargs
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://www.freecodecamp.org/news/how-to-enable-es6-and-beyond-syntax-with-node-and-express-68d3e11fe1ab/
// https://developer.akamai.com/blog/2017/06/19/introducing-akamai-cli/

import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import glob from "glob";
import { execSync } from "child_process";
import { getArguments } from "./getArguments";
import { getTemplates } from "./getConvertImagesCommand";

const { sizes, formats, outDir, quality, pattern, verbose } = getArguments();

const templateContent = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/ResponsibleImage.tsx.template"),
  "UTF-8"
);

const template: string = handlebars.compile(templateContent)({
  imageImports: "here imports",
  srcSet: "the srcSets"
});
console.log(template);

glob(pattern, (_err, files) => {
  // console.log(err);
  // console.log(files);

  files.forEach(filePath => {
    const convertCommand = getTemplates(
      filePath,
      sizes,
      formats,
      outDir,
      quality
    );

    if (verbose) {
      console.log(`Converting file ${filePath}:`);
      console.log(convertCommand);
      console.log("");
    }
    execSync(convertCommand.conversionCommand);
  });
});
