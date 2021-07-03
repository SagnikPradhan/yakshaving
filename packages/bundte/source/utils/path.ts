import path from "path";

export function root(...paths: string[]) {
  return path.join(process.cwd(), ...paths);
}
