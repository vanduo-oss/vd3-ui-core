/**
 * @file build-ssg.mjs
 * Zero-dependency Static-Site Generator (SSG) post-processor for @vd3-ui-core/site.
 * Synchronizes authoritative W3C DTCG tokens and pre-renders complete semantic HTML
 * into site/dist/index.html for zero-JS human readability and AI agent ingestion.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const siteDir = path.join(rootDir, 'site');
const distDir = path.join(siteDir, 'dist');
const distHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(distHtmlPath)) {
  console.error(`[build-ssg] ERROR: "${distHtmlPath}" does not exist. Run "vite build" first.`);
  process.exit(1);
}

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// 1. Synchronize authoritative W3C DTCG tokens & schema into public/ and dist/
const tokensJsonSrc = path.join(rootDir, 'tokens', 'vd3.tokens.json');
const tokensCssSrc = path.join(rootDir, 'tokens', 'tokens.css');
const schemaJsonSrc = path.join(rootDir, 'tokens', 'schema.json');
const figmaManifestSrc = path.join(rootDir, 'tokens', 'figma.manifest.json');

copyIfExists(tokensJsonSrc, path.join(siteDir, 'public', 'tokens', 'vd3.tokens.json'));
copyIfExists(tokensJsonSrc, path.join(distDir, 'tokens', 'vd3.tokens.json'));
copyIfExists(tokensCssSrc, path.join(siteDir, 'public', 'tokens', 'tokens.css'));
copyIfExists(tokensCssSrc, path.join(distDir, 'tokens', 'tokens.css'));
copyIfExists(schemaJsonSrc, path.join(siteDir, 'public', 'tokens', 'schema.json'));
copyIfExists(schemaJsonSrc, path.join(distDir, 'tokens', 'schema.json'));
copyIfExists(figmaManifestSrc, path.join(siteDir, 'public', 'tokens', 'figma.manifest.json'));
copyIfExists(figmaManifestSrc, path.join(distDir, 'tokens', 'figma.manifest.json'));

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMathBody(raw) {
  let s = escHtml(String(raw).trim());
  s = s
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\quad/g, '  ')
    .replace(/\\phi/g, 'φ')
    .replace(/\\psi/g, 'ψ')
    .replace(/\\approx/g, '≈')
    .replace(/\\ge/g, '≥')
    .replace(/\\le/g, '≤')
    .replace(/\\times/g, '×')
    .replace(/\\to/g, '→')
    .replace(/\\infty/g, '∞')
    .replace(/\\dots/g, '…')
    .replace(/\^\\circ/g, '°')
    .replace(/\\([%$])/g, '$1')
    .replace(/\\text\{([^{}]+)\}/g, '$1')
    .replace(/\\pmod\{([^{}]+)\}/g, '(mod $1)')
    .replace(/\\lim_\{([^{}]+)\}/g, 'lim[$1]')
    .replace(/\\sqrt\{φ\}/g, '√φ')
    .replace(/\\sqrt\{5\}/g, '√5')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    .replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>')
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/\^(-?[a-zA-Z0-9]+)/g, '<sup>$1</sup>');
  for (let k = 0; k < 4; k++) {
    s = s
      .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)');
  }
  s = s
    .replace(/\(1\)\s*\/\s*\((φ(?:<sup>[0-9-]+<\/sup>)?)\)/g, '1/$1')
    .replace(/\(([^()]+)\)\s*\/\s*\(√5\)/g, '($1) / √5')
    .replace(/\(([^()]+)\)\s*\/\s*\(2\)/g, '($1) / 2');
  return s;
}

function renderInline(str) {
  const codeSpans = [];
  const tokenized = str
    .replace(/`([^`]+)`/g, (_, code) => {
      const idx = codeSpans.length;
      codeSpans.push(`<code class="vd-code-inline">${escHtml(code)}</code>`);
      return `\u0000CODE${idx}\u0000`;
    })
    .replace(/\$\$([^$]+)\$\$/g, (_, math) => {
      const idx = codeSpans.length;
      codeSpans.push(`<code class="vd-code-inline vd-math-block">${formatMathBody(math)}</code>`);
      return `\u0000CODE${idx}\u0000`;
    })
    .replace(/\$([^$\n]+)\$/g, (_, math) => {
      const idx = codeSpans.length;
      codeSpans.push(`<span class="vd-math">${formatMathBody(math)}</span>`);
      return `\u0000CODE${idx}\u0000`;
    });

  const formatted = escHtml(tokenized)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  return formatted.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeSpans[Number(idx)] ?? '');
}

/**
 * Converts a normative markdown document into semantic HTML with:
 * - stripped frontmatter and top-level # H1 (section supplies its own heading)
 * - monotonic heading transitions clamped to <= lastLevel + 1
 * - fenced code blocks wrapped in <pre class="vd-code" tabindex="0"><code>...</code></pre>
 * - pipe tables wrapped in <div class="vd-table-container" tabindex="0"> with th[scope]
 */
