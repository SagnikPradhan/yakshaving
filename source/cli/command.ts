import { Command } from "clipanion";

import path from "path";
import fs from "fs";
import module from "module";

import { LibraryError } from "../lib/utils";
import { Config } from "../lib";

export class AppCommand extends Command {
  @Command.String({ required: false })
  public input?: string;

  @Command.String({ required: false })
  public outputDirectory?: string;

  @Command.String("--config,-c")
  public configPath: string = "v.config.js";

  @Command.String("--tsconfig")
  public tsconfigPath: string = "tsconfig.json";

  @Command.Boolean("--verbose")
  public verbose = false;

  @Command.Boolean("--dev,-d")
  public devMode = false;

  @Command.Array("--ignore,-i")
  public ignore: string[] = [];

  @Command.Path()
  async execute() {
    const { userRoot } = await this.parseUserManifest();
    const config = this.getConfig(
      userRoot(this.configPath),
      userRoot(this.tsconfigPath)
    );

    // TODO: Actually start building
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
      require: module.createRequire(parsedPackageJsonPath.dir),
      userRoot: (...args: string[]) =>
        path.resolve(parsedPackageJsonPath.dir, ...args),
    };
  }

  /**
   * Get configuration, validate it and fill in the default values if any
   * @param path - Config file's path relative to user root
   * @param tsconfigPath - Path to `tsconfig.json` relative to user root
   */
  private async getConfig(
    path?: string,
    tsconfigPath?: string
  ): Promise<Required<Config>> {
    const { input, ignore, outputDirectory, plugins }: Config =
      path && fs.existsSync(path) ? await import(path) : {};

    const config: Config = {
      input: input ?? this.input,
      ignore: ignore ?? this.ignore,
      outputDirectory: outputDirectory ?? this.outputDirectory,
      plugins: plugins ?? (await this.defaultPlugins(tsconfigPath)),
    };

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
   * Get default plugins
   * @param tsconfigPath - Path to `tsconfig.json` relative to user root
   */
  private async defaultPlugins(
    tsconfigPath?: string
  ): Promise<Config["plugins"]> {
    const CommonJSPlugin = (await import("@rollup/plugin-commonjs")).default();

    const NodeResolvePlugin = (
      await import("@rollup/plugin-node-resolve")
    ).default({
      preferBuiltins: false,
      extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx", ".jsx"],
    });

    // @ts-expect-error Sucrase lacks types
    const SucrasePlugin = (await import("@rollup/plugin-sucrase")).default();

    const TypescriptPlugin = (
      await import("@rollup/plugin-typescript")
    ).default({
      tsconfig: fs.existsSync(tsconfigPath as string)
        ? tsconfigPath
        : undefined,
    });

    const ReplacePlugin = (await import("@rollup/plugin-replace")).default({
      values: { "process.env.NODE_ENV": '"production"' },
    });

    return {
      production: [
        CommonJSPlugin,
        NodeResolvePlugin,
        ReplacePlugin,
        TypescriptPlugin,
      ],
      development: [CommonJSPlugin, NodeResolvePlugin, SucrasePlugin],
    };
  }
}
