#!/usr/bin/env tsx
// src: scripts/sync-config.ts
//
// @(#) : Sync base scripts into target package.json
//
// Notes:
// - Works from both:
//   - repo root: pnpm -w run sync:configs <target_dir> [package|all]
//   - package root: pnpm run sync:configs [package|all]
// - If target_dir is omitted, uses `npm_package_json` to locate the package root.

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

type ConfigType = 'package' | 'all';

interface Options {
  readonly targetDir?: string;
  readonly configType: ConfigType;
  readonly isDryRun: boolean;
  readonly allowRepoRootTarget: boolean;
  readonly mergeScripts: boolean;
  readonly baseScriptsJsonPath: string;
}

const KNOWN_CONFIG_TYPES: ReadonlySet<string> = new Set(['package', 'all']);

function usageAndExit(exitCode: number): never {
  const lines = [
    'Usage:',
    '  tsx scripts/sync-config.ts [target_dir] [package|all] [options]',
    '  tsx scripts/sync-config.ts [package|all] [options]        # when run via pnpm script',
    '',
    'options:',
    '  --scripts-json <path>   Base scripts json (default: base/configs/base-scripts.json)',
    '  --merge-scripts         Merge base scripts into existing scripts',
    '  --target <dir>          Target directory (overrides positional)',
    '  --allow-root-target     Allow writing to repo root (DANGEROUS)',
    '  --dry-run               Print actions without writing files',
    '  -h, --help              Show this help',
  ];

  // eslint-disable-next-line no-console
  console.error(lines.join('\n'));
  process.exit(exitCode);
}

function getRepoRoot(): string {
  const thisFilePath = fileURLToPath(import.meta.url);
  return path.resolve(path.dirname(thisFilePath), '..');
}

function inferTargetDirFromEnv(): string {
  const packageJsonPath = process.env.npm_package_json;
  if (!packageJsonPath) {
    throw new Error('Missing env var: npm_package_json (hint: run via pnpm script or pass target_dir)');
  }
  return path.dirname(packageJsonPath);
}

function isConfigType(value: string | undefined): value is ConfigType {
  return !!value && KNOWN_CONFIG_TYPES.has(value);
}

function parseArgs(argv: string[]): Options {
  const positionals: string[] = [];

  let isDryRun = false;
  let allowRepoRootTarget = false;
  let mergeScripts = false;
  let baseScriptsJsonPath = 'base/configs/base-scripts.json';
  let targetDir: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    // pnpm forwards extra args as: "--" "<arg>"
    if (arg === '--') {
      continue;
    }

    if (arg === '--dry-run') {
      isDryRun = true;
      continue;
    }

    if (arg === '--allow-root-target') {
      allowRepoRootTarget = true;
      continue;
    }

    if (arg === '--merge-scripts') {
      mergeScripts = true;
      continue;
    }

    if (arg === '--scripts-json') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --scripts-json');
      }
      baseScriptsJsonPath = value;
      i++;
      continue;
    }

    if (arg === '--target') {
      const value = argv[i + 1];
      if (!value) {
        throw new Error('Missing value for --target');
      }
      targetDir = value;
      i++;
      continue;
    }

    if (arg === '--help' || arg === '-h') {
      usageAndExit(0);
    }

    if (arg.startsWith('-')) {
      throw new Error(`Unknown option: ${arg}`);
    }

    positionals.push(arg);
  }

  // positional parsing
  let configType: ConfigType = 'all';
  if (positionals.length === 1 && isConfigType(positionals[0])) {
    configType = positionals[0];
  } else if (positionals.length >= 2) {
    targetDir = targetDir ?? positionals[0];
    if (isConfigType(positionals[1])) {
      configType = positionals[1];
    }
  } else if (positionals.length === 1) {
    targetDir = targetDir ?? positionals[0];
  }

  return {
    targetDir,
    configType,
    isDryRun,
    allowRepoRootTarget,
    mergeScripts,
    baseScriptsJsonPath,
  };
}

