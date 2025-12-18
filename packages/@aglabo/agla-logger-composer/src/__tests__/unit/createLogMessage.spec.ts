// src: packages/@aglabo/agla-logger-composer/src/__tests__/unit/createLog.spec.ts
// @(#) Unit tests for createLogMessage function
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTLogMessage } from '#shared/types/AGTLoggerMessage.types';
import { describe, expect, it } from 'vitest';
import { createLogMessage } from '../../createLogMessage';

// ============================================================================
// Block 1: [正常] Unit Test - Basic Cases
// ============================================================================

describe('[正常] createLog - Basic Cases', () => {
  // ============================================================================
  // T-01-001: Default timestamp (no milliseconds)
  // ============================================================================

  describe('T-01-001: Default timestamp (no milliseconds)', () => {
    it('Given default parameters, When createLog called, Then returns timestamp without milliseconds', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45.123Z'),
        messages: ['User logged in'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toBe(
        '2025-01-15T10:30:45Z INFO User logged in',
      );
    });
  });

  // ============================================================================
  // T-01-002: dispMs=true (with milliseconds)
  // ============================================================================

  describe('T-01-002: dispMs=true (with milliseconds)', () => {
    it('Given dispMs=true, When createLog called, Then returns timestamp with milliseconds', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'ERROR',
        timestamp: new Date('2025-01-15T10:30:45.789Z'),
        messages: ['Connection failed'],
        values: [],
      };
      expect(createLogMessage(logMessage, true)).toBe(
        '2025-01-15T10:30:45.789Z ERROR Connection failed',
      );
    });
  });

  // ============================================================================
  // T-01-003: dispMs=false (explicit no milliseconds)
  // ============================================================================

  describe('T-01-003: dispMs=false (explicit no milliseconds)', () => {
    it('Given dispMs=false, When createLog called, Then returns timestamp without milliseconds', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45.456Z'),
        messages: ['Warning message'],
        values: [],
      };
      const result = createLogMessage(logMessage, false);
      expect(result).toContain('2025-01-15T10:30:45Z');
      expect(result).not.toContain('.456');
    });
  });

  // ============================================================================
  // T-01-004: logLabel='INFO'
  // ============================================================================

  describe('T-01-004: logLabel=INFO', () => {
    it('Given logLabel=INFO, When createLog called, Then INFO is in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Info message'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('INFO');
    });
  });

  // ============================================================================
  // T-01-005: logLabel='WARN'
  // ============================================================================

  describe('T-01-005: logLabel=WARN', () => {
    it('Given logLabel=WARN, When createLog called, Then WARN is in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Warn message'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('WARN');
    });
  });

  // ============================================================================
  // T-01-006: logLabel='ERROR'
  // ============================================================================

  describe('T-01-006: logLabel=ERROR', () => {
    it('Given logLabel=ERROR, When createLog called, Then ERROR is in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'ERROR',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Error message'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('ERROR');
    });
  });

  // ============================================================================
  // T-01-007: logLabel='DEBUG'
  // ============================================================================

  describe('T-01-007: logLabel=DEBUG', () => {
    it('Given logLabel=DEBUG, When createLog called, Then DEBUG is in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'DEBUG',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Debug message'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('DEBUG');
    });
  });

  // ============================================================================
  // T-01-008: logLabel='TRACE'
  // ============================================================================

  describe('T-01-008: logLabel=TRACE', () => {
    it('Given logLabel=TRACE, When createLog called, Then TRACE is in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'TRACE',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Trace message'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('TRACE');
    });
  });

  // ============================================================================
  // T-01-009: Single object
  // ============================================================================

  describe('T-01-009: Single object', () => {
    it('Given single object, When createLog called, Then object is formatted in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['DB slow'],
        values: [{ duration: 5000, threshold: 1000 }],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('duration');
      expect(result).toContain('5000');
    });
  });

  // ============================================================================
  // T-01-010: Multiple objects
  // ============================================================================

  describe('T-01-010: Multiple objects', () => {
    it('Given multiple objects, When createLog called, Then all objects are formatted', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'DEBUG',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Request'],
        values: [{ userId: 123 }, { method: 'POST' }, { path: '/api/users' }],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('userId');
      expect(result).toContain('method');
      expect(result).toContain('path');
    });
  });

  // ============================================================================
  // T-01-011: logLabel with lowercase letters
  // ============================================================================

  describe('T-01-011: logLabel with lowercase letters', () => {
    it('Given logLabel=info (lowercase), When createLog called, Then converted to uppercase INFO in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'info',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Info message'],
        values: [],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('INFO');
      expect(result).not.toContain('info');
    });
  });

  // ============================================================================
  // T-01-012: logLabel with mixed case letters
  // ============================================================================

  describe('T-01-012: logLabel with mixed case letters', () => {
    it('Given logLabel=Debug (mixed case), When createLog called, Then converted to uppercase DEBUG in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'Debug',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Mixed case'],
        values: [],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('DEBUG');
      expect(result).not.toContain('Debug');
    });
  });

  // ============================================================================
  // T-01-013: Message with lowercase letters
  // ============================================================================

  describe('T-01-013: Message with lowercase letters', () => {
    it('Given messages with lowercase, When createLog called, Then lowercase is preserved in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['user logged in successfully'],
        values: [],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('user logged in successfully');
      expect(result).toContain('INFO');
    });
  });

  // ============================================================================
  // T-01-014: Message with mixed case and special characters
  // ============================================================================

  describe('T-01-014: Message with mixed case and special characters', () => {
    it('Given messages with mixed case and special chars, When createLog called, Then preserved in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Database Connection Failed: timeout=5000ms, retries=3'],
        values: [],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('Database Connection Failed: timeout=5000ms, retries=3');
      expect(result).toContain('WARN');
    });
  });
});

