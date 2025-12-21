// src: packages/@aglabo/agla-logger-composer/shared/types/AGTFormatEnvironment.class.ts
// @(#) Immutable format environment for functional recursive object stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/**
 * Environment options for AGTFormatEnvironment initialization.
 * Independent type for configuring format environment.
 */
export type AGTFormatEnvironmentConfigs = {
  /** Maximum number of elements to display in collections (default: 100) */
  readonly maxElements?: number;
  /** Display elements limit for collections */
  readonly maxDisplayElements?: number;
  /** Maximum nesting depth for recursive formatting (default: 5) */
  readonly maxDepth?: number;
};

/**
 * Immutable format environment for managing state during recursive object stringification.
 * All properties are readonly and state changes return new instances.
 *
 * @class AGTFormatEnvironment
 * @example
 * ```typescript
 * const env1 = new AGTFormatEnvironment({ maxDepth: 3 });
 * env1.addSeed(obj)
 * env1.hasSeed(obj) // true
 * // env2.seen shares the same WeakSet as env1
 * ```
 */
export class AGTFormatEnvironment {
  readonly configs: Required<AGTFormatEnvironmentConfigs>;
  seed: WeakSet<object> = new WeakSet();

  constructor(configs?: AGTFormatEnvironmentConfigs) {
    const defaultConfigs = {
      maxElements: 100,
      maxDisplayElements: 3,
      maxDepth: 3,
    };

    this.configs = {
      maxElements: this._normalizeValue(configs?.maxElements, defaultConfigs.maxElements),
      maxDisplayElements: this._normalizeValue(configs?.maxDisplayElements, defaultConfigs.maxDisplayElements),
      maxDepth: this._normalizeValue(configs?.maxDepth, defaultConfigs.maxDepth),
    };
  }

  // Normalize values: non-finite/negative -> 0, NaN/undefined -> default, float -> floor
  private readonly _normalizeValue = (value: number | undefined, defaultValue: number): number => {
    if (value === undefined) {
      return defaultValue;
    }
    if (Number.isNaN(value)) {
      return defaultValue;
    }
    if (!Number.isFinite(value)) {
      return 0;
    }
    if (value < 0) {
      return 0;
    }
    return Math.floor(value);
  };

  /**
   * Check if the element count has reached or exceeded maxElements.
   * Returns true for NaN, Infinity, or negative values regardless of maxElements.
   * When maxElements is 0, displays all elements (returns false) for valid counts.
   *
   * @param count - The current element count
   * @returns true if count >= maxElements or count is NaN/Infinity/negative, false otherwise
   */
  readonly isMaxElementsReached = (count: number): boolean => {
    // Handle special values first: NaN, Infinity, and negative values should be considered as exceeded
    if (Number.isNaN(count) || !Number.isFinite(count) || count < 0) {
      return true;
    }

    // maxElements が 0 の場合は全て表示する（無制限）
    if (this.configs.maxElements === 0) {
      return false;
    }

    return count >= this.configs.maxElements;
  };

  /**
   * Check if the display element index has reached or exceeded maxDisplayElements.
   * Returns true for NaN, Infinity, or negative values regardless of maxDisplayElements.
   * When maxDisplayElements is 0, displays all elements (returns false) for valid nth values.
   *
   * @param nth - The current element index (0-based)
   * @returns true if nth >= maxDisplayElements or nth is NaN/Infinity/negative, false otherwise
   */
  readonly isMaxDisplayReached = (nth: number): boolean => {
    // Handle special values first: NaN, Infinity, and negative values should be considered as exceeded
    if (Number.isNaN(nth) || !Number.isFinite(nth) || nth < 0) {
      return true;
    }

    // maxDisplayElements が 0 の場合は全て表示する（無制限）
    if (this.configs.maxDisplayElements === 0) {
      return false;
    }

    return nth >= this.configs.maxDisplayElements;
  };

  /**
   * Check if the current depth has reached or exceeded maxDepth.
   * Returns true for NaN, Infinity, or negative values regardless of maxDepth.
   * When maxDepth is 0, allows unlimited depth (returns false) for valid depth values.
   *
   * @param currentDepth - The current nesting depth
   * @returns true if currentDepth >= maxDepth or currentDepth is NaN/Infinity/negative, false otherwise
   */
  readonly isMaxDepthReached = (currentDepth: number): boolean => {
    // Handle special values first: NaN, Infinity, and negative values should be considered as exceeded
    if (Number.isNaN(currentDepth) || !Number.isFinite(currentDepth) || currentDepth < 0) {
      return true;
    }

    // maxDepth が 0 の場合は無制限
    if (this.configs.maxDepth === 0) {
      return false;
    }

    return currentDepth >= this.configs.maxDepth;
  };

  private readonly _isSeedable = (value: unknown): value is object | Function => {
    return (typeof value === 'object' && value !== null)
      || typeof value === 'function';
  };
  /**
   * Check if an object exists in the circular reference tracking WeakSet.
   * Uses reference equality to determine if the exact object instance has been seen.
   *
   * @param obj - The object to check
   * @returns true if the object exists in seed, false otherwise
   * @example
   * ```typescript
   * const env = new AGTFormatEnvironment();
   * const obj = { name: 'test' };
   * env.addSeed(obj);
   * env.hasSeed(obj); // true
   * env.hasSeed({}); // false (different reference)
   * ```
   */
  readonly hasSeed = (obj: object): boolean => {
    return this.seed.has(obj);
  };

  /**
   * Add an object to the circular reference tracking WeakSet.
   * Allows tracking objects that have already been processed to prevent infinite recursion.
   *
   * @param obj - The object to add to the seed
   * @throws {TypeError} if obj is null or not an object
   * @example
   * ```typescript
   * const env = new AGTFormatEnvironment();
   * const obj = { name: 'test' };
   * env.addSeed(obj);
   * env.hasSeed(obj); // true
   * ```
   */
  readonly addSeed = (obj: object): boolean => {
    if (!this._isSeedable(obj)) {
      return false;
    }
    this.seed.add(obj);
    return true;
  };

  /**
   * Delete an object from the circular reference tracking WeakSet.
   * Useful for cleaning up references when an object is no longer being processed.
   *
   * @param obj - The object to delete from the seed
   * @example
   * ```typescript
   * const env = new AGTFormatEnvironment();
   * const obj = { name: 'test' };
   * env.addSeed(obj);
   * env.deleteSeed(obj);
   * env.hasSeed(obj); // false
   * ```
   */
  readonly deleteSeed = (obj: object): boolean => {
    if (!this._isSeedable(obj)) {
      return false;
    }
    return this.seed.delete(obj);
  };
}
