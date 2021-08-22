import test from "ava"
import mockFs from "mock-fs"

import { K } from "."
import { env } from "./helpers/env"
import { file } from "./helpers/file"
import { z, zod } from "./helpers/zod"

const OLD_ENV = process.env

test.beforeEach(() => {
	process.env = {}
})

test.afterEach(() => {
	mockFs.restore()
	process.env = { ...OLD_ENV }
})

test.serial("yaml, env, zod config", (test) => {
	mockFs({
		"config.yml": `
      port: 8080
      websiteUrl: localhost:8080
    `,
	})

	process.env = {
		PORT: "80",
		WEBSITE_URL: "https://example.com",
	}

	const config = new K({
		sources: [file("config.yml"), env()],

		structure: {
			port: zod(z.number()),
			websiteUrl: zod(z.string()),
		},
	})

	test.is(config.get("port"), 80)
	test.is(config.get("websiteUrl"), "https://example.com")
})
