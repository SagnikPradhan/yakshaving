export interface RecursiveObject<Value> {
	[key: string]: Value | RecursiveObject<Value>
}

export type Fn<Input = any, Output = any> = (input: Input) => Output
