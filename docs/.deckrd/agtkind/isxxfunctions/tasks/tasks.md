---
title: "Implementation Tasks"
module: "agtkind/isxxfunctions"
status: Active
created: "2025-12-27 21:30:00"
source: specifications.md
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading line-length -->

> This document contains implementation tasks derived from specifications.
> Each task corresponds to a single unit test case (`it()` block).

---

## Task Summary

| Test Target          | Scenarios | Cases | Status    |
| -------------------- | --------- | ----- | --------- |
| T-01: _isAtomic      | 3         | 17    | completed |
| T-02: _isSingleValue | 3         | 8     | completed |
| T-03: _isCollection  | 4         | 15    | completed |
| T-04: _isDefinedData | 3         | 10    | completed |
| T-05: 相互排他性検証 | 1         | 8     | pending   |

---

## T-01: _isAtomic

### [正常] Normal Cases

#### T-01-01: Primitive 値の検出

- [x] **T-01-01-01**: string 型の値を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given string 値 ('hello', '', template literal), When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-02**: number 型の値を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given number 値 (42, -3.14, 0), When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-03**: boolean 型の値を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given boolean 値 (true, false), When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-04**: symbol 型の値を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given symbol 値 (Symbol(), Symbol('name')), When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-05**: bigint 型の値を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given bigint 値 (100n, -50n, 0n), When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-06**: null を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given null, When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-01-07**: undefined を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given undefined, When _isAtomic を呼び出す
  - Expected: Then true を返す

#### T-01-02: 非 Atomic 値の除外

- [x] **T-01-02-01**: オブジェクト値を false として返す
  - Target: `_isAtomic`
  - Scenario: Given オブジェクト値 ({}, { a: 1 }), When _isAtomic を呼び出す
  - Expected: Then false を返す

- [x] **T-01-02-02**: 配列値を false として返す
  - Target: `_isAtomic`
  - Scenario: Given 配列値 ([],[1, 2, 3]), When _isAtomic を呼び出す
  - Expected: Then false を返す

- [x] **T-01-02-03**: Date オブジェクトを false として返す
  - Target: `_isAtomic`
  - Scenario: Given Date オブジェクト (new Date()), When _isAtomic を呼び出す
  - Expected: Then false を返す

- [x] **T-01-02-04**: 関数を false として返す
  - Target: `_isAtomic`
  - Scenario: Given 関数 (function() {}, () => {}), When _isAtomic を呼び出す
  - Expected: Then false を返す

- [x] **T-01-02-05**: クラスを false として返す
  - Target: `_isAtomic`
  - Scenario: Given クラス (class Foo {}), When _isAtomic を呼び出す
  - Expected: Then false を返す

### [エッジケース] Edge Cases

#### T-01-03: 特殊な数値の処理

- [x] **T-01-03-01**: NaN を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given NaN, When _isAtomic を呼び出す
  - Expected: Then true を返す (NaN は number 型)

- [x] **T-01-03-02**: Infinity を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given Infinity, When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-03-03**: -Infinity を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given -Infinity, When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-03-04**: 負のゼロを正しく検出
  - Target: `_isAtomic`
  - Scenario: Given -0, When _isAtomic を呼び出す
  - Expected: Then true を返す

- [x] **T-01-03-05**: 空文字列を正しく検出
  - Target: `_isAtomic`
  - Scenario: Given 空文字列 (''), When _isAtomic を呼び出す
  - Expected: Then true を返す (空文字列も string 型)

---

## T-02: _isSingleValue

Status: **completed** - All 8 test cases implemented and passing

### [正常] Normal Cases

#### T-02-01: Date インスタンスの検出

- [x] **T-02-01-01**: 標準 Date オブジェクトを正しく検出
  - Target: `_isSingleValue`
  - Scenario: Given Date オブジェクト (new Date()), When _isSingleValue を呼び出す
  - Expected: Then true を返す

