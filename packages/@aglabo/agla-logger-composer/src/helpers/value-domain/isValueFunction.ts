// src: packages/@aglabo/agla-logger-composer/src/helpers/value-domain/isValueFunction.ts
// @(#) AGTValueCategory classification functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Atomic値(プリミティブ値とnull/undefined)かどうかを判定する
 *
 * @param value - 判定対象の値
 * @returns Atomic値の場合 true、それ以外の場合 false
 *
 * @remarks
 * Atomic値として扱う型:
 * - string
 * - number (NaN, Infinity を含む)
 * - boolean
 * - symbol
 * - bigint
 * - null
 * - undefined
 *
 * 性能要件:
 * - 時間計算量: O(1)
 * - 再帰なし
 * - ヒープ割り当てなし
 *
 * エラーポリシー:
 * - 例外を投げない
 * - 動的実行なし
 * - 入力値を変更しない
 *
 * @internal
 */
export const _isAtomic = (value: unknown): boolean => {
  // Step 1: null/undefined check
  if (value === null || value === undefined) {
    return true;
  }

  // Step 2: typeof-based primitive detection
  const type = typeof value;

  // Step 3: Primitive type check
  switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return true;
    default:
      return false;
  }
};

/**
 * Date インスタンスかどうかを判定する
 *
 * @param value - 判定対象の値
 * @returns Date インスタンスの場合 true、それ以外の場合 false
 *
 * @remarks
 * Date インスタンスとして扱う型:
 * - Date オブジェクト (new Date() など)
 *
 * ダックタイピングされた Date オブジェクト（getTime メソッドを持つオブジェクト）
 * は除外される（false を返す）。これは instanceof チェックにより実現される。
 *
 * 性能要件:
 * - 時間計算量: O(1)
 * - 再帰なし
 * - ヒープ割り当てなし
 *
 * エラーポリシー:
 * - 例外を投げない
 * - 動的実行なし
 * - 入力値を変更しない
 *
 * @internal
 */
export const _isSingleValue = (value: unknown): boolean => {
  return value instanceof Date;
};
