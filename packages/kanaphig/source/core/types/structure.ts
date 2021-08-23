import { Fn, RecursiveObject } from "./basic"

export type ConfigurationDefinition = RecursiveObject<Fn<unknown, any>>

export type ExtractShapeFromDefinition<S extends ConfigurationDefinition> = {
	[Key in keyof S]: S[Key] extends Fn<unknown, infer Output>
		? Output
		: S[Key] extends ConfigurationDefinition
		? ExtractShapeFromDefinition<S[Key]>
		: never
}
