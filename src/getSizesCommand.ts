import { OutputFormat } from "./OutputFormat";
import { Templates } from "./getConvertImagesCommand";

export const getQualityCommand = (ext: OutputFormat, quality: number) => {
  return ext === "jp2" ? "-define jp2:rate=32" : `-quality ${quality}`;
};

const getTemplatesForFormatSize = (
  fileName: string,
  size: number,
  format: OutputFormat,
  outputDirectory: string
): Templates => {
  const outputFileName = `${fileName}_${size}`;
  const outputPath = `${outputDirectory}/${fileName}/${outputFileName}.${format}`;

  return {
    importsTemplate: `import ${outputFileName} from ${outputPath}`,
    srcSetTemplate: `${size}: ${outputFileName},`
  };
};

export const getFromSizes = (
  sizes: number[],
  fileName: string,
  format: OutputFormat,
  outputDirectory: string
) => {
  const initialTemplate: Templates = {
    importsTemplate: "",
    srcSetTemplate: ""
  };

  return sizes.reduce((accSizes, currSize) => {
    const templates = getTemplatesForFormatSize(
      fileName,
      currSize,
      format,
      outputDirectory
    );

    return {
      importsTemplate: `${accSizes.importsTemplate}
          ${templates.importsTemplate},`,

      srcSetTemplate: `${accSizes.srcSetTemplate}
          ${templates.srcSetTemplate}`
    };
  }, initialTemplate);
};
