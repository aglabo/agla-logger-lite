// src: packages/@aglabo/agla-logger-utils/src/__tests__/unit/logValueValidator.spec.ts
// @(#) Unit tests for logValueValidator functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import {
  _isStringifiable,
  _isStringifiableType,
  _isStringifiableValue,
  _isTimestamp,
} from '../../logValueValidator';
import { testValidator } from '../helpers/validatorHelpers.ts';

// ============================================================================
// _isTimestamp Tests
// ============================================================================

describe('[正常] _isTimestamp - ISO形式とStandard形式のタイムスタンプ判定', () => {
  describe('When: ISO形式（Z終端）の文字列の場合', () => {
    it.each([
      ['ISO形式（Z終端、ミリ秒なし）', '2025-12-12T03:00:00Z', true],
      ['ISO形式（Z終端、ミリ秒あり）', '2025-12-12T03:00:00.123Z', true],
    ])('Then: %s の場合、true を返す', testValidator(_isTimestamp));
  });

  describe('When: Standard形式（YYYY-MM-DDTHH:MM:SS）の文字列の場合', () => {
    it.each([
      ['Standard形式（基本）', '2025-12-12T03:00:00', true],
      ['Standard形式（別日時）', '2025-01-01T00:00:00', true],
    ])('Then: %s の場合、true を返す', testValidator(_isTimestamp));
  });

  describe('When: 有効な日時境界値の場合', () => {
    it.each([
      ['うるう年の2月29日（ISO）', '2024-02-29T00:00:00Z', true],
      ['最大時刻（ISO）', '2025-12-12T23:59:59Z', true],
    ])('Then: %s の場合、true を返す', testValidator(_isTimestamp));
  });
});

describe('[異常] _isTimestamp - 無効な値の判定', () => {
  describe('When: 非文字列型が渡された場合', () => {
    it.each([
      ['Date オブジェクト', new Date('2025-12-12T00:00:00Z'), false],
      ['数値（ミリ秒タイムスタンプ）', 1734048000000, false],
      ['NaN', NaN, false],
      ['Infinity', Infinity, false],
      ['-Infinity', -Infinity, false],
      ['null', null, false],
      ['undefined', undefined, false],
      ['boolean', true, false],
      ['object', { date: '2025-12-12' }, false],
      ['array', [2025, 12, 12], false],
    ])('Then: %s の場合、false を返す', testValidator(_isTimestamp));
  });

  describe('When: 無効なフォーマットの文字列が渡された場合', () => {
    it.each([
      ['タイムゾーン付き（+09:00 形式）', '2025-12-12T03:00:00+09:00', false],
      ['タイムゾーン付き（-05:00 形式）', '2025-12-12T03:00:00-05:00', false],
      ['日付のみ', '2025-12-12', false],
      ['時刻のみ', '12:00:00', false],
      ['無効な文字列', 'invalid', false],
    ])('Then: %s の場合、false を返す', testValidator(_isTimestamp));
  });

  describe('When: 無効な日付値が渡された場合', () => {
    it.each([
      ['月が範囲外（13月、ISO）', '2025-13-01T00:00:00Z', false],
      ['月が範囲外（13月、Standard）', '2025-13-01T00:00:00', false],
      ['日が範囲外（32日、ISO）', '2025-12-32T00:00:00Z', false],
      ['日が範囲外（32日、Standard）', '2025-12-32T00:00:00', false],
      ['時が範囲外（25時、ISO）', '2025-12-12T25:00:00Z', false],
      ['時が範囲外（25時、Standard）', '2025-12-12T25:00:00', false],
      ['分が範囲外（60分、ISO）', '2025-12-12T12:60:00Z', false],
      ['分が範囲外（60分、Standard）', '2025-12-12T12:60:00', false],
      ['秒が範囲外（60秒、ISO）', '2025-12-12T12:00:60Z', false],
      ['秒が範囲外（60秒、Standard）', '2025-12-12T12:00:60', false],
    ])('Then: %s の場合、false を返す', testValidator(_isTimestamp));
  });
});

// ============================================================================
// _isStringifiableType Tests
// ============================================================================

describe('[正常] _isStringifiableType - プリミティブ型チェック', () => {
  describe('When: プリミティブ型が渡された場合', () => {
    it.each([
      ['文字列', 'test', true],
      ['整数', 123, true],
      ['小数', 3.14, true],
      ['true', true, true],
      ['false', false, true],
      ['シンボル', Symbol('test'), true],
    ])('Then: %s の場合、true を返す', testValidator(_isStringifiableType));
  });

  describe('When: 特殊な数値が渡された場合', () => {
    it.each([
      ['NaN', NaN, true],
      ['Infinity', Infinity, true],
      ['-Infinity', -Infinity, true],
      ['ゼロ（0）', 0, true],
      ['負のゼロ（-0）', -0, true],
    ])('Then: %s の場合、true を返す', testValidator(_isStringifiableType));
  });
});

