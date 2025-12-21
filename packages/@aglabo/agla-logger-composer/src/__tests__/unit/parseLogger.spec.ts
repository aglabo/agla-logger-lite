// src: packages/@aglabo/agla-logger-composer/src/__tests__/unit/parseLogger.spec.ts
// @(#) Unit tests for parseLogger function
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { parseLogger } from '../../parseLogger';

// ============================================================================
// Block 1: [正常] parseLogger - Basic Cases
// ============================================================================

describe('[正常] parseLogger - Basic Cases', () => {
  describe('T1-001: Primitive value handling', () => {
    it('Given string argument, When parseLogger called, Then stored in messages array', () => {
      const label = 'INFO';
      const messages = ['test message'];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('test message');
      expect(result.values).toEqual([]);
      expect(result.logLabel).toBe('INFO');
    });
  });

  describe('T1-002: Multiple primitives', () => {
    it('Given mixed primitive types, When parseLogger called, Then all in messages', () => {
      const label = 'DEBUG';
      const messages = ['User', 123, true];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('User');
      expect(result.messages).toContain('123');
      expect(result.messages).toContain('true');
      expect(result.values).toEqual([]);
    });
  });

  describe('T1-003: Non-primitive value handling', () => {
    it('Given object argument, When parseLogger called, Then stored in values array', () => {
      const label = 'INFO';
      const obj = { id: 1 };
      const messages = [obj];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toContain(obj);
    });
  });

  describe('T1-004: Mixed primitive and non-primitive', () => {
    it('Given mixed primitives and objects, When parseLogger called, Then separated correctly', () => {
      const label = 'WARN';
      const obj = { error: true };
      const arr = [1, 2, 3];
      const messages = ['Error', obj, 'details', arr];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('Error');
      expect(result.messages).toContain('details');
      expect(result.values).toContain(obj);
      expect(result.values).toContain(arr);
      expect(result.messages.length).toBe(2);
      expect(result.values.length).toBe(2);
    });
  });

  describe('T1-005: Special primitive values', () => {
    it('Given null, undefined, NaN, Infinity, When parseLogger called, Then all in messages', () => {
      const label = 'DEBUG';
      const messages = [null, undefined, NaN, Infinity];

      const result = parseLogger(label, messages);

      expect(result.messages.length).toBe(4);
      expect(result.values).toEqual([]);
    });
  });

  describe('T1-006: Symbol handling', () => {
    it('Given symbol, When parseLogger called, Then converted to string in messages', () => {
      const label = 'INFO';
      const sym = Symbol('test');
      const messages = ['Event', sym];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('Event');
      expect(result.messages.some((m) => m.includes('Symbol'))).toBe(true);
      expect(result.values).toEqual([]);
    });
  });

  describe('T1-007: Function handling', () => {
    it('Given function, When parseLogger called, Then stored in values', () => {
      const label = 'DEBUG';
      const func = (): void => {};
      const messages = ['Func', func];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('Func');
      expect(result.values).toContain(func);
    });
  });

  describe('T1-008: Boolean values', () => {
    it('Given boolean true/false, When parseLogger called, Then both in messages', () => {
      const label = 'INFO';
      const messages = [true, false];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('true');
      expect(result.messages).toContain('false');
      expect(result.values).toEqual([]);
    });
  });

  describe('T1-009: Zero and empty string', () => {
    it('Given zero and empty string, When parseLogger called, Then both in messages', () => {
      const label = 'DEBUG';
      const messages = [0, ''];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('0');
      expect(result.messages).toContain('');
      expect(result.values).toEqual([]);
    });
  });
});

// ============================================================================
// Block 2: [正常] Timestamp Handling
// ============================================================================

