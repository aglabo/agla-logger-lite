// src: packages/@aglabo/agla-logger-composer/src/__internal/classes/__tests__/AGTFormatterContext.class.spec.ts
// @(#) Unit tests for AGTFormatterContext class
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTFormatterContext } from '#shared/types/AGTFormatterContext.class';
import { describe, expect, it } from 'vitest';

// ============================================================================
// Block 1: [正常] Constructor - Default Values
// ============================================================================

describe('[正常] AGTFormatterContext - Constructor Default Values', () => {
  // ============================================================================
  // T-01-001: Default maxElements value
  // ============================================================================

  describe('T-01-001: Default maxElements value', () => {
    it('Given no options, When instance created, Then maxElements is 100', () => {
      const context = new AGTFormatterContext();
      expect(context.maxElements).toBe(100);
    });
  });

  // ============================================================================
  // T-01-002: Default maxDepth value
  // ============================================================================

  describe('T-01-002: Default maxDepth value', () => {
    it('Given no options, When instance created, Then maxDepth is 5', () => {
      const context = new AGTFormatterContext();
      expect(context.maxDepth).toBe(5);
    });
  });

  // ============================================================================
  // T-01-003: Default currentDepth value
  // ============================================================================

  describe('T-01-003: Default currentDepth value', () => {
    it('Given no options, When instance created, Then currentDepth is 0', () => {
      const context = new AGTFormatterContext();
      expect(context.currentDepth).toBe(0);
    });
  });
});

// ============================================================================
// Block 2: [正常] Constructor - Custom Options
// ============================================================================

describe('[正常] AGTFormatterContext - Constructor Custom Options', () => {
  // ============================================================================
  // T-02-001: Custom maxElements value
  // ============================================================================

  describe('T-02-001: Custom maxElements value', () => {
    it('Given maxElements=50, When instance created, Then maxElements is 50', () => {
      const context = new AGTFormatterContext({ maxElements: 50 });
      expect(context.maxElements).toBe(50);
    });
  });

  // ============================================================================
  // T-02-002: Custom maxDepth value
  // ============================================================================

  describe('T-02-002: Custom maxDepth value', () => {
    it('Given maxDepth=10, When instance created, Then maxDepth is 10', () => {
      const context = new AGTFormatterContext({ maxDepth: 10 });
      expect(context.maxDepth).toBe(10);
    });
  });

  // ============================================================================
  // T-02-003: Both custom values
  // ============================================================================

  describe('T-02-003: Both custom values', () => {
    it('Given maxElements=75 and maxDepth=8, When instance created, Then both values are set', () => {
      const context = new AGTFormatterContext({ maxElements: 75, maxDepth: 8 });
      expect(context.maxElements).toBe(75);
      expect(context.maxDepth).toBe(8);
    });
  });
});

// ============================================================================
// Block 3: [正常] Getter and Setter - maxElements
// ============================================================================

describe('[正常] AGTFormatterContext - maxElements Getter and Setter', () => {
  // ============================================================================
  // T-03-001: Set maxElements value
  // ============================================================================

  describe('T-03-001: Set maxElements value', () => {
    it('Given context, When maxElements set to 200, Then maxElements is 200', () => {
      const context = new AGTFormatterContext();
      context.maxElements = 200;
      expect(context.maxElements).toBe(200);
    });
  });
});

// ============================================================================
// Block 4: [正常] Getter and Setter - maxDepth
// ============================================================================

describe('[正常] AGTFormatterContext - maxDepth Getter and Setter', () => {
  // ============================================================================
  // T-04-001: Set maxDepth value
  // ============================================================================

  describe('T-04-001: Set maxDepth value', () => {
    it('Given context, When maxDepth set to 15, Then maxDepth is 15', () => {
      const context = new AGTFormatterContext();
      context.maxDepth = 15;
      expect(context.maxDepth).toBe(15);
    });
  });
});

// ============================================================================
// Block 5: [正常] Getter and Setter - currentDepth
// ============================================================================

describe('[正常] AGTFormatterContext - currentDepth Getter and Setter', () => {
  // ============================================================================
  // T-05-001: Set currentDepth value
  // ============================================================================

  describe('T-05-001: Set currentDepth value', () => {
    it('Given context, When currentDepth set to 3, Then currentDepth is 3', () => {
      const context = new AGTFormatterContext();
      context.currentDepth = 3;
      expect(context.currentDepth).toBe(3);
    });
  });
});

