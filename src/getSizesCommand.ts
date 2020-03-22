import { execSync } from "child_process";
import { OutputFormat } from "./OutputFormat";
import { Templates } from "./getConvertImagesCommand";

const getQualityCommand = (ext: string, quality: number) => {
  return ext === "jp2" ? "-define jp2:rate=32" : `-quality ${quality}`;
};

const getTemplatesForFormatSize = (
  fileName: string,
  size: number,
  format: OutputFormat,
  outputDirectory: string,
  quality: number
): Templates => {
  const qualityCommand = getQualityCommand(format, quality);
  execSync(`mkdir -p ${outputDirectory}/${fileName}`);

  const outputFileName = `${fileName}_${size}`;
  const outputPath = `${outputDirectory}/${fileName}/${outputFileName}.${format}`;

  return {
    conversionCommand: `\\( -clone 0 -resize ${size} ${qualityCommand} -write '${outputPath}' +delete \\) \\`,
    importsTemplate: `import ${outputFileName} from ${outputPath}`,
    srcSetTemplate: `${size}: ${outputFileName},`
  };
};

export const getFromSizes = (
  sizes: number[],
  fileName: string,
  format: OutputFormat,
  outputDirectory: string,
  quality: number
) => {
  const initialTemplate: Templates = {
    conversionCommand: "",
    importsTemplate: "",
    srcSetTemplate: ""
  };

  return sizes.reduce((accSizes, currSize) => {
    const templates = getTemplatesForFormatSize(
      fileName,
      currSize,
      format,
      outputDirectory,
      quality
    );

    return {
      conversionCommand: `${accSizes.conversionCommand}
          ${templates.conversionCommand}`,

      importsTemplate: `${accSizes.importsTemplate}
          ${templates.importsTemplate},`,

      srcSetTemplate: `${accSizes.srcSetTemplate}
          ${templates.srcSetTemplate}`
    };
  }, initialTemplate);
};
