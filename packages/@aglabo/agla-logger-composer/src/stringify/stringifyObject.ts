// src: packages/@aglabo/agla-logger-composer/src/stringify/stringifyObject.ts
// @(#) Main stringification function for objects
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { agFormat } from '#shared/types/AGTFormatContext.types.ts';
import type { AGTFormatContext } from '#shared/types/AGTFormatContext.types.ts';
import type { AGTFormatEnvironment } from '#shared/types/AGTFormatEnvironment.class';
import { _stringifiableType } from '../validators/stringifiableType.ts';
import { _stringifyTimestamp } from './formatters.ts';

/**
 * Stringifies an object value based on its type.
 * Handles special types like Date, Map, Set, etc.
 *
 * @param value - Value to stringify
 * @param context - AGTFormatterContext for managing state
 * @returns String representation of the value
 * @internal
 */
export const _stringifyObject = (value: unknown, context: AGTFormatContext, _env: AGTFormatEnvironment): string => {
  // Ensure context is available (for future use in type-specific formatters)
  agFormat.ensureContext(context);
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
