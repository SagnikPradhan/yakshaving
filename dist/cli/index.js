"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const clipanion_1 = require("clipanion");
const command_1 = require("./command");
const error_1 = require("../lib/utils/error");
async function initialiseCLI() {
    const { name, version } = await Promise.resolve().then(() => __importStar(require("../../package.json")));
    const cli = new clipanion_1.Cli({
        binaryName: name,
        binaryVersion: version,
        enableColors: true,
    });
    cli.register(command_1.AppCommand);
    cli.register(clipanion_1.Command.Entries.Help);
    cli.register(clipanion_1.Command.Entries.Version);
    return cli.runExit(process.argv.slice(2), clipanion_1.Cli.defaultContext);
}
initialiseCLI().catch(error_1.handleError);
//# sourceMappingURL=index.js.map