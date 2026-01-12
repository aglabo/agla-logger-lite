// src: base/src/plugins/fileSearch.helpers.ts
// @(#) : Pure file search helpers for index file resolution
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import path from 'path';

// types
export type FileExistsPredicate = (path: string) => boolean;
export type IsDirectoryPredicate = (path: string) => boolean;

// constants
export const DEFAULT_INDEX_EXTENSIONS = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'] as const;

// helpers
/**
 * Find index file in directory with given extensions
 * Pure function that uses injected predicate for file existence checks
 *
 * @param dirPath - Directory path to search
 * @param extensions - List of index file extensions to try
 * @param fileExists - Predicate to check if file exists
 * @returns Absolute path to found index file, or null if not found
 *
 * @example
 * ```typescript
 * const result = findIndexFile('/project/src', DEFAULT_INDEX_EXTENSIONS, fs.existsSync);
 * // Returns: '/project/src/index.ts' if exists
 * ```
 */
export const findIndexFile = (
  dirPath: string,
  extensions: readonly string[],
  fileExists: FileExistsPredicate,
): string | null => {
  const foundExtension = extensions.find((ext) => {
    const indexPath = path.posix.resolve(dirPath, ext);
    return fileExists(indexPath);
  });

  if (!foundExtension) {
    return null;
  }

  // Normalize to forward slashes for cross-platform compatibility
  return path.posix.resolve(dirPath, foundExtension);
};
