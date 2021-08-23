import { RecursiveObject } from "../../types/basic"

type Merged<Objects extends [RecursiveObject] | RecursiveObject[]> =
	Objects extends [infer OnlyOne]
		? OnlyOne
		: Objects extends [infer FirstOne, ...infer Rest]
		? Rest extends [RecursiveObject] | RecursiveObject[]
			? FirstOne & Merged<Rest>
			: FirstOne
		: Record<string, unknown>

export function deepMerge<
	Objects extends [RecursiveObject] | RecursiveObject[]
>(...objects: Objects) {
	const merged = {} as Merged<Objects>

	for (const object of objects) {
		for (const key in object) {
			const newProperty = object[key]
			const mergedProperty = merged[key]

			// If objects, deep merge
			if (isObject(newProperty)) {
				if (isObject(mergedProperty)) {
					merged[key] = deepMerge(mergedProperty, newProperty)
					continue
				}
			}

			// If arrays, create new array
			if (Array.isArray(newProperty)) {
				if (Array.isArray(mergedProperty)) {
					merged[key] = [...mergedProperty, ...newProperty]
					continue
				}
			}

			// Else rewrite
			merged[key] = newProperty
		}
	}

	return merged
}

const isObject = (value: unknown): value is RecursiveObject =>
	typeof value === "object" && !Array.isArray(value) && value !== null
