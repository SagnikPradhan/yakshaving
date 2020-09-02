import type { Plugin, RollupWatchOptions, RollupWatcher, watch } from "rollup";

export interface ApplicationWatchModeOptions {
  watch: typeof watch;
  entryPoint: string;
  dependencyMap: Record<string, string>;
  outputDirectory: string;

  plugins: Plugin[];

  rollupOptions: RollupWatchOptions;
}

/**
 * Start watch mode on core application
 * @param options - Application watch mode options
 * @returns Rollup watcher
 */
export function startApplicationWatchMode({
  watch,
  entryPoint,
  plugins,
  dependencyMap,
  outputDirectory,
  rollupOptions,
}: ApplicationWatchModeOptions): RollupWatcher {
  return watch(
    Object.assign(
      {
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
      },
      rollupOptions
    )
  );
}