function renderMarkdown(markdown, initialLevel = 2, tableLabel = 'Specification table') {
  let lastLevel = initialLevel;
  const lines = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split(/\r?\n/);
  const out = [];
  let para = [];
  let skippedTopH1 = false;

  const flushPara = () => {
    if (para.length > 0) {
      out.push(`<p>${renderInline(para.join(' '))}</p>`);
      para = [];
    }
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    const fenceMatch = /^\s*```([a-zA-Z0-9_-]*)\s*$/.exec(line);
    if (fenceMatch) {
      flushPara();
      const lang = (fenceMatch[1] || '').trim();
      const codeLines = [];
      i++;
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      const langAttr = lang ? ` data-language="${escHtml(lang)}"` : '';
      out.push(`<pre class="vd-code"${langAttr} tabindex="0"><code>${escHtml(codeLines.join('\n'))}</code></pre>`);
      continue;
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushPara();
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const head = rows[0] || [];
      out.push(
        `<div class="vd-table-container" tabindex="0" role="region" aria-label="${escHtml(tableLabel)}">` +
          '<table class="vd-table vd-table--hover"><thead><tr>' +
          head.map((c) => `<th scope="col">${renderInline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          rows
            .slice(1)
            .map(
              (r) =>
                '<tr>' +
                r
                  .map((c, idx) => (idx === 0 ? `<th scope="row">${renderInline(c)}</th>` : `<td>${renderInline(c)}</td>`))
                  .join('') +
                '</tr>',
            )
            .join('') +
          '</tbody></table></div>',
      );
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      flushPara();
      const rawLevel = headingMatch[1].length;
      if (rawLevel === 1 && !skippedTopH1) {
        skippedTopH1 = true;
        i++;
        continue;
      }
      const shifted = Math.min(6, Math.max(initialLevel + 1, rawLevel + (initialLevel - 1)));
      const level = Math.min(6, Math.min(shifted, lastLevel + 1));
      lastLevel = level;
      out.push(`<h${level}>${renderInline(headingMatch[2].trim())}</h${level}>`);
      i++;
      continue;
    }

    if (/^\s*---\s*$/.test(line)) {
      flushPara();
      out.push('<hr/>');
      i++;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      flushPara();
      const quoteLines = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, '').trim());
        i++;
      }
      out.push(`<blockquote><p>${renderInline(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, '').trim());
        i++;
      }
      out.push('<ul>' + items.map((item) => `<li>${renderInline(item)}</li>`).join('') + '</ul>');
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i++;
      }
      out.push('<ol>' + items.map((item) => `<li>${renderInline(item)}</li>`).join('') + '</ol>');
      continue;
    }

    if (line.trim() === '') {
      flushPara();
      i++;
      continue;
    }

    para.push(line.trim());
    i++;
  }

  flushPara();
  return out.join('\n');
}

function readSpec(relPath) {
  return fs.readFileSync(path.join(rootDir, relPath), 'utf8');
}

const pillars = [
  { id: 'contract', label: 'Foundations' },
  { id: 'foundations', label: 'Matrix' },
  { id: 'components', label: 'Components' },
  { id: 'conventions', label: 'Conventions' },
  { id: 'patterns', label: 'Patterns' },
];

const chapters = [
  { id: 'contract', num: '01', label: 'Contract' },
  { id: 'proportion', num: '02', label: 'Proportion' },
  { id: 'space', num: '03', label: 'Space' },
  { id: 'line', num: '04', label: 'Line' },
  { id: 'type', num: '05', label: 'Type' },
  { id: 'motion', num: '06', label: 'Motion' },
  { id: 'elevation', num: '07', label: 'Elevation' },
  { id: 'glass', num: '08', label: 'Glass' },
  { id: 'color', num: '09', label: 'Color' },
  { id: 'grid', num: '10', label: 'Grid & Layout' },
  { id: 'focus', num: '11', label: 'Focus' },
  { id: 'icons', num: '12', label: 'Icons' },
  { id: 'density', num: '13', label: 'Density' },
  { id: 'data-viz', num: '14', label: 'Data Viz' },
  { id: 'foundations', num: '15', label: 'Matrix' },
  { id: 'components', num: '16', label: 'Components' },
  { id: 'conventions', num: '17', label: 'Conventions' },
  { id: 'patterns', num: '18', label: 'Patterns' },
];

const foundationRows = [
  ['proportion', 'Spec’d', 'A', 'A/B/C contract, Fibonacci & Lucas Binet lattices, golden convergence'],
  ['spacing', 'Unified', 'A / C-01', 'Fibonacci rem ladder (2..144px) with physical sub-pixel Exception C-01'],
  ['line', 'New in 1.0', 'A', 'Fibonacci hairline/thin/regular/thick stroke widths (1/2/3/5px)'],
  ['typography', 'Spec’d', 'A', '√φ modular scale, fluid clamp() expressions, φ line-heights'],
  ['motion', 'Spec’d', 'A', '55..987ms Fibonacci durations, golden Bézier easings, MOB-001 0ms contract'],
  ['elevation', 'Spec’d', 'A', 'Consecutive Fibonacci shadow offset/blur pairs F_k / F_k+2'],
  ['glass + surfaces', 'Spec’d', 'A / C-02', 'Frosted blur steps 1..89 capped per GPU safety Exception C-02'],
  ['color', 'Spec’d', 'A / B', 'Semantic dual-theme WCAG AAA/AA roles + 137.508° golden-angle palette'],
  ['grid + layout', 'Spec’d', 'B / A', '12-column responsive engine + Class A golden split & Fibonacci grids'],
  ['z-index', 'New in 1.0', 'B', 'Conventional semantic layering from base (0) to toast (1080)'],
  ['focus', 'New in 1.0', 'B', 'WCAG 2.2 SC 2.4.13 Dual-Ring focus indicator with inner offset gap'],
  ['icons', 'New in 1.1', 'A', 'Fibonacci icon sizes 13/21/34/55px (F_7..F_10), phi stroke 1.618, semantic-role icon ink'],
  ['density', 'New in 1.1', 'A / B', 'Two modes via [data-density]: comfortable (1) and compact (1/sqrt(phi) spacing scale)'],
  ['data-viz', 'Boundary', 'A', 'vd3-charts / vd3-flowchart consume the golden-angle palette; core ships no chart components'],
  ['patterns', 'New in 1.1', 'B', 'Empty states, auth flows, app shell, onboarding, disabled/read-only — guidance over normative components'],
  ['components', 'New in 1.0', 'A / B / C', '35 zero-framework CSS modules (layout engine + 34 primitives), 38 per-slug specs, @layer vd3.components'],
  ['conventions', 'Normative', 'B', 'Identifier naming, cross-system mappings, and editorial copy rules'],
];

const specimens = [
  {
    id: 'button',
    title: 'Button (.vd-btn)',
    basis: 'A',
    tokens: 'space.fib-8 space.fib-13 radius.fib-5 color.role.interactive color.role.focus',
    preview: `<button type="button" class="vd-btn vd-btn--primary">Primary Action</button>
      <button type="button" class="vd-btn vd-btn--outline">Secondary</button>
      <button type="button" class="vd-btn vd-btn--ghost" disabled>Disabled</button>`,
    code: '<button type="button" class="vd-btn vd-btn--primary">Save Token</button>',
  },
  {
    id: 'dialog',
    title: 'Dialog (.vd-dialog)',
    basis: 'B',
    tokens: 'container.sm radius.fib-13 shadow.5 z.modal',
    preview: `<div class="specimen-actions">
        <button id="demo-dialog-trigger" type="button" class="vd-btn vd-btn--outline vd-btn--sm" aria-haspopup="dialog" aria-controls="demo-modal-dialog">Open Live Modal</button>
        <span class="specimen-meta">Native &lt;dialog&gt;.showModal(), Lucas L₁₃ 521px max-width, Esc dismissal.</span>
      </div>
      <dialog id="demo-modal-dialog" class="vd-dialog" aria-labelledby="demo-dlg-title">
        <div class="vd-dialog-header">
          <p id="demo-dlg-title" class="vd-dialog-title">VD3 Native Modal Contract</p>
          <button type="button" class="vd-btn vd-btn--ghost vd-btn--sm vd-dialog-close" aria-label="Close dialog">×</button>
        </div>
        <div class="vd-dialog-body"><p>Uses native &lt;dialog&gt;.showModal(), Lucas L₁₃ 521px max-width, Esc dismissal, and focus restoration.</p></div>
        <div class="vd-dialog-footer">
          <button type="button" class="vd-btn vd-btn--outline vd-btn--sm">Cancel</button>
          <button type="button" class="vd-btn vd-btn--primary vd-btn--sm">Acknowledge</button>
        </div>
      </dialog>`,
    code: '<dialog class="vd-dialog" aria-labelledby="dlg-title">...</dialog>',
  },
  {
    id: 'card',
    title: 'Card (.vd-card)',
    basis: 'A',
    tokens: 'math.phi radius.fib-8 space.fib-21 shadow.2',
    preview: `<div class="vd-card vd-card--elevated"><div class="vd-card-body">Golden proportion card surface bound to Fibonacci shadow level 2.</div></div>`,
    code: '<article class="vd-card vd-card--elevated"><div class="vd-card-body">...</div></article>',
  },
  {
    id: 'form',
    title: 'Form Controls (.vd-input)',
    basis: 'A',
    tokens: 'space.fib-8 space.fib-13 radius.fib-5 color.role.border color.role.critical',
    preview: `<label for="ssg-token-input" class="vd-label">Token Identifier</label>
      <input id="ssg-token-input" class="vd-input" type="text" placeholder="space.fib-21" />`,
    code: '<label for="tok-in" class="vd-label">Token</label><input id="tok-in" class="vd-input" />',
  },
  {
    id: 'badge',
    title: 'Badges & Chips (.vd-badge / .vd-chip)',
    basis: 'A',
    tokens: 'space.fib-3 space.fib-8 radius.full type.size.xs',
    preview: `<span class="vd-badge vd-badge--info">Info</span>
      <span class="vd-badge vd-badge--success">Pass</span>
      <span class="vd-badge vd-badge--warning">Exception C</span>
      <span class="vd-badge vd-badge--danger">Critical</span>
      <button type="button" class="vd-chip" aria-pressed="true">Filter: φ</button>`,
    code: '<span class="vd-badge vd-badge--info">Class A</span>',
  },
  {
    id: 'navbar',
    title: 'Navbar (.vd-navbar)',
    basis: 'B',
    tokens: 'z.sticky space.fib-13 color.role.canvas line.hair',
    preview: `<span class="vd-badge vd-badge--info">z-sticky: 1020</span>
      <span>Sticky header bar paired with anchor scroll-margin-top compensation.</span>`,
    code: '<nav class="vd-navbar" aria-label="Secondary">...</nav>',
  },
  {
    id: 'accordion',
    title: 'Accordion (.vd-accordion)',
    basis: 'A',
    tokens: 'space.fib-13 space.fib-21 radius.fib-8 motion.144',
    preview: `<details class="vd-accordion"><summary class="vd-accordion-summary">Native disclosure contract (144ms)</summary><div class="vd-accordion-content">Zero JS required for Enter/Space disclosure toggling.</div></details>`,
    code: '<details class="vd-accordion"><summary class="vd-accordion-summary">Spec</summary></details>',
  },
  {
    id: 'table',
    title: 'Data Table (.vd-table)',
    basis: 'A',
    tokens: 'space.fib-8 space.fib-13 line.hair color.role.layer',
    preview: `<div class="vd-table-container" tabindex="0" role="region" aria-label="Sample metric table"><table class="vd-table vd-table--compact"><thead><tr><th scope="col">Step</th><th scope="col">px</th></tr></thead><tbody><tr><th scope="row">F₈</th><td>21px</td></tr></tbody></table></div>`,
    code: '<div class="vd-table-container" tabindex="0"><table class="vd-table">...</table></div>',
  },
  {
    id: 'code',
    title: 'Code Block (.vd-code)',
    basis: 'A',
    tokens: 'space.fib-13 radius.fib-8 math.golden-angle color.role.layer',
    preview: `<span>Accessible scrollable block (tabindex="0") with WCAG AA 137.5° syntax tokens.</span>`,
    code: '<pre class="vd-code" data-language="css" tabindex="0"><code>:root { --vd3-phi: 1.618; }</code></pre>',
  },
  {
    id: 'toast',
    title: 'Toast (.vd-toast)',
    basis: 'A',
    tokens: 'z.toast space.fib-13 radius.fib-8 shadow.4 motion.233',
    preview: `<div class="specimen-actions">
        <button type="button" class="vd-btn vd-btn--primary vd-btn--sm">Trigger Live Toast</button>
        <button type="button" class="vd-btn vd-btn--outline vd-btn--sm">Trigger Info Toast</button>
      </div>
      <div class="vd-toast vd-toast--success" role="status"><div class="vd-toast-content"><div class="vd-toast-title">Static specimen preview</div><p class="vd-toast-message">Tokens verified (368/368) · Auto-dismisses after 4181ms (F₁₉).</p></div></div>`,
    code: '<div class="vd-toast vd-toast--success" role="status">Verified</div>',
  },
  {
    id: 'switch',
    title: 'Switch (.vd-switch)',
    basis: 'A',
    tokens: 'space.fib-21 space.fib-34 radius.full color.role.focus focus.ring.width motion.144',
    preview: `<button type="button" role="switch" aria-checked="true" class="vd-switch" aria-label="Notifications enabled"><span class="vd-switch-thumb"></span></button>
      <button type="button" role="switch" aria-checked="false" class="vd-switch vd-switch--sm" aria-label="Compact mode"></button>`,
    code: '<button type="button" role="switch" aria-checked="false" class="vd-switch"><span class="vd-switch-thumb"></span></button>',
  },
  {
    id: 'alert',
    title: 'Alert (.vd-alert)',
    basis: 'B',
    tokens: 'space.fib-13 space.fib-21 line.regular color.role.critical color.role.focus radius.fib-8',
    preview: `<div class="vd-alert vd-alert--warning" role="alert"><span class="vd-alert-icon" aria-hidden="true">!</span><div class="vd-alert-content"><p class="vd-alert-title">Registered exception C-02</p><p class="vd-alert-body">Glass blur soft-caps at 20px — the Convergence Zone is documented in foundations/glass.md.</p></div><button type="button" class="vd-alert-close" aria-label="Dismiss alert">×</button></div>`,
    code: '<div class="vd-alert vd-alert--critical" role="alert">...</div>',
  },
  {
    id: 'tabs',
    title: 'Tabs (.vd-tabs / .vd-tab)',
    basis: 'B',
    tokens: 'space.fib-8 space.fib-13 line.hair line.thin color.role.focus motion.89',
    preview: `<div class="vd-tabs" role="tablist" aria-label="Specimen tabs"><button type="button" class="vd-tab" role="tab" id="ssg-tab-a" aria-selected="true" aria-controls="ssg-panel-a">Tokens</button><button type="button" class="vd-tab" role="tab" id="ssg-tab-b" aria-selected="false" aria-controls="ssg-panel-b" tabindex="-1">Components</button></div>
      <div class="vd-tab-panel" role="tabpanel" id="ssg-panel-a" aria-labelledby="ssg-tab-a">DTCG 2025.10 registry — 150+ leaf tokens, all basis-classed.</div>`,
    code: '<div class="vd-tabs" role="tablist"><button class="vd-tab" role="tab" aria-selected="true">…</button></div>',
  },
  {
    id: "drawer",
    title: "Drawer (.vd-drawer)",
    basis: "B",
    tokens: "z.modal z.modal-backdrop container.sm space.fib-21 motion.slow",
    preview: `<button type="button" class="vd-btn vd-btn--outline vd-btn--sm">Open drawer</button> <span class="specimen-meta">Fixed panel at z.modal, Esc + backdrop close, slide 377ms.</span>`,
    code: "<aside class=\"vd-drawer vd-drawer--end\" data-open=\"true\">...</aside>",
  },
  {
    id: "tooltip",
    title: "Tooltip (.vd-tooltip)",
    basis: "A",
    tokens: "z.tooltip type.size.xs space.fib-5 radius.fib-3 motion.89",
    preview: `<span class="vd-tooltip vd-tooltip--top" role="tooltip">φ = 1.618…</span>`,
    code: "<span class=\"vd-tooltip\" role=\"tooltip\">Hint</span>",
  },
  {
    id: "popover",
    title: "Popover (.vd-popover)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.233",
    preview: `<div class="vd-popover"><div class="vd-popover-header">Popover title</div><div class="vd-popover-body">Anchored floating content with arrow.</div></div>`,
    code: "<div class=\"vd-popover\" data-placement=\"bottom\">...</div>",
  },
  {
    id: "menu",
    title: "Menu (.vd-menu)",
    basis: "B",
    tokens: "z.dropdown shadow.4 radius.fib-8 space.fib-8 color.role.layer-hover",
    preview: `<div class="vd-menu" role="menu"><div class="vd-menu-item" role="menuitem">Rename</div><div class="vd-menu-item" role="menuitem">Duplicate</div><div class="vd-menu-divider"></div><div class="vd-menu-item vd-menu-item--danger" role="menuitem">Delete</div></div>`,
    code: "<div class=\"vd-menu\" role=\"menu\"><div class=\"vd-menu-item\">\u2026</div></div>",
  },
  {
    id: "context-menu",
    title: "Context Menu (.vd-context-menu)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-8",
    preview: `<div class="vd-context-menu" role="menu"><div class="vd-context-menu-item" role="menuitem">Open</div><div class="vd-context-menu-item vd-context-menu-item--danger" role="menuitem">Remove</div></div>`,
    code: "<div class=\"vd-context-menu\" role=\"menu\">...</div>",
  },
  {
    id: "menubar",
    title: "Menubar (.vd-menubar)",
    basis: "B",
    tokens: "space.fib-8 line.hair color.role.layer-hover",
    preview: `<div class="vd-menubar"><span class="vd-menubar-item" aria-haspopup="true" aria-expanded="false">File</span><span class="vd-menubar-item">Edit</span><span class="vd-menubar-item">View</span></div>`,
    code: "<div class=\"vd-menubar\"><span class=\"vd-menubar-item\">File</span></div>",
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb (.vd-breadcrumb)",
    basis: "B",
    tokens: "space.fib-5 type.size.sm color.role.interactive motion.89",
    preview: `<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb"><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#foundations">Foundations</a></li><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#components" aria-current="page">Color</a></li></ol></nav>`,
    code: "<nav aria-label=\"Breadcrumb\"><ol class=\"vd-breadcrumb\">...</ol></nav>",
  },
  {
    id: "pagination",
    title: "Pagination (.vd-pagination)",
    basis: "B",
    tokens: "space.fib-8 line.hair radius.fib-5 type.size.sm color.role.focus",
    preview: `<nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list"><li class="vd-pagination-item"><a class="vd-pagination-link vd-pagination-link--prev" href="#components" aria-label="Previous page">‹</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components" aria-current="page">1</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components">2</a></li></ul></nav>`,
    code: "<nav class=\"vd-pagination\"><ul class=\"vd-pagination-list\">...</ul></nav>",
  },
  {
    id: "avatar",
    title: "Avatar (.vd-avatar)",
    basis: "A",
    tokens: "space.fib-21 space.fib-34 radius.full line.thin color.role.layer",
    preview: `<span class="vd-avatar vd-avatar--md vd-avatar--round"><span class="vd-avatar-initials">VD</span><span class="vd-avatar-status vd-avatar-status--online"></span></span>`,
    code: "<span class=\"vd-avatar vd-avatar--round\"><span class=\"vd-avatar-initials\">VD</span></span>",
  },
  {
    id: "progress",
    title: "Progress (.vd-progress)",
    basis: "A",
    tokens: "space.fib-5 radius.full color.role.focus motion.233",
    preview: `<div class="vd-progress" role="progressbar" aria-valuenow="62" aria-label="Upload progress"><div class="vd-progress-bar" style="--_vd-progress-value: 62%"></div></div>`,
    code: "<div class=\"vd-progress\" role=\"progressbar\"><div class=\"vd-progress-bar\" style=\"--_vd-progress-value: 62%\"></div></div>",
  },
  {
    id: "spinner",
    title: "Spinner (.vd-spinner)",
    basis: "A",
    tokens: "space.fib-21 radius.full line.hair color.role.focus motion.610 easing.linear",
    preview: `<span class="vd-spinner vd-spinner--md" role="status" aria-label="Loading"></span>`,
    code: "<span class=\"vd-spinner\" role=\"status\" aria-label=\"Loading\"></span>",
  },
  {
    id: "skeleton",
    title: "Skeleton (.vd-skeleton)",
    basis: "A",
    tokens: "color.role.layer-hover radius.fib-5 motion.377 easing.in-out",
    preview: `<div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 82%"></div><div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 58%"></div>`,
    code: "<div class=\"vd-skeleton vd-skeleton--text\"></div>",
  },
  {
    id: "slider",
    title: "Slider (.vd-slider)",
    basis: "A",
    tokens: "space.fib-3 space.fib-21 radius.full line.thin color.role.focus motion.89",
    preview: `<input type="range" class="vd-slider" min="0" max="100" value="40" aria-label="Volume">`,
    code: "<input type=\"range\" class=\"vd-slider\" min=\"0\" max=\"100\" aria-label=\"Volume\">",
  },
  {
    id: "datepicker",
    title: "Date Picker (.vd-datepicker)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 color.role.focus",
    preview: `<div class="vd-datepicker"><div class="vd-datepicker-header"><span class="vd-datepicker-title">November 2026</span></div><div class="vd-datepicker-grid"><span class="vd-datepicker-day">15</span><span class="vd-datepicker-day" aria-selected="true">16</span><span class="vd-datepicker-day">17</span></div></div>`,
    code: "<div class=\"vd-datepicker\"><div class=\"vd-datepicker-grid\">...</div></div>",
  },
  {
    id: "timepicker",
    title: "Time Picker (.vd-timepicker)",
    basis: "B",
    tokens: "z.popover space.fib-8 type.size.sm color.role.focus",
    preview: `<div class="vd-timepicker"><div class="vd-timepicker-item" aria-selected="true">09:00</div><div class="vd-timepicker-item">09:30</div><div class="vd-timepicker-item">10:00</div></div>`,
    code: "<div class=\"vd-timepicker\"><div class=\"vd-timepicker-item\">09:00</div></div>",
  },
  {
    id: "upload",
    title: "File Upload (.vd-upload)",
    basis: "B",
    tokens: "line.thin radius.fib-8 space.fib-21 color.role.border icon.size.lg",
    preview: `<label class="vd-upload"><span class="vd-upload-icon" aria-hidden="true">↑</span><span class="vd-upload-text">Drop files here</span><span class="vd-upload-hint">or click to browse</span><input class="vd-upload-input" type="file" aria-label="Upload files"></label>`,
    code: "<label class=\"vd-upload\"><input class=\"vd-upload-input\" type=\"file\" aria-label=\"Upload files\"></label>",
  },
  {
    id: "carousel",
    title: "Carousel (.vd-carousel)",
    basis: "B",
    tokens: "space.fib-34 radius.fib-8 motion.377 color.role.focus focus.ring.width",
    preview: `<div class="vd-carousel"><div class="vd-carousel-track" style="--_vd-carousel-index: 0"><div class="vd-carousel-slide">Slide 1</div><div class="vd-carousel-slide">Slide 2</div></div><button type="button" class="vd-carousel-prev" aria-label="Previous slide">‹</button><button type="button" class="vd-carousel-next" aria-label="Next slide">›</button></div>`,
    code: "<div class=\"vd-carousel\"><div class=\"vd-carousel-track\">...</div></div>",
  },
  {
    id: "toolbar",
    title: "Toolbar (.vd-toolbar)",
    basis: "B",
    tokens: "space.fib-8 line.hair radius.fib-8 color.role.layer",
    preview: `<div class="vd-toolbar"><div class="vd-toolbar-group"><button type="button" class="vd-toolbar-button">B</button><button type="button" class="vd-toolbar-button">I</button></div><span class="vd-toolbar-separator"></span><button type="button" class="vd-toolbar-button">Link</button></div>`,
    code: "<div class=\"vd-toolbar\"><div class=\"vd-toolbar-group\">...</div></div>",
  },
  {
    id: "segmented",
    title: "Segmented (.vd-segmented)",
    basis: "B",
    tokens: "radius.full line.hair space.fib-1 color.role.layer shadow.1",
    preview: `<div class="vd-segmented" role="radiogroup" aria-label="View"><button type="button" class="vd-segmented-item" aria-checked="true">Day</button><button type="button" class="vd-segmented-item" aria-checked="false">Week</button><button type="button" class="vd-segmented-item" aria-checked="false">Month</button></div>`,
    code: "<div class=\"vd-segmented\"><button class=\"vd-segmented-item\" aria-checked=\"true\">Day</button></div>",
  },
  {
    id: "hover-card",
    title: "Hover Card (.vd-hover-card)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.144",
    preview: `<div class="vd-hover-card"><p class="vd-hover-card-title">Hover card</p><p class="vd-hover-card-body">Rich preview on hover or keyboard focus.</p></div>`,
    code: "<div class=\"vd-hover-card\">...</div>",
  },
  {
    id: "tour",
    title: "Tour (.vd-tour)",
    basis: "B",
    tokens: "z.popover shadow.5 radius.fib-8 space.fib-21 motion.233",
    preview: `<div class="vd-tour"><p class="vd-tour-title">Step 2 of 5</p><p class="vd-tour-body">This is where the tokens live.</p><div class="vd-tour-progress"></div><div class="vd-tour-footer"><span class="vd-tour-counter">2 / 5</span><div class="vd-tour-actions"><button type="button" class="vd-tour-btn">Back</button><button type="button" class="vd-tour-btn vd-tour-btn--primary">Next</button></div></div></div>`,
    code: "<div class=\"vd-tour\">...</div>",
  },
  {
    id: 'layout',
    title: 'Layout Engine (.vd-split-golden)',
    basis: 'B',
    tokens: 'container.lg space.fib-21 math.phi math.inv-phi',
    preview: `<span>61.8% primary measure paired with 38.2% secondary rail inside 987px container.</span>`,
    code: '<div class="vd-container-lg vd-split-golden">...</div>',
  },
];

