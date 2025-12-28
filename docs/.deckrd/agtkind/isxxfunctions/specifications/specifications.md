---
title: Technical Specifications - AGTValueCategory Classification Functions
module: agtkind/isxxfunctions
version: 1.0
created: 2025-12-27T00:00:00Z
status: Active
---

<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading -->

## 概要

### 目的

この仕様書は `isxxfunctions` モジュール用の技術仕様を定義します。
このモジュールは、JavaScript の値を AGTValueCategory 型に分類するための 4つの相互排他的な分類関数を提供します。

- `_isAtomic`: プリミティブ値を検出
- `_isSingleValue`: Date オブジェクトを検出
- `_isCollection`: 配列と JSON 互換オブジェクトを検出
- `_isUserDefined`: ユーザー定義関数とクラスインスタンスを検出

### 設計原則

1. 相互排他性: 各値は最大 1 つのカテゴリーにマッチする
2. 決定論的: 同一の入力は常に同一の結果を生成
3. 軽量: 分類は定時間 O(1) で完了
4. 実装非依存: 仕様は「何を」を定義し、「どのように」ではない
5. 境界認識: エッジケースと特殊値の明示的処理

### 概念的アーキテクチャ

```bash
入力値 (unknown)
    ↓
┌─────────────────────────────────────┐
│  分類決定木                         │
├─────────────────────────────────────┤
│  Atomic?      → _isAtomic()         │
│  SingleValue? → _isSingleValue()    │
│  Collection?  → _isCollection()     │
│  UserDefined? → _isUserDefined()    │
└─────────────────────────────────────┘
    ↓
出力: AGTValueCategory または None
```

---

## 技術仕様

### 1. `_isAtomic(value: unknown): boolean`

#### 型シグネチャ

```typescript
export const _isAtomic = (value: unknown): boolean => {/* ... */};
```

#### 入力CONTRACT

- 型: `unknown` (任意の JavaScript 値)
- 制約: なし。すべての有効な JavaScript 値を受け入れる

#### 出力CONTRACT

- 戻り値: `boolean`
- 意味論:
  - `true`: 値がプリミティブ型 (Atomic カテゴリ)
  - `false`: 値がプリミティブではない (その他すべての型)

#### 分類ルール

値が **Atomic** であるのは、次のいずれかの型と一致する場合:

| 型          | 例                                                 | 含まれるもの                       |
| ----------- | -------------------------------------------------- | ---------------------------------- |
| `undefined` | `undefined`                                        | 明示的な undefined                 |
| `null`      | `null`                                             | Null 値                            |
| `string`    | `'hello'`, `''`, `` `template` ``                  | すべての文字列値                   |
| `number`    | `42`, `-3.14`, `0`, `NaN`, `Infinity`, `-Infinity` | NaN と Infinity を含むすべての数値 |
| `boolean`   | `true`, `false`                                    | 両方のブール値                     |
| `symbol`    | `Symbol()`, `Symbol('name')`                       | すべてのシンボル値                 |
| `bigint`    | `100n`, `-50n`, `0n`                               | すべての bigint 値                 |

#### 判定基準

```bash
value is Atomic ⟺ (typeof value ∈ {string, number, boolean, symbol, bigint})
                    ∨ (value is null)
                    ∨ (value is undefined)
```

#### 境界条件

| 入力                  | 期待される出力 | 理由                                                            |
| --------------------- | -------------- | --------------------------------------------------------------- |
| `undefined`           | `true`         | 明示的な undefined はプリミティブ                               |
| `null`                | `true`         | Null はプリミティブ (`typeof null === 'object'` にもかかわらず) |
| `NaN`                 | `true`         | 特殊な数値; それでも数値                                        |
| `Infinity`            | `true`         | 特殊な数値; それでも数値                                        |
| `-Infinity`           | `true`         | 特殊な数値; それでも数値                                        |
| `0`                   | `true`         | ゼロは数値プリミティブ                                          |
| `-0`                  | `true`         | 負のゼロは数値プリミティブ                                      |
| `''` (空文字列)       | `true`         | 空文字列は依然として文字列プリミティブ                          |
| `Symbol()`            | `true`         | シンボルはプリミティブ                                          |
| `0n` (zero bigint)    | `true`         | Bigint としてのゼロはプリミティブ                               |
| `{}` (空オブジェクト) | `false`        | オブジェクトはプリミティブではない                              |
| `[]` (空配列)         | `false`        | 配列はプリミティブではない                                      |
| `new Date()`          | `false`        | Date オブジェクトはプリミティブではない                         |
| `function() {}`       | `false`        | 関数はオブジェクトであり、プリミティブではない                  |
| `class Foo {}`        | `false`        | クラスはオブジェクトであり、プリミティブではない                |

