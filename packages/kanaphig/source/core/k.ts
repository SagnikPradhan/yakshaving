// locals
import { ExtractConfigurationFromSchema, Schema } from "./schema";
import { ExtractHelpers, PluginFactory } from "./plugin";
import { Path, PathValue, flattenObject } from "../helpers/flatten";
import { ConfigurationSource } from "./source";
import { Fn } from "../types/basic";

export class K<
  PluginFactories extends PluginFactory<any>[] | [PluginFactory<any>],
  UserSchema extends Schema
> {
  #configuration: Record<string, unknown>;

  constructor(
    factories: PluginFactories,
    schemaFactory: (helpers: ExtractHelpers<PluginFactories>) => UserSchema
  ) {
    const source = new ConfigurationSource();
    const plugins = factories.map((factory) => factory(source));

    const helpers = Object.fromEntries(
      plugins.map(({ name, helpers }) => [name, helpers])
    ) as ExtractHelpers<PluginFactories>;

    const schema = schemaFactory(helpers);
    const flattenedSchema = flattenObject(schema) as Record<
      string,
      Fn<unknown>
    >;

    this.#configuration = {} as Record<string, unknown>;

    for (const key in flattenedSchema) {
      const transformer = flattenedSchema[key]!;
      this.#configuration[key] = transformer(source.get(key));
    }
  }

  get<P extends Path<UserSchema>>(path: P) {
    return this.#configuration[path as string] as PathValue<
      ExtractConfigurationFromSchema<UserSchema>,
      P
    >;
  }
}
