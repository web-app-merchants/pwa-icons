// import jimp from "jimp";
// import colors from "colors";
// import fs from "fs";
import yargs from 'yargs';


let defaultIconInput = './icon.png';
let defaultIconOutput = './src/assets/icons';
let defaultFaviconOutput = './src';
let defaultSizes = "512, 384, 192, 152, 144, 128, 96, 72";
let defaultIconName = 'icon-*x*.png';
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
      size: {
        alias: 's',
        description: 'Resize to',
        default: defaultSizes,
        requiresArg: true,
        required: false,
      },
      name: {
        alias: 'n',
        description: 'Icon names (replace wildcard * with size)',
        default: defaultIconName,
        requiresArg: true,
        required: false,
      },
}).argv;



// jimp.read();