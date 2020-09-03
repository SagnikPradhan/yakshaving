import type { rollup } from "rollup";
import type CommonJSPlugin from "@rollup/plugin-commonjs";
import type { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
import type ReplacePlugin from "@rollup/plugin-replace";

import path from "path";

import { Logger } from "../utils/logger";

export interface DependenciesBundleCreationOptions {
  rollup: typeof rollup;
  dependencies: string[];
  userRequire: NodeRequire;
  outputDirectory: string;
  pluginFactories: [
    typeof CommonJSPlugin,
    typeof NodeResolvePlugin,
    typeof ReplacePlugin
  ];
}

/**
 * Create dependencies bundle for the app
 * @param options - Dependencies bundle creation options
 * @returns Dependency map of locations relative to output directory
 */
export async function createDependenciesBundle({
  rollup,
  dependencies,
  userRequire,
  pluginFactories,
  outputDirectory,
}: DependenciesBundleCreationOptions): Promise<Record<string, string>> {
  const console = new Logger("Dependencies Bundle");
  console.log("Started", "PROCESS");

  const [commonJSPlugin, nodeResolvePlugin, replacePlugin] = pluginFactories;

  const entryPoints: Record<string, string> = {};

  for (const dependency of dependencies)
    entryPoints[dependency] = userRequire.resolve(dependency);

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
    dir: path.join(outputDirectory, "dependencies"),
    format: "es",
    entryFileNames: "[name].js",
    sourcemap: true,
    exports: "named",
  });

  console.log("Wrote to the disk", "WRITE");

  const dependencyMap = Object.fromEntries(
    dependencies.map((d) => [d, `./dependencies/${d}.js`])
  );

  console.log("Dependency bundle created", "PROCESS");

  return dependencyMap;
}
