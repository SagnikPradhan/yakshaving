import type { Plugin, RollupWatchOptions, watch } from "rollup";

import { Logger } from "../utils/logger";

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
}: ApplicationWatchModeOptions): void {
  const console = new Logger("Application Bundle");

  const watcher = watch(
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

  watcher.on("event", (event) => {
    const code = event.code;

    switch (code) {
      case "BUNDLE_START":
        console.log("Build started", "BUILD");
        break;

      case "BUNDLE_END":
        console.log("Build completed", "BUILD");
    }
  });
}
