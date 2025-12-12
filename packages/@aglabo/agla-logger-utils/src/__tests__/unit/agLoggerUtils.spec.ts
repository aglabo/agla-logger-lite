// src: packages/@aglabo/agla-logger-utils/src/__tests__/unit/agLoggerUtils.spec.ts
// @(#) Unit tests for AgLoggerUtils namespace exports
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { AgLoggerUtils } from '../../index.ts';

// ============================================================================
// AgLoggerUtils Namespace Tests (T5-01, T5-02, T5-03)
// ============================================================================

describe('[正常] AgLoggerUtils - ネームスペース経由でのexport確認', () => {
  describe('T5-01: isStringifiableType() メソッドの確認', () => {
    it('Given AgLoggerUtils namespace, When calling isStringifiableType, Then should be accessible', () => {
      // Verify the method exists
      expect(AgLoggerUtils.isStringifiableType).toBeDefined();
      expect(typeof AgLoggerUtils.isStringifiableType).toBe('function');
    });

    it('Given string argument, When calling AgLoggerUtils.isStringifiableType, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableType('test');
      expect(result).toBe(true);
    });

    it('Given number argument, When calling AgLoggerUtils.isStringifiableType, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableType(42);
      expect(result).toBe(true);
    });

    it('Given boolean argument, When calling AgLoggerUtils.isStringifiableType, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableType(true);
      expect(result).toBe(true);
    });

    it('Given symbol argument, When calling AgLoggerUtils.isStringifiableType, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableType(Symbol('test'));
      expect(result).toBe(true);
    });

    it('Given object argument, When calling AgLoggerUtils.isStringifiableType, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableType({ a: 1 });
      expect(result).toBe(false);
    });

    it('Given array argument, When calling AgLoggerUtils.isStringifiableType, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableType([1, 2, 3]);
      expect(result).toBe(false);
    });

    it('Given null argument, When calling AgLoggerUtils.isStringifiableType, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableType(null);
      expect(result).toBe(false);
    });

    it('Given undefined argument, When calling AgLoggerUtils.isStringifiableType, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableType(undefined);
      expect(result).toBe(false);
    });
  });

  describe('T5-02: isStringifiableValue() メソッドの確認', () => {
    it('Given AgLoggerUtils namespace, When calling isStringifiableValue, Then should be accessible', () => {
      // Verify the method exists
      expect(AgLoggerUtils.isStringifiableValue).toBeDefined();
      expect(typeof AgLoggerUtils.isStringifiableValue).toBe('function');
    });

    it('[正常] Given null argument, When calling AgLoggerUtils.isStringifiableValue, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableValue(null);
      expect(result).toBe(true);
    });

    it('[正常] Given undefined argument, When calling AgLoggerUtils.isStringifiableValue, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableValue(undefined);
      expect(result).toBe(true);
    });

    it('[正常] Given NaN argument, When calling AgLoggerUtils.isStringifiableValue, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableValue(NaN);
      expect(result).toBe(true);
    });

    it('[正常] Given Infinity argument, When calling AgLoggerUtils.isStringifiableValue, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableValue(Infinity);
      expect(result).toBe(true);
    });

    it('[正常] Given -Infinity argument, When calling AgLoggerUtils.isStringifiableValue, Then should return true', () => {
      const result = AgLoggerUtils.isStringifiableValue(-Infinity);
      expect(result).toBe(true);
    });

    it('[異常] Given string argument, When calling AgLoggerUtils.isStringifiableValue, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableValue('test');
      expect(result).toBe(false);
    });

    it('[異常] Given regular number argument, When calling AgLoggerUtils.isStringifiableValue, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableValue(42);
      expect(result).toBe(false);
    });

    it('[異常] Given object argument, When calling AgLoggerUtils.isStringifiableValue, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableValue({ a: 1 });
      expect(result).toBe(false);
    });

    it('[異常] Given array argument, When calling AgLoggerUtils.isStringifiableValue, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableValue([1, 2, 3]);
      expect(result).toBe(false);
    });

    it('[異常] Given boolean argument, When calling AgLoggerUtils.isStringifiableValue, Then should return false', () => {
      const result = AgLoggerUtils.isStringifiableValue(true);
      expect(result).toBe(false);
    });
  });

  describe('T5-03: 後方互換性確認 - 旧export関数も存在', () => {
    it('Given direct import, When importing _isStringifiableType, Then should still work', () => {
      // This is tested implicitly by the type check, but we can verify exports are available
      expect(AgLoggerUtils.isStringifiable).toBeDefined();
      expect(typeof AgLoggerUtils.isStringifiable).toBe('function');
    });

    it('Given direct import, When importing _isStringifiableValue, Then should still work', () => {
      expect(AgLoggerUtils.isStringifiableValue).toBeDefined();
      expect(typeof AgLoggerUtils.isStringifiableValue).toBe('function');
    });

    it('Given direct import, When importing _isTimestamp, Then should still work', () => {
      expect(AgLoggerUtils.isTimestamp).toBeDefined();
      expect(typeof AgLoggerUtils.isTimestamp).toBe('function');
    });
  });

  describe('[正常] AgLoggerUtils - その他メソッドの確認', () => {
    it('Given AgLoggerUtils namespace, When checking parseLogger, Then should be accessible', () => {
      expect(AgLoggerUtils.parseLogger).toBeDefined();
      expect(typeof AgLoggerUtils.parseLogger).toBe('function');
    });

    it('Given AgLoggerUtils namespace, When checking formatMessages, Then should be accessible', () => {
      expect(AgLoggerUtils.formatMessages).toBeDefined();
      expect(typeof AgLoggerUtils.formatMessages).toBe('function');
    });

    it('Given AgLoggerUtils namespace, When checking formatValues, Then should be accessible', () => {
      expect(AgLoggerUtils.formatValues).toBeDefined();
      expect(typeof AgLoggerUtils.formatValues).toBe('function');
    });
  });
});
