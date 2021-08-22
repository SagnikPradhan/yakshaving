import { flatten, Flatten, Path, PathValue } from "./core/helpers/flatten"
import { deepMerge } from "./core/helpers/merge"
import { Fn, RecursiveObject } from "./core/types/basic"

export type ConfigurationStructure = RecursiveObject<Fn<unknown, any>>

export type ExtractShapeFromStructure<S extends ConfigurationStructure> = {
	[Key in keyof S]: S[Key] extends Fn<unknown, infer Output>
		? Output
		: S[Key] extends ConfigurationStructure
		? ExtractShapeFromStructure<S[Key]>
		: never
}

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
