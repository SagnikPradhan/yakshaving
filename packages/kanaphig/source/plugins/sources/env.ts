export function handleEnvironmentVariables(prefix?: string) {
  const variables = Object.entries(process.env).filter(([key]) =>
    prefix ? key.startsWith(prefix) : true
  );

  const raw = Object.fromEntries(variables);

  const parsed = Object.fromEntries(
    variables.map(([key, value]) => [toCamelCase(toParts(key)), value])
  );

  return { parsed, raw };
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
