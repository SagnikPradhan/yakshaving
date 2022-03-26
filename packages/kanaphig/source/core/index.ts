import _ from "lodash/fp"
import path from "path"
import fs from "fs"

import type { Fn, RecursiveObject } from "./types/basic"
import { KanaphigError } from "./utilities/error"
import { Path, PathValue } from "./types/path"

export interface TransformerContext {
	data: unknown
	path: string[]
}

export type Transformer<
	Input extends TransformerContext,
	Output extends TransformerContext
> = Fn<Input, Output>

type Definition<
	Input extends TransformerContext = TransformerContext,
	Output extends TransformerContext = TransformerContext
> = RecursiveObject<Transformer<Input, Output>>

type ExtractShape<UserDefinition extends Definition> = {
	[Prop in keyof UserDefinition]: UserDefinition[Prop] extends Definition
		? ExtractShape<UserDefinition[Prop]>
		: UserDefinition[Prop] extends Transformer<any, infer Context>
		? Context["data"]
		: unknown
}

function isObject<V>(value: unknown): value is RecursiveObject<V> {
	return typeof value === "object" && value !== null
}

export class K<UserDefinition extends Definition> {
	#configurations: ExtractShape<UserDefinition>[]
	#definition: UserDefinition

	constructor({
		env = false,
		args = false,
		files = [],
		definition,
	}: {
		env?: boolean
		args?: boolean | string | string[]
		files?: string[]
		definition: UserDefinition
	}) {
		const input = this.#readFromAllSources({ args, env, files })

		this.#definition = definition
		this.#configurations = []

		this.#configurations.push(
			this.#transform([], input, definition) as ExtractShape<UserDefinition>
		)
	}

	// https://github.com/microsoft/TypeScript/issues/41620 Faces this issue I think
	public get<P extends Path<ExtractShape<UserDefinition>>>(path: P) {
		return _.get(path)(this.#configurations[0]) as PathValue<
			P,
			ExtractShape<UserDefinition>
		>
	}

	public set<
		P extends Path<UserDefinition>,
		V = PathValue<P, ExtractShape<UserDefinition>>
	>(path: P, value: V) {
		const transformerOrDefinition = _.get(path, this.#definition) as
			| UserDefinition[keyof UserDefinition]
			| undefined

		if (!transformerOrDefinition)
			throw new KanaphigError(`KanaphigInvalidUpdateError`, {
				isOperational: false,
				message: "Tried setting value not defined in definition",
				key: path,
			})

		this.#configurations.unshift(
			_.assign(
				this.#configurations[0],
				this.#transform(_.toPath(path), value, transformerOrDefinition)
			)
		)

		return value
	}

	public all() {
		return _.cloneDeep(this.#configurations[0])
	}

	#transform(
		path: string[],
		input: unknown,
		transformerOrDefinition:
			| Definition
			| Transformer<TransformerContext, TransformerContext>
	): RecursiveObject {
		if (isObject(transformerOrDefinition))
			if (isObject(input))
				return _.pipe(
					_.entries,
					_.map(([k, o]) => this.#transform([...path, k], input[k], o)),
					_.reduce(_.merge)({})
				)(transformerOrDefinition) as RecursiveObject
			else
				throw new KanaphigError("KanaphigInvalidDataError", {
					isOperational: false,
					message: `Expected object for ${_.path(path)}`,
					data: input,
				})
		else
			return _.set(
				path,
				transformerOrDefinition({
					data: input,
					path: [...path],
				}).data
			)({})
	}

	#readFromAllSources({
		args,
		env,
		files,
	}: {
		args: boolean | string | string[]
		env: boolean
		files: string[]
	}) {
		const sources: RecursiveObject[] = []

		if (args) {
			const yargs: typeof import("yargs-parser") = require("yargs-parser")
			const output = yargs(
				typeof args !== "boolean" ? args : process.argv.slice(2)
			)
			sources.push(output)
		}

		if (env) sources.push(this.#readEnv(process.env))

		if (files.length > 0)
			for (const file of files) sources.push(this.#readFile(file))

		return _.reduce(_.merge)({})(sources)
	}

	#readFile(filePath: string) {
		const absolutePath = path.isAbsolute(filePath)
			? filePath
			: path.join(process.cwd(), filePath)

		const parts = absolutePath.split(".")
		const extension = parts[parts.length - 1]

		const getFile = () => fs.readFileSync(absolutePath, "utf8")

		switch (extension) {
			case "yml":
			case "yaml":
				const yaml: typeof import("yaml") = require("yaml")
				return yaml.parse(getFile())

			case "json":
			case "json5":
				const json: typeof import("json5") = require("json5")
				return json.parse(getFile())

			case "env":
				const dotenv: typeof import("dotenv") = require("dotenv")
				return this.#readEnv(dotenv.parse(getFile()))

			default:
				throw new KanaphigError("KanaphigInvalidConfigFileError", {
					isOperational: false,
					message: "Unknown file extension received in file helper",
					extension,
					absolutePath,
				})
		}
	}

	#readEnv(object: Record<string, unknown>) {
		const mapKeys = _.map(
			_.pipe(_.split("__"), _.map(_.camelCase), _.join("."))
		)

		return _.pipe(
			(o) => [mapKeys(_.keys(o)), _.values(o)],
			_.spread(_.zipObjectDeep)
		)(object) as RecursiveObject
	}
}
