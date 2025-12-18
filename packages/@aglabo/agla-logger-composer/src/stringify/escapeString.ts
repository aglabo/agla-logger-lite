// src: packages/@aglabo/agla-logger-composer/src/stringify/escapeString.ts
// @(#) String escaping utility for log value stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Escapes special characters in a string and wraps it with double quotes.
 *
 * Handles the following escape sequences:
 * - Backslash (\\) → \\\\
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