// ============================================================================
// Block 2: [異常] Unit Test - Error Cases
// ============================================================================

describe('[異常] createLog - Error Cases', () => {
  // ============================================================================
  // T-02-001: Empty message + empty objects
  // ============================================================================

  describe('T-02-001: Empty message + empty objects', () => {
    it('Given empty message and empty objects, When createLog called, Then only timestamp and label', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: [],
        values: [],
      };
      expect(createLogMessage(logMessage)).toBe('2025-01-15T10:30:45Z INFO');
    });
  });

  // ============================================================================
  // T-02-002: Empty message + non-empty objects
  // ============================================================================

  describe('T-02-002: Empty message + non-empty objects', () => {
    it('Given empty message with objects, When createLog called, Then valid output with objects', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: [],
        values: [{ code: 404, status: 'not found' }],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('code');
      expect(result).toContain('404');
    });
  });

  // ============================================================================
  // T-02-003: Circular reference object
  // ============================================================================

  describe('T-02-003: Circular reference object', () => {
    it('Given circular reference, When createLog called, Then completes with [<Circular>]', () => {
      const circularObj = { a: 1 } as Record<string, unknown>;
      circularObj.self = circularObj;
      const logMessage: AGTLogMessage = {
        logLabel: 'ERROR',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Circular'],
        values: [circularObj],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('<Circular>');
    });
  });

  // ============================================================================
  // T-02-004: Function object
  // ============================================================================

  describe('T-02-004: Function object', () => {
    it('Given function object, When createLog called, Then formats with [Function:]', () => {
      const testFunc = function namedFunction(): void {};
      const logMessage: AGTLogMessage = {
        logLabel: 'DEBUG',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Func'],
        values: [testFunc],
      };
      expect(createLogMessage(logMessage)).toContain('[Function:');
    });
  });
});

// ============================================================================
// Block 3: [エッジケース] Unit Test - Edge Cases
// ============================================================================

