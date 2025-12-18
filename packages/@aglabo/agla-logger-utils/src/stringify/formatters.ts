// src: packages/@aglabo/agla-logger-utils/src/stringify/formatters.ts
// @(#) Stringification formatters for functions and timestamps
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

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
 * _stringifyFunction(myFunc) // Returns: 'Function: myFunc'
 *
 * const obj = { myMethod() {} };
 * _stringifyFunction(obj.myMethod) // Returns: 'Method: myMethod'
 *
 * const arrow = () => {};
 * _stringifyFunction(arrow) // Returns: 'Function:'
 * ```
 */
export const _stringifyFunction = (func: Function): string => {
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
 * _stringifyTimestamp(new Date(1000), true) // Returns: '1970-01-01T00:00:01.000Z'
 * _stringifyTimestamp(new Date(1000), false) // Returns: '1970-01-01T00:00:01Z'
 * _stringifyTimestamp(new Date(1609459200123), false) // Returns: '2021-01-01T00:00:00Z'
 * ```
 */
export const _stringifyTimestamp = (date: Date, dispMs: boolean = false): string => {
  const isoString = date.toISOString();

  if (dispMs) {
    // For milliseconds display, return ISO string as-is
    return isoString;
  }

  // For seconds display, remove the milliseconds part (.000Z -> Z)
  return isoString.replace(/\.\d{3}Z$/, 'Z');
};
