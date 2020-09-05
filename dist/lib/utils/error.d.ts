/// <reference types="node" />
import { Logger } from "./logger";
/**
 * Error emitted by library
 */
export declare class LibraryError extends Error {
    isOperational: boolean;
    description: string;
    context: Record<string, unknown>;
    /**
     * Create a new library error
     * @param name - Name
     * @param options - Options
     * @param options.isOperational - Is app operational
     * @param options.description - Description of the error
     */
    constructor(name: string, { isOperational, description, ...context }: {
        isOperational: boolean;
        description: string;
        [index: string]: unknown;
    });
}
/**
 * Handle errors. Exits if error is unknown or non operational
 * @param error - Error
 * @param logger - Optional logger instance
 */
export declare function handleError(error: Error, logger?: Logger | Console): void;
