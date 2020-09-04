/// <reference types="node" />
import { Plugin, RollupWatchOptions } from "rollup";
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
export declare function startDevelopmentMode({ dependencies, outputDirectory, userRequire, entryPoint, appRollupOptions, pluginsForApp, }: DevelopmentModeOptions): Promise<void>;
export * from "./dependencies";
export * from "./application";
