// src: packages/@aglabo/agla-logger-composer/src/logMessageComposer.ts
// @(#) Log message part composition utilities
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { _stringify } from './stringify';

/**
 * Formats an array of strings into a message part string.
 *
 * Joins string values with spaces. This function receives pre-processed strings
 * from parseLogger() after filtering and conversion.
 *
 * @param messages - Array of strings to join into a message part
 * @returns The space-separated message part string, or empty string if array is empty
 * @example
 * ```typescript
 * _formatMessages(['Hello', 'World']) // Returns: 'Hello World'
 * _formatMessages(['Error', '404', 'Not found']) // Returns: 'Error 404 Not found'
 * _formatMessages([]) // Returns: ''
 * ```
 */
export const _formatMessages = (messages: readonly string[]): string => {
  return messages.join(' ');
};

/**
 * Formats an array of values into a JSON-compatible object part string.
 *
 * Formats values using the unified log value formatting system (_stringify),
 * ensuring consistency with other logging utilities.
 *
 * @param values - Array of values to format into an object part
 * @returns The JSON-compatible object part string, or empty string if array is empty
 * @example
 * ```typescript
 * _formatValues([{ a: 1 }]) // Returns: '{"a": 1}'
 * _formatValues([{ a: 1 }, { b: 2 }]) // Returns: '{{"a": 1}, {"b": 2}}'
 * _formatValues([null]) // Returns: 'null'
 * _formatValues([]) // Returns: ''
 * ```
 */
export const _formatValues = (values: readonly unknown[]): string => {
  const seen = new WeakSet<object>();

  // Handle empty array
  if (values.length === 0) {
    return '';
  }

  // Single value - stringify directly
  if (values.length === 1) {
    return _stringify(values[0], seen);
  }

  // Multiple values - wrap in braces with comma separation
  const stringifiedValues = values.map((value) => _stringify(value, seen));

  return `{${stringifiedValues.join(', ')}}`;
};