const spacingSummaryMd = `
One normative Fibonacci ladder governs padding, margin, and layout gaps. Adjacent steps converge toward φ = 1.618; sub-8px micro-adjustments use Registered Exception C-01.

| Step | Token | rem | px | Basis |
| --- | --- | --- | --- | --- |
| F₃ | \`space.fib-2\` | 0.125rem | 2px | C-01 |
| F₄ | \`space.fib-3\` | 0.1875rem | 3px | C-01 |
| F₅ | \`space.fib-5\` | 0.3125rem | 5px | C-01 |
| F₆ | \`space.fib-8\` | 0.5rem | 8px | Class A |
| F₇ | \`space.fib-13\` | 0.8125rem | 13px | Class A |
| F₈ | \`space.fib-21\` | 1.3125rem | 21px | Class A |
| F₉ | \`space.fib-34\` | 2.125rem | 34px | Class A |
| F₁₀ | \`space.fib-55\` | 3.4375rem | 55px | Class A |
| F₁₁ | \`space.fib-89\` | 5.5625rem | 89px | Class A |
| F₁₂ | \`space.fib-144\` | 9rem | 144px | Class A |
`;

const sectionsHtml = [
  {
    id: 'contract',
    num: '01',
    title: 'The Proportional Contract',
    badge: 'A / B / C',
    md: readSpec('foundations/principles.md'),
  },
  {
    id: 'proportion',
    num: '02',
    title: 'Proportion — The Golden Spine',
    badge: 'Class A',
    md: readSpec('foundations/proportion.md'),
  },
  {
    id: 'space',
    num: '03',
    title: 'Spacing',
    badge: 'Class A / C-01',
    md: spacingSummaryMd,
  },
  {
    id: 'line',
    num: '04',
    title: 'Line Weights',
    badge: 'Class A',
    md: readSpec('foundations/line.md'),
  },
  {
    id: 'type',
    num: '05',
    title: 'Typography',
    badge: 'Class A',
    md: readSpec('foundations/typography.md'),
  },
  {
    id: 'motion',
    num: '06',
    title: 'Motion',
    badge: 'Class A',
    md: readSpec('foundations/motion.md'),
  },
  {
    id: 'elevation',
    num: '07',
    title: 'Elevation &amp; Stacking',
    badge: 'Class A',
    md: readSpec('foundations/elevation.md'),
  },
  {
    id: 'glass',
    num: '08',
    title: 'Seemore Glass &amp; Translucency',
    badge: 'Class A / C-02',
    md: readSpec('foundations/glass.md'),
  },
  {
    id: 'color',
    num: '09',
    title: 'Color &amp; Dual-Theme Semantics',
    badge: 'Class A / B',
    md: readSpec('foundations/color.md'),
  },
  {
    id: 'grid',
    num: '10',
    title: 'Grid &amp; Layout Primitives',
    badge: 'Class A / B',
    md: readSpec('foundations/layout.md'),
  },
  {
    id: 'focus',
    num: '11',
    title: 'Focus &amp; Accessibility Contracts',
    badge: 'WCAG 2.2 AA/AAA',
    md: readSpec('foundations/focus.md'),
  },
  {
    id: 'icons',
    num: '12',
    title: 'Iconography Contract',
    badge: 'Class A',
    md: readSpec('foundations/icons.md'),
  },
  {
    id: 'density',
    num: '13',
    title: 'Density Modes',
    badge: 'A / B',
    md: readSpec('foundations/density.md'),
  },
  {
    id: 'data-viz',
    num: '14',
    title: 'Data Visualization Boundary',
    badge: 'Class A',
    md: readSpec('foundations/data-viz.md'),
  },
];

