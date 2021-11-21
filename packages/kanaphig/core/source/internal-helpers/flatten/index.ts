import { RecursiveObject } from "../../types/basic"

export type Path<O> = O extends RecursiveObject
	? {
			[K in keyof O]: K extends string
				? O[K] extends RecursiveObject
					? `${K}.${Path<O[K]>}`
					: K
				: ""
	  } extends infer M
		? M[keyof M]
		: never
	: ""

export type PathValue<
	O,
	P extends Path<O> | EndPath<O>
> = P extends `${infer Key}.${infer Rest}`
	? Key extends keyof O
		? Rest extends Path<O[Key]>
			? PathValue<O[Key], Rest>
			: never
		: never
	: P extends keyof O
	? O[P]
	: never

export type Flatten<O> = {
	[P in Path<O> as PathValue<O, P> extends RecursiveObject
		? never
		: P]: PathValue<O, P>
}

export type EndPath<O> = keyof Flatten<O>

function isObject(value: unknown): value is RecursiveObject {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function flatten<O extends RecursiveObject>(object: O, path = "") {
	const flattened = {} as Flatten<O>

	for (const [key, value] of Object.entries(object))
		if (isObject(value))
			Object.assign(flattened, flatten(value, `${path}${key}.`))
		else
			flattened[`${path}${key}` as keyof Flatten<O>] = value as PathValue<
				O,
				Path<O>
			>

	return flattened
}

export type UnFlatten<O extends Record<string, unknown>> = O extends Flatten<
	infer NestedO
>
	? NestedO
	: never

export function unflatten<O extends Record<string, unknown>>(object: O) {
	const result = {} as UnFlatten<O>

	for (const [key, value] of Object.entries(object)) {
		const parts = key.split(".")

		const object = parts.reduce((object, part, idx) => {
			if (idx === parts.length - 1) return object

			if (!isObject(object[part])) object[part] = {}

			return object[part] as Record<string, unknown>
		}, result as Record<string, unknown>)

		object[parts[parts.length - 1]!] = value
	}

	return result
}
