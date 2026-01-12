// src: base/src/plugins/__tests__/unit/pathResolvers.spec.ts
// @(#) Unit tests for path resolution functions
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import path from 'path';
import { describe, expect, it } from 'vitest';
import { findPackageRoot, mapAliasToPath, resolveAliasedPath } from '../../pathResolvers.ts';

describe('Given: pathResolvers module', () => {
  describe('When: findPackageRoot is called', () => {
    describe('Then: [正常] Find package root in directory tree', () => {
      it('Given directory with package.json, When called, Then return that directory', () => {
        // Arrange
        const startDir = '/project';
        const hasPackageJson = (dir: string) => dir === '/project';

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert
        expect(result).toBe('/project');
      });

      it('Given nested directory, When called, Then walk up to find package root', () => {
        // Arrange
        const startDir = '/project/src/utils';
        const hasPackageJson = (dir: string) => dir === '/project';

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert
        expect(result).toBe('/project');
      });

      it('Given deeply nested directory, When called, Then walk up multiple levels', () => {
        // Arrange
        const startDir = '/project/src/components/ui/button';
        const hasPackageJson = (dir: string) => dir === '/project';

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert
        expect(result).toBe('/project');
      });
    });

    describe('Then: [正常] Multiple package.json in tree', () => {
      it('Given nested packages, When called, Then return nearest package root', () => {
        // Arrange
        const startDir = '/project/packages/foo/src';
        const packageDirs = new Set(['/project', '/project/packages/foo']);
        const hasPackageJson = (dir: string) => packageDirs.has(dir);

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert (should find nearest, which is /project/packages/foo)
        expect(result).toBe('/project/packages/foo');
      });
    });

    describe('Then: [異常] No package.json found', () => {
      it('Given no package.json in tree, When called, Then return null', () => {
        // Arrange
        const startDir = '/project/src';
        const hasPackageJson = (_dir: string) => false;

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert
        expect(result).toBeNull();
      });

      it('Given filesystem root reached, When called, Then return null', () => {
        // Arrange
        const startDir = '/';
        const hasPackageJson = (_dir: string) => false;

        // Act
        const result = findPackageRoot(startDir, hasPackageJson);

        // Assert
        expect(result).toBeNull();
      });
    });
  });

  describe('When: mapAliasToPath is called', () => {
    describe('Then: [正常] Map alias to target path', () => {
      it('Given matching alias, When called, Then replace alias with target', () => {
        // Arrange
        const importPath = '#shared/types';
        const aliases = { '#shared': './shared' };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toEqual({
          matched: '#shared',
          mapped: './shared/types',
        });
      });

      it('Given alias at import start, When called, Then replace correctly', () => {
        // Arrange
        const importPath = '#runtime/core';
        const aliases = { '#runtime': './src/runtime' };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toEqual({
          matched: '#runtime',
          mapped: './src/runtime/core',
        });
      });

      it('Given exact alias match, When called, Then return target without subpath', () => {
        // Arrange
        const importPath = '#shared';
        const aliases = { '#shared': './shared' };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toEqual({
          matched: '#shared',
          mapped: './shared',
        });
      });
    });

    describe('Then: [正常] Multiple aliases', () => {
      it('Given multiple aliases, When one matches, Then use matched alias', () => {
        // Arrange
        const importPath = '#runtime/core';
        const aliases = {
          '#shared': './shared',
          '#runtime': './src/runtime',
          '#tests': './tests',
        };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toEqual({
          matched: '#runtime',
          mapped: './src/runtime/core',
        });
      });

      it('Given overlapping aliases, When called, Then use first match', () => {
        // Arrange
        const importPath = '#shared/utils';
        const aliases = {
          '#shared': './shared',
          '#shared/utils': './utils', // This should not match first
        };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result?.matched).toBe('#shared');
      });
    });

    describe('Then: [異常] No matching alias', () => {
      it('Given non-matching import, When called, Then return null', () => {
        // Arrange
        const importPath = './relative/path';
        const aliases = { '#shared': './shared' };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toBeNull();
      });

      it('Given empty aliases, When called, Then return null', () => {
        // Arrange
        const importPath = '#shared/types';
        const aliases = {};

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toBeNull();
      });

      it('Given partial match, When called, Then return null', () => {
        // Arrange
        const importPath = 'not#shared/types';
        const aliases = { '#shared': './shared' };

        // Act
        const result = mapAliasToPath(importPath, aliases);

        // Assert
        expect(result).toBeNull();
      });
    });
  });

  describe('When: resolveAliasedPath is called', () => {
    describe('Then: [正常] Complete resolution pipeline', () => {
      it('Given valid alias and package root, When file exists, Then return resolved path', () => {
        // Arrange
        const importPath = '#shared/types';
        const resolveDir = '/project/src';
        const aliases = { '#shared': './shared' };
        const packageRootFinder = (_dir: string) => '/project';
        const isDirectory = (_path: string) => false;
        const indexFileFinder = (_dir: string) => null;

        // Act
        const result = resolveAliasedPath(
          importPath,
          resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        // Assert
        expect(result).toContain('shared');
        expect(result).toContain('types');
      });

      it('Given directory path, When index file found, Then return index file path', () => {
        // Arrange
        const importPath = '#shared/utils';
        const resolveDir = '/project/src';
        const aliases = { '#shared': './shared' };
        const packageRootFinder = (_dir: string) => '/project';
        const isDirectory = (p: string) => p.includes('shared') && p.includes('utils');
        const indexFileFinder = (dir: string) =>
          dir.includes('shared') && dir.includes('utils') ? path.posix.resolve(dir, 'index.ts') : null;

        // Act
        const result = resolveAliasedPath(
          importPath,
          resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        // Assert
        expect(result).toContain('shared');
        expect(result).toContain('utils');
        expect(result).toContain('index.ts');
      });
    });

    describe('Then: [異常] Resolution failures', () => {
      it('Given no alias match, When called, Then return null', () => {
        // Arrange
        const importPath = './relative/path';
        const resolveDir = '/project/src';
        const aliases = { '#shared': './shared' };
        const packageRootFinder = (_dir: string) => '/project';
        const isDirectory = (_path: string) => false;
        const indexFileFinder = (_dir: string) => null;

        // Act
        const result = resolveAliasedPath(
          importPath,
          resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        // Assert
        expect(result).toBeNull();
      });

      it('Given package root not found, When called, Then return null', () => {
        // Arrange
        const importPath = '#shared/types';
        const resolveDir = '/project/src';
        const aliases = { '#shared': './shared' };
        const packageRootFinder = (_dir: string) => null;
        const isDirectory = (_path: string) => false;
        const indexFileFinder = (_dir: string) => null;

        // Act
        const result = resolveAliasedPath(
          importPath,
          resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        // Assert
        expect(result).toBeNull();
      });
    });

    describe('Then: [正常] Edge cases', () => {
      it('Given directory without index file, When called, Then return directory path', () => {
        // Arrange
        const importPath = '#shared/types';
        const resolveDir = '/project/src';
        const aliases = { '#shared': './shared' };
        const packageRootFinder = (_dir: string) => '/project';
        const isDirectory = (p: string) => p.includes('shared') && p.includes('types');
        const indexFileFinder = (_dir: string) => null; // No index file found

        // Act
        const result = resolveAliasedPath(
          importPath,
          resolveDir,
          aliases,
          packageRootFinder,
          isDirectory,
          indexFileFinder,
        );

        // Assert
        expect(result).toContain('shared');
        expect(result).toContain('types');
      });
    });
  });
});
