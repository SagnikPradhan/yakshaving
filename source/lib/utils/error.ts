import { Logger } from './logger';

/**
 * Error emitted by library
 */
export class LibraryError extends Error {
  public isOperational: boolean;
  public description: string;
  public context: Record<string, unknown>;

  /**
   * Create a new library error
   * @param name - Name
   * @param options - Options
   * @param options.isOperational - Is app operational
   * @param options.description - Description of the error
   */
  constructor(
    name: string,
    {
      isOperational,
      description,
      ...context
    }: { isOperational: boolean; description: string; [index: string]: unknown }
  ) {
    super(name);

    Object.assign(this, new.target.prototype);

    this.isOperational = isOperational;
    this.description = description;
    this.context = context;

    Error.captureStackTrace(this);
  }
}

/**
 * Handle errors. Exits if error is unknown or non operational
 * @param error - Error
 * @param logger - Optional logger instance
 */
export function handleError(error: Error, logger: Logger | Console = console): void {
  if (logger instanceof Logger) logger.log(error)
  else console.error(error)

  if (error instanceof LibraryError && error.isOperational) return;
  else process.exit(1);
}
