import { Fn, RecursiveObject } from "../types/basic";

export type Schema = RecursiveObject<Fn>;

export type ExtractConfigurationFromSchema<S extends Schema> = {
  [Key in keyof S]: S[Key] extends Fn<unknown, infer Output>
    ? Output
    : S[Key] extends Schema
    ? ExtractConfigurationFromSchema<S[Key]>
    : never;
};
