// import jimp from "jimp";
// import colors from "colors";
// import fs from "fs";
import yargs from 'yargs';


const defaultIconInput = './icon.png';
const defaultIconOutput = './src/assets/icons';
const defaultFaviconOutput = './src';
const defaultSizes = '512, 384, 192, 152, 144, 128, 96, 72';
const defaultIconName = 'icon-*x*.png';

let iconInput = '';
let iconOutput = '';
let faviconOutput = '';
let sizesArray = [];
let iconName = '';
let isDryRun = false;


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
faviconOutput = argumentValues.faviconOutput ? argumentValues.faviconOutput : defaultFaviconOutput;
iconName = argumentValues.iconName ? argumentValues.iconName : defaultIconName;
isDryRun = argumentValues['dry-run'] ? true : false;

console.log('dry run:', isDryRun === false ? 'off' : 'on');

if (argumentValues.size) {
  const iconSizes = '' + argumentValues.sizes;
  sizesArray = iconSizes.split(' ').join(',').split(',');
}



// jimp.read();