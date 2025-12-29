// src: packages/@aglabo/agla-logger-composer/src/helpers/value-domain/__tests__/unit/isValueFunction.spec.ts
// @(#) Unit tests for isValueFunction - AGTValueCategory classification functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';

import { _isAtomic, _isCollection, _isDefinedData, _isSingleValue } from '../../isValueFunction.ts';

// =============================================================================
// Shared Test Data: JSON Typed Objects
// =============================================================================

/**
 * TD_JSON_TYPED_OBJECTS - Objects with Object.prototype as direct prototype
 * Used across _isCollection and _isDefinedData tests
 */
const TD_JSON_TYPED_OBJECTS = {
  empty: {},
  withData: { a: 1, b: 2 },
  nested: { nested: { val: 1 } },
  withArray: { arr: [1, 2] },
  fromAssign: Object.assign({}, { x: 2 }),
  frozen: Object.freeze({ a: 1 }),
  sealed: Object.seal({ a: 1 }),
};

type TD_JsonTypedObjectKey = keyof typeof TD_JSON_TYPED_OBJECTS;

/**
 * TD_ARRAYS - Various array types
 * Used across _isCollection and _isDefinedData tests
 */
const TD_ARRAYS = {
  empty: [],
  numeric: [1, 2, 3],
  string: ['a', 'b'],
  nested: [{}, [], null],
  constructor: new Array(5),
};

type TD_ArrayKey = keyof typeof TD_ARRAYS;

/**
 * TD_DATES - Various Date types and date-like values
 * Used across _isSingleValue and _isDefinedData tests
 */
const TD_DATES = {
  // Valid Date instances (for _isSingleValue positive tests)
  standard: new Date(),
  epoch: new Date(0),
  specific: new Date('2025-12-27'),
  invalid: new Date('invalid'),
  fromNow: new Date(Date.now()),

  // Non-Date values (for negative tests)
  dateNow: Date.now(),
  dateStringResult: Date(),
  duckType: { getTime: () => Date.now() },
};

type TD_DateKey = keyof typeof TD_DATES;

// =============================================================================
// _isAtomic Tests
// =============================================================================

/**
 * _isAtomic Atomic Value Classification Tests
 *
 * Tests atomic value detection for all primitive types including
 * string, number, boolean, symbol, bigint, null, and undefined.
 */
describe('Given _isAtomic function', () => {
  /**
   * Primitive Type Classification Tests
   *
   * Tests atomic value classification covering all primitive types
   * that should return true for _isAtomic.
   */
  describe('[正常系] When checking atomic primitive types', () => {
    it.each([
      { typeName: 'string', taskId: 'T-01-01-01', values: ['hello', '', `template`] },
      { typeName: 'number', taskId: 'T-01-01-02', values: [42, -3.14, 0] },
      { typeName: 'boolean', taskId: 'T-01-01-03', values: [true, false] },
      { typeName: 'symbol', taskId: 'T-01-01-04', values: [Symbol(), Symbol('name')] },
      { typeName: 'bigint', taskId: 'T-01-01-05', values: [100n, -50n, 0n] },
      { typeName: 'null', taskId: 'T-01-01-06', values: [null] },
      { typeName: 'undefined', taskId: 'T-01-01-07', values: [undefined] },
    ])('Then $typeName values should return true ($taskId)', ({ values }) => {
      values.forEach((value) => {
        expect(_isAtomic(value)).toBe(true);
      });
    });
  });

  /**
   * Non-Atomic Value Exclusion Tests
   *
   * Tests that non-atomic values (objects, arrays, functions) are correctly
   * classified as non-atomic and return false.
   */
  describe('[異常系] When checking non-atomic values', () => {
    it.each([
      { typeName: 'object', taskId: 'T-01-02-01', values: [{}, { a: 1 }] },
      { typeName: 'array', taskId: 'T-01-02-02', values: [[], [1, 2, 3]] },
      { typeName: 'Date', taskId: 'T-01-02-03', values: [TD_DATES.standard] },
      { typeName: 'function', taskId: 'T-01-02-04', values: [function() {}, () => {}] },
    ])('Then $typeName values should return false ($taskId)', ({ values }) => {
      values.forEach((value) => {
        expect(_isAtomic(value)).toBe(false);
      });
    });

    // T-01-02-05: クラス (special case)
    it('Then class instances should return false (T-01-02-05)', () => {
      class Foo {}
      expect(_isAtomic(Foo)).toBe(false);
      expect(_isAtomic(new Foo())).toBe(false);
    });
  });

  /**
   * Special Numeric Values Tests
   *
   * Tests that special numeric values like NaN and Infinity are correctly
   * classified as atomic since they are of type 'number'.
   */
  describe('[エッジケース] When checking special numeric values', () => {
    it.each([
      { typeName: 'NaN', taskId: 'T-01-03-01', values: [NaN] },
      { typeName: 'Infinity', taskId: 'T-01-03-02', values: [Infinity] },
      { typeName: '-Infinity', taskId: 'T-01-03-03', values: [-Infinity] },
      { typeName: 'negative zero', taskId: 'T-01-03-04', values: [-0] },
      { typeName: 'empty string', taskId: 'T-01-03-05', values: [''] },
    ])('Then $typeName should return true ($taskId)', ({ values }) => {
      values.forEach((value) => {
        expect(_isAtomic(value)).toBe(true);
      });
    });
  });
});

