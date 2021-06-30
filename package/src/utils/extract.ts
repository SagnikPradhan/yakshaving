import path from "path";
import fs from "fs";

import { YakshavingError } from "./error";

export async function extractUserInformation() {
  const root = (...paths: string[]) => path.join(process.cwd(), ...paths);
}

function getUserManifest(manifestPath: string) {
  const manifestExists = fs.existsSync(manifestPath);

  if (!manifestExists)
    throw new YakshavingError({ message: "", isOperational: false });
}