const foundationMatrixHtml = `
<section id="foundations" class="doc-section">
  <h2><span class="n">15</span> Foundation Coverage Matrix <span class="vd-badge vd-badge--info">DTCG 2025.10</span></h2>
  <div class="vd-table-container" tabindex="0" role="region" aria-label="Foundation coverage matrix">
    <table class="vd-table vd-table--hover">
      <thead>
        <tr><th scope="col">Foundation</th><th scope="col">Status</th><th scope="col">Basis</th><th scope="col">Normative Summary</th></tr>
      </thead>
      <tbody>
        ${foundationRows
          .map(
            ([name, status, basis, note]) =>
              `<tr><th scope="row">${escHtml(name)}</th><td>${escHtml(status)}</td><td><span class="vd-badge vd-badge--info">${escHtml(basis)}</span></td><td>${escHtml(note)}</td></tr>`,
          )
          .join('\n        ')}
      </tbody>
    </table>
  </div>
</section>`;

const componentSpecSlugs = ["layout", "button", "dialog", "card", "input", "select", "checkbox", "radio", "badge", "navbar", "accordion", "table", "code", "toast", "switch", "alert", "tabs", "drawer", "tooltip", "popover", "menu", "context-menu", "menubar", "breadcrumb", "pagination", "avatar", "progress", "spinner", "skeleton", "slider", "datepicker", "timepicker", "upload", "carousel", "toolbar", "segmented", "hover-card", "tour"];

