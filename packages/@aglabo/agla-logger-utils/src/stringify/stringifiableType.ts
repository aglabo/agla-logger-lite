// src: packages/@aglabo/agla-logger-utils/src/stringify/stringifiableType.ts
// @(#) Type detection for stringifiable values
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { AGTStringifiableType } from '../../shared/types/AGTstringifiableType.types.ts';
import { _isClassInstance } from '../logValueValidator.ts';

/**
 * Determines the stringifiable type of a value.
 * Returns the AGTStringifiableType if the value is a special type that needs custom formatting.
 *
 * @param value - Value to check
 * @returns StringifiableType or undefined if not a special type
 * @internal
 */
export const _stringifiableType = (value: unknown): AGTStringifiableType | undefined => {
  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  // Check for Date
  if (value instanceof Date) {
    return AGTStringifiableType.Date;
  }

  // Check for RegExp
  if (value instanceof RegExp) {
    return AGTStringifiableType.RegExp;
  }

  // Check for Error
  if (value instanceof Error) {
    return AGTStringifiableType.Error;
  }

  // Check for URL
  if (value.constructor.name === 'URL') {
    return AGTStringifiableType.URL;
  }

  // Check for URLSearchParams
  if (value.constructor.name === 'URLSearchParams') {
    return AGTStringifiableType.URLSearchParams;
  }

  // Check for Map
  if (value instanceof Map) {
    return AGTStringifiableType.Map;
  }

  // Check for Set
  if (value instanceof Set) {
    return AGTStringifiableType.Set;
  }

  // Check for TypedArray
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return AGTStringifiableType.TypedArray;
  }

  // Check for ArrayBuffer
  if (value instanceof ArrayBuffer) {
    return AGTStringifiableType.ArrayBuffer;
  }

  // Check for DataView
  if (value instanceof DataView) {
    return AGTStringifiableType.DataView;
  }

  // Check for custom class
  if (_isClassInstance(value)) {
    return AGTStringifiableType.CustomClass;
  }

  return undefined;
};
