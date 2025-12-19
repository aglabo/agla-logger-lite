// src: packages/@aglabo/agla-logger-composer/src/validators/__tests__/unit/stringifiableType.spec.ts
// @(#) Unit tests for stringifiableType type detection
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTStringifiableType } from '#shared/types/AGTstringifiableType.types.ts';
import { describe, expect, it } from 'vitest';
import { _stringifiableType } from '../../stringifiableType';

// ============================================================================
// Block 1: [正常] _stringifiableType - Date Detection
// ============================================================================

describe('[正常] _stringifiableType - Date Detection', () => {
  describe('T1-001: Date object detection', () => {
    it('Given Date instance, When _stringifiableType called, Then returns Date type', () => {
      const date = new Date('2025-01-01T00:00:00.000Z');

      const result = _stringifiableType(date);

      expect(result).toBe(AGTStringifiableType.Date);
    });
  });

  describe('T1-002: Current date detection', () => {
    it('Given new Date(), When _stringifiableType called, Then returns Date type', () => {
      const result = _stringifiableType(new Date());

      expect(result).toBe(AGTStringifiableType.Date);
    });
  });

  describe('T1-003: Invalid date detection', () => {
    it('Given Invalid Date, When _stringifiableType called, Then returns Date type', () => {
      const invalidDate = new Date('invalid');

      const result = _stringifiableType(invalidDate);

      expect(result).toBe(AGTStringifiableType.Date);
    });
  });
});

// ============================================================================
// Block 2: [正常] _stringifiableType - RegExp Detection
// ============================================================================

describe('[正常] _stringifiableType - RegExp Detection', () => {
  describe('T2-001: RegExp literal detection', () => {
    it('Given RegExp literal /test/, When _stringifiableType called, Then returns RegExp type', () => {
      const regex = /test/;

      const result = _stringifiableType(regex);

      expect(result).toBe(AGTStringifiableType.RegExp);
    });
  });

  describe('T2-002: RegExp constructor detection', () => {
    it('Given new RegExp(), When _stringifiableType called, Then returns RegExp type', () => {
      const regex = new RegExp('test', 'gi');

      const result = _stringifiableType(regex);

      expect(result).toBe(AGTStringifiableType.RegExp);
    });
  });

  describe('T2-003: RegExp with flags detection', () => {
    it('Given RegExp with multiple flags, When _stringifiableType called, Then returns RegExp type', () => {
      const regex = /pattern/gimsuy;

      const result = _stringifiableType(regex);

      expect(result).toBe(AGTStringifiableType.RegExp);
    });
  });
});

// ============================================================================
// Block 3: [正常] _stringifiableType - Error Detection
// ============================================================================

describe('[正常] _stringifiableType - Error Detection', () => {
  describe('T3-001: Error instance detection', () => {
    it('Given Error instance, When _stringifiableType called, Then returns Error type', () => {
      const error = new Error('test error');

      const result = _stringifiableType(error);

      expect(result).toBe(AGTStringifiableType.Error);
    });
  });

  describe('T3-002: TypeError detection', () => {
    it('Given TypeError instance, When _stringifiableType called, Then returns Error type', () => {
      const error = new TypeError('test');

      const result = _stringifiableType(error);

      expect(result).toBe(AGTStringifiableType.Error);
    });
  });

  describe('T3-003: RangeError detection', () => {
    it('Given RangeError instance, When _stringifiableType called, Then returns Error type', () => {
      const error = new RangeError('range exceeded');

      const result = _stringifiableType(error);

      expect(result).toBe(AGTStringifiableType.Error);
    });
  });

  describe('T3-004: SyntaxError detection', () => {
    it('Given SyntaxError instance, When _stringifiableType called, Then returns Error type', () => {
      const error = new SyntaxError('syntax issue');

      const result = _stringifiableType(error);

      expect(result).toBe(AGTStringifiableType.Error);
    });
  });

  describe('T3-005: Custom error detection', () => {
    it('Given custom Error subclass, When _stringifiableType called, Then returns Error type', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }
      const error = new CustomError('custom');

      const result = _stringifiableType(error);

      expect(result).toBe(AGTStringifiableType.Error);
    });
  });
});

