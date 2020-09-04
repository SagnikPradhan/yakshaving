/// <reference types="node" />
import type { rollup } from "rollup";
import type CommonJSPlugin from "@rollup/plugin-commonjs";
import type { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
import type ReplacePlugin from "@rollup/plugin-replace";
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
export declare function createDependenciesBundle({ rollup, dependencies, userRequire, pluginFactories, outputDirectory, }: DependenciesBundleCreationOptions): Promise<Record<string, string>>;
