// Copyright (c) 2025 atsushifx <http://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTValueKind } from '#shared/types/AGTValueKind.types.ts';
import { describe, expect, it } from 'vitest';
import { detectValueKind } from '../../detectValueKind.ts';
/**
 *  test detectValueKind, detectValueCategory
 */
describe('detectValueKind', () => {
  describe('kind detection from normal values', () => {
    it('[正常系] Value is Normal Value', () => {
      const value = 42;
      const kind = detectValueKind(value);
      expect(kind).toBe(AGTValueKind.Primitive);

      const value2 = 3.14; // 浮動小数点数
      const kind2 = detectValueKind(value2);
      expect(kind2).toBe(AGTValueKind.Primitive);

      const value3 = -7; // 負の数
      const kind3 = detectValueKind(value3);
      expect(kind3).toBe(AGTValueKind.Primitive);
    });
  });
});
