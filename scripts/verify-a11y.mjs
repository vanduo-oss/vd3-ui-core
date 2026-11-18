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
const tokensCssPath = path.join(rootDir, 'tokens', 'tokens.css');
const tokensCssRaw = fs.readFileSync(tokensCssPath, 'utf8');

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

function splitTopLevel(str, delimiter) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (quote) {
      if (ch === quote && str[i - 1] !== '\\') quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === '(') {
      depth++;
    } else if (ch === ')') {
      depth = Math.max(0, depth - 1);
    } else if (ch === delimiter && depth === 0) {
      parts.push(str.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(str.slice(start));
  return parts;
}

function parseDeclarations(body) {
  const decls = {};
  for (const stmt of splitTopLevel(body, ';')) {
    const idx = stmt.indexOf(':');
    if (idx === -1) continue;
    const prop = stmt.slice(0, idx).trim();
    const val = stmt.slice(idx + 1).trim();
    if (prop && val) decls[prop] = val;
  }
  return decls;
}

function parseCssRules(cssText) {
  const clean = stripComments(cssText);
  const rules = [];
  function walk(input, atContext = []) {
    let i = 0;
    while (i < input.length) {
      const openIdx = input.indexOf('{', i);
      if (openIdx === -1) break;
      const prelude = input.slice(i, openIdx).trim();
      let depth = 1;
      let j = openIdx + 1;
      let quote = null;
      while (j < input.length && depth > 0) {
        const ch = input[j];
        if (quote) {
          if (ch === quote && input[j - 1] !== '\\') quote = null;
        } else if (ch === '"' || ch === "'") {
          quote = ch;
        } else if (ch === '{') {
          depth++;
        } else if (ch === '}') {
          depth--;
        }
        j++;
      }
      const inner = input.slice(openIdx + 1, j - 1);
      if (prelude.startsWith('@')) {
        walk(inner, [...atContext, prelude]);
      } else {
        const decls = parseDeclarations(inner);
        const selectors = splitTopLevel(prelude, ',').map((s) => s.trim().replace(/\s+/g, ' '));
        rules.push({ selectors, decls, atContext });
      }
      i = j;
    }
  }
  walk(clean);
  return rules;
}

function getMergedDecls(rules, targetSelectors) {
  const merged = {};
  for (const rule of rules) {
    if (rule.selectors.some((s) => targetSelectors.includes(s))) {
      Object.assign(merged, rule.decls);
    }
  }
  return merged;
}

const tokenRules = parseCssRules(tokensCssRaw);
const lightVars = new Map();
const darkOverrides = new Map();
for (const rule of tokenRules) {
  if (rule.atContext.some((a) => a.startsWith('@media') || a.startsWith('@supports'))) continue;
  if (rule.selectors.includes(':root')) {
    for (const [k, v] of Object.entries(rule.decls)) {
      if (k.startsWith('--')) lightVars.set(k, v);
    }
  }
  if (rule.selectors.includes('[data-theme="dark"]')) {
    for (const [k, v] of Object.entries(rule.decls)) {
      if (k.startsWith('--')) darkOverrides.set(k, v);
    }
  }
}
const darkVars = new Map([...lightVars, ...darkOverrides]);

function expandVarsInString(str, vars, seen = new Set()) {
  let out = '';
  let i = 0;
  while (i < str.length) {
    if (str.startsWith('var(', i)) {
      let depth = 1;
      let j = i + 4;
      while (j < str.length && depth > 0) {
        if (str[j] === '(') depth++;
        else if (str[j] === ')') depth--;
        j++;
      }
      const inner = str.slice(i + 4, j - 1);
      const args = splitTopLevel(inner, ',');
      const name = args[0].trim();
      const fallback = args.length > 1 ? args.slice(1).join(',').trim() : null;
      if (!seen.has(name) && vars.has(name)) {
        const nextSeen = new Set(seen);
        nextSeen.add(name);
        out += expandVarsInString(vars.get(name), vars, nextSeen);
      } else if (fallback !== null) {
        out += expandVarsInString(fallback, vars, seen);
      } else {
        out += str.slice(i, j);
      }
      i = j;
    } else {
      out += str[i];
      i++;
    }
  }
  return out;
}

function parseColorMixPart(part) {
  const trimmed = part.trim();
  const pctMatch = trimmed.match(/^(.*)\s+(\d+(?:\.\d+)?)%$/);
  if (pctMatch) {
    return { colorExpr: pctMatch[1].trim(), pct: parseFloat(pctMatch[2]) };
  }
  return { colorExpr: trimmed, pct: null };
}

function resolveCssColor(expr, vars, seen = new Set()) {
  if (!expr) return null;
  const trimmed = expr.trim();
  if (trimmed === 'transparent') return [0, 0, 0, 0];

  if (/^#[0-9a-fA-F]{3}$/.test(trimmed) || /^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    const [r, g, b] = hexToRgb(trimmed);
    return [r, g, b, 1];
  }
  if (/^#[0-9a-fA-F]{8}$/.test(trimmed)) {
    const clean = trimmed.slice(1);
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
      parseInt(clean.slice(6, 8), 16) / 255,
    ];
  }

  if (trimmed.startsWith('var(') && trimmed.endsWith(')')) {
    const expanded = expandVarsInString(trimmed, vars, seen);
    if (expanded !== trimmed) return resolveCssColor(expanded, vars, seen);
  }

  const rgbaMatch = trimmed.match(/^rgba?\(([\s\S]+)\)$/i);
  if (rgbaMatch) {
    const innerExpanded = expandVarsInString(rgbaMatch[1], vars, seen);
    const parts = splitTopLevel(innerExpanded, ',').map((s) => s.trim());
    if (parts.length >= 3) {
      return [
        parseFloat(parts[0]),
        parseFloat(parts[1]),
        parseFloat(parts[2]),
        parts.length >= 4 ? parseFloat(parts[3]) : 1,
      ];
    }
  }

  const mixMatch = trimmed.match(/^color-mix\(([\s\S]+)\)$/i);
  if (mixMatch) {
    const args = splitTopLevel(mixMatch[1], ',');
    if (args.length === 3 && /in\s+srgb/i.test(args[0])) {
      const p1Raw = parseColorMixPart(args[1]);
      const p2Raw = parseColorMixPart(args[2]);
      let p1 = p1Raw.pct;
      let p2 = p2Raw.pct;
      if (p1 === null && p2 === null) {
        p1 = 50;
        p2 = 50;
      } else if (p1 === null) {
        p1 = 100 - p2;
      } else if (p2 === null) {
        p2 = 100 - p1;
      }
      const sum = p1 + p2;
      if (sum <= 0) return null;
      const w1 = p1 / sum;
      const w2 = p2 / sum;
      const alphaMultiplier = sum < 100 ? sum / 100 : 1;
      const c1 = resolveCssColor(p1Raw.colorExpr, vars, seen);
      const c2 = resolveCssColor(p2Raw.colorExpr, vars, seen);
      if (!c1 || !c2) return null;
      const aInterp = c1[3] * w1 + c2[3] * w2;
      if (aInterp === 0) return [0, 0, 0, 0];
      const r = (c1[0] * c1[3] * w1 + c2[0] * c2[3] * w2) / aInterp;
      const g = (c1[1] * c1[3] * w1 + c2[1] * c2[3] * w2) / aInterp;
      const b = (c1[2] * c1[3] * w1 + c2[2] * c2[3] * w2) / aInterp;
      return [r, g, b, aInterp * alphaMultiplier];
    }
  }

  return null;
}

