// third party
import { Plugin } from "rollup"

// local
import { PROXIED_DEPENDENCIES } from "../constants"

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
			const isFromDependency = PROXIED_DEPENDENCIES.some((proxyDepenency) =>
				source.startsWith(proxyDepenency)
			)

			if (!isFromDependency) return null

			if (dependencies.includes(source)) return null

			try {
				return require.resolve(source)
			} catch {}

			return null
		},
	}
}
