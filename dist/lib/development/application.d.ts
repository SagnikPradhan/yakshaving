import type { Plugin, RollupWatchOptions, watch } from "rollup";
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
export declare function startApplicationWatchMode({ watch, entryPoint, plugins, dependencyMap, outputDirectory, rollupOptions, }: ApplicationWatchModeOptions): void;
