import { ConfigurationSource } from "./source"
import { RecursiveObject } from "../types/basic"

export type PluginFactory<
  Name extends string,
  Helpers extends RecursiveObject<unknown> = Record<string, never>
> = ( source: ConfigurationSource ) => PluginInterface<Name, Helpers>;

export type PluginInterface<
  Name extends string,
  Helpers extends RecursiveObject<unknown> = Record<string, never>
> = {
  name: Name;
  helpers: Helpers;
};

export type ExtractHelpers<Plugins extends PluginFactory<any>[]> =
  Plugins extends [PluginFactory<infer Name, infer Helpers>]
    ? { [name in Name]: Helpers }
    : Plugins extends [
        PluginFactory<infer Name, infer Helpers>,
        ...infer OtherPlugins
      ]
    ? OtherPlugins extends PluginFactory<any>[]
      ? ExtractHelpers<OtherPlugins> & { [name in Name]: Helpers }
      : { [name in Name]: Helpers }
    : never;
