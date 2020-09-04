import type { Plugin, RollupError, RollupWatchOptions, watch } from "rollup";

import path from "path";
import c from "colorette";

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
        console.log("Build started");
        break;

      case "BUNDLE_END":
        const { duration, input, output } = event as {
          code: string;
          duration: number;
          input: string;
          output: string[];
        };

        const cwd = process.cwd();
        const inputRelative = c.gray(path.relative(cwd, input));
        const outputRelative = c.gray(
          output.map((p) => path.relative(cwd, p)).join(", ")
        );

        console.log(
          `${c.green(
            duration + "ms"
          )} Build completed. ${inputRelative} -> ${outputRelative}`
        );
        break;

      case "ERROR":
        console.log((event as { code: string; error: RollupError }).error);
        break;
    }
  });
}
