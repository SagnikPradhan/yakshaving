import { plugin } from "../../core/plugin";

export function env({ prefix }: { prefix: string }) {
  return plugin({
    name: "env",

    helpers: {
      value: (env: string) => {
        const variable = env
          ? prefix
            ? process.env[`${prefix}__${env}`]
            : process.env[env]
          : undefined;

        return (): string | undefined => variable;
      },
    },

    source: Object.fromEntries(
      Object.entries(process.env)
        .filter(([key]) => (prefix ? key.startsWith(prefix) : true))
        .map(([key, value]) => [toCamelCase(toParts(key)), value])
    ),
  });
}

function toParts(string: string) {
  return string.split("__").join(".");
}

function toCamelCase(string: string) {
  return string
    .split("_")
    .map(
      ([start = "", ...rest], index) =>
        (index !== 0 ? start.toUpperCase() : start.toLowerCase()) +
        rest.join("").toLowerCase()
    )
    .join("");
}
