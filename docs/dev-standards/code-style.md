---
title: "Code Style Guide"
description: "TypeScript code style conventions, naming rules, and formatting standards for agla-logger-lite project"
category: "dev-standards"
tags: ["code-style", "typescript", "naming", "formatting", "dprint"]
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

# Code Style Guide

## 言語・ターゲット

- **言語**: TypeScript 5.9.3
- **ターゲット**: ES2022
- **モジュール**: ESM (ECMAScript Modules)

## 関数スタイル

### Arrow関数のみ使用

```typescript
// OK
const myFunction = (param: string): string => {
  return param.toUpperCase();
};

// NG: function宣言
function myFunction(param: string): string {/* ... */}
```

### 型指定

```typescript
// 全引数・戻り値に型指定必須
const calculate = (value: number, multiplier: number): number => {
  return value * multiplier;
};

// any禁止 - unknown使用
const process = (data: unknown): string => {/* ... */};
```

## インポートスタイル

```typescript
// 型のみのインポートは type を使用
import type { AGTLoggerMessage, AGTLogLevel } from './types';

// 値と型の混在
import { createLogger } from './logger';
import type { LoggerConfig } from './types';
```

## 命名規則

| 種類         | パターン         | 例                                |
| ------------ | ---------------- | --------------------------------- |
| 公開関数     | camelCase        | `createLogMessage`                |
| 内部関数     | `_` + camelCase  | `_stringify`, `_formatError`      |
| 型/Interface | AGT + PascalCase | `AGTLogLevel`, `AGTFormatContext` |
| 内部型       | T + PascalCase   | `TLogValue`, `TFormatterFn`       |
| 定数         | SCREAMING_SNAKE  | `DEFAULT_FORMAT_OPTIONS`          |
| Namespace    | PascalCase       | `AgLogComposer`                   |

## フォーマット設定 (dprint)

```jsonc
{
  "lineWidth": 120,
  "indentWidth": 2,
  "useTabs": false,
  "newLineKind": "lf",
  "typescript": {
    "quoteStyle": "preferSingle",
    "useBraces": "always",
    "arrowFunction.useParentheses": "force",
    "trailingCommas": "onlyMultiLine",
  },
}
```

## ファイルヘッダー

```typescript
// src: {相対パス}
// @(#) {説明}
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
```

## コメント規約

- JSDoc: 公開APIのみ
- インラインコメント: 複雑なロジックのみ
- TODO: 一時的な実装のみ