// =============================================================================
// _isSingleValue Tests
// =============================================================================

/**
 * _isSingleValue Single Value Type Classification Tests
 *
 * Tests single-value type detection for Date instances.
 */
describe('Given _isSingleValue function', () => {
  /**
   * Date Instance Detection Tests
   *
   * Tests Date instance classification covering standard Date objects,
   * specific dates, and Date objects created from timestamps.
   */
  describe('[正常系] When checking Date instances', () => {
    it.each([
      { key: 'standard', typeName: 'standard Date', taskId: 'T-02-01-01' },
      { key: 'specific', typeName: 'specific date', taskId: 'T-02-01-02' },
      { key: 'epoch', typeName: 'timestamp Date', taskId: 'T-02-01-03' },
    ])('Then $typeName should return true ($taskId)', ({ key }) => {
      expect(_isSingleValue(TD_DATES[key as TD_DateKey])).toBe(true);
    });
  });

  /**
   * Non-Date Value Exclusion Tests
   *
   * Tests that non-Date values (numbers, strings, objects, null, undefined)
   * are correctly classified as non-Date and return false.
   */
  describe('[異常系] When checking non-Date values', () => {
    it.each([
      { key: 'dateNow', description: 'Date.now() result', taskId: 'T-02-02-01' },
      { key: 'dateStringResult', description: 'Date() function result', taskId: 'T-02-02-02' },
      { value: {}, description: 'object', taskId: 'T-02-02-03' },
      { value: null, description: 'null', taskId: 'T-02-02-04' },
      { value: undefined, description: 'undefined', taskId: 'T-02-02-04' },
    ])('Then $description should return false ($taskId)', ({ key, value }) => {
      const testValue = key !== undefined ? TD_DATES[key as TD_DateKey] : value;
      expect(_isSingleValue(testValue)).toBe(false);
    });
  });

  /**
   * Duck-typed Date Exclusion Tests
   *
   * Tests that duck-typed Date objects (objects with getTime method)
   * are correctly excluded and return false.
   */
  describe('[エッジケース] When checking duck-typed Date objects', () => {
    it.each([
      {
        key: 'duckType',
        description: 'object with getTime method',
        taskId: 'T-02-03-01',
      },
    ])('Then $description should return false ($taskId)', ({ key }) => {
      expect(_isSingleValue(TD_DATES[key as TD_DateKey])).toBe(false);
    });
  });
});

// =============================================================================
// _isCollection Tests
// =============================================================================

