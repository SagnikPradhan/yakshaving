import { handleError } from "./internal-helpers/error"
import {
	EndPath,
	flatten,
	PathValue,
	unflatten,
} from "./internal-helpers/flatten"
import { deepMerge } from "./internal-helpers/merge"

import type { Fn, RecursiveObject } from "./types/basic"
import type { Chain, FirstArgument, LastReturn } from "./types/chain"
import type {
	ConfigurationDefinition,
	ExtractShape,
	Transformer,
} from "./types/structure"

/** Kanaphig manager */
export class K<Definition extends ConfigurationDefinition> {
	private readonly configuration = new Map<string, unknown>()

	/**
	 * Create new kanaphig manager
	 *
	 * @param options- Options
	 * @param options.sources - Configuration sources. Look in helpers.
	 * @param options.definition - Configuration definition
	 * @param options.exit - Exit if configuration building fails. Default `true`
	 */
	constructor({
		sources,
		definition,
		exit,
	}: {
		sources: RecursiveObject[]
		definition: Definition
		exit?: boolean
	}) {
		try {
			this.init(sources, definition)
		} catch (error) {
			handleError(error as Error, exit)
		}
	}

	private init(sources: RecursiveObject[], definition: Definition) {
		const mergedSources = deepMerge(...sources)
		this.recurisvelyTransform(mergedSources, definition)
	}

	private recurisvelyTransform(
		object: RecursiveObject,
		definition: RecursiveObject<Transformer>,
		prefix = ""
	) {
		function isObject<V>(value: unknown): value is RecursiveObject<V> {
			return typeof value === "object" && value !== null
		}

		for (const [currentKey, transformerOrNestedTransformers] of Object.entries(
			definition
		)) {
			const data = object[currentKey]
			const completeKey = prefix + currentKey

			if (isObject(transformerOrNestedTransformers))
				if (isObject(data))
					this.recurisvelyTransform(
						data,
						transformerOrNestedTransformers,
						completeKey + "."
					)
				else continue
			else {
				const [parsedData] = transformerOrNestedTransformers([
					data,
					{ key: completeKey },
				])

				if (isObject(parsedData))
					for (const [key, value] of Object.entries(flatten(parsedData)))
						this.configuration.set(`${completeKey}.${key}`, value)
				else this.configuration.set(completeKey, parsedData)
			}
		}
	}

	/**
	 * Get a configuration key
	 *
	 * @param path - Path to configuration key
	 * @returns Value
	 */
	public get<Path extends EndPath<ExtractShape<Definition>>>(path: Path) {
		return this.configuration.get(path as string) as PathValue<
			ExtractShape<Definition>,
			Path
		>
	}

	/**
	 * Get the complete configuration as an object
	 *
	 * @returns Configuration
	 */
	public all() {
		return unflatten(
			Object.fromEntries(this.configuration.entries())
		) as ExtractShape<Definition>
	}

	/**
	 * Creates a chain of functions
	 *
	 * @param fns - Functions
	 * @returns Piped function
	 */
	public chain<Fns extends Chain<Fn[] | [Fn]>>(
		...fns: Fns
	): (argument: FirstArgument<Fns>) => LastReturn<Fns> {
		return (value: FirstArgument<Fns>) =>
			fns.reduce((value, fn) => fn(value), value as LastReturn<Fns>)
	}
}

export { KanaphigError } from "./internal-helpers/error"
