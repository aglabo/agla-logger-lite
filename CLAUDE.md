# CLAUDE.md

このファイルは Claude Code を使用する際の協働ルールです。

## プロジェクトコンテキスト

**プロジェクト**: @aglabo/agla-logger-lite
- TypeScript 5.9.3, ES2022 ESM のみ
- Node.js >=20, Deno, Bun 対応
- ゼロ依存のロギングユーティリティ
- 開発状況: アクティブ (SDD フェーズ2: 仕様設計)

**構造**:
```
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

## AI 協働ルール（最優先）

### MCP ツール - 必須利用

**すべてのコード操作は MCP ツール利用後に実行します**
- ✅ MCP ツールで既存パターン/型安全性確認 → 編集
- ❌ ファイル読み込み直後の即時編集

**段階的アプローチ** (800-1700 tokens vs 2500-5500 tokens):
1. `get_symbols_overview()` - ファイル構造を把握 (100-300 tokens)
2. `search_symbols()` - シンボル検索 (200-500 tokens)
3. `lsp_find_references()` - 影響分析 (300-800 tokens)
4. `lsp_get_diagnostics()` - エラー確認 (200-400 tokens)

### 禁止操作

- ❌ MCP なしで Read ツール使用
- ❌ find_referencing_symbols なしで編集
- ❌ パターン検索なしで新規コード追加

## 技術スタック

| 項目 | 仕様 |
|------|------|
| 言語 | TypeScript 5.9.3 |
| モジュール | ES2022 ESM |
| ターゲット | ES2022 |
| テスト | Vitest (5層) |
| ビルド | tsup |
| フォーマット | dprint |

**テスト層** (5層):
- Unit: `pnpm run test:develop`
- Functional: `pnpm run test:functional`
- Integration: `pnpm run test:ci`
- E2E: `pnpm run test:e2e`
- Runtime: `pnpm run test:runtime`

## コード規約

### 必須ルール
- Arrow 関数のみ: `const fn = () => {}`
- 型安全: すべての引数/戻り値に型指定
- Type imports: `import type { Foo } from './foo'`
- No `any`: 明示的型を常に指定

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
  it('Given X, When Y, Then Z', () => {
    // test
  });
});

describe('[異常] Feature - Error cases', () => {
  it('Given invalid input, When called, Then handle', () => {
    // test
  });
});

describe('[エッジケース] Feature - Edge cases', () => {
  it('Given boundary value, When called, Then correct', () => {
    // test
  });
});
```

## 開発ワークフロー (SDD)

**5 フェーズ**:
```bash
/sdd init namespace/module      # フェーズ0: 初期化
/sdd req                         # フェーズ1: 要件定義
/sdd spec                        # フェーズ2: 仕様設計
/sdd tasks                       # フェーズ3: タスク分解
/sdd coding                      # フェーズ4: BDD 実装
/sdd commit                      # フェーズ5: コミット
```

**品質ゲート** (コミット前に全て実行):
```bash
pnpm run check:types && \
pnpm run lint && \
pnpm run test:all && \
pnpm run check:dprint && \
pnpm run build
```

## 重要なコマンド

**開発**:
- `pnpm run check:types` - 型チェック
- `pnpm run lint` - Lint
- `pnpm run test:all` - 全テスト
- `pnpm run build` - ビルド

**MCP メモリー参照**:
- Serena: `.serena/memories/` (5ファイル, ~43 KB)
  - project_current_status
  - codebase_architecture
  - testing_patterns_and_conventions
  - code_style_current
  - development_workflow

- LSMCP: `.lsmcp/memories/` (2ファイル, ~37 KB)
  - lsmcp_configuration
  - lsmcp_tools_reference

## 現在の進捗

**Active Module**: logger-utils/createlog
- ✅ Phase 1: 要件定義完了
- ⏳ Phase 2: 仕様設計進行中
- ⏹️ Phase 3-5: 待機中

**次のステップ**: `/sdd spec`

## 過度なエンジニアリングを避ける

- ❌ 要件外の機能を追加しない
- ❌ 周囲のコードをクリーンアップしない
- ❌ 変更していないコードにコメント追加しない
- ✅ ユーザー入力/外部API境界でのみ検証
- ✅ 内部コードを信頼する
- ✅ シンプルに保つ

---

最終更新: 2025-12-15 18:30 UTC
バージョン: 5.1 (Simplified Format)
型: 協働ルール型 (How to collaborate)
行数: 150行
MCP 統合: Serena-MCP 2.0 + LSMCP 2.0
