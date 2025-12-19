# CLAUDE.md

Claude Code との協働ルール。

## コア原則

### プロジェクト概要

- **名前**: @aglabo/agla-logger-composer
- **目的**: ゼロ依存のログメッセージコンポーザー
- **対応**: Node.js >=20, Deno, Bun

### AI協働ルール

- MCP ツールで構造把握 → 編集の順序を守る
- `lsp_find_references` で影響分析してから変更
- 内部関数は `_` プレフィックス、公開APIは `AgLogComposer` namespace

### コード規約

- Arrow関数のみ: `const fn = () => {}`
- 全引数/戻り値に型指定、`any` 禁止
- Type imports: `import type { T } from '...'`

## 技術コンテキスト

### スタック

| 項目         | 仕様                                                  |
| ------------ | ----------------------------------------------------- |
| 言語         | TypeScript 5.9.3, ES2022 ESM                          |
| テスト       | Vitest (5層: unit/functional/integration/e2e/runtime) |
| ビルド       | tsup                                                  |
| フォーマット | dprint                                                |

### 主要コマンド

```bash
pnpm run check:types      # 型チェック
pnpm run lint-all         # Lint
pnpm run lint-all:types   # Lint (Type)
pnpm run test:all         # 全テスト
pnpm run build            # ビルド
```

### 品質ゲート (コミット前)

```bash
pnpm run check:types
pnpm run lint-all
pnpm run lint-all:types
pnpm run test:all
pnpm run check:dprint
pnpm run build
```

### BDDテスト形式

```typescript
describe('[正常] Feature', () => {
  it('Given X, When Y, Then Z', () => {});
});
```

## ドキュメント参照

### MCP メモリー

詳細情報は MCP メモリーを参照:

**Serena** (`.serena/memories/`):

- `project_current_status` - プロジェクト状況
- `codebase_architecture` - アーキテクチャ詳細
- `testing_patterns_and_conventions` - テストパターン
- `code_style_current` - コードスタイル詳細
- `development_workflow` - 開発ワークフロー

**LSMCP** (`.lsmcp/memories/`):

- `lsmcp_configuration` - プロジェクト設定
- `lsmcp_tools_reference` - ツール利用ガイド

### SDD ワークフロー

```bash
/sdd init → /sdd req → /sdd spec → /sdd tasks → /sdd coding → /sdd commit
```

---

最終更新: 2025-12-19
バージョン: 7.0
