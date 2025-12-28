---
title: Decision Records
module: agtkind/isxxfunctions
status: Active
created: 2025-12-26T10:40:00Z
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading line-length -->

## DR-001: AGTValueCategory判定関数の独立実装方針 - 2025-12-26T10:40:00Z

**Status**: Accepted

### Context

AGTValueCategory の判定を一貫して行うために、Atomic/SingleValue/Collection/UserDefined を明確に分類できる関数群が必要だった。
既存の検出ロジックに依存すると挙動の透明性が下がり、判定順序や null/undefined の扱いが曖昧になる懸念があった。
また、型ガード化や統合的な判定器の導入は設計・保守の複雑化を招くため、単純で予測可能な実装戦略が求められた。

### Decision

AGTValueCategory 判定は専用の`valueCategory.ts`に分離し、各カテゴリに対応するブール関数 (`_isAtomic`, `_isSingleValue`, `_isCollection`, `_isUserDefined`) を直接型チェックで実装する。
判定は`null/undefined`を`typeof`より先に確認し、Plain Object は`constructor === Object`で検出する。`detectValueKind`に依存せず、`_isPrimitive`は`detectValueHelpers.ts`から移設する。

### Alternatives Considered

- Option A: 既存の`detectValueKind`に統合し、単一の判定器として扱う
- Option B: 型ガードとして実装し、型推論を活用する
- Option C: Plain Object 判定に`Object.prototype.toString`や`lodash.isPlainObject`を用いる

### Rationale

- 直接型チェックは挙動が明確で、判定順序の制御や null/undefined の例外処理を明示できる。
- ブール関数に限定することで、呼び出し側の負担と依存性を抑え、シンプルなユーティリティとして再利用しやすい。
- `valueCategory.ts`への分離は責務の切り出しとなり、分類ルールの変更点を集約できる。
- Plain Object を`constructor === Object`で判定し、簡潔な実装によって基準が一貫する。
- 既存ヘルパーの移設により、分類関連の知識が一箇所に整理され、検索性が向上する。

### Consequences

- Positive:
  - 判定ロジックが明確になり、分類の一貫性とテスト容易性が向上する。
  - 依存関係が縮小し、将来のカテゴリ追加やルール変更の影響範囲を限定できる。
  - null/undefined の扱いが統一され、境界値の誤判定が減る。

- Negative:
  - 型ガードを使わないため、型推論の恩恵が限定される。
  - `constructor === Object` による判定は、プロトタイプ操作や異なる realm を跨ぐ場合など、一部の特殊ケースでは正確性が保証されない。
    ただし、本モジュールの想定利用範囲ではこれらのケースを扱わない前提とし、簡潔性と一貫性を優先する。
  - 既存の`detectValueKind`とのロジック重複が発生する。

---

## DR-002: Collection 判定における PlainObject 定義を JSON 形式に限定する方針 - 2025-12-26T11:15:00Z

**Status**: Accepted

### Context

AGTValueCategory における Collection 判定では、従来 Plain Object を
`constructor === Object` によって判定する方針を採っていた。

しかしこの方法は、プロトタイプ操作や異なる realm を跨ぐ場合など、
一部の特殊ケースにおいて判定の正確性が保証されない。
また、Collection カテゴリの利用目的 (ログ出力・構造化・分解処理) を考慮すると、
「JavaScript 的な Plain Object」であること自体よりも、
「JSON として扱える構造であること」が本質的な要件であること。

### Decision

Collection に含めるオブジェクトの定義を、
**JSON 形式として表現可能な構造 (`Record<string, unknown>` 相当) に限定する**。

Collection は以下のいずれかに該当する値と定義:

- 配列 (Array)
- キーが string で構成され、値が unknown として表現可能な
  JSON 形式のオブジェクト (`Record<string, unknown>` 相当)

`constructor === Object` による判定は仕様上の要件とせず、
実装詳細としてのみ扱う。

### Alternatives Considered

- Option A: `constructor === Object` による Plain Object 判定を継続する
- Option B: `Object.prototype.toString` による内部クラス判定を用いる
- Option C: `lodash.isPlainObject` などの外部ユーティリティに依存する

### Rationale

