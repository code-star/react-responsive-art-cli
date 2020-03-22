import yargs from "yargs";
import { OutputFormat, OUTPUT_FORMAT_CHOICES } from "./OutputFormat";

type Arguments = Readonly<{
  sizes: number[];
  formats: OutputFormat[];
  outDir: string;
  quality: number;
  pattern: string;
  verbose: boolean;
}>;

export const getArguments = (): Arguments => {
  const { sizes, formats, outDir, quality, pattern, verbose } = yargs
    .option("sizes", {
      alias: "s",
      type: "array",
      description: "Output image sizes",
      demandOption: true
    })
    .option("formats", {
      alias: "f",
      type: "array",
      choices: OUTPUT_FORMAT_CHOICES,
      description: "Output images formats",
      demandOption: true
    })
    .option("outDir", {
      alias: "d",
      type: "string",
      description: "Output directory",
      default: "output"
    })
    .option("quality", {
      alias: "q",
      type: "number",
      description: "Output image quality",
      default: 90
    })
    .option("pattern", {
      alias: "p",
      type: "string",
      description: "Glob pattern",
      default: "**/*.jpeg"
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Verbose",
      default: false
    }).argv;

  return {
    sizes: sizes.map(size => parseInt(size.toString(), 10)),
    formats: formats.map(
      (format): OutputFormat => format.toString() as OutputFormat
    ),
    outDir,
    quality,
    pattern,
    verbose
  };
};