- [x] **T-02-01-02**: 特定日付の Date オブジェクトを正しく検出
  - Target: `_isSingleValue`
  - Scenario: Given 特定日付の Date (new Date('2025-12-27')), When _isSingleValue を呼び出す
  - Expected: Then true を返す

- [x] **T-02-01-03**: タイムスタンプから生成した Date を正しく検出
  - Target: `_isSingleValue`
  - Scenario: Given タイムスタンプからの Date (new Date(0)), When _isSingleValue を呼び出す
  - Expected: Then true を返す

#### T-02-02: 非 Date 値の除外

- [x] **T-02-02-01**: Date.now() の戻り値を false として返す
  - Target: `_isSingleValue`
  - Scenario: Given Date.now() の戻り値 (number), When _isSingleValue を呼び出す
  - Expected: Then false を返す (number 型であり Date ではない)

- [x] **T-02-02-02**: Date() 関数呼び出しの戻り値を false として返す
  - Target: `_isSingleValue`
  - Scenario: Given Date() の戻り値 (string), When _isSingleValue を呼び出す
  - Expected: Then false を返す (string 型であり Date ではない)

- [x] **T-02-02-03**: オブジェクトを false として返す
  - Target: `_isSingleValue`
  - Scenario: Given オブジェクト ({}), When _isSingleValue を呼び出す
  - Expected: Then false を返す

- [x] **T-02-02-04**: null/undefined を false として返す
  - Target: `_isSingleValue`
  - Scenario: Given null または undefined, When _isSingleValue を呼び出す
  - Expected: Then false を返す

### [エッジケース] Edge Cases

#### T-02-03: ダックタイピングされた Date の除外

- [x] **T-02-03-01**: getTime メソッドを持つオブジェクトを false として返す
  - Target: `_isSingleValue`
  - Scenario: Given { getTime: () => 0 } のようなダックタイプオブジェクト, When _isSingleValue を呼び出す
  - Expected: Then false を返す (instanceof Date ではない)

---

## T-03: _isCollection

### [正常] Normal Cases

#### T-03-01: 配列の検出

- [x] **T-03-01-01**: 空配列を正しく検出
  - Target: `_isCollection`
  - Scenario: Given 空配列 ([]), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-01-02**: 数値配列を正しく検出
  - Target: `_isCollection`
  - Scenario: Given 数値配列 ([1, 2, 3]), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-01-03**: 文字列配列を正しく検出
  - Target: `_isCollection`
  - Scenario: Given 文字列配列 (['a', 'b']), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-01-04**: ネストされた配列を正しく検出
  - Target: `_isCollection`
  - Scenario: Given ネストされた配列 ([{},[], null]), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-01-05**: Array コンストラクタから生成した配列を正しく検出
  - Target: `_isCollection`
  - Scenario: Given Array コンストラクタからの配列 (new Array(5)), When _isCollection を呼び出す
  - Expected: Then true を返す

#### T-03-02: Plain Object の検出

- [x] **T-03-02-01**: 空オブジェクトを正しく検出
  - Target: `_isCollection`
  - Scenario: Given 空オブジェクト ({}), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-02-02**: データを持つ plain object を正しく検出
  - Target: `_isCollection`
  - Scenario: Given データを持つオブジェクト ({ a: 1, b: 2 }), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-02-03**: ネストされたオブジェクトを正しく検出
  - Target: `_isCollection`
  - Scenario: Given ネストされたオブジェクト ({ nested: { val: 1 } }), When _isCollection を呼び出す
  - Expected: Then true を返す

- [x] **T-03-02-04**: 配列を含むオブジェクトを正しく検出
  - Target: `_isCollection`
  - Scenario: Given 配列を含むオブジェクト ({ arr:[1, 2]}), When _isCollection を呼び出す
  - Expected: Then true を返す

#### T-03-03: 非 Collection 値の除外

- [x] **T-03-03-01**: null/undefined を false として返す
  - Target: `_isCollection`
  - Scenario: Given null または undefined, When _isCollection を呼び出す
  - Expected: Then false を返す

