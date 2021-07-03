// Third party
import { Command } from "clipanion";

// Local
import { watch } from "./implmentation";

export class WatchCommand extends Command {
  static override paths = [["watch"]];

  async execute() {
    await watch();
  }
}
