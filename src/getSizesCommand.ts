import { execSync } from "child_process";
import { OutputFormat } from "./OutputFormat";
import { Conversion } from "./getConvertImagesCommand";

export const getSizesCommand = (
  fileName: string,
  sizes: number[],
  format: OutputFormat,
  outputPath: string,
  quality: number
): string => {
  const qualityCommand = getQualityCommand(format, quality);

  execSync(`mkdir -p ${outputPath}/${fileName}`);

  return sizes.reduce<string>((accSize, currSize) => {
    return `${accSize}\\( -clone 0 -resize ${currSize} ${qualityCommand} -set filename:width %t_%w -write '${outputPath}/${fileName}/%[filename:width].${format}' +delete \\) `;
  }, "");
};

const getQualityCommand = (ext: string, quality: number) => {
  return ext === "jp2" ? "-define jp2:rate=32" : `-quality ${quality}`;
};

export const getTemplates = (
  fileName: string,
  size: number,
  format: OutputFormat,
  outputDirectory: string,
  quality: number
): Conversion => {
  const qualityCommand = getQualityCommand(format, quality);
  execSync(`mkdir -p ${outputDirectory}/${fileName}`);

  const outputFileName = `${fileName}_${size}`;
  const outputPath = `${outputDirectory}/${fileName}/${outputFileName}.${format}`;

  return {
    conversionCommand: `\\( -clone 0 -resize ${size} ${qualityCommand} -set filename:width %t_%w -write '${outputPath}' +delete \\) `,
    importsTemplate: `import ${outputFileName} from ${outputPath}`,
    srcSetTemplate: `${size}: ${outputFileName},`
  };
};
