# Requirements: AGTValueCategory判定

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->

## Objective

AGTValueCategory 判定のために、Atomic、SingleValue、Collection、UserDefined など各カテゴリの値を判定できる関数群を提供し、入力値の分類を一貫して行えるようにする。
併せて、AGTValueCategory の型定義を更新し、Collection (旧 Compose) と UserDefined カテゴリを追加する。

## Refactor

型定義の更新:

- `AGTValueCategory`
  - `Compose` → `Collection`
  - `UserDefined` → 追加
- `AGTValueKind`
  - `PlainObject` → `JSONObject`

## Key Requirements

### Functional Requirements

- **`_isAtomic(value: unknown): boolean`** を実装する
  - 入力値が Atomic (プリミティブ型) に該当する場合は true を返す
  - null, undefined, string, number, boolean, symbol, bigint を Atomic と判定

- **`_isSingleValue(value: unknown): boolean`** を実装する
  - 入力値が SingleValue (Date オブジェクト) に該当する場合は true を返す
  - Date インスタンスのみを SingleValue と判定

- **`_isCollection(value: unknown): boolean`** を実装する
  - 入力値が Collection (配列または JSON オブジェクト) に該当する場合は true を返す
  - JSON オブジェクトとは、キーが string であり、値が unknown で表現される`Record<string, unknown>` 相当の構造を持つオブジェクトを指す
  - 注: 従来の Compose カテゴリを Collection に名称変更

- **`_isUserDefined(value: unknown): boolean`** を実装する
  - 入力値が UserDefined (ユーザー定義オブジェクト) に該当する場合は true を返す
  - UserDefined は、ユーザーが定義した関数 (Function) および
    ユーザー定義クラスとそのインスタンスに限定する
  - JSON オブジェクト (Collection) および組み込みオブジェクト
    (Date, RegExp, Map, Set 等) は UserDefined に含めない

- 各判定関数は、入力値が当該カテゴリに該当する場合は真、該当しない場合は偽を返す
- 複数のカテゴリに属することはなく、いずれかのカテゴリにも属さない値も存在する (相互排他性)

### Non-Functional Requirements

- 判定結果は同一入力に対して常に同一の結果となる (決定的) 。
- 判定処理は入力値に対して即時に完了できる程度の軽量さを保つ。

## Constraints

- TypeScript/JavaScript プロジェクトとして実装可能な仕様であること。
- 既存の AGTValueCategory の定義や命名規則に整合すること。

## Success Criteria

- 実装完了:

  - `_isAtomic` 関数が定義され、プリミティブ値を正確に判定
  - `_isSingleValue` 関数が定義され、Date オブジェクトのみを判定
  - `_isCollection` 関数が定義され、Array と JSON オブジェクトを判定
  - `_isUserDefined` 関数が定義され、ユーザー定義関数およびユーザー定義クラス (およびそのインスタンス) を判定

- 動作確認:
  - 各判定関数が代表的な該当値に対して true を返す
  - 各判定関数が代表的な非該当値に対して false を返す
  - エッジケース (null, undefined, NaN, Infinity, 組み込みオブジェクト等) を正確に処理
  - ユーザー定義クラスと組み込みオブジェクト (Date, RegExp, Map, Set) の判別が正確

- 相互排他性の確認:
  - 同一の値が複数の判定関数で true になることがない
  - 値がいずれのカテゴリにも属さない場合、すべての判定関数が false を返す
