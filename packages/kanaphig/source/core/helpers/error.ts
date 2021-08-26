import { RecursiveObject } from "../types/basic"
import { SundorError } from "@yakshaving/sundorerr"

export interface Details extends RecursiveObject {
	message: string
	isOperational: boolean
	cause?: Error
}

export class KanaphigError extends SundorError {
	public override readonly name: string
	public readonly details: Details

	constructor(name: `Kanaphig${string}Error`, details: Details) {
		super(details.message)

		Object.setPrototypeOf(this, new.target.prototype)

		this.name = name
		this.details = details
	}
}

export function handleError(error: Error, exit = true) {
	if (!exit) throw error
	if (error instanceof KanaphigError && error.details.isOperational) throw error

	console.error(error)
	process.exit(1)
}
