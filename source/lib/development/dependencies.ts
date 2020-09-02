import type { rollup } from "rollup";
import type CommonJSPlugin from "@rollup/plugin-commonjs";
import type { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
import type ReplacePlugin from "@rollup/plugin-replace";

import path from "path";

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
  const [commonJSPlugin, nodeResolvePlugin, replacePlugin] = pluginFactories;

  const entryPoints: Record<string, string> = {};

  for (const dependency of dependencies)
    entryPoints[dependency] = userRequire.resolve(dependency);

  const bundle = await rollup({
    input: entryPoints,
    context: "window",
    plugins: [
      commonJSPlugin(),
      nodeResolvePlugin({ preferBuiltins: false }),
      replacePlugin({ values: { "process.env.NODE_ENV": "'development'" } }),
    ],
  });

  await bundle.write({
    dir: path.join(outputDirectory, "dependencies"),
    format: "es",
    entryFileNames: "[name].js",
    sourcemap: true,
    exports: "named",
  });

  const dependencyMap = Object.fromEntries(
    dependencies.map((d) => [d, `./dependencies/${d}.js`])
  );

  return dependencyMap;
}
