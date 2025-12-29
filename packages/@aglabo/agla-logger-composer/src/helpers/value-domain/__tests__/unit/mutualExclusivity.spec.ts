// src: packages/@aglabo/agla-logger-composer/src/helpers/value-domain/__tests__/unit/mutualExclusivity.spec.ts
// @(#) Mutual Exclusivity Tests for AGTValueCategory classification functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';

import { _isAtomic, _isCollection, _isDefinedData, _isSingleValue } from '../../isValueFunction.ts';

// =============================================================================
// Test Data for Mutual Exclusivity Validation
// =============================================================================

/**
 * Helper function to check mutual exclusivity
 * Verifies that the expected functions return true and others return false
 */
const assertMutualExclusivity = (
  value: unknown,
  expectedTrueFunction: string,
) => {
  const results = {
    _isAtomic: _isAtomic(value),
    _isSingleValue: _isSingleValue(value),
    _isCollection: _isCollection(value),
    _isDefinedData: _isDefinedData(value),
  };

  // For plain objects, both _isCollection and _isDefinedData should return true
  if (expectedTrueFunction === 'both') {
    expect(results._isCollection).toBe(true);
    expect(results._isDefinedData).toBe(true);
    expect(results._isAtomic).toBe(false);
    expect(results._isSingleValue).toBe(false);
  } else if (expectedTrueFunction === 'none') {
    expect(results._isAtomic).toBe(false);
    expect(results._isSingleValue).toBe(false);
    expect(results._isCollection).toBe(false);
    expect(results._isDefinedData).toBe(false);
  } else {
    // For other cases, exactly one should be true
    const expectedFunc = results[expectedTrueFunction as keyof typeof results];
    expect(expectedFunc).toBe(true);

    // All others should be false
    Object.entries(results).forEach(([funcName, resultValue]) => {
      if (funcName !== expectedTrueFunction) {
        expect(resultValue).toBe(false);
      }
    });
  }
};

// =============================================================================
// T-05: Mutual Exclusivity Validation Tests
// =============================================================================

/**
 * T-05-01-01: Primitive 値は Atomic のみにマッチ
 * Given: string, number, boolean, symbol, bigint primitive values
 * When: Call all classification functions
 * Then: Only _isAtomic returns true, others return false
 */
describe('[正常] T-05: Mutual Exclusivity Validation', () => {
  it('T-05-01-01: Primitive 値は Atomic のみにマッチ', () => {
    const primitives = [
      'hello',
      42,
      true,
      Symbol('test'),
      100n,
    ];

    primitives.forEach((value) => {
      assertMutualExclusivity(value, '_isAtomic');
    });
  });

  /**
   * T-05-01-02: Date は SingleValue のみにマッチ
   * Given: Date オブジェクト (new Date())
   * When: Call all classification functions
   * Then: Only _isSingleValue returns true, others return false
   */
  it('T-05-01-02: Date は SingleValue のみにマッチ', () => {
    const dates = [
      new Date(),
      new Date('2025-12-27'),
      new Date(0),
    ];

    dates.forEach((value) => {
      assertMutualExclusivity(value, '_isSingleValue');
    });
  });

  /**
   * T-05-01-03: 配列は Collection のみにマッチ
   * Given: Array ([], [1,2,3])
   * When: Call all classification functions
   * Then: Only _isCollection returns true, others return false
   */
  it('T-05-01-03: 配列は Collection のみにマッチ', () => {
    const arrays = [
      [],
      [1, 2, 3],
      ['a', 'b'],
      new Array(5),
    ];

    arrays.forEach((value) => {
      assertMutualExclusivity(value, '_isCollection');
    });
  });

  /**
   * T-05-01-04: Plain object は Collection と DefinedData の両方にマッチ
   * Given: Plain object ({}, { a: 1 })
   * When: Call all classification functions
   * Then: Both _isCollection and _isDefinedData return true, others return false
   */
  it('T-05-01-04: Plain object は Collection と DefinedData の両方にマッチ', () => {
    const plainObjects = [
      {},
      { a: 1 },
      { a: 1, b: 2 },
    ];

    plainObjects.forEach((value) => {
      assertMutualExclusivity(value, 'both');
    });
  });

  /**
   * T-05-01-05: クラスインスタンスはどのカテゴリにもマッチしない
   * Given: Class instance (new CustomClass())
   * When: Call all classification functions
   * Then: All functions return false
   */
  it('T-05-01-05: クラスインスタンスはどのカテゴリにもマッチしない', () => {
    class CustomClass {}
    class AnotherClass {
      constructor(public value: number) {}
    }

    const instances = [
      new CustomClass(),
      new AnotherClass(42),
    ];

    instances.forEach((value) => {
      assertMutualExclusivity(value, 'none');
    });
  });

  /**
   * T-05-01-06: 関数はどのカテゴリにもマッチしない
   * Given: Function (function() {}, () => {})
   * When: Call all classification functions
   * Then: All functions return false
   */
  it('T-05-01-06: 関数はどのカテゴリにもマッチしない', () => {
    const functions = [
      function() {},
      () => {},
    ];

    functions.forEach((value) => {
      assertMutualExclusivity(value, 'none');
    });
  });

  /**
   * T-05-01-07: ビルトインオブジェクトはどのカテゴリにもマッチしない
   * Given: Built-in objects (RegExp, Map, Set, Error)
   * When: Call all classification functions
   * Then: All functions return false
   */
  it('T-05-01-07: ビルトインオブジェクトはどのカテゴリにもマッチしない', () => {
    const builtIns = [
      /regex/,
      new Map(),
      new Set(),
      new Error(),
    ];

    builtIns.forEach((value) => {
      assertMutualExclusivity(value, 'none');
    });
  });

  /**
   * T-05-01-08: null は Atomic のみにマッチ
   * Given: null value
   * When: Call all classification functions
   * Then: Only _isAtomic returns true, others return false
   */
  it('T-05-01-08: null は Atomic のみにマッチ', () => {
    assertMutualExclusivity(null, '_isAtomic');
  });
});
