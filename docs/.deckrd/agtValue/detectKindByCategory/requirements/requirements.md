---
title: "Requirements: detect<Category>Kind Functions"
module: "agtValue/detectKindByCategory"
status: Draft
created: "2025-12-30 04:40:00"
derived_from: "Goal: Create category-specific functions to detect Kind from value"
---

<!-- textlint-disable ja-technical-writing/sentence-length -->
<!-- textlint-disable ja-technical-writing/max-comma -->
<!-- markdownlint-disable no-duplicate-heading line-length -->

> This document specifies the requirements for creating category-specific kind detection functions that return `AGTValueKind` when a value belongs to that category.

---

## Problem Statement

### Current State

- Existing Functions: `_isAtomic`, `_isSingleValue`, `_isCollection`, `_isDefinedData`
  - Location: `packages/@aglabo/agla-logger-composer/src/helpers/value-domain/isValueFunction.ts`
  - Behavior: Return boolean indicating if value belongs to category
  - Status: All implemented with 121 comprehensive test cases

- Type System:
  - `AGTValueKind` enum: 4 values (Primitive, Date, Array, JSONObject)
  - `AGTValueCategory` enum: 4 values (Atomic, SingleValue, Collection, DefinedData)
  - Mapping:
    - Primitive → Atomic
    - Date → SingleValue
    - Array → Collection
    - JSONObject → Collection or DefinedData (subset)

### Gap

- Classification functions return boolean, not the specific Kind
- Users need to determine both category AND the specific Kind value
- Current approach requires calling detection function + mapping separately

### Goal

Create category-specific functions that:

1. Accept `value: unknown` as input
2. Check if value belongs to the category
3. Return specific `AGTValueKind` if value matches category
4. Return `undefined` if value doesn't match category
5. Provide direct Kind detection organized by category

---

## Design Note: Forward Compatibility

**Important:** At present, DefinedData does not provide additional semantic information beyond structural safety checks.

This category exists as a forward-compatible design point, allowing future classification of user-defined data when richer runtime metadata or schemas become available.

---

## Functional Requirements

### FR-01: Atomic Kind Detection

- Function name: `detectAtomicKind`
- Signature: `(value: unknown): AGTValueKind | undefined`
- Behavior:
  - Detect if the value's Kind is Primitive
  - If so, classify it as Atomic and return `AGTValueKind.Primitive`
  - At present, Primitive is the only Kind that maps to Atomic
  - If not, return `undefined`
  - Detection method: To be specified in specification phase
- Use case: Determine if value is atomic and get its Primitive Kind

### FR-02: SingleValue Kind Detection

- Function name: `detectSingleValueKind`
- Signature: `(value: unknown): AGTValueKind | undefined`
- Behavior:
  - Detect if the value's Kind is Date
  - If so, classify it as SingleValue and return `AGTValueKind.Date`
  - At present, Date is the only Kind that maps to SingleValue
  - If not, return `undefined`
  - Detection method: To be specified in specification phase
- Use case: Determine if value is Date and get its Kind

### FR-03: Collection Kind Detection

- Function name: `detectCollectionKind`
- Signature: `(value: unknown): AGTValueKind | undefined`
- Behavior:
  - Detect if the value's Kind is Array or JSONObject
  - If so, classify it as Collection and return the corresponding `AGTValueKind` (Array or JSONObject)
  - At present, Array and JSONObject are the Kinds that map to Collection
  - If not, return `undefined`
  - Detection method: To be specified in specification phase
- Use case: Determine if value is a collection (array or plain object) and get its Kind

### FR-04: DefinedData Kind Detection

- Function name: `detectDefinedDataKind`
- Signature: `(value: unknown): AGTValueKind | undefined`
- Behavior:
  - Detect if the value's Kind is JSONObject (plain object)
  - If so, classify it as DefinedData and return `AGTValueKind.JSONObject`
  - At present, JSONObject is the only Kind that maps to DefinedData
  - If not, return `undefined`
  - Detection method: To be specified in specification phase
- Use case: Determine if value is a defined data object and get its Kind

### FR-05: Value Type Detection

- Each function must correctly detect if value is of the specified category
- Detection logic to be determined in specification phase
- Functions must be accurate and consistent with value domain classification
- Return specific Kind or undefined based on accurate value inspection

