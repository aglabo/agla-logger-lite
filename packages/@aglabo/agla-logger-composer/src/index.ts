// src: packages/@aglabo/agla-logger-composer/src/index.ts
// @(#) Main entry point for log message composer library
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createLogMessage } from './createLogMessage.ts';
import { parseLogger } from './parseLogger.ts';
import {
  _isStringifiable,
  _isStringifiableType,
  _isStringifiableValue,
  _isTimestamp,
} from './validators/logValueValidator.ts';
export { AG_LOGMESSAGE_TOKENS } from '#shared/constants/logMessageTokens.constants.ts';
export type { AGTFormatContext } from '#shared/types/AGTFormatContext.types.ts';
export { agFormat } from '#shared/types/AGTFormatContext.types.ts';
export type { AGTFormatEnvironment } from '#shared/types/AGTFormatEnvironment.class.ts';

// Direct exports for backward compatibility
export { createLogMessage } from './createLogMessage.ts';
export { parseLogger } from './parseLogger.ts';
export {
  _isStringifiable,
  _isStringifiableType,
  _isStringifiableValue,
  _isTimestamp,
} from './validators/logValueValidator.ts';

// Stringify utilities (newly refactored module)
export {
  _escapeString,
  _stringifiableType,
  _stringify,
  _stringifyArray,
  _stringifyFunction,
  _stringifyObject,
  _stringifyRecord,
  _stringifyTimestamp,
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
