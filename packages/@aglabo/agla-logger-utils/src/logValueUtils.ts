// src: packages/@aglabo/agla-logger-utils/src/logValueUtils.ts
// @(#) Log value utilities - String conversion utilities for logging
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { _isStringifiable } from './logValueValidator.ts';

/**
 * Escapes special characters in a string and wraps it with double quotes.
 *
 * Handles the following escape sequences:
 * - Backslash (\) → \\
 * - Double quote (") → \"
 * - Newline (\n) → \n
 * - Carriage return (\r) → \r
 * - Tab (\t) → \t
 *
 * @internal
 * @param str - The string to escape
 * @returns The escaped string wrapped in double quotes
 * @example
 * ```typescript
 * _escapeString('hello') // Returns: '"hello"'
 * _escapeString('say "hi"') // Returns: '"say \"hi\""'
 * _escapeString('line1\nline2') // Returns: '"line1\nline2"'
 * ```
 */
export const _escapeString = (str: string): string => {
  // Escape special characters in the correct order
  // Note: Backslash must be escaped first to avoid double-escaping
  const escaped = str
    .replace(/\\/g, '\\\\') // Backslash (must be first)
    .replace(/"/g, '\\"') // Double quote
    .replace(/\n/g, '\\n') // Newline
    .replace(/\r/g, '\\r') // Carriage return
    .replace(/\t/g, '\\t'); // Tab

  return `"${escaped}"`;
};

/**
 * Formats a function to a standardized string representation.
 *
 * Returns different formats based on the function type:
 * - Named function/method: `Function: name` or `Method: name`
 * - Anonymous function: `Function:`
 *
 * @internal
 * @param func - The function to format
 * @returns The formatted function string
 * @example
 * ```typescript
 * function myFunc() {}
 * _formatFunction(myFunc) // Returns: 'Function: myFunc'
 *
 * const obj = { myMethod() {} };
 * _formatFunction(obj.myMethod) // Returns: 'Method: myMethod'
 *
 * const arrow = () => {};
 * _formatFunction(arrow) // Returns: 'Function:'
 * ```
 */
export const _formatFunction = (func: Function): string => {
  const str = func.toString().trim();

  // Check for arrow function
  if (/=>/.test(str)) {
    return 'Function:';
  }

  // If it starts with "function", check if it has an explicit name
  if (str.startsWith('function')) {
    // Match: "function name(" where name is not empty/missing
    const match = /^function\s+([a-zA-Z_]\w*)\s*\(/.exec(str);
    if (match) {
      return `Function: ${match[1]}`;
    }
    // Otherwise it's "function()" - anonymous
    return 'Function:';
  }

  // Must be a method shorthand: "name() {"
  const methodMatch = /^([a-zA-Z_]\w*)\s*\(\)\s*\{/.exec(str);
  if (methodMatch) {
    return `Method: ${methodMatch[1]}`;
  }

  // Fallback
  return 'Function:';
};

/**
 * Converts a value to its string representation for use within arrays/objects.
 * This is a helper function for recursive formatting.
 *
 * @internal
 * @param value - The value to convert
 * @param seen - WeakSet tracking visited objects
 * @returns The string representation of the value
 */
export const _valueToString = (value: unknown, seen: WeakSet<object>): string => {
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
    return `[${_formatFunction(value as Function)}]`;
  }

  // Handle arrays and objects
  if (type === 'object') {
    // Check if it's an array
    if (Array.isArray(value)) {
      return _formatArray(value as unknown[], seen);
    }

    // For other objects
    return _formatObject(value as Record<string, unknown>, seen);
  }

  // Fallback for bigint
  return String(value);
};

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
 * _formatArray([], new WeakSet()) // Returns: '[]'
 * _formatArray([1, 2, 3], new WeakSet()) // Returns: '[1, 2, 3]'
 * _formatArray([1, [2, 3]], new WeakSet()) // Returns: '[1, [2, 3]]'
 *
 * // Circular reference detection
 * const arr = [1, 2];
 * arr.push(arr);
 * _formatArray(arr, new WeakSet()) // Returns: '[1, 2, [Circular]]'
 * ```
 */
export const _formatArray = (arr: readonly unknown[], seen: WeakSet<object>): string => {
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
  const elements = arr.map((element) => _valueToString(element, seen));

  // Remove from seen set after processing (cleanup)
  seen.delete(arr);

  return `[${elements.join(', ')}]`;
};

/**
 * Formats an object to a standardized string representation.
 *
 * Handles recursion and circular reference detection:
 * - Converts each property to string using the main objectToString logic
 * - Detects circular references and shows "[Circular]" for detected cycles
 * - Supports arbitrary nesting depth
 * - Displays as key-value pairs: {key: value, key2: value2}
 *
 * @internal
 * @param obj - The object to format
 * @param seen - WeakSet tracking visited objects for circular reference detection
 * @returns The formatted object string
 * @example
 * ```typescript
 * _formatObject({}, new WeakSet()) // Returns: '{}'
 * _formatObject({a: 1}, new WeakSet()) // Returns: '{a: 1}'
 * _formatObject({a: 1, b: 2}, new WeakSet()) // Returns: '{a: 1, b: 2}'
 *
 * // Circular reference detection
 * const obj = {a: 1};
 * obj.self = obj;
 * _formatObject(obj, new WeakSet()) // Returns: '{a: 1, self: [Circular]}'
 * ```
 */
export const _formatObject = (obj: Readonly<Record<string, unknown>>, seen: WeakSet<object>): string => {
  // Get object keys
  const keys = Object.keys(obj);

  // Handle empty object
  if (keys.length === 0) {
    return '{}';
  }

  // Check for circular reference
  if (seen.has(obj)) {
    return '{<Circular>}'; // 循環参照なので<>をつけて特殊値であることを示す
  }

  // Mark this object as visited
  seen.add(obj);

  // Format each property as "key": value (JSON-compatible format)
  const pairs = keys.map((key) => {
    const value = obj[key];
    const valueStr = _valueToString(value, seen);
    return `"${key}": ${valueStr}`;
  });

  // Remove from seen set after processing (cleanup)
  seen.delete(obj);

  return `{${pairs.join(', ')}}`;
};

/**
 * Formats a Date object to an ISO 8601 string representation.
 *
 * Converts Date object to ISO 8601 format with optional millisecond precision:
 * - When dispMs is true: Returns ISO 8601 with milliseconds (e.g., "1970-01-01T00:00:01.000Z")
 * - When dispMs is false: Returns ISO 8601 with seconds only, no fractional part (e.g., "1970-01-01T00:00:01Z")
 *
 * @internal
 * @param date - The Date object to format
 * @param dispMs - If true, return ISO 8601 with milliseconds; if false, return with seconds precision only
 * @returns The formatted ISO 8601 string with Z suffix for UTC
 * @example
 * ```typescript
 * _formatTimestamp(new Date(1000), true) // Returns: '1970-01-01T00:00:01.000Z'
 * _formatTimestamp(new Date(1000), false) // Returns: '1970-01-01T00:00:01Z'
 * _formatTimestamp(new Date(1609459200123), false) // Returns: '2021-01-01T00:00:00Z'
 * ```
 */
export const _formatTimestamp = (date: Date, dispMs: boolean = false): string => {
  const isoString = date.toISOString();

  if (dispMs) {
    // For milliseconds display, return ISO string as-is
    return isoString;
  }

  // For seconds display, remove the milliseconds part (.000Z -> Z)
  return isoString.replace(/\.\d{3}Z$/, 'Z');
};
