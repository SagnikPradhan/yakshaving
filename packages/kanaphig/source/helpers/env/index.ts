import { parse } from "levn"
import type { DotenvConfigOptions } from "dotenv"
import type { Fn } from "../../types/basic"
import { unflatten } from "../../internal-helpers/flatten"

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

	const tryParsing = (input: string) => {
		try {
			return parse("*", input)
		} catch {
			return input
		}
	}

	const env = Object.entries(process.env)
		.filter(([key]) => filterFn(key))
		.map(([key, value]): [string, unknown] => [
			toCamelCase(toParts(removePrefix(options?.removePrefix, key))),
			value ? tryParsing(value) : value,
		])

	return unflatten(Object.fromEntries(env))
}

function removePrefix(prefix: undefined | string | string[], key: string) {
	if (prefix === undefined) return key
	const prefixArray = typeof prefix === "string" ? [prefix] : prefix

	for (const prefix of prefixArray)
		if (key.startsWith(prefix)) return key.slice(prefix.length)
		else continue

	return key
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
