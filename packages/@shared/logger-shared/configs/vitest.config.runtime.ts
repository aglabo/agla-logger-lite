import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../../../base/configs/vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: '@aglabo/agla-shared:runtime',
      include: ['tests/runtime/node/**/*.spec.ts'],
    },
  }),
);