// ============================================================================
// Block 4: [正常] _stringifiableType - Collection Detection
// ============================================================================

describe('[正常] _stringifiableType - Collection Detection', () => {
  describe('T4-001: Map detection', () => {
    it('Given Map instance, When _stringifiableType called, Then returns Map type', () => {
      const map = new Map([['key', 'value']]);

      const result = _stringifiableType(map);

      expect(result).toBe(AGTStringifiableType.Map);
    });
  });

  describe('T4-002: Empty Map detection', () => {
    it('Given empty Map, When _stringifiableType called, Then returns Map type', () => {
      const map = new Map();

      const result = _stringifiableType(map);

      expect(result).toBe(AGTStringifiableType.Map);
    });
  });

  describe('T4-003: Set detection', () => {
    it('Given Set instance, When _stringifiableType called, Then returns Set type', () => {
      const set = new Set([1, 2, 3]);

      const result = _stringifiableType(set);

      expect(result).toBe(AGTStringifiableType.Set);
    });
  });

  describe('T4-004: Empty Set detection', () => {
    it('Given empty Set, When _stringifiableType called, Then returns Set type', () => {
      const set = new Set();

      const result = _stringifiableType(set);

      expect(result).toBe(AGTStringifiableType.Set);
    });
  });
});

// ============================================================================
// Block 5: [正常] _stringifiableType - TypedArray Detection
// ============================================================================

describe('[正常] _stringifiableType - TypedArray Detection', () => {
  describe('T5-001: Uint8Array detection', () => {
    it('Given Uint8Array, When _stringifiableType called, Then returns TypedArray type', () => {
      const arr = new Uint8Array([1, 2, 3]);

      const result = _stringifiableType(arr);

      expect(result).toBe(AGTStringifiableType.TypedArray);
    });
  });

  describe('T5-002: Int32Array detection', () => {
    it('Given Int32Array, When _stringifiableType called, Then returns TypedArray type', () => {
      const arr = new Int32Array([1, 2, 3]);

      const result = _stringifiableType(arr);

      expect(result).toBe(AGTStringifiableType.TypedArray);
    });
  });

  describe('T5-003: Float64Array detection', () => {
    it('Given Float64Array, When _stringifiableType called, Then returns TypedArray type', () => {
      const arr = new Float64Array([1.5, 2.5]);

      const result = _stringifiableType(arr);

      expect(result).toBe(AGTStringifiableType.TypedArray);
    });
  });

  describe('T5-004: BigInt64Array detection', () => {
    it('Given BigInt64Array, When _stringifiableType called, Then returns TypedArray type', () => {
      const arr = new BigInt64Array([1n, 2n]);

      const result = _stringifiableType(arr);

      expect(result).toBe(AGTStringifiableType.TypedArray);
    });
  });
});

// ============================================================================
// Block 6: [正常] _stringifiableType - Buffer Detection
// ============================================================================

describe('[正常] _stringifiableType - Buffer Detection', () => {
  describe('T6-001: ArrayBuffer detection', () => {
    it('Given ArrayBuffer, When _stringifiableType called, Then returns ArrayBuffer type', () => {
      const buffer = new ArrayBuffer(16);

      const result = _stringifiableType(buffer);

      expect(result).toBe(AGTStringifiableType.ArrayBuffer);
    });
  });

  describe('T6-002: DataView detection', () => {
    it('Given DataView, When _stringifiableType called, Then returns DataView type', () => {
      const buffer = new ArrayBuffer(16);
      const view = new DataView(buffer);

      const result = _stringifiableType(view);

      expect(result).toBe(AGTStringifiableType.DataView);
    });
  });
});

