import errors from "./errors.json"

type Errors = typeof errors;
type ErrorDescriptors = keyof Errors;

export class YakshavingError<
  Descriptor extends ErrorDescriptors = ErrorDescriptors
> extends Error {
  static errors = errors;

  public readonly type: string;
  public readonly description: string;
  public readonly isOperational: boolean;
  public readonly properties: Record<string, unknown>;

  constructor (
    descriptor: Descriptor,
    properties: Record<string, unknown> = {}
  ) {
    const { name, description, isOperational } = errors[descriptor]

    super( `${name}:${description}` )

    this.name = "YakshavingError"
    this.type = name
    this.description = description
    this.isOperational = isOperational
    this.properties = properties

    Object.setPrototypeOf( this, new.target.prototype )
    if ( Error.captureStackTrace ) Error.captureStackTrace( this )
  }
}

export function throwError (
  descriptor: ErrorDescriptors,
  properties?: Record<string, unknown>
): never {
  throw new YakshavingError( descriptor, properties )
}

export function handleError () {
  return ( error: Error ) => {
    console.error( error )

    if ( error instanceof YakshavingError && error.isOperational ) return
    else process.exit( 1 )
  }
}
