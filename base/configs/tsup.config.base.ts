// src: shared/configs/tsup.config.base.ts
// @(#) : tsup base configuration
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// types
import type { Options } from 'tsup';

// plugins
export { createAliasRewritePlugin } from '../src/plugins/alias-rewrite.plugin.ts';

// base configs: to be extended per package
export const baseConfig: Options = {
  format: ['esm'],
  target: 'es2022',
  platform: 'node',
  clean: true,
  dts: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  shims: false,
  outDir: undefined, // overwrite it per package
  entry: [], // must overwrite per package

  esbuildPlugins: [ // set alias per package
  ],
};
