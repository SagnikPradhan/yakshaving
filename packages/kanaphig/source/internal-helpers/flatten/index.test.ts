import t from "tap"
import { flatten } from "."

t.same(
	flatten({
		a: { b: { c: 1 } },
	}),

	{ "a.b.c": 1 },

	"Flattens object"
)
