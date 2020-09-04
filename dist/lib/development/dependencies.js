"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDependenciesBundle = void 0;
const path_1 = __importDefault(require("path"));
const logger_1 = require("../utils/logger");
/**
 * Get esm entry point of a dependency
 * @param name - Id of dependency
 * @param userRequire - Users require
 */
function getEntryPointPath(name, userRequire) {
    const root = (...args) => path_1.default.join(name, ...args);
    const { main, module, type } = userRequire(root("package.json"));
    // Preference
    // 1. main field, if module
    // 2. module field
    // 3. main field
    const depPath = userRequire.resolve(root(type === "module" ? main : module || main));
    return depPath;
}
/**
 * Create dependencies bundle for the app
 * @param options - Dependencies bundle creation options
 * @returns Dependency map of locations relative to output directory
 */
async function createDependenciesBundle({ rollup, dependencies, userRequire, pluginFactories, outputDirectory, }) {
    const console = new logger_1.Logger("Dependencies Bundle");
    console.log("Started", "PROCESS");
    const [commonJSPlugin, nodeResolvePlugin, replacePlugin] = pluginFactories;
    const entryPoints = {};
    for (const dependency of dependencies)
        entryPoints[dependency] = getEntryPointPath(dependency, userRequire);
    console.log(`Found ${Object.keys(entryPoints).length} dependencies`);
    console.log(`Started building`, "BUILD");
    const bundle = await rollup({
        input: entryPoints,
        context: "window",
        plugins: [
            commonJSPlugin(),
            nodeResolvePlugin({ preferBuiltins: false }),
            replacePlugin({ values: { "process.env.NODE_ENV": "'development'" } }),
        ],
    });
    console.log("Building done", "BUILD");
    console.log("Started writing to disk", "WRITE");
    await bundle.write({
        dir: path_1.default.join(outputDirectory, "dependencies"),
        format: "es",
        entryFileNames: "[name].js",
        sourcemap: true,
        exports: "named",
    });
    console.log("Wrote to the disk", "WRITE");
    const dependencyMap = Object.fromEntries(dependencies.map((d) => [d, `./dependencies/${d}.js`]));
    console.log("Dependency bundle created", "PROCESS");
    return dependencyMap;
}
exports.createDependenciesBundle = createDependenciesBundle;
//# sourceMappingURL=dependencies.js.map