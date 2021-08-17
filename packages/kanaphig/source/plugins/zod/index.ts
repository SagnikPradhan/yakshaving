import { z } from "zod"
import { plugin } from "../../core/plugin"

export const zod = () =>
	plugin({
		name: "zod",

		helpers: {
			/** Zod module */
			z,

			/**
			 * Zod parser helper
			 *
			 * @param schema - Zod schema
			 */
			zod<Output, Def extends z.ZodTypeDef, Input = Output>(
				schema:
					| z.ZodType<Output, Def, Input>
					| z.ZodEffects<z.ZodType<Input, Def>, Output>
			) {
				return (input: Input): Output => schema.parse(input)
			},
		},
	})
