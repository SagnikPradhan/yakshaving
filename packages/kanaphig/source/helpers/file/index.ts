import fs from "fs"
import path from "path"

import { RecursiveObject } from "../../core/types/basic"

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
			throw new Error("Invalid config file extension")
	}
}
