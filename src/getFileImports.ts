import { OutputFormat } from "./constants";
import { joinLines, getImageImportName, getOutputFileName } from "./utils";

export const getFileImports = (
  fileName: string,
  formats: OutputFormat[],
  sizes: number[]
): string => {
  const fileSrcSet = formats.reduce<string[]>((accFormats, format) => {
    const formatSrcSet = sizes.reduce<string[]>((accSizes, size) => {
      const outputFileName = getOutputFileName(fileName, size, format);

      return [
        ...accSizes,
        `import ${getImageImportName(
          fileName,
          size,
          format
        )} from './${outputFileName}'`
      ];
    }, []);

    return [...accFormats, ...formatSrcSet];
  }, []);

  return joinLines(...fileSrcSet);
};
