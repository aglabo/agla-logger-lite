---
title: "Specifications: detect<Category>Kind Functions"
module: "value-domain/detectKind"
status: Draft
created: "2025-12-30 04:45:00"
derived_from: "Requirements: detect<Category>Kind Functions (v1.0)"
updated: "2025-12-30 (reorganized with _is<Kind>Function unification)"
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading line-length -->

> This document specifies the detailed implementation design for the four category-specific kind detection functions that return `AGTValueKind` when a value belongs to that category.
>
> **Design Principle:** Each `detect<Category>Kind` function wraps its corresponding `_is<Kind>Function`, transforming boolean classification into Kind-based detection. The functions are organized by Kind, not by Category.

---

## Architecture: Detection Function Hierarchy

### Two-Layer Detection System

```bash
Value Input
    ↓
_is<Kind>Function (boolean classification)
    ↓
detect<Category>Kind (Kind transformation)
    ↓
AGTValueKind | undefined (Kind or undefined)
```

### Function Mapping

| Kind       | Helper Function   | Detect Function                                      | Category                 |
| ---------- | ----------------- | ---------------------------------------------------- | ------------------------ |
| Primitive  | `_isPrimitive()`  | `detectAtomicKind()`                                 | Atomic                   |
| Date       | `_isDate()`       | `detectSingleValueKind()`                            | SingleValue              |
| Array      | `_isArray()`      | `detectCollectionKind()`                             | Collection               |
| JSONObject | `_isJsonObject()` | `detectCollectionKind()` / `detectDefinedDataKind()` | Collection / DefinedData |

In typical structural classification flows,
detectCollectionKind may be preferred.
detectDefinedDataKind is intended for semantic handling flows.

### Implementation Pattern

Each `detect<Category>Kind` function:

1. Calls corresponding `_is<Kind>Function(value)`
2. If true, returns the specific `AGTValueKind`
3. If false, returns `undefined`

---

## Type System Foundation

### AGTValueKind Enum

```typescript
enum AGTValueKind {
  Primitive = 'Primitive', // From _isPrimitive()
  Date = 'Date', // From _isDate()
  Array = 'Array', // From _isArray()
  JSONObject = 'JSONObject', // From _isJsonObject()
}
```

### AGTValueCategory Enum

```typescript
enum AGTValueCategory {
  Atomic = 'Atomic', // Primitive values
  SingleValue = 'SingleValue', // Date objects
  Collection = 'Collection', // Array, JSONObject
  DefinedData = 'DefinedData', // Plain objects
}
```

### Kind-to-Category Mapping

| AGTValueKind | AGTValueCategory              |
| ------------ | ----------------------------- |
| Primitive    | Atomic                        |
| Date         | SingleValue                   |
| Array        | Collection                    |
| JSONObject   | Collection (also DefinedData) |

---

## Function Specifications

### SPEC-01: detectAtomicKind (using _isPrimitive)

#### Signature

```typescript
export const detectAtomicKind = (value: unknown): AGTValueKind | undefined
```

#### Purpose

Detect if a value is a Primitive (atomic value) and return its Kind.

#### Detection Logic

Uses `_isPrimitive(value)` to determine if the value is a primitive type:

- Returns `AGTValueKind.Primitive` if `_isPrimitive(value) === true`
- Returns `undefined` if `_isPrimitive(value) === false`

Primitive types detected by `_isPrimitive`:

- `null` or `undefined`
- `string`
- `number` (including `NaN`, `Infinity`)
- `boolean`
- `symbol`
- `bigint`

**Implementation Pattern:**

```typescript
if (_isPrimitive(value)) {
  return AGTValueKind.Primitive;
}
return undefined;
```

#### Return Value

- Returns `AGTValueKind.Primitive` if value is primitive
- Returns `undefined` if value is not primitive

#### Examples

```typescript
detectAtomicKind('hello'); // AGTValueKind.Primitive
detectAtomicKind(42); // AGTValueKind.Primitive
detectAtomicKind(true); // AGTValueKind.Primitive
detectAtomicKind(null); // AGTValueKind.Primitive
detectAtomicKind(undefined); // AGTValueKind.Primitive
detectAtomicKind(Symbol('test')); // AGTValueKind.Primitive
detectAtomicKind(100n); // AGTValueKind.Primitive

detectAtomicKind({}); // undefined
detectAtomicKind([]); // undefined
detectAtomicKind(new Date()); // undefined
detectAtomicKind(() => {}); // undefined
```

#### Use Case

Determine if a value is atomic (cannot be decomposed) and confirm its Primitive Kind classification.

#### Performance Guarantee

- Time complexity: O(1)
- Single `_isPrimitive()` call
- No recursion, no loops
- No heap allocation

