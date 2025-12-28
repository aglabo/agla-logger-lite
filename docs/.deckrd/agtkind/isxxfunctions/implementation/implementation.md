---
Based on: specifications.md v1.0
Status: Active
Version: 1.1 (Aligned with DR-009)
Updated: 2025-12-27
---

# Implementation: AGTValueCategory Classification Functions

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/no-exclamation-question-mark -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading line-length -->
<!-- cSpell:ignore isxxfunctions -->

## 1. Overview

### 1.1 Purpose

This implementation plan defines code-level contracts and behavioral constraints for the `isxxfunctions` module.
The module provides **four mutually exclusive semantic classification functions** that categorize JavaScript values into `AGTValueCategory` types.

This document is explicitly aligned with **DR-009**, which establishes that:

- Class instances, user-defined types, and functions are **not semantically classified**
- Their internal structure is never inspected
- Only their *names* may be observed at formatting time

Accordingly, the former `UserDefined` concept is **removed** and replaced with **`DefinedData`**, representing *data-oriented, safe-to-expand plain objects only*.

### 1.2 Classification Functions

The module provides the following functions:

- `_isAtomic` : Detects primitive values and null / undefined
- `_isSingleValue` : Detects single-value wrappers (Date only)
- `_isCollection` : Detects arrays and JSON-compatible collection structures
- `_isDefinedData` : Detects plain data objects (`constructor === Object`)

> Class instances, user-defined types, and functions are intentionally **unclassified**.

### 1.3 Module Location

- File: `src/helpers/value-domain/isValueFunction.ts`
- Export: Internal (not part of public API)
- Visibility: Used internally by `detectValueKind()` and value classification logic

---

## 2. Type Definitions

### 2.1 Input Type

All classification functions accept:

```ts
export type InputValue = unknown;
```

Rationale: Functions must safely handle any JavaScript value without throwing or coercion.

### 2.2 Output Type

All classification functions return:

```ts
export type ClassificationResult = boolean;
```

- `true` : Value matches the semantic category
- `false` : Value does not match the category (or is intentionally unclassified)

### 2.3 Conceptual Types (Informative)

```ts
// Atomic values
type AtomicValue =
  | string
  | number
  | boolean
  | symbol
  | bigint
  | null
  | undefined;

// Single-value wrapper
type SingleValueType = Date;

// Collection structures
type CollectionType =
  | Array<unknown>
  | Record<string, unknown>;

// Defined data object (plain object only)
type DefinedDataType = Record<string, unknown>; // constructor === Object
```

> Note: Class instances, functions, and callable objects are intentionally excluded from conceptual semantic types.

---

## 3. Function Contracts

### 3.1 `_isAtomic(value: unknown): boolean`

Returns `true` if the value is a primitive, `null`, or `undefined`.

#### Invariants

- If `_isAtomic(v)` is `true`, all other classifiers MUST return `false`
- Deterministic, side-effect free

---

### 3.2 `_isSingleValue(value: unknown): boolean`

Returns `true` if the value is a `Date` instance.

#### Constraints

- Uses `instanceof Date` (REALM-local semantics)
- Returns `false` for atomic values

---

### 3.3 `_isCollection(value: unknown): boolean`

Returns `true` if the value is a collection structure.

#### Postconditions

- `true` for arrays (`Array.isArray`)
- `true` for non-null objects whose `constructor === Object`
- `false` for built-in object types (Date, RegExp, Map, Set, Error, Promise)
- `false` for functions and class instances

---

### 3.4 `_isDefinedData(value: unknown): boolean`

Represents **data-oriented, safe-to-expand plain objects only**.

#### Postconditions

Returns `true` **only if**:

- `typeof value === 'object'`
- `value !== null`
- `value.constructor === Object`

Returns `false` for:

- class instances
- functions
- built-in objects
- objects with modified or null prototypes

#### Rationale

`DefinedData` represents values whose structure is explicit, stable, and safe for data-oriented processing.

---

## 4. Explicit Non-Classification Rules (DR-009)

The following values are **intentionally unclassified**:

- Class instances (including user-defined classes)
- User-defined callable or constructible types
- Functions (named or anonymous)

### Rules

- Their internal structure MUST NOT be inspected
- They MUST NOT be assigned to any `AGTValueCategory`
- Their names MAY be observed at formatting time (best-effort)

This separation preserves semantic safety while retaining domain visibility in logs.

---

## 5. Implementation Constraints

### 5.1 Mutual Exclusivity

For any input value, **at most one** classifier may return `true`.
Unclassified values are valid and expected outcomes.

### 5.2 Performance

- Time complexity: O(1)
- No recursion
- No heap allocation

### 5.3 Error Policy

- Zero-exception policy
- No dynamic execution
- No mutation of input values

---

## 6. Observational Logging (Non-semantic)

Class and function name detection is **not part of classification**.
It may be implemented separately at formatting time:

- Class instance: `value.constructor?.name ?? ''`
- Function: `function.name ?? ''`

This observation does not imply semantic meaning.

---

## 7. Traceability

| Decision                        | Source |
| ------------------------------- | ------ |
| Class / function unclassified   | DR-009 |
| UserDefined removed             | DR-009 |
| DefinedData introduced          | DR-009 |
| Semantic vs observational split | DR-009 |

---

## 8. Change History

| Date       | Version | Description                                                |
| ---------- | ------- | ---------------------------------------------------------- |
| 2025-12-27 | 1.1     | Aligned with DR-009, replaced UserDefined with DefinedData |
