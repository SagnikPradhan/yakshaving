import type { z } from "zod"
import { KanaphigError } from "../.."

/**
 * Use zod to describe configuration fields
 *
 * @param schema - Zod schema
 */
export function zod<Output, Def extends z.ZodTypeDef, Input = Output>(
	schema:
		| z.ZodType<Output, Def, Input>
		| z.ZodEffects<z.ZodType<Input, Def>, Output>
) {
	return (input: unknown) => {
		const result = schema.safeParse(input)

		if (result.success) return result.data
		else {
			throw new KanaphigError("KanaphigZodError", {
				message: `Unable to parse. Found ${result.error.errors.length} issues.`,
				isOperational: false,
				input,
				errors: formatErrors(result.error.errors),
			})
		}
	}
}

function formatErrors(issues: z.ZodIssue[]) {
	return issues.map(({ message, path }) =>
		path.length > 0 ? `${path.join(".")} - ${message}` : message
	)
}
