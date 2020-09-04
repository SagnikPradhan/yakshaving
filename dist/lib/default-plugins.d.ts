import type { Plugin } from "rollup";
import type typescriptPlugin from "@rollup/plugin-typescript";
/**
 * Get default plugins
 * @param typescriptPluginOptions - Options for typescript plugin
 */
export declare function defaultPlugins(typescriptPluginOptions: Parameters<typeof typescriptPlugin>[0]): Promise<{
    production: Plugin[];
    development: Plugin[];
}>;
