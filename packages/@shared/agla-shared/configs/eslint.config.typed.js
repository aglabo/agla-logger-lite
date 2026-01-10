// src: shared/common/configs/eslint.config.typed.js
// @(#) : ESLint type check configuration for @aglabo/agla-logger-utils
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// setup base Directory
const __configDir = dirname(fileURLToPath(import.meta.url));
const __rootDir = path.resolve(__configDir, '..'); // packages/@aglabo/ag-logger

import typedConfig from '../../../../base/configs/eslint.config.typed.base.js';

export default [
  ...typedConfig,
  {
    files: [
      'src/**/*.ts',
      'shared/**/*.ts',
      'tests/**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __rootDir,
      },
    },
  },
  {
    ignores: [
      '**/__tests__/runtime/deno/**',
      '**/__tests__/runtime/bun/**',
    ],
  },
];
