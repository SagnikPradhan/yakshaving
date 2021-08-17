import fs from "fs"
import path from "path"

import { RecursiveObject } from "../../types/basic"

export type AllowedExtensions = "yml" | "yaml" | "json" | "json5" | "js" | "ts"
export type AllowedPaths = `${string}.${AllowedExtensions}`

export function readFile(filePath: AllowedPaths): RecursiveObject<unknown> {
	const absolutePath = path.isAbsolute(filePath)
		? filePath
		: path.join(process.cwd(), filePath)

	const extension = path.parse(absolutePath).ext

	if ([".yml", ".yaml"].includes(extension))
		return require("yaml").parse(fs.readFileSync(absolutePath, "utf8"))

	if ([".json", ".json5"].includes(extension))
		return require("json5").parse(fs.readFileSync(absolutePath, "utf8"))

	if ([".js", ".ts"].includes(extension)) return require(absolutePath)

	throw new Error("Invalid config file extension")
}
