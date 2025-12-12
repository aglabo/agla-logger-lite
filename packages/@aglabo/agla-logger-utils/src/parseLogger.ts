// src: packages/@aglabo/agla-logger-utils/src/parseLogger.ts
// @(#) Logger argument parser and validation utilities
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTLogMessage } from '#shared/types/AGTLoggerMessage.types.ts';
import { _isStringifiable } from './logValueValidator.ts';

/**
 * Parse logger arguments into structured log message.
 *
 * Extracts timestamp, stringifiable values for message, and non-stringifiable objects
 * from raw logging arguments. Follows these rules:
 * - Uses defaultTimestamp parameter (or current time if null)
 * - Stringifiable values (primitives + null, undefined, NaN, Infinity) are stored in messages array
 * - Non-stringifiable values (objects, arrays, functions, dates, etc.) are stored in objects array
 *
 * The returned AGTLogMessage is frozen at runtime to prevent accidental mutations
 * throughout the logging pipeline.
 *
 * @param label - Log level label string (e.g., "INFO", "ERROR")
 * @param messages - Array of raw arguments to parse
 * @param defaultTimestamp - Default timestamp when not provided in messages (null = current time)
 * @returns Frozen AGTLogMessage object (immutable at runtime)
 */
export const parseLogger = (
  label: string,
  messages: unknown[],
  defaultTimestamp: Date | null = null,
): AGTLogMessage => {
  // Use defaultTimestamp or current time
  const timestamp = defaultTimestamp ?? new Date();

  // Filter and categorize arguments
  const primitives: string[] = [];
  const objects: unknown[] = [];

  for (const arg of messages) {
    if (_isStringifiable(arg)) {
      primitives.push(String(arg));
    } else {
      objects.push(arg);
    }
  }

  // Create the log message object
  const logMessage: AGTLogMessage = {
    logLabel: label,
    timestamp,
    messages: Object.freeze(primitives),
    values: Object.freeze(objects),
  };

  // Freeze the entire object and its properties to ensure complete immutability
  return Object.freeze(logMessage);
};
