import { RecursiveObject } from "../types/basic";

export interface Plugin<
  Name extends string,
  Helpers extends RecursiveObject<unknown> = Record<string, any>
> {
  name: Name;
  helpers?: Helpers;
  source?: RecursiveObject<unknown>;
}

export type ExtractHelpers<Plugins extends Plugin<any>[]> = Plugins extends [
  Plugin<infer Name, infer Helpers>
]
  ? { [name in Name]: Helpers }
  : Plugins extends [Plugin<infer Name, infer Helpers>, ...infer OtherPlugins]
  ? OtherPlugins extends Plugin<any>[]
    ? ExtractHelpers<OtherPlugins> & { [name in Name]: Helpers }
    : { [name in Name]: Helpers }
  : never;

export const plugin = <
  Name extends string,
  UserPlugin extends Plugin<Name, any>
>(
  plugin: UserPlugin
) => plugin;
