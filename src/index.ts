import colors from 'colors';
import favicons from 'favicons';
import fs from 'fs';
import jimp from 'jimp';
import toIco from 'to-ico';
import yargs from 'yargs';
import { PWAIconsConfig } from './pwa-icons-config.interface';

const defaultIconInput = './icon.png';
const defaultIconOutput = './src/assets/icons';
const defaultFaviconOutput = './src';
const sizes = '512, 384, 192, 152, 144, 128, 96, 72';

let iconInput = '';
let iconOutput = '';
let faviconOutput = '';
let sizesArray: number[] = [];
let isDryRun = false;

// TODO:Pull Request to add string[] to favicons Configuration interface
let faviconsConfig: favicons.Configuration = {
  path: './src',
  icons: {
    android: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    appleIcon: ['apple-touch-icon.png'], // eslint-disable-line
    appleStartup: false,
    coast: false,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    favicons: ['favicon-48x48.png', 'favicon-32x32.png', 'favicon-16x16.png'],
    firefox: false,
    windows: false,
    yandex: false,
  },
};

let pwaIconsConfig = {
  iconInput,
  iconOutput,
  faviconOutput,
  sizesArray,
  isDryRun
};

const argumentValues = yargs(process.argv.slice(2))
  .usage('Generate default @angular/pwa icon set for angular projects using a custom .png icon.\nUsage: $0 [options]')
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
    }
  }).argv;

iconInput = argumentValues.icon ? argumentValues.icon : defaultIconInput;
iconOutput = argumentValues.output ? argumentValues.output : defaultIconOutput;
faviconOutput = argumentValues.faviconOutput ? argumentValues.faviconOutput: defaultFaviconOutput;
isDryRun = argumentValues['dry-run'] ? true : false;

const unfilteredSizesArray = sizes.split(' ').join(',').split(',');
sizesArray = unfilteredSizesArray
  .filter((size) => size !== '')
  .map((size) => parseInt(size, 10));

console.log('dry run: ', isDryRun === false ? 'off' : 'on');

pwaIconsConfig = {
  ...pwaIconsConfig,
  iconInput,
  iconOutput,
  faviconOutput,
  sizesArray,
  isDryRun,
};

const generateIcons = (pwaIconsConfig: PWAIconsConfig) => {
  const { iconInput, faviconOutput, isDryRun } = pwaIconsConfig;

  jimp.read(iconInput).then((icon) => {
    const inputFileExtension = getFileExtension(iconInput);
    faviconsConfig = { ...faviconsConfig, path: faviconOutput };

    if (inputFileExtension === 'png') {
      createAssetIcons(pwaIconsConfig, icon);
      if (isDryRun === false) { createFavicons(iconInput, faviconOutput); }
    } else {
      console.log(colors.red(`✗  use file extension .png`));
    }

  });
};

const createAssetIcons = (
  pwaIconConfig: PWAIconsConfig,
  icon: jimp,
) => {
  const { iconOutput, sizesArray, isDryRun } = pwaIconConfig;
    console.log(colors.blue(`⌛ Generating PWA icons`));

    sizesArray.forEach((size) => {
      const outputName =   `icon-${size.toString()}x${size.toString()}.png`;
      const outputFolder = `${iconOutput}/${outputName}`;

      if (isDryRun === false) {
        icon.resize(size, size).write(outputFolder);
      }
        console.log(colors.green(`✓ ${outputFolder}`));
    });

    if (isDryRun === true) {
      console.log(colors.yellow(`★ Finished`));
      console.log(colors.cyan(`🛈 Run with "dry run" favicons disabled, no changes were made.`));
  }
  
};

const createFavicons = (iconInput: string, faviconOutput: string) => {

  favicons(iconInput, faviconsConfig)
    .then((response) => {
      console.log(colors.blue(`⌛  Generating Favicons`));

      response.images.map((image) => {
          fs.writeFileSync(`${faviconOutput}/${image.name}`, image.contents);
      });

      console.log(colors.green(`✓ ${faviconOutput}/apple-touch-icon.png`));
      generateIcoFile(faviconOutput);
    })
    .catch((error: Error) => {
      console.log(colors.red(`✗ favicon error: ${error.message}`));
    });
    
};



const generateIcoFile = (faviconOutput: string) => {

      const contents = [
        fs.readFileSync(`${faviconOutput}/favicon-16x16.png`),
        fs.readFileSync(`${faviconOutput}/favicon-32x32.png`),
        fs.readFileSync(`${faviconOutput}/favicon-48x48.png`),
      ];
  
      const paths = [
        `${faviconOutput}/favicon-16x16.png`,
        `${faviconOutput}/favicon-32x32.png`,
        `${faviconOutput}/favicon-48x48.png`,
      ];
    
  
    toIco(contents).then((content) => {

      fs.writeFileSync(`${faviconOutput}/favicon.ico`, content);
      
      paths.map((path) => {
        fs.unlinkSync(path);
      });
    
      console.log(colors.green(`✓ ${faviconOutput}/favicon.ico`));
      console.log(colors.yellow(`★ Finished`));
    });
  };

const getFileExtension = (iconInput: string): string => {
  return iconInput.slice(((iconInput.lastIndexOf('.') - 1) >>> 0) + 2);
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
