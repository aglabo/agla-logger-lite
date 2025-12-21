// src: packages/@aglabo/agla-logger-composer/src/stringify/stringifyObject.ts
// @(#) Main stringification function for objects
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTFormatterContext } from '../../shared/types/AGTFormatterContext.class.ts';
import type { AGTFormatterContextOptions } from '../../shared/types/AGTstringifiableType.types.ts';
import { _stringifiableType } from '../validators/stringifiableType.ts';
import { _stringifyTimestamp } from './formatters.ts';

/**
 * Ensures a FormatterContext instance exists.
 * If no context is provided, creates a new one with optional options.
 *
 * @param context - Existing context (if provided, options are ignored)
 * @param options - Options for creating new context if needed
 * @returns AGTFormatterContext instance
 * @internal
 */
const ensureContext = (
  context?: AGTFormatterContext,
  options?: AGTFormatterContextOptions,
): AGTFormatterContext => {
  if (context) {
    return context;
  }
  return new AGTFormatterContext(options);
};

/**
 * Stringifies an object value based on its type.
 * Handles special types like Date, Map, Set, etc.
 *
 * @param value - Value to stringify
 * @param context - AGTFormatterContext for managing state
 * @returns String representation of the value
 * @internal
 */
export const stringifyObject = (value: unknown, context?: AGTFormatterContext): string => {
  // Ensure context is available (for future use in type-specific formatters)
  ensureContext(context);

  const type = _stringifiableType(value);

  if (!type) {
    return String(value);
  }

  // Handle Date as Timestamp - return ISO 8601 format with milliseconds
  if (type === 'Date' && value instanceof Date) {
    return _stringifyTimestamp(value, true);
  }

  // Handle custom class - return actual class name
  if (type === 'CustomClass' && typeof value === 'object' && value !== null) {
    const className = value.constructor.name;
    return `<${className}>`;
  }

  // Placeholder for other types - actual implementation will be in T4 group
  return `<${type}>`;
};

// Export ensureContext for use in other modules if needed
export const _ensureContext = ensureContext;
