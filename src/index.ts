import colors from 'colors';
import fs from 'fs';
import jimp from 'jimp';
import yargs from 'yargs';
import { PWAIconsConfig } from './pwa-icons-config.interface';

const defaultIconInput = './icon.png';
const defaultIconOutput = './src/assets/icons';
const defaultFaviconOutput = './src';
const defaultSizes = '512, 384, 192, 152, 144, 128, 96, 72';
const defaultIconName = 'icon-*x*.png';

let iconInput = '';
let iconOutput = '';
let faviconOutput = '';
let sizesArray: number[] = [];
let iconName = '';
let iconSizes = '';
let isDryRun = false;

let pwaIconsConfig = {
  iconInput,
  iconOutput,
  faviconOutput,
  sizesArray,
  iconName,
  isDryRun,
};

const argumentValues = yargs(process.argv.slice(2))
  .usage('Generate Angular-PWA icons\nUsage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .version()
  .alias('version', 'v')
  .options({
    'dry-run': {
      alias: 'd',
      description: 'Run through without making any changes.',
    },
    icon: {
      alias: 'i',
      description: 'Input file',
      default: defaultIconInput,
      requiresArg: true,
      required: false,
    },
    output: {
      alias: 'o',
      description: 'Output folder',
      default: defaultIconOutput,
      requiresArg: true,
      required: false,
    },
    faviconOutput: {
      alias: 'fo',
      description: 'Output folder for favicon.ico',
      default: defaultFaviconOutput,
      requiresArg: true,
      required: false,
    },
    sizes: {
      alias: 's',
      description: 'Resize to',
      default: defaultSizes,
      requiresArg: true,
      required: false,
    },
    iconName: {
      alias: 'n',
      description: 'Output Icon name (replace wildcard * with size)',
      default: defaultIconName,
      requiresArg: true,
      required: false,
    },
  }).argv;

iconInput = argumentValues.icon ? argumentValues.icon : defaultIconInput;
iconOutput = argumentValues.output ? argumentValues.output : defaultIconOutput;
faviconOutput = argumentValues.faviconOutput
  ? argumentValues.faviconOutput
  : defaultFaviconOutput;
iconName = argumentValues.iconName ? argumentValues.iconName : defaultIconName;
isDryRun = argumentValues['dry-run'] ? true : false;
iconSizes = argumentValues.sizes ? argumentValues.sizes : defaultSizes;

const unfilteredSizesArray = iconSizes.split(' ').join(',').split(',');
sizesArray = unfilteredSizesArray.filter((size) => size !== '').map((size) => parseInt(size,10));

console.log('dry run:', isDryRun === false ? 'off' : 'on');

pwaIconsConfig = {
  ...pwaIconsConfig,
  iconInput,
  iconOutput,
  faviconOutput,
  sizesArray,
  iconName,
  isDryRun,
};

const generateIcons = (pwaIconsConfig: PWAIconsConfig) => {
  const { iconInput, iconName } = pwaIconsConfig;

  jimp
    .read(iconInput)
    .then((icon) => {
      const fileExtension = iconName.slice(
        ((iconName.lastIndexOf('.') - 1) >>> 0) + 2,
      );
      const inputFileExtension = iconInput.slice(
        ((iconInput.lastIndexOf('.') - 1) >>> 0) + 2,
      );
      createAssetIcons(pwaIconsConfig, icon, fileExtension);
    })
    .catch((error: string | unknown) => {
      console.log(colors.red(`✗  ${error}`));
    });
};

const createAssetIcons = (
  pwaIconConfig: PWAIconsConfig,
  icon: jimp,
  fileExtension: string,
) => {
  const { iconOutput, sizesArray, iconName, isDryRun } = pwaIconsConfig;

  if (fileExtension === 'png') {
    console.log(colors.blue(`⌛  Generating PWA icons`));

    sizesArray.forEach((size) => {
      const outputName = iconName.split('*').join(size.toString());
      const sizeNumber = size;
      const outputFolder = `${iconOutput}/${outputName}`;

      

      if (isDryRun === false) {
        icon.resize(sizeNumber, sizeNumber).write(outputFolder);
      }
      console.log(colors.green(`✓ ${outputFolder}`));
    });
  } else {
    console.log(colors.red(`✗  use file extension .png`));
  }
};

const iconExists = (iconPath: string): Promise<never | boolean> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(iconPath)) {
      console.log(colors.blue(`✓ '${iconPath}' exists.`));
      console.log(colors.blue('-'.repeat(process.stdout.columns)));
      resolve(true);
    } else {
      const error = `'${iconPath}' does not exist!`;
      reject(error);
    }
  });
};

iconExists(pwaIconsConfig.iconInput)
  .then(() => generateIcons(pwaIconsConfig))
  .catch((err) => console.log(colors.red(`✗  ${err}`)));
