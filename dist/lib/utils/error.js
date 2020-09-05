"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.LibraryError = void 0;
const logger_1 = require("./logger");
/**
 * Error emitted by library
 */
class LibraryError extends Error {
    /**
     * Create a new library error
     * @param name - Name
     * @param options - Options
     * @param options.isOperational - Is app operational
     * @param options.description - Description of the error
     */
    constructor(name, { isOperational, description, ...context }) {
        super(name);
        Object.assign(this, new.target.prototype);
        this.isOperational = isOperational;
        this.description = description;
        this.context = context;
        Error.captureStackTrace(this);
    }
}
exports.LibraryError = LibraryError;
/**
 * Handle errors. Exits if error is unknown or non operational
 * @param error - Error
 * @param logger - Optional logger instance
 */
function handleError(error, logger = console) {
    if (logger instanceof logger_1.Logger)
        logger.log(error);
    else
        console.error(error);
    if (error instanceof LibraryError && error.isOperational)
        return;
    else
        process.exit(1);
}
exports.handleError = handleError;
//# sourceMappingURL=error.js.map