// ============================================================================
// Block 7: [正常] _stringifiableType - Custom Class Detection
// ============================================================================

describe('[正常] _stringifiableType - Custom Class Detection', () => {
  describe('T7-001: Custom class detection', () => {
    it('Given custom class instance, When _stringifiableType called, Then returns CustomClass type', () => {
      class MyClass {
        value = 42;
      }
      const instance = new MyClass();

      const result = _stringifiableType(instance);

      expect(result).toBe(AGTStringifiableType.CustomClass);
    });
  });

  describe('T7-002: Class with methods detection', () => {
    it('Given class with methods, When _stringifiableType called, Then returns CustomClass type', () => {
      class MyClass {
        method(): void {}
      }
      const instance = new MyClass();

      const result = _stringifiableType(instance);

      expect(result).toBe(AGTStringifiableType.CustomClass);
    });
  });

  describe('T7-003: Class inheritance detection', () => {
    it('Given inherited class instance, When _stringifiableType called, Then returns CustomClass type', () => {
      class Parent {
        parentValue = 1;
      }
      class Child extends Parent {
        childValue = 2;
      }
      const instance = new Child();

      const result = _stringifiableType(instance);

      expect(result).toBe(AGTStringifiableType.CustomClass);
    });
  });
});

// ============================================================================
// Block 8: [エッジケース] Non-Special Types
// ============================================================================

