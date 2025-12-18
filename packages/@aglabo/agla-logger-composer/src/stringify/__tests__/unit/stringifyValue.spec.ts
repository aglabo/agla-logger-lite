// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/stringifyValue.spec.ts
// @(#) Unit tests for value to string conversion
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _stringifyValue } from '../../stringifyValue.ts';

describe('Given: stringifyValue module', () => {
  describe('When: _stringifyValue is called', () => {
    describe('Then: [正常] Primitive string values', () => {
      it('Given string "hello", When called, Then return escaped string', () => {
        // Arrange
        const value = 'hello';
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('"hello"');
      });

      it('Given empty string, When called, Then return empty quoted string', () => {
        // Arrange
        const value = '';
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('""');
      });

      it('Given string with special chars, When called, Then escape properly', () => {
        // Arrange
        const value = 'line1\nline2';
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('"line1\\nline2"');
      });
    });

    describe('Then: [正常] Number values', () => {
      it('Given number 42, When called, Then return string representation', () => {
        // Arrange
        const value = 42;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('42');
      });

      it('Given float 3.14, When called, Then return string representation', () => {
        // Arrange
        const value = 3.14;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('3.14');
      });

      it('Given zero 0, When called, Then return "0"', () => {
        // Arrange
        const value = 0;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('0');
      });

      it('Given negative number -42, When called, Then return string representation', () => {
        // Arrange
        const value = -42;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('-42');
      });
    });

    describe('Then: [正常] Special number values', () => {
      it('Given NaN, When called, Then return "NaN"', () => {
        // Arrange
        const value = Number.NaN;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('NaN');
      });

      it('Given Infinity, When called, Then return "Infinity"', () => {
        // Arrange
        const value = Number.POSITIVE_INFINITY;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('Infinity');
      });

      it('Given -Infinity, When called, Then return "-Infinity"', () => {
        // Arrange
        const value = Number.NEGATIVE_INFINITY;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('-Infinity');
      });
    });

    describe('Then: [正常] Boolean values', () => {
      it('Given true, When called, Then return "true"', () => {
        // Arrange
        const value = true;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('true');
      });

      it('Given false, When called, Then return "false"', () => {
        // Arrange
        const value = false;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('false');
      });
    });

    describe('Then: [正常] Null and undefined', () => {
      it('Given null, When called, Then return "null"', () => {
        // Arrange
        const value = null;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('null');
      });

      it('Given undefined, When called, Then return "undefined"', () => {
        // Arrange
        const value = undefined;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('undefined');
      });
    });

    describe('Then: [正常] Function values', () => {
      it('Given named function, When called, Then format function with brackets', () => {
        // Arrange
        const value = function test(): void {};
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[Function: test]');
      });

      it('Given arrow function, When called, Then format function with brackets', () => {
        // Arrange
        const value = (): void => {};
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[Function:]');
      });

      it('Given method, When called, Then format method with brackets', () => {
        // Arrange
        const obj = { myMethod() {} };
        const value = obj.myMethod;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[Method: myMethod]');
      });
    });

    describe('Then: [正常] Array values', () => {
      it('Given empty array, When called, Then return "[]"', () => {
        // Arrange
        const value: unknown[] = [];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[]');
      });

      it('Given simple array [1, 2, 3], When called, Then return formatted array', () => {
        // Arrange
        const value = [1, 2, 3];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[1, 2, 3]');
      });

      it('Given array with strings, When called, Then escape strings and format array', () => {
        // Arrange
        const value = ['a', 'b'];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('["a", "b"]');
      });

      it('Given nested array, When called, Then format nested structure', () => {
        // Arrange
        const value = [1, [2, 3]];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[1, [2, 3]]');
      });
    });

    describe('Then: [正常] Object values', () => {
      it('Given empty object, When called, Then return "{}"', () => {
        // Arrange
        const value: Record<string, unknown> = {};
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('{}');
      });

      it('Given simple object {a: 1}, When called, Then return formatted object', () => {
        // Arrange
        const value = { a: 1 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('{"a": 1}');
      });

      it('Given object with multiple properties, When called, Then format all properties', () => {
        // Arrange
        const value = { a: 1, b: 'text' };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('{"a": 1, "b": "text"}');
      });

      it('Given nested object, When called, Then format nested structure', () => {
        // Arrange
        const value = { a: { b: 1 } };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('{"a": {"b": 1}}');
      });
    });

    describe('Then: [異常] Circular reference in arrays', () => {
      it('Given array with self-reference, When called, Then detect circular reference', () => {
        // Arrange
        const value: (number | unknown[])[] = [1];
        value.push(value);
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toContain('[<Circular>]');
      });
    });

    describe('Then: [異常] Circular reference in objects', () => {
      it('Given object with self-reference, When called, Then detect circular reference', () => {
        // Arrange
        const value: Record<string, unknown> = { a: 1 };
        value.self = value;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toContain('{<Circular>}');
      });
    });

    describe('Then: [エッジケース] Complex nested structures', () => {
      it('Given mixed array and object, When called, Then format correctly', () => {
        // Arrange
        const value: unknown[] = [{ a: 1 }, [2, 3]];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[{"a": 1}, [2, 3]]');
      });

      it('Given deeply nested structure, When called, Then format all levels', () => {
        // Arrange
        const value = { a: [1, { b: [2, 3] }] };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('{"a": [1, {"b": [2, 3]}]}');
      });

      it('Given array with mixed types, When called, Then format each correctly', () => {
        // Arrange
        const value: unknown[] = [1, 'text', true, null, { a: 1 }];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('[1, "text", true, null, {"a": 1}]');
      });
    });

    describe('Then: [エッジケース] Symbol values', () => {
      it('Given symbol, When called, Then return string representation', () => {
        // Arrange
        const value = Symbol('test');
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toMatch(/Symbol/);
      });
    });

    describe('Then: [エッジケース] BigInt values', () => {
      it('Given bigint, When called, Then return string representation', () => {
        // Arrange
        const value = BigInt('123456789');
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyValue(value, seen);

        // Assert
        expect(result).toBe('123456789');
      });
    });
  });
});
