import { Fn } from "../core/types/basic"

/**
 * Chains functions
 *
 * @param fns - Functions
 * @returns New function
 */
export function chain<Fns extends Fn[] | [Fn]>(
	...fns: Fns
): (argument: FirstArgument<Fns>) => LastReturn<Fns> {
	return (value: FirstArgument<Fns>) =>
		fns.reduce((value, fn) => fn(value), value as LastReturn<Fns>)
}

/** Chain of functions, output of first function is input of second function */
export type Chain<Fns extends Fn[]> =
	// we chain two functions at one time
	Fns extends [infer Fn1, infer Fn2, ...infer RestFns]
		? // make sure two elements are functions
		  Fn1 extends Fn<infer Fn1Argument>
			? Fn2 extends Fn<infer Fn2Argument>
				? RestFns extends Fn[]
					? // rest of the elements exist
					  [Fn<Fn1Argument, Fn2Argument>, ...Chain<[Fn2, ...RestFns]>]
					: // only two elements
					  [Fn<Fn1Argument, Fn2Argument>, Fn2]
				: // second element not a function
				  [Fn1]
			: // first element not a function
			  never
		: // seems like we don't have two elements
		Fns extends [infer Fn]
		? [Fn]
		: // the only element is not a function
		  never

/** Argument of first function in an array */
export type FirstArgument<Elements extends Fn[]> = Elements extends [
	Fn<infer Argument>,
	...any
]
	? Argument
	: never

/** Return type of last function in an array */
export type LastReturn<Elements extends Fn[]> = Elements extends [
	...any,
	Fn<any, infer Return>
]
	? Return
	: never
