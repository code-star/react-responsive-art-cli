import { getFileSrcSet } from "./getSrcSets";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { getFileImports } from "./getFileImports";
import { OutputFormat } from "./constants";
import { getFileName, joinLines } from "./utils";

const templateContent = fs.readFileSync(
  path.resolve(__dirname, "../src/templates/ResponsibleImage.tsx.template"),
  "UTF-8"
);

export const saveTemplate = (
  file: string,
  formats: OutputFormat[],
  sizes: number[],
  outDir: string,
  verbose: boolean
) => {
  const fileName = getFileName(file);
  const srcSet = getFileSrcSet(fileName, formats, sizes);
  const fileImports = getFileImports(fileName, formats, sizes);
  const componentFilePath = `${outDir}/${fileName}/Image.tsx`;

  const template: string = handlebars.compile(templateContent)({
    imageImports: fileImports,
    sizes: sizes.join(" | "),
    fileName,
    srcSet
  });

  if (verbose) {
    console.log(joinLines(`Saved component to ${componentFilePath}`, ""));
  }

  execSync(`echo "${template}" >> ${componentFilePath}`);
};
