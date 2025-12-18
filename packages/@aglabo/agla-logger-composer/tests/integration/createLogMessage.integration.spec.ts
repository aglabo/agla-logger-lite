// src: packages/@aglabo/agla-logger-composer/src/__tests__/functional/createLogMessage.functional.spec.ts
// @(#) Functional tests for createLogMessage - integration with parseLogger
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createLogMessage } from '#/createLogMessage';
import { parseLogger } from '#/parseLogger';
import type { AGTLogMessage } from '#shared/types/AGTLoggerMessage.types';
import { describe, expect, it } from 'vitest';

/**
 * Feature: createLogMessage integration with parseLogger
 * BDD テストスイート - parseLogger出力とcreateLogMessageの統合動作を検証
 */
describe('Given: createLogMessage integration with parseLogger', () => {
  /**
   * Scenario: parseLogger integration
   * T-05-001: parseLogger の出力を createLog に渡して、統合的に正しく動作することを確認する
   */
  describe('When: parseLogger output is passed to createLogMessage', () => {
    /**
     * Case: [正常] parseLogger integration - Basic integration test
     */
    it('Given parseLogger result, When passed to createLogMessage, Then produces properly formatted output', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['User', 'logged', 'in'];
      const timestamp = new Date('2025-01-15T10:30:45.000Z');

      // Act
      const parsed: AGTLogMessage = parseLogger(label, messages, timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('2025-01-15T10:30:45Z');
      expect(result).toContain('INFO');
      expect(result).toContain('User logged in');
    });

    /**
     * Case: [正常] Complex message with multiple arguments
     */
    it('Given parseLogger with mixed values, When passed to createLogMessage, Then formats all parts correctly', () => {
      // Arrange
      const label = 'WARN';
      const testObj = { code: 408, type: 'TIMEOUT' };
      const messages = ['Request', 'timeout', 'after', '30s', testObj];
      const timestamp = new Date('2025-06-20T14:22:15.000Z');

      // Act
      const parsed: AGTLogMessage = parseLogger(label, messages, timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('2025-06-20T14:22:15Z');
      expect(result).toContain('WARN');
      expect(result).toContain('Request timeout after 30s');
      expect(result).toContain('code');
      expect(result).toContain('408');
    });

    /**
     * Case: [正常] With dispMs parameter
     */
    it('Given parseLogger result with dispMs=true, When passed to createLogMessage, Then includes milliseconds', () => {
      // Arrange
      const label = 'DEBUG';
      const messages = ['Debug', 'event'];
      const timestamp = new Date('2025-03-12T09:15:30.567Z');

      // Act
      const parsed: AGTLogMessage = parseLogger(label, messages, timestamp);
      const result = createLogMessage(parsed, true);

      // Assert
      expect(result).toContain('2025-03-12T09:15:30.567Z');
      expect(result).toContain('DEBUG');
    });
  });

  /**
   * Scenario: Complex nested objects
   * T-05-002: 5階層以上の深くネストされたオブジェクトが全階層保持されて出力されることを確認する
   */
  describe('When: deeply nested objects are logged', () => {
    /**
     * Case: [正常] Five-level nested structure
     */
    it('Given 5-level nested object, When passed to createLogMessage, Then preserves all levels', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['Complex', 'structure'];
      const timestamp = new Date('2025-01-15T10:30:45.000Z');
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  value: 'deep',
                  count: 5,
                },
              },
            },
          },
        },
      };

      // Act
      const parsed: AGTLogMessage = parseLogger(label, [...messages, deepObject], timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('level1');
      expect(result).toContain('level2');
      expect(result).toContain('level3');
      expect(result).toContain('level4');
      expect(result).toContain('level5');
      expect(result).toContain('deep');
      expect(result).toContain('5');
    });

    /**
     * Case: [正常] Seven-level nested structure with mixed types
     */
    it('Given 7-level deeply nested object, When passed to createLogMessage, Then preserves full structure', () => {
      // Arrange
      const label = 'ERROR';
      const messages = ['Deep', 'error'];
      const timestamp = new Date('2025-02-20T15:45:30.000Z');
      const veryDeepObject = {
        app: {
          module: {
            component: {
              service: {
                handler: {
                  error: {
                    stack: {
                      trace: 'line 1\nline 2',
                      code: 'ERR_DEEP',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const parsed: AGTLogMessage = parseLogger(label, [...messages, veryDeepObject], timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('app');
      expect(result).toContain('module');
      expect(result).toContain('component');
      expect(result).toContain('service');
      expect(result).toContain('handler');
      expect(result).toContain('error');
      expect(result).toContain('stack');
      expect(result).toContain('ERR_DEEP');
    });

    /**
     * Case: [正常] Mixed nested and array structures
     */
    it('Given nested objects with arrays at multiple levels, When passed to createLogMessage, Then preserves all structures', () => {
      // Arrange
      const label = 'WARN';
      const messages = ['Multi-level', 'data'];
      const timestamp = new Date('2025-04-10T12:00:00.000Z');
      const mixedObject = {
        items: [
          {
            id: 1,
            data: {
              nested: {
                deep: {
                  array: [
                    { val: 'a' },
                    { val: 'b' },
                  ],
                },
              },
            },
          },
        ],
      };

      // Act
      const parsed: AGTLogMessage = parseLogger(label, [...messages, mixedObject], timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('items');
      expect(result).toContain('nested');
      expect(result).toContain('deep');
      expect(result).toContain('array');
    });
  });

  /**
   * Scenario: Unicode and special characters
   * T-05-003: 日本語、絵文字、エスケープシーケンスが混在して全て正しく処理されることを確認する
   */
  describe('When: Unicode and special characters are logged', () => {
    /**
     * Case: [正常] Japanese characters in message
     */
    it('Given Japanese text in message, When passed to createLogMessage, Then preserves all characters', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['ユーザー', 'ログイン', '完了'];
      const timestamp = new Date('2025-01-15T10:30:45.000Z');

      // Act
      const parsed: AGTLogMessage = parseLogger(label, messages, timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('ユーザー');
      expect(result).toContain('ログイン');
      expect(result).toContain('完了');
    });

    /**
     * Case: [正常] Emoji characters in messages
     */
    it('Given emoji in messages, When passed to createLogMessage, Then preserves all emoji in message', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['Process', '🚀', 'started', '✅', 'complete'];
      const timestamp = new Date('2025-01-15T10:30:45.000Z');

      // Act
      const parsed: AGTLogMessage = parseLogger(label, messages, timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('🚀');
      expect(result).toContain('✅');
      expect(result).toContain('INFO');
      expect(result).toContain('Process');
      expect(result).toContain('started');
    });

    /**
     * Case: [正常] Mixed Japanese, emoji, and escaped sequences
     */
    it('Given mixed Japanese, emoji, and special sequences, When passed to createLogMessage, Then handles all correctly', () => {
      // Arrange
      const label = 'WARN';
      const messages = ['警告:', '処理失敗', '🔥'];
      const timestamp = new Date('2025-03-15T10:30:45.000Z');
      const mixedObj = {
        message: 'エラー: \\n予期しない値',
        emoji: '⚠️',
        japanese: '日本語テキスト',
        escaped: 'Line\\nBreak\\tTab',
      };

      // Act
      const parsed: AGTLogMessage = parseLogger(label, [...messages, mixedObj], timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('警告:');
      expect(result).toContain('処理失敗');
      expect(result).toContain('🔥');
      expect(result).toContain('⚠️');
      expect(result).toContain('エラー');
      expect(result).toContain('日本語テキスト');
    });

    /**
     * Case: [正常] Special Unicode ranges (Cyrillic, Arabic, Chinese)
     */
    it('Given multi-language Unicode characters, When passed to createLogMessage, Then preserves all scripts', () => {
      // Arrange
      const label = 'INFO';
      const messages = ['Multi', 'language', 'test'];
      const timestamp = new Date('2025-05-20T10:30:45.000Z');
      const multiLangObj = {
        cyrillic: 'Привет мир',
        arabic: 'مرحبا بالعالم',
        chinese: '你好世界',
        hebrew: 'שלום עולם',
        thai: 'สวัสดีชาวโลก',
      };

      // Act
      const parsed: AGTLogMessage = parseLogger(label, [...messages, multiLangObj], timestamp);
      const result = createLogMessage(parsed);

      // Assert
      expect(result).toContain('Привет');
      expect(result).toContain('مرحبا');
      expect(result).toContain('你好');
      expect(result).toContain('שלום');
      expect(result).toContain('สวัสดี');
    });
  });
});
