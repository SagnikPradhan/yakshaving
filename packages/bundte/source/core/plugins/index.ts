// third party
import babel from "@rollup/plugin-babel"
import commonJs from "@rollup/plugin-commonjs"
import json from "@rollup/plugin-json"
import nodeResolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import ts from "rollup-plugin-ts"

// local
import { doesUserHaveBabelConfig, getBabelDefaultOptions } from "./babel"
import { SCRIPT_EXTENSIONS } from "../constants"
import { proxyDependencies } from "./proxy-dependencies"

/**
 * Get all the required plugins.
 *
 * @param options - Options
 * @param options.buildMode - Production or development mode
 * @param options.typescriptMode - Is typescript to be used
 * @param options.dependencies - Users dependencies list
 * @returns Array of plugins
 */
export default async function getPlugins({
	buildMode,
	typescriptMode,
	dependencies,
}: {
	buildMode: "development" | "production"
	typescriptMode: boolean
	dependencies: string[]
}) {
	const plugins = [
		proxyDependencies(dependencies),
		nodeResolve({ extensions: [...SCRIPT_EXTENSIONS, ".node", ".json"] }),
		commonJs(),
		json(),
	]

	const userHasBabelConfig = await doesUserHaveBabelConfig()
	const babelConfig = userHasBabelConfig ? getBabelDefaultOptions() : undefined

	if (typescriptMode)
		plugins.push(
			ts({
				babelConfig,
				transpiler: "babel",
				tsconfig: (c) => ({ ...c, sourceMap: true, declaration: true }),
			})
		)

	if (!typescriptMode) plugins.push(babel(babelConfig))

	if (buildMode === "production") plugins.push(terser())

	return plugins
}
