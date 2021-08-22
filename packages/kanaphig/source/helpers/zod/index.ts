import { z } from "zod"

export function zod<Output, Def extends z.ZodTypeDef, Input = Output>(
	schema:
		| z.ZodType<Output, Def, Input>
		| z.ZodEffects<z.ZodType<Input, Def>, Output>
) {
	return (input: Input): Output => schema.parse(input)
}

export { z }
