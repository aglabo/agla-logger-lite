// src: packages/@aglabo/agla-logger-utils/src/__tests__/functional/logMessageComposer.functional.spec.ts
// @(#) Functional tests for logMessageComposer module
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { formatMessages, formatValues } from '../../logMessageComposer.ts';

// Feature レベル (Given)
describe('Given: logMessageComposer module', () => {
  // Scenario レベル (When)
  describe('When: formatMessages() is called', () => {
    // Case レベル (Then) - [正常] Standard conversions
    describe('Then: [正常] Standard conversions', () => {
      it('Given string array, When parsing, Then concatenate with spaces', () => {
        // Arrange
        const input = ['Hello', 'World'];
        const expected = 'Hello World';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple strings, When parsing, Then joins with spaces', () => {
        // Arrange
        const input = ['Error', '404', 'Not found'];
        const expected = 'Error 404 Not found';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given boolean as strings, When parsing, Then joins all', () => {
        // Arrange
        const input = ['true', 'false', 'true'];
        const expected = 'true false true';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given symbol string, When parsing, Then joins correctly', () => {
        // Arrange
        const input = ['Symbol:', 'Symbol(test)'];
        const expected = 'Symbol: Symbol(test)';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given single value, When parsing, Then returns that value', () => {
        // Arrange
        const input = ['single'];
        const expected = 'single';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given zero as string, When parsing, Then returns "0"', () => {
        // Arrange
        const input = ['0'];
        const expected = '0';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given empty string, When parsing, Then includes in join', () => {
        // Arrange
        const input = ['', 'text'];
        const expected = ' text';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given string numbers, When parsing, Then returns concatenated', () => {
        // Arrange
        const input = ['42', '100', '999'];
        const expected = '42 100 999';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [エッジケース] Boundary conditions
    describe('Then: [エッジケース] Boundary conditions', () => {
      it('Given empty array, When parsing, Then returns empty string', () => {
        // Arrange
        const input: string[] = [];
        const expected = '';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given single empty string, When parsing, Then returns empty string', () => {
        // Arrange
        const input = [''];
        const expected = '';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple empty strings, When parsing, Then returns spaced empty', () => {
        // Arrange
        const input = ['', '', ''];
        const expected = '  ';

        // Act
        const result = formatMessages(input);

        // Assert
        expect(result).toBe(expected);
      });
    });
  });

  // Scenario レベル (When)
  describe('When: formatValues() is called', () => {
    // Case レベル (Then) - [正常] Standard conversions
    describe('Then: [正常] Standard conversions', () => {
      it('Given single object, When parsing, Then returns JSON.stringify result', () => {
        // Arrange
        const input = [{ a: 1 }];
        const expected = '{"a": 1}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple objects, When parsing, Then returns comma-separated in braces', () => {
        // Arrange
        const input = [{ a: 1 }, { b: 2 }];
        const expected = '{{"a": 1}, {"b": 2}}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given null value, When parsing, Then returns "null" string', () => {
        // Arrange
        const input = [null];
        const expected = 'null';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given undefined value, When parsing, Then returns "undefined" string', () => {
        // Arrange
        const input = [undefined];
        const expected = 'undefined';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given number value, When parsing, Then returns JSON stringified number', () => {
        // Arrange
        const input = [42];
        const expected = '42';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given string value, When parsing, Then returns JSON stringified with quotes', () => {
        // Arrange
        const input = ['string'];
        const expected = '"string"';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given boolean values, When parsing, Then returns JSON stringified', () => {
        // Arrange
        const input = [true, false];
        const expected = '{true, false}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given complex nested object, When parsing, Then returns JSON.stringify result', () => {
        // Arrange
        const input = [{ a: { b: { c: 1 } } }];
        const expected = '{"a": {"b": {"c": 1}}}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given array value, When parsing, Then returns JSON stringified array', () => {
        // Arrange
        const input = [[1, 2, 3]];
        const expected = '[1, 2, 3]';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given three objects, When parsing, Then returns all in braces', () => {
        // Arrange
        const input = [{ a: 1 }, { b: 2 }, { c: 3 }];
        const expected = '{{"a": 1}, {"b": 2}, {"c": 3}}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [異常] Edge cases
    describe('Then: [異常] Edge cases', () => {
      it('Given object with undefined property, When parsing, Then displays undefined', () => {
        // Arrange
        const input = [{ a: undefined }];
        const expected = '{"a": undefined}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with NaN, When parsing, Then displays NaN', () => {
        // Arrange
        const input = [{ a: NaN }];
        const expected = '{"a": NaN}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with Infinity, When parsing, Then displays Infinity', () => {
        // Arrange
        const input = [{ a: Infinity }];
        const expected = '{"a": Infinity}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given object with function property, When parsing, Then displays function', () => {
        // Arrange
        const input = [{ a: () => {}, b: 1 }];
        const expected = '{"a": [Function:], "b": 1}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given multiple nulls, When parsing, Then includes all in braces', () => {
        // Arrange
        const input = [null, null, null];
        const expected = '{null, null, null}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });
    });

    // Case レベル (Then) - [エッジケース] Boundary conditions
    describe('Then: [エッジケース] Boundary conditions', () => {
      it('Given empty array, When parsing, Then returns empty string', () => {
        // Arrange
        const input: unknown[] = [];
        const expected = '';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given empty object, When parsing, Then returns "{}"', () => {
        // Arrange
        const input = [{}];
        const expected = '{}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given empty string value, When parsing, Then returns JSON stringified empty string', () => {
        // Arrange
        const input = [''];
        const expected = '""';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });

      it('Given deeply nested object, When parsing, Then preserves all nesting levels', () => {
        // Arrange
        const input = [{ a: { b: { c: { d: { e: { f: 1 } } } } } }];

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toContain('"a"');
        expect(result).toContain('"f": 1');
      });

      it('Given large array value, When parsing, Then returns JSON stringified array', () => {
        // Arrange
        const largeArray = Array.from({ length: 100 }, (_, i) => i);
        const input = [largeArray];

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toContain('[');
        expect(result).toContain(']');
        expect(result).toContain('99');
      });

      it('Given unicode characters, When parsing, Then preserves in JSON', () => {
        // Arrange
        const input = [{ emoji: '😀', japanese: 'テスト' }];

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toContain('emoji');
        expect(result).toContain('😀');
        expect(result).toContain('テスト');
      });

      it('Given circular reference, When parsing, Then displays circular marker', () => {
        // Arrange
        const circular: Record<string, unknown> = { a: 1 };
        circular.self = circular;
        const input = [circular];
        const expected = '{"a": 1, "self": {<Circular>}}';

        // Act
        const result = formatValues(input);

        // Assert
        expect(result).toBe(expected);
      });
    });
  });
});
