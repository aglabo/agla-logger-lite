// src: packages/@aglabo/agla-logger-composer/shared/types/AGTValueDomain.ts
// @(#) Value domain type definitions for value classification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Value Kind - 値の種別を表す enum
 *
 * @remarks
 * - Primitive: プリミティブ値 (string, number, boolean, null, undefined, symbol, bigint)
 * - Date: Date オブジェクト
 * - Array: 配列
 * - PlainObject: プレーンオブジェクト
 */
export enum AGTValueKind {
  /** プリミティブ値 */
  Primitive = 'Primitive',

  /** Date オブジェクト */
  Date = 'Date',

  /** 配列 */
  Array = 'Array',

  /** プレーンオブジェクト */
  PlainObject = 'PlainObject',
}

/**
 * Value Category - AGTValueKind をカテゴリ別にグループ化
 *
 * @remarks
 * - Atomic: 分解不能なプリミティブ値
 * - SingleValue: 単一値を持つオブジェクト (Date等)
 * - Compose: 複数要素を内包する構造体 (Array, Object)
 */
export enum AGTValueCategory {
  /** 分解不能なプリミティブ値 */
  Atomic = 'Atomic',

  /** 単一値オブジェクト */
  SingleValue = 'SingleValue',

  /** 複合値 (配列・オブジェクト) */
  Compose = 'Compose',
}

/**
 * AGTValueKind から AGTValueCategory へのマッピングテーブル
 *
 * @remarks
 * - Primitive → Atomic: プリミティブ値は分解不能
 * - Date → SingleValue: 単一の日時値を保持
 * - Array, PlainObject → Compose: 複数要素を内包
 */
export const AG_KIND_TO_CATEGORY: Record<AGTValueKind, AGTValueCategory> = {
  [AGTValueKind.Primitive]: AGTValueCategory.Atomic,
  [AGTValueKind.Date]: AGTValueCategory.SingleValue,
  [AGTValueKind.Array]: AGTValueCategory.Compose,
  [AGTValueKind.PlainObject]: AGTValueCategory.Compose,
} as const;
