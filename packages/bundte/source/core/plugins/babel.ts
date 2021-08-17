// third party
import type { Options as PresetEnvOptions } from "@babel/preset-env"
import type { TransformOptions } from "@babel/core"

// native
import { promises as fs } from "fs"

// local
import { root } from "../../utils/path"

/** Get default babel options. */
export function getBabelDefaultOptions(): Omit<
	TransformOptions,
	"include" | "exclude"
> {
	return {
		presets: [
			[
				require.resolve("@babel/preset-env"),
				{
					targets: { node: "14" },
					modules: false,
					useBuiltIns: "usage",
					corejs: { version: 3, proposals: true },
				} as PresetEnvOptions,
			],

			[require.resolve("@babel/preset-stage-3"), { useBuiltIns: true }],
		],
	}
}

/** Checks if there is a babelrc or babel.config is in users root directory. */
export async function doesUserHaveBabelConfig() {
	const items = await fs.readdir(root())
	return items.some((item) => ["babelrc", "babel.config"].includes(item))
}
