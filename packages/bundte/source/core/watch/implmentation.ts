// local
import getPlugins from "../plugins";
import { root } from "../../utils/path";
import { throwError } from "../../utils/error";

// native
import fs from "fs";
import module from "module";
import path from "path";

// third party
import type * as manifest from "@schemastore/package";
import * as rollup from "rollup";

const SCRIPT_EXTENSIONS = [".mjs", ".cjs", ".js", ".jsx", ".ts", ".tsx"];

export async function watch() {
  const manifest = await getManifest();
  const entries = await getEntries();
  const externalDependencies = getExternalDependencies(manifest);

  const usesTypescript = fs.existsSync(root("tsconfig.json"));

  const options: rollup.RollupWatchOptions = {
    input: entries,

    plugins: await getPlugins({
      buildMode: "development",
      typescriptMode: usesTypescript,
      dependencies: externalDependencies,
    }),

    external: externalDependencies,

    output: {
      format: "commonjs",
      dir: root("dist"),
      entryFileNames: "[name].cjs",
      sourcemap: true,
    },
  };

  const watcher = rollup.watch(options);

  watcher.on("change", console.log);
}

function getManifest(): Promise<manifest.CoreProperties> {
  const path = root("package.json");
  if (fs.existsSync(path)) return import(path);
  else throwError("YK001");
}

async function getEntries() {
  const files = await fs.promises.readdir(root("source"));

  const entries = files
    .filter((file) => SCRIPT_EXTENSIONS.includes(path.parse(file).ext))
    .map((path) => root("source", path));

  if (entries.length === 0) throwError("YK002", { entries });

  return entries;
}

function getExternalDependencies({
  dependencies,
  peerDependencies,
  optionalDependencies,
}: manifest.CoreProperties) {
  return [
    ...module.builtinModules,
    ...Object.keys({
      ...dependencies,
      ...peerDependencies,
      ...optionalDependencies,
    }),
  ];
}
