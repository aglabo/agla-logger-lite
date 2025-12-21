// src: packages/@aglabo/agla-logger-composer/src/_internal/types/__tests__/unit/AGTFormatContext.spec.ts
// @(#) Unit tests for AGTFormatContext type and agFormat namespace
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * @fileoverview AGTFormatContext 型と agFormat namespace のユニットテスト
 *
 * ## テスト対象
 * - AGTFormatContext: フォーマット処理の再帰深度を追跡する immutable な型
 * - agFormat namespace: コンテキスト操作のユーティリティ関数群
 *
 * ## テスト構成
 * 1. 型定義テスト (Type Definition)
 * 2. createContext() テスト (Basic / Normalization / Edge Cases)
 * 3. nextContext() テスト (Basic / Edge Cases)
 * 4. ensureContext() テスト (Basic / Edge Cases)
 *
 * @see {@link AGTFormatContext} - テスト対象の型定義
 * @see {@link agFormat} - テスト対象の namespace
 */

import type { AGTFormatContext } from '#shared/types/AGTFormatContext.types';
import { agFormat } from '#shared/types/AGTFormatContext.types';
import { describe, expect, it } from 'vitest';

// ============================================================================
// Test Suite 1: AGTFormatContext Type Definition
// ============================================================================
/**
 * AGTFormatContext 型定義のテストスイート
 *
 * @description
 * - 型が正しく定義されているか
 * - readonly depth プロパティが存在するか
 * - createContext() による基本的なコンテキスト生成
 * - 異常値の正規化処理
 */
describe('AGTFormatContext Type Definition', () => {
  // --------------------------------------------------------------------------
  // Section 1.1: [正常] Type Definition
  // --------------------------------------------------------------------------
  /**
   * 型定義の基本テスト
   * T-01-01-01: AGTFormatContext が readonly depth プロパティを持つことを確認
   */
  describe('[正常] AGTFormatContext Type Definition', () => {
    describe('T-01-01-01: AGTFormatContext Type has readonly depth property', () => {
      it('Given type definition, When imported, Then should have readonly depth property', () => {
        // Arrange - Create a context using the factory function
        const context: AGTFormatContext = agFormat.createContext();

        // Act - Access the depth property
        const depth = context.depth;

        // Assert - Verify depth is a number (readonly is enforced at compile time)
        expect(typeof depth).toBe('number');
        expect(context).toHaveProperty('depth');
      });
    });
  });

  // --------------------------------------------------------------------------
  // Section 1.2: [正常] createContext() - Basic Cases
  // --------------------------------------------------------------------------
  /**
   * createContext() 正常系テスト
   *
   * @description
   * - T-01-02-01: 引数なし → depth=0
   * - T-01-02-02: 正の整数 5 → depth=5
   * - T-01-02-03: 正の整数 1 → depth=1
   * - T-01-02-04: 大きな正の整数 1000 → depth=1000
   */
  describe('[正常] agFormat.createContext - Basic Cases', () => {
    /** T-01-02-01: デフォルト値テスト */
    describe('T-01-02-01: No arguments returns depth=0', () => {
      it('Given no arguments, When createContext(), Then depth should be 0', () => {
        // Act
        const ctx = agFormat.createContext();

        // Assert
        expect(ctx.depth).toBe(0);
      });
    });

    /** T-01-02-02: 正の整数テスト */
    describe('T-01-02-02: Positive integer 5 returns depth=5', () => {
      it('Given positive integer 5, When createContext(5), Then depth should be 5', () => {
        // Arrange
        const depth = 5;

        // Act
        const ctx = agFormat.createContext(depth);

        // Assert
        expect(ctx.depth).toBe(5);
      });
    });

    /** T-01-02-03: 最小正の整数テスト */
    describe('T-01-02-03: Positive integer 1 returns depth=1', () => {
      it('Given positive integer 1, When createContext(1), Then depth should be 1', () => {
        // Arrange
        const depth = 1;

        // Act
        const ctx = agFormat.createContext(depth);

        // Assert
        expect(ctx.depth).toBe(1);
      });
    });

    /** T-01-02-04: 大きな整数テスト */
    describe('T-01-02-04: Large positive integer 1000 returns depth=1000', () => {
      it('Given large positive integer 1000, When createContext(1000), Then depth should be 1000', () => {
        // Arrange
        const depth = 1000;

        // Act
        const ctx = agFormat.createContext(depth);

        // Assert
        expect(ctx.depth).toBe(1000);
      });
    });
  });

  // --------------------------------------------------------------------------
  // Section 1.3: [異常] createContext() - Normalization Cases
  // --------------------------------------------------------------------------
  /**
   * createContext() 異常値正規化テスト
   *
   * @description 無効な値は 0 に正規化される
   * - T-01-03-01: 負数 -1 → 0
   * - T-01-03-02: 負数 -100 → 0
   * - T-01-03-03: NaN → 0
   * - T-01-03-04: Infinity → 0
   * - T-01-03-05: -Infinity → 0
   */
  describe('[異常] agFormat.createContext - Normalization Cases', () => {
    /**
     * 異常値の正規化テスト (parameterized)
     * 負数、NaN、Infinity は全て 0 に正規化される
     */
    it.each([
      { description: 'negative number -1', input: -1, expected: 0 },
      { description: 'negative number -100', input: -100, expected: 0 },
      { description: 'NaN', input: Number.NaN, expected: 0 },
      { description: 'Infinity', input: Number.POSITIVE_INFINITY, expected: 0 },
      { description: '-Infinity', input: Number.NEGATIVE_INFINITY, expected: 0 },
    ])('Given $description, When createContext($input), Then depth should be $expected', ({ input, expected }) => {
      // Act
      const ctx = agFormat.createContext(input);

      // Assert
      expect(ctx.depth).toBe(expected);
    });

    // ------------------------------------------------------------------------
    // Section 1.4: [エッジケース] createContext() - Special Value Cases
    // ------------------------------------------------------------------------
    /**
     * エッジケーステスト
     *
     * @description 境界値と小数の処理
     * - T-01-04-01: 0 → 0 (そのまま)
     * - T-01-04-02: 3.7 → 3 (切り捨て)
     * - T-01-04-03: 0.9 → 0 (切り捨て)
     * - T-01-04-04: -0.5 → 0 (負数は 0 に正規化)
     */
    describe('[エッジケース] agFormat.createContext - Special Value Cases', () => {
      it.each([
        { description: 'zero: 0', input: 0, expected: 0 },
        { description: 'decimal 3.7 (floor)', input: 3.7, expected: 3 },
        { description: 'decimal 0.9 (floor)', input: 0.9, expected: 0 },
        { description: 'negative decimal -0.5', input: -0.5, expected: 0 },
      ])('Given $description, When createContext($input), Then depth should be $expected', ({ input, expected }) => {
        // Act
        const ctx = agFormat.createContext(input);

        // Assert
        expect(ctx.depth).toBe(expected);
      });
    });
  });
});