#### 型安全性保証

- 常に安全に呼び出せる (例外は発生しない)
- 入力値への副作用なし
- 型強制なし; 厳密な等価性/型チェックのみ

#### 例

```typescript
_isAtomic(undefined); // → true
_isAtomic(null); // → true
_isAtomic(42); // → true
_isAtomic(NaN); // → true
_isAtomic('hello'); // → true
_isAtomic(true); // → true
_isAtomic(Symbol()); // → true
_isAtomic(100n); // → true

_isAtomic({}); // → false
_isAtomic([]); // → false
_isAtomic(new Date()); // → false
_isAtomic(function() {}); // → false
```

---

### 2. `_isSingleValue(value: unknown): boolean`

#### 型シグネチャ

```typescript
export const _isSingleValue = (value: unknown): boolean => {/* ... */};
```

#### 入力CONTRACT

- 型: `unknown` (任意の JavaScript 値)
- 制約: なし。すべての有効な JavaScript 値を受け入れる

#### 出力CONTRACT

- 戻り値: `boolean`
- 意味論:
  - `true`: 値は Date オブジェクト (SingleValue カテゴリ)
  - `false`: 値は Date オブジェクトではない

#### 分類ルール

値が **SingleValue** であるのは、その値が **ネイティブ Date コンストラクタのインスタンス** である場合のみです。

```typescript
value is SingleValue ⟺ value instanceof Date
```

#### 判定基準

| 条件                              | カテゴリ        |
| --------------------------------- | --------------- |
| `value instanceof Date` が `true` | SingleValue     |
| その他                            | Not SingleValue |

#### 境界条件

| 入力                                     | 期待される出力 | 理由                                           |
| ---------------------------------------- | -------------- | ---------------------------------------------- |
| `new Date()`                             | `true`         | 標準 Date オブジェクト                         |
| `new Date('2025-12-27')`                 | `true`         | 特定の日付を持つ Date                          |
| `new Date(0)`                            | `true`         | タイムスタンプから Date                        |
| `Date.now()`                             | `false`        | 数値を返す、Date ではない                      |
| `Date()`                                 | `false`        | 関数呼び出しは文字列を返す、Date ではない      |
| `{}`                                     | `false`        | 空オブジェクト (=JSONオブジェクト)             |
| `{ getTime: () => 0 }`                   | `false`        | ダックタイプされた Date はインスタンスではない |
| `null`                                   | `false`        | Null は Date ではない                          |
| `undefined`                              | `false`        | Undefined は Date ではない                     |
| `new (Date as any)()` in different realm | 実装依存       | クロスREALM Date 処理は環境固有                |

#### 型安全性保証

- 常に安全に呼び出せる (例外は発生しない)
- 入力値への副作用なし
- `instanceof` 演算子を使用 (すべての標準オブジェクトで安全)
- REALM 間のローカル比較 (異なる REALM の Date オブジェクトはマッチしないことがある)

#### 例

```typescript
const d = new Date();
_isSingleValue(d); // → true
_isSingleValue(new Date(0)); // → true
_isSingleValue(Date.now()); // → false (数値を返す)
_isSingleValue({}); // → false
_isSingleValue(null); // → false
_isSingleValue(undefined); // → false
```

#### cross REALM 動作についての注記

異なる REALM (iframe、worker など) からの日付をサポートする必要がある場合は、追加の検出を検討してください。

```typescript
// 代替手段: toString() 表現を比較
const isDateLike = (v: unknown): boolean => Object.prototype.toString.call(v) === '[object Date]';
```

この仕様は `instanceof` をベースラインとして使用します; クロス REALM サポートは実装詳細に委譲されます。

---

### 3. `_isCollection(value: unknown): boolean`

