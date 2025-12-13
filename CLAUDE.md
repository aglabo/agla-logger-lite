# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript monorepo for `@aglabo/agla-logger-lite` - standardized logger utility library with cross-runtime support (Node.js >=20, Deno, Bun).

- Package Manager: pnpm 10.25.0
- Language: TypeScript 5.9.3 (ES2022, ESM only)

### Current Packages

- **@aglabo/agla-logger-utils** (v0.1.0): General-purpose logging utility functions
  - Log formatters, message validators, timestamp utilities
  - Cross-runtime helpers for Node.js, Deno, and Bun
  - Location: `packages/@aglabo/agla-logger-utils/`

## MCP Tools - MANDATORY USAGE

**CRITICAL**: All code operations MUST use MCP tools (serena-mcp and lsmcp) before reading or editing files.

### Required MCP Workflow

#### Before ANY code operation:
1. **Get Project Overview** (once per session):
   ```typescript
   mcp__lsmcp__get_project_overview({ root })
   mcp__serena-mcp__list_memories()
   mcp__serena-mcp__read_memory("project_overview")
   mcp__serena-mcp__read_memory("code_style_and_conventions")
   ```

2. **Staged Approach** (for every file):
   ```
   STAGE 1: Overview
   → mcp__serena-mcp__get_symbols_overview({ relativePath: "path/to/file.ts" })

   STAGE 2: Symbol Search
   → mcp__lsmcp__search_symbols({ root, name: "symbolName" })

   STAGE 3: Detailed Analysis
   → mcp__serena-mcp__find_symbol({
       name_path: "ClassName/methodName",
       relative_path: "path/to/file.ts",
       include_body: true
     })
   ```

3. **Before Editing** (MANDATORY):
   ```typescript
   // Check references
   mcp__serena-mcp__find_referencing_symbols({
     name_path: "symbolName",
     relative_path: "path/to/file.ts"
   })

   // Check diagnostics
   mcp__lsmcp__lsp_get_diagnostics({
     root,
     relativePath: "path/to/file.ts"
   })
   ```

4. **After Editing** (MANDATORY):
   ```typescript
   // Verify no new errors
   mcp__lsmcp__lsp_get_diagnostics({
     root,
     relativePath: "path/to/file.ts",
     forceRefresh: true
   })
   ```

### Why MCP Tools Are Mandatory

- **Token Efficiency**: 90% reduction through staged detail retrieval
- **Code Safety**: Impact analysis prevents breaking changes
- **Pattern Learning**: Understand existing conventions before implementing
- **Type Safety**: Real-time LSP diagnostics catch errors early

### Prohibited Operations

❌ **NEVER** do these without MCP tools:
- Direct file reading (`Read` tool) without `get_symbols_overview` first
- Direct file editing (`Edit`/`Write` tool) without `find_referencing_symbols` check
- Code refactoring without `lsp_find_references`
- Adding new code without searching for existing patterns

## Architecture

### Three-Layer Configuration Inheritance

All configs (TypeScript, ESLint, Vitest) follow this pattern:

1. `base/configs/` - Shared base (tsconfig.base.json, vitest.config.base.ts, eslint.config.base.js)
2. `configs/` - Root-level (imports base, adds project-wide settings)
3. `packages/*/configs/` - Package-specific (extends base using `mergeConfig()` or spread operator)

When modifying configs, edit the appropriate layer and let inheritance propagate changes.

### Five-Layer Testing Architecture

Each layer has its own Vitest config with isolated cache/coverage:

| Layer       | Config                         | Test Location                   | Purpose                     |
| ----------- | ------------------------------ | ------------------------------- | --------------------------- |
| Unit        | `vitest.config.unit.ts`        | `src/**/__tests__/**/*.spec.ts` | Pure unit tests             |
| Functional  | `vitest.config.functional.ts`  | `src/**/__tests__/functional/`  | API-level tests             |
| Integration | `vitest.config.integration.ts` | `tests/integration/`            | Integration tests           |
| E2E         | `vitest.config.e2e.ts`         | `tests/e2e/`                    | End-to-end scenarios        |
| Runtime     | `vitest.config.runtime.ts`     | Cross-runtime tests             | Node/Deno/Bun compatibility |

Run specific layers: `pnpm run test:develop` (unit), `test:functional`, `test:ci` (integration), `test:e2e`, `test:runtime`

### Config Synchronization

`pnpm run sync:configs` synchronizes shared files (README, LICENSE, package.json scripts) from repo root to packages.

- Uses `INIT_CWD` to determine target package
- Powered by `scripts/sync-configs.sh` and `scripts/sync-package-scripts.ts`

## Development Workflow

### SDD (Spec-Driven Development) Process

Use `/sdd` commands for structured development:

```bash
# 1. Initialize module structure
/sdd init package/logger-utils

# 2. Define requirements (interactive)
/sdd req

# 3. Create design specifications
/sdd spec

# 4. Break down implementation tasks
/sdd tasks

# 5. BDD implementation with MCP tools
/sdd coding

# 6. Commit changes
/sdd commit
```

### BDD Implementation Workflow

When implementing with `/sdd coding`:

