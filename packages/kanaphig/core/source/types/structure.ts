import { EndPath } from "../internal-helpers/flatten"
import { Fn, RecursiveObject } from "./basic"

export type ConfigurationDefinition = RecursiveObject<Fn<unknown, any>>

export type Configuration<S extends ConfigurationDefinition> = {
	[Key in keyof S]: S[Key] extends Fn<unknown, infer Output>
		? Output
		: S[Key] extends ConfigurationDefinition
		? Configuration<S[Key]>
		: never
}

export type Keys<Definition extends ConfigurationDefinition> = EndPath<
	Configuration<Definition>
>
