import { K } from "@yakshaving/kanaphig/core/k"
import { sources } from "@yakshaving/kanaphig/plugins/sources"
import { utilities } from "@yakshaving/kanaphig/plugins/utilities"
import { zod } from "@yakshaving/kanaphig/plugins/zod"

export default new K({
	plugins: [utilities(), sources(), zod()],

	schema: ({ env, chain, z, zod }) => ({
		discord: {
			token: chain(env("DISCORD_TOKEN"), zod(z.string())),
		},
	}),
})
