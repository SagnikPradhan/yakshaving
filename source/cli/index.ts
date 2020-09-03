import "source-map-support/register";

import { Cli as CLI, Command } from "clipanion";
import { AppCommand } from "./command";
import { handleError } from "../lib/utils/error";

async function initialiseCLI() {
  const cli = new CLI({
    binaryName: "v",
    binaryVersion: "0.0.1",
    enableColors: true,
  });

  cli.register(AppCommand);
  cli.register(Command.Entries.Help);
  cli.register(Command.Entries.Version);

  return cli.runExit(process.argv.slice(2), CLI.defaultContext);
}

initialiseCLI().catch(handleError);
