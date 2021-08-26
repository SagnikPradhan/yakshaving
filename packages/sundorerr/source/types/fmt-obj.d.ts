declare module "fmt-obj" {
	interface RecursiveObject {
		[index: string]: unknown | RecursiveObject
	}

	export type Tokens =
		| "punctuation"
		| "annotation"
		| "property"
		| "literal"
		| "number"
		| "string"

	export type Formatter = Partial<Record<Tokens, () => string>>

	export default function format(
		obj: RecursiveObject,
		depth: number = Infinity
	): string

	export function createFormatter(options: {
		offset?: number
		formatter?: Formatter
	}): typeof format
}
