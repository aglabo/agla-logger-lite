---
title: "Testing Guide"
description: "Testing patterns, BDD conventions, and test hierarchy for agla-logger-lite project"
category: "dev-standards"
tags: ["testing", "vitest", "bdd", "unit-test", "integration-test"]
created: "2026-01-14"
version: "1.0.0"
authors:
  - atsushifx <https://github.com/atsushifx>
changes:
  - 1.0.0   2026-01-14  初版作成
copyright:
  - Copyright (c) 2026- atsushifx <https://github.com/atsushifx>
  - This software is released under the MIT License.
  - https://opensource.org/licenses/MIT
status: "published"
---

# Testing Guide

## テストフレームワーク

- **フレームワーク**: Vitest 4.x
- **カバレッジ**: @vitest/coverage-v8

## テスト階層 (5層)

| レベル | ディレクトリ | 設定ファイル | 説明 |
|--------|-------------|--------------|------|
| Unit | `src/**/__tests__/unit/` | `vitest.config.unit.ts` | 関数単位 |
| Functional | `src/__tests__/functional/` | `vitest.config.functional.ts` | 機能単位 |
| Integration | `tests/integration/` | `vitest.config.integration.ts` | モジュール間連携 |
| E2E | `tests/e2e/` | `vitest.config.e2e.ts` | エンドツーエンド |
| Runtime | `tests/runtime/` | `vitest.config.runtime.ts` | ランタイム互換性 |

## BDD形式テストパターン

### 基本構造

```typescript
describe('Given: {前提条件/モジュール名}', () => {
  describe('When: {操作/アクション}', () => {
    describe('Then: [正常/異常] {期待結果カテゴリ}', () => {
      it('Given {具体的条件}, When {具体的操作}, Then {期待結果}', () => {
        // Arrange - 準備
        const value = 'test';

        // Act - 実行
        const result = targetFunction(value);

        // Assert - 検証
        expect(result).toBe('expected');
      });
    });
  });
});
```

### 実例

```typescript
describe('Given: stringify module', () => {
  describe('When: _stringify is called', () => {
    describe('Then: [正常] Primitive string values', () => {
      it('Given string "hello", When called, Then return escaped string', () => {
        // Arrange
        const value = 'hello';
        const seen = new WeakSet<object>();

        // Act
        const result = _stringify(value, seen);

        // Assert
        expect(result).toBe('"hello"');
      });
    });
  });
});
```

## テストファイル命名

- **ユニットテスト**: `{target}.spec.ts`
- **機能テスト**: `{feature}.functional.spec.ts`
- **統合テスト**: `{feature}.integration.spec.ts`

## テスト配置ルール

- ユニットテストは対象ファイルと同階層の `__tests__/unit/` に配置
- 機能テストは `src/__tests__/functional/` に配置
- 統合テストは `tests/integration/` に配置