#### 型シグネチャ

```typescript
export const _isCollection = (value: unknown): boolean => {/* ... */};
```

#### 入力CONTRACT

- 型: `unknown` (任意の JavaScript 値)
- 制約: なし。すべての有効な JavaScript 値を受け入れる

#### 出力CONTRACT

- 戻り値: `boolean`
- 意味論:
  - `true`: 値は Collection (配列または JSON 互換オブジェクト)
  - `false`: 値は Collection ではない

#### 分類ルール

値が **Collection** であるのは、次のいずれかである場合:

1. 配列: ネイティブ Array インスタンスまたは配列のような構造
2. JSON オブジェクト (JSON 互換性は設計意図であり、完全性は要求しない)
   - コンストラクタは `Object` (または同等のプレーンオブジェクト)
   - 関数・Symbol・非 JSON シリアル化可能な値の存在は、原則として Collection から除外されるが、本仕様はその完全な検出を保証しない
   - `Record<string, unknown>` に相当する構造を表現

### 判定ツリー

```bash
入力: unknown
  ↓
配列か？
  ├─ はい → Collection = true
  └─ いいえ ↓
オブジェクト AND null ではない AND Date ではない？
  ├─ はい ↓
  │ コンストラクタ === Object？
  │   ├─ はい → Collection = true
  │   └─ いいえ → Collection = false
  └─ いいえ → Collection = false
```

Note:
本分類は JSON 互換性を意図するが、
すべてのキーが文字列であることを厳密には検証しない。

#### 配列検出

| 入力                  | 結果   | 理由                     |
| --------------------- | ------ | ------------------------ |
| `[]`                  | `true` | 空配列                   |
| `[1, 2, 3]`           | `true` | 数値配列                 |
| `['a', 'b']`          | `true` | 文字列配列               |
| `[{}, [], null]`      | `true` | ネストされたコレクション |
| `new Array(5)`        | `true` | Array コンストラクタ     |
| `Array.from('hello')` | `true` | 配列のような値から変換   |

#### JSON オブジェクト検出

| 入力                                    | 結果      | 理由                               |
| --------------------------------------- | --------- | ---------------------------------- |
| `{}`                                    | `true`    | 空オブジェクト                     |
| `{ a: 1, b: 2 }`                        | `true`    | データ付きプレーンオブジェクト     |
| `{ nested: { val: 1 } }`                | `true`    | ネストされたオブジェクト           |
| `{ arr: [1, 2] }`                       | `true`    | 配列を含むオブジェクト             |
| `Object.create(null)`                   | 実装依存* | コンストラクタプロパティなし       |
| `Object.assign({}, obj)`                | `true`    | 割り当てられたプレーンオブジェクト |
| フリーズ/シール済みプレーンオブジェクト | `true`    | コンストラクタはまだ === Object    |

*注記: `Object.create(null)` はエッジケース。以下の「エッジケース」セクションを参照してください。

#### Collection でないオブジェクト

| 入力                | 結果    | 理由                                   |
| ------------------- | ------- | -------------------------------------- |
| `new Date()`        | `false` | SingleValue カテゴリ                   |
| `new RegExp('.*')`  | `false` | ビルトインオブジェクト                 |
| `new Map()`         | `false` | ビルトインオブジェクト                 |
| `new Set()`         | `false` | ビルトインオブジェクト                 |
| `new Error()`       | `false` | ビルトインオブジェクト                 |
| `new Promise()`     | `false` | ビルトインオブジェクト                 |
| `function() {}`     | `false` | 関数 (UserDefined)                     |
| `class Foo {}`      | `false` | クラスコンストラクタ (UserDefined)     |
| `new CustomClass()` | `false` | ユーザー定義インスタンス (UserDefined) |

Note:
関数プロパティや Symbol キーの存在は JSON 互換性を損なう可能性があるが、本仕様はその完全な検出を保証しない。

#### 境界条件

