// src: packages/@aglabo/agla-logger-composer/src/index.ts
// @(#) Main entry point for log message composer library
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createLogMessage } from './createLogMessage.ts';
import { _isStringifiable, _isStringifiableType, _isStringifiableValue, _isTimestamp } from './validators/logValueValidator.ts';
import { parseLogger } from './parseLogger.ts';
export { AG_LOGMESSAGE_TOKENS } from '../shared/constants/logMessageTokens.constants.ts';
export { AGTFormatterContext } from '../shared/types/AGTFormatterContext.class.ts';
export type { AGTFormatterContextOptions, AGTStringifiableType } from '../shared/types/AGTstringifiableType.types.ts';

// Direct exports for backward compatibility
export { createLogMessage } from './createLogMessage.ts';
export { _isStringifiable, _isStringifiableType, _isStringifiableValue, _isTimestamp } from './validators/logValueValidator.ts';
export { parseLogger } from './parseLogger.ts';

// Stringify utilities (newly refactored module)
export {
  _ensureContext,
  _escapeString,
  _stringifiableType,
  _stringifyArray,
  _stringifyFunction,
  _stringifyRecord,
  _stringifyTimestamp,
  _stringify,
  stringifyObject,
} from './stringify/index.ts';

// AgLogComposer namespace - public API with utility methods
export const AgLogComposer = {
  // Logger functions
  createLogMessage,
  parseLogger,
  // Validator functions (public API without underscore prefix)
  isStringifiable: _isStringifiable,
  isStringifiableType: _isStringifiableType,
  isStringifiableValue: _isStringifiableValue,
  isTimestamp: _isTimestamp,
} as const;
