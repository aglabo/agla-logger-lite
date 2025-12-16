# CLAUDE.md

Claude Code との協働ルール。

## プロジェクト情報

@aglabo/agla-logger-lite:

- TypeScript 5.9.3 + ES2022 ESM
- Node.js >=20, Deno, Bun 対応
- ゼロ依存のロギングユーティリティ
- 開発状況: アクティブ (SDD フェーズ 2: 仕様設計)

### ディレクトリ構成

```bash
packages/@aglabo/agla-logger-utils/
├── src/
│   ├── parseLogger.ts           # ロガー引数パーサー
│   ├── logCreator.ts            # フォーマッター
│   ├── logValueValidator.ts     # バリデーター
│   ├── logValueUtils.ts         # ユーティリティ
│   ├── index.ts                 # 公開API
│   └── __tests__/               # テスト
├── shared/types/                # 型定義
└── configs/                     # 設定
```

## AI 協働の必須ルール

### MCP ツール - 必須利用フロー

**推奨する段階的アプローチ** (効率: 800-1700 tokens)

1. `get_symbols_overview()` - ファイル構造把握 (100-300 tokens)
2. `search_symbols()` - シンボル検索 (200-500 tokens)
3. `lsp_find_references()` - 影響分析 (300-800 tokens)
4. `lsp_get_diagnostics()` - エラー確認 (200-400 tokens)

- OK: MCP ツール確認後に編集
- NG: ファイル読み込み直後の即時編集

### 禁止操作一覧

| 操作                                | 理由               |
| ----------------------------------- | ------------------ |
| MCP なしで Read ツール使用          | 既存パターン未確認 |
| find_referencing_symbols なしで編集 | 影響分析が不十分   |
| パターン検索なしで新規コード追加    | 重複リスク         |

## 技術スタック

| 項目         | 仕様             |
| ------------ | ---------------- |
| 言語         | TypeScript 5.9.3 |
| モジュール   | ES2022 ESM       |
| ターゲット   | ES2022           |
| テスト       | Vitest (5層)     |
| ビルド       | tsup             |
| フォーマット | dprint           |

### テスト層

```text
Unit (pnpm run test:develop)
→ Functional (pnpm run test:functional)
→ Integration (pnpm run test:ci)
→ E2E (pnpm run test:e2e)
→ Runtime (pnpm run test:runtime)
```

## コード規約

### 必須ルール

| ルール     | 形式                                             |
| ---------- | ------------------------------------------------ |
| 関数定義   | Arrow 関数のみ: `const fn = () => {}`            |
| 型安全     | すべての引数/戻り値に型指定                      |
| インポート | Type imports: `import type { Foo } from './foo'` |
| Any 禁止   | 常に明示的型を指定                               |

### ファイルヘッダー

```typescript
// src: path/to/file.ts
// @(#) Brief description
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
```

### BDD テスト構造

```typescript
describe('[正常] Feature - Normal cases', () => {
  it('Given X, When Y, Then Z', () => {});
});

describe('[異常] Feature - Error cases', () => {
  it('Given invalid input, When called, Then handle', () => {});
});

describe('[エッジケース] Feature - Edge cases', () => {
  it('Given boundary value, When called, Then correct', () => {});
});
```

## 開発ワークフロー (SDD)

```bash
/sdd init namespace/module  → フェーズ0: 初期化
/sdd req                    → フェーズ1: 要件定義
/sdd spec                   → フェーズ2: 仕様設計
/sdd tasks                  → フェーズ3: タスク分解
/sdd coding                 → フェーズ4: BDD 実装
/sdd commit                 → フェーズ5: コミット
```

### 品質ゲート (コミット前に実行)

```bash
pnpm run check:types
pnpm run lint
pnpm run test:all
pnpm run check:dprint
pnpm run build
```

## よく使うコマンド

```bash
# 開発
pnpm run check:types    # 型チェック
pnpm run lint           # Lint
pnpm run test:all       # 全テスト
pnpm run build          # ビルド
```

### MCP メモリーの場所

Serena: `.serena/memories/` (5 ファイル, ~43 KB)

- project_current_status
- codebase_architecture
- testing_patterns_and_conventions
- code_style_current
- development_workflow

LSMCP: `.lsmcp/memories/` (2 ファイル, ~37 KB)

- lsmcp_configuration
- lsmcp_tools_reference

## 進捗状況

## エンジニアリングの原則

- 推奨する実装
  - ユーザー入力/外部 API 境界でのみ検証する
  - 内部コードを信頼する
  - シンプルに保つ

- 避けるべき実装
  - 要件外の機能を追加しない
  - 周囲のコードをクリーンアップしない
  - 変更していないコードにコメント追加しない

---

<!-- textlint-disable -->

最終更新: 2025-12-16
バージョン: 6.0 (Text-based Format)
MCP 統合: Serena-MCP 2.0 + LSMCP 2.0
