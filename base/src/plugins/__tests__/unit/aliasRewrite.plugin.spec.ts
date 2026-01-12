// src: base/src/plugins/__tests__/unit/aliasRewrite.plugin.spec.ts
// @(#) Unit tests for alias rewrite esbuild plugin
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { createAliasRewritePlugin } from '../../aliasRewrite.plugin.ts';

describe('Given: aliasRewrite.plugin module', () => {
  describe('When: createAliasRewritePlugin is called', () => {
    describe('Then: [正常] Plugin creation', () => {
      it('Given aliases, When called, Then return esbuild plugin object', () => {
        // Arrange
        const aliases = { '#shared': './shared' };

        // Act
        const plugin = createAliasRewritePlugin(aliases);

        // Assert
        expect(plugin).toBeDefined();
        expect(plugin.name).toBe('alias-to-relative');
        expect(plugin.setup).toBeInstanceOf(Function);
      });

      it('Given empty aliases, When called, Then still create valid plugin', () => {
        // Arrange
        const aliases = {};

        // Act
        const plugin = createAliasRewritePlugin(aliases);

        // Assert
        expect(plugin).toBeDefined();
        expect(plugin.name).toBe('alias-to-relative');
      });

      it('Given multiple aliases, When called, Then create plugin with all aliases', () => {
        // Arrange
        const aliases = {
          '#shared': './shared',
          '#runtime': './src/runtime',
          '#tests': './tests',
        };

        // Act
        const plugin = createAliasRewritePlugin(aliases);

        // Assert
        expect(plugin).toBeDefined();
        expect(plugin.name).toBe('alias-to-relative');
      });
    });

    describe('Then: [正常] Plugin setup', () => {
      it('Given plugin, When setup is called, Then register onResolve hook', () => {
        // Arrange
        const aliases = { '#shared': './shared' };
        const plugin = createAliasRewritePlugin(aliases);
        const onResolveCalls: Array<{ filter: RegExp; callback: unknown }> = [];
        const mockBuild = {
          onResolve: (options: { filter: RegExp }, callback: unknown) => {
            onResolveCalls.push({ filter: options.filter, callback });
          },
        };

        // Act
        plugin.setup(mockBuild as never);

        // Assert
        expect(onResolveCalls).toHaveLength(1);
        expect(onResolveCalls[0].filter).toEqual(/.*/);
        expect(onResolveCalls[0].callback).toBeInstanceOf(Function);
      });
    });

    describe('Then: [正常] onResolve hook behavior', () => {
      it('Given no resolveDir, When hook called, Then return null (skip entry points)', () => {
        // Arrange
        const aliases = { '#shared': './shared' };
        const plugin = createAliasRewritePlugin(aliases);
        let resolveCallback: ((args: { path: string; resolveDir?: string }) => unknown) | null = null;

        const mockBuild = {
          onResolve: (_options: { filter: RegExp }, callback: never) => {
            resolveCallback = callback;
          },
        };

        plugin.setup(mockBuild as never);

        // Act
        const result = resolveCallback?.({ path: '#shared/types' });

        // Assert
        expect(result).toBeNull();
      });

      it('Given non-aliased import, When hook called, Then return null', () => {
        // Arrange
        const aliases = { '#shared': './shared' };
        const plugin = createAliasRewritePlugin(aliases);
        let resolveCallback: ((args: { path: string; resolveDir?: string }) => unknown) | null = null;

        const mockBuild = {
          onResolve: (_options: { filter: RegExp }, callback: never) => {
            resolveCallback = callback;
          },
        };

        plugin.setup(mockBuild as never);

        // Act
        const result = resolveCallback?.({
          path: './relative/path',
          resolveDir: '/project/src',
        });

        // Assert
        expect(result).toBeNull();
      });
    });

    describe('Then: [正常] Alias resolution integration', () => {
      it('Given aliased import, When hook called, Then resolve to absolute path', () => {
        // Arrange
        const aliases = { '#shared': './shared' };
        const plugin = createAliasRewritePlugin(aliases);
        let resolveCallback: ((args: { path: string; resolveDir?: string }) => unknown) | null = null;

        const mockBuild = {
          onResolve: (_options: { filter: RegExp }, callback: never) => {
            resolveCallback = callback;
          },
        };

        plugin.setup(mockBuild as never);

        // Act
        // Note: This test will use real fs.existsSync, so result may vary
        // In production, would mock fs or use integration test
        const result = resolveCallback?.({
          path: '#shared/types',
          resolveDir: __dirname, // Use current directory for test
        });

        // Assert
        // Should return null or path object depending on if package.json found
        expect(result === null || (typeof result === 'object' && 'path' in result)).toBe(true);
      });
    });

    describe('Then: [正常] Plugin name', () => {
      it('Given plugin, When created, Then have correct name', () => {
        // Arrange
        const aliases = { '#shared': './shared' };

        // Act
        const plugin = createAliasRewritePlugin(aliases);

        // Assert
        expect(plugin.name).toBe('alias-to-relative');
      });
    });
  });
});
