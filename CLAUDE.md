# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TypeScript monorepo for `@aglabo/agla-logger-lite` - standardized error handling library with cross-runtime support (Node.js >=20, Deno, Bun).

- Package Manager: pnpm 10.25.0
- Language: TypeScript 5.9.3 (ES2022, ESM only)

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

## Key Commands

```bash
# Development
pnpm run check:types          # Type check all packages
pnpm run lint-all             # Lint all files
pnpm run test:all             # Run all test layers

# Package-specific (cd packages/@aglabo/agla-logger-lite)
pnpm run build                # Build with tsup
pnpm run test:develop         # Unit tests only
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
import { Bar } from '#shared/types/bar.ts';
import { Foo } from '#src/foo.ts';
import { Baz } from '#tests/helpers.ts';
```

### Commit Messages

Conventional Commits enforced by commitlint:

```
type(scope): description

Examples:
feat(logger): add error severity levels
fix(core): handle undefined error messages
```

## Adding a New Package

1. Create directory under `packages/@aglabo/`
2. Add tsconfig.json path to `configs/eslint.projects.js`
3. Create `configs/` with package-specific configs extending base
4. Run `pnpm run sync:configs` to sync shared files
