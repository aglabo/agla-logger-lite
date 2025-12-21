// src: packages/@aglabo/agla-logger-composer/src/helpers/valueClassification/detectValueHelpers.ts
// @(#) Value classification helper functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  AG_KIND_TO_CATEGORY,
  AGTValueCategory,
  AGTValueKind,
} from '#shared/types/AGTValueDomain.ts';

/**
 * 値の種別 (AGTValueKind) を判定する
 *
 * @param value - 判定対象の値
 * @returns AGTValueKind または undefined (未対応型)
 *
 * @remarks
 * 判定順序:
 * 1. null/undefined は typeof 前に判定 (安全性確保)
 * 2. typeof を使用してプリミティブ型を高速判定
 * 3. 未対応型は undefined を返す
 *
 * @example
 * ```typescript
 * detectValueKind('hello')  // AGTValueKind.Primitive
 * detectValueKind(42)       // AGTValueKind.Primitive
 * detectValueKind(null)     // AGTValueKind.Primitive
 * detectValueKind({})       // undefined (将来拡張)
 * ```
 */
export const detectValueKind = (value: unknown): AGTValueKind | undefined => {
  // Step 1: null/undefined は Primitive として扱う
  // typeof null === 'object' のバグを回避
  if (value === null || value === undefined) {
    return AGTValueKind.Primitive;
  }

  // Step 2: typeof による型判定
  const type = typeof value;

  // Step 3: プリミティブ型の判定
  switch (type) {
    case 'string':
    case 'number': // NaN, Infinity も含む
    case 'boolean':
    case 'symbol':
    case 'bigint':
      return AGTValueKind.Primitive;
  }

  // Step 4: object 型の詳細判定 (将来拡張用)
  // 現時点では未実装 → undefined
  // ToDo: Date, Arrayなどについては、次の開発で実装
  return undefined;
};

/**
 * AGTValueKind から AGTValueCategory へ変換する
 *
 * @param kind - AGTValueKind または undefined
 * @returns AGTValueCategory または undefined (未マッピング)
 *
 * @remarks
 * - undefined 入力は undefined を返す
 * - マッピングテーブル (AG_KIND_TO_CATEGORY) を使用
 *
 * @example
 * ```typescript
 * detectValueCategory(AGTValueKind.Primitive)  // AGTValueCategory.Atomic
 * detectValueCategory(AGTValueKind.Date)       // AGTValueCategory.SingleValue
 * detectValueCategory(undefined)               // undefined
 * ```
 */
export const detectValueCategory = (
  kind: AGTValueKind | undefined,
): AGTValueCategory | undefined => {
  // undefined 入力はそのまま返す
  if (kind === undefined) {
    return undefined;
  }
  const category = AG_KIND_TO_CATEGORY[kind];

  // マッピングテーブルから取得
  return category;
};