#### JSDoc Requirements

- Explain Atomic category and Primitive types
- List examples for both positive and negative cases
- Note about null/undefined being Primitive
- Remarks about _isPrimitive() detection method
- Performance characteristics

---

### SPEC-02: detectSingleValueKind (using _isDate)

#### Signature

```typescript
export const detectSingleValueKind = (value: unknown): AGTValueKind | undefined
```

#### Purpose

Detect if a value is a Date instance and return its Kind.

#### Detection Logic

Uses `_isDate(value)` to determine if the value is a Date instance:

- Returns `AGTValueKind.Date` if `_isDate(value) === true`
- Returns `undefined` if `_isDate(value) === false`

Date detection by `_isDate`:

- Must be created by Date constructor or `new Date()`
- Uses `instanceof Date` check
- Excludes duck-typed Date-like objects

**Implementation Pattern:**

```typescript
if (_isDate(value)) {
  return AGTValueKind.Date;
}
return undefined;
```

non-normative note:
将来、`RegExp`,`URL`等が追加される可能性ある。

#### Return Value

- Returns `AGTValueKind.Date` if value is a Date instance
- Returns `undefined` if value is not a Date

#### Examples

```typescript
detectSingleValueKind(new Date()); // AGTValueKind.Date
detectSingleValueKind(new Date('2025-12-30')); // AGTValueKind.Date
detectSingleValueKind(Date.now()); // undefined (returns number)

detectSingleValueKind(null); // undefined
detectSingleValueKind(undefined); // undefined
detectSingleValueKind('2025-12-30'); // undefined
detectSingleValueKind({}); // undefined
detectSingleValueKind(new Map()); // undefined
detectSingleValueKind({ getTime: () => Date.now() }); // undefined (duck-type excluded)
```

#### Use Case

Determine if a value is a Date object and needs special formatting for date/time representation.

#### Performance Guarantee

- Time complexity: O(1)
- Single `_isDate()` call (using `instanceof`)
- No recursion, no loops
- No heap allocation

#### JSDoc Requirements

- Explain SingleValue category and Date detection
- List examples for Date and non-Date values
- Note about duck-type exclusion
- Remarks about _isDate() and instanceof behavior
- Performance characteristics

---

### SPEC-03: detectCollectionKind (using `_isArray` and`_isJsonObject`)

#### Signature

```typescript
export const detectCollectionKind = (value: unknown): AGTValueKind | undefined
```

#### Purpose

Detect if a value is a Collection (Array or JSONObject) and return its specific Kind.

#### Detection Logic

Uses two helper functions to detect Collection types:

1. **For Array:** `_isArray(value) === true` → returns `AGTValueKind.Array`
2. **For JSONObject:** `_isJsonObject(value) === true` → returns `AGTValueKind.JSONObject`
3. **Otherwise:** returns `undefined`

**Implementation Pattern:**

```typescript
if (_isArray(value)) {
  return AGTValueKind.Array;
}
if (_isJsonObject(value)) {
  return AGTValueKind.JSONObject;
}
return undefined;
```

Array detection by `_isArray`:

- Uses `Array.isArray(value)` check

JSONObject detection by `_isJsonObject`:

- Must be object type: `typeof value === 'object'`
- Must have Object.prototype as direct prototype: `Object.getPrototypeOf(value) === Object.prototype`
- Excludes null, built-in objects, and custom class instances

#### Return Value

- Returns `AGTValueKind.Array` if value is an array
- Returns `AGTValueKind.JSONObject` if value is a plain object
- Returns `undefined` if value is neither Array nor JSONObject

#### Examples

```typescript
// Arrays
detectCollectionKind([]); // AGTValueKind.Array
detectCollectionKind([1, 2, 3]); // AGTValueKind.Array
detectCollectionKind(['a', 'b']); // AGTValueKind.Array
detectCollectionKind([{}, {}, {}]); // AGTValueKind.Array
detectCollectionKind(new Array(5)); // AGTValueKind.Array

// Plain Objects
detectCollectionKind({}); // AGTValueKind.JSONObject
detectCollectionKind({ a: 1 }); // AGTValueKind.JSONObject
detectCollectionKind({ a: {}, b: [] }); // AGTValueKind.JSONObject
detectCollectionKind(Object.create(Object.prototype)); // AGTValueKind.JSONObject

// Non-Collections
detectCollectionKind(null); // undefined
detectCollectionKind(undefined); // undefined
detectCollectionKind('string'); // undefined
detectCollectionKind(42); // undefined
detectCollectionKind(new Date()); // undefined
detectCollectionKind(new Map()); // undefined
detectCollectionKind(new Set()); // undefined
detectCollectionKind(class Foo {}); // undefined
detectCollectionKind(new (class Foo {})()); // undefined
```