- [x] **T-03-03-02**: Date オブジェクトを false として返す
  - Target: `_isCollection`
  - Scenario: Given Date オブジェクト (new Date()), When _isCollection を呼び出す
  - Expected: Then false を返す

- [x] **T-03-03-03**: ビルトインオブジェクトを false として返す
  - Target: `_isCollection`
  - Scenario: Given ビルトインオブジェクト (RegExp, Map, Set, Error, Promise), When _isCollection を呼び出す
  - Expected: Then false を返す

- [x] **T-03-03-04**: 関数を false として返す
  - Target: `_isCollection`
  - Scenario: Given 関数 (function() {}, () => {}), When _isCollection を呼び出す
  - Expected: Then false を返す

- [x] **T-03-03-05**: クラスインスタンスを false として返す
  - Target: `_isCollection`
  - Scenario: Given ユーザー定義クラスのインスタンス (new CustomClass()), When _isCollection を呼び出す
  - Expected: Then false を返す

### [エッジケース] Edge Cases

#### T-03-04: フリーズ/シール済みオブジェクトの処理

- [x] **T-03-04-01**: フリーズされた plain object を正しく検出
  - Target: `_isCollection`
  - Scenario: Given フリーズされたオブジェクト (Object.freeze({ a: 1 })), When _isCollection を呼び出す
  - Expected: Then true を返す (コンストラクタは Object のまま)

- [x] **T-03-04-02**: シールされた plain object を正しく検出
  - Target: `_isCollection`
  - Scenario: Given シールされたオブジェクト (Object.seal({ a: 1 })), When _isCollection を呼び出す
  - Expected: Then true を返す (コンストラクタは Object のまま)

---

## T-04: _isDefinedData

### [正常] Normal Cases

#### T-04-01: Plain Object の検出

- [x] **T-04-01-01**: 空の plain object を正しく検出
  - Target: `_isDefinedData`
  - Scenario: Given 空オブジェクト ({}), When _isDefinedData を呼び出す
  - Expected: Then true を返す

- [x] **T-04-01-02**: データを持つ plain object を正しく検出
  - Target: `_isDefinedData`
  - Scenario: Given データを持つオブジェクト ({ a: 1 }), When _isDefinedData を呼び出す
  - Expected: Then true を返す

- [x] **T-04-01-03**: Object.assign で生成したオブジェクトを正しく検出
  - Target: `_isDefinedData`
  - Scenario: Given Object.assign({}, obj), When _isDefinedData を呼び出す
  - Expected: Then true を返す

#### T-04-02: 非 DefinedData 値の除外

- [x] **T-04-02-01**: 配列を false として返す
  - Target: `_isDefinedData`
  - Scenario: Given 配列 ([]), When _isDefinedData を呼び出す
  - Expected: Then false を返す (配列は Collection だが DefinedData ではない)

- [x] **T-04-02-02**: Date オブジェクトを false として返す
  - Target: `_isDefinedData`
  - Scenario: Given Date オブジェクト, When _isDefinedData を呼び出す
  - Expected: Then false を返す

- [x] **T-04-02-03**: クラスインスタンスを false として返す
  - Target: `_isDefinedData`
  - Scenario: Given クラスインスタンス (new CustomClass()), When _isDefinedData を呼び出す
  - Expected: Then false を返す (`constructor !== Object`)

- [x] **T-04-02-04**: 関数を false として返す
  - Target: `_isDefinedData`
  - Scenario: Given 関数, When _isDefinedData を呼び出す
  - Expected: Then false を返す

- [x] **T-04-02-05**: ビルトインオブジェクトを false として返す
  - Target: `_isDefinedData`
  - Scenario: Given ビルトインオブジェクト (Map, Set, RegExp), When _isDefinedData を呼び出す
  - Expected: Then false を返す

- [x] **T-04-02-06**: null/undefined を false として返す
  - Target: `_isDefinedData`
  - Scenario: Given null または undefined, When _isDefinedData を呼び出す
  - Expected: Then false を返す

