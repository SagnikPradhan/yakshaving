export class YakshavingError extends Error {
  public readonly isOperational: boolean;
  public readonly cause?: Error;
  public readonly additionalProps: { [additionalProps: string]: unknown };

  constructor({
    message,
    isOperational,
    cause,
    ...additionalProps
  }: {
    message: string;
    isOperational: boolean;
    cause?: Error;
    [additionalProps: string]: unknown;
  }) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = "YakshavingError";
    this.isOperational = isOperational;
    this.cause = cause;
    this.additionalProps = additionalProps;

    if (Error.captureStackTrace) Error.captureStackTrace(this);
  }
}

export function handleError() {
  return (error: Error) => {
    console.error(error);

    if (error instanceof YakshavingError && error.isOperational) return;
    else process.exit(1);
  };
}
