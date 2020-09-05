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
export declare function defaultPlugins({ commonJS, nodeResolve, replace, sucrase, typescript, terser, development, production, }: DefaultPluginOptions): Promise<{
    production: Plugin[];
    development: Plugin[];
}>;
