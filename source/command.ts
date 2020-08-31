import { Command } from "clipanion";
import { rollup, Plugin, watch } from "rollup";
import commonJsPlugin from "@rollup/plugin-commonjs";
import nodeResolvePlugin from "@rollup/plugin-node-resolve";
import replacePlugin from "@rollup/plugin-replace";
import typescriptPlugin from "@rollup/plugin-typescript";
// @ts-expect-error
import sucrasePlugin from "@rollup/plugin-sucrase";

import * as path from "path";
import { existsSync } from "fs";
import { createRequire } from "module";

import { handleError, LibraryError } from "./utils";

export interface Config {
  input?: string;
  outputDirectory?: string;
  verbose?: boolean;
  useTypescript?: boolean;
  ignore?: string[];
  plugins?: { devApp?: Plugin[]; devDeps?: Plugin[]; production?: Plugin[] };
}

export const DefaultDevAppPlugins = (
  useTypescript: boolean,
  tsconfig?: string
) => [
  commonJsPlugin(),
  nodeResolvePlugin({
    extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx"],
    preferBuiltins: false,
  }),
  useTypescript
    ? typescriptPlugin({ tsconfig: tsconfig })
    : sucrasePlugin({ transforms: ["typescript", "jsx"] }),
];

export const DefaultDevDepsPlugins = [
  commonJsPlugin(),
  nodeResolvePlugin({ preferBuiltins: false }),
  replacePlugin({ values: { "process.env.NODE_ENV": "'development'" } }),
];

export const DefaultProdPlugins = [
  commonJsPlugin(),
  nodeResolvePlugin({ preferBuiltins: false }),
  replacePlugin({ values: { "process.env.NODE_ENV": "'development'" } }),
  typescriptPlugin(),
];

export class AppCommand extends Command {
  @Command.String({ required: false })
  public input?: string;

  @Command.String({ required: false })
  public outputDirectory?: string;

  @Command.Boolean("--verbose")
  public verbose = false;

  @Command.Boolean("--dev,-d")
  public devMode = false;

  @Command.Boolean("--typescript,-ts")
  public useTypescript = false;

  @Command.Array("--ignore,-i")
  public ignore: string[] = [];

  @Command.String("--config,-c")
  public configPath?: string;

