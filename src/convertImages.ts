import { OutputFormat } from "./OutputFormat";
import { getQualityCommand } from "./getSizesCommand";
import { execSync } from "child_process";

export const convertImages = (
  filePath: string,
  formats: OutputFormat[],
  sizes: number[],
  outputDirectory: string,
  quality: number
) => {
  const convertImageCommand = formats.reduce<string>((byFormatAcc, format) => {
    const qualityCommand = getQualityCommand(format, quality);
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1].split(".")[0];

    execSync(`mkdir -p ${outputDirectory}/${fileName}`);

    const convertToFormatCommand = sizes.reduce<string>((bySizeAcc, size) => {
      const outputFileName = `${fileName}_${size}`;
      const outputPath = `${outputDirectory}/${fileName}/${outputFileName}.${format}`;
      return `${bySizeAcc}
      \\( -clone 0 -resize ${size} ${qualityCommand} -write '${outputPath}' +delete \\) \\`;
    }, ``);

    return `${byFormatAcc}${convertToFormatCommand}`;
  }, `magick convert ${filePath} \\`);

  execSync(convertImageCommand);
};
