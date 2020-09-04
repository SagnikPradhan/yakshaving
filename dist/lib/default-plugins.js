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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPlugins = void 0;
/**
 * Get default plugins
 * @param typescriptPluginOptions - Options for typescript plugin
 */
async function defaultPlugins(typescriptPluginOptions) {
    const pluginCommonJS = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-commonjs")))).default();
    const pluginNodeResolve = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-node-resolve")))).default({
        preferBuiltins: false,
        extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx", ".jsx"],
    });
    // @ts-expect-error Sucrase lacks types
    const pluginSucrase = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-sucrase")))).default({
        transforms: ["typescript", "jsx"],
    });
    const pluginTypescript = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-typescript")))).default(typescriptPluginOptions);
    const pluginReplace = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-replace")))).default({
        values: { "process.env.NODE_ENV": '"production"' },
    });
    const pluginTerser = (await Promise.resolve().then(() => __importStar(require("rollup-plugin-terser")))).terser();
    return {
        production: [
            pluginCommonJS,
            pluginNodeResolve,
            pluginReplace,
            pluginTypescript,
            pluginTerser,
        ],
        development: [pluginCommonJS, pluginNodeResolve, pluginSucrase],
    };
}
exports.defaultPlugins = defaultPlugins;
//# sourceMappingURL=default-plugins.js.map