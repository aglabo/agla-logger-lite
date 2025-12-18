// src: packages/@aglabo/agla-logger-composer/src/__tests__/helpers/validatorHelpers.ts
// @(#) Shared test helper functions for validator tests
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { expect } from 'vitest';

/**
 * Unified test case tuple: [description, input, expected]
 */
export type TestCase<T = unknown> = [description: string, input: T, expected: string | boolean | number];

/**
 * Helper to test validator functions with unified format
 * @param validator - Function to validate
 * @example
 * it.each(cases)('...', testValidator(_escapeString));
 */
export const testValidator = <T>(validator: (input: T) => string | boolean) => {
  return (_: string, input: T, expected: string | number | boolean) => {
    expect(validator(input)).toBe(expected);
  };
};

/**
 * Helper to test validator functions with regex pattern matching
 * @param validator - Function to validate
 * @example
 * it.each(cases)('...', testValidatorWithRegex(_escapeString));
 */
export const testValidatorWithRegex = <T>(validator: (input: T) => string) => {
  return (_: string, input: T, expectedPattern: string | RegExp) => {
    const result = validator(input);
    const regex = typeof expectedPattern === 'string' ? new RegExp(expectedPattern) : expectedPattern;
    expect(result).toMatch(regex);
  };
};
