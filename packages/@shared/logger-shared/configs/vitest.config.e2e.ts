import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../../base/configs/vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@aglabo/agla-shared:e2e',
      include: ['src/**/__tests__/e2e/**/*.spec.ts'],
    },
  }),
);
