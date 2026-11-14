#!/usr/bin/env node
/**
 * @file runner.mjs
 * Unified E2E Test Runner for VD3 UI CORE.
 * Zero external dependencies. Uses Node.js native test runner and assertion libraries.
 */

import { readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { run } from 'node:test';
import { spec } from 'node:test/reporters';

const __filename = fileURLToPath(import.meta.url);
const testsDir = dirname(__filename);

function discoverTestFiles(dir) {
  const files = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'helpers') {
      files.push(...discoverTestFiles(fullPath));
    } else if (stat.isFile() && entry.endsWith('.test.mjs')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log('====================================================');
  console.log(' VD3 UI CORE: Unified E2E Test Suite');
  console.log(' Zero-Framework Native Node.js Test Harness');
  console.log('====================================================\n');

  const allTestFiles = discoverTestFiles(testsDir).sort();
  const filterArg = process.argv[2];
  const testFiles = filterArg
    ? allTestFiles.filter(f => f.includes(filterArg))
    : allTestFiles;

  if (testFiles.length === 0) {
    console.error(`No test files matched filter: "${filterArg}"`);
    process.exit(1);
  }

  console.log(`Discovered ${testFiles.length} test suite files across Tiers 1-4${filterArg ? ` (filter: "${filterArg}")` : ''}:`);
  for (const f of testFiles) {
    console.log(`  • tests/${relative(testsDir, f)}`);
  }
  console.log('\nExecuting test suites...\n');

  const testStream = run({
    files: testFiles,
    concurrency: 1
  });

  let hasFailures = false;

  testStream.on('test:fail', () => {
    hasFailures = true;
  });

  testStream.compose(new spec()).pipe(process.stdout);

  testStream.on('end', () => {
    if (hasFailures) {
      console.error('\n✖ E2E TEST SUITE FAILED. See diagnostic trace above.\n');
      process.exit(1);
    } else {
      console.log('\n✔ ALL E2E TEST SUITES PASSED CLEANLY (exit code 0).\n');
      process.exit(0);
    }
  });
}

main().catch(err => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