### [エッジケース] Edge Cases

#### T-04-03: プロトタイプ操作されたオブジェクトの処理

- [x] **T-04-03-01**: Object.create(null) を false として返す
  - Target: `_isDefinedData`
  - Scenario: Given Object.create(null), When _isDefinedData を呼び出す
  - Expected: Then false を返す (constructor プロパティが undefined)

- [x] **T-04-03-02**: Object.create({a:1}) を false として返す
  - Target: `_isDefinedData`
  - Scenario: Given Object.create({a:1}), When _isDefinedData を呼び出す
  - Expected: Then false を返す (プロトタイプチェーン, `constructor !== Object`)

- [x] **T-04-03-03**: フリーズされた plain object を正しく検出
  - Target: `_isDefinedData`
  - Scenario: Given Object.freeze({}), When _isDefinedData を呼び出す
  - Expected: Then true を返す (フリーズされていても `constructor === Object`)

- [x] **T-04-03-04**: シールされた plain object を正しく検出
  - Target: `_isDefinedData`
  - Scenario: Given Object.seal({}), When _isDefinedData を呼び出す
  - Expected: Then true を返す (シールされていても `constructor === Object`)

---

## T-05: 相互排他性検証

### [正常] Mutual Exclusivity

#### T-05-01: カテゴリの相互排他性保証

- [ ] **T-05-01-01**: Primitive 値は Atomic のみにマッチ
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given プリミティブ値 (string, number など), When すべての分類関数を呼び出す
  - Expected: Then _isAtomic のみが true を返し、他はすべて false を返す

- [ ] **T-05-01-02**: Date は SingleValue のみにマッチ
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given Date オブジェクト, When すべての分類関数を呼び出す
  - Expected: Then _isSingleValue のみが true を返し、他はすべて false を返す

- [ ] **T-05-01-03**: 配列は Collection のみにマッチ
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given 配列, When すべての分類関数を呼び出す
  - Expected: Then _isCollection のみが true を返し、他はすべて false を返す

- [ ] **T-05-01-04**: Plain object は Collection と DefinedData の両方にマッチ
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given plain object ({}), When すべての分類関数を呼び出す
  - Expected: Then `_isCollection` と `_isDefinedData` が true を返し、他は false を返す

- [ ] **T-05-01-05**: クラスインスタンスはどのカテゴリにもマッチしない
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given クラスインスタンス, When すべての分類関数を呼び出す
  - Expected: Then すべての関数が false を返す (意図的に未分類)

- [ ] **T-05-01-06**: 関数はどのカテゴリにもマッチしない
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given 関数, When すべての分類関数を呼び出す
  - Expected: Then すべての関数が false を返す (意図的に未分類)

- [ ] **T-05-01-07**: ビルトインオブジェクトはどのカテゴリにもマッチしない
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given ビルトインオブジェクト (RegExp, Map など), When すべての分類関数を呼び出す
  - Expected: Then すべての関数が false を返す (意図的に未分類)

- [ ] **T-05-01-08**: null は Atomic のみにマッチ
  - Target: `_isAtomic, _isSingleValue, _isCollection, _isDefinedData`
  - Scenario: Given null, When すべての分類関数を呼び出す
  - Expected: Then _isAtomic のみが true を返し、他はすべて false を返す

---

<!--
Task ID Format: T-<TestTarget>-<Scenario>-<Case>
- TestTarget: 2-digit (01, 02, ...)
- Scenario: 2-digit (01, 02, ...)
- Case: 2-digit (01, 02, ...)

Example: T-01-02-03 = TestTarget 01, Scenario 02, Case 03

Total Tasks: 58 test cases
- T-01 (_isAtomic): 17 cases
- T-02 (_isSingleValue): 8 cases
- T-03 (_isCollection): 15 cases
- T-04 (_isDefinedData): 10 cases
- T-05 (相互排他性): 8 cases
-->
