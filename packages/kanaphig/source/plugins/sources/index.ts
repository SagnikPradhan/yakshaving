import { plugin } from "../../core/plugin"
import { flattenObject } from "../../helpers/flatten"

import { handleEnvironmentVariables } from "./env"
import { AllowedPaths, readFile } from "./file"

/**
 * Sources plugin. Adds configuration from environment variables and mentioned
 * configuration file.
 *
 * @param options - Options for sources
 * @param options.filePath - Configuration file path
 * @param options.environmentVariablesPrefix - Prefix for enviroment variables.
 *   default - `YAKSHAVING_KANAPHIG`
 */
export function sources(
	options: {
		filePath?: AllowedPaths
		environmentVariablesPrefix?: string
	} = {
		environmentVariablesPrefix: "YAKSHAVING_KANAPHIG",
	}
) {
	const envPrefix = options.environmentVariablesPrefix
	const environment = handleEnvironmentVariables(envPrefix)

	const configFile = options.filePath
		? flattenObject(readFile(options.filePath))
		: null

	return plugin({
		name: "sources",

		helpers: {
			/**
			 * Substitutes environment variable if nothing is present
			 *
			 * @param key - Environment variable key without prefix
			 */
			env(key: string) {
				return <Input>(value: Input): Input | string | undefined =>
					value || environment.raw[envPrefix ? `${envPrefix}__${key}` : key]
			},

			/**
			 * Substitutes value from configuration file if nothing is present
			 *
			 * @param key - Configuration file key in dot notation
			 */
			file(key: string) {
				return <Input>(value: Input): Input | unknown => {
					if (!configFile) throw new Error("No config file mentioned")
					else if (value) return value
					else return configFile[key]
				}
			},
		},

		source: { ...configFile, ...environment.parsed },
	})
}