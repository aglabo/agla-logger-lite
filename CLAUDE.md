# CLAUDE.md

Claude Code との協働ルール。

## コア原則

### プロジェクト概要

- 名前: @aglabo/agla-logger-lite-monorepo
- 目的: ゼロ依存のログメッセージコンポーザー (クロスランタイム対応)
- 対応: Node.js >=20, Deno, Bun

### パッケージ構成

| パッケージ                     | 説明                               |
| ------------------------------ | ---------------------------------- |
| `@aglabo/agla-logger-composer` | メインのログメッセージコンポーザー |
| `@aglabo/agla-logger-core`     | コア機能                           |
| `@aglabo/agla-logger-utils`    | ユーティリティ関数                 |
| `@shared/logger-shared`        | 共有型定義・定数 (内部 )           |

### AI協働ルール

- MCP ツールで構造把握 → 編集の順序を守る
- `lsp_find_references` で影響分析してから変更
- 内部関数は `_` プレフィックス、公開 API は `AgLogComposer` namespace

### コード規約 (必須)

- Arrow 関数のみ: `const fn = () => {}`
- 全引数/戻り値に型指定、`any` 禁止
- Type imports: `import type { T } from '...'`

## 技術コンテキスト

### スタック

| 項目         | 仕様                                                  |
| ------------ | ----------------------------------------------------- |
| 言語         | TypeScript 5.9, ES2022 ESM                            |
| テスト       | Vitest (5層: unit/functional/integration/e2e/runtime) |
| ビルド       | tsup                                                  |
| フォーマット | dprint                                                |

### 主要コマンド

```bash
pnpm run check:types      # 型チェック
pnpm run lint-all         # Lint
pnpm run test:all         # 全テスト
pnpm run build            # ビルド
```

### BDDテスト形式

```typescript
describe('[正常] Feature', () => {
  it('Given X, When Y, Then Z', () => {});
});
```

## ドキュメント参照

### 開発標準 (`docs/dev-standards/`)

| ファイル        | 内容                     |
| --------------- | ------------------------ |
| `code-style.md` | コードスタイル規約の詳細 |
| `testing.md`    | テストパターンと規約     |
| `commands.md`   | コマンド一覧・品質ゲート |

### MCP メモリー

**serena** (`.serena/memories/`):

- `project_current_status`, `codebase_architecture`, `testing_patterns_and_conventions`
- `code_style_current`, `development_workflow`

**lsmcp** (`.lsmcp/memories/`):

- `lsmcp_configuration`, `lsmcp_tools_reference`

---

<!-- textlint-disable -->

最終更新: 2026-01-14
バージョン: 0.0.9
