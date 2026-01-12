// src: ./configs/tsup.config.ts
// @(#) : tsup build configuration for @aglabo/agla-shared
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../base/configs/vitest.config.base';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: [
        'base/src/**/__tests__/unit/**/*.spec.ts',
      ],
      exclude: [],
    },
  }),
);