// ============================================================================
// Test Suite 2: nextContext() Method
// ============================================================================
/**
 * nextContext() メソッドのテストスイート
 *
 * @description
 * nextContext() は現在のコンテキストから depth を +1 した新しいコンテキストを返す。
 * 元のコンテキストは immutable なので変更されない。
 *
 * @example
 * ```typescript
 * const ctx = agFormat.createContext(2);  // depth: 2
 * const next = agFormat.nextContext(ctx); // depth: 3
 * console.log(ctx.depth);  // 2 (unchanged)
 * console.log(next.depth); // 3
 * ```
 */
describe('AGTFormatContext - nextContext Method', () => {
  // --------------------------------------------------------------------------
  // Section 2.1: [正常系] Basic increment
  // --------------------------------------------------------------------------
  /**
   * 正常系テスト
   *
   * @description
   * - T-02-01-01: depth +1 した新規コンテキストを返す
   * - T-02-01-02: 元のコンテキストは不変 (immutable)
   */
  describe('[正常系] nextContext creates depth+1 context', () => {
    it('Given context with depth L, When nextContext(), Then should return context with depth L+1', () => {
      // Arrange
      const context = agFormat.createContext(2);
      expect(context.depth).toBe(2);

      // Act
      const child = agFormat.nextContext(context);

      // Assert - New context has depth+1, original unchanged
      expect(context.depth).toBe(2); // Original context remains unchanged (immutable)
      expect(child.depth).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // Section 2.2: [エッジケース] Edge cases
  // --------------------------------------------------------------------------
  /**
   * エッジケーステスト
   *
   * @description
   * - T-02-02-01: depth=0 から +1
   * - T-02-02-02: 連続呼び出しで順次 +1
   * - T-02-02-03: 大きな depth からの +1
   */
  describe('[エッジケース] Increment depth edge cases', () => {
    /** T-02-02-01: depth=0 からのインクリメント */
    it('Given context start 0, child depth should be 1', () => {
      // Arrange
      const context = agFormat.createContext();
      expect(context.depth).toBe(0);

      // Act
      const child = agFormat.nextContext(context);

      // Assert
      expect(child.depth).toBe(1);
    });

    /** T-02-02-02: 連続呼び出し (chain) */
    it('Given context start 0, when create child 3 times, then depth should be 3', () => {
      // Arrange
      const context = agFormat.createContext();
      expect(context.depth).toBe(0);

      // Act - Chain nextContext calls
      const child1 = agFormat.nextContext(context);
      const child2 = agFormat.nextContext(child1);
      const child3 = agFormat.nextContext(child2);

      // Assert
      expect(child3.depth).toBe(3);
    });

    /** T-02-02-03: 大きな数値からのインクリメント */
    it('Given context start big number 999999, child depth should be 1000000', () => {
      // Arrange
      const context = agFormat.createContext(999999);
      expect(context.depth).toBe(999999);

      // Act
      const child = agFormat.nextContext(context);

      // Assert
      expect(child.depth).toBe(1000000);
    });
  });
});

// ============================================================================
// Test Suite 3: ensureContext() Method
// ============================================================================
/**
 * ensureContext() メソッドのテストスイート
 *
 * @description
 * ensureContext() はコンテキストが存在すればそのまま返し、
 * undefined の場合は新しいコンテキスト (depth=0) を生成して返す。
 *
 * @example
 * ```typescript
 * const ctx1 = agFormat.ensureContext(existingCtx); // returns existingCtx
 * const ctx2 = agFormat.ensureContext(undefined);   // returns new context (depth=0)
 * const ctx3 = agFormat.ensureContext();            // returns new context (depth=0)
 * ```
 */
describe('AGTFormatContext - ensureContext Method', () => {
  // --------------------------------------------------------------------------
  // Section 3.1: [正常系] Return existing context
  // --------------------------------------------------------------------------
  /**
   * 正常系テスト
   *
   * @description
   * - T-03-01-01: 既存コンテキストをそのまま返す
   * - T-03-01-02: depth=0 のコンテキストもそのまま返す
   */
  describe('[正常系] ensureContext returns existing context', () => {
    /** T-03-01-01: 既存コンテキスト (depth=5) */
    it('Given context with depth L, ensure context returns same context', () => {
      // Arrange
      const context = agFormat.createContext(5);
      expect(context.depth).toBe(5);

      // Act
      const ensuredContext = agFormat.ensureContext(context);

      // Assert - Same reference returned
      expect(ensuredContext.depth).toBe(5);
      expect(ensuredContext).toBe(context); // Same instance
    });

    /** T-03-01-02: 既存コンテキスト (depth=0) */
    it('Given context with depth 0, ensure context returns same context', () => {
      // Arrange
      const context = agFormat.createContext(0);
      expect(context.depth).toBe(0);

      // Act
      const ensuredContext = agFormat.ensureContext(context);

      // Assert - Same reference returned
      expect(ensuredContext.depth).toBe(0);
      expect(ensuredContext).toBe(context); // Same instance
    });
  });

  // --------------------------------------------------------------------------
  // Section 3.2: [エッジケース] Handle undefined
  // --------------------------------------------------------------------------
  /**
   * エッジケーステスト (undefined 処理)
   *
   * @description
   * - T-03-02-01: undefined → 新規コンテキスト (depth=0)
   * - T-03-02-02: 引数省略 → 新規コンテキスト (depth=0)
   */
  describe('[エッジケース] Handle undefined parameter', () => {
    /** T-03-02-01: 明示的な undefined */
    it('Given parameter is undefined, ensure context returns context with depth 0', () => {
      // Act
      const ensuredContext = agFormat.ensureContext(undefined);

      // Assert - New context with depth=0
      expect(ensuredContext.depth).toBe(0);
    });

    /** T-03-02-02: 引数省略 */
    it('Given no parameter (omitted), ensure context returns context with depth 0', () => {
      // Act
      const ensuredContext = agFormat.ensureContext();

      // Assert - New context with depth=0
      expect(ensuredContext.depth).toBe(0);
    });
  });
});
