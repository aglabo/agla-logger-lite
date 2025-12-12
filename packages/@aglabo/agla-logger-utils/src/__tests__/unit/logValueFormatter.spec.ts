// src: packages/@aglabo/agla-logger-utils/src/__tests__/unit/logValueFormatter.spec.ts
// @(#) Unit tests for simple value formatter functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _escapeString, _formatFunction, _formatTimestamp } from '../../logValueUtils.ts';
import { testValidator, testValidatorWithRegex } from '../helpers/validatorHelpers.ts';

// Feature レベル (Given)
describe('Given: logValueFormatter module', () => {
  // Scenario レベル (When) - Helper: _escapeString
  describe('When: _escapeString helper is called', () => {
    // Case レベル (Then) - [正常] Standard string escaping
    it.each(
      [
        ['plain string', 'hello', /^".*"$/],
        ['empty string', '', /^".*"$/],
      ] as const,
    )('Then: [正常] - %s の場合、double quotes で wrap される', testValidatorWithRegex(_escapeString));

    // Case レベル (Then) - [異常] Special character escaping
    it.each(
      [
        ['string with double quotes', 'say "hi"', '"say \\"hi\\""'],
        ['string with backslashes', 'path\\file', '"path\\\\file"'],
        ['string with newlines', 'line1\nline2', '"line1\\nline2"'],
        ['string with tabs', 'col1\tcol2', '"col1\\tcol2"'],
        ['string with carriage returns', 'text\r\n', '"text\\r\\n"'],
        ['string with multiple special chars', 'test\n"quoted"\ttab', '"test\\n\\"quoted\\"\\ttab"'],
      ] as const,
    )(
      'Then: [異常] - %s の場合、escape される',
      testValidator(_escapeString),
    );
  });

  // Scenario レベル (When) - Helper: _formatFunction
  describe('When: _formatFunction helper is called', () => {
    // Case レベル (Then) - [正常] Named function formatting
    it.each(
      [
        [
          'function declaration',
          function testNamedFunction(): void {},
          'testNamedFunction',
        ] as const,
        [
          'named function expression',
          (() => {
            const namedFunc = function myNamedFunc(): void {};
            return namedFunc;
          })(),
          'myNamedFunc',
        ] as const,
        [
          'arrow function',
          (() => {
            const arrowFunc = (): void => {};
            return arrowFunc;
          })(),
          '',
        ] as const,
        [
          'method in object',
          (() => {
            const obj = { myMethod() {} };
            return obj.myMethod;
          })(),
          'myMethod',
        ] as const,
      ] as const,
    )(
      'Then: [正常/%s] - name を含む or empty',
      (_desc, func, expectedName) => {
        const result = _formatFunction(func);
        if (expectedName) {
          expect(result).toContain(expectedName);
        } else {
          expect(result).toMatch(/Function:$/);
        }
      },
    );

    // Case レベル (Then) - [異常] Anonymous function
    it('Then: [異常] - anonymous arrow function の場合、name がない', () => {
      // Arrange
      const arrowFunc = (): void => {};

      // Act
      const result = _formatFunction(arrowFunc);

      // Assert
      expect(result).toMatch(/Function:$/);
    });

    it('Then: [異常] - anonymous function expression の場合、name がない', () => {
      // Arrange
      const anonFunc = function(): void {};

      // Act
      const result = _formatFunction(anonFunc);

      // Assert
      expect(result).toMatch(/Function:$/);
    });

    // Case レベル (Then) - [エッジケース] Complex cases
    it('Then: [エッジケース] - function with empty string name の場合、name がない', () => {
      // Arrange
      const func = function(): void {};
      Object.defineProperty(func, 'name', { value: '' });

      // Act
      const result = _formatFunction(func);

      // Assert
      expect(result).toMatch(/Function:$/);
    });

    it('Then: [エッジケース] - multi-line named function の場合、function name を返す', () => {
      // Arrange
      const multiLineFunc = function complexFunc(): number {
        const x = 1;
        return x;
      };

      // Act
      const result = _formatFunction(multiLineFunc);

      // Assert
      expect(result).toContain('complexFunc');
    });

    it('Then: [エッジケース] - function with multi-line parameters の場合、function name を返す', () => {
      // Arrange
      const funcWithParams = function namedWithParams(_param1: string, _param2: number): void {};

      // Act
      const result = _formatFunction(funcWithParams);

      // Assert
      expect(result).toContain('namedWithParams');
    });

    it('Then: [エッジケース] - method with multi-line body の場合、method name を返す', () => {
      // Arrange
      const obj = {
        complexMethod() {
          const x = 1;
          const y = 2;
          return x + y;
        },
      };

      // Act
      const result = _formatFunction(obj.complexMethod);

      // Assert
      expect(result).toContain('complexMethod');
    });
  });

  // Scenario レベル (When) - Helper: _formatTimestamp
  describe('When: _formatTimestamp helper is called', () => {
    // Case レベル (Then) - [正常] Timestamp conversion in milliseconds (dispMs true)
    describe('Then: [正常] Timestamp in milliseconds (dispMs=true)', () => {
      it('Given Date object 1970-01-01T00:00:01.000Z, When dispMs true, Then return ISO string with milliseconds precision', () => {
        // Arrange
        const date = new Date(1000);
        const dispMs = true;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });

      it('Given Date object 2021-01-01T00:00:00.000Z, When dispMs true, Then return ISO string with milliseconds precision', () => {
        // Arrange
        const date = new Date(1609459200000);
        const dispMs = true;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(result).toBe('2021-01-01T00:00:00.000Z');
      });
    });

    // Case レベル (Then) - [正常] Timestamp conversion without fractional seconds (dispMs false)
    describe('Then: [正常] Timestamp without fractional seconds (dispMs=false)', () => {
      it('Given Date object 1970-01-01T00:00:01.000Z, When dispMs false, Then return ISO string with seconds precision only', () => {
        // Arrange
        const date = new Date(1000);
        const dispMs = false;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('1970-01-01T00:00:01Z');
      });

      it('Given Date object 2021-01-01T00:00:00.123Z, When dispMs false, Then return ISO string with seconds precision only (ignoring milliseconds)', () => {
        // Arrange
        const date = new Date(1609459200123);
        const dispMs = false;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('2021-01-01T00:00:00Z');
      });
    });

    // Case レベル (Then) - [エッジケース] Edge cases
    describe('Then: [エッジケース] Edge cases', () => {
      it('Given Date object Unix epoch (1970-01-01T00:00:00.000Z), When dispMs true, Then return 1970-01-01T00:00:00.000Z', () => {
        // Arrange
        const date = new Date(0);
        const dispMs = true;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00.000Z');
      });

      it('Given Date object Unix epoch (1970-01-01T00:00:00.000Z), When dispMs false, Then return 1970-01-01T00:00:00Z', () => {
        // Arrange
        const date = new Date(0);
        const dispMs = false;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00Z');
      });

      it('Given Date object far future (9999-12-31 23:59:59.999Z), When dispMs true, Then return valid ISO string with milliseconds', () => {
        // Arrange
        const date = new Date(253402300799999);
        const dispMs = true;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('Given Date object far future (9999-12-31 23:59:59.999Z), When dispMs false, Then return valid ISO string with seconds precision only', () => {
        // Arrange
        const date = new Date(253402300799999);
        const dispMs = false;

        // Act
        const result = _formatTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      });

      it('Given Date object 1970-01-01T00:00:01.000Z, When dispMs parameter omitted (default), Then return ISO string with seconds precision only', () => {
        // Arrange
        const date = new Date(1000);

        // Act
        const result = _formatTimestamp(date);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('1970-01-01T00:00:01Z');
      });

      it('Given Date object 2021-01-01T00:00:00.123Z, When dispMs parameter omitted (default), Then return ISO string with seconds precision only (ignoring milliseconds)', () => {
        // Arrange
        const date = new Date(1609459200123);

        // Act
        const result = _formatTimestamp(date);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('2021-01-01T00:00:00Z');
      });
    });
  });
});
