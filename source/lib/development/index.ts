import { Plugin, rollup, RollupWatchOptions, watch } from "rollup";

import CommonJSPlugin from "@rollup/plugin-commonjs";
import { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
import ReplacePlugin from "@rollup/plugin-replace";

import { startApplicationWatchMode } from "./application";
import { createDependenciesBundle } from "./dependencies";

export interface DevelopmentModeOptions {
  entryPoint: string;
  dependencies: string[];
  outputDirectory: string;

  userRequire: NodeRequire;
  pluginsForApp: Plugin[];
  appRollupOptions: RollupWatchOptions;
}

/**
 * Start development mode. Creates dependency bundle
 * and starts watch mode on core application
 * using default settings for dependency bundle only
 * @param options - Development mode options
 */
export async function startDevelopmentMode({
  dependencies,
  outputDirectory,
  userRequire,

  entryPoint,
  appRollupOptions,
  pluginsForApp,
}: DevelopmentModeOptions): Promise<void> {
  const dependencyMap = await createDependenciesBundle({
    dependencies,
    outputDirectory,
    pluginFactories: [CommonJSPlugin, NodeResolvePlugin, ReplacePlugin],
    rollup,
    userRequire,
  });

  await startApplicationWatchMode({
    watch,
    dependencyMap,
    entryPoint,
    outputDirectory,
    plugins: pluginsForApp,
    rollupOptions: appRollupOptions,
  });
}

export * from "./dependencies";
export * from "./application";
