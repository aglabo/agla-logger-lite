// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/formatters.spec.ts
// @(#) Unit tests for stringification formatters
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _stringifyFunction, _stringifyTimestamp } from '../../formatters.ts';

describe('Given: formatters module', () => {
  describe('When: _stringifyFunction helper is called', () => {
    describe('Then: [正常] Named function formatting', () => {
      it('Given function declaration, When called, Then return function name', () => {
        // Arrange
        const testNamedFunction = function testNamedFunction(): void {};

        // Act
        const result = _stringifyFunction(testNamedFunction);

        // Assert
        expect(result).toContain('testNamedFunction');
      });

      it('Given named function expression, When called, Then return function name', () => {
        // Arrange
        const namedFunc = function myNamedFunc(): void {};

        // Act
        const result = _stringifyFunction(namedFunc);

        // Assert
        expect(result).toContain('myNamedFunc');
      });

      it('Given method in object, When called, Then return method name', () => {
        // Arrange
        const obj = { myMethod() {} };

        // Act
        const result = _stringifyFunction(obj.myMethod);

        // Assert
        expect(result).toContain('myMethod');
      });
    });

    describe('Then: [異常] Anonymous function', () => {
      it('Given anonymous arrow function, When called, Then return "Function:"', () => {
        // Arrange
        const arrowFunc = (): void => {};

        // Act
        const result = _stringifyFunction(arrowFunc);

        // Assert
        expect(result).toMatch(/Function:$/);
      });

      it('Given anonymous function expression, When called, Then return "Function:"', () => {
        // Arrange
        const anonFunc = function(): void {};

        // Act
        const result = _stringifyFunction(anonFunc);

        // Assert
        expect(result).toMatch(/Function:$/);
      });
    });

    describe('Then: [エッジケース] Complex cases', () => {
      it('Given function with empty string name, When called, Then return "Function:"', () => {
        // Arrange
        const func = function(): void {};
        Object.defineProperty(func, 'name', { value: '' });

        // Act
        const result = _stringifyFunction(func);

        // Assert
        expect(result).toMatch(/Function:$/);
      });

      it('Given multi-line named function, When called, Then return function name', () => {
        // Arrange
        const multiLineFunc = function complexFunc(): number {
          const x = 1;
          return x;
        };

        // Act
        const result = _stringifyFunction(multiLineFunc);

        // Assert
        expect(result).toContain('complexFunc');
      });

      it('Given function with parameters, When called, Then return function name', () => {
        // Arrange
        const funcWithParams = function namedWithParams(_param1: string, _param2: number): void {};

        // Act
        const result = _stringifyFunction(funcWithParams);

        // Assert
        expect(result).toContain('namedWithParams');
      });

      it('Given method with multi-line body, When called, Then return method name', () => {
        // Arrange
        const obj = {
          complexMethod() {
            const x = 1;
            const y = 2;
            return x + y;
          },
        };

        // Act
        const result = _stringifyFunction(obj.complexMethod);

        // Assert
        expect(result).toContain('complexMethod');
      });
    });
  });

  describe('When: _stringifyTimestamp helper is called', () => {
    describe('Then: [正常] Timestamp with milliseconds (dispMs=true)', () => {
      it('Given Date 1970-01-01T00:00:01.000Z, When dispMs true, Then return ISO string with milliseconds', () => {
        // Arrange
        const date = new Date(1000);
        const dispMs = true;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });

      it('Given Date 2021-01-01T00:00:00.000Z, When dispMs true, Then return ISO string with milliseconds', () => {
        // Arrange
        const date = new Date(1609459200000);
        const dispMs = true;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('2021-01-01T00:00:00.000Z');
      });
    });

    describe('Then: [正常] Timestamp without milliseconds (dispMs=false)', () => {
      it('Given Date 1970-01-01T00:00:01.000Z, When dispMs false, Then return ISO string with seconds precision', () => {
        // Arrange
        const date = new Date(1000);
        const dispMs = false;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('1970-01-01T00:00:01Z');
      });

      it('Given Date 2021-01-01T00:00:00.123Z, When dispMs false, Then ignore milliseconds', () => {
        // Arrange
        const date = new Date(1609459200123);
        const dispMs = false;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('2021-01-01T00:00:00Z');
      });
    });

    describe('Then: [エッジケース] Edge cases', () => {
      it('Given Unix epoch (1970-01-01T00:00:00.000Z), When dispMs true, Then return correct ISO string', () => {
        // Arrange
        const date = new Date(0);
        const dispMs = true;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00.000Z');
      });

      it('Given Unix epoch, When dispMs false, Then return correct ISO string without milliseconds', () => {
        // Arrange
        const date = new Date(0);
        const dispMs = false;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00Z');
      });

      it('Given far future date, When dispMs true, Then return valid ISO string', () => {
        // Arrange
        const date = new Date(253402300799999);
        const dispMs = true;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      });

      it('Given far future date, When dispMs false, Then return valid ISO string without milliseconds', () => {
        // Arrange
        const date = new Date(253402300799999);
        const dispMs = false;

        // Act
        const result = _stringifyTimestamp(date, dispMs);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
      });

      it('Given Date, When dispMs parameter omitted (default), Then return ISO string with seconds precision', () => {
        // Arrange
        const date = new Date(1000);

        // Act
        const result = _stringifyTimestamp(date);

        // Assert
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
        expect(result).toBe('1970-01-01T00:00:01Z');
      });
    });
  });
});
