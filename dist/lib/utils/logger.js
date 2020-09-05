"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _timeMap;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const colorette_1 = __importDefault(require("colorette"));
/**
 * Logger for the Library
 * @param origin - Point of origin
 */
class Logger {
    constructor(origin) {
        this.origin = origin;
        _timeMap.set(this, new Map());
    }
    log(message, tag) {
        if (tag) {
            const time = __classPrivateFieldGet(this, _timeMap).get(tag);
            if (time === undefined) {
                __classPrivateFieldGet(this, _timeMap).set(tag, Date.now());
                process.stdout.write(`[${colorette_1.default.gray(this.origin)}] `);
            }
            else {
                __classPrivateFieldGet(this, _timeMap).delete(tag);
                const pastTime = Date.now() - time;
                process.stdout.write(`[${colorette_1.default.gray(this.origin)}] ${colorette_1.default.green(pastTime + "ms")} `);
            }
        }
        else
            process.stdout.write(`[${colorette_1.default.gray(this.origin)}] `);
        if (message instanceof Error)
            console.error(message);
        else if (typeof message === "object")
            console.dir(message);
        else
            console.log(message);
    }
}
exports.Logger = Logger;
_timeMap = new WeakMap();
//# sourceMappingURL=logger.js.map