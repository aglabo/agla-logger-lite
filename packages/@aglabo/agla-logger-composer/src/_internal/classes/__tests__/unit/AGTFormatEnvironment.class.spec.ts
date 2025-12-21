// src: packages/@aglabo/agla-logger-composer/src/__internal/classes/__tests__/AGTFormatterEnvironment.class.spec.ts
// @(#) Unit tests for AGTFormatterEnvironment class
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTFormatterEnvironment } from '#shared/types/AGTFormatEnvironment.class';
import { describe, expect, it } from 'vitest';

const specialNumberCases = [
  {
    description: 'NaN values',
    value: Number.NaN,
    expected: { maxElements: 100, maxDisplayElements: 3, maxDepth: 3 },
  },
  {
    description: 'Infinity values',
    value: Number.POSITIVE_INFINITY,
    expected: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
  },
  {
    description: 'negative Infinity values',
    value: Number.NEGATIVE_INFINITY,
    expected: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
  },
].map(({ description, value, expected }) => ({
  description,
  configs: { maxElements: value, maxDisplayElements: value, maxDepth: value },
  expected,
}));

// ============================================================================
// Test Target: Constructor
// ============================================================================

describe('AGTFormatterEnvironment - Constructor', () => {
  // ==========================================================================
  // [正常系] Normal Cases
  // ==========================================================================

  describe('[正常系] - Constructor', () => {
    it.each([
      // T-01-001: Default initialization
      {
        description: 'no configs',
        configs: undefined,
        expected: { maxElements: 100, maxDisplayElements: 3, maxDepth: 3 },
      },
      // T-01-002: Partial config - maxElements only
      {
        description: 'maxElements only',
        configs: { maxElements: 50 },
        expected: { maxElements: 50, maxDisplayElements: 3, maxDepth: 3 },
      },
      // T-01-003: Complete configs
      {
        description: 'complete configs',
        configs: { maxElements: 50, maxDisplayElements: 25, maxDepth: 10 },
        expected: { maxElements: 50, maxDisplayElements: 25, maxDepth: 10 },
      },
      // T-01-005: Partial config - maxDisplayElements only
      {
        description: 'maxDisplayElements only',
        configs: { maxDisplayElements: 10 },
        expected: { maxElements: 100, maxDisplayElements: 10, maxDepth: 3 },
      },
      // T-01-006: Partial config - maxDepth only
      {
        description: 'maxDepth only',
        configs: { maxDepth: 5 },
        expected: { maxElements: 100, maxDisplayElements: 3, maxDepth: 5 },
      },
      // T-01-007: Large values
      {
        description: 'large values',
        configs: { maxElements: 10000, maxDisplayElements: 1000, maxDepth: 100 },
        expected: { maxElements: 10000, maxDisplayElements: 1000, maxDepth: 100 },
      },
      // T-01-008: Maximum safe integer values
      {
        description: 'MAX_SAFE_INTEGER values',
        configs: {
          maxElements: Number.MAX_SAFE_INTEGER,
          maxDisplayElements: Number.MAX_SAFE_INTEGER,
          maxDepth: Number.MAX_SAFE_INTEGER,
        },
        expected: {
          maxElements: Number.MAX_SAFE_INTEGER,
          maxDisplayElements: Number.MAX_SAFE_INTEGER,
          maxDepth: Number.MAX_SAFE_INTEGER,
        },
      },
    ])('Given $description, When creating instance, Then configs should match expected', ({ configs, expected }) => {
      // Act
      const env = new AGTFormatterEnvironment(configs);

      // Assert
      expect(env.configs.maxElements).toBe(expected.maxElements);
      expect(env.configs.maxDisplayElements).toBe(expected.maxDisplayElements);
      expect(env.configs.maxDepth).toBe(expected.maxDepth);
      expect(env.seed).toBeInstanceOf(WeakSet);
    });

    // ========================================================================
    // T-01-004: Seed is unique for each instance (cannot be parameterized)
    // ========================================================================
    it('Given multiple instances, When creating them, Then each should have unique seed', () => {
      // Arrange & Act
      const env1 = new AGTFormatterEnvironment();
      const env2 = new AGTFormatterEnvironment();

      // Assert
      expect(env1.seed).not.toBe(env2.seed);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases -- 設定値を0 / デフォルト値などに丸める
  // ==========================================================================

  describe('[異常系] - Constructor', () => {
    it.each([
      // T-02-001: All negative values
      {
        description: 'all negative values',
        configs: { maxElements: -100, maxDisplayElements: -50, maxDepth: -10 },
        expected: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
      },
      // T-02-002: All floating point values
      {
        description: 'all floating point values',
        configs: { maxElements: 99.9, maxDisplayElements: 2.7, maxDepth: 3.3 },
        expected: { maxElements: 99, maxDisplayElements: 2, maxDepth: 3 },
      },
      ...specialNumberCases,
      // T-02-006: Minimum safe integer
      {
        description: 'MIN_SAFE_INTEGER values',
        configs: {
          maxElements: Number.MIN_SAFE_INTEGER,
          maxDisplayElements: Number.MIN_SAFE_INTEGER,
          maxDepth: Number.MIN_SAFE_INTEGER,
        },
        expected: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
      },
    ])('Given $description, When creating instance, Then configs should be normalized', ({ configs, expected }) => {
      // Act
      const env = new AGTFormatterEnvironment(configs);

      // Assert
      expect(env.configs.maxElements).toBe(expected.maxElements);
      expect(env.configs.maxDisplayElements).toBe(expected.maxDisplayElements);
      expect(env.configs.maxDepth).toBe(expected.maxDepth);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases
  // ==========================================================================

  describe('[エッジケース] - Constructor', () => {
    it.each([
      // T-03-001: Zero values
      {
        description: 'all zero values',
        configs: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
        expected: { maxElements: 0, maxDisplayElements: 0, maxDepth: 0 },
      },
      // T-03-002: Zero maxElements only
      {
        description: 'zero maxElements only',
        configs: { maxElements: 0 },
        expected: { maxElements: 0, maxDisplayElements: 3, maxDepth: 3 },
      },
      // T-03-003: Value 1 (minimum meaningful positive integer)
      {
        description: 'all values as 1',
        configs: { maxElements: 1, maxDisplayElements: 1, maxDepth: 1 },
        expected: { maxElements: 1, maxDisplayElements: 1, maxDepth: 1 },
      },
      // T-03-004: Empty object (all defaults)
      {
        description: 'empty object',
        configs: {},
        expected: { maxElements: 100, maxDisplayElements: 3, maxDepth: 3 },
      },
      // T-03-005: Mixed boundary values
      {
        description: 'mixed boundary values (0, 1, MAX)',
        configs: { maxElements: 0, maxDisplayElements: 1, maxDepth: Number.MAX_SAFE_INTEGER },
        expected: { maxElements: 0, maxDisplayElements: 1, maxDepth: Number.MAX_SAFE_INTEGER },
      },
      // T-03-006: Partial with zero and non-zero mix
      {
        description: 'partial config with zero and positive value',
        configs: { maxElements: 0, maxDisplayElements: 5 },
        expected: { maxElements: 0, maxDisplayElements: 5, maxDepth: 3 },
      },
      // T-03-007: Partial with negative and positive mix
      {
        description: 'partial config with negative and positive values',
        configs: { maxElements: -10, maxDepth: 10 },
        expected: { maxElements: 0, maxDisplayElements: 3, maxDepth: 10 },
      },
      // T-03-008: Partial with special values
      {
        description: 'partial config with NaN and Infinity',
        configs: { maxElements: Number.NaN, maxDepth: Number.POSITIVE_INFINITY },
        expected: { maxElements: 100, maxDisplayElements: 3, maxDepth: 0 },
      },
    ])(
      'Given $description, When creating instance, Then configs should match edge case behavior',
      ({ configs, expected }) => {
        // Act
        const env = new AGTFormatterEnvironment(configs);

        // Assert
        expect(env.configs.maxElements).toBe(expected.maxElements);
        expect(env.configs.maxDisplayElements).toBe(expected.maxDisplayElements);
        expect(env.configs.maxDepth).toBe(expected.maxDepth);
      },
    );
  });
});

// ============================================================================
// Test Target: isMaxElementsReached
// ============================================================================

describe('AGTFormatterEnvironment - isMaxElementsReached', () => {
  // ==========================================================================
  // [正常系] Normal Cases
  // ==========================================================================

  describe('[正常系] - isMaxElementsReached', () => {
    it.each([
      // T-04-001: Count below maxElements
      { description: 'count below maxElements (50/100)', maxElements: 100, count: 50, expected: false },
      { description: 'count below maxElements (99/100)', maxElements: 100, count: 99, expected: false },
      // T-04-002: Count equal to maxElements
      { description: 'count equal to maxElements (100/100)', maxElements: 100, count: 100, expected: true },
      // T-04-003: Count exceeds maxElements
      { description: 'count exceeds maxElements (101/100)', maxElements: 100, count: 101, expected: true },
      { description: 'count exceeds maxElements (1000/100)', maxElements: 100, count: 1000, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxElements, count, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxElements });

      // Act & Assert
      expect(env.isMaxElementsReached(count)).toBe(expected);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases
  // ==========================================================================

  describe('[異常系] - isMaxElementsReached', () => {
    it.each([
      // T-05-001: Special values (NaN, Infinity, negative)
      { description: 'NaN value', count: Number.NaN, expected: true },
      { description: 'positive Infinity', count: Number.POSITIVE_INFINITY, expected: true },
      { description: 'negative value (-1)', count: -1, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ count, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxElements: 100 });

      // Act & Assert
      expect(env.isMaxElementsReached(count)).toBe(expected);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases
  // ==========================================================================

  describe('[エッジケース] - isMaxElementsReached', () => {
    it.each([
      // T-06-001: Zero maxElements cases (displays all elements)
      { description: 'count 0 with maxElements 0 (displays all)', maxElements: 0, count: 0, expected: false },
      { description: 'count 1 with maxElements 0 (displays all)', maxElements: 0, count: 1, expected: false },
      { description: 'count 1000 with maxElements 0 (displays all)', maxElements: 0, count: 1000, expected: false },
      // T-06-002: Non-zero maxElements with zero count
      { description: 'count 0 with maxElements 100', maxElements: 100, count: 0, expected: false },
      // T-06-003: Zero maxElements with invalid count values (should still reject invalid values)
      { description: 'NaN count with maxElements 0', maxElements: 0, count: Number.NaN, expected: true },
      {
        description: 'Infinity count with maxElements 0',
        maxElements: 0,
        count: Number.POSITIVE_INFINITY,
        expected: true,
      },
      { description: 'negative count with maxElements 0', maxElements: 0, count: -1, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxElements, count, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxElements });

      // Act & Assert
      expect(env.isMaxElementsReached(count)).toBe(expected);
    });
  });
});

// ============================================================================
// Test Target: isMaxDisplayReached
// ============================================================================

describe('AGTFormatterEnvironment - isMaxDisplayReached', () => {
  // ==========================================================================
  // [正常系] Normal Cases
  // ==========================================================================

  describe('[正常系] - isMaxDisplayReached', () => {
    it.each([
      // T-07-001: nth below maxDisplayElements
      { description: 'nth below maxDisplayElements (0/3)', maxDisplayElements: 3, nth: 0, expected: false },
      { description: 'nth below maxDisplayElements (2/3)', maxDisplayElements: 3, nth: 2, expected: false },
      // T-07-002: nth equal to maxDisplayElements
      { description: 'nth equal to maxDisplayElements (3/3)', maxDisplayElements: 3, nth: 3, expected: true },
      // T-07-003: nth exceeds maxDisplayElements
      { description: 'nth exceeds maxDisplayElements (4/3)', maxDisplayElements: 3, nth: 4, expected: true },
      { description: 'nth exceeds maxDisplayElements (100/3)', maxDisplayElements: 3, nth: 100, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxDisplayElements, nth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDisplayElements });

      // Act & Assert
      expect(env.isMaxDisplayReached(nth)).toBe(expected);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases
  // ==========================================================================

  describe('[異常系] - isMaxDisplayReached', () => {
    it.each([
      // T-08-001: Special values (NaN, Infinity, negative)
      { description: 'NaN value', nth: Number.NaN, expected: true },
      { description: 'positive Infinity', nth: Number.POSITIVE_INFINITY, expected: true },
      { description: 'negative value (-1)', nth: -1, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ nth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDisplayElements: 3 });

      // Act & Assert
      expect(env.isMaxDisplayReached(nth)).toBe(expected);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases
  // ==========================================================================

  describe('[エッジケース] - isMaxDisplayReached', () => {
    it.each([
      // T-09-001: Zero maxDisplayElements cases (displays all elements)
      { description: 'nth 0 with maxDisplayElements 0 (displays all)', maxDisplayElements: 0, nth: 0, expected: false },
      { description: 'nth 1 with maxDisplayElements 0 (displays all)', maxDisplayElements: 0, nth: 1, expected: false },
      {
        description: 'nth 1000 with maxDisplayElements 0 (displays all)',
        maxDisplayElements: 0,
        nth: 1000,
        expected: false,
      },
      // T-09-002: Non-zero maxDisplayElements with zero nth
      { description: 'nth 0 with maxDisplayElements 3', maxDisplayElements: 3, nth: 0, expected: false },
      // T-09-003: Zero maxDisplayElements with invalid nth values (should still reject invalid values)
      { description: 'NaN nth with maxDisplayElements 0', maxDisplayElements: 0, nth: Number.NaN, expected: true },
      {
        description: 'Infinity nth with maxDisplayElements 0',
        maxDisplayElements: 0,
        nth: Number.POSITIVE_INFINITY,
        expected: true,
      },
      { description: 'negative nth with maxDisplayElements 0', maxDisplayElements: 0, nth: -1, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxDisplayElements, nth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDisplayElements });

      // Act & Assert
      expect(env.isMaxDisplayReached(nth)).toBe(expected);
    });
  });
});

// ============================================================================
// Test Target: isMaxDepthReached
// ============================================================================

describe('AGTFormatterEnvironment - isMaxDepthReached', () => {
  // ==========================================================================
  // [正常系] Normal Cases
  // ==========================================================================

  describe('[正常系] - isMaxDepthReached', () => {
    it.each([
      // T13-01-001: currentDepth below maxDepth
      { description: 'depth below maxDepth (0/3)', maxDepth: 3, currentDepth: 0, expected: false },
      { description: 'depth below maxDepth (1/3)', maxDepth: 3, currentDepth: 1, expected: false },
      { description: 'depth below maxDepth (2/3)', maxDepth: 3, currentDepth: 2, expected: false },
      // T13-01-002: currentDepth equal to maxDepth
      { description: 'depth equal to maxDepth (3/3)', maxDepth: 3, currentDepth: 3, expected: true },
      { description: 'depth equal to maxDepth (5/5)', maxDepth: 5, currentDepth: 5, expected: true },
      // T13-01-003: currentDepth exceeds maxDepth
      { description: 'depth exceeds maxDepth (4/3)', maxDepth: 3, currentDepth: 4, expected: true },
      { description: 'depth exceeds maxDepth (100/3)', maxDepth: 3, currentDepth: 100, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxDepth, currentDepth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDepth });

      // Act & Assert
      expect(env.isMaxDepthReached(currentDepth)).toBe(expected);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases
  // ==========================================================================

  describe('[異常系] - isMaxDepthReached', () => {
    it.each([
      // T13-02-001: NaN value
      { description: 'NaN value', currentDepth: Number.NaN, expected: true },
      // T13-02-002: Positive Infinity
      { description: 'positive Infinity', currentDepth: Number.POSITIVE_INFINITY, expected: true },
      // T13-02-003: Negative Infinity
      { description: 'negative Infinity', currentDepth: Number.NEGATIVE_INFINITY, expected: true },
      // T13-02-004: Negative value
      { description: 'negative value (-1)', currentDepth: -1, expected: true },
      { description: 'negative value (-100)', currentDepth: -100, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ currentDepth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDepth: 3 });

      // Act & Assert
      expect(env.isMaxDepthReached(currentDepth)).toBe(expected);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases (Zero maxDepth = Unlimited)
  // ==========================================================================

  describe('[エッジケース] - isMaxDepthReached', () => {
    it.each([
      // T13-03-001: Zero maxDepth with zero currentDepth (unlimited depth)
      { description: 'depth 0 with maxDepth 0 (unlimited)', maxDepth: 0, currentDepth: 0, expected: false },
      // T13-03-002: Zero maxDepth with large currentDepth (unlimited depth)
      { description: 'depth 100 with maxDepth 0 (unlimited)', maxDepth: 0, currentDepth: 100, expected: false },
      { description: 'depth 1000 with maxDepth 0 (unlimited)', maxDepth: 0, currentDepth: 1000, expected: false },
      // T13-03-003: Zero maxDepth with NaN (special value precedence)
      { description: 'NaN depth with maxDepth 0', maxDepth: 0, currentDepth: Number.NaN, expected: true },
      // T13-03-004: Zero maxDepth with Infinity (special value precedence)
      {
        description: 'Infinity depth with maxDepth 0',
        maxDepth: 0,
        currentDepth: Number.POSITIVE_INFINITY,
        expected: true,
      },
      {
        description: 'negative Infinity depth with maxDepth 0',
        maxDepth: 0,
        currentDepth: Number.NEGATIVE_INFINITY,
        expected: true,
      },
      // T13-03-005: Zero maxDepth with negative value (special value precedence)
      { description: 'negative depth (-1) with maxDepth 0', maxDepth: 0, currentDepth: -1, expected: true },
      { description: 'negative depth (-100) with maxDepth 0', maxDepth: 0, currentDepth: -100, expected: true },
    ])('Given $description, When checking, Then should return $expected', ({ maxDepth, currentDepth, expected }) => {
      // Arrange
      const env = new AGTFormatterEnvironment({ maxDepth });

      // Act & Assert
      expect(env.isMaxDepthReached(currentDepth)).toBe(expected);
    });
  });
});

// ============================================================================
// Test Target: hasSeed
// ============================================================================

describe('AGTFormatterEnvironment - hasSeed', () => {
  // ==========================================================================
  // [正常系] Normal Cases
  // ==========================================================================

  describe('[正常系] - hasSeed', () => {
    // T-10-001: Object exists in seed
    it('Given object added to seed, When checking hasSeed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };
      env.seed.add(obj);

      // Act & Assert
      expect(env.hasSeed(obj)).toBe(true);
    });

    // T-10-002: Object does not exist in seed
    it('Given object not in seed, When checking hasSeed, Then should return false', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };

      // Act & Assert
      expect(env.hasSeed(obj)).toBe(false);
    });

    // T-10-002-1: Function not in seed
    it('Given function not in seed, When checking hasSeed, Then should return false', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = () => {};

      // Act & Assert
      expect(env.hasSeed(obj)).toBe(false);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases
  // ==========================================================================

  describe('[異常系] - hasSeed', () => {
    it.each([
      // T-10-003: null value (WeakSet.has returns false for non-objects)
      { description: 'null value', value: null },
      // T-10-004: undefined value
      { description: 'undefined value', value: undefined },
      // T-10-005: Primitive values (string)
      { description: 'string primitive', value: 'test string' },
      // T-10-006: Primitive values (number)
      { description: 'number primitive', value: 123 },
      // T-10-007: Primitive values (boolean)
      { description: 'boolean primitive', value: true },
      // T-10-008: Primitive values (symbol)
      { description: 'symbol primitive', value: Symbol('test') },
    ])('Given $description, When calling hasSeed, Then should return false (WeakSet behavior)', ({ value }) => {
      // Arrange
      const env = new AGTFormatterEnvironment();

      // Act & Assert
      // WeakSet.has() does not throw for non-objects, it returns false
      expect(env.hasSeed(value as unknown as object)).toBe(false);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases
  // ==========================================================================

  describe('[エッジケース] - hasSeed', () => {
    // T-10-009: Empty object
    it('Given empty object {}, When adding to seed then checking, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = {};
      env.seed.add(obj);

      // Act & Assert
      expect(env.hasSeed(obj)).toBe(true);
    });

    // T-10-010: Multiple objects with same structure (reference equality)
    it('Given two objects with identical properties, When adding first then checking second, Then should return false (different references)', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj1 = { name: 'test', value: 123 };
      const obj2 = { name: 'test', value: 123 };
      env.seed.add(obj1);

      // Act & Assert
      expect(env.hasSeed(obj2)).toBe(false);
      expect(env.hasSeed(obj1)).toBe(true);
    });

    // T-10-011: Function object
    it('Given function added to seed, When checking hasSeed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const fn = () => {};
      env.seed.add(fn);

      // Act & Assert
      expect(env.hasSeed(fn)).toBe(true);
    });
  });
});

// ============================================================================
// Test Target: addSeed
// ============================================================================

describe('AGTFormatterEnvironment - addSeed', () => {
  // ==========================================================================
  // [正常系] Normal Cases - addSeed returns true on success
  // ==========================================================================

  describe('[正常系] - addSeed', () => {
    // T-11-001: Add single object returns true
    it('Given new environment, When adding object, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };

      // Act
      const result = env.addSeed(obj);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(obj)).toBe(true);
    });

    // T-11-002: Add multiple different objects returns true for each
    it('Given new environment, When adding multiple objects, Then each addSeed should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj1 = { name: 'first' };
      const obj2 = { name: 'second' };
      const obj3 = { name: 'third' };

      // Act & Assert
      expect(env.addSeed(obj1)).toBe(true);
      expect(env.addSeed(obj2)).toBe(true);
      expect(env.addSeed(obj3)).toBe(true);
      expect(env.hasSeed(obj1)).toBe(true);
      expect(env.hasSeed(obj2)).toBe(true);
      expect(env.hasSeed(obj3)).toBe(true);
    });

    // T-11-003: Add empty object returns true
    it('Given empty object, When adding to seed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = {};

      // Act
      const result = env.addSeed(obj);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(obj)).toBe(true);
    });

    // T-11-004: Add array returns true
    it('Given array object, When adding to seed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const arr = [1, 2, 3];

      // Act
      const result = env.addSeed(arr);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(arr)).toBe(true);
    });

    // T-11-005: Add function returns true
    it('Given function, When adding to seed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const myFunc = () => {};

      // Act
      const result = env.addSeed(myFunc);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(myFunc)).toBe(true);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases - addSeed returns false for invalid values
  // ==========================================================================

  describe('[異常系] - addSeed', () => {
    it.each([
      // T-12-001: null value
      { description: 'null value', value: null },
      // T-12-002: undefined value
      { description: 'undefined value', value: undefined },
      // T-12-003: Primitive values (string)
      { description: 'string primitive', value: 'test string' },
      // T-12-004: Primitive values (number)
      { description: 'number primitive', value: 456 },
      // T-12-005: Primitive values (boolean)
      { description: 'boolean primitive', value: false },
      // T-12-006: Symbol value
      { description: 'symbol primitive', value: Symbol('test') },
    ])('Given $description, When calling addSeed, Then should return false', ({ value }) => {
      // Arrange
      const env = new AGTFormatterEnvironment();

      // Act
      const result = env.addSeed(value as unknown as object);

      // Assert
      expect(result).toBe(false);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases - addSeed idempotent behavior
  // ==========================================================================

  describe('[エッジケース] - addSeed', () => {
    // T-12-007: Adding same object multiple times returns true each time (idempotent)
    it('Given object added twice, When adding again, Then should still return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };

      // Act
      const firstResult = env.addSeed(obj);
      const secondResult = env.addSeed(obj); // Add same object again

      // Assert
      expect(firstResult).toBe(true);
      expect(secondResult).toBe(true);
      expect(env.hasSeed(obj)).toBe(true);
    });

    // T-12-008: Add function object returns true
    it('Given function object, When adding to seed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const fn = (): string => 'test';

      // Act
      const result = env.addSeed(fn);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(fn)).toBe(true);
    });
  });
});

// ============================================================================
// Test Target: deleteSeed
// ============================================================================

describe('AGTFormatterEnvironment - deleteSeed', () => {
  // ==========================================================================
  // [正常系] Normal Cases - deleteSeed returns true on successful deletion
  // ==========================================================================

  describe('[正常系] - deleteSeed', () => {
    // T-13-001: Delete existing object returns true
    it('Given object in seed, When deleting, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };
      env.addSeed(obj);

      // Act
      const result = env.deleteSeed(obj);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(obj)).toBe(false);
    });

    // T-13-002: Delete non-existing object returns false
    it('Given object not in seed, When deleting, Then should return false', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'non-existing' };

      // Act
      const result = env.deleteSeed(obj);

      // Assert
      expect(result).toBe(false);
      expect(env.hasSeed(obj)).toBe(false);
    });

    // T-13-003: Delete one of multiple objects returns true
    it('Given multiple objects in seed, When deleting one, Then should return true and only remove that object', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj1 = { name: 'first' };
      const obj2 = { name: 'second' };
      env.addSeed(obj1);
      env.addSeed(obj2);

      // Act
      const result = env.deleteSeed(obj1);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(obj1)).toBe(false);
      expect(env.hasSeed(obj2)).toBe(true);
    });

    // T-13-004: Delete function object returns true
    it('Given function in seed, When deleting, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = () => {};
      env.addSeed(obj);

      // Act
      const result = env.deleteSeed(obj);

      // Assert
      expect(result).toBe(true);
      expect(env.hasSeed(obj)).toBe(false);
    });
  });

  // ==========================================================================
  // [異常系] Error Cases - deleteSeed returns false for invalid values
  // ==========================================================================

  describe('[異常系] - deleteSeed', () => {
    it.each([
      // T-14-001: null value
      { description: 'null value', value: null },
      // T-14-002: undefined value
      { description: 'undefined value', value: undefined },
      // T-14-003: Primitive values (string)
      { description: 'string primitive', value: 'test string' },
      // T-14-004: Primitive values (number)
      { description: 'number primitive', value: 789 },
      // T-14-005: Primitive values (boolean)
      { description: 'boolean primitive', value: true },
      // T-14-006: Symbol value
      { description: 'symbol primitive', value: Symbol('test') },
    ])('Given $description, When calling deleteSeed, Then should return false', ({ value }) => {
      // Arrange
      const env = new AGTFormatterEnvironment();

      // Act
      const result = env.deleteSeed(value as unknown as object);

      // Assert
      expect(result).toBe(false);
    });
  });

  // ==========================================================================
  // [エッジケース] Edge Cases - deleteSeed edge behaviors
  // ==========================================================================

  describe('[エッジケース] - deleteSeed', () => {
    // T-14-007: Delete same object twice returns true then false
    it('Given object deleted once, When deleting again, Then should return false', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };
      env.addSeed(obj);

      // Act
      const firstResult = env.deleteSeed(obj);
      const secondResult = env.deleteSeed(obj);

      // Assert
      expect(firstResult).toBe(true);
      expect(secondResult).toBe(false);
    });

    // T-14-008: Delete from empty seed returns false
    it('Given empty seed, When deleting object, Then should return false', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };

      // Act
      const result = env.deleteSeed(obj);

      // Assert
      expect(result).toBe(false);
    });

    // T-14-009: Add then delete then add again
    it('Given object added-deleted-added, When checking hasSeed, Then should return true', () => {
      // Arrange
      const env = new AGTFormatterEnvironment();
      const obj = { name: 'test' };

      // Act
      expect(env.addSeed(obj)).toBe(true);
      expect(env.deleteSeed(obj)).toBe(true);
      expect(env.addSeed(obj)).toBe(true);

      // Assert
      expect(env.hasSeed(obj)).toBe(true);
    });
  });
});
