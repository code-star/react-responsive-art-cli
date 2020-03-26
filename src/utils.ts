import { OutputFormat } from "./constants";

const NEW_LINE = `
`;

export const joinLines = (...lines: string[]) => lines.join(NEW_LINE);

export const getQualityCommand = (ext: OutputFormat, quality: number) => {
  return ext === "jp2" ? "-define jp2:rate=32" : `-quality ${quality}`;
};

export const getIndentation = (characters: number) => " ".repeat(characters);

export const getFileName = (filePath: string): string => {
  const pathParts = filePath.split("/");
  return pathParts[pathParts.length - 1].split(".")[0];
};

export const getImageImportName = (
  fileName: string,
  size: number,
  format: OutputFormat
) => `${fileName}_${size}_${format}`;

export const getOutputFileName = (
  fileName: string,
  size: number,
  format: OutputFormat
) => `${fileName}_${size}.${format}`;
