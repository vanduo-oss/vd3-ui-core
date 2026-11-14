/**
 * @file verify-a11y.mjs
 * Automated WCAG 2.1/2.2 Accessibility, Semantic Landmark, Keyboard Scroll,
 * Heading Hierarchy, and Contrast Compliance Auditor for vd3-ui-core.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distHtmlPath = path.join(rootDir, 'site', 'dist', 'index.html');
const tokensPath = path.join(rootDir, 'tokens', 'vd3.tokens.json');

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail = '') {
  if (condition) {
    passed++;
  } else {
    failed++;
    failures.push(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function hexToRgb(hex) {
  const clean = hex.replace(/^#/, '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function luminance([r, g, b]) {
  const linear = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function compositeRgba(fg, alpha, bg) {
  return [
    Math.round(fg[0] * alpha + bg[0] * (1 - alpha)),
    Math.round(fg[1] * alpha + bg[1] * (1 - alpha)),
    Math.round(fg[2] * alpha + bg[2] * (1 - alpha)),
  ];
}

function resolveToken(registry, refOrHex) {
  if (typeof refOrHex !== 'string') return refOrHex;
  if (!refOrHex.startsWith('{') || !refOrHex.endsWith('}')) return refOrHex;
  const parts = refOrHex.slice(1, -1).split('.');
  let cur = registry;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
    else return refOrHex;
  }
  const val = cur && typeof cur === 'object' && '$value' in cur ? cur.$value : cur;
  return typeof val === 'string' && val.startsWith('{') ? resolveToken(registry, val) : val;
}

// 1. Audit Pre-Rendered Documentation Site (site/dist/index.html)
check('Built SSG HTML exists at site/dist/index.html', fs.existsSync(distHtmlPath), 'Run "pnpm build" first');
if (fs.existsSync(distHtmlPath)) {
  const html = fs.readFileSync(distHtmlPath, 'utf8');

  for (const landmark of ['<header', '<nav', '<main', '<section', '<footer']) {
    check(`Landmark ${landmark}> present in SSG HTML`, html.includes(landmark));
  }
  check('Skip link to #main-content present', /href=["']#main-content["'][^>]*class=["'][^"']*vd-skip-link/.test(html) || /class=["'][^"']*vd-skip-link[^"']*["'][^>]*href=["']#main-content["']/.test(html));
  check('<meta name="color-scheme"> declared in head', /<meta\s+name=["']color-scheme["'][^>]+content=["'][^"']*light[^"']*dark/.test(html));
  check('<link rel="design-tokens"> declared in head', /<link\s+rel=["']design-tokens["']/.test(html));

  // Heading ladder audit
  const headings = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
    level: Number(m[1][1]),
    text: m[2].replace(/<[^>]+>/g, '').trim(),
  }));
  check('Exactly one <h1> in document', headings.filter((h) => h.level === 1).length === 1);
  check('First heading is <h1>', headings[0]?.level === 1);
  let skips = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      skips.push(`h${headings[i - 1].level}->h${headings[i].level} (${headings[i].text})`);
    }
  }
  check('Zero skipped heading levels', skips.length === 0, skips.join(', '));

  // Scrollable containers must expose tabindex="0"
  const preTags = [...html.matchAll(/<pre\b([^>]*)>/gi)];
  check('Code blocks present in SSG HTML', preTags.length > 0);
  for (const m of preTags) {
    check('All <pre> code blocks declare tabindex="0"', /tabindex=["']0["']/.test(m[1]), m[0]);
  }
  const tableContainers = [...html.matchAll(/<div\b([^>]*class=["'][^"']*vd-table-container[^"']*["'][^>]*)>/gi)];
  check('Scrollable .vd-table-container elements present', tableContainers.length > 0);
  for (const m of tableContainers) {
    check('All .vd-table-container wrappers declare tabindex="0"', /tabindex=["']0["']/.test(m[1]), m[0]);
  }

  // Table header scopes
  const thTags = [...html.matchAll(/<th\b([^>]*)>/gi)];
  check('Table <th> elements present', thTags.length > 0);
  for (const m of thTags) {
    check('Every <th> declares scope="col" or scope="row"', /scope=["'](?:col|row)["']/.test(m[1]), m[0]);
  }

  // Interactive controls accessible name audit
  const labelForIds = new Set([...html.matchAll(/<label\b[^>]*for=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]));
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const hasName = /aria-label(?:ledby)?=["'][^"']+["']/.test(m[1]) || m[2].replace(/<[^>]+>/g, '').trim().length > 0;
    check('All <button> elements have accessible names', hasName, m[0].slice(0, 80));
  }
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const hasName = /aria-label(?:ledby)?=["'][^"']+["']/.test(m[1]) || m[2].replace(/<[^>]+>/g, '').trim().length > 0;
    check('All <a> links have accessible names', hasName, m[0].slice(0, 80));
  }
  for (const m of html.matchAll(/<input\b([^>]*)>/gi)) {
    const idMatch = /id=["']([^"']+)["']/.exec(m[1]);
    const hasName = /aria-label(?:ledby)?=["'][^"']+["']/.test(m[1]) || (idMatch && labelForIds.has(idMatch[1]));
    check('All <input> controls have associated label or aria-label', Boolean(hasName), m[0]);
  }
  for (const m of html.matchAll(/<select\b([^>]*)>/gi)) {
    const idMatch = /id=["']([^"']+)["']/.exec(m[1]);
    const hasName = /aria-label(?:ledby)?=["'][^"']+["']/.test(m[1]) || (idMatch && labelForIds.has(idMatch[1]));
    check('All <select> controls have associated label or aria-label', Boolean(hasName), m[0]);
  }
}

// 2. Audit Token & Component Contrast Compliance (WCAG 2.1 AA/AAA)
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const lightCanvas = hexToRgb(resolveToken(tokens, tokens.color.role.canvas.$value));
const lightTextPri = hexToRgb(resolveToken(tokens, tokens.color.role['text-primary'].$value));
const lightTextSec = hexToRgb(resolveToken(tokens, tokens.color.role['text-secondary'].$value));
const darkCanvas = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role.canvas.$value));
const darkTextPri = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role['text-primary'].$value));
const darkTextSec = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role['text-secondary'].$value));

check('Light text-primary >= 7.0:1 (WCAG AAA)', contrastRatio(lightTextPri, lightCanvas) >= 7.0);
check('Light text-secondary >= 4.5:1 (WCAG AA)', contrastRatio(lightTextSec, lightCanvas) >= 4.5);
check('Dark text-primary >= 7.0:1 (WCAG AAA)', contrastRatio(darkTextPri, darkCanvas) >= 7.0);
check('Dark text-secondary >= 4.5:1 (WCAG AA)', contrastRatio(darkTextSec, darkCanvas) >= 4.5);

// Component CSS contrast checks
const badgeCss = fs.readFileSync(path.join(rootDir, 'components', 'badge.css'), 'utf8');
for (const [variant, tintHex] of [
  ['info', '0ab5b5'],
  ['success', '0ac265'],
  ['warning', 'fab005'],
  ['danger', 'fa5252'],
]) {
  const rule = badgeCss.match(new RegExp(`\\.vd-badge--${variant}[^{]*\\{([^}]+)\\}`));
  const colorMatch = rule?.[1].match(/color:\s*#([0-9a-fA-F]{6})/);
  const fg = colorMatch ? colorMatch[1] : null;
  const bg = compositeRgba(hexToRgb(tintHex), 0.13, [255, 255, 255]);
  const cr = fg ? contrastRatio(hexToRgb(fg), bg) : 0;
  check(`badge.css .vd-badge--${variant} contrast >= 4.5:1 (${cr.toFixed(2)}:1)`, cr >= 4.5);
}

const codeCss = fs.readFileSync(path.join(rootDir, 'components', 'code.css'), 'utf8');
const lightCodeBg = hexToRgb('f8f9fa');
for (const tok of ['keyword', 'string', 'number', 'property', 'selector', 'comment']) {
  const m = codeCss.match(new RegExp(`\\.token-${tok}\\s*\\{[^}]*#([0-9a-fA-F]{6})`));
  const cr = m ? contrastRatio(hexToRgb(m[1]), lightCodeBg) : 0;
  check(`code.css .token-${tok} contrast >= 4.5:1 on #f8f9fa (${cr.toFixed(2)}:1)`, cr >= 4.5);
}

const formCss = fs.readFileSync(path.join(rootDir, 'components', 'form.css'), 'utf8');
const darkSelectSvg = formCss.match(/\[data-theme=["']?dark["']?\]\s*\.vd-select\s*\{[^}]*%23([0-9a-fA-F]{6})/);
const darkChevronCr = darkSelectSvg ? contrastRatio(hexToRgb(darkSelectSvg[1]), hexToRgb('212529')) : 0;
check(`form.css dark select chevron non-text contrast >= 3.0:1 (${darkChevronCr.toFixed(2)}:1)`, darkChevronCr >= 3.0);

console.log('='.repeat(88));
console.log(` VD3 UI CORE — Automated Accessibility & Contrast Verification`);
console.log('='.repeat(88));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);

if (failed > 0) {
  for (const msg of failures) console.error(msg);
  process.exit(1);
}
console.log('SUCCESS: All automated WCAG accessibility, keyboard, landmark, and contrast checks passed.');
