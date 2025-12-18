// src: packages/@aglabo/agla-logger-utils/src/stringify/__tests__/unit/stringifyObject.spec.ts
// @(#) Unit tests for object stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { AGTFormatterContext } from '../../../../shared/types/AGTFormatterContext.class.ts';
import { _ensureContext, stringifyObject } from '../../stringifyObject.ts';

describe('Given: stringifyObject module', () => {
  describe('When: _ensureContext is called', () => {
    describe('Then: [正常] With existing context', () => {
      it('Given existing AGTFormatterContext, When called, Then return same context', () => {
        // Arrange
        const existingContext = new AGTFormatterContext();

        // Act
        const result = _ensureContext(existingContext);

        // Assert
        expect(result).toBe(existingContext);
      });
    });

    describe('Then: [正常] Without context', () => {
      it('Given no context and no options, When called, Then create new context', () => {
        // Arrange
        // No context provided

        // Act
        const result = _ensureContext();

        // Assert
        expect(result).toBeInstanceOf(AGTFormatterContext);
      });

      it('Given no context but with options, When called, Then create context with options', () => {
        // Arrange
        const options = {};

        // Act
        const result = _ensureContext(undefined, options);

        // Assert
        expect(result).toBeInstanceOf(AGTFormatterContext);
      });
    });

    describe('Then: [異常] Context with options', () => {
      it('Given existing context with options, When called, Then context takes precedence over options', () => {
        // Arrange
        const existingContext = new AGTFormatterContext();
        const options = {};

        // Act
        const result = _ensureContext(existingContext, options);

        // Assert
        expect(result).toBe(existingContext);
      });
    });
  });

  describe('When: stringifyObject is called', () => {
    describe('Then: [正常] Date object', () => {
      it('Given Date object 1970-01-01T00:00:01.000Z, When called, Then return ISO string with milliseconds', () => {
        // Arrange
        const value = new Date(1000);

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });

      it('Given Date object 2021-01-01T00:00:00.000Z, When called, Then return ISO string', () => {
        // Arrange
        const value = new Date(1609459200000);

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('2021-01-01T00:00:00.000Z');
      });

      it('Given Unix epoch Date, When called, Then return epoch ISO string', () => {
        // Arrange
        const value = new Date(0);

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00.000Z');
      });
    });

    describe('Then: [正常] With context', () => {
      it('Given Date with context, When called, Then return formatted ISO string', () => {
        // Arrange
        const value = new Date(1000);
        const context = new AGTFormatterContext();

        // Act
        const result = stringifyObject(value, context);

        // Assert
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });
    });

    describe('Then: [正常] Non-stringifiable types', () => {
      it('Given primitive number 42, When called, Then return String value', () => {
        // Arrange
        const value = 42;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('42');
      });

      it('Given primitive string "hello", When called, Then return String value', () => {
        // Arrange
        const value = 'hello';

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('hello');
      });

      it('Given boolean true, When called, Then return String value', () => {
        // Arrange
        const value = true;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('true');
      });
    });

    describe('Then: [異常] Placeholder for unknown types', () => {
      it('Given Map object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Map();

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('[Map]');
      });

      it('Given Set object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Set();

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('[Set]');
      });

      it('Given RegExp object, When called, Then return placeholder', () => {
        // Arrange
        const value = /test/;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('[RegExp]');
      });

      it('Given Error object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Error('test');

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('[Error]');
      });

      it('Given plain object, When called, Then return String value', () => {
        // Arrange
        const value = { a: 1 };

        // Act
        const result = stringifyObject(value);

        // Assert
        // Plain objects are converted to string via String() when type is not recognized
        expect(result).toBe('[object Object]');
      });

      it('Given array, When called, Then return String value', () => {
        // Arrange
        const value = [1, 2, 3];

        // Act
        const result = stringifyObject(value);

        // Assert
        // Arrays are converted to string via String() when type is not recognized
        expect(result).toBe('1,2,3');
      });

      it('Given function, When called, Then return String value', () => {
        // Arrange
        const value = (): void => {};

        // Act
        const result = stringifyObject(value);

        // Assert
        // Functions are converted to string via String() when type is not recognized
        expect(result).toMatch(/function|\(\)/);
      });
    });

    describe('Then: [エッジケース] Edge cases', () => {
      it('Given null value, When called, Then return String value', () => {
        // Arrange
        const value = null;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('null');
      });

      it('Given undefined value, When called, Then return String value', () => {
        // Arrange
        const value = undefined;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('undefined');
      });

      it('Given NaN value, When called, Then return String value', () => {
        // Arrange
        const value = Number.NaN;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('NaN');
      });

      it('Given Infinity value, When called, Then return String value', () => {
        // Arrange
        const value = Number.POSITIVE_INFINITY;

        // Act
        const result = stringifyObject(value);

        // Assert
        expect(result).toBe('Infinity');
      });
    });
  });
});
