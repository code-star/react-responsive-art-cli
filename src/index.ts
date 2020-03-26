#!/usr/bin/env node

// https://github.com/yargs/yargs
// https://levelup.gitconnected.com/how-to-build-a-cli-npm-package-3ba98d6f9d4e
// https://github.com/yargs/yargs
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://www.freecodecamp.org/news/how-to-enable-es6-and-beyond-syntax-with-node-and-express-68d3e11fe1ab/
// https://developer.akamai.com/blog/2017/06/19/introducing-akamai-cli/

import glob from "glob";
import { getArguments } from "./getArguments";
import { convertImages } from "./convertImages";
import { saveTemplate } from "./saveTemplate";

const { sizes, formats, outDir, quality, pattern, verbose } = getArguments();

glob(pattern, (_err, files) => {
  if (_err) {
    console.log(_err);
  }

  if (files.length) {
    files.forEach(file => {
      convertImages(file, formats, sizes, outDir, quality, verbose);
      saveTemplate(file, formats, sizes, outDir, verbose);
    });
  } else {
    console.log(`No files found with pattern ${pattern}`);
  }
});
