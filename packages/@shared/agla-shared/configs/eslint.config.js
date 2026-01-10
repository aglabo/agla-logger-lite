import baseConfig from "../../../base/configs/eslint.config.base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/module/**",
      "**/dist/**",
      "**/.cache/**",
      "**/coverage/**",
      "**/__tests__/runtime/deno/**",
      "**/__tests__/runtime/bun/**",
    ],
  },
];
