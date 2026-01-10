import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../../../base/configs/vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@aglabo/agla-shared:unit',
      include: [
        'src/**/__tests__/unit/**/*.spec.ts',
        'src/**/__tests__/unit/**/*.test.ts',
      ],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__tests__/runtime/**',
      ],
    },
  }),
);
