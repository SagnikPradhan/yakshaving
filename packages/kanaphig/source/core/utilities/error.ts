import { RecursiveObject } from "../types/basic"
import { SundorError } from "sundorerr"

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
