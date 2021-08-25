import { handleError } from "./core/helpers/error"
import { flatten, PathValue } from "./core/helpers/flatten"
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

	/** Create new kanaphig manager */
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

	public get<Path extends Keys<Definition>>(path: Path) {
		return this.configuration.get(path as string) as PathValue<
			Configuration<Definition>,
			Path
		>
	}
}

export * from "./helpers"
