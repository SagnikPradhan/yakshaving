import test from "ava"
import { deepMerge } from "."

test("merge arrays", (t) => {
	t.deepEqual(deepMerge({ a: [0, 1, 2, 3] }, { a: [4, 5, 6, 7] }), {
		a: [0, 1, 2, 3, 4, 5, 6, 7],
	})
})

test("merge objects", (t) => {
	t.deepEqual(deepMerge({ a: true }, { b: false }), { a: true, b: false })
})

test("override primitives", (t) => {
	t.deepEqual(deepMerge({ a: true }, { a: false }), { a: false })
})
