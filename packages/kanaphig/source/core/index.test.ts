import t from "tap"
import { K } from "."

import { z } from "zod"
import { zod } from "../plugins/zod"

t.test("K.all + zod + .env file source", (t) => {
	t.plan(1)

	const directory = t.testdir({
		".env": [
			"DISCORD__CLIENT_TOKEN=client-token",
			"DISCORD__CLIENT_SECRET=client-secret",
			"DISCORD__CLIENT_ID=client-id",
			"PORT=8080",
		].join("\n"),
	})

	const configuration = new K({
		files: [`${directory}/.env`],

		definition: {
			discord: zod(
				z.object({
					clientId: z.string(),
					clientSecret: z.string(),
					clientToken: z.string(),
				})
			),

			port: zod(z.string()),
		},
	})

	t.same(configuration.all(), {
		discord: {
			clientToken: "client-token",
			clientSecret: "client-secret",
			clientId: "client-id",
		},

		port: "8080",
	})
})

t.test("K.all + zod + .env source", (t) => {
	t.plan(1)

	Object.assign(process.env, { DISCORD__CLIENT_ID: "client-id" })

	const configuration = new K({
		env: true,
		definition: { discord: { clientId: zod(z.string()) } },
	})

	t.same(configuration.get("discord.clientId"), "client-id")
})

t.test("K.all + zod + .yaml source", (t) => {
	t.plan(1)

	const directory = t.testdir({
		"config.yaml": [
			"discord:",
			"  clientToken: client-token",
			"  clientSecret: client-secret",
			"  clientId: client-id",
			"port: 8080",
		].join("\n"),
	})

	const configuration = new K({
		files: [`${directory}/config.yaml`],

		definition: {
			discord: zod(
				z.object({
					clientId: z.string(),
					clientSecret: z.string(),
					clientToken: z.string(),
				})
			),

			port: zod(z.number()),
		},
	})

	t.same(configuration.all(), {
		discord: {
			clientToken: "client-token",
			clientSecret: "client-secret",
			clientId: "client-id",
		},

		port: "8080",
	})
})

t.test(
	"K.all + zod + .json source KanaphigInvalidDataError:FoundNoObject",
	(t) => {
		t.plan(1)

		const directory = t.testdir({
			"config.json": JSON.stringify({ property: "value" }),
		})

		t.throws(
			() =>
				new K({
					files: [`${directory}/config.json`],

					definition: {
						property: {
							innerProperty: {
								property: zod(z.string()),
							},
						},
					},
				})
		)
	}
)

t.test("K.all + zod + args", (t) => {
	t.plan(1)

	const configuration = new K({
		args: "--port 8080 --discord.clientId client-id",

		definition: {
			discord: { clientId: zod(z.string()) },
			port: zod(z.number()),
		},
	})

	t.same(configuration.all(), {
		port: 8080,
		discord: { clientId: "client-id" },
	})
})

t.test("KanaphigInvalidConfigFileError", (t) => {
	t.plan(1)
	const directory = t.testdir({ "config.toml": "" })
	t.throws(() => new K({ files: [`${directory}/config.toml`], definition: {} }))
})

t.test("K.get + zod + config.json", (t) => {
	t.plan(4)

	const source = {
		key: {
			innerKey: {
				property: "value",
			},
		},
		array: [0, 1, 2],
		tuple: ["value"],
		nestedArray: [{ a: { b: { c: 1 } } }],
	}

	const directory = t.testdir({ "config.json": JSON.stringify(source) })

	const configuration = new K({
		files: [`${directory}/config.json`],

		definition: {
			key: { innerKey: { property: zod(z.string()) } },
			array: zod(z.array(z.number())),
			tuple: zod(z.tuple([z.string()])),
			nestedArray: zod(
				z.array(z.object({ a: z.object({ b: z.object({ c: z.literal(1) }) }) }))
			),
		},
	})

	t.same(
		configuration.get("key.innerKey.property"),
		source.key.innerKey.property
	)

	t.same(configuration.get("array[0]"), source.array[0])

	t.same(configuration.get("tuple[0]"), source.tuple[0])

	t.same(configuration.get("nestedArray[0].a.b.c"), source.nestedArray[0].a.b.c)
})

t.test("K.set + zod + config.json", (t) => {
	t.plan(3)

	const source = { a: 1 }
	const directory = t.testdir({ "config.json": JSON.stringify(source) })

	const configuration = new K({
		files: [`${directory}/config.json`],
		definition: { a: zod(z.number()) },
	})

	t.same(configuration.get("a"), 1)
	t.same(configuration.set("a", 2), 2)
	t.same(configuration.get("a"), 2)
})

t.test("KanaphigInvalidUpdateError", (t) => {
	t.plan(1)

	const configuration = new K({
		files: [],
		definition: {},
	})

	// @ts-expect-error
	t.throws(() => configuration.set("something.that.does.not.exist", "value"))
})
