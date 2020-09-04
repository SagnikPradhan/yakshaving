"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDevelopmentMode = void 0;
const rollup_1 = require("rollup");
const plugin_commonjs_1 = __importDefault(require("@rollup/plugin-commonjs"));
const plugin_node_resolve_1 = require("@rollup/plugin-node-resolve");
const plugin_replace_1 = __importDefault(require("@rollup/plugin-replace"));
const application_1 = require("./application");
const dependencies_1 = require("./dependencies");
/**
 * Start development mode. Creates dependency bundle
 * and starts watch mode on core application
 * using default settings for dependency bundle only
 * @param options - Development mode options
 */
async function startDevelopmentMode({ dependencies, outputDirectory, userRequire, entryPoint, appRollupOptions, pluginsForApp, }) {
    const dependencyMap = await dependencies_1.createDependenciesBundle({
        dependencies,
        outputDirectory,
        pluginFactories: [plugin_commonjs_1.default, plugin_node_resolve_1.nodeResolve, plugin_replace_1.default],
        rollup: rollup_1.rollup,
        userRequire,
    });
    await application_1.startApplicationWatchMode({
        watch: rollup_1.watch,
        dependencyMap,
        entryPoint,
        outputDirectory,
        plugins: pluginsForApp,
        rollupOptions: appRollupOptions,
    });
}
exports.startDevelopmentMode = startDevelopmentMode;
__exportStar(require("./dependencies"), exports);
__exportStar(require("./application"), exports);
//# sourceMappingURL=index.js.map