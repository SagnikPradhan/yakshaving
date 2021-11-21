import test from "ava"

import { K } from ".."
import { z } from "zod"
import { zod } from "../helpers/zod"

test("Nested values returned while using zod", (test) => {
	const configuration = new K({
		sources: [
			{
				something: {
					join: "valueA",
					leave: "valueB",
				},
			},
		],

		definition: {
			something: {
				join: zod(z.string()),
				leave: zod(z.string()),
			},
		},
	})

	test.is(configuration.get("something.join"), "valueA")
})
