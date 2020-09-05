"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppCommand = void 0;
const clipanion_1 = require("clipanion");
const rollup_1 = require("rollup");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const module_1 = __importDefault(require("module"));
const error_1 = require("../lib/utils/error");
const logger_1 = require("../lib/utils/logger");
const lib_1 = require("../lib");
class AppCommand extends clipanion_1.Command {
    constructor() {
        super(...arguments);
        this.tsconfigPath = "tsconfig.json";
        this.devMode = false;
        this.ignore = [];
    }
    async execute() {
        const console = new logger_1.Logger("Root");
        console.log("Starting Up!");
        try {
            const userManifest = await this.parseUserManifest();
            console.log(`Found package.json at ${userManifest.path.dir}`);
            const userConfig = await this.getConfig(userManifest.path.dir);
            console.log(userConfig);
            const userRoot = (...args) => path_1.default.join(userManifest.path.dir, ...args);
            const entryPoint = userRoot(userConfig.input);
            const outputDirectory = userRoot(userConfig.outputDirectory);
            if (this.devMode)
                await lib_1.startDevelopmentMode({
                    entryPoint,
                    outputDirectory,
                    dependencies: Object.keys(userManifest.content.dependencies),
                    userRequire: userManifest.require,
                    appRollupOptions: {},
                    pluginsForApp: userConfig.plugins.development,
                });
            else
                await lib_1.createProductionBuild({
                    rollup: rollup_1.rollup,
                    entryPoint,
                    outputDirectory,
                    rollupOptions: { input: {}, output: {} },
                    plugins: userConfig.plugins.production,
                });
        }
        catch (err) {
            error_1.handleError(err, console);
        }
    }
    /**
     * Parses user manifest (package.json)
     * Creates helper functions and extracts other data
     */
    async parseUserManifest() {
        const packageJsonPath = path_1.default.resolve(process.cwd(), "package.json");
        if (!fs_1.default.existsSync(packageJsonPath))
            throw new error_1.LibraryError("package.json not found", {
                isOperational: false,
                description: "Please run the command in workspace root.",
            });
        const parsedPackageJsonPath = path_1.default.parse(packageJsonPath);
        const packageJson = await Promise.resolve().then(() => __importStar(require(packageJsonPath)));
        return {
            path: parsedPackageJsonPath,
            content: packageJson,
            require: module_1.default.createRequire(packageJsonPath),
        };
    }
    /**
     * Get configuration, validate it and fill in the default values if any
     * @param userRoot - Users root directory
     */
    async getConfig(userRoot) {
        var _a, _b, _c;
        // Load users config file if any
        const { input, ignore, outputDirectory, plugins, } = await this.readUserConfig(userRoot);
        // Combine CLI arguments and config
        const config = {
            input: (_a = this.input) !== null && _a !== void 0 ? _a : input,
            ignore: (_b = this.ignore) !== null && _b !== void 0 ? _b : ignore,
            outputDirectory: (_c = this.outputDirectory) !== null && _c !== void 0 ? _c : outputDirectory,
            plugins: plugins !== null && plugins !== void 0 ? plugins : (await lib_1.defaultPlugins({
                typescript: { tsconfig: path_1.default.resolve(userRoot, this.tsconfigPath) },
            })),
        };
        // Validate config
        for (const [key, value] of Object.entries(config)) {
            if (value === undefined)
                throw new error_1.LibraryError(`Found "${key}" undefined in configuration`, {
                    isOperational: false,
                    description: "Was expecting the property to be defined. Please use the CLI Flags or config.",
                });
        }
        return config;
    }
    /**
     * Read user configuration and throw if invalid path
     * @param userRoot - Users root directory
     */
    async readUserConfig(userRoot) {
        if (this.configPath === undefined)
            return {};
        const configPath = path_1.default.isAbsolute(this.configPath)
            ? this.configPath
            : path_1.default.resolve(userRoot, this.configPath);
        // Throw if file doesnt exist
        if (fs_1.default.existsSync(configPath)) {
            const parsedPath = path_1.default.parse(configPath);
            // Throw if file isnt valid type
            if (![".ts", ".js"].includes(parsedPath.ext))
                throw new error_1.LibraryError("Invalid config file", {
                    isOperational: false,
                    description: "Configuration file can only be a Javascript or Typescript file",
                });
            // Register ts-node for ts config file
            if (parsedPath.ext === ".ts")
                (await Promise.resolve().then(() => __importStar(require("ts-node")))).register();
            const config = (await Promise.resolve().then(() => __importStar(require(configPath)))).default;
            // Validate file
            if (typeof config === "function")
                return await config();
            else if (typeof config === "object")
                return config;
            else
                throw new error_1.LibraryError("Invalid config file", {
                    isOperational: false,
                    description: "Found no valid default export",
                });
        }
        else
            throw new error_1.LibraryError("Invalid config path", {
                isOperational: false,
                description: "Configuration file does not exist in the specified path",
                configPath,
            });
    }
}
AppCommand.usage = clipanion_1.Command.Usage({
    description: "Build bundle",
    details: "Builds your bundle using CLI Arguments and configuration file.",
    examples: [
        ["Simplest way to use the CLI", "$0 source/index.ts dist"],
        ["Using a configuration file", "$0 -c config.ts"],
        ["Running in development mode", "$0 -c config.ts --dev"],
        ["Ignoring certain depedencies", "$0 -i pages -c config.ts --dev"],
    ],
});
__decorate([
    clipanion_1.Command.String({ required: false })
], AppCommand.prototype, "input", void 0);
__decorate([
    clipanion_1.Command.String({ required: false })
], AppCommand.prototype, "outputDirectory", void 0);
__decorate([
    clipanion_1.Command.String("--config,-c")
], AppCommand.prototype, "configPath", void 0);
__decorate([
    clipanion_1.Command.String("--tsconfig")
], AppCommand.prototype, "tsconfigPath", void 0);
__decorate([
    clipanion_1.Command.Boolean("--dev,-d")
], AppCommand.prototype, "devMode", void 0);
__decorate([
    clipanion_1.Command.Array("--ignore,-i")
], AppCommand.prototype, "ignore", void 0);
__decorate([
    clipanion_1.Command.Path("build")
], AppCommand.prototype, "execute", null);
exports.AppCommand = AppCommand;
//# sourceMappingURL=command.js.map