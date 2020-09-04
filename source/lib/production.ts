import type { OutputOptions, Plugin, rollup, RollupOptions } from "rollup";

import { Logger } from "./utils/logger";

export interface ProductionBuildOptions {
  rollup: typeof rollup;
  entryPoint: string;
  plugins: Plugin[];
  outputDirectory: string;

  rollupOptions: { input: RollupOptions; output: OutputOptions };
}

/**
 * Create production bundle or build
 * @param options - Production build options
 */
export async function createProductionBuild({
  rollup,
  entryPoint,
  plugins,
  outputDirectory,
  rollupOptions,
}: ProductionBuildOptions): Promise<void> {
  const console = new Logger("Production Build");

  console.log("Started", "PROCESS");
  console.log("Started building", "BUILD");

  const bundle = await rollup(
    Object.assign(
      {
        input: entryPoint,
        context: "window",
        plugins,
      },
      rollupOptions.input
    )
  );

  console.log("Build completed", "BUILD");
  console.log("Writing to disk", "WRITE");

  bundle.write(
    Object.assign(
      {
        dir: outputDirectory,
        format: "es",
        sourcemap: true,
      },
      rollupOptions.output
    )
  );

  console.log("Wrote to disk", "WRITE");
  console.log("Bundle created", "PROCESS");
}
