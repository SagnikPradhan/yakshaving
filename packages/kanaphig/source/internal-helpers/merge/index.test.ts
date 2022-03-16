import t from "tap"
import { deepMerge } from "."

t.same(
	deepMerge({ a: [0, 1, 2, 3] }, { a: [4, 5, 6, 7] }),
	{
		a: [0, 1, 2, 3, 4, 5, 6, 7],
	},
	"Merge arrays"
)

t.same(
	deepMerge({ a: true }, { b: false }),
	{ a: true, b: false },
	"Merge objects"
)

t.same(
	deepMerge({ a: true }, { a: false }),
	{ a: false },
	"Override primitives"
)

t.todo("Recurisve merge")
