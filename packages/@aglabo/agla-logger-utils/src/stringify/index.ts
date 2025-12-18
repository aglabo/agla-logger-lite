// src: packages/@aglabo/agla-logger-utils/src/stringify/index.ts
// @(#) Stringification utilities - exports aggregation
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// String escaping
export { _escapeString } from './escapeString.ts';

// Value to string conversion
export { _stringifyValue } from './stringifyValue.ts';

// Formatters
export { _stringifyFunction, _stringifyTimestamp } from './formatters.ts';

// Array stringification
export { _stringifyArray } from './stringifyArray.ts';

// Record/object stringification
export { _stringifyRecord } from './stringifyRecord.ts';

// Type detection
export { _stringifiableType } from '../validators/stringifiableType.ts';

// Main stringification function
export { _ensureContext, stringifyObject } from './stringifyObject.ts';
