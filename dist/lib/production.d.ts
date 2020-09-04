import type { OutputOptions, Plugin, rollup, RollupOptions } from "rollup";
export interface ProductionBuildOptions {
    rollup: typeof rollup;
    entryPoint: string;
    plugins: Plugin[];
    outputDirectory: string;
    rollupOptions: {
        input: RollupOptions;
        output: OutputOptions;
    };
}
/**
 * Create production bundle or build
 * @param options - Production build options
 */
export declare function createProductionBuild({ rollup, entryPoint, plugins, outputDirectory, rollupOptions, }: ProductionBuildOptions): Promise<void>;
