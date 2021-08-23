export class KanaphigError extends Error {
	public readonly cause?: Error
	public readonly additionalProps: { [additionalProps: string]: unknown }

	constructor({
		message,
		cause,
		...additionalProps
	}: {
		message: string
		cause?: Error
		[additionalProps: string]: unknown
	}) {
		super(message)

		Object.setPrototypeOf(this, new.target.prototype)

		this.name = "KanaphigError"
		this.cause = cause
		this.additionalProps = additionalProps

		if (Error.captureStackTrace) Error.captureStackTrace(this)
	}
}
