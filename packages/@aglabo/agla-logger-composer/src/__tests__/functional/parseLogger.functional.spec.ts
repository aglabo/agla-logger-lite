// src: packages/@aglabo/agla-logger-composer/src/__tests__/functional/parseLogger.functional.spec.ts
// @(#) Functional tests for parseLogger - API level argument parsing
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import type { AGTLogMessage } from '../../../shared/types/AGTLoggerMessage.types.ts';
import { parseLogger } from '../../parseLogger.ts';

/**
 * Feature: parseLogger API
 * BDD テストスイート - API レベルでの引数解析機能を検証
 */
describe('Given: parseLogger API', () => {
  /**
   * Scenario: defaultTimestamp パラメータの処理
   */
  describe('When: parse arguments with defaultTimestamp parameter', () => {
    /**
     * Case: defaultTimestamp が指定された場合
     */
    it('Then: [正常] - uses provided defaultTimestamp when not null', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['test message'];
      const defaultTimestamp = new Date('2025-12-12T10:00:00.000Z');

      // Act
      const result: AGTLogMessage = parseLogger(label, messages, defaultTimestamp);

      // Assert
      expect(result.timestamp).toEqual(defaultTimestamp);
      expect(result.logLabel).toBe(label);
    });

    /**
     * Case: defaultTimestamp が null の場合
     */
    it('Then: [正常] - uses current time when defaultTimestamp is null', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['test message'];
      const beforeCall = new Date();

      // Act
      const result: AGTLogMessage = parseLogger(label, messages, null);

      // Assert
      const afterCall = new Date();
      expect(result.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
      expect(result.timestamp.getTime()).toBeLessThanOrEqual(afterCall.getTime());
    });
  });

  /**
   * Scenario: プリミティブ値の連結
   */
  describe('When: parse primitive values', () => {
    /**
     * Case: 文字列と数値の連結
     */
    it('Then: [正常] - primitive values are concatenated to message with spaces', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['User', 123, 'logged in', true];

      // Act
      const result: AGTLogMessage = parseLogger(label, messages);

      // Assert
      expect(result.messages).toEqual(['User', '123', 'logged in', 'true']);
      expect(result.values).toEqual([]);
    });

    /**
     * Case: symbol 型を含むプリミティブ値の連結
     */
    it('Then: [正常] - symbol values are included in message string', () => {
      // Arrange
      const label = 'INFO';
      const sym = Symbol('test-symbol');
      const messages = ['Event', sym, 'triggered'];

      // Act
      const result: AGTLogMessage = parseLogger(label, messages);

      // Assert
      expect(result.messages).toEqual(['Event', String(sym), 'triggered']);
      expect(result.values).toEqual([]);
    });
  });

  /**
   * Scenario: エッジケースの処理
   */
  describe('When: handle edge cases', () => {
    /**
     * Case: 空の messages 配列
     */
    it('Then: [エッジケース] - returns empty message and objects for empty array', () => {
      // Arrange
      const label = 'INFO';
      const messages: unknown[] = [];

      // Act
      const result: AGTLogMessage = parseLogger(label, messages);

      // Assert
      expect(result.messages).toEqual([]);
      expect(result.values).toEqual([]);
      expect(result.logLabel).toBe(label);
    });

    /**
     * Case: プリミティブと非プリミティブの複雑な混合
     */
    it('Then: [エッジケース] - correctly separates mixed primitive and non-primitive values', () => {
      // Arrange
      const label = 'DEBUG';
      const obj1 = { id: 1 };
      const obj2 = { name: 'test' };
      const arr = [1, 2, 3];
      const func = (): void => {};
      const messages = [
        'Start',
        obj1,
        123,
        'middle',
        arr,
        true,
        obj2,
        Symbol('sym'),
        func,
        'end',
      ];

      // Act
      const result: AGTLogMessage = parseLogger(label, messages);

      // Assert
      expect(result.messages).toContain('Start');
      expect(result.messages).toContain('123');
      expect(result.messages).toContain('middle');
      expect(result.messages).toContain('true');
      expect(result.messages).toContain('end');
      expect(result.values).toEqual([obj1, arr, obj2, func]);
    });
  });

  /**
   * Scenario: 非プリミティブ値の格納
   */
  describe('When: parse non-primitive values', () => {
    /**
     * Case: オブジェクトと配列の格納
     */
    it('Then: [正常] - non-primitive values are stored in objects array', () => {
      // Arrange
      const label = 'INFO';
      const obj = { userId: 123 };
      const arr = [1, 2, 3];
      const messages = ['User', obj, 'action', arr];

      // Act
      const result: AGTLogMessage = parseLogger(label, messages);

      // Assert
      expect(result.messages).toEqual(['User', 'action']);
      expect(result.values).toEqual([obj, arr]);
    });
  });
});
