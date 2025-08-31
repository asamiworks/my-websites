module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*",
    ".eslintrc.js",  // 追加: .eslintrc.js自体を無視
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "max-len": ["error", {"code": 120}],  // 追加: 行の長さを120文字に
    "require-jsdoc": "off",  // 追加: JSDocコメントを無効化
    "@typescript-eslint/no-explicit-any": "warn",  // 追加: anyを警告のみに
    "@typescript-eslint/no-unused-vars": ["error", {"argsIgnorePattern": "^_"}],  // 追加: _で始まる変数は無視
  },
};
