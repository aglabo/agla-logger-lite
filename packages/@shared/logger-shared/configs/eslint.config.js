// src: shared/common/configs/eslint.config.js
// @(#) : ESLint configuration for @aglabo/agla-logger-utils
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

import baseConfig from '../../../../base/configs/eslint.config.base.js';

export default [
  ...baseConfig,
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
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    ignores: [
      'tests/runtime/deno/**',
      'tests/runtime/bun/**',
    ],
  },
];
