// src: packages/@aglabo/agla-logger-utils/src/stringify/stringifyValue.ts
// @(#) Value to string conversion utility for recursive stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { _isStringifiable } from '../logValueValidator.ts';
import { _escapeString } from './escapeString.ts';
import { _stringifyFunction } from './formatters.ts';
import { _stringifyArray } from './stringifyArray.ts';
import { _stringifyRecord } from './stringifyRecord.ts';

/**
 * Converts a value to its string representation for use within arrays/objects.
 * This is a helper function for recursive formatting.
 *
 * @internal
 * @param value - The value to convert
 * @param seen - WeakSet tracking visited objects
 * @returns The string representation of the value
 */
export const _stringifyValue = (value: unknown, seen: WeakSet<object>): string => {
  // Handle string-convertible primitives and special values
  if (_isStringifiable(value)) {
    // Handle string - needs escaping
    if (typeof value === 'string') {
      return _escapeString(value);
    }

    // Handle number - check for special cases
    if (typeof value === 'number') {
      if (Number.isNaN(value)) {
        return 'NaN';
      }
      if (!Number.isFinite(value)) {
        return value > 0 ? 'Infinity' : '-Infinity';
      }
    }

    // For boolean, symbol, null, undefined, and regular numbers
    return String(value);
  }

  // Get the type of the value for complex types
  const type = typeof value;

  // Handle functions
  if (type === 'function') {
    return `[${_stringifyFunction(value as Function)}]`;
  }

  // Handle arrays and objects
  if (type === 'object') {
    // Check if it's an array
    if (Array.isArray(value)) {
      return _stringifyArray(value as unknown[], seen);
    }

    // For other objects
    return _stringifyRecord(value as Record<string, unknown>, seen);
  }

  // Fallback for bigint
  return String(value);
};