describe('[エッジケース] createLog - Edge Cases', () => {
  // ============================================================================
  // T-03-001: Special number NaN
  // ============================================================================

  describe('T-03-001: Special number NaN', () => {
    it('Given NaN value, When createLog called, Then includes NaN in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Special'],
        values: [NaN],
      };
      expect(createLogMessage(logMessage)).toContain('NaN');
    });
  });

  // ============================================================================
  // T-03-002: Special number Infinity
  // ============================================================================

  describe('T-03-002: Special number Infinity', () => {
    it('Given Infinity value, When createLog called, Then includes Infinity in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Special'],
        values: [Infinity],
      };
      expect(createLogMessage(logMessage)).toContain('Infinity');
    });
  });

  // ============================================================================
  // T-03-003: Special number -Infinity
  // ============================================================================

  describe('T-03-003: Special number -Infinity', () => {
    it('Given -Infinity value, When createLog called, Then includes -Infinity in output', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'WARN',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Special'],
        values: [-Infinity],
      };
      expect(createLogMessage(logMessage)).toContain('-Infinity');
    });
  });

  // ============================================================================
  // T-03-004: Very long message
  // ============================================================================

  describe('T-03-004: Very long message', () => {
    it('Given very long message (1000 chars), When createLog called, Then preserves full message', () => {
      const longMessage = 'A'.repeat(1000);
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: [longMessage],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain(longMessage);
    });
  });

  // ============================================================================
  // T-03-005: Mixed object types
  // ============================================================================

  describe('T-03-005: Mixed object types', () => {
    it('Given mixed types (object, array, string, number, boolean, null), When createLog called, Then all types formatted', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'DEBUG',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Mixed'],
        values: [{ name: 'obj' }, [1, 2, 3], 'string', 42, true, null],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('name');
      expect(result).toContain('42');
      expect(result).toContain('true');
    });
  });

  // ============================================================================
  // T-03-006: Year boundary timestamp
  // ============================================================================

  describe('T-03-006: Year boundary timestamp', () => {
    it('Given year boundary timestamp (2025-12-31T23:59:59Z), When createLog called, Then formats correctly', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-12-31T23:59:59.999Z'),
        messages: ['Year end'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('2025-12-31T23:59:59');
    });
  });

  // ============================================================================
  // T-03-007: Empty logLabel
  // ============================================================================

  describe('T-03-007: Empty logLabel', () => {
    it('Given empty logLabel, When createLog called, Then valid output with timestamp', () => {
      const logMessage: AGTLogMessage = {
        logLabel: '',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Message'],
        values: [],
      };
      const result = createLogMessage(logMessage);
      expect(result).toBeDefined();
      expect(result).toContain('2025-01-15T10:30:45Z');
    });
  });

  // ============================================================================
  // T-03-008: Japanese text
  // ============================================================================

  describe('T-03-008: Japanese text', () => {
    it('Given Japanese text in message, When createLog called, Then preserves Japanese characters', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['ユーザーがログインしました'],
        values: [],
      };
      expect(createLogMessage(logMessage)).toContain('ユーザー');
    });
  });

  // ============================================================================
  // T-03-009: Emoji characters
  // ============================================================================

  describe('T-03-009: Emoji characters', () => {
    it('Given emoji in message and object, When createLog called, Then preserves emoji', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Success ✓'],
        values: [{ city: 'Tokyo', emoji: '🗼' }],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('✓');
      expect(result).toContain('🗼');
    });
  });

  // ============================================================================
  // T-03-010: Escaped sequences
  // ============================================================================

  describe('T-03-010: Escaped sequences', () => {
    it('Given escaped sequences (backslashes, quotes), When createLog called, Then preserves escapes', () => {
      const logMessage: AGTLogMessage = {
        logLabel: 'INFO',
        timestamp: new Date('2025-01-15T10:30:45Z'),
        messages: ['Path: C:\\\\Users\\\\test'],
        values: [{ query: 'SELECT * WHERE id = "123"' }],
      };
      const result = createLogMessage(logMessage);
      expect(result).toContain('Users');
      expect(result).toContain('query');
    });
  });
});
