import test from "ava"
import { flatten } from "./index"

test("flattens object", (t) => {
	t.deepEqual(
		flatten({
			a: { b: { c: 1 } },
		}),
		{ "a.b.c": 1 }
	)
})
