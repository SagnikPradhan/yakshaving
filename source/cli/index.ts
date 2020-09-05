import "source-map-support/register";

import { Cli as CLI, Command } from "clipanion";
import { AppCommand } from "./command";
import { handleError } from "../lib/utils/error";

async function initialiseCLI() {
  const { name, version } = await import("../../package.json" as string);

  const cli = new CLI({
    binaryName: name,
    binaryVersion: version,
    enableColors: true,
  });

  cli.register(AppCommand);
  cli.register(Command.Entries.Help);
  cli.register(Command.Entries.Version);

  return cli.runExit(process.argv.slice(2), CLI.defaultContext);
}

initialiseCLI().catch(handleError);
