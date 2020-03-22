import { OutputFormat } from "./OutputFormat";
import { getFromSizes } from "./getSizesCommand";

export type Templates = Readonly<{
  importsTemplate: string;
  srcSetTemplate: string;
}>;

const isLast = <A>(index: number, list: A[]): boolean =>
  index === list.length - 1;

export const getTemplates = (
  filePath: string,
  sizes: number[],
  formats: OutputFormat[],
  outputPath: string
): Templates => {
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1].split(".")[0];

  const initialTemplates: Templates = {
    importsTemplate: "",
    srcSetTemplate: `{
    `
  };

  return formats.reduce<Templates>((acc, currFormat, index, list) => {
    const isLastFormat = isLast(index, list);

    const fromSizes = getFromSizes(sizes, fileName, currFormat, outputPath);

    return {
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
