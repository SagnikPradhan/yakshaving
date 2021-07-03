// third party
import { Cli } from "clipanion"

// local files
import { name, version } from "bundte/package.json"
import { WatchCommand } from "./core/watch/command"
import { handleError } from "./utils/error"

// main entry point
async function main () {
  const cli = new Cli( {
    binaryLabel: name,
    binaryName: name,
    binaryVersion: version,
  } )

  cli.register( WatchCommand )

  cli.run( process.argv.slice( 2 ), Cli.defaultContext )
}

main().catch( handleError() )
