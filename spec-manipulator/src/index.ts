import { promises as fs } from 'fs';
import path from 'path';
import { jsXml } from 'json-xml-parse';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore if exists
  }
}

async function convertJsonFolderToXml(inputDir: string, outputDir: string) {
  await ensureDir(outputDir);
  const files = await fs.readdir(inputDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.json$/, '.xml'));
      try {
        const jsonContent = await fs.readFile(inputPath, 'utf-8');
        const jsonObj = JSON.parse(jsonContent);
        const xml = jsXml.toXmlString(jsonObj);
        await fs.writeFile(outputPath, xml, 'utf-8');
        console.log(`Converted: ${file} -> ${path.basename(outputPath)}`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
}

async function main() {
  const argv = await yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      description: 'Input folder containing JSON files',
      type: 'string',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      description: 'Output folder for XML files',
      type: 'string',
      demandOption: true,
    })
    .help()
    .alias('help', 'h')
    .argv;

  await convertJsonFolderToXml(argv.input, argv.output);
}

main();