/**
 * _isCollection Collection Type Classification Tests
 *
 * Tests collection type detection for arrays and plain objects.
 */
describe('Given _isCollection function', () => {
  /**
   * Array Detection Tests
   *
   * Tests array classification covering empty arrays, typed arrays,
   * nested arrays, and arrays created from constructors.
   */
  describe('[正常系] When checking array types', () => {
    it.each([
      { value: [], description: 'empty array', taskId: 'T-03-01-01' },
      { value: [1, 2, 3], description: 'numeric array', taskId: 'T-03-01-02' },
      { value: ['a', 'b'], description: 'string array', taskId: 'T-03-01-03' },
      { value: [{}, [], null], description: 'nested array', taskId: 'T-03-01-04' },
      { value: new Array(5), description: 'Array constructor array', taskId: 'T-03-01-05' },
    ])('Then $description should return true ($taskId)', ({ value }) => {
      expect(_isCollection(value)).toBe(true);
    });
  });

  /**
   * Non-Date Value Exclusion Tests
   *
   * Tests that non-Date values (numbers, strings, objects, null, undefined)
   * are correctly classified as non-Date and return false.
   */
  describe('[異常系] When checking non-Date values', () => {
    it.each([
      { value: Date.now(), description: 'Date.now() result', taskId: 'T-02-02-01' },
      { value: Date(), description: 'Date() function result', taskId: 'T-02-02-02' },
      { value: {}, description: 'object', taskId: 'T-02-02-03' },
      { value: null, description: 'null', taskId: 'T-02-02-04' },
      { value: undefined, description: 'undefined', taskId: 'T-02-02-04' },
    ])('Then $description should return false ($taskId)', ({ value }) => {
      expect(_isSingleValue(value)).toBe(false);
    });
  });

  /**
   * JSON Typed Object Detection Tests
   *
   * Tests JSON typed object type classification covering empty objects
   * and objects with properties.
   */
  describe('[正常系] When checking json typed object types', () => {
    it.each([
      { value: {}, description: 'empty object', taskId: 'T-03-02-01' },
      { value: { a: 1, b: 2 }, description: 'object with data', taskId: 'T-03-02-02' },
      { value: { nested: { val: 1 } }, description: 'nested object', taskId: 'T-03-02-03' },
      { value: { arr: [1, 2] }, description: 'object with array', taskId: 'T-03-02-04' },
    ])('Then $description should return true ($taskId)', ({ value }) => {
      expect(_isCollection(value)).toBe(true);
    });
  });

  /**
   * Non-Collection Value Exclusion Tests
   *
   * Tests that non-collection values (null, undefined, built-in objects)
   * are correctly classified as non-collections and return false.
   */
  describe('[異常系] When checking non-collection values', () => {
    it.each([
      { value: null, description: 'null', taskId: 'T-03-03-01' },
      { value: undefined, description: 'undefined', taskId: 'T-03-03-01' },
      { key: 'standard', description: 'Date', taskId: 'T-03-03-02' },
      { value: /regex/, description: 'RegExp', taskId: 'T-03-03-03' },
      { value: new Map(), description: 'Map', taskId: 'T-03-03-03' },
      { value: new Set(), description: 'Set', taskId: 'T-03-03-03' },
      { value: new Error(), description: 'Error', taskId: 'T-03-03-03' },
      { value: Promise.resolve(), description: 'Promise', taskId: 'T-03-03-03' },
      { value: function() {}, description: 'function', taskId: 'T-03-03-04' },
      { value: () => {}, description: 'arrow function', taskId: 'T-03-03-04' },
    ])('Then $description should return false ($taskId)', ({ key, value }) => {
      const testValue = key !== undefined ? TD_DATES[key as TD_DateKey] : value;
      expect(_isCollection(testValue)).toBe(false);
    });

    it('Then class instance should return false (T-03-03-05)', () => {
      class CustomClass {}
      const instance = new CustomClass();
      expect(_isCollection(instance)).toBe(false);
    });
  });

  /**
   * Frozen/Sealed Object Tests
   *
   * Tests that frozen and sealed plain objects are still classified
   * as collections since their constructor remains Object.
   */
  describe('[エッジケース] When checking frozen/sealed objects', () => {
    it.each([
      { key: 'frozen', description: 'frozen object', taskId: 'T-03-04-01' },
      { key: 'sealed', description: 'sealed object', taskId: 'T-03-04-02' },
    ])('Then $description should return true ($taskId)', ({ key }) => {
      expect(_isCollection(TD_JSON_TYPED_OBJECTS[key as TD_JsonTypedObjectKey])).toBe(true);
    });
  });
});

