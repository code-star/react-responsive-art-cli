#!/usr/bin/env node
// https://github.com/yargs/yargs
// https://levelup.gitconnected.com/how-to-build-a-cli-npm-package-3ba98d6f9d4e
// https://github.com/yargs/yargs
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://www.freecodecamp.org/news/how-to-enable-es6-and-beyond-syntax-with-node-and-express-68d3e11fe1ab/
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "yargs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    var formats = ["jpeg", "jp2", "webp"];
    var yargs_1 = tslib_1.__importDefault(require("yargs"));
    var results = yargs_1.default
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
});
//# sourceMappingURL=convertImages.js.map