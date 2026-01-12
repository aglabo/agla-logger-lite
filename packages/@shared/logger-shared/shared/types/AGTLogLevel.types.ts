// src: packages/@shared/agla-shared/shared/types/AGTLogLevel.types.ts
// @(#) Log level constants and union types
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Canonical log level labels.
 *
 * Notes:
 * - All labels are uppercase.
 * - Use this table when you want strict typing and consistent comparisons.
 */
export const AG_LOG_LEVEL = {
  OFF: 'OFF',
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
} as const;

/**
 * Union type for known log level labels.
 */
export type AGTLogLevel = (typeof AG_LOG_LEVEL)[keyof typeof AG_LOG_LEVEL];