  @Command.Path()
  async execute() {
    try {
      const userManifest = await this.parseUserManifest<{
        dependencies: Record<string, string>;
      }>();

      const userConfig = await this.getUserConfig(userManifest.userRoot);

      if (this.devMode) {
        const dependencies = Object.keys(
          userManifest.content.dependencies
        ).filter((d) => !this.ignore.includes(d));
        await this.buildDependencies({
          dependencies,
          userRequire: userManifest.require,
          outputDirectory: path.resolve(
            userConfig.outputDirectory,
            "dependencies"
          ),
          plugins: userConfig.plugins.devDeps as Plugin[],
        });

        this.startWatchMode({
          input: userConfig.input,
          dependenciesMap: Object.fromEntries(
            dependencies.map((d) => [d, `./dependencies/${d}.js`])
          ),
          outputDirectory: userConfig.outputDirectory,
          plugins: userConfig.plugins.devApp as Plugin[],
        });
      } else
        this.startProductionBuild({
          input: userConfig.input,
          outputDirectory: userConfig.outputDirectory,
          plugins: userConfig.plugins.production as Plugin[],
        });
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * Parses user manifest (package.json)
   * Creates helper functions and extracts other data
   */
  private async parseUserManifest<T extends unknown>() {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");

    if (!existsSync(packageJsonPath))
      throw new LibraryError("package.json not found", {
        isOperational: false,
        description: "Please run the command in workspace root.",
      });

    const parsedPackageJsonPath = path.parse(packageJsonPath);
    const packageJson: T = await import(packageJsonPath);

    return {
      path: parsedPackageJsonPath,
      content: packageJson,
      require: createRequire(parsedPackageJsonPath.dir),
      userRoot: (...args: string[]) =>
        path.resolve(parsedPackageJsonPath.dir, ...args),
    };
  }

  /**
   * Get and validate user configuration
   * @param userRoot - User root path resolve function
   */
  private async getUserConfig(userRoot: (...args: string[]) => string) {
    let configFromFile: Config = { plugins: {} };

    // Load local file if available
    if (this.configPath) {
      const resolvedUserConfigPath = userRoot(this.configPath);

      if (!existsSync(resolvedUserConfigPath))
        throw new LibraryError("configuration file not found", {
          isOperational: false,
          description: "Seems like the path you provided was invalid",
          path: resolvedUserConfigPath,
        });

      configFromFile = await import(resolvedUserConfigPath);
    }

    // Give first preference for CLI inputs
    let config: Config = {
      input: this.input ?? configFromFile.input,
      ignore: [...this.ignore, ...(configFromFile.ignore || [])],
      outputDirectory: this.outputDirectory ?? configFromFile.outputDirectory,
      useTypescript: this.useTypescript ?? configFromFile.useTypescript,
      verbose: this.verbose ?? configFromFile.verbose,
      plugins: {
        devApp:
          configFromFile.plugins?.devApp ??
          DefaultDevAppPlugins(this.useTypescript),
        devDeps: configFromFile.plugins?.devDeps ?? DefaultDevDepsPlugins,
        production: configFromFile.plugins?.production ?? DefaultProdPlugins,
      },
    };

    // If any of the props are undefined throw up
    // If any of them require processing do it here
    for (const [key, entry] of Object.entries(config) as [
      keyof Config,
      Config[keyof Config]
    ][]) {
      if (entry === undefined)
        throw new LibraryError(`${key} is undefined but required in config`, {
          isOperational: false,
          description:
            "You forgot to mention a required configuration property",
          config,
        });

      if (key === "input" || key === "outputDirectory")
        config[key] = userRoot(entry as string);
    }

    return config as Required<Config>;
  }

  /**
   * Build dependencies for dev mode
   * @param options - Options
   * @param options.dependencies - Dependency identifiers
   * @param options.userRequire - Require from users workspace
   * @param options.outputDirectory - Output directory for bundle
   * @param options.plugins - Plugins to be used
   */
  private async buildDependencies({
    dependencies,
    userRequire,
    outputDirectory,
    plugins,
  }: {
    dependencies: string[];
    userRequire: NodeRequire;
    outputDirectory: string;
    plugins: Plugin[];
  }) {
    const entryPoints: Record<string, string> = {};

    for (const dependency of dependencies)
      entryPoints[dependency] = userRequire.resolve(dependency);

    const bundle = await rollup({
      input: entryPoints,
      context: "window",
      plugins,
    });

    await bundle.write({
      dir: outputDirectory,
      format: "es",
      entryFileNames: "[name].js",
      sourcemap: true,
      exports: "named",
    });
  }

  /**
   * Start watch mode
   * @param options - Options
   * @param options.input - Entry point
   * @param options.dependenciesMap - Map of dependencies to their url
   * @param options.outputDirectory - Output directory
   * @param options.plugins - Plugins to be used
   */
  private startWatchMode({
    input,
    dependenciesMap,
    outputDirectory,
    plugins,
  }: {
    input: string;
    dependenciesMap: Record<string, string>;
    outputDirectory: string;
    plugins: Plugin[];
  }) {
    const watcher = watch({
      input,
      context: "window",
      external: Object.keys(dependenciesMap),
      plugins,

      output: {
        dir: outputDirectory,
        format: "es",
        sourcemap: true,
        paths: dependenciesMap,
      },

      watch: {
        clearScreen: false,
      },
    });

    watcher.on("event", (event: { code: string; [index: string]: unknown }) => {
      const code = event.code;

      if (code === "ERROR")
        handleError(
          new LibraryError("Rollup Error", {
            isOperational: true,
            description: "Watcher emitted an error",
            error: event.error,
          })
        );
    });
  }

  /**
   * Start production build
   * @param options - Options
   * @param options.input - Entry point
   * @param options.outputDirectory - Output directory
   * @param options.plugins - Plugins to be used
   */
  private async startProductionBuild({
    input,
    outputDirectory,
    plugins,
  }: {
    input: string;
    outputDirectory: string;
    plugins: Plugin[];
  }) {
    const bundle = await rollup({
      input,
      context: "window",
      plugins,
    });

    await bundle.write({
      dir: outputDirectory,
      format: "es",
      sourcemap: true,
    });
  }
}
