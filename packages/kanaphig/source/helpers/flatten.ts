import { RecursiveObject } from "../types/basic";

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], Exclude<keyof T[Key], keyof any[]>> &
            string}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type PathImpl2<T> = PathImpl<T, keyof T> | keyof T;

export type Path<T> = PathImpl2<T> extends string | keyof T
  ? PathImpl2<T>
  : keyof T;

export type PathValue<
  T,
  P extends Path<T>
> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

export type Flatten<O extends RecursiveObject<unknown>> = {
  [P in Path<O>]: PathValue<O, P>;
};

export function flattenObject<O extends RecursiveObject<unknown>>(
  object: O,
  path = ""
) {
  const flattened = {} as Flatten<O>;

  for (const [key, value] of Object.entries(object))
    if (typeof value !== "object" || value === null)
      flattened[`${path}${key}` as Path<O>] = value as PathValue<O, Path<O>>;
    else
      Object.assign(
        flattened,
        flattenObject(value as RecursiveObject<unknown>, `${path}${key}.`)
      );

  return flattened;
}

export type UnFlatten<O extends Record<string, unknown>> = O extends Flatten<
  infer NestedO
>
  ? NestedO
  : never;

export function unflatten<O extends Record<string, unknown>>(object: O) {
  const result = {} as UnFlatten<O>;

  for (const [key, value] of Object.entries(object)) {
    const parts = key.split(".");

    const object = parts.reduce((object, part, idx) => {
      if (idx === parts.length - 1) return object;

      if (typeof object[part] !== "object" || object[part] === null)
        object[part] = {};

      return object[part] as Record<string, unknown>;
    }, result as Record<string, unknown>);

    object[parts[parts.length - 1]!] = value;
  }

  return result;
}
