import baseConfig from '../../../base/configs/eslint.config.base.js';

export default [
  ...baseConfig,
  {
    files: ['**/__tests__/runtime/bun/**/*.ts'],
    languageOptions: {
      globals: {
        Bun: 'readonly',
      },
    },
  },
];
