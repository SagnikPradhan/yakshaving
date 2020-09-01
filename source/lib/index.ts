import type { Plugin } from "rollup";

import CommonJSPlugin from "@rollup/plugin-commonjs";
import { nodeResolve as NodeResolvePlugin } from "@rollup/plugin-node-resolve";
// @ts-expect-error No types for sucrase plugin
import SucrasePlugin from "@rollup/plugin-sucrase";

export const defaultAppPlugins: Plugin[] = [
  CommonJSPlugin(),
  NodeResolvePlugin({
    extensions: [".mjs", ".js", ".json", ".node", ".ts", ".tsx", ".jsx"],
    preferBuiltins: false,
  }),
  SucrasePlugin({ transforms: ["typescript", "jsx"] }),
];

export * from "./development";