// =============================================================================
// _isDefinedData Tests
// =============================================================================

/**
 * _isDefinedData Defined Data Type Classification Tests
 *
 * Tests defined data (plain objects) detection for data containers.
 */
describe('Given _isDefinedData function', () => {
  /**
   * JSON Typed Object (DefinedData) Detection Tests
   *
   * Tests JSON typed object classification covering empty objects,
   * objects with properties, and various construction methods.
   */
  describe('[正常系] When checking JSON typed objects', () => {
    it.each([
      { key: 'empty', description: 'empty object', taskId: 'T-04-01-01' },
      { key: 'withData', description: 'object with data', taskId: 'T-04-01-02' },
      { key: 'fromAssign', description: 'Object.assign generated object', taskId: 'T-04-01-03' },
    ])('Then $description should return true ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_JSON_TYPED_OBJECTS[key as TD_JsonTypedObjectKey])).toBe(true);
    });
  });

  /**
   * Array Non-DefinedData Detection Tests
   *
   * Tests that arrays are correctly identified as NOT DefinedData
   * since arrays are Collections, not DefinedData (plain objects).
   */
  describe('[異常系] When checking arrays (T-04-02-01)', () => {
    it.each([
      { key: 'empty', description: 'empty array', taskId: 'T-04-02-01-01' },
      { key: 'numeric', description: 'numeric array', taskId: 'T-04-02-01-02' },
      { key: 'string', description: 'string array', taskId: 'T-04-02-01-03' },
      { key: 'nested', description: 'nested array', taskId: 'T-04-02-01-04' },
      { key: 'constructor', description: 'Array constructor array', taskId: 'T-04-02-01-05' },
    ])('Given $description, When _isDefinedData is called, Then should return false ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_ARRAYS[key as TD_ArrayKey])).toBe(false);
    });
  });

  /**
   * Date Instance Non-DefinedData Detection Tests
   *
   * Tests that Date instances are correctly identified as NOT DefinedData
   * since Date objects have a different prototype chain than plain objects.
   */
  describe('[異常系] When checking Date instances (T-04-02-02)', () => {
    it.each([
      { key: 'standard', description: 'new Date()', taskId: 'T-04-02-02-01' },
      { key: 'specific', description: 'new Date("2025-12-27")', taskId: 'T-04-02-02-02' },
      { key: 'epoch', description: 'new Date(0)', taskId: 'T-04-02-02-03' },
      { key: 'fromNow', description: 'new Date(Date.now())', taskId: 'T-04-02-02-04' },
      { key: 'invalid', description: 'new Date("invalid")', taskId: 'T-04-02-02-05' },
    ])('Given $description, When _isDefinedData is called, Then should return false ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_DATES[key as TD_DateKey])).toBe(false);
    });
  });

  /**
   * Class Instance Non-DefinedData Detection Tests
   *
   * Tests that class instances are correctly identified as NOT DefinedData
   * since class instances have a different prototype chain than plain objects
   * (constructor !== Object).
   */
  describe('[異常系] When checking class instances (T-04-02-03)', () => {
    it('Given user-defined class instance, When _isDefinedData is called, Then should return false (T-04-02-03-01)', () => {
      class CustomClass {}
      const instance = new CustomClass();
      expect(_isDefinedData(instance)).toBe(false);
    });

    it('Given another user-defined class instance, When _isDefinedData is called, Then should return false (T-04-02-03-02)', () => {
      class AnotherClass {
        constructor(public value: number) {}
      }
      const instance = new AnotherClass(42);
      expect(_isDefinedData(instance)).toBe(false);
    });
  });

  /**
   * Function Non-DefinedData Detection Tests
   *
   * Tests that function objects are correctly identified as NOT DefinedData
   * since functions are not plain objects.
   */
  describe('[異常系] When checking functions (T-04-02-04)', () => {
    it('Given function() {} declaration, When _isDefinedData is called, Then should return false (T-04-02-04-01)', () => {
      expect(_isDefinedData(function() {})).toBe(false);
    });

    it('Given arrow function () => {}, When _isDefinedData is called, Then should return false (T-04-02-04-02)', () => {
      expect(_isDefinedData(() => {})).toBe(false);
    });

    it('Then sealed plain object should return true (T-03-04-02)', () => {
      const sealedObj = Object.seal({ a: 1 });
      expect(_isCollection(sealedObj)).toBe(true);
    });
  });
});

