export type Indices = string | number
export type Indexable = { [index: Indices]: any }

export type Path<O, K extends keyof O = keyof O> = K extends Indices
	? K | `${K}${InnerPath<O[K]>}`
	: ""

type InnerPath<O, K extends keyof O = keyof O> = K extends Indices &
	StripInheritedKeys<O>
	?
			| (O[K] extends Indexable
					? `${Notation<O, K>}${InnerPath<O[K], StripInheritedKeys<O[K]>>}`
					: never)
			| `${Notation<O, K>}`
	: ""

type Notation<O, K extends keyof O & Indices> = `${Dot<O>}${Bracket<O, K>}`

type Dot<O> = O extends any[] ? "" : "."
type Bracket<O, K extends keyof O & Indices> = O extends any[]
	? `[${K}]`
	: `${K}`

type StripInheritedKeys<O> = O extends any[]
	? number extends O["length"]
		? keyof O & number
		: Exclude<keyof O, keyof O & keyof any[]>
	: keyof O

type MidSeperators = "." | "[" | "]."
type EndSeperators = "]" | ""

export type PathValue<P, O> = P extends ""
	? O
	: O extends Indexable
	? P extends keyof O
		? O[P]
		: P extends `${infer Key}${MidSeperators}${infer Rest}${EndSeperators}`
		? Key extends keyof O
			? PathValue<Rest, O[Key]>
			: O extends (infer U)[]
			? PathValue<Rest, U> | undefined
			: never
		: O extends (infer U)[]
		? P extends `${number}`
			? U | undefined
			: never
		: never
	: never
