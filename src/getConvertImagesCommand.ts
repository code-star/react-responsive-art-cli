import { getTemplates } from "./getSizesCommand";
import { OutputFormat } from "./OutputFormat";

export type Conversion = Readonly<{
  conversionCommand: string;
  importsTemplate: string;
  srcSetTemplate: string;
}>;

const isLast = <A>(index: number, list: A[]): boolean =>
  index === list.length - 1;

export const getStuff = (
  filePath: string,
  sizes: number[],
  formats: OutputFormat[],
  outputPath: string,
  quality: number
): Conversion => {
  const fileParts = filePath.split("/");
  const fileName = fileParts[fileParts.length - 1].split(".")[0];

  return formats.reduce<Conversion>(
    (acc, currFormat, index, list) => {
      const isLastFormat = isLast(index, list);

      const fromSizes = sizes.reduce(
        (accSizes, currSize) => {
          const templates = getTemplates(
            fileName,
            currSize,
            currFormat,
            outputPath,
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
        },
        {
          conversionCommand: acc.conversionCommand,
          importsTemplate: "",
          srcSetTemplate: ""
        }
      );

      return {
        ...fromSizes,
        conversionCommand: `${fromSizes.conversionCommand}${
          isLastFormat ? "null:" : ""
        }`,
        srcSetTemplate: `${currFormat}: {
          ${fromSizes.srcSetTemplate}
        },
        ${acc.srcSetTemplate}`
      };

      // return {
      //   ...acc,
      //   conversionCommand: `${}`
      //   // conversionCommand: getConversionCommand(
      //   //   acc.conversionCommand,
      //   //   currFormat,
      //   //   isLast,
      //   //   fileName,
      //   //   sizes,
      //   //   outputPath,
      //   //   quality
      //   // )
      // };
    },
    {
      conversionCommand: `magick convert ${filePath}`,
      importsTemplate: "",
      srcSetTemplate: ""
    }
  );
};

// const getConversionCommand = (
//   prevConversionCommand: string,
//   format: OutputFormat,
//   isLast: boolean,
//   fileName: string,
//   sizes: number[],
//   outputPath: string,
//   quality: number
// ): string => {
//   return `${prevConversionCommand} ${getSizesCommand(
//     fileName,
//     sizes,
//     format,
//     outputPath,
//     quality
//   )}${isLast ? "null:" : ""}`;
// };