#### Use Case

Determine if a value is a container that can be iterated or composed, with specific Kind information (Array vs JSONObject).

#### Performance Guarantee

- Time complexity: O(1)
- Two maximum checks: `_isArray()` or `_isJsonObject()`
- No recursion, no loops
- No heap allocation

#### JSDoc Requirements

- Explain Collection category (Array and JSONObject)
- List detection methods for each Kind
- Examples for both Array and JSONObject
- Note about exclusions (null, Date, custom classes)
- Remarks about prototype chain checking
- Performance characteristics

---

### SPEC-04: detectDefinedDataKind (using _isJsonObject)

#### Signature

```typescript
export const detectDefinedDataKind = (value: unknown): AGTValueKind | undefined
```

#### Purpose

Detect if a value is DefinedData (json typed object) and return its Kind.

#### Detection Logic

Uses `_isJsonObject(value)` to determine if the value is a plain JSON-like object:

- Returns `AGTValueKind.JSONObject` if `_isJsonObject(value) === true`
- Returns `undefined` if `_isJsonObject(value) === false`

JSONObject detection by `_isJsonObject`:

- Must be object type: `typeof value === 'object'`
- Must have `Object.prototype` as direct prototype
- Represents user-defined structured data

**Implementation Pattern:**

```typescript
if (_isJsonObject(value)) {
  return AGTValueKind.JSONObject;
}
return undefined;
```

#### Return Value

- Returns `AGTValueKind.JSONObject` if value is a plain object
- Returns `undefined` if value is not a plain object

#### Examples

```typescript
detectDefinedDataKind({}); // AGTValueKind.JSONObject
detectDefinedDataKind({ a: 1, b: 2 }); // AGTValueKind.JSONObject
detectDefinedDataKind({ nested: {} }); // AGTValueKind.JSONObject
detectDefinedDataKind(Object.create(Object.prototype)); // AGTValueKind.JSONObject

detectDefinedDataKind([]); // undefined (Array, not DefinedData)
detectDefinedDataKind(null); // undefined
detectDefinedDataKind(undefined); // undefined
detectDefinedDataKind('string'); // undefined
detectDefinedDataKind(42); // undefined
detectDefinedDataKind(new Date()); // undefined
detectDefinedDataKind(new Map()); // undefined
detectDefinedDataKind(class Foo {}); // undefined
detectDefinedDataKind(new (class Foo {})()); // undefined
```

#### Use Case

Determine if a value is a user-defined data structure (plain object) that represents semantic data, distinct from arrays and other types.

#### Performance Guarantee

- Time complexity: O(1)
- Single `_isJsonObject()` call
- No recursion, no loops
- No heap allocation

#### JSDoc Requirements

- Explain DefinedData category (plain objects)
- Distinguish from Collection (Arrays are not DefinedData)
- Examples for plain objects and exclusions
- Note about forward-compatible design
- Remarks about _isJsonObject() and prototype checking
- Performance characteristics

---

## Design Pattern: Mutual Exclusivity

### Structural Mutual Exclusivity

Each value belongs to exactly one *structural primary category*,
determined by its detected Kind.

- Atomic, SingleValue, and Collection are structural categories
- DefinedData is a semantic sub-category layered on top of Collection

### Category Partitioning

The four functions partition all values into mutually exclusive categories:

```bash
Value Universe
├─ Atomic (detectAtomicKind via _isPrimitive)
│  └─ Primitive: 'string', 42, null, undefined, true, Symbol(), 100n
├─ SingleValue (detectSingleValueKind via _isDate)
│  └─ Date: new Date()
├─ Collection (detectCollectionKind via _isArray/_isJsonObject)
│  ├─ Array: [], [1, 2], new Array()
│  └─ JSONObject: {}, { a: 1 }
```

`Function`など、上記以外のデータは`undefined`を返す。

### Key Characteristics

1. Structural Primary Categories:
   - Atomic
   - SingleValue
   - Collection

2. Semantic Category:
   - DefinedData (subset of Collection)

## Implementation Location

### File Path

```typescript
packages/@aglabo/agla-logger-composer/src/helpers/value-domain/
```

### Options

1. **Primary:** Add to existing `detectValueHelpers.ts`
   - Extends current detection capabilities
   - Maintains consistency with existing patterns

2. **Alternative:** Create new file `detectCategoryKind.ts`
   - Keeps category-specific functions grouped
   - Allows independent import

### Exports

- All four functions must be exported for public API
- Add to `index.ts` exports
- Must integrate with value-domain module

### Integration Points

- Coexist with `detectValueKind` and `detectValueCategory`
- Used in stringification/formatting pipeline
- Complements existing value classification system
- No breaking changes to existing exports

