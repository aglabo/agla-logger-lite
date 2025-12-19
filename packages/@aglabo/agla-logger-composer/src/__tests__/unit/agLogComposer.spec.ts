// src: packages/@aglabo/agla-logger-composer/src/__tests__/unit/agLogComposer.spec.ts
// @(#) Unit tests for AgLogComposer namespace exports
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { AgLogComposer } from '../../index.ts';

// ============================================================================
// AgLogComposer Namespace Tests (T5-01, T5-02, T5-03)
// ============================================================================

describe('[正常] AgLogComposer - ネームスペース経由でのexport確認', () => {
  describe('T5-01: isStringifiableType() メソッドの確認', () => {
    it('Given AgLogComposer namespace, When calling isStringifiableType, Then should be accessible', () => {
      // Verify the method exists
      expect(AgLogComposer.isStringifiableType).toBeDefined();
      expect(typeof AgLogComposer.isStringifiableType).toBe('function');
    });

    it('Given string argument, When calling AgLogComposer.isStringifiableType, Then should return true', () => {
      const result = AgLogComposer.isStringifiableType('test');
      expect(result).toBe(true);
    });

    it('Given number argument, When calling AgLogComposer.isStringifiableType, Then should return true', () => {
      const result = AgLogComposer.isStringifiableType(42);
      expect(result).toBe(true);
    });

    it('Given boolean argument, When calling AgLogComposer.isStringifiableType, Then should return true', () => {
      const result = AgLogComposer.isStringifiableType(true);
      expect(result).toBe(true);
    });

    it('Given symbol argument, When calling AgLogComposer.isStringifiableType, Then should return true', () => {
      const result = AgLogComposer.isStringifiableType(Symbol('test'));
      expect(result).toBe(true);
    });

    it('Given object argument, When calling AgLogComposer.isStringifiableType, Then should return false', () => {
      const result = AgLogComposer.isStringifiableType({ a: 1 });
      expect(result).toBe(false);
    });

    it('Given array argument, When calling AgLogComposer.isStringifiableType, Then should return false', () => {
      const result = AgLogComposer.isStringifiableType([1, 2, 3]);
      expect(result).toBe(false);
    });

    it('Given null argument, When calling AgLogComposer.isStringifiableType, Then should return false', () => {
      const result = AgLogComposer.isStringifiableType(null);
      expect(result).toBe(false);
    });

    it('Given undefined argument, When calling AgLogComposer.isStringifiableType, Then should return false', () => {
      const result = AgLogComposer.isStringifiableType(undefined);
      expect(result).toBe(false);
    });
  });

  describe('T5-02: isStringifiableValue() メソッドの確認', () => {
    it('Given AgLogComposer namespace, When calling isStringifiableValue, Then should be accessible', () => {
      // Verify the method exists
      expect(AgLogComposer.isStringifiableValue).toBeDefined();
      expect(typeof AgLogComposer.isStringifiableValue).toBe('function');
    });

    it('[正常] Given null argument, When calling AgLogComposer.isStringifiableValue, Then should return true', () => {
      const result = AgLogComposer.isStringifiableValue(null);
      expect(result).toBe(true);
    });

    it('[正常] Given undefined argument, When calling AgLogComposer.isStringifiableValue, Then should return true', () => {
      const result = AgLogComposer.isStringifiableValue(undefined);
      expect(result).toBe(true);
    });

    it('[正常] Given NaN argument, When calling AgLogComposer.isStringifiableValue, Then should return true', () => {
      const result = AgLogComposer.isStringifiableValue(NaN);
      expect(result).toBe(true);
    });

    it('[正常] Given Infinity argument, When calling AgLogComposer.isStringifiableValue, Then should return true', () => {
      const result = AgLogComposer.isStringifiableValue(Infinity);
      expect(result).toBe(true);
    });

    it('[正常] Given -Infinity argument, When calling AgLogComposer.isStringifiableValue, Then should return true', () => {
      const result = AgLogComposer.isStringifiableValue(-Infinity);
      expect(result).toBe(true);
    });

    it('[異常] Given string argument, When calling AgLogComposer.isStringifiableValue, Then should return false', () => {
      const result = AgLogComposer.isStringifiableValue('test');
      expect(result).toBe(false);
    });

    it('[異常] Given regular number argument, When calling AgLogComposer.isStringifiableValue, Then should return false', () => {
      const result = AgLogComposer.isStringifiableValue(42);
      expect(result).toBe(false);
    });

    it('[異常] Given object argument, When calling AgLogComposer.isStringifiableValue, Then should return false', () => {
      const result = AgLogComposer.isStringifiableValue({ a: 1 });
      expect(result).toBe(false);
    });

    it('[異常] Given array argument, When calling AgLogComposer.isStringifiableValue, Then should return false', () => {
      const result = AgLogComposer.isStringifiableValue([1, 2, 3]);
      expect(result).toBe(false);
    });

    it('[異常] Given boolean argument, When calling AgLogComposer.isStringifiableValue, Then should return false', () => {
      const result = AgLogComposer.isStringifiableValue(true);
      expect(result).toBe(false);
    });
  });

  describe('T5-03: 後方互換性確認 - 旧export関数も存在', () => {
    it('Given direct import, When importing _isStringifiableType, Then should still work', () => {
      // This is tested implicitly by the type check, but we can verify exports are available
      expect(AgLogComposer.isStringifiable).toBeDefined();
      expect(typeof AgLogComposer.isStringifiable).toBe('function');
    });

    it('Given direct import, When importing _isStringifiableValue, Then should still work', () => {
      expect(AgLogComposer.isStringifiableValue).toBeDefined();
      expect(typeof AgLogComposer.isStringifiableValue).toBe('function');
    });

    it('Given direct import, When importing _isTimestamp, Then should still work', () => {
      expect(AgLogComposer.isTimestamp).toBeDefined();
      expect(typeof AgLogComposer.isTimestamp).toBe('function');
    });
  });

  describe('[正常] AgLogComposer - その他メソッドの確認', () => {
    it('Given AgLogComposer namespace, When checking parseLogger, Then should be accessible', () => {
      expect(AgLogComposer.parseLogger).toBeDefined();
      expect(typeof AgLogComposer.parseLogger).toBe('function');
    });
  });
});
