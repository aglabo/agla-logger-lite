// src: /shared/types/internal/TLogValue.types.ts
// @(#) Type definitions for log message values
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export enum _TLogProjectionKind {
  DATE = 'date',
  FUNCTION = 'function',
  WRAPPER = 'wrapper',
}

/**
 * Union type for primitive log values
 */
export type _TLogValuePrimitive =
  | string
  | number
  | boolean
  | undefined
  | null;

/**
 * Union type for log values
 */
export type _TLogValueProjection =
  | { kind: _TLogProjectionKind.DATE; value: string }
  | { kind: _TLogProjectionKind.FUNCTION; value: string }
  | { kind: _TLogProjectionKind.WRAPPER; value: unknown };

export type _TJSONObject = { readonly [key: string]: _TLogValue };

export type _TLogValueCollection =
  | readonly _TLogValue[]
  | _TJSONObject;

export type _TLogValue =
  | _TLogValuePrimitive
  | _TLogValueProjection
  | _TLogValueCollection;