// ============================================================================
// Block 6: [正常] Circular Reference Tracking - has, add, delete
// ============================================================================

describe('[正常] AGTFormatterContext - Circular Reference Tracking', () => {
  // ============================================================================
  // T-06-001: has() returns false for untracked object
  // ============================================================================

  describe('T-06-001: has() returns false for untracked object', () => {
    it('Given new context, When has() called with object, Then returns false', () => {
      const context = new AGTFormatterContext();
      const obj = {};
      expect(context.has(obj)).toBe(false);
    });
  });

  // ============================================================================
  // T-06-002: add() tracks object
  // ============================================================================

  describe('T-06-002: add() tracks object', () => {
    it('Given context, When object added, Then has() returns true', () => {
      const context = new AGTFormatterContext();
      const obj = {};
      context.add(obj);
      expect(context.has(obj)).toBe(true);
    });
  });

  // ============================================================================
  // T-06-003: delete() removes tracked object
  // ============================================================================

  describe('T-06-003: delete() removes tracked object', () => {
    it('Given tracked object, When delete() called, Then has() returns false', () => {
      const context = new AGTFormatterContext();
      const obj = {};
      context.add(obj);
      context.delete(obj);
      expect(context.has(obj)).toBe(false);
    });
  });

  // ============================================================================
  // T-06-004: Multiple objects tracking
  // ============================================================================

  describe('T-06-004: Multiple objects tracking', () => {
    it('Given context, When multiple objects added, Then all are tracked', () => {
      const context = new AGTFormatterContext();
      const obj1 = {};
      const obj2 = {};
      const obj3 = {};

      context.add(obj1);
      context.add(obj2);
      context.add(obj3);

      expect(context.has(obj1)).toBe(true);
      expect(context.has(obj2)).toBe(true);
      expect(context.has(obj3)).toBe(true);
    });
  });

  // ============================================================================
  // T-06-005: Different object instances are distinct
  // ============================================================================

  describe('T-06-005: Different object instances are distinct', () => {
    it('Given context, When obj1 added, Then obj2 is not tracked', () => {
      const context = new AGTFormatterContext();
      const obj1 = { value: 1 };
      const obj2 = { value: 1 };

      context.add(obj1);

      expect(context.has(obj1)).toBe(true);
      expect(context.has(obj2)).toBe(false);
    });
  });
});

// ============================================================================
// Block 7: [正常] Depth Management - incrementDepth, decrementDepth
// ============================================================================

describe('[正常] AGTFormatterContext - Depth Management', () => {
  // ============================================================================
  // T-07-001: incrementDepth() increases currentDepth
  // ============================================================================

  describe('T-07-001: incrementDepth() increases currentDepth', () => {
    it('Given context, When incrementDepth() called, Then currentDepth increases by 1', () => {
      const context = new AGTFormatterContext();
      context.incrementDepth();
      expect(context.currentDepth).toBe(1);
    });
  });

  // ============================================================================
  // T-07-002: Multiple incrementDepth() calls
  // ============================================================================

  describe('T-07-002: Multiple incrementDepth() calls', () => {
    it('Given context, When incrementDepth() called 3 times, Then currentDepth is 3', () => {
      const context = new AGTFormatterContext();
      context.incrementDepth();
      context.incrementDepth();
      context.incrementDepth();
      expect(context.currentDepth).toBe(3);
    });
  });

  // ============================================================================
  // T-07-003: decrementDepth() decreases currentDepth
  // ============================================================================

  describe('T-07-003: decrementDepth() decreases currentDepth', () => {
    it('Given currentDepth=3, When decrementDepth() called, Then currentDepth is 2', () => {
      const context = new AGTFormatterContext();
      context.currentDepth = 3;
      context.decrementDepth();
      expect(context.currentDepth).toBe(2);
    });
  });

  // ============================================================================
  // T-07-004: decrementDepth() does not go below 0
  // ============================================================================

  describe('T-07-004: decrementDepth() does not go below 0', () => {
    it('Given currentDepth=0, When decrementDepth() called, Then currentDepth remains 0', () => {
      const context = new AGTFormatterContext();
      context.decrementDepth();
      expect(context.currentDepth).toBe(0);
    });
  });

  // ============================================================================
  // T-07-005: Increment and decrement sequence
  // ============================================================================

  describe('T-07-005: Increment and decrement sequence', () => {
    it('Given context, When increment then decrement, Then currentDepth returns to 0', () => {
      const context = new AGTFormatterContext();
      context.incrementDepth();
      context.incrementDepth();
      context.decrementDepth();
      context.decrementDepth();
      expect(context.currentDepth).toBe(0);
    });
  });
});

