"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var colors_1 = __importDefault(require("colors"));
var favicons_1 = __importDefault(require("favicons"));
var fs_1 = __importDefault(require("fs"));
var jimp_1 = __importDefault(require("jimp"));
var to_ico_1 = __importDefault(require("to-ico"));
var yargs_1 = __importDefault(require("yargs"));
var defaultProject = 'defaultProject';
var defaultIconInput = 'icon.png';
var defaultIconOutput = 'assets/icons';
var defaultFaviconOutput = './src';
var sizes = '512, 384, 192, 152, 144, 128, 96, 72';
var projectName = '';
var projectRootPath = '';
var iconInput = '';
var iconOutput = '';
var faviconOutput = '';
var sizesArray = [];
var isDryRun = false;
// TODO:Pull Request to add string[] to favicons Configuration interface
var faviconsConfig = {
    path: './src',
    icons: {
        android: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        appleIcon: ['apple-touch-icon.png'],
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
var pwaIconsConfig = {
    projectName: projectName,
    projectRootPath: projectRootPath,
    iconInput: iconInput,
    iconOutput: iconOutput,
    faviconOutput: faviconOutput,
    sizesArray: sizesArray,
    isDryRun: isDryRun,
};
var argumentValues = yargs_1.default(process.argv.slice(2))
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
    project: {
        alias: 'p',
        description: 'Project name as defined in angular.json',
        default: defaultProject,
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
}).argv;
iconInput = argumentValues.icon ? argumentValues.icon : defaultIconInput;
iconOutput = argumentValues.output ? argumentValues.output : defaultIconOutput;
faviconOutput = argumentValues.faviconOutput
    ? argumentValues.faviconOutput
    : defaultFaviconOutput;
projectName = argumentValues.project ? argumentValues.project : defaultProject;
isDryRun = argumentValues['dry-run'] ? true : false;
var unfilteredSizesArray = sizes.split(' ').join(',').split(',');
sizesArray = unfilteredSizesArray
    .filter(function (size) { return size !== ''; })
    .map(function (size) { return parseInt(size, 10); });
console.log('dry run: ', isDryRun === false ? 'off' : 'on');
pwaIconsConfig = __assign(__assign({}, pwaIconsConfig), { projectName: projectName,
    iconInput: iconInput,
    iconOutput: iconOutput,
    faviconOutput: faviconOutput,
    sizesArray: sizesArray,
    isDryRun: isDryRun });
var getProjectPath = function (pwaIconConfig) {
    var projectName = '';
    try {
        var angularWorkspace = JSON.parse(fs_1.default.readFileSync('angular.json').toString());
        if (pwaIconsConfig.projectName === 'defaultProject') {
            projectName = angularWorkspace['defaultProject'];
            console.log(colors_1.default.cyan("\uD83D\uDEC8  Using default project: " + projectName));
        }
        else {
            projectName = pwaIconsConfig.projectName;
            console.log(colors_1.default.cyan("\uD83D\uDEC8  Using project: " + projectName));
        }
        projectRootPath = angularWorkspace.projects[projectName].root;
        pwaIconsConfig = __assign(__assign({}, pwaIconsConfig), { projectName: projectName,
            projectRootPath: projectRootPath, iconInput: "./" + projectRootPath + "/" + iconInput, faviconOutput: "./" + projectRootPath, iconOutput: "./" + projectRootPath + "/" + iconOutput });
        iconExists(pwaIconsConfig.iconInput);
    }
    catch (_a) {
        if (projectName === '') {
            console.log(colors_1.default.cyan("\uD83D\uDEC8  No 'angular.json' found in workspace, using fallback path"));
            iconExists(pwaIconsConfig.iconInput);
        }
        else {
            console.log(colors_1.default.cyan("\uD83D\uDEC8  Project '" + projectName + "' not found in workspace, using fallback path"));
            iconExists(pwaIconsConfig.iconInput);
        }
        pwaIconsConfig = __assign(__assign({}, pwaIconsConfig), { iconInput: "./" + iconInput, iconOutput: "./src/" + iconOutput, faviconOutput: faviconOutput });
    }
    generateIcons(pwaIconsConfig);
};
var generateIcons = function (pwaIconsConfig) {
    var iconInput = pwaIconsConfig.iconInput, faviconOutput = pwaIconsConfig.faviconOutput, isDryRun = pwaIconsConfig.isDryRun;
    jimp_1.default.read(iconInput).then(function (icon) {
        var inputFileExtension = getFileExtension(iconInput);
        faviconsConfig = __assign(__assign({}, faviconsConfig), { path: faviconOutput });
        if (inputFileExtension === 'png') {
            createAssetIcons(pwaIconsConfig, icon);
            if (isDryRun === false) {
                createFavicons(iconInput, faviconOutput);
            }
        }
        else {
            console.log(colors_1.default.red("\u2717  use file extension .png"));
        }
    });
};
var createAssetIcons = function (pwaIconConfig, icon) {
    var iconOutput = pwaIconConfig.iconOutput, sizesArray = pwaIconConfig.sizesArray, isDryRun = pwaIconConfig.isDryRun;
    console.log(colors_1.default.blue("\u231B Generating PWA icons"));
    sizesArray.forEach(function (size) {
        var outputName = "icon-" + size.toString() + "x" + size.toString() + ".png";
        var outputFolder = iconOutput + "/" + outputName;
        if (isDryRun === false) {
            icon.resize(size, size).write(outputFolder);
        }
        console.log(colors_1.default.green("\u2713 " + outputFolder));
    });
    if (isDryRun === true) {
        console.log(colors_1.default.yellow("\u2605 Finished"));
        console.log(colors_1.default.cyan("\uD83D\uDEC8  Run with \"dry run\" favicons disabled, no changes were made."));
    }
};
var createFavicons = function (iconInput, faviconOutput) {
    favicons_1.default(iconInput, faviconsConfig)
        .then(function (response) {
        console.log(colors_1.default.blue("\u231B  Generating Favicons"));
        response.images.map(function (image) {
            fs_1.default.writeFileSync(faviconOutput + "/" + image.name, image.contents);
        });
        console.log(colors_1.default.green("\u2713 " + faviconOutput + "/apple-touch-icon.png"));
        generateIcoFile(faviconOutput);
    })
        .catch(function (error) {
        console.log(colors_1.default.red("\u2717 favicon error: " + error.message));
    });
};
var updateAngularJSON = function (pwaIconsConfig) {
    try {
        var angularWorkspace = JSON.parse(fs_1.default.readFileSync('angular.json').toString());
        var assetsArray = angularWorkspace.projects[pwaIconsConfig.projectName].architect.build.options.assets;
        var appleTouchIcon = pwaIconsConfig.projectRootPath + "/apple-touch-icon.png";
        if (assetsArray.includes(appleTouchIcon)) {
            console.log(colors_1.default.yellow("\u2605 Finished"));
        }
        else {
            angularWorkspace.projects[pwaIconsConfig.projectName].architect.build.options.assets.push(appleTouchIcon);
            fs_1.default.writeFileSync('angular.json', JSON.stringify(angularWorkspace, null, 2));
            console.log(colors_1.default.green("\u2713 'angular.json' updated"));
            console.log(colors_1.default.yellow("\u2605 Finished"));
        }
    }
    catch (_a) {
        console.log(colors_1.default.yellow("\u2605 Finished"));
    }
};
var generateIcoFile = function (faviconOutput) {
    var contents = [
        fs_1.default.readFileSync(faviconOutput + "/favicon-16x16.png"),
        fs_1.default.readFileSync(faviconOutput + "/favicon-32x32.png"),
        fs_1.default.readFileSync(faviconOutput + "/favicon-48x48.png"),
    ];
    var paths = [
        faviconOutput + "/favicon-16x16.png",
        faviconOutput + "/favicon-32x32.png",
        faviconOutput + "/favicon-48x48.png",
    ];
    to_ico_1.default(contents).then(function (content) {
        fs_1.default.writeFileSync(faviconOutput + "/favicon.ico", content);
        paths.map(function (path) {
            fs_1.default.unlinkSync(path);
        });
        console.log(colors_1.default.green("\u2713 " + faviconOutput + "/favicon.ico"));
        updateAngularJSON(pwaIconsConfig);
    });
};
var getFileExtension = function (iconInput) {
    return iconInput.slice(((iconInput.lastIndexOf('.') - 1) >>> 0) + 2);
};
var iconExists = function (iconPath) {
    if (fs_1.default.existsSync(iconPath)) {
        console.log(colors_1.default.blue("\u2713 '" + iconPath + "' exists."));
        console.log(colors_1.default.blue('-'.repeat(process.stdout.columns)));
    }
    else {
        var error = "'" + iconPath + "' does not exist!";
        console.log(colors_1.default.red("\u2717  " + error));
    }
};
getProjectPath(pwaIconsConfig);