const componentsSectionHtml = `
<section id="components" class="doc-section">
  <h2><span class="n">16</span> Components — 34 Primitives + Layout Engine <span class="vd-badge vd-badge--info">Zero-Framework CSS</span></h2>
  <p class="lead">
    Every core stylesheet resides inside <code>@layer vd3.components</code> or <code>@layer vd3.layout</code>,
    binds strictly to W3C DTCG tokens from <code>tokens/vd3.tokens.json</code>, and exposes machine-readable
    <code>data-vd-*</code> contracts. Every module has a per-slug behavioral spec below.
  </p>
  <h3>Component Specification Index</h3>
  <div class="md-doc">
    ${renderMarkdown(readSpec('components/SPEC.md'), 3, 'Component specification index')}
  </div>
  <div class="specimen-grid">
    ${specimens
      .map(
        (s) => `
    <article class="specimen-card" data-vd-component="${escHtml(s.id)}" data-vd-basis-class="${escHtml(s.basis)}" data-vd-tokens="${escHtml(s.tokens)}">
      <div class="specimen-header">
        <h3>${escHtml(s.title)}</h3>
        <span class="vd-badge vd-badge--info">Class ${escHtml(s.basis)}</span>
      </div>
      <div class="specimen-preview specimen-preview--block">${s.preview}</div>
      <div class="vd-code-block">
        <pre class="vd-code" data-language="html" tabindex="0"><code>${escHtml(s.code)}</code></pre>
        <button type="button" class="vd-code-copy" aria-label="Copy ${escHtml(s.id)} HTML snippet">Copy</button>
      </div>
    </article>`,
      )
      .join('\n')}
  </div>
  <h3>Per-Slug Component Specifications (${componentSpecSlugs.length} specs, W3C APG where applicable)</h3>
  ${componentSpecSlugs
    .map(
      (slug) => `<h4>${escHtml(slug)}</h4>
  <div class="md-doc">${renderMarkdown(readSpec('components/' + slug + '/spec.md'), 4, slug + ' specification')}</div>`
    )
    .join('\n  ')}
</section>`;

