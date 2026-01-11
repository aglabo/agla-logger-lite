// src: ./configs/eslint.config.js
// @(#) : ESLint configuration for @aglabo/logger-utils (shared utilities repository)
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __configDir = dirname(fileURLToPath(import.meta.url));
const __rootDir = path.resolve(__configDir, '..'); // packages/@aglabo/agla-logger-utils

// plugins
// import tseslint from 'typescript-eslint';

// import form common base config
import baseConfig from '../../../../base/configs/eslint.config.base.js';

// settings
export default [
  ...baseConfig,

  // source code settings
  {
    files: [
      'src/**/*.ts',
      'shared/**/*.ts',
      'tests/**/*.ts',
    ],
    ignores: [
      // Runtime-specific test files use environment-specific globals
      'tests/runtime/deno/**/*.ts',
      'tests/runtime/bun/**/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __rootDir,
      },
      globals: {
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: path.resolve(__rootDir, 'tsconfig.json'),
          alwaysTryTypes: true,
        },
      },
    },
  },
];
