// third party
import { Command } from "clipanion"

// local
import { watch } from "./implmentation"

export class WatchCommand extends Command {
	static override paths = [["watch"]]

	async execute() {
		await watch()
	}
}
