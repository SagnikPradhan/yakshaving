import { Fn, RecursiveObject } from "./basic"

export type ConfigurationStructure = RecursiveObject<Fn<unknown, any>>

export type ExtractShapeFromStructure<S extends ConfigurationStructure> = {
	[Key in keyof S]: S[Key] extends Fn<unknown, infer Output>
		? Output
		: S[Key] extends ConfigurationStructure
		? ExtractShapeFromStructure<S[Key]>
		: never
}