const conventionsSectionHtml = `
<section id="conventions" class="doc-section">
  <h2><span class="n">17</span> Conventions — Naming, Mappings &amp; Content <span class="vd-badge vd-badge--info">Normative</span></h2>
  <h3>Public &amp; Token Naming</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/naming.md'), 3, 'Naming convention table')}</div>
  <h3>Cross-System Token Mappings</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/mappings.md'), 3, 'Cross-system mapping table')}</div>
  <h3>Editorial Tone &amp; Content Strings</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/content.md'), 3, 'Content conventions table')}</div>
</section>`;

const patternsSectionHtml = `
<section id="patterns" class="doc-section">
  <h2><span class="n">18</span> Patterns — Guidance Over Components <span class="vd-badge vd-badge--info">Guidance</span></h2>
  <div class="md-doc">${renderMarkdown(readSpec('patterns/PATTERNS.md'), 2, 'Patterns index')}</div>
  ${['empty-states', 'auth-flows', 'app-shell', 'onboarding', 'disabled-read-only']
    .map(
      (pat) => `<h3>${escHtml(pat)}</h3>
  <div class="md-doc">${renderMarkdown(readSpec('patterns/' + pat + '.md'), 3, pat + ' pattern')}</div>`
    )
    .join('\n  ')}
</section>`;

