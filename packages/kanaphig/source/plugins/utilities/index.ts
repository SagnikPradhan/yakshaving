import { plugin } from "../../core/plugin";
import { chain } from "./chain";

/** adds common utilities */
export function utilities() {
  return plugin({
    name: "utilities",
    helpers: { chain },
  });
}
