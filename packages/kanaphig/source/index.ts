import { flatten, Flatten, Path, PathValue } from "./core/helpers/flatten"
import { deepMerge } from "./core/helpers/merge"

import { Fn, RecursiveObject } from "./core/types/basic"
import {
	ConfigurationStructure,
	ExtractShapeFromStructure,
} from "./core/types/structure"

/** Kanaphig manager */
export class K<UserConfigurationStructure extends ConfigurationStructure> {
	#configuration = new Map<Path<UserConfigurationStructure>, unknown>()

	/** Create new kanaphig manager */
	constructor({
		sources,
		structure: schema,
	}: {
		sources: RecursiveObject<unknown>[]
		structure: UserConfigurationStructure
	}) {
		const source = flatten(deepMerge(...sources))
		const structure = flatten(schema) as Record<string, Fn<unknown>>

		for (const [key, transformer] of Object.entries(structure))
			this.#configuration.set(
				key,
				transformer(source[key as keyof Flatten<Record<string, unknown>>])
			)
	}

	public get<P extends Path<UserConfigurationStructure>>(path: P) {
		return this.#configuration.get(path) as PathValue<
			ExtractShapeFromStructure<UserConfigurationStructure>,
			P
		>
	}
}
