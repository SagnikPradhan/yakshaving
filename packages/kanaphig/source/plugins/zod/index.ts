import { z } from "zod"
import { TransformerContext, Transformer } from "../../core"
import { KanaphigError } from "../../core/utilities/error"

type ZodSchema<Output, Def extends z.ZodTypeDef, Input> =
	| z.ZodType<Output, Def, Input>
	| z.ZodEffects<z.ZodType<Input, Def>, Output>

/**
 * Use zod to describe configuration fields
 *
 * @param schema - Zod schema
 */
export function zod<
	Output,
	Definition extends z.ZodTypeDef,
	InputContext extends TransformerContext,
	Input = Output
>(
	schema: ZodSchema<Output, Definition, Input>
): Transformer<InputContext, Omit<InputContext, "data"> & { data: Output }> {
	return ({ data: input, ...context }) => {
		const result = schema.safeParse(input)

		if (result.success) return { data: result.data, ...context }
		else {
			throw new KanaphigError("KanaphigZodError", {
				message: `Unable to parse. Found ${result.error.errors.length} issues in ${context.path}`,
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