const ssgBody = `
  <a href="#main-content" class="vd-skip-link">Skip to main specification</a>
  <header class="site-header" role="banner">
    <div class="vd-navbar vd-navbar--sticky vd-navbar--glass">
      <div class="vd-navbar-container">
        <div class="vd-navbar-brand">
          <a href="#main-content" class="brand">vd3<em>-ui-core</em></a>
          <span class="vd-badge vd-badge--info" data-version="1.1.0-draft">v1.1.0 · draft</span>
        </div>
        <div class="vd-navbar-menu">
          <nav class="site-nav-pillars" aria-label="Primary specification navigation">
            ${pillars
              .map(
                (l, idx) =>
                  `<a href="#${escHtml(l.id)}" class="vd-nav-link"${idx === 0 ? ' aria-current="page"' : ''}>${escHtml(l.label)}</a>`,
              )
              .join('\n            ')}
          </nav>
          <div class="vd-navbar-actions">
            <span class="vd-btn vd-btn--sm vd-btn--outline font-cycle-btn" title="Typeface: Open Sans — activate to change"><span class="font-cycle-aa" style="font-family: &quot;Open Sans&quot;, -apple-system, BlinkMacSystemFont, sans-serif">Aa</span></span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="doc-layout">
    <aside class="doc-toc" aria-label="Chapter Table of Contents">
      <div id="doc-toc-title" class="doc-toc-title">Chapters (18)</div>
      <nav aria-labelledby="doc-toc-title">
        <ol class="doc-toc-list">
          ${chapters
            .map(
              (ch, idx) =>
                `<li><a href="#${escHtml(ch.id)}" class="doc-toc-link"${idx === 0 ? ' aria-current="location"' : ''}><span class="doc-toc-num">${escHtml(ch.num)}</span><span>${escHtml(ch.label)}</span></a></li>`,
            )
            .join('\n          ')}
        </ol>
      </nav>
    </aside>

    <main id="main-content" class="doc-main">
      <section id="overview" class="hero">
        <h1>VD3 UI Core — Framework-Agnostic Design System on Golden-Ratio Math</h1>
        <p class="lead">
          First principles, mathematical proportions, layered CSS component primitives, and normative
          W3C DTCG tokens for the <strong>vd3</strong> design system. Fibonacci-first — conventional
          only where web standards and human ergonomics demand it. Consume the tokens and CSS from any
          stack — vanilla JS, React, Vue, Svelte — with zero runtime dependency. Built cleanly for both
          human engineers and machine agents.
        </p>
        <div class="vd-card phi-card">
          <div class="vd-card-body">
            <span class="phi-eq">φ = (1 + √5) ⁄ 2 = 1.6180339887…</span>
            <span class="vd-chip">Golden angle: 137.5077640…°</span>
            <span class="vd-chip">Type step: √φ = 1.272</span>
            <span class="vd-chip">Lucas containers: 521px / 1364px</span>
          </div>
        </div>
        <div class="hero-meta">
          <span><strong>3</strong> basis classes — A / B / C (No Class D)</span>
          <span><strong>35</strong> zero-framework core CSS modules</span>
          <span><strong>0</strong> runtime deps — any framework</span>
          <span><strong>W3C APG</strong>-normative keyboard &amp; ARIA</span>
          <span><strong>W3C DTCG 2025.10</strong> token registry</span>
        </div>
        <div class="hero-links">
          <a href="/tokens/vd3.tokens.json" class="vd-btn vd-btn--sm vd-btn--primary">DTCG Tokens JSON</a>
          <a href="/tokens/schema.json" class="vd-btn vd-btn--sm vd-btn--outline">Token Schema JSON</a>
          <a href="/tokens/figma.manifest.json" class="vd-btn vd-btn--sm vd-btn--outline">Figma Manifest JSON</a>
          <a href="https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh" target="_blank" rel="noopener noreferrer" class="vd-btn vd-btn--sm vd-btn--outline">Figma UI Kit</a>
          <a href="#components" class="vd-btn vd-btn--sm vd-btn--outline">Jump to Components</a>
        </div>
        <p class="footnote">
          Markdown documents in <code>foundations/</code>, <code>components/</code>, and
          <code>conventions/</code> alongside <code>tokens/vd3.tokens.json</code> are the single
          authoritative source of truth. Project codename: <strong>HydroCORE</strong>
          (<em>Project HydroCORE</em> — <em>vanduo</em> means water in Lithuanian).
        </p>
      </section>

      ${sectionsHtml
        .map(
          (sec) => `
      <section id="${escHtml(sec.id)}" class="doc-section">
        <h2><span class="n">${escHtml(sec.num)}</span> ${sec.title} <span class="vd-badge vd-badge--info">${escHtml(sec.badge)}</span></h2>
        <div class="md-doc">
          ${renderMarkdown(sec.md, 2, `${sec.title.replace(/&amp;/g, '&')} specification table`)}
        </div>
      </section>`,
        )
        .join('\n')}

      ${foundationMatrixHtml}
      ${componentsSectionHtml}
      ${conventionsSectionHtml}
      ${patternsSectionHtml}
    </main>
  </div>

  <footer>
    <div class="inner">
      <p>
        <strong>vd3-ui-core</strong> · Specification v1.1.0-draft · Markdown specs and W3C DTCG
        <code>tokens/vd3.tokens.json</code> are the normative source of truth. Library conformance:
        <code>"implements": "vd3-ui-core@^1.0"</code>.
      </p>
    </div>
  </footer>
`;

let builtHtml = fs.readFileSync(distHtmlPath, 'utf8');
const emptyAppRegex = /<div\s+id=["']app["']\s*>\s*<\/div>/;
if (!emptyAppRegex.test(builtHtml)) {
  console.error('[build-ssg] ERROR: Could not locate empty <div id="app"></div> placeholder in site/dist/index.html.');
  process.exit(1);
}

builtHtml = builtHtml.replace(emptyAppRegex, `<div id="app">${ssgBody}\n</div>`);
fs.writeFileSync(distHtmlPath, builtHtml, 'utf8');

console.log(`[build-ssg] Pre-rendered SSG HTML injected into site/dist/index.html (${builtHtml.length} chars)`);
console.log('[build-ssg] Synchronized authoritative W3C DTCG tokens to site/public/tokens/ and site/dist/tokens/');