- Collection の主用途は、構造を持つデータを再帰的に分解・表示・処理することであり、
  JSON 形式で表現可能であることが最も重要な判定基準となる。
- JSON 形式に限定することで、realm や prototype に依存した
  不安定な判定条件を仕様レベルから排除できる。
- UserDefined (ユーザー定義クラス) との境界が明確になり、
  カテゴリ間の責務分離が強化される。
- 実装の複雑性は若干増すが、仕様の一貫性と将来の保守性を優先する。

### Consequences

- Positive:
  - Collection 判定の基準がデータ形状ベースとなり、用途との整合性が向上する。
  - realm や prototype 操作に起因する誤判定リスクを仕様外に切り出せる。
  - logger / formatter / inspector 系ユーティリティとの思想的一貫性が強まる。

- Negative:
  - JSON 形式相当かどうかの判定ロジックが必要となり、
    実装がやや複雑になる。
  - `Object.create(null)` や JSON 非互換な値を含むオブジェクトの扱いについて、
    明示的な仕様・テストが必要となる。

---

## DR-003: UserDefined 判定をユーザー関数およびユーザー定義クラスに限定する方針 - 2025-12-26T11:45:00Z

**Status**: Accepted

### Context

AGTValueCategory における UserDefined 判定について、
これまで「クラスインスタンス」や「JSON として表現できないオブジェクト」など、
定義の粒度が揺れていた。

JavaScript では関数もオブジェクトであり、
Atomic / SingleValue / Collection (JSON オブジェクト) のいずれにも該当しない。
一方で、すべての非 JSON オブジェクトを UserDefined に含めると、
分類範囲が過剰に広がり、設計上の責務が曖昧になる懸念があった。

そのため、UserDefined の対象を
「ユーザーが明示的に定義した対象」に限定する必要が生じた。

### Decision

UserDefined は、以下の値に**限定**:

- ユーザー定義関数 (Function)
- ユーザー定義クラスおよびそのインスタンス

これにより、UserDefined は
**ユーザーが定義した executable / constructable なオブジェクト**
を表すカテゴリとする。

以下の値は `UserDefined` に含めない。

- JSON オブジェクト (Collection)
- 組み込みオブジェクト
  (`Date`, `RegExp`, `Map`, `Set`, `Error`, `Promise`, `URL` 等)
- 組み込み関数および組み込みクラス
- 組み込みクラスを継承した派生クラスのインスタンス

### Alternatives Considered

- Option A: JSON として表現できないすべてのオブジェクトを UserDefined とする
- Option B: クラスインスタンスのみを UserDefined とする
- Option C: callable / non-callable を別カテゴリとして分離する

### Rationale

- 関数は JavaScript においてオブジェクトであり、
  Atomic / SingleValue / Collection のいずれにも該当しないため、
  UserDefined に含めるのが分類上自然である。
- UserDefined を「ユーザーが定義した対象」に限定することで、
  分類の責務が明確になり、予測可能性が向上する。
- 組み込みオブジェクトや派生クラスを除外することで、
  実装依存・環境依存の揺らぎを仕様レベルから排除できる。
- callable かどうかの判定や実行可否は、
  本分類の責務外とし、後続レイヤーに委ねる。

### Consequences

- Positive:
  - UserDefined カテゴリの意味が明確になり、分類結果の解釈が容易になる。
  - Collection (JSON) との境界が明確になり、相互排他性が強化される。
  - logger / formatter / inspector 系ユーティリティとの整合性が向上する。

- Negative:
  - 「ユーザー定義」であるかどうかの判定は、
    実装上ヒューリスティックに依存する部分が残る。
  - bundler や transpiler 環境によっては、
    判定境界が直感とずれる可能性がある。

---

## DR-004: AGTValueCategory の分類ルールを JSON 構造とユーザー定義対象に基づいて確定する - 2025-12-26T12:30:00Z

**Status**: Accepted

### Context

AGTValueCategory は、入力値を Atomic / SingleValue / Collection / UserDefined に分類するための基盤的な分類体系です。

議論の過程で、以下の点が課題として明らかになりました。

- Plain Object 判定 (constructor === Object) は JavaScript 実装依存で揺らぎやすい
- JSON として扱える構造と、そうでないオブジェクトを区別する必要がある
- UserDefined の範囲を広げすぎると、分類の責務が曖昧になる