describe('[正常] parseLogger - Timestamp Handling', () => {
  describe('T2-001: Default timestamp usage', () => {
    it('Given null defaultTimestamp, When parseLogger called, Then uses current time', () => {
      const label = 'INFO';
      const messages = ['test'];
      const beforeCall = new Date();

      const result = parseLogger(label, messages, null);

      const afterCall = new Date();
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime(),
      );
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(
        afterCall.getTime(),
      );
    });
  });

  describe('T2-002: Provided timestamp usage', () => {
    it('Given explicit defaultTimestamp, When parseLogger called, Then uses provided timestamp', () => {
      const label = 'INFO';
      const messages = ['test'];
      const timestamp = new Date('2025-01-01T00:00:00.000Z');

      const result = parseLogger(label, messages, timestamp);

      expect(result.timestamp).toEqual(timestamp);
    });
  });

  describe('T2-003: Default timestamp undefined behavior', () => {
    it('Given undefined defaultTimestamp (not passed), When parseLogger called, Then uses current time', () => {
      const label = 'INFO';
      const messages = ['test'];
      const beforeCall = new Date();

      const result = parseLogger(label, messages);

      const afterCall = new Date();
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(
        beforeCall.getTime(),
      );
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(
        afterCall.getTime(),
      );
    });
  });

  describe('T2-004: Immutable log message', () => {
    it('Given parsed log message, When attempting mutation, Then object is frozen', () => {
      const label = 'INFO';
      const messages = ['test'];

      const result = parseLogger(label, messages);

      expect(Object.isFrozen(result)).toBe(true);
    });
  });
});

// ============================================================================
// Block 3: [エッジケース] Edge Cases
// ============================================================================

describe('[エッジケース] parseLogger - Edge Cases', () => {
  describe('T3-001: Empty messages array', () => {
    it('Given empty array, When parseLogger called, Then both messages and values empty', () => {
      const label = 'INFO';
      const messages: unknown[] = [];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toEqual([]);
      expect(result.logLabel).toBe('INFO');
    });
  });

  describe('T3-002: Only non-primitives', () => {
    it('Given only objects and arrays, When parseLogger called, Then messages empty, values populated', () => {
      const label = 'DEBUG';
      const obj1 = { a: 1 };
      const arr1 = [1, 2, 3];
      const messages = [obj1, arr1];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toEqual([obj1, arr1]);
    });
  });

  describe('T3-003: Only primitives', () => {
    it('Given only primitives, When parseLogger called, Then messages populated, values empty', () => {
      const label = 'WARN';
      const messages = ['msg1', 123, true, null];

      const result = parseLogger(label, messages);

      expect(result.messages.length).toBe(4);
      expect(result.values).toEqual([]);
    });
  });

  describe('T3-004: Large number of arguments', () => {
    it('Given 100 mixed arguments, When parseLogger called, Then all categorized correctly', () => {
      const messages = Array.from(
        { length: 100 },
        (_, i) => (i % 2 === 0 ? i : { index: i }),
      );

      const result = parseLogger('DEBUG', messages);

      expect(result.messages.length).toBe(50);
      expect(result.values.length).toBe(50);
    });
  });

  describe('T3-005: Nested objects', () => {
    it('Given deeply nested object, When parseLogger called, Then stored in values', () => {
      const label = 'INFO';
      const nested = { a: { b: { c: { d: 1 } } } };
      const messages = ['nested', nested];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('nested');
      expect(result.values).toContain(nested);
    });
  });

  describe('T3-006: Array of primitives vs array object', () => {
    it('Given array of primitives, When parseLogger called, Then array itself goes to values', () => {
      const label = 'DEBUG';
      const arr = [1, 2, 3, 'text', true];
      const messages = ['array', arr];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('array');
      expect(result.values).toContain(arr);
    });
  });

  describe('T3-007: Long label string', () => {
    it('Given very long label, When parseLogger called, Then label preserved as-is', () => {
      const longLabel = 'L'.repeat(1000);
      const messages = ['test'];

      const result = parseLogger(longLabel, messages);

      expect(result.logLabel).toBe(longLabel);
      expect(result.logLabel.length).toBe(1000);
    });
  });

  describe('T3-008: Unicode in arguments', () => {
    it('Given unicode strings, When parseLogger called, Then preserved in messages', () => {
      const label = 'INFO';
      const messages = ['ユーザー', 'ログイン', '成功'];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('ユーザー');
      expect(result.messages).toContain('ログイン');
      expect(result.messages).toContain('成功');
    });
  });

  describe('T3-009: Empty object and empty array', () => {
    it('Given empty object and empty array, When parseLogger called, Then both in values', () => {
      const label = 'DEBUG';
      const obj = {};
      const arr: unknown[] = [];
      const messages = [obj, arr];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toEqual([obj, arr]);
    });
  });

  describe('T3-010: Circular reference argument', () => {
    it('Given object with circular reference, When parseLogger called, Then stored in values', () => {
      const label = 'WARN';
      const circular: Record<string, unknown> = { a: 1 };
      circular.self = circular;
      const messages = ['circular', circular];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('circular');
      expect(result.values).toContain(circular);
      expect(result.values[0]).toBe(circular);
    });
  });

  describe('T3-011: Multiple arrays with different contents', () => {
    it('Given multiple arrays with various contents, When parseLogger called, Then all in values', () => {
      const label = 'DEBUG';
      const arr1 = [1, 2, 3];
      const arr2 = ['a', 'b', 'c'];
      const arr3: unknown[] = [];
      const messages = ['arrays', arr1, arr2, arr3];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('arrays');
      expect(result.values).toEqual([arr1, arr2, arr3]);
    });
  });

  describe('T3-012: Mixed date and primitive', () => {
    it('Given Date object mixed with primitives, When parseLogger called, Then Date in values', () => {
      const label = 'INFO';
      const date = new Date('2025-01-01T00:00:00.000Z');
      const messages = ['timestamp', date, 'event'];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('timestamp');
      expect(result.messages).toContain('event');
      expect(result.values).toContain(date);
    });
  });
});

