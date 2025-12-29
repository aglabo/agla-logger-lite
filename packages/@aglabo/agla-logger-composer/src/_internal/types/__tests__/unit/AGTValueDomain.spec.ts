// src: packages/@aglabo/agla-logger-collectionr/src/_internal/types/__tests__/unit/AGTValueDomain.spec.ts
// @(#) Unit tests for AGTValueDomain type definitions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';

import {
  AG_KIND_TO_CATEGORY,
  AGTValueCategory,
  AGTValueKind,
} from '#shared/types/AGTValueDomain.ts';

// =============================================================================
// T-01-01: AGTValueKind enum テスト
// =============================================================================

describe('AGTValueKind enum', () => {
  describe('[正常系] enum メンバー定義', () => {
    it('Given AGTValueKind.Primitive, When accessed, Then returns "Primitive"', () => {
      expect(AGTValueKind.Primitive).toBe('Primitive');
    });

    it('Given AGTValueKind.Date, When accessed, Then returns "Date"', () => {
      expect(AGTValueKind.Date).toBe('Date');
    });

    it('Given AGTValueKind.Array, When accessed, Then returns "Array"', () => {
      expect(AGTValueKind.Array).toBe('Array');
    });

    it('Given AGTValueKind.JSONObject, When accessed, Then returns "JSONObject"', () => {
      expect(AGTValueKind.JSONObject).toBe('JSONObject');
    });
  });

  describe('[正常系] enum メンバー数', () => {
    it('Given AGTValueKind, When counting members, Then has exactly 4 members', () => {
      const members = Object.keys(AGTValueKind);
      expect(members).toHaveLength(4);
    });
  });
});

// =============================================================================
// T-01-02: AGTValueCategory enum テスト
// =============================================================================

describe('AGTValueCategory enum', () => {
  describe('[正常系] enum メンバー定義', () => {
    it('Given AGTValueCategory.Atomic, When accessed, Then returns "Atomic"', () => {
      expect(AGTValueCategory.Atomic).toBe('Atomic');
    });

    it('Given AGTValueCategory.SingleValue, When accessed, Then returns "SingleValue"', () => {
      expect(AGTValueCategory.SingleValue).toBe('SingleValue');
    });

    it('Given AGTValueCategory.Collection, When accessed, Then returns "Collection"', () => {
      expect(AGTValueCategory.Collection).toBe('Collection');
    });
  });

  describe('[正常系] enum メンバー数', () => {
    it('Given AGTValueCategory, When counting members, Then has exactly 3 members', () => {
      const members = Object.keys(AGTValueCategory);
      expect(members).toHaveLength(3);
    });
  });
});

// =============================================================================
// T-01-03: AG_KIND_TO_CATEGORY マッピングテスト
// =============================================================================

describe('AG_KIND_TO_CATEGORY mapping', () => {
  describe('[正常系] Kind → Category マッピング', () => {
    it('Given Primitive kind, When mapped, Then returns Atomic category', () => {
      expect(AG_KIND_TO_CATEGORY[AGTValueKind.Primitive]).toBe(AGTValueCategory.Atomic);
    });

    it('Given Date kind, When mapped, Then returns SingleValue category', () => {
      expect(AG_KIND_TO_CATEGORY[AGTValueKind.Date]).toBe(AGTValueCategory.SingleValue);
    });

    it('Given Array kind, When mapped, Then returns Collection category', () => {
      expect(AG_KIND_TO_CATEGORY[AGTValueKind.Array]).toBe(AGTValueCategory.Collection);
    });

    it('Given JSONObject kind, When mapped, Then returns Collection category', () => {
      expect(AG_KIND_TO_CATEGORY[AGTValueKind.JSONObject]).toBe(AGTValueCategory.Collection);
    });
  });

  describe('[正常系] マッピング完全性', () => {
    it('Given AG_KIND_TO_CATEGORY, When checking coverage, Then all AGTValueKind members are mapped', () => {
      const kindMembers = Object.values(AGTValueKind);
      const mappedKinds = Object.keys(AG_KIND_TO_CATEGORY);

      expect(mappedKinds).toHaveLength(kindMembers.length);

      for (const kind of kindMembers) {
        expect(AG_KIND_TO_CATEGORY[kind]).toBeDefined();
      }
    });
  });
});
