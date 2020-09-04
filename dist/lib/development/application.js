"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApplicationWatchMode = void 0;
const path_1 = __importDefault(require("path"));
const colorette_1 = __importDefault(require("colorette"));
const logger_1 = require("../utils/logger");
/**
 * Start watch mode on core application
 * @param options - Application watch mode options
 * @returns Rollup watcher
 */
function startApplicationWatchMode({ watch, entryPoint, plugins, dependencyMap, outputDirectory, rollupOptions, }) {
    const console = new logger_1.Logger("Application Bundle");
    const watcher = watch(Object.assign({
        input: entryPoint,
        context: "window",
        external: Object.keys(dependencyMap),
        plugins,
        output: {
            dir: outputDirectory,
            format: "es",
            sourcemap: true,
            paths: dependencyMap,
        },
        watch: {
            clearScreen: false,
        },
    }, rollupOptions));
    watcher.on("event", (event) => {
        const code = event.code;
        switch (code) {
            case "BUNDLE_START":
                console.log("Build started");
                break;
            case "BUNDLE_END":
                const { duration, input, output } = event;
                const cwd = process.cwd();
                const inputRelative = colorette_1.default.gray(path_1.default.relative(cwd, input));
                const outputRelative = colorette_1.default.gray(output.map((p) => path_1.default.relative(cwd, p)).join(", "));
                console.log(`${colorette_1.default.green(duration + "ms")} Build completed. ${inputRelative} -> ${outputRelative}`);
                break;
            case "ERROR":
                console.log(event.error);
                break;
        }
    });
}
exports.startApplicationWatchMode = startApplicationWatchMode;
//# sourceMappingURL=application.js.map