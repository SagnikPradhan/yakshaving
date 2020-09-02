import { Command } from "clipanion";

import path from "path";
import fs from "fs";
import module from "module";

import { LibraryError } from "../lib/utils";
import { Config, startDevelopmentMode } from "../lib";

export class AppCommand extends Command {
  @Command.String({ required: false })
  public input?: string;

  @Command.String({ required: false })
  public outputDirectory?: string;

  @Command.String("--config,-c")
  public configPath?: string;

  @Command.String("--tsconfig")
  public tsconfigPath = "tsconfig.json";

  @Command.Boolean("--verbose")
  public verbose = false;

  @Command.Boolean("--dev,-d")
  public devMode = false;

  @Command.Array("--ignore,-i")
  public ignore: string[] = [];

  @Command.Path()
  async execute(): Promise<number> {
    const userManifest = await this.parseUserManifest<{
      dependencies: Record<string, string>;
    }>();
    const userConfig = await this.getConfig(userManifest.path.dir);

    const userRoot = (...args: string[]) =>
      path.join(userManifest.path.dir, ...args);

    if (this.devMode)
      startDevelopmentMode({
        entryPoint: userRoot(userConfig.input),
        outputDirectory: userRoot(userConfig.outputDirectory),
        dependencies: Object.keys(userManifest.content.dependencies),
        userRequire: userManifest.require,
        appRollupOptions: {},
        pluginsForApp: userConfig.plugins.development,
      });

    // TODO: Actually start building
    return 0;
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
      plugins: plugins ?? (await this.defaultPlugins(userRoot)),
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
  private readUserConfig(userRoot: string): Promise<Config> | {} {
    if (this.configPath === undefined) return {};

    const configPath = path.isAbsolute(this.configPath)
      ? this.configPath
      : path.resolve(userRoot, this.configPath);

    if (fs.existsSync(configPath)) return import(configPath);
    else
      throw new LibraryError("Invalid config path", {
        isOperational: false,
        description: "Configuration file does not exist in the specified path",
        configPath,
      });
  }

  /**
   * Get default plugins
   * @param userRoot - Users root directory
   */
  private async defaultPlugins(userRoot: string): Promise<Config["plugins"]> {
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

    const tsconfigPath = path.resolve(userRoot, this.tsconfigPath);
    const pluginTypescript = (
      await import("@rollup/plugin-typescript")
    ).default({
      tsconfig: fs.existsSync(tsconfigPath) ? tsconfigPath : undefined,
    });

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
}
