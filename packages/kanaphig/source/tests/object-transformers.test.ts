// https://github.com/SagnikPradhan/yakshaving/issues/19

import t from "tap"
import { z } from "zod"
import { K } from ".."
import { zod } from "../helpers/zod"

const configuration = new K({
	definition: {
		discord: zod(
			z.object({
				id: z.string(),
				secret: z.string(),
			})
		),
	},

	sources: [
		{
			discord: {
				id: "SOME_STRING",
				secret: "SOME_OTHER_STRING",
			},
		},
	],
})

t.same(
	configuration.get("discord.id"),
	"SOME_STRING",
	"Object transformers work properly"
)
