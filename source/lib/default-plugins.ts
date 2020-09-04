import type { Plugin } from "rollup";

import type { RollupCommonJSOptions } from "@rollup/plugin-commonjs";
import type { RollupNodeResolveOptions } from "@rollup/plugin-node-resolve";
import type typescriptPlugin from "@rollup/plugin-typescript";
import type { RollupReplaceOptions } from "@rollup/plugin-replace";
import type { Options as TerserOptions } from "rollup-plugin-terser";

export interface MergedPluginOptions {
  commonJS?: RollupCommonJSOptions;
  nodeResolve?: RollupNodeResolveOptions;
  typescript?: Parameters<typeof typescriptPlugin>[0];
  sucrase?: Record<string, unknown>;
  replace?: RollupReplaceOptions;
  terser?: TerserOptions;
}

export interface DefaultPluginOptions extends MergedPluginOptions {
  development?: Omit<MergedPluginOptions, "typescript" | "terser" | "replace">;
  production?: Omit<MergedPluginOptions, "sucrase">;
}

/**
 * Get default plugins
 * @param options - Override default plugin configuration
 */
export async function defaultPlugins({
  commonJS,
  nodeResolve,
  replace,
  sucrase,
  typescript,
  terser,
  development,
  production,
}: DefaultPluginOptions): Promise<{
  production: Plugin[];
  development: Plugin[];
}> {
  // Use of dynamic imports cause these are optional depedencies
  const PluginCommonJS = (await import("@rollup/plugin-commonjs")).default;
  const PluginNodeResolve = (await import("@rollup/plugin-node-resolve"))
    .default;
  // @ts-expect-error Sucrase lacks types
  const PluginSucrase = (await import("@rollup/plugin-sucrase")).default;
  const PluginTypescript = (await import("@rollup/plugin-typescript")).default;
  const PluginReplace = (await import("@rollup/plugin-replace")).default;
  const PluginTerser = (await import("rollup-plugin-terser")).terser;

  const merge = Object.assign;

  const defaultNodeResolveConfig = {
    extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
    preferBuiltins: false,
  };

  return {
    production: [
      PluginCommonJS(merge({}, commonJS, production?.commonJS)),
      PluginNodeResolve(
        merge(defaultNodeResolveConfig, nodeResolve, production?.nodeResolve)
      ),
      PluginReplace(
        merge(
          { values: { "process.env.NODE_ENV": '"production"' } },
          replace,
          production?.replace
        )
      ),
      PluginTypescript(merge({}, typescript, production?.typescript)),
      PluginTerser(merge({}, terser, production?.terser)),
    ],

    development: [
      PluginCommonJS(merge({}, commonJS, development?.commonJS)),
      PluginNodeResolve(
        merge(defaultNodeResolveConfig, nodeResolve, development?.nodeResolve)
      ),
      PluginSucrase(
        merge(
          { transforms: ["typescript", "jsx"] },
          sucrase,
          development?.sucrase
        )
      ),
    ],
  };
}
