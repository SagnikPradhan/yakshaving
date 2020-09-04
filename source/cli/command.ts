import { Command } from "clipanion";
import { rollup } from "rollup";

import path from "path";
import fs from "fs";
import module from "module";

import { handleError, LibraryError } from "../lib/utils/error";
import { Logger } from "../lib/utils/logger";
import {
  Config,
  startDevelopmentMode,
  createProductionBuild,
  defaultPlugins,
} from "../lib";

export class AppCommand extends Command {
  @Command.String({ required: false })
  public input?: string;

  @Command.String({ required: false })
  public outputDirectory?: string;

  @Command.String("--config,-c")
  public configPath?: string;

  @Command.String("--tsconfig")
  public tsconfigPath = "tsconfig.json";

  @Command.Boolean("--dev,-d")
  public devMode = false;

  @Command.Array("--ignore,-i")
  public ignore: string[] = [];

  @Command.Path()
  async execute(): Promise<void> {
    const console = new Logger("Root");
    console.log("Starting Up!");

    try {
      const userManifest = await this.parseUserManifest<{
        dependencies: Record<string, string>;
      }>();
      console.log(`Found package.json at ${userManifest.path.dir}`);

      const userConfig = await this.getConfig(userManifest.path.dir);
      console.log(userConfig);

      const userRoot = (...args: string[]) =>
        path.join(userManifest.path.dir, ...args);

      const entryPoint = userRoot(userConfig.input);
      const outputDirectory = userRoot(userConfig.outputDirectory);

      if (this.devMode)
        await startDevelopmentMode({
          entryPoint,
          outputDirectory,
          dependencies: Object.keys(userManifest.content.dependencies),
          userRequire: userManifest.require,
          appRollupOptions: {},
          pluginsForApp: userConfig.plugins.development,
        });
      else
        await createProductionBuild({
          rollup,
          entryPoint,
          outputDirectory,
          rollupOptions: { input: {}, output: {} },
          plugins: userConfig.plugins.production,
        });
    } catch (err) {
      handleError(err, console);
    }
  }

  /**
   * Parses user manifest (package.json)
   * Creates helper functions and extracts other data
   */
  private async parseUserManifest<T extends unknown>() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");

    if (!fs.existsSync(packageJsonPath))
      throw new LibraryError("package.json not found", {
        isOperational: false,
        description: "Please run the command in workspace root.",
      });

    const parsedPackageJsonPath = path.parse(packageJsonPath);
    const packageJson: T = await import(packageJsonPath);

    return {
      path: parsedPackageJsonPath,
      content: packageJson,
      require: module.createRequire(packageJsonPath),
    };
  }

  /**
   * Get configuration, validate it and fill in the default values if any
   * @param userRoot - Users root directory
   */
  private async getConfig(userRoot: string): Promise<Required<Config>> {
    // Load users config file if any
    const {
      input,
      ignore,
      outputDirectory,
      plugins,
    }: Config = await this.readUserConfig(userRoot);

    // Combine CLI arguments and config
    const config: Config = {
      input: this.input ?? input,
      ignore: this.ignore ?? ignore,
      outputDirectory: this.outputDirectory ?? outputDirectory,
      plugins:
        plugins ??
        (await defaultPlugins({
          typescript: { tsconfig: path.resolve(userRoot, this.tsconfigPath) },
        })),
    };

    // Validate config
    for (const [key, value] of Object.entries(config)) {
      if (value === undefined)
        throw new LibraryError(`Found "${key}" undefined in configuration`, {
          isOperational: false,
          description:
            "Was expecting the property to be defined. Please use the CLI Flags or config.",
        });
    }

    return config as Required<Config>;
  }

  /**
   * Read user configuration and throw if invalid path
   * @param userRoot - Users root directory
   */
  private async readUserConfig(userRoot: string): Promise<Config> {
    if (this.configPath === undefined) return {};

    const configPath = path.isAbsolute(this.configPath)
      ? this.configPath
      : path.resolve(userRoot, this.configPath);

    if (fs.existsSync(configPath)) {
      const config = ((await import(configPath)) as {
        default: (() => Promise<Config>) | Config;
      }).default;
      if (typeof config === "function") return await config();
      else return config;
    } else
      throw new LibraryError("Invalid config path", {
        isOperational: false,
        description: "Configuration file does not exist in the specified path",
        configPath,
      });
  }
}
