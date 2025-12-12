// src: packages/@aglabo/agla-logger-utils/src/__tests__/unit/parseLogger.spec.ts
// @(#) Unit tests for parseLogger module
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _isLoggableValue, _isTimestamp } from '../../parseLogger.ts';

// Feature レベル (Given)
describe('Given: parseLogger module', () => {
  // Scenario レベル (When)
  describe('When: _isTimestamp function is called', () => {
    // Case レベル (Then)
    it('Then: [異常] - Date オブジェクトの場合、false を返す', () => {
      // Arrange
      const validDate = new Date('2025-12-12T00:00:00Z');

      // Act
      const result = _isTimestamp(validDate);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - 数値（ミリ秒タイムスタンプ）の場合、false を返す', () => {
      // Arrange
      const timestamp = 1734048000000; // 2024-12-12T00:00:00.000Z

      // Act
      const result = _isTimestamp(timestamp);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [正常] - ISO形式(Z終端)の文字列の場合、true を返す', () => {
      // Arrange
      const isoStringWithZ = '2025-12-12T03:00:00Z';
      const isoStringWithMilliseconds = '2025-12-12T03:00:00.123Z';

      // Act
      const result1 = _isTimestamp(isoStringWithZ);
      const result2 = _isTimestamp(isoStringWithMilliseconds);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('Then: [正常] - Standard形式の文字列の場合、true を返す', () => {
      // Arrange
      const standardFormat1 = '2025-12-12T03:00:00';
      const standardFormat2 = '2025-01-01T00:00:00';

      // Act
      const result1 = _isTimestamp(standardFormat1);
      const result2 = _isTimestamp(standardFormat2);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('Then: [異常] - 無効な Date オブジェクト（Invalid Date）の場合、false を返す', () => {
      // Arrange
      const invalidDate = new Date('invalid');

      // Act
      const result = _isTimestamp(invalidDate);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - NaN や Infinity の場合、false を返す', () => {
      // Arrange
      const nanValue = NaN;
      const infinityValue = Infinity;
      const negativeInfinity = -Infinity;

      // Act
      const result1 = _isTimestamp(nanValue);
      const result2 = _isTimestamp(infinityValue);
      const result3 = _isTimestamp(negativeInfinity);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });

    it('Then: [異常] - タイムゾーン付き文字列の場合、false を返す', () => {
      // Arrange
      const timezoneString1 = '2025-12-12T03:00:00+09:00';
      const timezoneString2 = '2025-12-12T03:00:00-05:00';

      // Act
      const result1 = _isTimestamp(timezoneString1);
      const result2 = _isTimestamp(timezoneString2);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [異常] - ISO形式でない文字列の場合、false を返す', () => {
      // Arrange
      const dateOnly = '2025-12-12';
      const timeOnly = '12:00:00';
      const invalidString = 'invalid';

      // Act
      const result1 = _isTimestamp(dateOnly);
      const result2 = _isTimestamp(timeOnly);
      const result3 = _isTimestamp(invalidString);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
    });

    it('Then: [異常] - その他の型（null, undefined, boolean, object, array）の場合、false を返す', () => {
      // Arrange
      const nullValue = null;
      const undefinedValue = undefined;
      const boolValue = true;
      const objectValue = { date: '2025-12-12' };
      const arrayValue = [2025, 12, 12];

      // Act
      const result1 = _isTimestamp(nullValue);
      const result2 = _isTimestamp(undefinedValue);
      const result3 = _isTimestamp(boolValue);
      const result4 = _isTimestamp(objectValue);
      const result5 = _isTimestamp(arrayValue);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
      expect(result3).toBe(false);
      expect(result4).toBe(false);
      expect(result5).toBe(false);
    });

    it('Then: [異常] - 月が範囲外の場合（13月）、false を返す', () => {
      // Arrange
      const invalidMonth = '2025-13-01T00:00:00Z';
      const invalidMonthStandard = '2025-13-01T00:00:00';

      // Act
      const result1 = _isTimestamp(invalidMonth);
      const result2 = _isTimestamp(invalidMonthStandard);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [正常] - うるう年の2月29日（有効な日付）の場合、true を返す', () => {
      // Arrange
      const leapYearDate = '2024-02-29T00:00:00Z';

      // Act
      const result = _isTimestamp(leapYearDate);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [異常] - 日が範囲外の場合（32日）、false を返す', () => {
      // Arrange
      const invalidDay = '2025-12-32T00:00:00Z';
      const invalidDayStandard = '2025-12-32T00:00:00';

      // Act
      const result1 = _isTimestamp(invalidDay);
      const result2 = _isTimestamp(invalidDayStandard);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [異常] - 時が範囲外の場合（25時）、false を返す', () => {
      // Arrange
      const invalidHour = '2025-12-12T25:00:00Z';
      const invalidHourStandard = '2025-12-12T25:00:00';

      // Act
      const result1 = _isTimestamp(invalidHour);
      const result2 = _isTimestamp(invalidHourStandard);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [異常] - 分が範囲外の場合（60分）、false を返す', () => {
      // Arrange
      const invalidMinute = '2025-12-12T12:60:00Z';
      const invalidMinuteStandard = '2025-12-12T12:60:00';

      // Act
      const result1 = _isTimestamp(invalidMinute);
      const result2 = _isTimestamp(invalidMinuteStandard);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [異常] - 秒が範囲外の場合（60秒）、false を返す', () => {
      // Arrange
      const invalidSecond = '2025-12-12T12:00:60Z';
      const invalidSecondStandard = '2025-12-12T12:00:60';

      // Act
      const result1 = _isTimestamp(invalidSecond);
      const result2 = _isTimestamp(invalidSecondStandard);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });

    it('Then: [正常] - 有効な日時境界値の場合、true を返す', () => {
      // Arrange
      const maxValidTime = '2025-02-28T23:59:59Z'; // 2月の最終日
      const maxHour = '2025-12-12T23:00:00Z'; // 最大時
      const maxMinute = '2025-12-12T12:59:00Z'; // 最大分
      const maxSecond = '2025-12-12T12:00:59Z'; // 最大秒

      // Act
      const result1 = _isTimestamp(maxValidTime);
      const result2 = _isTimestamp(maxHour);
      const result3 = _isTimestamp(maxMinute);
      const result4 = _isTimestamp(maxSecond);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
      expect(result4).toBe(true);
    });
  });

  // Scenario レベル (When)
  describe('When: _isLoggableValue function is called', () => {
    // Case レベル (Then)
    it('Then: [正常] - 文字列の場合、true を返す', () => {
      // Arrange
      const stringValue = 'test';

      // Act
      const result = _isLoggableValue(stringValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [正常] - 数値の場合、true を返す', () => {
      // Arrange
      const numberValue = 123;

      // Act
      const result = _isLoggableValue(numberValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [正常] - NaN の場合、true を返す', () => {
      // Arrange
      const nanValue = NaN;

      // Act
      const result = _isLoggableValue(nanValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [正常] - Infinity の場合、true を返す', () => {
      // Arrange
      const infinityValue = Infinity;
      const negativeInfinity = -Infinity;

      // Act
      const result1 = _isLoggableValue(infinityValue);
      const result2 = _isLoggableValue(negativeInfinity);

      // Assert
      expect(result1).toBe(true);
      expect(result2).toBe(true);
    });

    it('Then: [正常] - 真偽値 true の場合、true を返す', () => {
      // Arrange
      const booleanValue = true;

      // Act
      const result = _isLoggableValue(booleanValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [正常] - 真偽値 false の場合、true を返す', () => {
      // Arrange
      const booleanValue = false;

      // Act
      const result = _isLoggableValue(booleanValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [正常] - シンボルの場合、true を返す', () => {
      // Arrange
      const symbolValue = Symbol('test');

      // Act
      const result = _isLoggableValue(symbolValue);

      // Assert
      expect(result).toBe(true);
    });

    it('Then: [異常] - null の場合、false を返す', () => {
      // Arrange
      const nullValue = null;

      // Act
      const result = _isLoggableValue(nullValue);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - undefined の場合、false を返す', () => {
      // Arrange
      const undefinedValue = undefined;

      // Act
      const result = _isLoggableValue(undefinedValue);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - オブジェクトの場合、false を返す', () => {
      // Arrange
      const objectValue = {};

      // Act
      const result = _isLoggableValue(objectValue);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - 配列の場合、false を返す', () => {
      // Arrange
      const arrayValue: unknown[] = [];

      // Act
      const result = _isLoggableValue(arrayValue);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - Date オブジェクトの場合、false を返す', () => {
      // Arrange
      const dateValue = new Date();

      // Act
      const result = _isLoggableValue(dateValue);

      // Assert
      expect(result).toBe(false);
    });

    it('Then: [異常] - 関数の場合、false を返す', () => {
      // Arrange
      const functionValue = () => {};

      // Act
      const result = _isLoggableValue(functionValue);

      // Assert
      expect(result).toBe(false);
    });
  });
});
