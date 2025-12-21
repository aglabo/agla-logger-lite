// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/stringifyObject.spec.ts
// @(#) Unit tests for object stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { agFormat } from '#shared/types/AGTFormatContext.types.ts';
import { AGTFormatEnvironment } from '#shared/types/AGTFormatEnvironment.class.ts';
import { describe, expect, it } from 'vitest';
import { _stringifyObject } from '../../stringifyObject.ts';

// Default environment for tests
const defaultEnv = new AGTFormatEnvironment();

describe('Given: stringifyObject module', () => {
  describe('When: _stringifyObject is called', () => {
    describe('Then: [正常] Date object', () => {
      it('Given Date object 1970-01-01T00:00:01.000Z, When called, Then return ISO string with milliseconds', () => {
        // Arrange
        const value = new Date(1000);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });

      it('Given Date object 2021-01-01T00:00:00.000Z, When called, Then return ISO string', () => {
        // Arrange
        const value = new Date(1609459200000);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('2021-01-01T00:00:00.000Z');
      });

      it('Given Unix epoch Date, When called, Then return epoch ISO string', () => {
        // Arrange
        const value = new Date(0);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('1970-01-01T00:00:00.000Z');
      });
    });

    describe('Then: [正常] With context', () => {
      it('Given Date with context, When called, Then return formatted ISO string', () => {
        // Arrange
        const value = new Date(1000);
        const context = agFormat.createContext();

        // Act
        const result = _stringifyObject(value, context, defaultEnv);

        // Assert
        expect(result).toBe('1970-01-01T00:00:01.000Z');
      });
    });

    describe('Then: [正常] Non-stringifiable types', () => {
      it('Given primitive number 42, When called, Then return String value', () => {
        // Arrange
        const value = 42;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('42');
      });

      it('Given primitive string "hello", When called, Then return String value', () => {
        // Arrange
        const value = 'hello';

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('hello');
      });

      it('Given boolean true, When called, Then return String value', () => {
        // Arrange
        const value = true;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('true');
      });
    });

    describe('Then: [異常] Placeholder for unknown types', () => {
      it('Given Map object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Map();

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<Map>');
      });

      it('Given Set object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Set();

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<Set>');
      });

      it('Given RegExp object, When called, Then return placeholder', () => {
        // Arrange
        const value = /test/;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<RegExp>');
      });

      it('Given Error object, When called, Then return placeholder', () => {
        // Arrange
        const value = new Error('test');

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<Error>');
      });

      it('Given URL object, When called, Then return placeholder', () => {
        // Arrange
        const value = new URL('https://example.com/path?key=value');

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<URL>');
      });

      it('Given URLSearchParams object, When called, Then return placeholder', () => {
        // Arrange
        const value = new URLSearchParams('key=value&foo=bar');

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<URLSearchParams>');
      });

      it('Given TypedArray (Uint8Array), When called, Then return placeholder', () => {
        // Arrange
        const value = new Uint8Array([1, 2, 3, 4, 5]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<TypedArray>');
      });

      it('Given TypedArray (Int32Array), When called, Then return placeholder', () => {
        // Arrange
        const value = new Int32Array([100, 200, 300]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<TypedArray>');
      });

      it('Given ArrayBuffer object, When called, Then return placeholder', () => {
        // Arrange
        const value = new ArrayBuffer(8);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<ArrayBuffer>');
      });

      it('Given DataView object, When called, Then return placeholder', () => {
        // Arrange
        const buffer = new ArrayBuffer(8);
        const value = new DataView(buffer);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<DataView>');
      });

      it('Given custom class instance, When called, Then return actual class name', () => {
        // Arrange
        class CustomClass {
          prop: string = 'value';
          method = (): void => {};
        }
        const value = new CustomClass();

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<CustomClass>');
      });

      it('Given plain object, When called, Then return String value', () => {
        // Arrange
        const value = { a: 1 };

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        // Plain objects are converted to string via String() when type is not recognized
        expect(result).toBe('[object Object]');
      });

      it('Given array, When called, Then return String value', () => {
        // Arrange
        const value = [1, 2, 3];

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        // Arrays are converted to string via String() when type is not recognized
        expect(result).toBe('1,2,3');
      });

      it('Given function, When called, Then return String value', () => {
        // Arrange
        const value = (): void => {};

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        // Functions are converted to string via String() when type is not recognized
        expect(result).toMatch(/function|\(\)/);
      });
    });

    describe('Then: [エッジケース] Edge cases - Primitive special values', () => {
      it('Given null value, When called, Then return String value', () => {
        // Arrange
        const value = null;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('null');
      });

      it('Given undefined value, When called, Then return String value', () => {
        // Arrange
        const value = undefined;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('undefined');
      });

      it('Given NaN value, When called, Then return String value', () => {
        // Arrange
        const value = Number.NaN;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('NaN');
      });

      it('Given Infinity value, When called, Then return String value', () => {
        // Arrange
        const value = Number.POSITIVE_INFINITY;

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('Infinity');
      });
    });

    describe('Then: [エッジケース] Edge cases - Special types variants', () => {
      it('Given URL with query string, When called, Then return placeholder', () => {
        // Arrange
        const value = new URL('https://example.com/path?a=1&b=2&c=3');

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<URL>');
      });

      it('Given URLSearchParams with multiple values, When called, Then return placeholder', () => {
        // Arrange
        const value = new URLSearchParams([
          ['key1', 'value1'],
          ['key2', 'value2'],
          ['key3', 'value3'],
        ]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<URLSearchParams>');
      });

      it('Given TypedArray (Float64Array), When called, Then return placeholder', () => {
        // Arrange
        const value = new Float64Array([1.5, 2.5, 3.5]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<TypedArray>');
      });

      it('Given TypedArray (BigInt64Array), When called, Then return placeholder', () => {
        // Arrange
        const value = new BigInt64Array([BigInt(100), BigInt(200)]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<TypedArray>');
      });

      it('Given large ArrayBuffer, When called, Then return placeholder', () => {
        // Arrange
        const value = new ArrayBuffer(1024);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<ArrayBuffer>');
      });

      it('Given DataView with offset, When called, Then return placeholder', () => {
        // Arrange
        const buffer = new ArrayBuffer(16);
        const value = new DataView(buffer, 4, 8);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<DataView>');
      });

      it('Given custom class with methods, When called, Then return actual class name', () => {
        // Arrange
        class PersonClass {
          name: string = 'John';
          age: number = 30;
          greet = (): string => `Hello, ${this.name}`;
        }
        const value = new PersonClass();

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<PersonClass>');
      });

      it('Given inherited custom class, When called, Then return actual class name', () => {
        // Arrange
        class BaseClass {
          baseProp: string = 'base';
        }
        class DerivedClass extends BaseClass {
          derivedProp: string = 'derived';
        }
        const value = new DerivedClass();

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<DerivedClass>');
      });

      it('Given Map with entries, When called, Then return placeholder', () => {
        // Arrange
        const value = new Map([
          ['key1', 'value1'],
          ['key2', 'value2'],
        ]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<Map>');
      });

      it('Given Set with values, When called, Then return placeholder', () => {
        // Arrange
        const value = new Set([1, 2, 3, 4, 5]);

        // Act
        const result = _stringifyObject(value, agFormat.createContext(), defaultEnv);

        // Assert
        expect(result).toBe('<Set>');
      });
    });
  });
});
