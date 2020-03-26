import handlebars from "handlebars";
import { getIndentation, joinLines, getImageImportName } from "./utils";
import { OutputFormat } from "./constants";

const getSrcSetByFormat = (
  format: string,
  srcSet: string[],
  isFirst: boolean
) => {
  const srcSetFormatTemplate = `${getIndentation(isFirst ? 1 : 2)}{{format}}: {
{{srcSet}}
  },`;

  return handlebars.compile(srcSetFormatTemplate)({
    format,
    srcSet: joinLines(...srcSet)
  });
};

export const getFileSrcSet = (
  fileName: string,
  formats: OutputFormat[],
  sizes: number[]
): string => {
  const fileSrcSet = formats.reduce<string[]>((accFormats, format, index) => {
    const indentation = getIndentation(4);
    const sizesSrcSet = sizes.reduce<string[]>(
      (accSizes, size) => [
        ...accSizes,
        `${indentation}${size}: ${getImageImportName(fileName, size, format)},`
      ],
      []
    );

    return [...accFormats, getSrcSetByFormat(format, sizesSrcSet, index === 0)];
  }, []);

  return joinLines(...fileSrcSet);
};
