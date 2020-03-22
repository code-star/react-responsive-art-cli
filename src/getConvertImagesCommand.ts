import { OutputFormat } from "./OutputFormat";
import { getFromSizes } from "./getSizesCommand";

export type Templates = Readonly<{
  conversionCommand: string;
  importsTemplate: string;
  srcSetTemplate: string;
}>;

const isLast = <A>(index: number, list: A[]): boolean =>
  index === list.length - 1;

export const getTemplates = (
  filePath: string,
  sizes: number[],
  formats: OutputFormat[],
  outputPath: string,
  quality: number
): Templates => {
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1].split(".")[0];

  const initialTemplates: Templates = {
    conversionCommand: `magick convert ${filePath} \\`,
    importsTemplate: "",
    srcSetTemplate: `{
    `
  };

  return formats.reduce<Templates>((acc, currFormat, index, list) => {
    const isLastFormat = isLast(index, list);

    const fromSizes = getFromSizes(
      sizes,
      fileName,
      currFormat,
      outputPath,
      quality
    );

    return {
      conversionCommand: `${acc.conversionCommand}${
        fromSizes.conversionCommand
      }${isLastFormat ? "null:" : ""}`,
      importsTemplate: `${acc.importsTemplate}${fromSizes.importsTemplate}`,
      srcSetTemplate: `${acc.srcSetTemplate}
          ${currFormat}: {
            ${fromSizes.srcSetTemplate}
          },${
            isLastFormat
              ? `
        }`
              : ""
          }`
    };
  }, initialTemplates);
};