function flattenOver(rgba, bgRgb) {
  if (!rgba) return null;
  const a = rgba[3];
  return [
    Math.round(rgba[0] * a + bgRgb[0] * (1 - a)),
    Math.round(rgba[1] * a + bgRgb[1] * (1 - a)),
    Math.round(rgba[2] * a + bgRgb[2] * (1 - a)),
  ];
}

const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
const lightCanvas = hexToRgb(resolveToken(tokens, tokens.color.role.canvas.$value));
const lightLayer = hexToRgb(resolveToken(tokens, tokens.color.role.layer.$value));
const lightTextPri = hexToRgb(resolveToken(tokens, tokens.color.role['text-primary'].$value));
const lightTextSec = hexToRgb(resolveToken(tokens, tokens.color.role['text-secondary'].$value));
const darkCanvas = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role.canvas.$value));
const darkLayer = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role.layer.$value));
const darkTextPri = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role['text-primary'].$value));
const darkTextSec = hexToRgb(resolveToken(tokens, tokens.theme.dark.color.role['text-secondary'].$value));

check('Light text-primary >= 7.0:1 (WCAG AAA)', contrastRatio(lightTextPri, lightCanvas) >= 7.0);
check('Light text-secondary >= 4.5:1 (WCAG AA)', contrastRatio(lightTextSec, lightCanvas) >= 4.5);
check('Dark text-primary >= 7.0:1 (WCAG AAA)', contrastRatio(darkTextPri, darkCanvas) >= 7.0);
check('Dark text-secondary >= 4.5:1 (WCAG AA)', contrastRatio(darkTextSec, darkCanvas) >= 4.5);

