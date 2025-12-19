// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/stringifyArray.spec.ts
// @(#) Unit tests for array stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _stringifyArray } from '../../stringifyArray.ts';

describe('Given: stringifyArray module', () => {
  describe('When: _stringifyArray is called', () => {
    describe('Then: [正常] Empty array', () => {
      it('Given empty array [], When called, Then return "[]"', () => {
        // Arrange
        const arr: unknown[] = [];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[]');
      });
    });

    describe('Then: [正常] Simple primitives', () => {
      it('Given array with numbers [1, 2, 3], When called, Then return "[1, 2, 3]"', () => {
        // Arrange
        const arr = [1, 2, 3];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[1, 2, 3]');
      });

      it('Given array with strings ["a", "b"], When called, Then return "[\\"a\\", \\"b\\"]"', () => {
        // Arrange
        const arr = ['a', 'b'];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('["a", "b"]');
      });

      it('Given array with booleans [true, false], When called, Then return "[true, false]"', () => {
        // Arrange
        const arr = [true, false];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[true, false]');
      });

      it('Given array with null [null], When called, Then return "[null]"', () => {
        // Arrange
        const arr = [null, null];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[null, null]');
      });

      it('Given array with undefined [undefined], When called, Then return "[undefined]"', () => {
        // Arrange
        const arr = [undefined];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[undefined]');
      });
    });

    describe('Then: [正常] Mixed types', () => {
      it('Given array with mixed types [1, "a", true, null], When called, Then stringify correctly', () => {
        // Arrange
        const arr: unknown[] = [1, 'a', true, null];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[1, "a", true, null]');
      });
    });

    describe('Then: [正常] Nested arrays', () => {
      it('Given nested array [[1, 2], [3, 4]], When called, Then return "[[1, 2], [3, 4]]"', () => {
        // Arrange
        const arr = [[1, 2], [3, 4]];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[[1, 2], [3, 4]]');
      });

      it('Given deeply nested array [[[1]]], When called, Then return "[[[1]]]"', () => {
        // Arrange
        const arr = [[[1]]];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[[[1]]]');
      });
    });

    describe('Then: [正常] Arrays with objects', () => {
      it('Given array containing object [{a: 1}], When called, Then stringify object', () => {
        // Arrange
        const arr: unknown[] = [{ a: 1 }];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[{"a": 1}]');
      });

      it('Given array with multiple objects [{a: 1}, {b: 2}], When called, Then stringify all objects', () => {
        // Arrange
        const arr: unknown[] = [{ a: 1 }, { b: 2 }];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[{"a": 1}, {"b": 2}]');
      });
    });

    describe('Then: [異常] Circular reference', () => {
      it('Given array with self-reference arr = [1, arr], When called, Then return array with [Circular] marker', () => {
        // Arrange
        const arr: (number | (number | unknown[])[])[] = [1];
        arr.push(arr);
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[1, [<Circular>]]');
      });

      it('Given array with nested circular reference, When called, Then detect circular reference', () => {
        // Arrange
        const inner: (number | unknown[])[] = [1];
        const outer = [inner];
        inner.push(outer);
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(outer, seen);

        // Assert
        expect(result).toContain('[<Circular>]');
      });
    });

    describe('Then: [エッジケース] Special numbers', () => {
      it('Given array with NaN [NaN], When called, Then return "[NaN]"', () => {
        // Arrange
        const arr = [Number.NaN];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[NaN]');
      });

      it('Given array with Infinity [Infinity], When called, Then return "[Infinity]"', () => {
        // Arrange
        const arr = [Number.POSITIVE_INFINITY];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[Infinity]');
      });

      it('Given array with -Infinity [-Infinity], When called, Then return "[-Infinity]"', () => {
        // Arrange
        const arr = [Number.NEGATIVE_INFINITY];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('[-Infinity]');
      });
    });

    describe('Then: [エッジケース] Special string characters', () => {
      it('Given array with escaped strings ["hello\\"world"], When called, Then escape quotes correctly', () => {
        // Arrange
        const arr = ['hello"world'];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('["hello\\"world"]');
      });

      it('Given array with newlines ["line1\\nline2"], When called, Then escape newlines', () => {
        // Arrange
        const arr = ['line1\nline2'];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toBe('["line1\\nline2"]');
      });
    });

    describe('Then: [エッジケース] Functions in array', () => {
      it('Given array with named function [function test() {}], When called, Then format function', () => {
        // Arrange
        const arr: unknown[] = [function test() {}];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toContain('[Function: test]');
      });

      it('Given array with arrow function [() => {}], When called, Then format arrow function', () => {
        // Arrange
        const arr: unknown[] = [() => {}];
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyArray(arr, seen);

        // Assert
        expect(result).toContain('[Function:]');
      });
    });
  });
});