これらを踏まえ、分類の軸を「データ構造」と「定義主体」に基づいて再整理する必要があった。

### Decision

AGTValueCategory の分類ルールを以下のように確定する。

#### Collection

Collection は、**JSON 互換な構造として安全に分解可能な値**を表すカテゴリとする。

- 配列 (Array)
- JSON オブジェクト
  - キーが string
  - 値が JSON 互換である構造
  - `Record<string, unknown>` 相当のデータ形式

JSON 非互換な値 (Function、class、Date 等) を含むオブジェクトは
Collection に含めない。

#### UserDefined

UserDefined は、**ユーザーが明示的に定義した対象そのもの**を表すカテゴリとする。

- ユーザー定義関数 (Function)
- ユーザー定義クラスおよびそのインスタンス

以下は `UserDefined`外:

- JSON オブジェクト (Collection)
- 組み込みオブジェクト (Date, RegExp, Map, Set 等)
- 組み込み関数・組み込みクラス
- 組み込みクラスを継承した派生クラスおよびそのインスタンス

#### その他

- Atomic / SingleValue / Collection / UserDefined のいずれにも属さない値が存在することを許容する
- `unknown` は入力型であり、実行時判定の結果として
  Atomic / SingleValue / Collection / UserDefined のいずれにもなりうる

### Rationale

- Collection を JSON 互換構造に限定することで、
  再帰展開・ログ出力・構造処理における事故を防げる
- UserDefined を「ユーザーが定義した対象」に限定することで、
  分類の意味論が明確になり、予測可能性が向上する
- 分類を厳格に保つことで、後続処理 (logger / formatter) との責務分離が可能になる

### Consequences

- Positive:
  - 分類基準が明確になり、実装・テスト・レビューの解釈が揺れない
  - JSON 構造と非 JSON 構造の境界が明示される
- Negative:
  - 一部の値はどのカテゴリにも属さないため、
    後続レイヤーでの扱いを別途定義する必要がある

---

## DR-005: ロガーでは UserDefined を SingleValue 相当として扱う方針 - 2025-12-26T12:30:00Z

**Status**: Accepted

### Context

AGTValueCategory において UserDefined は、ユーザー定義関数やユーザー定義クラスを表す独立したカテゴリとして定義されている。

しかし、これらの値をロガーでそのまま展開・再帰処理すると、以下のリスクが存在:

- 関数のクロージャや内部構造による事故
- クラスインスタンスのプロパティ・prototype 展開による情報過多
- ログの非決定性や性能劣化

ロガーとしては「意味を安全に伝える」ことが最優先であり、
分類体系とは別に出力表現の方針を定める必要があった。

### Decision

ロガーにおいては、UserDefined を **SingleValue 相当の値として扱う**。

具体的な方針は以下の通り:

- UserDefined (関数・クラス・クラスインスタンス) は、
  内部構造を展開せず、**識別子 (名前) のみ**を出力する
- 関数は関数名 (無名関数の場合は anonymous 相当) を出力する
- クラスおよびクラスインスタンスはクラス名を出力する
- prototype、プロパティ、クロージャ等は出力しない

例:

- `function foo() {}` → `[Function: foo]`
- `() => {}` → `[Function: anonymous]`
- `class A {}` → `[Class: A]`
- `new A()` → `[Instance: A]`

### Rationale

- UserDefined は構造を展開する対象ではなく、
  **識別子のみが意味を持つ値**である
- SingleValue (Date 等) と同様に、
  ロガーでは「要約された表現」が最も安全である
- 分類 (AGTValueCategory) とログ表現を分離することで、
  設計の責務が明確になる

### Consequences

- Positive:
  - ログ出力における事故 (再帰・過剰出力・非決定性) を防止できる
  - UserDefined の扱いが一貫し、可読性が向上する
- Negative:
  - 無名関数・無名クラスでは情報量が限定される
  - より詳細な情報が必要な場合は、
    debug 用の別フォーマッタを用意する必要がある

---

## DR-006: _isCollection は JSON 完全互換を保証しない - 2025-12-27T03:07:00Z

**Phase**: spec
**Status**: Accepted

### Context

