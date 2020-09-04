"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductionBuild = void 0;
const logger_1 = require("./utils/logger");
/**
 * Create production bundle or build
 * @param options - Production build options
 */
async function createProductionBuild({ rollup, entryPoint, plugins, outputDirectory, rollupOptions, }) {
    const console = new logger_1.Logger("Production Build");
    console.log("Started", "PROCESS");
    console.log("Started building", "BUILD");
    const bundle = await rollup(Object.assign({
        input: entryPoint,
        context: "window",
        plugins,
    }, rollupOptions.input));
    console.log("Build completed", "BUILD");
    console.log("Writing to disk", "WRITE");
    bundle.write(Object.assign({
        dir: outputDirectory,
        format: "es",
        sourcemap: true,
    }, rollupOptions.output));
    console.log("Wrote to disk", "WRITE");
    console.log("Bundle created", "PROCESS");
}
exports.createProductionBuild = createProductionBuild;
//# sourceMappingURL=production.js.map