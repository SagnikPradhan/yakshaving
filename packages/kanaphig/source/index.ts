import { EndPath, flatten, Flatten, PathValue } from "./core/helpers/flatten"
import { deepMerge } from "./core/helpers/merge"

import type { Fn, RecursiveObject } from "./core/types/basic"
import type {
	ConfigurationDefinition,
	ExtractShapeFromDefinition,
} from "./core/types/structure"

/** Kanaphig manager */
export class K<Definition extends ConfigurationDefinition> {
	#configuration = new Map<
		EndPath<ExtractShapeFromDefinition<Definition>>,
		unknown
	>()

	/** Create new kanaphig manager */
	constructor({
		sources,
		structure: schema,
	}: {
		sources: RecursiveObject[]
		structure: Definition
	}) {
		const source = flatten(deepMerge(...sources))
		const structure = flatten(schema) as Record<string, Fn<unknown>>

		for (const [key, transformer] of Object.entries(structure))
			this.#configuration.set(
				key as EndPath<ExtractShapeFromDefinition<Definition>>,
				transformer(source[key as keyof Flatten<Record<string, unknown>>])
			)
	}

	public get<P extends EndPath<ExtractShapeFromDefinition<Definition>>>(
		path: P
	) {
		return this.#configuration.get(path) as PathValue<
			ExtractShapeFromDefinition<Definition>,
			P
		>
	}
}

export * from "./helpers"
