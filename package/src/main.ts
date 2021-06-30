import { Cli } from "clipanion";

import { handleError } from "./utils/error";

async function main() {
  const cli = new Cli({
    binaryLabel: "yakshaving",
    binaryName: "yakshaving",
    binaryVersion: "1.0.0",
  });

  cli.run(process.argv.slice(2), Cli.defaultContext);
}

main().catch(handleError());
