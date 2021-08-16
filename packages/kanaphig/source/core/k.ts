// locals
import { ExtractConfigurationFromSchema, Schema } from "./schema";
import { ExtractHelpers, Plugin } from "./plugin";
import { Path, PathValue, flattenObject } from "../helpers/flatten";
import { Fn, RecursiveObject } from "../types/basic";

export class K<
  Plugins extends Plugin<any>[] | [Plugin<any>],
  UserSchema extends Schema
> {
  #configuration = new Map<Path<UserSchema>, unknown>();

  constructor({
    plugins,
    schema: schemaFactory,
  }: {
    plugins: Plugins;
    schema: (helpers: ExtractHelpers<Plugins>) => UserSchema;
  }) {
    const { helpers, source } = this.extractInformationFromPlugins(plugins);

    const schema = schemaFactory(helpers);
    const flattenedSchema = flattenObject(schema) as Record<
      string,
      Fn<unknown>
    >;

    for (const [key, transformer] of Object.entries(flattenedSchema))
      this.#configuration.set(key, transformer(source[key]));
  }

  private extractInformationFromPlugins(plugins: Plugins) {
    return plugins.reduce(
      ({ source, helpers }, plugin) => ({
        helpers: { ...helpers, [plugin.name]: plugin.helpers },
        source: { ...source, ...flattenObject(plugin.source || {}) },
      }),
      {
        source: {} as RecursiveObject<unknown>,
        helpers: {} as ExtractHelpers<Plugins>,
      }
    );
  }

  public get<P extends Path<UserSchema>>(path: P) {
    return this.#configuration.get(path) as PathValue<
      ExtractConfigurationFromSchema<UserSchema>,
      P
    >;
  }
}
