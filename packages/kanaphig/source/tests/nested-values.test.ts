import t from "tap"

import { K } from ".."
import { z } from "zod"
import { zod } from "../helpers/zod"

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

t.same(
	configuration.get("something.join"),
	"valueA",
	"Nested values returned while using zod"
)

t.same(
	configuration.all(),
	{ something: { join: "valueA", leave: "valueB" } },
	"Gets complete configuraiton"
)