// Component CSS contrast checks (resolving var() + color-mix() in Light & Dark)
const badgeCss = fs.readFileSync(path.join(rootDir, 'components', 'badge.css'), 'utf8');
const badgeRules = parseCssRules(badgeCss);
for (const variant of ['info', 'success', 'warning', 'danger', 'critical']) {
  const lightDecls = getMergedDecls(badgeRules, [`.vd-badge--${variant}`]);
  const darkDecls = {
    ...lightDecls,
    ...getMergedDecls(badgeRules, [`[data-theme="dark"] .vd-badge--${variant}`]),
  };

  for (const [themeLabel, decls, vars, surfaces] of [
    ['Light', lightDecls, lightVars, [['canvas', lightCanvas], ['layer', lightLayer]]],
    ['Dark', darkDecls, darkVars, [['canvas', darkCanvas], ['layer', darkLayer]]],
  ]) {
    const bgRaw = resolveCssColor(decls['background-color'], vars);
    const fgRaw = resolveCssColor(decls['color'], vars);
    for (const [surfName, surfRgb] of surfaces) {
      const bg = flattenOver(bgRaw, surfRgb);
      const fg = bg && fgRaw ? flattenOver(fgRaw, bg) : null;
      const cr = fg && bg ? contrastRatio(fg, bg) : 0;
      check(
        `badge.css ${themeLabel} .vd-badge--${variant} on ${surfName} contrast >= 4.5:1 (${cr.toFixed(2)}:1)`,
        cr >= 4.5
      );
    }
  }

  const lightSolidDecls = getMergedDecls(badgeRules, [`.vd-badge--solid.vd-badge--${variant}`]);
  const darkSolidSelectors = [`[data-theme="dark"] .vd-badge--solid.vd-badge--${variant}`];
  if (variant === 'critical') darkSolidSelectors.push('[data-theme="dark"] .vd-badge--solid.vd-badge--danger');
  if (variant === 'danger') darkSolidSelectors.push('[data-theme="dark"] .vd-badge--solid.vd-badge--critical');
  const darkSolidDecls = {
    ...lightSolidDecls,
    ...getMergedDecls(badgeRules, darkSolidSelectors),
  };
  for (const [themeLabel, decls, vars, surface] of [
    ['Light', lightSolidDecls, lightVars, lightCanvas],
    ['Dark', darkSolidDecls, darkVars, darkCanvas],
  ]) {
    const bg = flattenOver(resolveCssColor(decls['background-color'], vars), surface);
    const fg = bg ? flattenOver(resolveCssColor(decls['color'], vars), bg) : null;
    const cr = fg && bg ? contrastRatio(fg, bg) : 0;
    check(
      `badge.css ${themeLabel} .vd-badge--solid.vd-badge--${variant} contrast >= 4.5:1 (${cr.toFixed(2)}:1)`,
      cr >= 4.5
    );
  }
}

const codeCss = fs.readFileSync(path.join(rootDir, 'components', 'code.css'), 'utf8');
const codeRules = parseCssRules(codeCss);
const lightPreDecls = getMergedDecls(codeRules, ['pre.vd-code']);
const darkPreDecls = {
  ...lightPreDecls,
  ...getMergedDecls(codeRules, ['[data-theme="dark"] pre.vd-code']),
};
const lightCodeBg = flattenOver(resolveCssColor(lightPreDecls['background-color'], lightVars), lightCanvas);
const lightCodeFg = lightCodeBg ? flattenOver(resolveCssColor(lightPreDecls['color'], lightVars), lightCodeBg) : null;
const darkCodeBg = flattenOver(resolveCssColor(darkPreDecls['background-color'], darkVars), darkCanvas);
const darkCodeFg = darkCodeBg ? flattenOver(resolveCssColor(darkPreDecls['color'], darkVars), darkCodeBg) : null;

