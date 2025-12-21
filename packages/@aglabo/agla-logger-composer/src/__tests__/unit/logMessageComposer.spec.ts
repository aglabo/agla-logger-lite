// src: packages/@aglabo/agla-logger-composer/src/__tests__/unit/logMessageComposer.spec.ts
// @(#) Unit tests for logMessageComposer module
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _formatMessages, _formatValues } from '../../logMessageComposer.ts';

// ============================================================================
// Block 1: [正常] _formatMessages - Basic Cases
// ============================================================================

describe('[正常] _formatMessages - Basic Cases', () => {
  describe('T-01-001: Single message', () => {
    it('Given single message, When _formatMessages called, Then returns that message', () => {
      const input = ['Hello'];
      const expected = 'Hello';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-002: Two messages', () => {
    it('Given two messages, When _formatMessages called, Then joins with space', () => {
      const input = ['Hello', 'World'];
      const expected = 'Hello World';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-003: Three messages', () => {
    it('Given three messages, When _formatMessages called, Then joins all with spaces', () => {
      const input = ['First', 'Second', 'Third'];
      const expected = 'First Second Third';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-004: Messages with numbers', () => {
    it('Given messages with numbers, When _formatMessages called, Then preserves numbers', () => {
      const input = ['Error', '404', 'NotFound'];
      const expected = 'Error 404 NotFound';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-005: Messages with special characters', () => {
    it('Given messages with special chars, When _formatMessages called, Then preserves them', () => {
      const input = ['Module:', 'error@v1.0', 'failed!'];
      const expected = 'Module: error@v1.0 failed!';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-006: Messages with unicode', () => {
    it('Given messages with unicode, When _formatMessages called, Then preserves unicode', () => {
      const input = ['ユーザー', 'ログイン', '成功'];
      const expected = 'ユーザー ログイン 成功';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-01-007: Messages with emoji', () => {
    it('Given messages with emoji, When _formatMessages called, Then preserves emoji', () => {
      const input = ['Status', '✓', 'completed'];
      const expected = 'Status ✓ completed';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });
});

// ============================================================================
// Block 2: [エッジケース] _formatMessages - Edge Cases
// ============================================================================

describe('[エッジケース] _formatMessages - Edge Cases', () => {
  describe('T-02-001: Empty array', () => {
    it('Given empty array, When _formatMessages called, Then returns empty string', () => {
      const input: string[] = [];
      const expected = '';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-002: Single empty string', () => {
    it('Given single empty string, When _formatMessages called, Then filters it out and returns empty string', () => {
      const input = [''];
      const expected = '';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-003: Two empty strings', () => {
    it('Given two empty strings, When _formatMessages called, Then filters them out and returns empty string', () => {
      const input = ['', ''];
      const expected = '';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-004: Three empty strings', () => {
    it('Given three empty strings, When _formatMessages called, Then filters them out and returns empty string', () => {
      const input = ['', '', ''];
      const expected = '';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-005: Mixed empty and non-empty strings', () => {
    it('Given mixed empty and non-empty strings, When _formatMessages called, Then filters empty strings', () => {
      const input = ['', 'middle', ''];
      const expected = 'middle';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-006: Empty string at start', () => {
    it('Given empty string at start, When _formatMessages called, Then filters it out', () => {
      const input = ['', 'text', 'here'];
      const expected = 'text here';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-007: Empty string at end', () => {
    it('Given empty string at end, When _formatMessages called, Then filters it out', () => {
      const input = ['text', 'here', ''];
      const expected = 'text here';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-008: Multiple consecutive empty strings', () => {
    it('Given multiple consecutive empty strings, When _formatMessages called, Then filters all empty strings', () => {
      const input = ['start', '', '', '', 'end'];
      const expected = 'start end';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-009: Single whitespace character', () => {
    it('Given whitespace character, When _formatMessages called, Then preserves it', () => {
      const input = ['before', ' ', 'after'];
      const expected = 'before   after';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-010: String with only spaces', () => {
    it('Given string with only spaces, When _formatMessages called, Then preserves spaces', () => {
      const input = ['   ', 'text'];
      const expected = '    text';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-011: String with leading spaces', () => {
    it('Given string with leading spaces, When _formatMessages called, Then preserves leading spaces', () => {
      const input = ['  hello', 'world'];
      const expected = '  hello world';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-012: String with trailing spaces', () => {
    it('Given string with trailing spaces, When _formatMessages called, Then preserves trailing spaces', () => {
      const input = ['hello  ', 'world'];
      const expected = 'hello   world';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-013: String with both leading and trailing spaces', () => {
    it('Given string with both leading and trailing spaces, When _formatMessages called, Then preserves all spaces', () => {
      const input = ['  hello  ', 'world'];
      const expected = '  hello   world';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-014: Multiple strings with spaces around them', () => {
    it('Given multiple strings with spaces, When _formatMessages called, Then preserves all spaces', () => {
      const input = ['  start  ', '  middle  ', '  end  '];
      const expected = '  start     middle     end  ';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-015: Very long string', () => {
    it('Given very long string (1000 chars), When _formatMessages called, Then returns full content', () => {
      const longString = 'A'.repeat(1000);
      const input = [longString, 'end'];
      const expected = `${longString} end`;

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-016: Many messages', () => {
    it('Given many messages (100), When _formatMessages called, Then joins all with spaces', () => {
      const input = Array.from({ length: 100 }, (_, i) => `msg${i}`);
      const result = _formatMessages(input);

      expect(result).toContain('msg0');
      expect(result).toContain('msg99');
      expect(result).toContain(' msg');
    });
  });

  describe('T-02-017: Read-only array', () => {
    it('Given readonly array, When _formatMessages called, Then works correctly', () => {
      const input = ['a', 'b', 'c'] as const;
      const expected = 'a b c';

      const result = _formatMessages(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-02-018: Newline characters', () => {
    it('Given strings with newlines, When _formatMessages called, Then preserves newlines', () => {
      const input = ['line1\nline2', 'text'];
      const result = _formatMessages(input);

      expect(result).toContain('\n');
      expect(result).toContain('line1');
    });
  });

  describe('T-02-019: Tab characters', () => {
    it('Given strings with tabs, When _formatMessages called, Then preserves tabs', () => {
      const input = ['before\tafter', 'text'];
      const result = _formatMessages(input);

      expect(result).toContain('\t');
    });
  });
});

// ============================================================================
// Block 3: [正常] _formatValues - Basic Cases
// ============================================================================

describe('[正常] _formatValues - Basic Cases', () => {
  describe('T-03-001: Single number', () => {
    it('Given single number, When _formatValues called, Then returns stringified number', () => {
      const input = [42];
      const expected = '42';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-002: Single string', () => {
    it('Given single string, When _formatValues called, Then returns quoted string', () => {
      const input = ['hello'];
      const expected = '"hello"';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-003: Single boolean true', () => {
    it('Given single true, When _formatValues called, Then returns "true"', () => {
      const input = [true];
      const expected = 'true';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-004: Single boolean false', () => {
    it('Given single false, When _formatValues called, Then returns "false"', () => {
      const input = [false];
      const expected = 'false';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-005: Single null', () => {
    it('Given single null, When _formatValues called, Then returns "null"', () => {
      const input = [null];
      const expected = 'null';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-006: Single undefined', () => {
    it('Given single undefined, When _formatValues called, Then returns "undefined"', () => {
      const input = [undefined];
      const expected = 'undefined';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-007: Single object', () => {
    it('Given single object, When _formatValues called, Then returns JSON.stringify', () => {
      const input = [{ a: 1 }];
      const expected = '{"a": 1}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-008: Two objects', () => {
    it('Given two objects, When _formatValues called, Then wraps in braces with comma', () => {
      const input = [{ a: 1 }, { b: 2 }];
      const expected = '{{"a": 1}, {"b": 2}}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-009: Three objects', () => {
    it('Given three objects, When _formatValues called, Then wraps all in braces', () => {
      const input = [{ a: 1 }, { b: 2 }, { c: 3 }];
      const expected = '{{"a": 1}, {"b": 2}, {"c": 3}}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-03-010: Mixed types in array', () => {
    it('Given mixed types, When _formatValues called, Then formats each correctly', () => {
      const input = [42, 'string', true, null];
      const result = _formatValues(input);

      expect(result).toContain('42');
      expect(result).toContain('"string"');
      expect(result).toContain('true');
      expect(result).toContain('null');
    });
  });
});

// ============================================================================
// Block 4: [エッジケース] _formatValues - Edge Cases
// ============================================================================

describe('[エッジケース] _formatValues - Edge Cases', () => {
  describe('T-04-001: Empty array', () => {
    it('Given empty array, When _formatValues called, Then returns empty string', () => {
      const input: unknown[] = [];
      const expected = '';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-002: Empty object', () => {
    it('Given single empty object, When _formatValues called, Then returns "{}"', () => {
      const input = [{}];
      const expected = '{}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-003: Empty string value', () => {
    it('Given single empty string value, When _formatValues called, Then returns empty quoted string', () => {
      const input = [''];
      const expected = '""';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-004: Zero value', () => {
    it('Given zero, When _formatValues called, Then returns "0"', () => {
      const input = [0];
      const expected = '0';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-005: Negative number', () => {
    it('Given negative number, When _formatValues called, Then preserves sign', () => {
      const input = [-42];
      const expected = '-42';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-006: Float number', () => {
    it('Given float number, When _formatValues called, Then preserves decimal', () => {
      const input = [3.14159];
      const expected = '3.14159';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-007: NaN value', () => {
    it('Given NaN, When _formatValues called, Then returns "NaN"', () => {
      const input = [NaN];
      const expected = 'NaN';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-008: Infinity value', () => {
    it('Given Infinity, When _formatValues called, Then returns "Infinity"', () => {
      const input = [Infinity];
      const expected = 'Infinity';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-009: Negative Infinity value', () => {
    it('Given -Infinity, When _formatValues called, Then returns "-Infinity"', () => {
      const input = [-Infinity];
      const expected = '-Infinity';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-010: Array value', () => {
    it('Given array, When _formatValues called, Then returns JSON stringified array', () => {
      const input = [[1, 2, 3]];
      const result = _formatValues(input);

      expect(result).toContain('[');
      expect(result).toContain('1');
      expect(result).toContain('3');
    });
  });

  describe('T-04-011: Nested object', () => {
    it('Given nested object, When _formatValues called, Then preserves nesting', () => {
      const input = [{ a: { b: { c: 1 } } }];
      const result = _formatValues(input);

      expect(result).toContain('"a"');
      expect(result).toContain('"b"');
      expect(result).toContain('"c"');
      expect(result).toContain('1');
    });
  });

  describe('T-04-012: Object with undefined property', () => {
    it('Given object with undefined, When _formatValues called, Then includes undefined', () => {
      const input = [{ a: undefined }];
      const result = _formatValues(input);

      expect(result).toContain('undefined');
    });
  });

  describe('T-04-013: Object with NaN property', () => {
    it('Given object with NaN property, When _formatValues called, Then includes NaN', () => {
      const input = [{ value: NaN }];
      const result = _formatValues(input);

      expect(result).toContain('NaN');
    });
  });

  describe('T-04-014: Object with function property', () => {
    it('Given object with function, When _formatValues called, Then formats as function', () => {
      const input = [{ fn: () => {}, value: 1 }];
      const result = _formatValues(input);

      expect(result).toContain('Function');
      expect(result).toContain('value');
    });
  });

  describe('T-04-015: Multiple null values', () => {
    it('Given multiple null values, When _formatValues called, Then wraps in braces', () => {
      const input = [null, null, null];
      const expected = '{null, null, null}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-016: Multiple undefined values', () => {
    it('Given multiple undefined values, When _formatValues called, Then wraps in braces', () => {
      const input = [undefined, undefined];
      const expected = '{undefined, undefined}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-017: Large array', () => {
    it('Given large array (1000 items), When _formatValues called, Then includes items', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const input = [largeArray];
      const result = _formatValues(input);

      expect(result).toContain('[');
      expect(result).toContain('0');
      expect(result).toContain('999');
    });
  });

  describe('T-04-018: Unicode characters', () => {
    it('Given unicode in object, When _formatValues called, Then preserves unicode', () => {
      const input = [{ ja: 'テスト', emoji: '🚀' }];
      const result = _formatValues(input);

      expect(result).toContain('テスト');
      expect(result).toContain('🚀');
    });
  });

  describe('T-04-019: Escaped characters in string', () => {
    it('Given string with escapes, When _formatValues called, Then preserves escapes', () => {
      const input = [{ path: 'C:\\\\Users\\\\test' }];
      const result = _formatValues(input);

      expect(result).toContain('Users');
    });
  });

  describe('T-04-020: Circular reference', () => {
    it('Given circular reference, When _formatValues called, Then displays circular marker', () => {
      const obj: Record<string, unknown> = { a: 1 };
      obj.self = obj;
      const input = [obj];
      const result = _formatValues(input);

      expect(result).toContain('<Circular>');
    });
  });

  describe('T-04-021: Two empty objects', () => {
    it('Given two empty objects, When _formatValues called, Then wraps both in braces', () => {
      const input = [{}, {}];
      const expected = '{{}, {}}';

      const result = _formatValues(input);

      expect(result).toBe(expected);
    });
  });

  describe('T-04-022: Mixed empty and non-empty objects', () => {
    it('Given mixed empty and non-empty objects, When _formatValues called, Then formats all', () => {
      const input = [{}, { a: 1 }, {}];
      const result = _formatValues(input);

      expect(result).toContain('{}');
      expect(result).toContain('{"a": 1}');
    });
  });

  describe('T-04-023: Object with numeric key', () => {
    it('Given object with numeric string key, When _formatValues called, Then preserves key', () => {
      const input = [{ '123': 'value', a: 'test' }];
      const result = _formatValues(input);

      expect(result).toContain('123');
      expect(result).toContain('value');
    });
  });

  describe('T-04-024: Very deeply nested object', () => {
    it('Given deeply nested object (10 levels), When _formatValues called, Then preserves all levels', () => {
      let nested: unknown = 1;
      for (let i = 0; i < 10; i++) {
        nested = { [`level${i}`]: nested };
      }
      const input = [nested];
      const result = _formatValues(input);

      expect(result).toContain('level0');
      expect(result).toContain('level9');
    });
  });

  describe('T-04-025: Symbol value', () => {
    it('Given symbol, When _formatValues called, Then handles symbol', () => {
      const sym = Symbol('test');
      const input = [sym];
      const result = _formatValues(input);

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });
  });
});