| 入力                              | 期待される出力 | 理由                                            |
| --------------------------------- | -------------- | ----------------------------------------------- |
| `null`                            | `false`        | Null はオブジェクトコレクションではない         |
| `undefined`                       | `false`        | Undefined はコレクションではない                |
| プリミティブ値                    | `false`        | オブジェクトではない                            |
| `new Array()`                     | `true`         | Array インスタンス                              |
| `Object.create({a:1})`            | `false`        | プロトタイプチェーン、constructor !== Object    |
| `{ [Symbol.iterator]: () => {} }` | `false`        | シンボルキーを持つ                              |
| `Object.freeze({})`               | `true`         | フリーズされたプレーンオブジェクトも Collection |
| `Object.seal({})`                 | `true`         | シールされたプレーンオブジェクトも Collection   |
| 空の関数 `function() {}`          | `false`        | 関数は UserDefined                              |
| アロー関数 `() => {}`             | `false`        | アロー関数は UserDefined                        |
| 非同期関数 `async () => {}`       | `false`        | 非同期関数は UserDefined                        |

#### エッジケース

1. Object.create(null)

   ```typescript
   const obj = Object.create(null);
   obj.key = 'value';

   _isCollection(obj); // → 実装依存
   ```

   - `constructor` プロパティは undefined
   - 伝統的な意味では「プレーンオブジェクト」ではない
   - 決定: 実装は明示的に処理すること。仕様は要件検証に委譲

2. フリーズおよびシール済みオブジェクト

   ```typescript
   const frozen = Object.freeze({ a: 1 });
   const sealed = Object.seal({ b: 2 });

   _isCollection(frozen); // → true
   _isCollection(sealed); // → true
   ```

   - フリーズ/シール状態は JSON 互換性に影響しない
   - 分類は構造に基づき、可変性に基づかない

#### 型安全性保証

- 常に安全に呼び出せる (例外は発生しない)
- 入力値への副作用なし
- 再帰的走査なし (定時間チェック)
- すべてのプロパティを列挙しない (キー検査は限定的)

#### 例

```typescript
// 配列: すべて true
_isCollection([]); // → true
_isCollection([1, 2, 3]); // → true
_isCollection(['a', 'b']); // → true

// JSON オブジェクト: すべて true
_isCollection({}); // → true
_isCollection({ a: 1 }); // → true
_isCollection({ x: { y: 1 } }); // → true

// Collection でないもの: すべて false
_isCollection(null); // → false
_isCollection(undefined); // → false
_isCollection(new Date()); // → false
_isCollection(new RegExp()); // → false
_isCollection(() => {}); // → false
_isCollection(class Foo {}); // → false
_isCollection({ fn: () => {} }); // → false
```

### 4. `_isUserDefined(value: unknown): boolean`

#### 型シグネチャ

```typescript
export const _isUserDefined = (value: unknown): boolean => {/* ... */};
```

#### 入力CONTRACT

- 型: `unknown` (任意の JavaScript 値)
- 制約: なし。すべての有効な JavaScript 値を受け入れる

#### 出力CONTRACT

- 戻り値: `boolean`
- 意味論:
  - `true`: 値はユーザー定義関数またはユーザー定義クラスインスタンス
  - `false`: 値はユーザー定義ではない

#### 分類ルール

値が **UserDefined** であるのは、次のいずれかである場合:

1. **ユーザー定義関数**: ビルトインコンストラクタではない関数オブジェクト
2. **ユーザー定義クラス**: ユーザーコードで定義されたクラス (コンストラクタ関数)
3. **ユーザー定義インスタンス**: ユーザー定義クラスのインスタンス

#### 検出基準

```typescript
value is UserDefined ⟺
  (typeof value === 'function' AND value is not built-in constructor)
  ∨
  (typeof value === 'object' AND value is instance of user-defined class)
```

#### ビルトイン除外ルール

ビルトイン関数・ビルトインクラスおよびそのインスタンスは `UserDefined` から除外する。
この判定はヒューリスティックであり、`UserDefined`となるビルトインを許容する。

ビルトインの代表例:

- Array, Object, Date, Map, Set, Promise
- Error およびその派生
- Math.*, JSON.*, console.*

#### ユーザー定義検出戦略

1. 関数かどうかを確認: `typeof value === 'function'`
2. **ビルトインコンストラクタを除外**: 既知のビルトインリストと比較して
3. オブジェクトの場合: `constructor` がユーザー定義関数を指しているか確認
4. クラスインスタンスの場合: コンストラクタがビルトインではないことを確認

