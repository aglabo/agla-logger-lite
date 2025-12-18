// src: packages/@aglabo/agla-logger-composer/src/stringify/__tests__/unit/escapeString.spec.ts
// @(#) Unit tests for string escaping
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { describe, expect, it } from 'vitest';
import { _escapeString } from '../../escapeString.ts';

describe('Given: escapeString module', () => {
  describe('When: _escapeString is called', () => {
    describe('Then: [正常] Standard string escaping', () => {
      it('Given plain string "hello", When called, Then wrap with double quotes', () => {
        // Arrange
        const str = 'hello';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"hello"');
      });

      it('Given empty string, When called, Then wrap with double quotes', () => {
        // Arrange
        const str = '';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('""');
      });

      it('Given string with spaces, When called, Then preserve spaces and wrap with quotes', () => {
        // Arrange
        const str = 'hello world';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"hello world"');
      });
    });

    describe('Then: [異常] Special character escaping', () => {
      it('Given string with double quotes, When called, Then escape quotes', () => {
        // Arrange
        const str = 'say "hi"';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"say \\"hi\\""');
      });

      it('Given string with backslash, When called, Then escape backslashes', () => {
        // Arrange
        const str = 'path\\file';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"path\\\\file"');
      });

      it('Given string with newline, When called, Then escape newline character', () => {
        // Arrange
        const str = 'line1\nline2';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"line1\\nline2"');
      });

      it('Given string with tab, When called, Then escape tab character', () => {
        // Arrange
        const str = 'col1\tcol2';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"col1\\tcol2"');
      });

      it('Given string with carriage return, When called, Then escape carriage return', () => {
        // Arrange
        const str = 'text\r\n';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"text\\r\\n"');
      });

      it('Given string with multiple special chars, When called, Then escape all', () => {
        // Arrange
        const str = 'test\n"quoted"\ttab';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"test\\n\\"quoted\\"\\ttab"');
      });
    });

    describe('Then: [エッジケース] Complex escaping scenarios', () => {
      it('Given string with only backslash, When called, Then escape properly', () => {
        // Arrange
        const str = '\\';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"\\\\"');
      });

      it('Given string with multiple backslashes, When called, Then escape all', () => {
        // Arrange
        const str = '\\\\\\';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"\\\\\\\\\\\\"');
      });

      it('Given string with consecutive double quotes, When called, Then escape all quotes', () => {
        // Arrange
        const str = '""';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"\\"\\""');
      });

      it('Given string with mixed quotes and backslashes, When called, Then escape in correct order', () => {
        // Arrange
        const str = '\\"'; // input: \ + "

        // Act
        const result = _escapeString(str);

        // Assert
        // \ -> \\ (escape backslash)
        // " -> \" (escape quote)
        // Result: \" + \" wrapped in quotes = "\\\""
        expect(result).toBe('"\\\\\\""');
      });

      it('Given string with all special characters, When called, Then escape all correctly', () => {
        // Arrange
        const str = '\\\n\r\t"'; // input: \ + newline + CR + tab + "

        // Act
        const result = _escapeString(str);

        // Assert
        // \ -> \\
        // newline -> \n
        // CR -> \r
        // tab -> \t
        // " -> \"
        // Result wrapped in quotes
        expect(result).toBe('"\\\\\\n\\r\\t\\""');
      });

      it('Given string with Unicode characters, When called, Then preserve Unicode and wrap', () => {
        // Arrange
        const str = 'こんにちは世界';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"こんにちは世界"');
      });

      it('Given string with emoji, When called, Then preserve emoji and wrap', () => {
        // Arrange
        const str = '😀🎉';

        // Act
        const result = _escapeString(str);

        // Assert
        expect(result).toBe('"😀🎉"');
      });
    });
  });
});
