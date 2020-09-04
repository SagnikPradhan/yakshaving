/**
 * Logger for the Library
 * @param origin - Point of origin
 */
export declare class Logger {
    #private;
    readonly origin: string;
    constructor(origin: string);
    log(message: unknown, tag?: string): void;
}
