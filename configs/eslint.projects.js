// src: ./configs/eslint.projects.js
// @(#) : ESLint project path configuration list
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default [
  // shared types/constants
  './packages/@shared/logger-shared/tsconfig.json',
  // core modules
  './packages/@aglabo/agla-logger-core/tsconfig.json',
  './packages/@aglabo/agla-logger-utils/tsconfig.json',
  // deprecated
  './packages/@aglabo/agla-logger-composer/tsconfig.json', // deprecated
  // root
];
