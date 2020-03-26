import { execSync } from "child_process";
import { joinLines, getQualityCommand, getFileName } from "./utils";
import { OutputFormat } from "./constants";
import { getOutputFileName } from "./utils";

export const convertImages = (
  filePath: string,
  formats: OutputFormat[],
  sizes: number[],
  outputDirectory: string,
  quality: number,
  verbose: boolean
) => {
  const convertImageCommand =
    formats.reduce<string>((byFormatAcc, format) => {
      const qualityCommand = getQualityCommand(format, quality);
      const fileName = getFileName(filePath);

      execSync(`mkdir -p ${outputDirectory}/${fileName}`);

      const convertToFormatCommand = sizes.reduce<string>((bySizeAcc, size) => {
        const outputFileName = getOutputFileName(fileName, size, format);
        return `${bySizeAcc}
      \\( -clone 0 -resize ${size} ${qualityCommand} -write '${outputDirectory}/${fileName}/${outputFileName}' +delete \\) \\`;
      }, ``);

      return `${byFormatAcc}${convertToFormatCommand}`;
    }, `magick convert ${filePath} \\`) + " :null";

  if (verbose) {
    console.log(
      joinLines(`Converting file ${filePath}:`, convertImageCommand, "")
    );
  }

  execSync(convertImageCommand);
};
