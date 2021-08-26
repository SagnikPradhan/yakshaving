import chalk from "chalk"
import dedent from "ts-dedent"
import StackTrace from "stacktracey"

import { createFormatter } from "fmt-obj"

import util from "util"

export class SundorError extends Error {
	#formatter = createFormatter({
		formatter: {
			property: chalk.yellow,
		},
	});

	[util.inspect.custom]() {
		const isInteractive = Boolean(
			process.stderr.isTTY &&
				process.env["TERM"] !== "dumb" &&
				!("CI" in process.env)
		)

		if (!isInteractive) return this

		const stack = new StackTrace(this)
			.withSources()
			.items.map((item) => stackTrace(item))
			.join("\n")

		return chalk.white(dedent`
				${chalk.bgRed(this.name)}: ${chalk.yellow(this.message)}
				${this.#formatter({ ...this } as Record<string, unknown>, Infinity)}

				${stack}
			`)
	}
}

function stackTrace({
	callee,
	fileName,
	line,
	column,
	fileRelative,
}: StackTrace.Entry) {
	if (fileRelative.includes("node:internal"))
		return `- ${chalk.dim(fileRelative)}`

	if (callee)
		return dedent`
	- ${chalk.yellow(callee)} ${fileName}:${line}:${column}
	  ${chalk.dim(fileRelative)}
	`
	return dedent`
	- ${chalk.yellow(fileName)}:${line}:${column}
	  ${chalk.dim(fileRelative)}
	`
}
