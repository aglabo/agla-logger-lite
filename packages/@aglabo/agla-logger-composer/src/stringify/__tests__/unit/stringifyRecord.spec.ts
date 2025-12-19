// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/stringifyRecord.spec.ts
// @(#) Unit tests for record/object stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _stringifyRecord } from '../../stringifyRecord.ts';

describe('Given: stringifyRecord module', () => {
  describe('When: _stringifyRecord is called', () => {
    describe('Then: [正常] Empty object', () => {
      it('Given empty object {}, When called, Then return "{}"', () => {
        // Arrange
        const record: Record<string, unknown> = {};
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{}');
      });
    });

    describe('Then: [正常] Single property', () => {
      it('Given object {a: 1}, When called, Then return "{\\"a\\": 1}"', () => {
        // Arrange
        const record = { a: 1 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": 1}');
      });
    });

    describe('Then: [正常] Multiple properties', () => {
      it('Given object {a: 1, b: 2}, When called, Then return formatted object', () => {
        // Arrange
        const record = { a: 1, b: 2 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        // Object key order depends on insertion order in modern JS
        expect(result).toBe('{"a": 1, "b": 2}');
      });

      it('Given object with many properties, When called, Then format all properties', () => {
        // Arrange
        const record = { x: 1, y: 2, z: 3 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"x": 1, "y": 2, "z": 3}');
      });
    });

    describe('Then: [正常] Different value types', () => {
      it('Given object {a: 1, b: "text", c: true}, When called, Then stringify all types', () => {
        // Arrange
        const record: Record<string, unknown> = { a: 1, b: 'text', c: true };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": 1, "b": "text", "c": true}');
      });

      it('Given object {a: null, b: undefined}, When called, Then stringify null and undefined', () => {
        // Arrange
        const record: Record<string, unknown> = { a: null, b: undefined };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": null, "b": undefined}');
      });
    });

    describe('Then: [正常] Nested objects', () => {
      it('Given nested object {a: {b: 1}}, When called, Then stringify nested object', () => {
        // Arrange
        const record: Record<string, unknown> = { a: { b: 1 } };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": {"b": 1}}');
      });

      it('Given deeply nested object, When called, Then stringify with all levels', () => {
        // Arrange
        const record: Record<string, unknown> = { a: { b: { c: 1 } } };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": {"b": {"c": 1}}}');
      });
    });

    describe('Then: [正常] Objects with arrays', () => {
      it('Given object {items: [1, 2]}, When called, Then stringify array', () => {
        // Arrange
        const record: Record<string, unknown> = { items: [1, 2] };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"items": [1, 2]}');
      });

      it('Given object with mixed array content, When called, Then stringify correctly', () => {
        // Arrange
        const record: Record<string, unknown> = { mixed: [1, 'a', true] };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"mixed": [1, "a", true]}');
      });
    });

    describe('Then: [異常] Circular reference', () => {
      it('Given object with self-reference obj.self = obj, When called, Then detect circular reference', () => {
        // Arrange
        const record: Record<string, unknown> = { a: 1 };
        record.self = record;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toContain('{<Circular>}');
      });

      it('Given object with nested circular reference, When called, Then detect circular reference', () => {
        // Arrange
        const obj1: Record<string, unknown> = { a: 1 };
        const obj2: Record<string, unknown> = { b: 2, ref: obj1 };
        obj1.ref = obj2;
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(obj1, seen);

        // Assert
        expect(result).toContain('{<Circular>}');
      });
    });

    describe('Then: [エッジケース] Special key names', () => {
      it('Given object with numeric string keys {"1": "a"}, When called, Then stringify correctly', () => {
        // Arrange
        const record: Record<string, unknown> = { '1': 'a' };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"1": "a"}');
      });

      it('Given object with special characters in keys {"a-b": 1}, When called, Then preserve key', () => {
        // Arrange
        const record: Record<string, unknown> = { 'a-b': 1 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a-b": 1}');
      });

      it('Given object with space in key {"a b": 1}, When called, Then preserve key', () => {
        // Arrange
        const record: Record<string, unknown> = { 'a b': 1 };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a b": 1}');
      });
    });

    describe('Then: [エッジケース] Special value characters', () => {
      it('Given object with string containing quotes {"key": "value\\"text"}, When called, Then escape quotes', () => {
        // Arrange
        const record: Record<string, unknown> = { key: 'value"text' };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"key": "value\\"text"}');
      });

      it('Given object with string containing newlines, When called, Then escape special chars', () => {
        // Arrange
        const record: Record<string, unknown> = { key: 'line1\nline2' };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"key": "line1\\nline2"}');
      });
    });

    describe('Then: [エッジケース] Special numbers', () => {
      it('Given object {a: NaN}, When called, Then return "[NaN]"', () => {
        // Arrange
        const record: Record<string, unknown> = { a: Number.NaN };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": NaN}');
      });

      it('Given object {a: Infinity}, When called, Then return "[Infinity]"', () => {
        // Arrange
        const record: Record<string, unknown> = { a: Number.POSITIVE_INFINITY };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toBe('{"a": Infinity}');
      });
    });

    describe('Then: [エッジケース] Functions in object', () => {
      it('Given object {fn: function test() {}}, When called, Then format function', () => {
        // Arrange
        const record: Record<string, unknown> = { fn: function test() {} };
        const seen = new WeakSet<object>();

        // Act
        const result = _stringifyRecord(record, seen);

        // Assert
        expect(result).toContain('[Function: test]');
      });
    });
  });
});
