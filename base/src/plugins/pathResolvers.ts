// src: base/src/plugins/pathResolvers.ts
// @(#) : Pure path resolution functions for alias rewriting
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// libs
import path from 'path';

// types
export type HasPackageJsonPredicate = (dir: string) => boolean;
export type PackageRootFinder = (dir: string) => string | null;
export type IndexFileFinder = (dir: string) => string | null;
export type IsDirectoryPredicate = (path: string) => boolean;

export type AliasMappingResult = {
  readonly matched: string;
  readonly mapped: string;
} | null;

// helpers
/**
 * Find package root by walking up directory tree
 * Pure recursive function with no mutation
 *
 * @param startDir - Starting directory to search from
 * @param hasPackageJson - Predicate to check if directory has package.json
 * @returns Package root directory path, or null if not found
 *
 * @example
 * ```typescript
 * const root = findPackageRoot('/project/src/utils', (dir) =>
 *   fs.existsSync(path.join(dir, 'package.json'))
 * );
 * // Returns: '/project'
 * ```
 */
export const findPackageRoot = (
  startDir: string,
  hasPackageJson: HasPackageJsonPredicate,
): string | null => {
  const parentDir = path.dirname(startDir);

  // Reached filesystem root
  if (startDir === parentDir) {
    return null;
  }

  // Found package.json in current directory
  if (hasPackageJson(startDir)) {
    return startDir;
  }

  // Recurse to parent directory
  return findPackageRoot(parentDir, hasPackageJson);
};

/**
 * Map alias import path to target path
 * Pure function using functional array methods
 *
 * @param importPath - Import path that may contain alias (e.g., '#shared/types')
 * @param aliases - Record of alias mappings (e.g., { '#shared': './shared' })
 * @returns Mapping result with matched alias and mapped path, or null if no match
 *
 * @example
 * ```typescript
 * const result = mapAliasToPath('#shared/types', { '#shared': './shared' });
 * // Returns: { matched: '#shared', mapped: './shared/types' }
 * ```
 */
export const mapAliasToPath = (
  importPath: string,
  aliases: Record<string, string>,
): AliasMappingResult => {
  const entry = Object.entries(aliases).find(([key]) => importPath.startsWith(key));

  if (!entry) {
    return null;
  }

  const [matched, target] = entry;
  return {
    matched,
    mapped: importPath.replace(matched, target),
  };
};

/**
 * Resolve aliased import path to absolute file path
 * Composes path resolution, alias mapping, and index file search
 *
 * @param importPath - Import path to resolve (e.g., '#shared/types')
 * @param resolveDir - Directory containing the importing file
 * @param aliases - Alias mappings
 * @param packageRootFinder - Function to find package root
 * @param isDirectory - Predicate to check if path is directory
 * @param indexFileFinder - Function to find index file in directory
 * @returns Absolute path to resolved file, or null if resolution fails
 *
 * @example
 * ```typescript
 * const resolved = resolveAliasedPath(
 *   '#shared/types',
 *   '/project/src',
 *   { '#shared': './shared' },
 *   findPackageRootImpl,
 *   isDirectoryImpl,
 *   findIndexFileImpl
 * );
 * // Returns: '/project/shared/types/index.ts'
 * ```
 */
export const resolveAliasedPath = (
  importPath: string,
  resolveDir: string,
  aliases: Record<string, string>,
  packageRootFinder: PackageRootFinder,
  isDirectory: IsDirectoryPredicate,
  indexFileFinder: IndexFileFinder,
): string | null => {
  // Step 1: Map alias to target path
  const mappingResult = mapAliasToPath(importPath, aliases);
  if (!mappingResult) {
    return null;
  }

  // Step 2: Find package root
  const packageRoot = packageRootFinder(resolveDir);
  if (!packageRoot) {
    return null;
  }

  // Step 3: Resolve mapped path relative to package root
  const resolved = path.posix.resolve(packageRoot, mappingResult.mapped);

  // Step 4: If directory, try to find index file
  if (isDirectory(resolved)) {
    const indexFile = indexFileFinder(resolved);
    // Normalize to forward slashes for cross-platform compatibility (esbuild expects /)
    return indexFile ?? resolved;
  }

  // Normalize to forward slashes for cross-platform compatibility
  return resolved;
};