---

## Implementation Guidelines

### Type Safety

```typescript
// Each function signature must be:
export const detect<Category>Kind = (value: unknown): AGTValueKind | undefined => {
  // Call corresponding _is<Kind>Function
  // Return specific Kind or undefined
};
```

### Code Style

- Use arrow functions: `const fn = () => {}`
- All parameters and return types must be explicit
- No `any` types
- Type imports: `import type { T } from '...'`

### Helper Function Dependencies

Each detect function depends on specific `_is<Kind>` functions:

| Function                | Dependencies                    | Location             |
| ----------------------- | ------------------------------- | -------------------- |
| `detectAtomicKind`      | `_isPrimitive()`                | `isValueFunction.ts` |
| `detectSingleValueKind` | `_isDate()`                     | `isValueFunction.ts` |
| `detectCollectionKind`  | `_isArray()`, `_isJsonObject()` | `isValueFunction.ts` |
| `detectDefinedDataKind` | `_isJsonObject()`               | `isValueFunction.ts` |

### Documentation

Each function must include:

- Clear JSDoc with purpose and use case
- Parameter description (`@param`)
- Return type explanation (`@returns`)
- Remarks section (`@remarks`) explaining detection logic and helper function usage
- Multiple examples (`@example`) for common cases
- Special considerations for edge cases

### Performance Considerations

- O(1) time complexity required
- Single `_is<Kind>Function` call per execution
- No recursion or loops
- Minimal operations per call

### Testing Strategy

- BDD format: `Given X, When Y, Then Z`
- Test each Kind with multiple examples
- Test edge cases (null, undefined, duck-types)
- Test mutual exclusivity between functions
- 5-layer test pyramid: unit/functional/integration/e2e/runtime

---

## Quality Assurance

### Type Checking

```bash
pnpm run check:types
```

Must pass without errors or warnings.

### Linting

```bash
pnpm run lint-all
pnpm run lint-all:types
```

No issues allowed.

### Code Formatting

```bash
pnpm run check:dprint
```

Code must follow project formatting standards.

### Testing

```bash
pnpm run test:all
```

All test layers must pass.

### Build Verification

```bash
pnpm run build
```

Must generate valid distribution artifacts.

---

## Related Implementation References

### Helper Functions (`_is<Kind>` Functions)

These functions are the foundation for each detect function:

- **`_isPrimitive(value)`** (isValueFunction.ts)
  - Returns `true` for: null, undefined, string, number, boolean, symbol, bigint
  - Used by: `detectAtomicKind`
  - Detection pattern: `typeof` checks and null/undefined guard

- **`_isDate(value)`** (isValueFunction.ts)
  - Returns `true` for: Date instances only
  - Used by: `detectSingleValueKind`
  - Detection pattern: `instanceof Date`

- **`_isArray(value)`** (isValueFunction.ts)
  - Returns `true` for: Array instances
  - Used by: `detectCollectionKind`
  - Detection pattern: `Array.isArray(value)`

- **`_isJsonObject(value)`** (isValueFunction.ts)
  - Returns `true` for: Plain objects with Object.prototype
  - Used by: `detectCollectionKind` and `detectDefinedDataKind`
  - Detection pattern: `typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype`

### Type Definitions

- `AGTValueKind` (AGTValueDomain.ts:18-30)
- `AGTValueCategory` (AGTValueDomain.ts:47-59)
- `AG_KIND_TO_CATEGORY` mapping (AGTValueDomain.ts:69-74)

### Related Detection Functions

- `detectValueKind()` (detectValueHelpers.ts:35-59)
  - Base kind detection (currently partial)
  - Pattern for Kind determination

- `detectValueCategory()` (detectValueHelpers.ts:78-89)
  - Kind-to-Category conversion
  - Uses mapping table

---

## Acceptance Criteria

Implementation is complete when:

1. ✓ All four functions implemented with correct detection logic
2. ✓ Each function uses corresponding `_is<Kind>Function`
3. ✓ Each function returns appropriate Kind or undefined
4. ✓ Functions maintain mutual exclusivity in primary categories
5. ✓ Full TypeScript type safety (no `any` types)
6. ✓ Comprehensive JSDoc with multiple examples
7. ✓ O(1) performance guarantee maintained
8. ✓ All quality gates pass (types, lint, format, build, test)
9. ✓ Functions properly exported and integrated
10. ✓ Test coverage for all Kinds and edge cases
11. ✓ Consistent with existing code style and patterns
12. ✓ Clear documentation of `_is<Kind>Function` dependencies

---

**Version**: 1.1
**Last Updated**: 2025-12-30
**Status**: Ready for Implementation Phase
