import { parse } from "levn"
import type { DotenvConfigOptions } from "dotenv"
import type { Fn } from "../../types/basic"
import { KanaphigError } from "../.."

/**
 * Use envrionment variables
 *
 * @param options - Env source options
 * @param options.removePrefix - Prefix to be removed from environment variables
 * @param options.filter - Environment variables to be filtered
 * @param options.dotenv - Options for dotenv, pass `false` to prevent loading dotenv
 */
export function env(options?: {
	removePrefix?: string | string[]
	filter?: RegExp | Fn<string, boolean>
	dotenv?: DotenvConfigOptions
}) {
	if (options?.dotenv === undefined || options.dotenv !== false)
		(require("dotenv") as typeof import("dotenv")).config(options?.dotenv)

	const filter = options?.filter || /.+/
	const filterFn =
		typeof filter === "function" ? filter : (key: string) => filter.test(key)

	const env = Object.entries(process.env)
		.filter(([key]) => filterFn(key))
		.map(([key, value]) => [
			toCamelCase(toParts(removePrefix(options?.removePrefix, key))),
			value ? parse("*", value) : value,
		])

	return Object.fromEntries(env) as Record<string, unknown>
}

function removePrefix(prefix: undefined | string | string[], key: string) {
	if (prefix === undefined) return key

	if (typeof prefix === "string") {
		if (key.startsWith(prefix)) return key.substr(prefix.length)
		else return key
	}

	if (Array.isArray(prefix)) {
		const currentPrefix = prefix.find((prefix) => key.startsWith(prefix))
		if (currentPrefix) return key.substr(currentPrefix.length)
		else return key
	}

	throw new KanaphigError("KanaphigEnvError", {
		isOperational: false,
		prefix,
		message: "Prefix should be a string or array of strings",
	})
}

function toParts(string: string) {
	return string.split("__").join(".")
}

function toCamelCase(string: string) {
	return string
		.split("_")
		.map(
			([start = "", ...rest], index) =>
				(index !== 0 ? start.toUpperCase() : start.toLowerCase()) +
				rest.join("").toLowerCase()
		)
		.join("")
}
