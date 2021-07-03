import { Plugin } from "rollup";
import { PROXIED_DEPENDENCIES } from "../constants";

/**
 * Proxies users dependencies from our package.
 *
 * @param dependencies - Users dependencies
 * @returns Rollup plugin
 */
export function proxyDependencies(dependencies: string[]): Plugin {
  return {
    name: "bundte-proxy-dependencies",

    resolveId: (source) => {
      if (!PROXIED_DEPENDENCIES.some((proxy) => source.startsWith(proxy)))
        return null;

      if (dependencies.includes(source)) return null;

      try {
        return require.resolve(source);
      } catch {}

      return null;
    },
  };
}
