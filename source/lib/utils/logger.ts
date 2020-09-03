import c from "colorette";

/**
 * Logger for the Library
 * @param origin - Point of origin
 */
export class Logger {
  #timeMap = new Map<string, number>();

  constructor(public readonly origin: string) {}

  public log(message: unknown, tag?: string) {
    if (tag) {
      const time = this.#timeMap.get(tag);

      if (time === undefined) {
        this.#timeMap.set(tag, Date.now());
        process.stdout.write(`[${c.gray(this.origin)}] `);
      } else {
        this.#timeMap.delete(tag);
        const pastTime = Date.now() - time;
        process.stdout.write(
          `[${c.gray(this.origin)}] ${c.green(pastTime + "ms")} `
        );
      }
    } else process.stdout.write(`[${c.gray(this.origin)}] `);

    if (typeof message === "string") console.log(message);
    if (message instanceof Error) console.error(message);
    if (typeof message === "object") console.dir(message);
  }
}
