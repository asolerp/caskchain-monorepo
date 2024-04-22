module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended"],
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  rules: {
    quotes: ["error", "double"],
    "import/no-unresolved": 0,
  },
};
