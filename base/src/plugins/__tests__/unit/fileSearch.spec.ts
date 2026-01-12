// src: base/src/plugins/__tests__/unit/fileSearch.spec.ts
// @(#) Unit tests for file search helpers
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { DEFAULT_INDEX_EXTENSIONS, findIndexFile } from '../../fileSearch.helpers.ts';

describe('Given: fileSearch.helpers module', () => {
  describe('When: findIndexFile is called', () => {
    describe('Then: [正常] Find index file with various extensions', () => {
      it('Given index.ts exists, When called, Then return path to index.ts', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.ts';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.ts');
      });

      it('Given index.tsx exists, When called, Then return path to index.tsx', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.tsx';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.tsx');
      });

      it('Given index.js exists, When called, Then return path to index.js', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.js';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.js');
      });

      it('Given index.jsx exists, When called, Then return path to index.jsx', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.jsx';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.jsx');
      });
    });

    describe('Then: [正常] Priority order of extensions', () => {
      it('Given multiple index files exist, When called, Then return first match in priority order', () => {
        // Arrange
        const dirPath = '/project/src';
        const existingFiles = new Set([
          '/project/src/index.js',
          '/project/src/index.ts',
          '/project/src/index.jsx',
        ]);
        const fileExists = (p: string) => existingFiles.has(p.replace(/\\/g, '/'));

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert (index.ts has higher priority than index.js)
        expect(result).toBe('/project/src/index.ts');
      });

      it('Given only lower priority file exists, When called, Then return that file', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.jsx';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.jsx');
      });
    });

    describe('Then: [正常] Custom extension lists', () => {
      it('Given custom extensions, When called, Then use custom extensions', () => {
        // Arrange
        const dirPath = '/project/src';
        const customExtensions = ['custom.ts', 'custom.js'] as const;
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/custom.ts';

        // Act
        const result = findIndexFile(dirPath, customExtensions, fileExists);

        // Assert
        expect(result).toBe('/project/src/custom.ts');
      });

      it('Given single extension, When called, Then check only that extension', () => {
        // Arrange
        const dirPath = '/project/src';
        const singleExtension = ['index.ts'] as const;
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/index.ts';

        // Act
        const result = findIndexFile(dirPath, singleExtension, fileExists);

        // Assert
        expect(result).toBe('/project/src/index.ts');
      });
    });

    describe('Then: [異常] No index file found', () => {
      it('Given no index files exist, When called, Then return null', () => {
        // Arrange
        const dirPath = '/project/src';
        const fileExists = (_p: string) => false;

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBeNull();
      });

      it('Given empty extension list, When called, Then return null', () => {
        // Arrange
        const dirPath = '/project/src';
        const emptyExtensions = [] as const;
        const fileExists = (_p: string) => true;

        // Act
        const result = findIndexFile(dirPath, emptyExtensions, fileExists);

        // Assert
        expect(result).toBeNull();
      });
    });

    describe('Then: [正常] Path handling', () => {
      it('Given directory with spaces, When called, Then handle path correctly', () => {
        // Arrange
        const dirPath = '/project/my folder/src';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/my folder/src/index.ts';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/my folder/src/index.ts');
      });

      it('Given nested directory path, When called, Then construct correct full path', () => {
        // Arrange
        const dirPath = '/project/src/components/ui';
        const fileExists = (p: string) => p.replace(/\\/g, '/') === '/project/src/components/ui/index.ts';

        // Act
        const result = findIndexFile(dirPath, DEFAULT_INDEX_EXTENSIONS, fileExists);

        // Assert
        expect(result).toBe('/project/src/components/ui/index.ts');
      });
    });
  });

  describe('When: DEFAULT_INDEX_EXTENSIONS constant is used', () => {
    describe('Then: [正常] Constant properties', () => {
      it('Given constant, When accessed, Then contain expected extensions in order', () => {
        // Arrange & Act
        const extensions = DEFAULT_INDEX_EXTENSIONS;

        // Assert
        expect(extensions).toEqual(['index.ts', 'index.tsx', 'index.js', 'index.jsx']);
      });

      it('Given constant, When accessed, Then be readonly array', () => {
        // Arrange
        const extensions = DEFAULT_INDEX_EXTENSIONS;

        // Assert (TypeScript compile-time check, runtime verification of immutability)
        expect(Object.isFrozen(extensions)).toBe(false); // as const doesn't freeze at runtime
        expect(extensions).toHaveLength(4);
      });
    });
  });
});
