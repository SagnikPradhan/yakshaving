import { z } from "zod"

import { K } from "@yakshaving/kanaphig"
import {} from "@yakshaving/kanaphig/helpers/env"

const configuration = new K({
	sources: [
		env({ removePrefix: "EXAMPLE__", filter: /(EXAMPLE__)./ }),
		file("config.yml"),
	],

	definition: {
		client: {
			token: zod(z.string()),
			id: zod(z.string()),
		},

		port: zod(z.number()),
		websiteUrl: zod(z.string().url()),
	},
})

console.log(configuration.all())
