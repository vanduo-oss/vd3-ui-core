/**
 * @file verify-typecheck.mjs
 * Verifies strict tsconfig configuration, Vue SFC + TypeScript compilation via
 * installed vue/compiler-sfc & vite's bundled esbuild, static import resolution
 * (including @spec/* aliases and ?raw imports), and Node syntax checks for .mjs scripts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const siteDir = path.join(rootDir, 'site');
const sitePkgJson = path.join(siteDir, 'package.json');

const req = createRequire(sitePkgJson);
const compilerSfcPath = req.resolve('vue/compiler-sfc');
const vitePkgDir = path.dirname(req.resolve('vite/package.json'));
const esbuildPath = req.resolve('esbuild', { paths: [vitePkgDir, path.join(vitePkgDir, '../..')] });

const { parse: parseSfc, compileScript, compileTemplate } = await import(compilerSfcPath);
const esbuild = await import(esbuildPath);

let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`FAIL: ${label}${detail ? ` — ${detail}` : ''}`);
  }
}

function collectFiles(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue;
      out.push(...collectFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

// 1. Validate tsconfig.json & site/tsconfig.json
for (const relCfg of ['tsconfig.json', 'site/tsconfig.json']) {
  const cfgPath = path.join(rootDir, relCfg);
  const exists = fs.existsSync(cfgPath);
  check(`${relCfg} exists`, exists);
  if (exists) {
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    check(`${relCfg} enables strict: true`, cfg?.compilerOptions?.strict === true);
    check(`${relCfg} sets noEmit: true`, cfg?.compilerOptions?.noEmit === true);
    check(`${relCfg} configures @spec/* path alias`, Array.isArray(cfg?.compilerOptions?.paths?.['@spec/*']));
  }
}

// 2. Verify static imports across site/src/**/*.{ts,vue}
function verifyStaticImports(sourceText, filePath) {
  const importRegex = /(?:import\s+(?:[^'"]+?\s+from\s+)?|export\s+[^'"]+?\s+from\s+)['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(sourceText)) !== null) {
    const rawSpec = match[1];
    const cleanSpec = rawSpec.split('?')[0];
    let resolved = null;
    if (cleanSpec.startsWith('@spec/')) {
      resolved = path.join(rootDir, cleanSpec.slice('@spec/'.length));
      check(
        `Import "${rawSpec}" in ${path.relative(rootDir, filePath)}`,
        fs.existsSync(resolved),
        `Target missing on disk: ${resolved}`,
      );
    } else if (cleanSpec.startsWith('.')) {
      const base = path.resolve(path.dirname(filePath), cleanSpec);
      const candidates = [base, `${base}.ts`, `${base}.mts`, `${base}.js`, `${base}.vue`, path.join(base, 'index.ts')];
      resolved = candidates.find((c) => fs.existsSync(c));
      check(
        `Relative import "${rawSpec}" in ${path.relative(rootDir, filePath)}`,
        Boolean(resolved),
        `No matching file found from ${base}`,
      );
    } else {
      let pkgResolved = false;
      try {
        req.resolve(cleanSpec);
        pkgResolved = true;
      } catch {
        // Handle subpath CSS exports such as '@vanduo-oss/vd3/css' via package.json exports map
        const parts = cleanSpec.startsWith('@') ? cleanSpec.split('/').slice(0, 2) : [cleanSpec.split('/')[0]];
        const pkgName = parts.join('/');
        try {
          const pkgJsonPath = req.resolve(`${pkgName}/package.json`);
          const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
          const sub = cleanSpec.length > pkgName.length ? `.${cleanSpec.slice(pkgName.length)}` : '.';
          pkgResolved = Boolean(pkg.exports && (sub in pkg.exports));
        } catch {
          pkgResolved = false;
        }
      }
      check(
        `Package import "${rawSpec}" in ${path.relative(rootDir, filePath)}`,
        pkgResolved,
        'Package export could not be resolved from site/',
      );
    }
  }
}

// 3. Compile every .ts file under site/src/
const tsFiles = collectFiles(path.join(siteDir, 'src'), ['.ts']);
for (const tsFile of tsFiles) {
  const code = fs.readFileSync(tsFile, 'utf8');
  verifyStaticImports(code, tsFile);
  try {
    const res = await esbuild.transform(code, { loader: 'ts', sourcefile: tsFile, format: 'esm' });
    check(`TS transform ${path.relative(rootDir, tsFile)}`, res.warnings.length === 0, res.warnings.map((w) => w.text).join('; '));
  } catch (err) {
    check(`TS transform ${path.relative(rootDir, tsFile)}`, false, err.message);
  }
}

// 4. Parse & compile every .vue SFC under site/src/
const vueFiles = collectFiles(path.join(siteDir, 'src'), ['.vue']);
for (const vueFile of vueFiles) {
  const rel = path.relative(rootDir, vueFile);
  const src = fs.readFileSync(vueFile, 'utf8');
  const parsed = parseSfc(src, { filename: vueFile });
  check(`Vue SFC parse ${rel}`, parsed.errors.length === 0, parsed.errors.map((e) => e.message).join('; '));

  if (parsed.descriptor.script || parsed.descriptor.scriptSetup) {
    try {
      const compiled = compileScript(parsed.descriptor, { id: rel });
      verifyStaticImports(compiled.content, vueFile);
      const lang = (parsed.descriptor.scriptSetup?.lang || parsed.descriptor.script?.lang || 'js').toLowerCase();
      const loader = lang === 'ts' ? 'ts' : 'js';
      const res = await esbuild.transform(compiled.content, { loader, sourcefile: `${vueFile}.${loader}`, format: 'esm' });
      check(`Vue <script lang="${lang}"> transform ${rel}`, res.warnings.length === 0, res.warnings.map((w) => w.text).join('; '));
    } catch (err) {
      check(`Vue <script> compile ${rel}`, false, err.message);
    }
  }

  if (parsed.descriptor.template) {
    try {
      const tmplRes = compileTemplate({
        source: parsed.descriptor.template.content,
        filename: vueFile,
        id: rel,
      });
      check(
        `Vue <template> compile ${rel}`,
        tmplRes.errors.length === 0,
        tmplRes.errors.map((e) => (typeof e === 'string' ? e : e.message)).join('; '),
      );
    } catch (err) {
      check(`Vue <template> compile ${rel}`, false, err.message);
    }
  }
}

// 5. Syntax-check all .mjs scripts under scripts/ and tests/
const mjsFiles = [
  ...collectFiles(path.join(rootDir, 'scripts'), ['.mjs']),
  ...collectFiles(path.join(rootDir, 'tests'), ['.mjs']),
];
for (const mjsFile of mjsFiles) {
  const rel = path.relative(rootDir, mjsFile);
  try {
    execFileSync(process.execPath, ['--check', mjsFile], { stdio: 'pipe' });
    check(`Node syntax check ${rel}`, true);
  } catch (err) {
    check(`Node syntax check ${rel}`, false, err.stderr?.toString() || err.message);
  }
}

console.log('='.repeat(88));
console.log(` VD3 UI CORE — TypeScript & SFC Compilation Check`);
console.log('='.repeat(88));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);

if (failed > 0) {
  for (const msg of failures) console.error(msg);
  process.exit(1);
}
console.log('SUCCESS: All TypeScript, Vue SFC, import resolution, and syntax checks passed.');
