// src: packages/@aglabo/agla-logger-utils/src/__tests__/unit/logValueComposer.spec.ts
// @(#) Unit tests for complex value composer functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _formatArray, _formatObject, _valueToString } from '../../logValueUtils.ts';

// Feature レベル (Given)
describe('Given: logValueComposer module', () => {
  // Scenario レベル (When) - Helper: _formatArray
  describe('When: _formatArray helper is called', () => {
    // Case レベル (Then) - [正常] Standard array formatting
    describe('Then: [正常] Standard array formatting', () => {
      it('Given empty array, When formatting, Then returns []', (): void => {
        // Arrange
        const input: unknown[] = [];
        const expected = '[]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given single element array, When formatting, Then returns [element]', (): void => {
        // Arrange
        const input = [1];
        const expected = '[1]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple elements array, When formatting, Then returns [el1, el2, ...]', (): void => {
        // Arrange
        const input = [1, 2, 3];
        const expected = '[1, 2, 3]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given nested arrays, When formatting, Then formats recursively', (): void => {
        // Arrange
        const input = [[1, 2], [3, 4]];
        const expected = '[[1, 2], [3, 4]]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [異常] Mixed type arrays
    describe('Then: [異常] Mixed type arrays', () => {
      it('Given mixed types array, When formatting, Then handles all types', (): void => {
        // Arrange
        const input: unknown[] = [1, 'text', true, null];
        const expected = '[1, "text", true, null]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [エッジケース] Circular references
    describe('Then: [エッジケース] Circular references', () => {
      it('Given circular reference to self, When formatting, Then shows [<Circular>]', (): void => {
        // Arrange
        const input: unknown[] = [1, 2];
        input.push(input);
        const expected = '[1, 2, [<Circular>]]';

        // Act
        const result = _formatArray(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given deeply nested circular reference, When formatting, Then detects and shows [<Circular>]', (): void => {
        // Arrange
        const inner: unknown[] = [2];
        const middle: unknown[] = [inner];
        const outer: unknown[] = [1, middle];
        inner.push(outer);
        const expected = '[1, [[2, [<Circular>]]]]';

        // Act
        const result = _formatArray(outer, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  // Scenario レベル (When) - Helper: _formatObject
  describe('When: _formatObject helper is called', () => {
    // Case レベル (Then) - [正常] Standard object formatting
    describe('Then: [正常] Standard object formatting', () => {
      it('Given empty object, When formatting, Then returns {}', (): void => {
        // Arrange
        const input: Record<string, unknown> = {};
        const expected = '{}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given single property object, When formatting, Then returns {"key": value}', (): void => {
        // Arrange
        const input = { name: 'John' };
        const expected = '{"name": "John"}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple properties object, When formatting, Then returns formatted key-value pairs', (): void => {
        // Arrange
        const input = { name: 'John', age: 30 };
        const expected = '{"name": "John", "age": 30}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given nested object, When formatting, Then formats recursively', (): void => {
        // Arrange
        const input = { person: { name: 'John', age: 30 } };
        const expected = '{"person": {"name": "John", "age": 30}}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [異常] Mixed type object values
    describe('Then: [異常] Mixed type object values', () => {
      it('Given object with mixed primitive types, When formatting, Then handles all types', (): void => {
        // Arrange
        const input: Record<string, unknown> = {
          str: 'text',
          num: 42,
          bool: true,
          nil: null,
        };
        const expected = '{"str": "text", "num": 42, "bool": true, "nil": null}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with array value, When formatting, Then formats array correctly', (): void => {
        // Arrange
        const input = { items: [1, 2, 3] };
        const expected = '{"items": [1, 2, 3]}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with undefined value, When formatting, Then shows undefined', (): void => {
        // Arrange
        const input: Record<string, unknown> = { value: undefined };
        const expected = '{"value": undefined}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with NaN value, When formatting, Then shows NaN', (): void => {
        // Arrange
        const input: Record<string, unknown> = { value: NaN };
        const expected = '{"value": NaN}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with Infinity value, When formatting, Then shows Infinity', (): void => {
        // Arrange
        const input: Record<string, unknown> = { pos: Infinity, neg: -Infinity };
        const expected = '{"pos": Infinity, "neg": -Infinity}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [エッジケース] Circular references
    describe('Then: [エッジケース] Circular references', () => {
      it('Given circular reference to self, When formatting, Then shows {<Circular>}', (): void => {
        // Arrange
        const input: Record<string, unknown> = { name: 'obj' };
        input.self = input;
        const expected = '{"name": "obj", "self": {<Circular>}}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given deeply nested circular reference, When formatting, Then detects and shows {<Circular>}', (): void => {
        // Arrange
        const inner: Record<string, unknown> = { value: 42 };
        const outer: Record<string, unknown> = { inner };
        inner.outer = outer;
        const expected = '{"inner": {"value": 42, "outer": {<Circular>}}}';

        // Act
        const result = _formatObject(outer, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given two-level mutual circular reference, When formatting, Then detects circular refs', (): void => {
        // Arrange
        const obj1: Record<string, unknown> = { name: 'obj1' };
        const obj2: Record<string, unknown> = { name: 'obj2' };
        obj1.ref = obj2;
        obj2.ref = obj1;
        const expected = '{"name": "obj1", "ref": {"name": "obj2", "ref": {<Circular>}}}';

        // Act
        const result = _formatObject(obj1, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [エッジケース] Special keys and values
    describe('Then: [エッジケース] Special keys and values', () => {
      it('Given object with numeric string key, When formatting, Then formats correctly', (): void => {
        // Arrange
        const input: Record<string, unknown> = { '123': 'numeric key' };
        const expected = '{"123": "numeric key"}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with special characters in key, When formatting, Then formats key as-is', (): void => {
        // Arrange
        const input: Record<string, unknown> = { 'key-name': 'value', 'key.name': 'value' };
        const result = _formatObject(input, new WeakSet());

        // Act & Assert: Check that both keys are present and properly formatted
        expect(result).toContain('"key-name": "value"');
        expect(result).toContain('"key.name": "value"');
      });

      it('Given object with function value, When formatting, Then formats function correctly', (): void => {
        // Arrange
        const input = { callback: function namedFunc(): void { } };

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toContain('"callback":');
        expect(result).toContain('Function');
      });

      it('Given object with empty string key, When formatting, Then formats empty key', (): void => {
        // Arrange
        const input: Record<string, unknown> = { '': 'empty key' };
        const expected = '{"": "empty key"}';

        // Act
        const result = _formatObject(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  // Scenario レベル (When) - Helper: _valueToString
  describe('When: _valueToString helper is called', () => {
    // Case レベル (Then) - [正常] Primitive values conversion
    describe('Then: [正常] Primitive values conversion', () => {
      it('Given string value, When converting, Then returns escaped string', () => {
        // Arrange
        const input = 'hello world';
        const expected = '"hello world"';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given boolean true, When converting, Then returns "true"', () => {
        // Arrange
        const input = true;
        const expected = 'true';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given boolean false, When converting, Then returns "false"', () => {
        // Arrange
        const input = false;
        const expected = 'false';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given regular number, When converting, Then returns number string', () => {
        // Arrange
        const input = 42;
        const expected = '42';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given symbol, When converting, Then returns symbol string', () => {
        // Arrange
        const input = Symbol('test');
        const expected = input.toString();

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [正常] Special number values
    describe('Then: [正常] Special number values', () => {
      it('Given NaN, When converting, Then returns "NaN"', () => {
        // Arrange
        const input = NaN;
        const expected = 'NaN';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given positive Infinity, When converting, Then returns "Infinity"', () => {
        // Arrange
        const input = Infinity;
        const expected = 'Infinity';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given negative Infinity, When converting, Then returns "-Infinity"', () => {
        // Arrange
        const input = -Infinity;
        const expected = '-Infinity';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [正常] Null and undefined
    describe('Then: [正常] Null and undefined', () => {
      it('Given null, When converting, Then returns "null"', () => {
        // Arrange
        const input = null;
        const expected = 'null';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given undefined, When converting, Then returns "undefined"', () => {
        // Arrange
        const input = undefined;
        const expected = 'undefined';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [正常] Complex types
    describe('Then: [正常] Complex types', () => {
      it('Given array, When converting, Then returns formatted array', () => {
        // Arrange
        const input: unknown[] = [1, 2, 3];
        const expected = '[1, 2, 3]';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given empty array, When converting, Then returns "[]"', () => {
        // Arrange
        const input: unknown[] = [];
        const expected = '[]';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given function, When converting, Then returns formatted function', () => {
        // Arrange
        const input = function namedFunc(): void { };

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toMatch(/\[Function:/);
        expect(result).toContain('namedFunc');
      });

      it('Given plain object, When converting, Then returns formatted object', () => {
        // Arrange
        const input = { key: 'value' };
        const expected = '{"key": "value"}';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [正常] Mixed types in arrays
    describe('Then: [正常] Mixed types in arrays', () => {
      it('Given array with mixed primitives, When converting, Then handles all types', () => {
        // Arrange
        const input: unknown[] = [42, 'hello', true, null, undefined];
        const expected = '[42, "hello", true, null, undefined]';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given array with NaN and Infinity, When converting, Then handles special numbers', () => {
        // Arrange
        const input: unknown[] = [NaN, Infinity, -Infinity];
        const expected = '[NaN, Infinity, -Infinity]';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });

      it('Given nested array, When converting, Then formats recursively', () => {
        // Arrange
        const input: unknown[] = [1, [2, [3]]];
        const expected = '[1, [2, [3]]]';

        // Act
        const result = _valueToString(input, new WeakSet());

        // Assert
        expect(result).toBe(expected);
      });
    });
  });
});