// ============================================================================
// Block 8: [正常] Depth Limit Check - isMaxDepthReached
// ============================================================================

describe('[正常] AGTFormatterContext - isMaxDepthReached', () => {
  // ============================================================================
  // T-08-001: isMaxDepthReached() returns false below limit
  // ============================================================================

  describe('T-08-001: isMaxDepthReached() returns false below limit', () => {
    it('Given currentDepth=2 and maxDepth=5, When isMaxDepthReached() called, Then returns false', () => {
      const context = new AGTFormatterContext();
      context.currentDepth = 2;
      expect(context.isMaxDepthReached()).toBe(false);
    });
  });

  // ============================================================================
  // T-08-002: isMaxDepthReached() returns true at limit
  // ============================================================================

  describe('T-08-002: isMaxDepthReached() returns true at limit', () => {
    it('Given currentDepth=5 and maxDepth=5, When isMaxDepthReached() called, Then returns true', () => {
      const context = new AGTFormatterContext();
      context.currentDepth = 5;
      expect(context.isMaxDepthReached()).toBe(true);
    });
  });

  // ============================================================================
  // T-08-003: isMaxDepthReached() returns true above limit
  // ============================================================================

  describe('T-08-003: isMaxDepthReached() returns true above limit', () => {
    it('Given currentDepth=6 and maxDepth=5, When isMaxDepthReached() called, Then returns true', () => {
      const context = new AGTFormatterContext();
      context.currentDepth = 6;
      expect(context.isMaxDepthReached()).toBe(true);
    });
  });

  // ============================================================================
  // T-08-004: Custom maxDepth limit
  // ============================================================================

  describe('T-08-004: Custom maxDepth limit', () => {
    it('Given maxDepth=3, When currentDepth=3, Then isMaxDepthReached() returns true', () => {
      const context = new AGTFormatterContext({ maxDepth: 3 });
      context.currentDepth = 3;
      expect(context.isMaxDepthReached()).toBe(true);
    });
  });
});

// ============================================================================
// Block 9: [エッジケース] Edge Cases
// ============================================================================

describe('[エッジケース] AGTFormatterContext - Edge Cases', () => {
  // ============================================================================
  // T-09-001: maxElements zero value
  // ============================================================================

  describe('T-09-001: maxElements zero value', () => {
    it('Given maxElements=0, When instance created, Then maxElements is 0', () => {
      const context = new AGTFormatterContext({ maxElements: 0 });
      expect(context.maxElements).toBe(0);
    });
  });

  // ============================================================================
  // T-09-002: maxDepth zero value
  // ============================================================================

  describe('T-09-002: maxDepth zero value', () => {
    it('Given maxDepth=0, When instance created, Then maxDepth is 0', () => {
      const context = new AGTFormatterContext({ maxDepth: 0 });
      expect(context.maxDepth).toBe(0);
    });
  });

  // ============================================================================
  // T-09-003: isMaxDepthReached() with maxDepth=0
  // ============================================================================

  describe('T-09-003: isMaxDepthReached() with maxDepth=0', () => {
    it('Given maxDepth=0 and currentDepth=0, When isMaxDepthReached() called, Then returns true', () => {
      const context = new AGTFormatterContext({ maxDepth: 0 });
      expect(context.isMaxDepthReached()).toBe(true);
    });
  });

  // ============================================================================
  // T-09-004: Very large maxElements value
  // ============================================================================

  describe('T-09-004: Very large maxElements value', () => {
    it('Given maxElements=999999, When instance created, Then maxElements is 999999', () => {
      const context = new AGTFormatterContext({ maxElements: 999999 });
      expect(context.maxElements).toBe(999999);
    });
  });

  // ============================================================================
  // T-09-005: Multiple decrementDepth() at zero
  // ============================================================================

  describe('T-09-005: Multiple decrementDepth() at zero', () => {
    it('Given currentDepth=0, When decrementDepth() called multiple times, Then currentDepth remains 0', () => {
      const context = new AGTFormatterContext();
      context.decrementDepth();
      context.decrementDepth();
      context.decrementDepth();
      expect(context.currentDepth).toBe(0);
    });
  });
});
