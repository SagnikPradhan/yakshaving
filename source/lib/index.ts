import { Plugin } from "rollup";

export * from "./development";
export * from "./production";
export * from "./default-plugins"

export interface Config {
  input?: string;
  outputDirectory?: string;
  ignore?: string[];
  plugins?: { development: Plugin[]; production: Plugin[] };
}