`_isCollection` は、配列または JSON 互換オブジェクトを検出するための
分類関数として設計されている。

仕様では以下の要件が同時に要求されていた。

- JSON 互換性 (関数・Symbol を含まない)
- 相互排他性
- 定時間 O(1)
- プロパティの再帰的・網羅的な列挙をしない

しかし、**JSON 完全互換性の厳密な保証にはプロパティ列挙が不可欠であり、
O(1) 制約および軽量性と論理的に両立しない**。

この矛盾を解消するため、設計上の割り切りが必要となった。

### Decision

`_isCollection` は **JSON 完全互換性を保証しない**。

代わりに、以下の方針を採用する。

- Collection 判定は **構造的ヒューリスティック**に基づいて行う
- Array は常に Collection とする
- オブジェクトについては、以下を満たす場合に Collection と推定する：
  - `typeof value === 'object'`
  - `value !== null`
  - `value` は Date ではない
  - `constructor === Object` または同等の軽量条件
- 関数・Symbol プロパティの有無は **厳密には検証しない**

JSON 完全互換性の検証は、本関数の責務外とする。

### Consequences

#### 利点

- O(1) 性能要件を維持できる
- 実装が単純かつ安定する
- ロギング／フォーマッティング用途に十分な精度を確保できる

#### 欠点

- JSON としてシリアライズ不可能なオブジェクトが
  Collection と判定される可能性がある
- 完全な JSON 検証が必要な用途には不向き

### Implementation Notes

- 具体的な判定条件・ヘルパー関数の構成は **impl フェーズで決定する**
- 将来的に、厳密な JSON を検証する別 API を追加する余地を残す
- 本決定は `_isCollection` 単体の意味論を固定するものであり、
  上位 API (detectValueCategory 等) の設計を拘束しない

---

## DR-007: `_isUserDefined` におけるビルトイン判定はヒューリスティックである - 2025-12-27T03:30:00Z

**Phase**: spec
**Status**: Accepted

### Context

`_isUserDefined` は、ユーザー定義関数および
ユーザー定義クラス (およびそのインスタンス) を検出するための
分類関数として設計されている。

この判定では、ビルトイン関数・ビルトインクラスを除外する必要があるが、
JavaScript 実行環境において **すべてのビルトインを除外する決定的手法は存在しない**。

以下の要因により、完全判定は原理的に不可能。

- REALM (iframe / worker 等) をまたぐ関数・クラスの存在
- Proxy によるラッピング
- polyfill / transpilation による関数表現の変化
- `Function.prototype.toString()` 表現の非標準性
- name ベース判定の不完全性

### Decision

`_isUserDefined` における
**ビルトイン関数・ビルトインクラスの判定はヒューリスティックであることを明示的に受け入れる。**

本関数は以下を保証しない。

- すべての実行環境における完全一致
- Proxy / polyfill / cross-realm を考慮した完全判定

代わりに、以下を設計目標とする。

- 実用上十分な一貫性
- 同一環境内における決定論的な振る舞い
- 代表的なビルトインに対する安定した除外判定

### Consequences

#### 利点

- 実装が過度に複雑化しない
- 性能要件 (O(1)) を維持できる
- 判定ロジックが説明可能な範囲に収まる

#### 欠点

- 一部の環境で false positive / false negative が発生しうる
- 完全性を要求する用途には適さない

### Implementation Notes

- 使用する判定手法 (name / native code / identity 等) の
  組み合わせは **impl フェーズで決定する**
- 判定結果の不完全性は **バグではなく設計判断**とする
- 本決定は `_isUserDefined` 単体の意味論を固定するものであり、
  上位 API の設計を拘束しない

## DR-008: 分類不能な値は意図的に未分類 (undefined) として扱う - 2025-12-27T03:55:00Z

**Phase**: spec
**Status**: Accepted

### Context

AGTValueCategory による分類は、以下の 4種類の意味論を持つ値のみを対象とする。

- Atomic
- SingleValue
- Collection
- UserDefined

一方で、 Promise / ビルトインオブジェクトのインスタンス、ビルトインを拡張したクラスなど、
**意図的にどのカテゴリにも属させない値**が存在する。

これらは以下の理由により分類対象外とされる。