// ============================================================================
// Block 4: [異常] Error Cases and Type Boundaries
// ============================================================================

describe('[異常] parseLogger - Error Cases and Type Boundaries', () => {
  describe('T4-001: Null handling', () => {
    it('Given null in messages, When parseLogger called, Then null goes to messages', () => {
      const label = 'DEBUG';
      const messages = [null];

      const result = parseLogger(label, messages);

      expect(result.messages.length).toBe(1);
      expect(result.messages[0]).toBe('null');
      expect(result.values).toEqual([]);
    });
  });

  describe('T4-002: Undefined handling', () => {
    it('Given undefined in messages, When parseLogger called, Then undefined goes to messages', () => {
      const label = 'INFO';
      const messages = [undefined];

      const result = parseLogger(label, messages);

      expect(result.messages.length).toBe(1);
      expect(result.messages[0]).toBe('undefined');
      expect(result.values).toEqual([]);
    });
  });

  describe('T4-003: NaN handling', () => {
    it('Given NaN in messages, When parseLogger called, Then NaN goes to messages', () => {
      const label = 'WARN';
      const messages = [NaN];

      const result = parseLogger(label, messages);

      expect(result.messages.length).toBe(1);
      expect(result.messages[0]).toBe('NaN');
      expect(result.values).toEqual([]);
    });
  });

  describe('T4-004: Infinity handling', () => {
    it('Given Infinity in messages, When parseLogger called, Then Infinity goes to messages', () => {
      const label = 'ERROR';
      const messages = [Infinity, -Infinity];

      const result = parseLogger(label, messages);

      expect(result.messages).toContain('Infinity');
      expect(result.messages).toContain('-Infinity');
      expect(result.values).toEqual([]);
    });
  });

  describe('T4-005: Class instance handling', () => {
    it('Given class instance, When parseLogger called, Then goes to values', () => {
      class CustomClass {
        value = 42;
      }
      const label = 'DEBUG';
      const instance = new CustomClass();
      const messages = [instance];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toContain(instance);
    });
  });

  describe('T4-006: Map and Set handling', () => {
    it('Given Map and Set, When parseLogger called, Then both in values', () => {
      const label = 'INFO';
      const map = new Map([['key', 'value']]);
      const set = new Set([1, 2, 3]);
      const messages = [map, set];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toEqual([map, set]);
    });
  });

  describe('T4-007: RegExp handling', () => {
    it('Given RegExp, When parseLogger called, Then goes to values', () => {
      const label = 'DEBUG';
      const regex = /test/gi;
      const messages = [regex];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toContain(regex);
    });
  });

  describe('T4-008: Error object handling', () => {
    it('Given Error object, When parseLogger called, Then goes to values', () => {
      const label = 'ERROR';
      const error = new Error('test error');
      const messages = [error];

      const result = parseLogger(label, messages);

      expect(result.messages).toEqual([]);
      expect(result.values).toContain(error);
    });
  });
});
