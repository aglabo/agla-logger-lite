// src: packages/@aglabo/agla-logger-utils/src/logValueValidator.ts
// @(#) Log value validators - Type and value validators for logging
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

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
 * Internal: 文字列化可能値判定（型チェック版）
 *
 * 未知の値がプリミティブ型（string、number、boolean、symbol）かどうかを判定します。
 * typeof 演算子を使用した純粋な型チェックのため、null、undefined、NaN などの特殊値は除外されます。
 * ログメッセージの引数フィルタリングなど、型のみで判定する場合に使用します。
 *
 * @internal
 * @param arg - 判定対象の値
 * @returns プリミティブ型（string、number、boolean、symbol）の場合true、それ以外はfalse
 */
export const _isStringifiableType = (arg: unknown): arg is string | number | boolean | symbol => {
  const argType = typeof arg;
  return ['string', 'number', 'boolean', 'symbol'].includes(argType);
};

/**
 * Internal: 文字列化可能値判定（値チェック版）
 *
 * 未知の値が文字列化可能な特殊値（null、undefined）かどうかを判定します。
 * 値チェックのみを行い、型チェックは別の関数で行います。
 *
 * @internal
 * @param arg - 判定対象の値
 * @returns 文字列化可能な特殊値の場合true、それ以外はfalse
 */
export const _isStringifiableValue = (arg: unknown): arg is null | undefined => {
  // Check for null and undefined only
  return arg === null || arg === undefined;
};

/**
 * Internal: 文字列化可能値判定（型チェック + 値チェック統合版）
 *
 * 未知の値を文字列に変換できるかどうかを判定します。
 * プリミティブ型（string、number、boolean、symbol）に加えて、
 * null、undefined、NaN、Infinity などの特殊値も文字列化可能と判定します。
 * 配列やオブジェクトなどの複雑な構造は除外されます。
 *
 * @internal
 * @param arg - 判定対象の値
 * @returns 文字列変換可能な場合true、それ以外はfalse
 */
export const _isStringifiable = (arg: unknown): arg is string | number | boolean | symbol | null | undefined => {
  // Check for null and undefined
  if (arg === null || arg === undefined) {
    return true;
  }

  const argType = typeof arg;

  // Handle special number cases (NaN, Infinity)
  if (argType === 'number') {
    return true; // NaN and Infinity are valid numbers
  }

  // Check for primitive types
  return ['string', 'boolean', 'symbol'].includes(argType);
};
