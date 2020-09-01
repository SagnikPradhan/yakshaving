import { Plugin } from "rollup";

export * from "./development";

export interface Config {
  input?: string;
  outputDirectory?: string;
  ignore?: string[];
  plugins?: { development: Plugin[]; production: Plugin[] };
}
