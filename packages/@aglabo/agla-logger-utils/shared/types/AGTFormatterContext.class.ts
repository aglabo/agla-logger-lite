// src: packages/@aglabo/agla-logger-utils/shared/types/AGTFormatterContext.class.ts
// @(#) Formatter context class for managing state during recursive object stringification
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import type { AGTFormatterContextOptions } from './AGTstringifiableType.types.ts';

/**
 * Formatter context for managing state during recursive object stringification.
 * Tracks circular references, element limits, and nesting depth.
 *
 * @class AGTFormatterContext
 */
export class AGTFormatterContext {
  private maxElementsValue: number = 100;
  private maxDepthValue: number = 5;
  private currentDepthValue: number = 0;
  private circularRefs: WeakSet<object> = new WeakSet();

  constructor(options?: AGTFormatterContextOptions) {
    if (options?.maxElements !== undefined) {
      this.maxElementsValue = options.maxElements;
    }
    if (options?.maxDepth !== undefined) {
      this.maxDepthValue = options.maxDepth;
    }
  }

  get maxElements(): number {
    return this.maxElementsValue;
  }

  set maxElements(max: number) {
    this.maxElementsValue = max;
  }

  get maxDepth(): number {
    return this.maxDepthValue;
  }

  set maxDepth(max: number) {
    this.maxDepthValue = max;
  }

  get currentDepth(): number {
    return this.currentDepthValue;
  }

  set currentDepth(depth: number) {
    this.currentDepthValue = depth;
  }

  has(value: object): boolean {
    return this.circularRefs.has(value);
  }

  add(value: object): void {
    this.circularRefs.add(value);
  }

  delete(value: object): void {
    this.circularRefs.delete(value);
  }

  incrementDepth(): void {
    this.currentDepthValue++;
  }

  decrementDepth(): void {
    if (this.currentDepthValue > 0) {
      this.currentDepthValue--;
    }
  }

  isMaxDepthReached(): boolean {
    return this.currentDepthValue >= this.maxDepthValue;
  }
}
