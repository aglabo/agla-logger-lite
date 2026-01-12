// src: base/src/plugins/aliasRewrite.plugin.ts
// @(#) : esbuild alias rewrite plugin
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import fs from 'node:fs';
import path from 'path';

// types
import type { Plugin as EsbuildPlugin } from 'esbuild';

// helpers
import { DEFAULT_INDEX_EXTENSIONS, findIndexFile } from './fileSearch.helpers.ts';
import { findPackageRoot, resolveAliasedPath } from './pathResolvers.ts';

// plugins
/**
 * Create esbuild plugin for alias-to-relative path rewriting
 * Thin integration layer around pure path resolution functions
 *
 * @param aliases - Alias mappings (e.g., { '#shared': './shared' })
 * @returns Esbuild plugin instance
 *
 * @example
 * ```typescript
 * esbuildPlugins: [
 *   createAliasRewritePlugin({
 *     '#shared': './shared',
 *     '#runtime': './src/runtime',
 *   })
 * ]
 * ```
 */
export const createAliasRewritePlugin = (aliases: Record<string, string>): EsbuildPlugin => {
  // Bind fs operations to create concrete implementations
  const packageRootFinder = (dir: string) =>
    findPackageRoot(dir, (d) => fs.existsSync(path.posix.resolve(d, 'package.json')));

  const isDirectory = (p: string) => {
    try {
      return fs.existsSync(p) && fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  };

  const indexFileFinder = (dir: string) => findIndexFile(dir, DEFAULT_INDEX_EXTENSIONS, fs.existsSync);

  return {
    name: 'alias-to-relative',
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        // Skip if not an import from a source file (no resolveDir means entry point)
        if (!args.resolveDir) {
          return null;
        }

        // Use composed resolver with injected dependencies
        const resolved = resolveAliasedPath(
          args.path,
          args.resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        return resolved ? { path: resolved } : null;
      });
    },
  };
};
