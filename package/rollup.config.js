import fs from "fs";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-ts";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { dependencies, peerDependencies } from "./package.json";

const isDev = process.env.ROLLUP_WATCH;

// Clear directory
if (!isDev) fs.rmSync("./dist", { recursive: true, force: true });

/** @type import("rollup").RollupOptions */
const config = {
  input: "./src/main.ts",

  plugins: [
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".node", ".ts"],
      preferBuiltins: true,
      browser: false,
    }),

    commonjs(),

    typescript({ transpiler: "babel", browserslist: "node 14" }),
  ],

  external: [Object.keys(dependencies), Object.keys(peerDependencies)],

  preserveEntrySignatures: false,

  output: {
    dir: "./dist",
    format: "commonjs",
    sourcemap: true,
  },
};

// Minify in production builds
if (!isDev) config.plugins.push(terser());

export default config;
