import { Fn, RecursiveObject } from "./basic"

export interface TransformerContext {
	key: string
}

export type Transformer<Input = any, Output = any> = Fn<
	[Input, TransformerContext],
	[Output, TransformerContext]
>

export type ConfigurationDefinition = RecursiveObject<Transformer>

export type ExtractShape<S extends ConfigurationDefinition> = {
	[Key in keyof S]: S[Key] extends Transformer<any, infer Output>
		? Output
		: S[Key] extends ConfigurationDefinition
		? ExtractShape<S[Key]>
		: never
}
