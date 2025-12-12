// src: packages/@aglabo/agla-logger-utils/src/parseLogger.ts
// @(#) Logger argument parser and validation utilities
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTLogMessage } from '#shared/types/AGTLoggerMessage.types.ts';

/**
 * Internal: タイムスタンプ判定
 *
 * 未知の値が有効なタイムスタンプ文字列かどうかを判定します。
 * ISO形式（Z終端）またはStandard形式（yyyy-mm-ddTHH:MM:SS）の文字列を検証し、
 * Date変換の妥当性もチェックします。
 *
 * @internal
 * @param arg - 判定対象の値
 * @returns ISO形式またはStandard形式の有効なタイムスタンプ文字列の場合true、それ以外はfalse
 */
export const _isTimestamp = (arg: unknown): arg is string => {
  // Only accept string type
  if (typeof arg !== 'string') {
    return false;
  }

  // ISO形式（Z終端）: YYYY-MM-DDTHH:MM:SS.sssZ or YYYY-MM-DDTHH:MM:SSZ
  const isoPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  // Standard形式: YYYY-MM-DDTHH:MM:SS
  const standardPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

  // Check pattern match
  if (!isoPattern.test(arg) && !standardPattern.test(arg)) {
    return false;
  }

  // Validate Date conversion
  const date = new Date(arg);
  return !Number.isNaN(date.getTime());
};

/**
 * Internal: メッセージ引数判定
 *
 * 未知の値がログメッセージの引数として適切かどうかを判定します。
 * プリミティブ型（string、number、boolean、symbol）のフィルタリングを行い、
 * 複雑なオブジェクトや関数を除外してログメッセージの品質を保持します。
 *
 * @internal
 * @param arg - 判定対象の値
 * @returns プリミティブ型として有効な場合true、それ以外はfalse
 */
export const _isLoggableValue = (arg: unknown): arg is string | number | boolean | symbol => {
  const argType = typeof arg;
  return ['string', 'number', 'boolean', 'symbol'].includes(argType);
};

/**
 * Parse logger arguments into structured log message.
 *
 * Extracts timestamp, primitive values for message, and non-primitive objects
 * from raw logging arguments. Follows these rules:
 * - Uses defaultTimestamp parameter (or current time if null)
 * - Primitive values (string, number, boolean, symbol) are concatenated to message
 * - Non-primitive values are stored in objects array
 *
 * @param label - Log level label string (e.g., "INFO", "ERROR")
 * @param messages - Array of raw arguments to parse
 * @param defaultTimestamp - Default timestamp when not provided in messages (null = current time)
 * @returns Structured AGTLogMessage object
 */
export const parseLogger = (
  label: string,
  messages: unknown[],
  defaultTimestamp: Date | null = null,
): AGTLogMessage => {
  // Use defaultTimestamp or current time
  const timestamp = defaultTimestamp ?? new Date();

  // Filter and categorize arguments
  const primitives: string[] = [];
  const objects: unknown[] = [];

  for (const arg of messages) {
    if (_isLoggableValue(arg)) {
      primitives.push(String(arg));
    } else {
      objects.push(arg);
    }
  }

  // Concatenate primitive values with spaces
  const message = primitives.join(' ');

  return {
    logLabel: label,
    timestamp,
    message,
    objects,
  };
};
