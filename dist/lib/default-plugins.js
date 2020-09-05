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
 * @param options - Override default plugin configuration
 */
async function defaultPlugins({ commonJS, nodeResolve, replace, sucrase, typescript, terser, development, production, }) {
    // Use of dynamic imports cause these are optional depedencies
    const PluginCommonJS = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-commonjs")))).default;
    const PluginNodeResolve = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-node-resolve"))))
        .default;
    // @ts-expect-error Sucrase lacks types
    const PluginSucrase = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-sucrase")))).default;
    const PluginTypescript = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-typescript")))).default;
    const PluginReplace = (await Promise.resolve().then(() => __importStar(require("@rollup/plugin-replace")))).default;
    const PluginTerser = (await Promise.resolve().then(() => __importStar(require("rollup-plugin-terser")))).terser;
    const merge = Object.assign;
    const defaultNodeResolveConfig = {
        extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
        preferBuiltins: false,
    };
    return {
        production: [
            PluginCommonJS(merge({}, commonJS, production === null || production === void 0 ? void 0 : production.commonJS)),
            PluginNodeResolve(merge(defaultNodeResolveConfig, nodeResolve, production === null || production === void 0 ? void 0 : production.nodeResolve)),
            PluginReplace(merge({ values: { "process.env.NODE_ENV": '"production"' } }, replace, production === null || production === void 0 ? void 0 : production.replace)),
            PluginTypescript(merge({}, typescript, production === null || production === void 0 ? void 0 : production.typescript)),
            PluginTerser(merge({}, terser, production === null || production === void 0 ? void 0 : production.terser)),
        ],
        development: [
            PluginCommonJS(merge({}, commonJS, development === null || development === void 0 ? void 0 : development.commonJS)),
            PluginNodeResolve(merge(defaultNodeResolveConfig, nodeResolve, development === null || development === void 0 ? void 0 : development.nodeResolve)),
            PluginSucrase(merge({ transforms: ["typescript", "jsx"] }, sucrase, development === null || development === void 0 ? void 0 : development.sucrase)),
        ],
    };
}
exports.defaultPlugins = defaultPlugins;
//# sourceMappingURL=default-plugins.js.map