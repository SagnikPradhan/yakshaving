import { handleError } from "./core/helpers/error"
import { flatten, PathValue, unflatten } from "./core/helpers/flatten"
import { deepMerge } from "./core/helpers/merge"

import type { Fn, RecursiveObject } from "./core/types/basic"
import type {
	ConfigurationDefinition,
	Configuration,
	Keys,
} from "./core/types/structure"

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
			handleError(error, exit)
		}
	}

	private init(sources: RecursiveObject[], definition: Definition) {
		const flattenedMergedSource = flatten(
			deepMerge(...sources)
		) as RecursiveObject

		const flattenedDefinition = flatten(definition) as Record<
			string,
			Fn<unknown>
		>

		for (const [path, transformer] of Object.entries(flattenedDefinition))
			this.configuration.set(path, transformer(flattenedMergedSource[path]))
	}

	/**
	 * Get a configuration key
	 *
	 * @param path - Path to configuration key
	 * @returns Value
	 */
	public get<Path extends Keys<Definition>>(path: Path) {
		return this.configuration.get(path as string) as PathValue<
			Configuration<Definition>,
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
		) as Configuration<Definition>
	}
}

export * from "./helpers"
