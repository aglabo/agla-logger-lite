// src: packages/@aglabo/agla-logger-composer/src/createLogMessage.ts
// @(#) Create formatted log message string
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTLogMessage } from '#shared/types/AGTLoggerMessage.types';
import { _formatMessages, _formatValues } from './logMessageComposer';
import { _stringifyTimestamp } from './stringify';

/**
 * Creates a formatted log message string from a structured log message.
 *
 * Combines timestamp, log label, message text, and formatted objects into
 * a single output string. The format is:
 * `<timestamp> <label> <message> <formatted-objects>`
 *
 * @param logMessage - The structured log message to format
 * @param dispMs - Whether to display milliseconds in timestamp (default: false)
 * @returns The formatted log message string
 *
 * @example
 * ```typescript
 * const logMessage: AGTLogMessage = {
 *   logLabel: 'INFO',
 *   timestamp: new Date('2025-01-15T10:30:45.123Z'),
 *   message: 'User logged in',
 *   values: [{ userId: 123 }],
 * };
 *
 * createLogMessage(logMessage)
 * // Returns: '2025-01-15T10:30:45Z INFO User logged in {"userId": 123}'
 *
 * createLogMessage(logMessage, true)
 * // Returns: '2025-01-15T10:30:45.123Z INFO User logged in {"userId": 123}'
 * ```
 */
export const createLogMessage = (
  logMessage: AGTLogMessage,
  dispMs?: boolean,
): string => {
  // Format timestamp with or without milliseconds
  const timestampPart = _stringifyTimestamp(logMessage.timestamp, dispMs ?? false);

  // Get label and message parts (convert label to uppercase for consistent output)
  const labelPart = logMessage.logLabel.toUpperCase();
  const messagePart = _formatMessages(logMessage.messages);

  // Format objects if present
  const objectsPart = logMessage.values.length <= 0
    ? ''
    : _formatValues(logMessage.values);

  // Combine all parts, filtering out empty strings
  const parts = [timestampPart, labelPart, messagePart, objectsPart]
    .filter((part) => part.length > 0);

  return parts.join(' ');
};