#### エッジケース

1. ビルトインを拡張するクラス

   ```typescript
   class MyError extends Error {}
   const err = new MyError();

   _isUserDefined(MyError); // → false (ビルトインを拡張)
   _isUserDefined(err); // → false (拡張クラスのインスタンス)
   ```

   - ビルトインを拡張するクラスは分類のあいまいさを避けるため除外
   - 決定記録: DR-003 理由根拠

2. バインドされた関数

   ```typescript
   function user() {}
   const bound = user.bind(this);

   _isUserDefined(bound); // → true (バインドされた関数)
   ```

   - バインドされた関数はまだユーザー定義 (`.bind()` で返される)
   - 元の関数定義に基づく分類

3. プロキシされた関数

   ```typescript
   function user() {}
   const proxied = new Proxy(user, {});

   _isUserDefined(proxied); // → 実装依存
   ```

   - Proxy ラッピングは元の関数のアイデンティティを隠蔽する可能性
   - 仕様は実装の選択に委譲

4. プロパティ割り当てを持つ関数式

   ```typescript
   const fn = function user() {};
   fn.customProp = 'value';

   _isUserDefined(fn); // → true
   ```

   - プロパティは関数分類に影響しない
   - まだユーザー定義関数

### 5. 未分類 (`undefined`)

上記 4つの分類に当てはまらなかったオブジェクトは未分類として (`undefined`) を返す。
これらのオブジェクトは、ロガーとしては単純に型を出力し、値については関知しない。

## カテゴリ分類概要

### 相互排他性保証

各値は **最大 1 つのカテゴリ** に分類されます。次のマトリックスで排他性を確認します。

| 値の型                 | Atomic | SingleValue | Collection | UserDefined |
| ---------------------- | ------ | ----------- | ---------- | ----------- |
| プリミティブ           | **✓**  | ✗           | ✗          | ✗           |
| Null                   | **✓**  | ✗           | ✗          | ✗           |
| Undefined              | **✓**  | ✗           | ✗          | ✗           |
| Date                   | ✗      | **✓**       | ✗          | ✗           |
| 配列                   | ✗      | ✗           | **✓**      | ✗           |
| JSON オブジェクト      | ✗      | ✗           | **✓**      | ✗           |
| ユーザー関数           | ✗      | ✗           | ✗          | **✓**       |
| ユーザークラス         | ✗      | ✗           | ✗          | **✓**       |
| ユーザーインスタンス   | ✗      | ✗           | ✗          | **✓**       |
| ビルトイン関数         | ✗      | ✗           | ✗          | ✗           |
| ビルトインインスタンス | ✗      | ✗           | ✗          | ✗           |

**未分類** (すべての関数が false を返す)

- ビルトイン関数とコンストラクタ
- ビルトインオブジェクトインスタンス (RegExp, Map, Set, Promise など)
- 非 JSON シリアル化可能コンテンツを持つオブジェクト
- ビルトインを拡張するクラス
- 非 Object コンストラクタで作成されたオブジェクト

### 分類の順序

実装時は、正確性を保つため以下の順序で評価してください。

```typescript
1. _isAtomic()      // 最速チェック (typeof)
2. _isSingleValue() // instanceof Date チェック
3. _isCollection()  // 配列またはプレーンオブジェクトチェック
4. _isUserDefined() // 関数またはユーザークラスチェック
```

この順序は、最も一般的な値に対するパフォーマンスの影響を最小化します。

---

## 型安全性仕様

### 入出力CONTRACT

4つの関数すべてについて。

```typescript
(value: unknown) → boolean
```

- 例外は発生しない: すべての入力型を安全に処理
- 型強制なし: 厳密な型チェックのみ
- 副作用なし: 入力値は変更されない
- 決定論的: 同一入力は常に同一出力

### 実装の制約

1. 型チェックのみ: `typeof`, `instanceof`, プロパティ検査を使用
2. 動的評価なし: `eval()`, `Function()` コンストラクタなし
3. リフレクションなし: `Object.getOwnPropertyDescriptor()` などの最小限の使用
4. 定時間: すべての関数で O(1) 計算量
5. 深い走査なし: ネストされたプロパティを再帰的に検査しない

