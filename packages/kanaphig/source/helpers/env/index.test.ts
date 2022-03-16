import t from "tap"

import { env } from "../env"

const OLD_ENV = process.env

t.beforeEach(() => {
	process.env = {}
})

t.afterEach(() => {
	process.env = { ...OLD_ENV }
})

t.test("filter and prefix", (t) => {
	t.plan(1)

	process.env = {
		APP__CLIENT_TOKEN: "client-token",
		APP__WEBSITE_URL: "url",
	}

	t.same(env({ filter: /(APP__).+/, removePrefix: "APP__" }), {
		clientToken: "client-token",
		websiteUrl: "url",
	})
})

t.test("parse keys", (t) => {
	t.plan(1)

	process.env = {
		DISCORD__BASE_URL: "url",
		DISCORD__CLIENT__TOKEN: "client-token",
		DISCORD__CLIENT__ID: "client-id",
	}

	t.same(env(), {
		"discord.baseUrl": "url",
		"discord.client.token": "client-token",
		"discord.client.id": "client-id",
	})
})

t.test("parse values", (t) => {
	t.plan(1)

	process.env = {
		PORT: "8080",
	}

	t.same(env(), { port: 8080 })
})