function resolveFromRepoRoot(repoRoot: string, maybeRelative: string): string {
  return path.isAbsolute(maybeRelative) ? maybeRelative : path.resolve(repoRoot, maybeRelative);
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const text = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(text) as T;
}

async function writeJsonFile(filePath: string, value: unknown, isDryRun: boolean): Promise<void> {
  // eslint-disable-next-line no-console
  console.log(`${isDryRun ? '[DRY-RUN]' : '[WRITE]'} ${filePath}`);

  if (isDryRun) {
    return;
  }

  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + '\n');
}

function validateTargetDir(targetDirAbs: string, repoRootAbs: string, allowRepoRootTarget: boolean): void {
  if (!allowRepoRootTarget && targetDirAbs === repoRootAbs) {
    throw new Error(`Refusing to write to repo root: ${targetDirAbs} (use --allow-root-target to override)`);
  }
}

function normalizeScriptsObject(input: unknown): Record<string, string> {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid scripts json: expected an object');
  }

  const record = input as Record<string, unknown>;
  const scripts = (record.scripts ?? record) as unknown;

  if (!scripts || typeof scripts !== 'object') {
    throw new Error('Invalid scripts json: expected { scripts: { ... } } or { ... }');
  }

  const scriptsRecord = scripts as Record<string, unknown>;
  for (const [key, value] of Object.entries(scriptsRecord)) {
    if (typeof value !== 'string') {
      throw new Error(`Invalid scripts json: scripts.${key} must be a string`);
    }
  }

  return scriptsRecord as Record<string, string>;
}

async function syncPackageScripts(
  repoRoot: string,
  targetDirAbs: string,
  baseScriptsJsonPath: string,
  mergeScripts: boolean,
  isDryRun: boolean,
): Promise<void> {
  const targetPkgPath = path.resolve(targetDirAbs, 'package.json');
  const baseScriptsPath = resolveFromRepoRoot(repoRoot, baseScriptsJsonPath);

  const pkgJson = await readJsonFile<Record<string, unknown>>(targetPkgPath);
  const baseJson = await readJsonFile<unknown>(baseScriptsPath);

  const baseScripts = normalizeScriptsObject(baseJson);
  const originalScripts = normalizeScriptsObject(pkgJson.scripts ?? {});
  const nextScripts = mergeScripts ? { ...originalScripts, ...baseScripts } : baseScripts;

  // eslint-disable-next-line no-console
  console.log(`[package.json:scripts] ${targetPkgPath}`);

  if (isDryRun) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(nextScripts, null, 2));
    return;
  }

  const nextPkgJson = {
    ...pkgJson,
    scripts: nextScripts,
  };

  await writeJsonFile(targetPkgPath, nextPkgJson, false);
}

async function main(): Promise<void> {
  const repoRoot = getRepoRoot();

  const options = parseArgs(process.argv.slice(2));
  const targetDir = options.targetDir ?? inferTargetDirFromEnv();

  const targetDirAbs = path.resolve(targetDir);
  const repoRootAbs = path.resolve(repoRoot);

  validateTargetDir(targetDirAbs, repoRootAbs, options.allowRepoRootTarget);

  const stat = await fs.stat(targetDirAbs).catch(() => null);
  if (!stat?.isDirectory()) {
    throw new Error(`Target directory does not exist: ${targetDirAbs}`);
  }

  // eslint-disable-next-line no-console
  console.log(`Target: ${targetDirAbs}`);
  if (options.isDryRun) {
    // eslint-disable-next-line no-console
    console.log('Dry run mode is active. No files will be written.');
  }

  // all -> package only (historical compatibility)
  if (options.configType !== 'all' && options.configType !== 'package') {
    throw new Error(`Unsupported config_type: ${options.configType}`);
  }

  await syncPackageScripts(
    repoRootAbs,
    targetDirAbs,
    options.baseScriptsJsonPath,
    options.mergeScripts,
    options.isDryRun,
  );

  // eslint-disable-next-line no-console
  console.log('Sync complete.');
}

try {
  await main();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error:', (err as Error).message);
  usageAndExit(1);
}