// =============================================================================
// _isSingleValue Tests
// =============================================================================

/**
 * _isSingleValue Single Value Type Classification Tests
 *
 * Tests single-value type detection for Date instances.
 */
describe('Given _isSingleValue function', () => {
  /**
   * Date Instance Detection Tests
   *
   * Tests Date instance classification covering standard Date objects,
   * specific dates, and Date objects created from timestamps.
   */
  describe('[正常系] When checking Date instances', () => {
    it.each([
      { key: 'standard', typeName: 'standard Date', taskId: 'T-02-01-01' },
      { key: 'specific', typeName: 'specific date', taskId: 'T-02-01-02' },
      { key: 'epoch', typeName: 'timestamp Date', taskId: 'T-02-01-03' },
    ])('Then $typeName should return true ($taskId)', ({ key }) => {
      expect(_isSingleValue(TD_DATES[key as TD_DateKey])).toBe(true);
    });
  });

  /**
   * Non-Date Value Exclusion Tests
   *
   * Tests that non-Date values (numbers, strings, objects, null, undefined)
   * are correctly classified as non-Date and return false.
   */
  describe('[異常系] When checking non-Date values', () => {
    it.each([
      { key: 'dateNow', description: 'Date.now() result', taskId: 'T-02-02-01' },
      { key: 'dateStringResult', description: 'Date() function result', taskId: 'T-02-02-02' },
      { value: {}, description: 'object', taskId: 'T-02-02-03' },
      { value: null, description: 'null', taskId: 'T-02-02-04' },
      { value: undefined, description: 'undefined', taskId: 'T-02-02-04' },
    ])('Then $description should return false ($taskId)', ({ key, value }) => {
      const testValue = key !== undefined ? TD_DATES[key as TD_DateKey] : value;
      expect(_isSingleValue(testValue)).toBe(false);
    });
  });

  /**
   * Duck-typed Date Exclusion Tests
   *
   * Tests that duck-typed Date objects (objects with getTime method)
   * are correctly excluded and return false.
   */
  describe('[エッジケース] When checking duck-typed Date objects', () => {
    it.each([
      {
        key: 'duckType',
        description: 'object with getTime method',
        taskId: 'T-02-03-01',
      },
    ])('Then $description should return false ($taskId)', ({ key }) => {
      expect(_isSingleValue(TD_DATES[key as TD_DateKey])).toBe(false);
    });
  });
});

// =============================================================================
// _isCollection Tests
// =============================================================================

/**
 * _isCollection Collection Type Classification Tests
 *
 * Tests collection type detection for arrays and plain objects.
 */