describe('[エッジケース] _stringifiableType - Non-Special Types', () => {
  describe('T8-001: Plain object returns undefined', () => {
    it('Given plain object, When _stringifiableType called, Then returns undefined', () => {
      const obj = { a: 1 };

      const result = _stringifiableType(obj);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-002: Array returns undefined', () => {
    it('Given array, When _stringifiableType called, Then returns undefined', () => {
      const arr = [1, 2, 3];

      const result = _stringifiableType(arr);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-003: String returns undefined', () => {
    it('Given string, When _stringifiableType called, Then returns undefined', () => {
      const str = 'test';

      const result = _stringifiableType(str);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-004: Number returns undefined', () => {
    it('Given number, When _stringifiableType called, Then returns undefined', () => {
      const num = 42;

      const result = _stringifiableType(num);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-005: Boolean returns undefined', () => {
    it('Given boolean, When _stringifiableType called, Then returns undefined', () => {
      const bool = true;

      const result = _stringifiableType(bool);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-006: Null returns undefined', () => {
    it('Given null, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(null);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-007: Undefined returns undefined', () => {
    it('Given undefined, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(undefined);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-008: Symbol returns undefined', () => {
    it('Given symbol, When _stringifiableType called, Then returns undefined', () => {
      const sym = Symbol('test');

      const result = _stringifiableType(sym);

      expect(result).toBeUndefined();
    });
  });

  describe('T8-009: Function returns undefined', () => {
    it('Given function, When _stringifiableType called, Then returns undefined', () => {
      const func = (): void => {};

      const result = _stringifiableType(func);

      expect(result).toBeUndefined();
    });
  });
});

// ============================================================================
// Block 9: [エッジケース] Edge Cases
// ============================================================================

describe('[エッジケース] _stringifiableType - Edge Cases', () => {
  describe('T9-001: Object with properties', () => {
    it('Given object with properties, When _stringifiableType called, Then returns undefined', () => {
      const obj = { prop1: 'value1', prop2: 42 };

      const result = _stringifiableType(obj);

      expect(result).toBeUndefined();
    });
  });

  describe('T9-002: Nested Map in object', () => {
    it('Given Map as property (not passed directly), When _stringifiableType called, Then detects Map correctly', () => {
      const map = new Map();

      const result = _stringifiableType(map);

      expect(result).toBe(AGTStringifiableType.Map);
    });
  });

  describe('T9-003: Frozen object', () => {
    it('Given frozen object, When _stringifiableType called, Then returns undefined', () => {
      const obj = Object.freeze({ a: 1 });

      const result = _stringifiableType(obj);

      expect(result).toBeUndefined();
    });
  });

  describe('T9-004: Sealed object', () => {
    it('Given sealed object, When _stringifiableType called, Then returns undefined', () => {
      const obj = Object.seal({ a: 1 });

      const result = _stringifiableType(obj);

      expect(result).toBeUndefined();
    });
  });

  describe('T9-005: Proxy object wrapping special type', () => {
    it('Given Proxy wrapping Date, When _stringifiableType called, Then detects Date', () => {
      const date = new Date();
      const proxy = new Proxy(date, {});

      const result = _stringifiableType(proxy);

      expect(result).toBe(AGTStringifiableType.Date);
    });
  });

  describe('T9-006: Date subclass detection', () => {
    it('Given Date subclass instance, When _stringifiableType called, Then returns Date type', () => {
      class CustomDate extends Date {}
      const customDate = new CustomDate('2025-01-01');

      const result = _stringifiableType(customDate);

      expect(result).toBe(AGTStringifiableType.Date);
    });
  });

  describe('T9-007: Map with various key types', () => {
    it('Given Map with mixed key types, When _stringifiableType called, Then returns Map type', () => {
      const map = new Map<string | number | symbol, string>([
        ['string', 'value'],
        [123, 'numeric'],
        [Symbol('sym'), 'symbol'],
      ] as Array<[string | number | symbol, string]>);

      const result = _stringifiableType(map);

      expect(result).toBe(AGTStringifiableType.Map);
    });
  });

  describe('T9-008: Large ArrayBuffer', () => {
    it('Given large ArrayBuffer, When _stringifiableType called, Then returns ArrayBuffer type', () => {
      const buffer = new ArrayBuffer(1024 * 1024);

      const result = _stringifiableType(buffer);

      expect(result).toBe(AGTStringifiableType.ArrayBuffer);
    });
  });

  describe('T9-009: Circular reference in Map', () => {
    it('Given Map with circular reference, When _stringifiableType called, Then returns Map type', () => {
      const map = new Map();
      map.set('self', map);

      const result = _stringifiableType(map);

      expect(result).toBe(AGTStringifiableType.Map);
    });
  });

  describe('T9-010: Multiple inheritance chain', () => {
    it('Given multi-level inheritance, When _stringifiableType called, Then returns CustomClass type', () => {
      class A {}
      class B extends A {}
      class C extends B {}
      const instance = new C();

      const result = _stringifiableType(instance);

      expect(result).toBe(AGTStringifiableType.CustomClass);
    });
  });
});

// ============================================================================
// Block 10: [異常] Type Boundaries
// ============================================================================

describe('[異常] _stringifiableType - Type Boundaries', () => {
  describe('T10-001: NaN handling', () => {
    it('Given NaN, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(NaN);

      expect(result).toBeUndefined();
    });
  });

  describe('T10-002: Infinity handling', () => {
    it('Given Infinity, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(Infinity);

      expect(result).toBeUndefined();
    });
  });

  describe('T10-003: Empty string handling', () => {
    it('Given empty string, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType('');

      expect(result).toBeUndefined();
    });
  });

  describe('T10-004: Zero handling', () => {
    it('Given zero, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(0);

      expect(result).toBeUndefined();
    });
  });

  describe('T10-005: False handling', () => {
    it('Given false, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType(false);

      expect(result).toBeUndefined();
    });
  });

  describe('T10-006: Empty array handling', () => {
    it('Given empty array, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType([]);

      expect(result).toBeUndefined();
    });
  });

  describe('T10-007: Empty object handling', () => {
    it('Given empty object, When _stringifiableType called, Then returns undefined', () => {
      const result = _stringifiableType({});

      expect(result).toBeUndefined();
    });
  });
});