- 共通した意味論・処理モデルを持たない
- 上位 API での一律処理が想定されていない
- 分類対象に含めると誤解や過剰なハンドリングを招く

そのため、「未分類」はエラーや未実装ではなく、
**設計上の正当な結果状態**として扱う必要がある。

### Decision

分類結果として **意図的に未分類となる場合、AGTValueCategory には値を追加せず、`undefined` を返す**。

- `Uncategorized` のようなカテゴリ値は定義しない
- 未分類は「カテゴリの一種」ではなく、
  **分類が成立しなかった結果状態**とする
- `undefined` は以下の意味を持つ：
  - バグではない
  - 例外でもない
  - 将来拡張待ちでもない

### Consequences

#### 利点

- AGTValueCategory の意味論が明確に保たれる
- 利用者に不要なハンドリングを強制しない
- Category の増殖を防げる
- DR-006 / DR-007 の設計判断と整合する

#### 欠点

- 呼び出し側が `undefined` を明示的に考慮する必要がある
- 暗黙的な truthy / falsy 判定による見落としの可能性がある

### Implementation Notes

- 分類 API の戻り値型は以下を想定する：

  ```ts
  AGTValueCategory | undefined;
  ```

## DR-009: クラス・ユーザー定義型・関数は意味分類せず、名前のみを観測する - 2025-12-27T04:29:00Z

**Phase**: impl
**Status**: Accepted

### 背景 (Context)

JavaScript の値には、クラスインスタンス、ユーザー定義型、関数など、
**内部構造を安全かつ一貫して解釈できない値**が多数存在する。

これらを従来の `UserDefined` のような意味カテゴリに含めると、以下の問題が生じる。

- クラスインスタンスが「データ構造」と誤解される
- 内部プロパティを展開してよいという誤った期待が生まれる
- 拡張 built-in、Proxy、prototype 改変などの境界ケースで設計が破綻する

一方で、ログとしては **どのクラス／関数が関与したか** という
ドメイン上の可視性は保持したい。

Note:
本 DR における「ユーザー定義型」とは、class や関数など、実行時にオブジェクトとして振る舞うユーザー定義の実体を指す。

### 決定 (Decision)

1. **クラスインスタンス、ユーザー定義型、関数は意味分類 (Category) に含めない**
   - これらはすべて「未定義 (unclassified)」として扱う
   - 内部構造 (プロパティ、状態) は一切参照・展開しない

2. **ログでは「名前のみ」を観測情報として出力する**
   - クラスインスタンス：`value.constructor.name`
   - 関数：`function.name`
   - 無名の場合は空文字列 `''` を使用する

3. **意味分類と観測 (出力) を明確に分離する**
   - 意味分類：その値を「どう扱ってよいか」を決める
   - 観測情報：その値が「何者か」を示す

4. **`constructor === Object` の plain object のみを、
   データとして安全に扱える別カテゴリ (例：DefinedData) に分類する**

### 影響 (Consequences)

#### 利点

- クラスや関数の内部構造を誤って dump する事故を防げる
- 意味分類の相互排他性・決定性が保たれる
- ログにドメイン情報 (クラス名・関数名) を残せる
- 分類ロジックとフォーマット責務が明確に分離される
- 将来、専用フォーマッタを追加する余地を残せる

#### 欠点・トレードオフ

- クラスインスタンスや関数は意味カテゴリに属さない
- 一部の値が意図的に「未分類」のままとなる
- 名前取得は best-effort であり、minify や Proxy の影響を受け得る

### 理由 (Rationale)

ログにおける重要点:

- **安全であること**
- **誤解を招かないこと**
- **必要十分な情報だけを残すこと**

クラスインスタンスや関数に意味カテゴリを与えると、
「構造として扱える」という誤った含意が生まれる。

本設計では、これらを意味的には沈黙させつつ、
**名前という最小限の観測情報のみを残す**ことで、
安全性と可読性の両立を図る。

要約すると次の原則に基づく。

> ユーザー定義の存在は観測可能だが、意味的には分類しない。

## 補足 (Notes)

- 無名コンストラクタ／無名関数は `''` として表現する
- この決定は、将来の設計変更や専用フォーマッタ追加を妨げない
- 本 DR は「命名変更」ではなく「意味境界の確定」を目的とする
