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
<<<<<<< HEAD
 * ダックタイピングされた Date オブジェクト（getTime メソッドを持つオブジェクト）
 * は除外される（false を返す）。これは instanceof チェックにより実現される。
 *
||||||| parent of b714e31 (feat(value-domain/isSingleValue): complete _isSingleValue Date detection)
=======
>>>>>>> b714e31 (feat(value-domain/isSingleValue): complete _isSingleValue Date detection)
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

/**
 * 配列またはJSON型オブジェクト（Collection）かどうかを判定する
 *
 * @param value - 判定対象の値
 * @returns Collection（配列またはJSON型オブジェクト）の場合 true、それ以外の場合 false
 *
 * @remarks
 * **Collection として扱う型:**
 * - **Array:** 配列リテラル ([])、Array コンストラクタから生成した配列 (new Array(5))
 *   - 空配列、数値配列、文字列配列、ネストされた配列を含む
 * - **JSON Typed Object:** Object.prototype を直接のプロトタイプチェーンに持つオブジェクト
 *   - オブジェクトリテラル ({}, { a: 1 })
 *   - Object.create(Object.prototype) で生成されたオブジェクト
 *   - シンプルなデータコンテナ
 *
 * **JSON Typed Object の定義:**
 * JSON型オブジェクトは、Object.getPrototypeOf(value) === Object.prototype
 * を満たすオブジェクトです。これらはJSON互換性のあるオブジェクトです。これにより、ビルトインオブジェクト、クラスインスタンス、
 * ダックタイピングされたオブジェクトが確実に除外されます。
 *
 * **除外される型（重要）:**
 * - null: typeof 'object' だが判定結果は false
 * - undefined: 判定結果は false
 * - Date インスタンス: instanceof チェックで除外（ダックタイプ除外）
 * - Function オブジェクト: typeof 'object' ではなく除外
 * - クラスインスタンス: プロトタイプチェーンが Object.prototype でないため除外
 * - ビルトインオブジェクト（RegExp, Map, Set, WeakMap, WeakSet など）: プロトタイプが異なるため除外
 * - ダックタイピング済みオブジェクト: instanceof チェックのため除外
 *   例: { getTime: () => Date.now() } のような Date-like オブジェクト
 *
 * **性能要件:**
 * - 時間計算量: O(1)
 * - ループなし
 * - 再帰なし
 * - 入力値変更なし
 *
 * **エラーポリシー:**
 * - 例外を投げない
 * - 動的実行なし
 * - 入力値を変更しない
 *
 * @internal
 */
export const _isCollection = (value: unknown): boolean => {
  // Step 1: null/undefined check
  if (value === null || value === undefined) {
    return false;
  }

  // Step 2: Array detection
  if (Array.isArray(value)) {
    return true;
  }

  // Step 3: Plain object detection
  return typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};

/**
 * Defined Data(プレーンオブジェクト)かどうかを判定する
 *
 * @param value - 判定対象の値
 * @returns Defined Data(プレーンオブジェクト)の場合 true、それ以外の場合 false
 *
 * @remarks
 * Defined Data として扱う型:
 * - Object.prototype を直接のプロトタイプチェーンに持つオブジェクト
 * - オブジェクトリテラル ({}, { a: 1 })
 * - Object.create(Object.prototype) で生成されたオブジェクト
 *
 * 除外される型:
 * - 配列
 * - null/undefined
 * - Date インスタンス
 * - クラスインスタンス
 * - ビルトインオブジェクト（RegExp, Map, Set など）
 *
 * 性能要件:
 * - 時間計算量: O(1)
 * - 再帰なし
 * - ヒープ割り当てなし
 *
 * エラーポリシー:
 * - 例外を投げない
 export const _isDefinedData = (value: unknown): boolean => {
   // Step 1: null/undefined check
   if (value === null || value === undefined) {
     return false;
   }

   // Step 2: Plain object detection
   return typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
 }; @internal
 */
export const _isDefinedData = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }

  // Plain object detection: exclude null, non-objects, and non-plain objects
  return typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
};
