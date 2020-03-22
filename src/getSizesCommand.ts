import { execSync } from "child_process";

export const getSizesCommand = (
  fileName: string,
  sizes: number[],
  format: string,
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
