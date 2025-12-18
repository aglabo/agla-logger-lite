// src: packages/@aglabo/agla-logger-utils/src/stringify/stringifyArray.ts
// @(#) Array stringification utility
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { _stringifyValue } from './stringifyValue.ts';

/**
 * Formats an array to a standardized string representation.
 *
 * Handles recursion and circular reference detection:
 * - Converts each element to string using the main objectToString logic
 * - Detects circular references and shows "[Circular]" for detected cycles
 * - Supports arbitrary nesting depth
 *
 * @internal
 * @param arr - The array to format
 * @param seen - WeakSet tracking visited objects for circular reference detection
 * @returns The formatted array string
 * @example
 * ```typescript
 * _stringifyArray([], new WeakSet()) // Returns: '[]'
 * _stringifyArray([1, 2, 3], new WeakSet()) // Returns: '[1, 2, 3]'
 * _stringifyArray([1, [2, 3]], new WeakSet()) // Returns: '[1, [2, 3]]'
 *
 * // Circular reference detection
 * const arr = [1, 2];
 * arr.push(arr);
 * _stringifyArray(arr, new WeakSet()) // Returns: '[1, 2, [Circular]]'
 * ```
 */
export const _stringifyArray = (arr: readonly unknown[], seen: WeakSet<object>): string => {
  // Handle empty array
  if (arr.length === 0) {
    return '[]';
  }

  // Check for circular reference
  if (seen.has(arr)) {
    return '[<Circular>]'; // 循環参照なので<>をつけて特殊値であることを示す
  }

  // Mark this array as visited
  seen.add(arr);

  // Format each element
  const elements = arr.map((element) => _stringifyValue(element, seen));

  // Remove from seen set after processing (cleanup)
  seen.delete(arr);

  return `[${elements.join(', ')}]`;
};