1. **MCP Pre-Analysis** (automatic):
   - Project overview and memories
   - Existing BDD patterns
   - Related code search

2. **Red-Green-Refactor Cycle**:
   ```
   RED:      Write failing test first
   GREEN:    Implement minimal code to pass
   REFACTOR: Improve code quality
   ```

3. **One Message = One Test** principle
4. **Sync Progress**: temp/todo.md ↔ TodoWrite ↔ tasks.md
5. **Quality Gates** (all must pass):
   - Type check
   - Lint
   - All test layers
   - Format
   - Build

## Key Commands

```bash
# Development
pnpm run check:types          # Type check all packages
pnpm run lint-all             # Lint all files
pnpm run test:all             # Run all test layers

# Package-specific (cd packages/@aglabo/agla-logger-utils)
pnpm run build                # Build with tsup
pnpm run test:develop         # Unit tests only
pnpm run test:functional      # Functional tests
pnpm run test:all             # All test layers

# Quality gates (must pass before commit)
pnpm run check:types && \
pnpm run lint && \
pnpm run test:all && \
pnpm run check:dprint && \
pnpm run build
```

## Code Conventions

### File Headers

All source files must include:

```typescript
// src: path/to/file.ts
// @(#) : Description
//
// Copyright (c) 2025 atsushifx <https://github.com/atsushifx>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
```

### ESLint Rules (Enforced)

- Prefer `type` over `interface`
- Use explicit `type` imports: `import type { Foo } from './foo'`
- Function expressions only: `const fn = () => {}` (not `function fn() {}`)

### Import Aliases

Use subpath imports:

```typescript
import type { Bar } from '#shared/types/bar.ts';
import { Foo } from '#src/foo.ts';
import { Baz } from '#tests/helpers.ts';
```

### BDD Test Structure

Follow Given/When/Then pattern with tags:

```typescript
describe('parseLogger', () => {
  describe('[正常] Valid input parsing', () => {
    it('Given primitive arguments, When parsing, Then should concatenate to message', () => {
      // Test implementation
    });
  });

  describe('[異常] Invalid input handling', () => {
    it('Given null argument, When parsing, Then should handle gracefully', () => {
      // Test implementation
    });
  });

  describe('[エッジケース] Boundary conditions', () => {
    it('Given empty arguments array, When parsing, Then should return empty message', () => {
      // Test implementation
    });
  });
});
```

### Commit Messages

Conventional Commits enforced by commitlint:

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore, build, ci, perf

Examples:
feat(logger-utils): add timestamp validation utilities
fix(parser): handle undefined arguments correctly
test(logger-utils): add edge case tests for parseLogger
```

## MCP Tools Quick Reference

### serena-mcp (Symbolic Operations)

```typescript
// Get file overview
mcp__serena-mcp__get_symbols_overview({ relative_path: "src/parseLogger.ts" })

// Search for patterns
mcp__serena-mcp__search_for_pattern({
  substring_pattern: "describe.*Given",
  relative_path: "__tests__",
  restrict_search_to_code_files: true
})

// Find symbol with body
mcp__serena-mcp__find_symbol({
  name_path: "parseLogger",
  relative_path: "src/parseLogger.ts",
  include_body: true
})

// Find references before editing
mcp__serena-mcp__find_referencing_symbols({
  name_path: "parseLogger",
  relative_path: "src/parseLogger.ts"
})
```

### lsmcp (LSP Operations)

```typescript
// Search symbols
mcp__lsmcp__search_symbols({ root, name: "parseLogger" })

// Get symbol details
mcp__lsmcp__get_symbol_details({
  root,
  relativePath: "src/parseLogger.ts",
  line: 73,
  symbol: "parseLogger"
})

// Get diagnostics
mcp__lsmcp__lsp_get_diagnostics({
  root,
  relativePath: "src/parseLogger.ts",
  forceRefresh: true
})

// Find references
mcp__lsmcp__lsp_find_references({
  root,
  relativePath: "src/parseLogger.ts",
  line: 73,
  symbolName: "parseLogger"
})
```

## Quality Gates (Pre-Commit Checklist)

All five gates must pass before committing:

1. ✅ **Type Check**: `pnpm run check:types` (no errors)
2. ✅ **Lint**: `pnpm run lint` (no errors/warnings)
3. ✅ **Tests**: `pnpm run test:all` (all layers pass)
4. ✅ **Format**: `pnpm run check:dprint` (properly formatted)
5. ✅ **Build**: `pnpm run build` (successful build)

## Adding a New Package

1. Create directory under `packages/@aglabo/`
2. Add tsconfig.json path to `configs/eslint.projects.js`
3. Create `configs/` with package-specific configs extending base
4. Run `pnpm run sync:configs` to sync shared files
5. Initialize with SDD: `/sdd init package/<package-name>`

## Resources

- **MCP Memories**: Available via `mcp__serena-mcp__list_memories()`
  - project_overview
  - project_structure
  - code_style_and_conventions
  - tech_stack
  - suggested_commands
  - task_completion_checklist
- **LSMCP Config**: `mcp__lsmcp__read_memory({ root, memoryName: "lsmcp_configuration.md" })`