### 戻り値の型

すべての関数は明示的に `boolean` を返します。

- `true`: 値がカテゴリにマッチ
- `false`: 値がカテゴリにマッチしない (または未定義の動作)

`void`, `never`, またはその他の戻り値の型はない。

---

## 非機能要件

### パフォーマンス

1. 実行時間: 各分類は 1 マイクロ秒未満で完了すべき
2. メモリ: 追加メモリ割り当てなし
3. 最適化: ロギングとフォーマッティングのホットパスに適していること

### 決定論性

1. 結果の一貫性: 同一入力は常に同一結果を生成
2. 競合状態なし: 非同期操作またはタイミング依存なし
3. グローバル状態なし: 可変グローバル状態 (ビルトイングローバル以外) への依存なし

### 堅牢性

1. 例外安全性: すべての関数はあらゆる入力で安全に呼び出せる
2. **Cross REALM**: 動作は REALM ローカル。Cross REALM サポートはオプション
3. エッジケース: NaN、Infinity、null、undefined、シンボルの明示的処理

### 互換性

1. ECMAScript バージョン: ES2022 以降 (`BigInt`, モダン構文をサポート)
2. JavaScript エンジン: V8, SpiderMonkey, JavaScriptCore と互換
3. TypeScript: TypeScript 5.0+ での完全な型安全性

---

## 関数の依存関係

### 内部依存

- `_isAtomic` は以下に依存: `typeof` 演算子、等価性チェック
- `_isSingleValue` は以下に依存: `instanceof` 演算子
- `_isCollection` は以下に依存: `Array.isArray()`, コンストラクタプロパティチェック
- `_isUserDefined` は以下に依存: `typeof` 演算子、ビルトイン関数検出

### 外部依存

- 外部ライブラリ依存なし
- agla-logger-composer のほかのモジュールへの依存なし (型以外)
- ドキュメンテーションのため `AGTValueCategory` enum を参照可能

### 循環依存の回避

- 関数は `detectValueKind` または `detectValueCategory` に依存してはならない
- 関数は独立して使用可能であるべき
- 実装は将来的に別モジュールへの移行をサポートすべき

---

## ドキュメンテーション要件

### JSDoc コメント

各関数は以下を含める必要があります。

````typescript
/**
 * 値が [カテゴリ] に分類されるかを検出
 *
 * @param value - 分類する値
 * @returns 値が [カテゴリ] の場合は true、そうでなければ false
 *
 * @remarks
 * [カテゴリ] は [定義] として定義されます。相互排他性保証については、
 * カテゴリ分類マトリックスを参照してください。
 *
 * @example
 * ```typescript
 * [関数名]([例値])  // → [期待される結果]
 * ```
 *
 * @internal
 */
````

### 境界ドキュメンテーション

各関数は以下をドキュメント化すべきです。

- エッジケース (NaN、Infinity、null、undefined など)
- 除外パターン
- パフォーマンス特性
- REALM 固有の動作

---

## テスト仕様

### テストカバレッジ要件

各関数は以下のテストケースを必要:

1. 正常系: マッチング値の標準的な例
2. 負のケース: マッチしない値の代表的な例
3. 境界条件: エッジケース、特殊値、極端な入力
4. 相互排他性: 複数のカテゴリにマッチする値がないことを検証
5. 未分類値: 未分類入力に対する正しい false 返却を検証

### テストマトリックスの例

```typescript
describe('_isAtomic', () => {
  describe('Atomic 値', () => {
    it('プリミティブ値が与えられたとき、_isAtomic を呼び出すと true を返す', () => {
      expect(_isAtomic(42)).toBe(true);
      expect(_isAtomic('hello')).toBe(true);
      // ... さらにケース
    });
  });

  describe('Atomic でない値', () => {
    it('オブジェクトが与えられたとき、_isAtomic を呼び出すと false を返す', () => {
      expect(_isAtomic({})).toBe(false);
      expect(_isAtomic([])).toBe(false);
      // ... さらにケース
    });
  });

  describe('境界条件', () => {
    it('null が与えられたとき、_isAtomic を呼び出すと true を返す', () => {
      expect(_isAtomic(null)).toBe(true);
    });
    // ... さらにエッジケース
  });
});
```
