import { z } from "zod"
import { K, env, file, zod } from "@yakshaving/kanaphig"

const configuration = new K({
	sources: [
		env({ prefix: "EXAMPLE__", filter: /(EXAMPLE__)./ }),
		file("config.yml"),
	],

	structure: {
		client: {
			token: zod(z.string()),
			id: zod(z.string()),
		},

		port: zod(z.number()),
		websiteUrl: zod(z.string().url()),
	},
})

console.log(configuration.get("client.token"))
