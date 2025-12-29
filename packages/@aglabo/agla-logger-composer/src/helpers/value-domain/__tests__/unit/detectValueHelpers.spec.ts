// src: packages/@aglabo/agla-logger-composer/src/helpers/valueClassification/__tests__/unit/detectValueHelpers.spec.ts
// @(#) Unit tests for detectValueHelpers - value classification functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';

import {
  AGTValueCategory,
  AGTValueKind,
} from '#shared/types/AGTValueDomain.ts';
import {
  _isPrimitive,
  detectValueCategory,
  detectValueKind,
} from '../../detectValueHelpers.ts';

// =============================================================================
// detectValueKind Tests
// =============================================================================

/**
 * detectValueKind Primitive Type Classification Tests
 *
 * Tests value kind detection for all primitive types including
 * string, number, boolean, symbol, and bigint values.
 */
describe('Given detectValueKind function', () => {
  /**
   * Primitive Type Classification Tests
   *
   * Tests standard primitive type classification covering
   * string, number, boolean, symbol, and bigint types.
   */
  describe('[正常] When classifying primitive types', () => {
    // Test: String type classification
    it('Then string values should return Primitive', () => {
      expect(detectValueKind('hello')).toBe(AGTValueKind.Primitive);
      expect(detectValueKind('')).toBe(AGTValueKind.Primitive);
    });

    // Test: Number type classification
    it('Then number values should return Primitive', () => {
      expect(detectValueKind(42)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(3.14)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(-7)).toBe(AGTValueKind.Primitive);
    });

    // Test: Boolean type classification
    it('Then boolean values should return Primitive', () => {
      expect(detectValueKind(true)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(false)).toBe(AGTValueKind.Primitive);
    });

    // Test: Symbol type classification
    it('Then symbol values should return Primitive', () => {
      expect(detectValueKind(Symbol('test'))).toBe(AGTValueKind.Primitive);
    });

    // Test: BigInt type classification
    it('Then bigint values should return Primitive', () => {
      expect(detectValueKind(BigInt(123))).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(123n)).toBe(AGTValueKind.Primitive);
    });
  });

  /**
   * Special Primitive Value Classification Tests
   *
   * Tests edge case primitive values including null, undefined,
   * and special numeric values (NaN, Infinity).
   */
  describe('[エッジケース] When classifying special primitive values', () => {
    // Test: Null and undefined classification
    it('Then null and undefined should return Primitive', () => {
      expect(detectValueKind(null)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(undefined)).toBe(AGTValueKind.Primitive);
    });

    // Test: Special number values classification
    it('Then special numeric values should return Primitive', () => {
      expect(detectValueKind(NaN)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(Infinity)).toBe(AGTValueKind.Primitive);
      expect(detectValueKind(-Infinity)).toBe(AGTValueKind.Primitive);
    });
  });
});

// =============================================================================
// detectValueCategory Tests
// =============================================================================

/**
 * detectValueCategory Value Kind to Category Mapping Tests
 *
 * Tests mapping from AGTValueKind to AGTValueCategory,
 * ensuring correct category assignment for each kind.
 */
describe('Given detectValueCategory function', () => {
  /**
   * Primitive Kind to Atomic Category Mapping Tests
   *
   * Tests that Primitive kind values are correctly mapped
   * to the Atomic category.
   */
  describe('[正常] When mapping primitive kind to category', () => {
    // Test: Primitive kind to Atomic category mapping
    it('Then Primitive kind should return Atomic category', () => {
      expect(detectValueCategory(AGTValueKind.Primitive)).toBe(AGTValueCategory.Atomic);
    });
  });

  /**
   * Unmapped Kind Value Tests
   *
   * Tests behavior when AGTValueKind values not in the mapping table are provided.
   * This handles cases where type casting bypasses type safety.
   */
  describe('[異常値] When handling unmapped kind values', () => {
    // Test: Unmapped kind value handling
    it('Then unmapped kind should return undefined', () => {
      // Type assertion to simulate runtime type safety bypass
      const invalidKind = '<un_support>' as AGTValueKind;
      expect(detectValueCategory(invalidKind)).toBeUndefined();
    });
  });

  /**
   * Invalid Input Handling Tests
   *
   * Tests behavior when invalid or undefined input is provided,
   * ensuring graceful handling of edge cases.
   */
  describe('[エッジケース] When handling invalid input', () => {
    // Test: Undefined input handling
    it('Then undefined input should return undefined', () => {
      expect(detectValueCategory(undefined)).toBeUndefined();
    });
  });
});

