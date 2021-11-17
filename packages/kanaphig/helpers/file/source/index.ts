import fs from "fs"
import path from "path"
import { KanaphigError } from "@kanaphig/core"
import { RecursiveObject } from "@kanaphig/core/dist/types/basic"

/**
 * Load a configuration file. Supported file extensions -
 *
 * - YAML - yml, yaml
 * - JSON - json, json5
 *
 * @param configPath - Configuration file path
 */
export function file(configPath: string): RecursiveObject {
	const absolutePath = path.isAbsolute(configPath)
		? configPath
		: path.join(process.cwd(), configPath)

	const extension = path.parse(absolutePath).ext

	switch (extension) {
		case ".yml":
		case ".yaml":
			const yaml: typeof import("yaml") = require("yaml")
			return yaml.parse(fs.readFileSync(absolutePath, "utf8"))

		case ".json":
		case ".json5":
			const json: typeof import("json5") = require("json5")
			return json.parse(fs.readFileSync(absolutePath, "utf8"))

		default:
			throw new KanaphigError("KanaphigFileError", {
				isOperational: false,
				message: "Unknown file extension received in file helper",
				extension,
				absolutePath,
			})
	}
}
