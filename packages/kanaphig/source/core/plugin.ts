import { RecursiveObject } from "../types/basic"

export interface Plugin<
	Name extends string,
	Helpers extends RecursiveObject<unknown> = Record<string, any>
> {
	name: Name
	helpers?: Helpers
	source?: RecursiveObject<unknown>
}

export type ExtractHelpers<Plugins extends Plugin<any>[]> = Plugins extends [
	Plugin<any, infer Helpers>
]
	? Helpers
	: Plugins extends [Plugin<any, infer Helpers>, ...infer OtherPlugins]
	? OtherPlugins extends Plugin<any>[]
		? ExtractHelpers<OtherPlugins> & Helpers
		: Helpers
	: never

export const plugin = <
	Name extends string,
	UserPlugin extends Plugin<Name, any>
>(
	plugin: UserPlugin
) => plugin
