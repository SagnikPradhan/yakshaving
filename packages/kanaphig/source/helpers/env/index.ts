import type { DotenvConfigOptions } from "dotenv"
import { KanaphigError } from "../../core/helpers/error"
import type { Fn } from "../../core/types/basic"

export function env(options?: {
	prefix?: string | string[]
	filter?: RegExp | Fn<string, boolean>
	dotenv?: DotenvConfigOptions
}) {
	const { config }: typeof import("dotenv") = require("dotenv")
	const { parse }: typeof import("levn") = require("levn")

	config(options?.dotenv)

	const filter = options?.filter || /.+/
	const filterFn =
		typeof filter === "function" ? filter : (key: string) => filter.test(key)

	const env = Object.entries(process.env)
		.filter(([key]) => filterFn(key))
		.map(([key, value]) => [
			toCamelCase(toParts(removePrefix(options?.prefix, key))),
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
