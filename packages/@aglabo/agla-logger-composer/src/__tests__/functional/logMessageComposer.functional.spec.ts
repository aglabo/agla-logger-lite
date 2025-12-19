// src: packages/@aglabo/agla-logger-composer/src/__tests__/functional/logMessageComposer.functional.spec.ts
// @(#) Functional tests for logMessageComposer module
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _formatMessages, _formatValues } from '../../logMessageComposer.ts';

// Feature レベル (Given)
describe('Given: logMessageComposer module for integration testing', () => {
  // Scenario レベル (When)
  describe('When: _formatMessages() is called with complex inputs', () => {
    it('Given messages with mixed content types, When parsing, Then handles correctly', () => {
      // Arrange
      const input = ['Start', 'error@v1.0', 'Code:404', 'Status:NotFound'];
      const expected = 'Start error@v1.0 Code:404 Status:NotFound';

      // Act
      const result = _formatMessages(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('Given messages with unicode and special chars, When parsing, Then preserves all', () => {
      // Arrange
      const input = ['ユーザー', 'ログイン', '成功✓', 'Code:200'];
      const expected = 'ユーザー ログイン 成功✓ Code:200';

      // Act
      const result = _formatMessages(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('Given messages with newlines and escapes, When parsing, Then preserves structure', () => {
      // Arrange
      const input = ['Path:', 'C:\\Users\\test', 'Status:\nsuccess'];
      const result = _formatMessages(input);

      // Assert
      expect(result).toContain('C:\\Users\\test');
      expect(result).toContain('\n');
    });

    it('Given large number of messages, When parsing, Then joins all efficiently', () => {
      // Arrange
      const input = Array.from({ length: 50 }, (_, i) => `msg${i}`);
      const result = _formatMessages(input);

      // Assert
      expect(result).toContain('msg0');
      expect(result).toContain('msg49');
      expect(result.split(' ').length).toBe(50);
    });
  });

  // Scenario レベル (When)
  describe('When: _formatValues() is called with complex inputs', () => {
    it('Given deeply nested object structure, When parsing, Then preserves all nesting levels', () => {
      // Arrange
      const input = [{ a: { b: { c: { d: { e: { f: 1 } } } } } }];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('"a"');
      expect(result).toContain('"f": 1');
    });

    it('Given large array value, When parsing, Then handles efficiently', () => {
      // Arrange
      const largeArray = Array.from({ length: 100 }, (_, i) => i);
      const input = [largeArray];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('[');
      expect(result).toContain(']');
      expect(result).toContain('0');
      expect(result).toContain('99');
    });

    it('Given unicode characters in object, When parsing, Then preserves in JSON', () => {
      // Arrange
      const input = [{ emoji: '😀🚀', japanese: 'テスト', korean: '테스트' }];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('emoji');
      expect(result).toContain('😀');
      expect(result).toContain('テスト');
      expect(result).toContain('테스트');
    });

    it('Given circular reference, When parsing, Then displays circular marker safely', () => {
      // Arrange
      const circular: Record<string, unknown> = { a: 1 };
      circular.self = circular;
      const input = [circular];
      const expected = '{"a": 1, "self": {<Circular>}}';

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('Given multiple circular references, When parsing, Then handles all safely', () => {
      // Arrange
      const obj1: Record<string, unknown> = { name: 'obj1' };
      const obj2: Record<string, unknown> = { name: 'obj2' };
      obj1.ref = obj2;
      obj2.ref = obj1;
      const input = [obj1, obj2];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('obj1');
      expect(result).toContain('obj2');
      expect(result).toContain('<Circular>');
    });

    it('Given mixed types with special values, When parsing, Then formats correctly', () => {
      // Arrange
      const input = [
        { value: NaN, infinity: Infinity, negInf: -Infinity },
        { fn: () => {}, undef: undefined },
      ];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('NaN');
      expect(result).toContain('Infinity');
      expect(result).toContain('Function');
      expect(result).toContain('undefined');
    });

    it('Given object with many properties, When parsing, Then preserves all', () => {
      // Arrange
      const largeObj = Object.fromEntries(
        Array.from({ length: 50 }, (_, i) => [`key${i}`, i]),
      );
      const input = [largeObj];

      // Act
      const result = _formatValues(input);

      // Assert
      expect(result).toContain('key0');
      expect(result).toContain('key49');
      expect(result).toContain('0');
      expect(result).toContain('49');
    });
  });
});
