import test from "ava"
import { env } from "."

const OLD_ENV = process.env

test.beforeEach(() => {
	process.env = {}
})

test.afterEach(() => {
	process.env = { ...OLD_ENV }
})

test.serial("filter and prefix", (t) => {
	process.env = {
		APP__CLIENT_TOKEN: "client-token",
		APP__WEBSITE_URL: "url",
	}

	t.deepEqual(env({ filter: /(APP__).+/, removePrefix: "APP__" }), {
		clientToken: "client-token",
		websiteUrl: "url",
	})
})

test.serial("parse keys", (t) => {
	process.env = {
		DISCORD__BASE_URL: "url",
		DISCORD__CLIENT__TOKEN: "client-token",
		DISCORD__CLIENT__ID: "client-id",
	}

	t.deepEqual(env(), {
		"discord.baseUrl": "url",
		"discord.client.token": "client-token",
		"discord.client.id": "client-id",
	})
})

test.serial("parse values", (t) => {
	process.env = {
		PORT: "8080",
	}

	t.deepEqual(env(), { port: 8080 })
})
