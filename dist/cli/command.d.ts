import { Command } from "clipanion";
export declare class AppCommand extends Command {
    input?: string;
    outputDirectory?: string;
    configPath?: string;
    tsconfigPath: string;
    devMode: boolean;
    ignore: string[];
    execute(): Promise<void>;
    /**
     * Parses user manifest (package.json)
     * Creates helper functions and extracts other data
     */
    private parseUserManifest;
    /**
     * Get configuration, validate it and fill in the default values if any
     * @param userRoot - Users root directory
     */
    private getConfig;
    /**
     * Read user configuration and throw if invalid path
     * @param userRoot - Users root directory
     */
    private readUserConfig;
}
