import { getSizesCommand } from "./getSizesCommand";
import { OutputFormat } from "./OutputFormat";

export const getConvertCommand = (
  filePath: string,
  sizes: number[],
  formats: OutputFormat[],
  outputPath: string,
  quality: number
): string => {
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1].split(".")[0];

  return (
    formats.reduce<string>((accConvertCommand, currFormat) => {
      return `${accConvertCommand} ${getSizesCommand(
        fileName,
        sizes,
        currFormat,
        outputPath,
        quality
      )}`;
    }, `magick convert ${filePath}`) + "null:"
  );
};
