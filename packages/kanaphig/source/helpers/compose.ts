import { Fn } from "../types/basic"

export function compose<Fns extends Fn[]> (
  fns: Fns
): ( argument: FirstArgument<Fns> ) => LastReturn<Fns> {
  return ( value: FirstArgument<Fns> ) =>
    fns.reduce( ( value, fn ) => fn( value ), value as LastReturn<Fns> )
}

/** chain of functions, output of first function is input of second function */
export type Chain<Fns extends Fn[]> =
  // we chain two functions at one time
  Fns extends [infer Fn1, infer Fn2, ...infer RestFns]
    // make sure two elements are functions
    ?  Fn1 extends Fn<infer Fn1Argument>
      ? Fn2 extends Fn<infer Fn2Argument>
        ? RestFns extends Fn[]
          // rest of the elements exist
          ?  [Fn<Fn1Argument, Fn2Argument>, ...Chain<[Fn2, ...RestFns]>]
          // only two elements
          :  [Fn<Fn1Argument, Fn2Argument>, Fn2]
        // second element not a function
        :  [Fn1]
      // first element not a function
      :  never
    // seems like we don't have two elements
    :Fns extends [infer Fn]
    ? [Fn]
    // the only element is not a function
    :  never;

/** argument of first function in an array */
export type FirstArgument<Elements extends Fn[]> = Elements extends [
  Fn<infer Argument>,
  ...any
]
  ? Argument
  : never;

/** return type of last function in an array */
export type LastReturn<Elements extends Fn[]> = Elements extends [
  ...any,
  Fn<any, infer Return>
]
  ? Return
  : never;