describe('Given _isCollection function', () => {
  /**
   * Array Detection Tests
   *
   * Tests array classification covering empty arrays, typed arrays,
   * nested arrays, and arrays created from constructors.
   */
  describe('[正常系] When checking array types', () => {
    it.each([
      { value: [], description: 'empty array', taskId: 'T-03-01-01' },
      { value: [1, 2, 3], description: 'numeric array', taskId: 'T-03-01-02' },
      { value: ['a', 'b'], description: 'string array', taskId: 'T-03-01-03' },
      { value: [{}, [], null], description: 'nested array', taskId: 'T-03-01-04' },
      { value: new Array(5), description: 'Array constructor array', taskId: 'T-03-01-05' },
    ])('Then $description should return true ($taskId)', ({ value }) => {
      expect(_isCollection(value)).toBe(true);
    });
  });

  /**
   * Non-Date Value Exclusion Tests
   *
   * Tests that non-Date values (numbers, strings, objects, null, undefined)
   * are correctly classified as non-Date and return false.
   */
  describe('[異常系] When checking non-Date values', () => {
    it.each([
      { value: Date.now(), description: 'Date.now() result', taskId: 'T-02-02-01' },
      { value: Date(), description: 'Date() function result', taskId: 'T-02-02-02' },
      { value: {}, description: 'object', taskId: 'T-02-02-03' },
      { value: null, description: 'null', taskId: 'T-02-02-04' },
      { value: undefined, description: 'undefined', taskId: 'T-02-02-04' },
    ])('Then $description should return false ($taskId)', ({ value }) => {
      expect(_isSingleValue(value)).toBe(false);
    });
  });

  /**
   * Duck-typed Date Exclusion Tests
   *
   * Tests that non-collection values (null, undefined, built-in objects)
   * are correctly classified as non-collections and return false.
   */
  describe('[異常系] When checking non-collection values', () => {
    it.each([
      { value: null, description: 'null', taskId: 'T-03-03-01' },
      { value: undefined, description: 'undefined', taskId: 'T-03-03-01' },
      { key: 'standard', description: 'Date', taskId: 'T-03-03-02' },
      { value: /regex/, description: 'RegExp', taskId: 'T-03-03-03' },
      { value: new Map(), description: 'Map', taskId: 'T-03-03-03' },
      { value: new Set(), description: 'Set', taskId: 'T-03-03-03' },
      { value: new Error(), description: 'Error', taskId: 'T-03-03-03' },
      { value: Promise.resolve(), description: 'Promise', taskId: 'T-03-03-03' },
      { value: function() {}, description: 'function', taskId: 'T-03-03-04' },
      { value: () => {}, description: 'arrow function', taskId: 'T-03-03-04' },
    ])('Then $description should return false ($taskId)', ({ key, value }) => {
      const testValue = key !== undefined ? TD_DATES[key as TD_DateKey] : value;
      expect(_isCollection(testValue)).toBe(false);
    });

    it('Then class instance should return false (T-03-03-05)', () => {
      class CustomClass {}
      const instance = new CustomClass();
      expect(_isCollection(instance)).toBe(false);
    });
  });

  /**
   * Frozen/Sealed Object Tests
   *
   * Tests that frozen and sealed plain objects are still classified
   * as collections since their constructor remains Object.
   */
  describe('[エッジケース] When checking frozen/sealed objects', () => {
    it.each([
      { key: 'frozen', description: 'frozen object', taskId: 'T-03-04-01' },
      { key: 'sealed', description: 'sealed object', taskId: 'T-03-04-02' },
    ])('Then $description should return true ($taskId)', ({ key }) => {
      expect(_isCollection(TD_JSON_TYPED_OBJECTS[key as TD_JsonTypedObjectKey])).toBe(true);
    });
  });
});

// =============================================================================
// _isDefinedData Tests
// =============================================================================

/**
 * _isDefinedData Defined Data Type Classification Tests
 *
 * Tests defined data (plain objects) detection for data containers.
 */