### FR-06: Return Type Guarantees

- Return type is always `AGTValueKind | undefined`
- Never returns null
- Returns only the specific Kind for the category, never other Kinds
- Example: `detectAtomicKind` never returns Date, Array, or JSONObject

---

## Non-Functional Requirements

### NFR-01: Performance

- O(1) time complexity
- No additional overhead beyond classification check
- Can be inlined by JavaScript engines

### NFR-02: Type Safety

- Full TypeScript support with type narrowing
- No `any` types
- Return type is specific Kind | undefined
- Function overloads for precise type inference if needed

### NFR-03: Code Quality

- Follows project code style (arrow functions, explicit types)
- Minimal code duplication
- Comprehensive JSDoc with examples
- Clear explanation of each function's purpose

### NFR-04: Documentation

- JSDoc includes:
  - Function purpose and use case
  - Parameter description
  - Return type explanation with examples
  - Remarks section explaining detection logic
  - Example: Show how to use for value classification
- Examples for all functions

### NFR-05: Composition Pattern

- Functions should be easily composable
- Can be used to build higher-level detection logic
- Pattern enables functional programming style

---

## Implementation Constraints

### Technical Constraints

1. Zero Dependencies: No external libraries
2. Runtime Compatibility: Node.js >=20, Deno, Bun
3. Module Format: ES2022 ESM
4. Implementation approach: Detection logic to be determined in specification
5. No Dynamic Computation: Logic must be straightforward

### File Location

- Primary: `packages/@aglabo/agla-logger-composer/src/helpers/value-domain/detectValueHelpers.ts`
- Alternative: Create new file `detectCategoryKind.ts` in value-domain
- Exports: Must be exported for public API
- No Breaking Changes: Existing exports remain functional

### Function Naming

- `detectAtomicKind` - for Atomic category
- `detectSingleValueKind` - for SingleValue category
- `detectCollectionKind` - for Collection category (Array or JSONObject)
- `detectDefinedDataKind` - for DefinedData category (plain JSON objects)
- Pattern: `detect<Category>Kind`

### Integration Points

1. Detection implementations to be determined in specification
2. Can coexist with existing `detectValueKind` and `detectValueCategory`
3. Complements the value classification system
4. Used in stringification/formatting pipeline

---

## Edge Cases & Special Considerations

### Mutual Exclusivity

- Each value matches at most one primary category
- Functions never overlap in primary classification:
  - If `detectAtomicKind` returns Kind, others return undefined
  - If `detectSingleValueKind` returns Kind, others return undefined
  - If `detectCollectionKind` or `detectDefinedDataKind` returns Kind, others return undefined

### Collection vs DefinedData Distinction

- `detectCollectionKind`: Returns Kind for both Array and JSONObject
- `detectDefinedDataKind`: Returns Kind only for plain objects (JSONObject)
- JSONObject can be both Collection and DefinedData
- Array is only Collection, never DefinedData

### Null/Undefined Handling

- `detectAtomicKind` returns Primitive Kind (null/undefined are atomic)
- All other functions return undefined for null/undefined
- Clear and predictable behavior

---

## Success Criteria

1. All four functions correctly detect their respective categories
2. Return values are consistent with category classification
3. Functions never return Kinds not in their category
4. Type safety: No `any` types, full TypeScript support
5. Documentation complete with examples for all functions
6. Performance: O(1) time complexity maintained
7. Quality gates pass: type-check, lint, dprint, build, test
8. Integration with existing value classification system

---

## Acceptance Definition

The detect\<Category>Kind functions are **complete** when:

1. All four functions implemented and working correctly
2. Each function correctly detects value membership in its category
3. Return values are consistent with Kind classification
4. Comprehensive test cases cover all categories
5. Documentation is complete with use cases
6. Full TypeScript type safety (no `any` types)
7. Quality gates pass without errors
8. Functions integrate with value domain module

---

## Related Documents

- isValueFunction: isValueFunction.ts (classification functions)
- detectValueHelpers: detectValueHelpers.ts (related detection functions)
- Value Domain Types: AGTValueDomain.ts (enum definitions)
- Related Spec: Will be derived in next step (spec phase)

---

**Version**: 1.0
**Last Updated**: 2025-12-30
**Status**: Ready for Specification Phase
