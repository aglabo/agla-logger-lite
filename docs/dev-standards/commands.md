---
title: "Commands Reference"
description: "Development commands, quality gates, and release workflow for agla-logger-lite project"
category: "dev-standards"
tags: ["commands", "quality-gates", "build", "lint", "release"]
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

# Commands Reference

## 主要コマンド

### 型チェック・Lint

```bash
pnpm run check:types      # TypeScript型チェック
pnpm run lint-all         # ESLint (基本)
pnpm run lint-all:types   # ESLint (型チェック付き)
pnpm run check:dprint     # フォーマットチェック
```

### テスト

```bash
pnpm run test:all         # 全テスト実行
pnpm run test:develop     # 開発時テスト (unit)
pnpm run test:coverage:all # カバレッジ付きテスト
```

### ビルド・フォーマット

```bash
pnpm run build            # 全パッケージビルド
pnpm run format:dprint    # コードフォーマット
pnpm run clean            # ビルド出力クリア
```

## 品質ゲート (コミット前)

以下を順番に実行:

```bash
pnpm run check:types
pnpm run lint-all
pnpm run lint-all:types
pnpm run test:all
pnpm run check:dprint
pnpm run build
```

## リリースフロー

```bash
pnpm run release:changeset  # 変更セット作成
pnpm run release:version    # バージョン更新
pnpm run release:publish    # npm公開
```

## その他のLint

```bash
pnpm run lint:deno        # Deno lint
pnpm run lint:bun         # Bun lint
pnpm run lint:filenames   # ファイル名lint
pnpm run lint:text        # テキストlint
pnpm run lint:markdown    # Markdown lint
pnpm run lint:secrets     # シークレット検出
pnpm run check:spells     # スペルチェック
```

## 設定同期

```bash
pnpm run sync:configs     # 設定ファイル同期
pnpm run sync:configs:all # 全パッケージ設定同期
```