// =============================================================================
// _isPrimitive Tests
// =============================================================================

/**
 * _isPrimitive Primitive Type Detection Tests
 *
 * Tests boolean-based primitive type detection that returns true for
 * primitive types (undefined, null, string, number, boolean, symbol, bigint)
 * and false for object types (objects, arrays, functions, etc.).
 */
describe('Given _isPrimitive function', () => {
  /**
   * Primitive Type Detection Tests
   *
   * Tests that all primitive types return true, including
   * string, number, boolean, symbol, bigint, null, and undefined.
   */
  describe('[正常] When checking primitive types', () => {
    // Test: String type detection
    it('Then string values should return true', () => {
      expect(_isPrimitive('hello')).toBe(true);
      expect(_isPrimitive('')).toBe(true);
    });

    // Test: Number type detection
    it('Then number values should return true', () => {
      expect(_isPrimitive(42)).toBe(true);
      expect(_isPrimitive(3.14)).toBe(true);
      expect(_isPrimitive(-7)).toBe(true);
      expect(_isPrimitive(NaN)).toBe(true);
      expect(_isPrimitive(Infinity)).toBe(true);
      expect(_isPrimitive(-Infinity)).toBe(true);
    });

    // Test: Boolean type detection
    it('Then boolean values should return true', () => {
      expect(_isPrimitive(true)).toBe(true);
      expect(_isPrimitive(false)).toBe(true);
    });

    // Test: Symbol type detection
    it('Then symbol values should return true', () => {
      expect(_isPrimitive(Symbol('test'))).toBe(true);
    });

    // Test: BigInt type detection
    it('Then bigint values should return true', () => {
      expect(_isPrimitive(BigInt(123))).toBe(true);
      expect(_isPrimitive(123n)).toBe(true);
    });

    // Test: Null and undefined detection
    it('Then null and undefined should return true', () => {
      expect(_isPrimitive(null)).toBe(true);
      expect(_isPrimitive(undefined)).toBe(true);
    });
  });

  /**
   * Non-Primitive Type Detection Tests
   *
   * Tests that object types (objects, arrays, functions, etc.)
   * return false, as they are not primitive types.
   */
  describe('[正常] When checking non-primitive types', () => {
    // Test: Object type detection
    it('Then object values should return false', () => {
      expect(_isPrimitive({})).toBe(false);
      expect(_isPrimitive({ key: 'value' })).toBe(false);
    });

    // Test: Array type detection
    it('Then array values should return false', () => {
      expect(_isPrimitive([])).toBe(false);
      expect(_isPrimitive([1, 2, 3])).toBe(false);
    });

    // Test: Function type detection
    it('Then function values should return false', () => {
      expect(_isPrimitive(() => {})).toBe(false);
      expect(_isPrimitive(function() {})).toBe(false);
    });

    // Test: Date type detection
    it('Then Date objects should return false', () => {
      expect(_isPrimitive(new Date())).toBe(false);
    });

    // Test: RegExp type detection
    it('Then RegExp objects should return false', () => {
      expect(_isPrimitive(/test/)).toBe(false);
      expect(_isPrimitive(new RegExp('test'))).toBe(false);
    });

    // Test: Map and Set type detection
    it('Then Map and Set objects should return false', () => {
      expect(_isPrimitive(new Map())).toBe(false);
      expect(_isPrimitive(new Set())).toBe(false);
    });
  });
});

// Note: Date, Array, PlainObject のテストは将来の拡張で実装