describe('[異常] _isStringifiableType - 非プリミティブ型チェック', () => {
  describe('When: null や undefined が渡された場合', () => {
    it.each([
      ['null', null, false],
      ['undefined', undefined, false],
    ])('Then: %s の場合、false を返す', testValidator(_isStringifiableType));
  });

  describe('When: 複雑な型が渡された場合', () => {
    it.each([
      ['オブジェクト', { key: 'value' }, false],
      ['配列', [1, 2, 3], false],
      ['関数', (): void => {}, false],
      ['Date オブジェクト', new Date(), false],
    ])('Then: %s の場合、false を返す', testValidator(_isStringifiableType));
  });
});

// ============================================================================
// _isStringifiableValue Tests
// ============================================================================

describe('[正常] _isStringifiableValue - 特殊値チェック', () => {
  describe('When: null と undefined が渡された場合', () => {
    it.each([
      ['null', null, true],
      ['undefined', undefined, true],
    ])('Then: %s の場合、true を返す', testValidator(_isStringifiableValue));
  });

  describe('When: 特殊な数値が渡された場合', () => {
    it.each([
      ['NaN', NaN, true],
      ['Infinity', Infinity, true],
      ['-Infinity', -Infinity, true],
    ])('Then: %s の場合、true を返す', testValidator(_isStringifiableValue));
  });
});

describe('[異常] _isStringifiableValue - 非特殊値チェック', () => {
  describe('When: プリミティブ型が渡された場合', () => {
    it.each([
      ['文字列', 'test', false],
      ['数値', 123, false],
      ['真偽値', true, false],
      ['シンボル', Symbol('test'), false],
    ])('Then: %s の場合、false を返す', testValidator(_isStringifiableValue));
  });

  describe('When: オブジェクトが渡された場合', () => {
    it.each([
      ['オブジェクト', { key: 'value' }, false],
      ['配列', [1, 2, 3], false],
      ['関数', (): void => {}, false],
      ['Date オブジェクト', new Date(), false],
    ])('Then: %s の場合、false を返す', testValidator(_isStringifiableValue));
  });
});

// ============================================================================
// _isStringifiable Tests
// ============================================================================

describe('[正常] _isStringifiable - 統合チェック（型 + 値）', () => {
  describe('When: すべての文字列化可能な値が渡された場合', () => {
    it.each([
      ['文字列', 'test', true],
      ['整数', 123, true],
      ['小数', 3.14, true],
      ['true', true, true],
      ['false', false, true],
      ['シンボル', Symbol('test'), true],
      ['NaN', NaN, true],
      ['Infinity', Infinity, true],
      ['-Infinity', -Infinity, true],
      ['null', null, true],
      ['undefined', undefined, true],
    ])('Then: %s の場合、true を返す', testValidator(_isStringifiable));
  });
});

describe('[異常] _isStringifiable - 非文字列化可能な値チェック', () => {
  describe('When: オブジェクト型が渡された場合', () => {
    it.each([
      ['オブジェクト', { key: 'value' }, false],
      ['配列', [1, 2, 3], false],
      ['関数', (): void => {}, false],
      ['Date オブジェクト', new Date(), false],
      ['正規表現', /test/, false],
    ])('Then: %s の場合、false を返す', testValidator(_isStringifiable));
  });
});

// ============================================================================
// Type Guard Tests
// ============================================================================
describe('[型安全性] 型ガード検証', () => {
  describe('When: _isStringifiableType を型ガードとして使用した場合', () => {
    it('Then: プリミティブ型として型が絞られる', () => {
      // Arrange
      const value: unknown = 'test';

      // Act & Assert
      if (_isStringifiableType(value)) {
        // TypeScript は value を string | number | boolean | symbol として扱う
        const stringified: string = String(value);
        expect(stringified).toBe('test');
      }
    });
  });

  describe('When: _isStringifiableValue を型ガードとして使用した場合', () => {
    it('Then: null | undefined として型が絞られる', () => {
      // Arrange
      const value: unknown = null;

      // Act & Assert
      if (_isStringifiableValue(value)) {
        // TypeScript は value を null | undefined として扱う
        const stringified: string = String(value);
        expect(stringified).toBe('null');
      }
    });
  });

  describe('When: _isStringifiable を型ガードとして使用した場合', () => {
    it('Then: 文字列化可能な型として型が絞られる', () => {
      // Arrange
      const value: unknown = null;

      // Act & Assert
      if (_isStringifiable(value)) {
        // TypeScript は value を
        // string | number | boolean | symbol | null | undefined として扱う
        const stringified: string = String(value);
        expect(stringified).toBe('null');
      }
    });
  });
});
