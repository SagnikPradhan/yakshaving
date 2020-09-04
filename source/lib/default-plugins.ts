import type { Plugin } from "rollup";
import type typescriptPlugin from "@rollup/plugin-typescript";

/**
 * Get default plugins
 * @param typescriptPluginOptions - Options for typescript plugin
 */
export async function defaultPlugins(
  typescriptPluginOptions: Parameters<typeof typescriptPlugin>[0]
): Promise<{ production: Plugin[]; development: Plugin[] }> {
  const pluginCommonJS = (await import("@rollup/plugin-commonjs")).default();

  const pluginNodeResolve = (
    await import("@rollup/plugin-node-resolve")
  ).default({
    preferBuiltins: false,
    extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx", ".jsx"],
  });

  // @ts-expect-error Sucrase lacks types
  const pluginSucrase = (await import("@rollup/plugin-sucrase")).default({
    transforms: ["typescript", "jsx"],
  });

  const pluginTypescript = (await import("@rollup/plugin-typescript")).default(
    typescriptPluginOptions
  );

  const pluginReplace = (await import("@rollup/plugin-replace")).default({
    values: { "process.env.NODE_ENV": '"production"' },
  });

  const pluginTerser = (await import("rollup-plugin-terser")).terser();

  return {
    production: [
      pluginCommonJS,
      pluginNodeResolve,
      pluginReplace,
      pluginTypescript,
      pluginTerser,
    ],
    development: [pluginCommonJS, pluginNodeResolve, pluginSucrase],
  };
}
