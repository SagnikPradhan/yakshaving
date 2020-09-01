import type { OutputOptions, Plugin, rollup, RollupOptions } from "rollup";

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
}: ProductionBuildOptions) {
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

  return bundle.write(
    Object.assign(
      {
        dir: outputDirectory,
        format: "es",
        sourcemap: true,
      },
      rollupOptions.output
    )
  );
}
