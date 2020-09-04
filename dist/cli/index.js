"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const clipanion_1 = require("clipanion");
const command_1 = require("./command");
const error_1 = require("../lib/utils/error");
async function initialiseCLI() {
    const cli = new clipanion_1.Cli({
        binaryName: "v",
        binaryVersion: "0.0.1",
        enableColors: true,
    });
    cli.register(command_1.AppCommand);
    cli.register(clipanion_1.Command.Entries.Help);
    cli.register(clipanion_1.Command.Entries.Version);
    return cli.runExit(process.argv.slice(2), clipanion_1.Cli.defaultContext);
}
initialiseCLI().catch(error_1.handleError);
//# sourceMappingURL=index.js.map