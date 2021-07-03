module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },

  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],

  parser: "@typescript-eslint/parser",

  parserOptions: {
    ecmaVersion: 12,
    project: [
      "./tsconfig.json", 
      "./packges/*/tsconfig.json",
      "./website/tsconfig.json"
    ],
  },

  plugins: ["@typescript-eslint"],

  rules: {
    "capitalized-comments": ["error", "never"],
    "comma-dangle": [
      "error",
      {
        arrays: "always-multiline",
        objects: "always-multiline",
      },
    ],
    indent: ["error", 2],
    "line-comment-position": ["error", { position: "above" }],
    "lines-around-comment": [
      "error",
      { beforeBlockComment: true },
    ],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", { code: 80 }],
    "max-lines-per-function": ["error", 40],
    "max-nested-callbacks": ["error", 3],
    "max-params": ["error", 3],
    "new-cap": "error",
    "new-parens": "error",
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 2 }],
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "no-nested-ternary": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "no-unneeded-ternary": "error",
    "object-curly-spacing": ["error", "always"],
    "one-var": ["error", "never"],
    quotes: ["error", "double"],
    semi: ["error", "never"],
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", "always"],
    "space-in-parens": ["error", "always"],
    "spaced-comment": ["error", "always"],

    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-explicit-any": "off"
  },
};
