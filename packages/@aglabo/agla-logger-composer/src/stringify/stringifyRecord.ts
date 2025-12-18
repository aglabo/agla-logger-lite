// src: packages/@aglabo/agla-logger-composer/src/stringify/stringifyRecord.ts
// @(#) Record/object stringification utility
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { _stringify } from './stringify.ts';

/**
 * Formats a record/object to a standardized string representation.
 *
 * Handles recursion and circular reference detection:
 * - Converts each property to string using the main objectToString logic
 * - Detects circular references and shows "[Circular]" for detected cycles
 * - Supports arbitrary nesting depth
 * - Displays as key-value pairs: {key: value, key2: value2}
 *
 * @internal
 * @param record - The record/object to format
 * @param seen - WeakSet tracking visited objects for circular reference detection
 * @returns The formatted object string
 * @example
 * ```typescript
 * _stringifyRecord({}, new WeakSet()) // Returns: '{}'
 * _stringifyRecord({a: 1}, new WeakSet()) // Returns: '{a: 1}'
 * _stringifyRecord({a: 1, b: 2}, new WeakSet()) // Returns: '{a: 1, b: 2}'
 *
 * // Circular reference detection
 * const obj = {a: 1};
 * obj.self = obj;
 * _stringifyRecord(obj, new WeakSet()) // Returns: '{a: 1, self: [Circular]}'
 * ```
 */
export const _stringifyRecord = (record: Readonly<Record<string, unknown>>, seen: WeakSet<object>): string => {
  // Get object keys
  const keys = Object.keys(record);

  // Handle empty object
  if (keys.length === 0) {
    return '{}';
  }

  // Check for circular reference
  if (seen.has(record)) {
    return '{<Circular>}'; // 循環参照なので<>をつけて特殊値であることを示す
  }

  // Mark this object as visited
  seen.add(record);

  // Format each property as "key": value (JSON-compatible format)
  const pairs = keys.map((key) => {
    const value = record[key];
    const valueStr = _stringify(value, seen);
    return `"${key}": ${valueStr}`;
  });

  // Remove from seen set after processing (cleanup)
  seen.delete(record);

  return `{${pairs.join(', ')}}`;
};
