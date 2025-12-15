// src: packages/@aglabo/agla-logger-utils/src/index.ts
// @(#) Main entry point for logger utility functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createLogMessage } from './createLogMessage.ts';
import { formatMessages, formatValues } from './logMessageComposer.ts';
import { _isStringifiable, _isStringifiableType, _isStringifiableValue, _isTimestamp } from './logValueValidator.ts';
import { parseLogger } from './parseLogger.ts';

// Direct exports for backward compatibility
export { createLogMessage } from './createLogMessage.ts';
export { formatMessages, formatValues } from './logMessageComposer.ts';
export { _isStringifiable, _isStringifiableType, _isStringifiableValue, _isTimestamp } from './logValueValidator.ts';
export { parseLogger } from './parseLogger.ts';

// AgLoggerUtils namespace - public API with utility methods
export const AgLoggerUtils = {
  // Logger functions
  formatMessages,
  createLogMessage,
  formatValues,
  parseLogger,
  // Validator functions (public API without underscore prefix)
  isStringifiable: _isStringifiable,
  isStringifiableType: _isStringifiableType,
  isStringifiableValue: _isStringifiableValue,
  isTimestamp: _isTimestamp,
} as const;
