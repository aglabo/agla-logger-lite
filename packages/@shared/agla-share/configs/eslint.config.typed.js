import typedConfig from '../../../base/configs/eslint.config.typed.base.js';

export default [
  ...typedConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/module/**',
      '**/dist/**',
      '**/.cache/**',
      '**/coverage/**',
      '**/__tests__/runtime/deno/**',
      '**/__tests__/runtime/bun/**',
    ],
  },
];
