import { K } from "@yakshaving/kanaphig/core/k"
import { sources } from "@yakshaving/kanaphig/plugins/sources"
import { utilities } from "@yakshaving/kanaphig/plugins/utilities"
import { zod } from "@yakshaving/kanaphig/plugins/zod"

export default new K({
	plugins: [
		utilities(),
		sources({ environmentVariablesPrefix: "EXAMPLE" }),
		zod(),
	],

	schema: ({ z, zod }) => ({
		siteURL: zod(z.string()),
		port: zod(z.number()),

		discord: {
			token: zod(z.string()),
			id: zod(z.string()),
		},
	}),
})