describe('Given _isDefinedData function', () => {
  /**
   * JSON Typed Object (DefinedData) Detection Tests
   *
   * Tests JSON typed object classification covering empty objects,
   * objects with properties, and various construction methods.
   */
  describe('[正常系] When checking JSON typed objects', () => {
    it.each([
      { key: 'empty', description: 'empty object', taskId: 'T-04-01-01' },
      { key: 'withData', description: 'object with data', taskId: 'T-04-01-02' },
      { key: 'fromAssign', description: 'Object.assign generated object', taskId: 'T-04-01-03' },
    ])('Then $description should return true ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_JSON_TYPED_OBJECTS[key as TD_JsonTypedObjectKey])).toBe(true);
    });
  });

  /**
   * Array Non-DefinedData Detection Tests
   *
   * Tests that arrays are correctly identified as NOT DefinedData
   * since arrays are Collections, not DefinedData (plain objects).
   */
  describe('[異常系] When checking arrays (T-04-02-01)', () => {
    it.each([
      { key: 'empty', description: 'empty array', taskId: 'T-04-02-01-01' },
      { key: 'numeric', description: 'numeric array', taskId: 'T-04-02-01-02' },
      { key: 'string', description: 'string array', taskId: 'T-04-02-01-03' },
      { key: 'nested', description: 'nested array', taskId: 'T-04-02-01-04' },
      { key: 'constructor', description: 'Array constructor array', taskId: 'T-04-02-01-05' },
    ])('Given $description, When _isDefinedData is called, Then should return false ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_ARRAYS[key as TD_ArrayKey])).toBe(false);
    });
  });

  /**
   * Date Instance Non-DefinedData Detection Tests
   *
   * Tests that Date instances are correctly identified as NOT DefinedData
   * since Date objects have a different prototype chain than plain objects.
   */
  describe('[異常系] When checking Date instances (T-04-02-02)', () => {
    it.each([
      { key: 'standard', description: 'new Date()', taskId: 'T-04-02-02-01' },
      { key: 'specific', description: 'new Date("2025-12-27")', taskId: 'T-04-02-02-02' },
      { key: 'epoch', description: 'new Date(0)', taskId: 'T-04-02-02-03' },
      { key: 'fromNow', description: 'new Date(Date.now())', taskId: 'T-04-02-02-04' },
      { key: 'invalid', description: 'new Date("invalid")', taskId: 'T-04-02-02-05' },
    ])('Given $description, When _isDefinedData is called, Then should return false ($taskId)', ({ key }) => {
      expect(_isDefinedData(TD_DATES[key as TD_DateKey])).toBe(false);
    });
  });

  /**
   * Class Instance Non-DefinedData Detection Tests
   *
   * Tests that class instances are correctly identified as NOT DefinedData
   * since class instances have a different prototype chain than plain objects
   * (constructor !== Object).
   */
  describe('[異常系] When checking class instances (T-04-02-03)', () => {
    it('Given user-defined class instance, When _isDefinedData is called, Then should return false (T-04-02-03-01)', () => {
      class CustomClass {}
      const instance = new CustomClass();
      expect(_isDefinedData(instance)).toBe(false);
    });

    it('Given another user-defined class instance, When _isDefinedData is called, Then should return false (T-04-02-03-02)', () => {
      class AnotherClass {
        constructor(public value: number) {}
      }
      const instance = new AnotherClass(42);
      expect(_isDefinedData(instance)).toBe(false);
    });
  });

  /**
   * Function Non-DefinedData Detection Tests
   *
   * Tests that function objects are correctly identified as NOT DefinedData
   * since functions are not plain objects.
   */
  describe('[異常系] When checking functions (T-04-02-04)', () => {
    it('Given function() {} declaration, When _isDefinedData is called, Then should return false (T-04-02-04-01)', () => {
      expect(_isDefinedData(function() {})).toBe(false);
    });

    it('Given arrow function () => {}, When _isDefinedData is called, Then should return false (T-04-02-04-02)', () => {
      expect(_isDefinedData(() => {})).toBe(false);
    });

    it('Then sealed plain object should return true (T-03-04-02)', () => {
      const sealedObj = Object.seal({ a: 1 });
      expect(_isCollection(sealedObj)).toBe(true);
    });
  });
});