const lightPreCr = lightCodeFg && lightCodeBg ? contrastRatio(lightCodeFg, lightCodeBg) : 0;
const darkPreCr = darkCodeFg && darkCodeBg ? contrastRatio(darkCodeFg, darkCodeBg) : 0;
check(`code.css Light pre.vd-code base contrast >= 7.0:1 (${lightPreCr.toFixed(2)}:1)`, lightPreCr >= 7.0);
check(`code.css Dark pre.vd-code base contrast >= 7.0:1 (${darkPreCr.toFixed(2)}:1)`, darkPreCr >= 7.0);

for (const tok of ['keyword', 'string', 'number', 'property', 'selector', 'comment']) {
  const lightTokDecls = getMergedDecls(codeRules, [`.token-${tok}`]);
  const darkTokDecls = {
    ...lightTokDecls,
    ...getMergedDecls(codeRules, [`[data-theme="dark"] .token-${tok}`]),
  };
  const lightTokFg = lightCodeBg ? flattenOver(resolveCssColor(lightTokDecls['color'], lightVars), lightCodeBg) : null;
  const darkTokFg = darkCodeBg ? flattenOver(resolveCssColor(darkTokDecls['color'], darkVars), darkCodeBg) : null;
  const lightCr = lightTokFg && lightCodeBg ? contrastRatio(lightTokFg, lightCodeBg) : 0;
  const darkCr = darkTokFg && darkCodeBg ? contrastRatio(darkTokFg, darkCodeBg) : 0;
  check(`code.css Light .token-${tok} contrast >= 4.5:1 (${lightCr.toFixed(2)}:1)`, lightCr >= 4.5);
  check(`code.css Dark .token-${tok} contrast >= 4.5:1 (${darkCr.toFixed(2)}:1)`, darkCr >= 4.5);
}

const formCss = fs.readFileSync(path.join(rootDir, 'components', 'form.css'), 'utf8');
const formRules = parseCssRules(formCss);
const lightErrorDecls = getMergedDecls(formRules, ['.vd-error-text']);
const darkErrorDecls = {
  ...lightErrorDecls,
  ...getMergedDecls(formRules, ['[data-theme="dark"] .vd-error-text']),
};
const lightErrFg = flattenOver(resolveCssColor(lightErrorDecls['color'], lightVars), lightCanvas);
const darkErrFg = flattenOver(resolveCssColor(darkErrorDecls['color'], darkVars), darkCanvas);
const lightErrCr = lightErrFg ? contrastRatio(lightErrFg, lightCanvas) : 0;
const darkErrCr = darkErrFg ? contrastRatio(darkErrFg, darkCanvas) : 0;
check(`form.css Light .vd-error-text contrast >= 4.5:1 (${lightErrCr.toFixed(2)}:1)`, lightErrCr >= 4.5);
check(`form.css Dark .vd-error-text contrast >= 4.5:1 (${darkErrCr.toFixed(2)}:1)`, darkErrCr >= 4.5);

const buttonCss = fs.readFileSync(path.join(rootDir, 'components', 'button.css'), 'utf8');
const buttonRules = parseCssRules(buttonCss);
const baseBtnDecls = getMergedDecls(buttonRules, ['.vd-btn']);
for (const variant of ['primary', 'danger']) {
  const lightBtnDecls = {
    ...baseBtnDecls,
    ...getMergedDecls(buttonRules, [`.vd-btn--${variant}`]),
  };
  const darkBtnDecls = {
    ...lightBtnDecls,
    ...getMergedDecls(buttonRules, [`[data-theme="dark"] .vd-btn--${variant}`]),
  };
  for (const [themeLabel, decls, vars, surface] of [
    ['Light', lightBtnDecls, lightVars, lightCanvas],
    ['Dark', darkBtnDecls, darkVars, darkCanvas],
  ]) {
    const bg = flattenOver(resolveCssColor(decls['--_vd-btn-bg'], vars), surface);
    const fg = bg ? flattenOver(resolveCssColor(decls['--_vd-btn-color'], vars), bg) : null;
    const cr = fg && bg ? contrastRatio(fg, bg) : 0;
    check(`button.css ${themeLabel} .vd-btn--${variant} contrast >= 4.5:1 (${cr.toFixed(2)}:1)`, cr >= 4.5);
  }
}

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
