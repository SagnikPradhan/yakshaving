import t from "tap"
import { K } from "../../core"
import { z } from "zod"
import { zod } from "."

t.test("K.all + zod + yaml Zod vaidation error", (t) => {
	t.plan(1)

	const directory = t.testdir({ "config.yml": 'port: "8080"' })

	t.throws(
		() =>
			new K({
				files: [`${directory}/config.yml`],
				definition: { port: zod(z.number()) },
			})
	)
})

t.test("K.all + zod + json Zod validation nested errors", (t) => {
	t.plan(1)

	const directory = t.testdir({
		"config.json": JSON.stringify({
			discord: {
				client: {
					id: 100,
					secret: "",
				},
			},
		}),
	})

	t.throws(
		() =>
			new K({
				files: [`${directory}/config.json`],
				definition: {
					discord: zod(
						z.object({
							client: z.object({
								id: z.string().min(1),
								secret: z.string().min(1),
							}),
						})
					),
				},
			})
	)
})
