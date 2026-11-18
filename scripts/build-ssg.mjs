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
  ['components', 'New in 1.0', 'A / B / C', '36 zero-framework CSS modules (layout engine + 35 primitives), 39 per-slug specs, @layer vd3.components'],
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
        <button id="demo-dialog-trigger" type="button" class="vd-btn vd-btn--outline vd-btn--sm" command="show-modal" commandfor="demo-modal-dialog" aria-haspopup="dialog" aria-controls="demo-modal-dialog">Open Live Modal</button>
        <span class="specimen-meta">Native &lt;dialog&gt;.showModal(), Lucas L₁₃ 521px max-width, Esc dismissal.</span>
      </div>
      <dialog id="demo-modal-dialog" class="vd-dialog" aria-labelledby="demo-dlg-title">
        <div class="vd-dialog-header">
          <h2 id="demo-dlg-title" class="vd-dialog-title">VD3 Native Modal Contract</h2>
          <button type="button" class="vd-btn vd-btn--ghost vd-btn--sm vd-dialog-close" data-dialog-close aria-label="Close dialog">×</button>
        </div>
        <div class="vd-dialog-body"><p>Uses native &lt;dialog&gt;.showModal(), Lucas L₁₃ 521px max-width, Esc dismissal, and focus restoration.</p></div>
        <div class="vd-dialog-footer">
          <button type="button" class="vd-btn vd-btn--outline vd-btn--sm" data-dialog-close>Cancel</button>
          <button type="button" class="vd-btn vd-btn--primary vd-btn--sm" data-dialog-close>Acknowledge</button>
        </div>
      </dialog>`,
    code: '<dialog class="vd-dialog" aria-labelledby="dlg-title"><div class="vd-dialog-header"><h2 id="dlg-title" class="vd-dialog-title">Confirm</h2><button type="button" class="vd-dialog-close" aria-label="Close">×</button></div><div class="vd-dialog-body"><p>Lucas L13 modal contract.</p></div></dialog>',
  },
  {
    id: 'card',
    title: 'Card (.vd-card)',
    basis: 'A',
    tokens: 'math.phi radius.fib-8 space.fib-21 shadow.2',
    preview: `<div class="vd-card vd-card--elevated"><div class="vd-card-body">Golden proportion card surface bound to Fibonacci shadow level 2.</div></div>`,
    code: '<article class="vd-card vd-card--elevated"><div class="vd-card-body">Golden proportion card surface bound to shadow.2.</div></article>',
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
    code: '<nav class="vd-navbar" aria-label="Secondary"><div class="vd-navbar-container"><a href="#overview" class="vd-navbar-brand">vd3</a><div class="vd-navbar-menu"><a class="vd-nav-link" href="#foundations" aria-current="page">Foundations</a></div></div></nav>',
  },
  {
    id: 'accordion',
    title: 'Accordion (.vd-accordion)',
    basis: 'A',
    tokens: 'space.fib-13 space.fib-21 radius.fib-8 motion.144',
    preview: `<details class="vd-accordion"><summary class="vd-accordion-summary">Native disclosure contract (144ms)</summary><div class="vd-accordion-content">Zero JS required for Enter/Space disclosure toggling.</div></details>`,
    code: '<details class="vd-accordion"><summary class="vd-accordion-summary">Spec</summary><div class="vd-accordion-content">Disclosure body.</div></details>',
  },
  {
    id: 'table',
    title: 'Data Table (.vd-table)',
    basis: 'A',
    tokens: 'space.fib-8 space.fib-13 line.hair color.role.layer',
    preview: `<div class="vd-table-container" tabindex="0" role="region" aria-label="Sample metric table"><table class="vd-table vd-table--compact"><thead><tr><th scope="col">Step</th><th scope="col">px</th></tr></thead><tbody><tr><th scope="row">F₈</th><td>21px</td></tr></tbody></table></div>`,
    code: '<div class="vd-table-container" tabindex="0" role="region" aria-label="Metric table"><table class="vd-table"><thead><tr><th scope="col">Step</th><th scope="col">Value</th></tr></thead><tbody><tr><th scope="row">F8</th><td>21px</td></tr></tbody></table></div>',
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
    code: '<button type="button" role="switch" aria-checked="false" class="vd-switch" aria-label="Enable option"><span class="vd-switch-thumb"></span></button>',
  },
  {
    id: 'alert',
    title: 'Alert (.vd-alert)',
    basis: 'B',
    tokens: 'space.fib-13 space.fib-21 line.regular color.role.critical color.role.focus radius.fib-8',
    preview: `<div class="vd-alert vd-alert--warning" role="alert"><span class="vd-alert-icon" aria-hidden="true">!</span><div class="vd-alert-content"><p class="vd-alert-title">Registered exception C-02</p><p class="vd-alert-body">Glass blur soft-caps at 20px — the Convergence Zone is documented in foundations/glass.md.</p></div><button type="button" class="vd-alert-close" aria-label="Dismiss alert">×</button></div>`,
    code: '<div class="vd-alert vd-alert--critical" role="alert"><span class="vd-alert-icon" aria-hidden="true">!</span><div class="vd-alert-content"><p class="vd-alert-title">Critical Notice</p><p class="vd-alert-body">Semantic role token check failed.</p></div></div>',
  },
  {
    id: 'tabs',
    title: 'Tabs (.vd-tabs / .vd-tab)',
    basis: 'B',
    tokens: 'space.fib-8 space.fib-13 line.hair line.thin color.role.focus motion.89',
    preview: `<div class="vd-tabs" role="tablist" aria-label="Specimen tabs"><button type="button" class="vd-tab" role="tab" id="ssg-tab-a" aria-selected="true" aria-controls="ssg-panel-a">Tokens</button><button type="button" class="vd-tab" role="tab" id="ssg-tab-b" aria-selected="false" aria-controls="ssg-panel-b" tabindex="-1">Components</button></div>
      <div class="vd-tab-panel" role="tabpanel" id="ssg-panel-a" aria-labelledby="ssg-tab-a">DTCG 2025.10 registry — 150+ leaf tokens, all basis-classed.</div>
      <div class="vd-tab-panel" role="tabpanel" id="ssg-panel-b" aria-labelledby="ssg-tab-b" hidden>36 zero-framework CSS modules in @layer vd3.components and @layer vd3.layout.</div>`,
    code: '<div class="vd-tabs" role="tablist" aria-label="Views"><button type="button" class="vd-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Tokens</button><button type="button" class="vd-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">CSS</button></div><div class="vd-tab-panel" role="tabpanel" id="p1" aria-labelledby="t1">DTCG content</div>',
  },
  {
    id: "drawer",
    title: "Drawer (.vd-drawer)",
    basis: "B",
    tokens: "z.modal z.modal-backdrop container.sm space.fib-21 motion.slow",
    preview: `<button type="button" class="vd-btn vd-btn--outline vd-btn--sm" data-drawer-open="ssg-demo-drawer" aria-haspopup="dialog" aria-controls="ssg-demo-drawer">Open drawer</button> <span class="specimen-meta">Fixed panel at z.modal, Esc + backdrop close, slide 377ms.</span>`,
    code: '<aside class="vd-drawer vd-drawer--end" role="dialog" aria-modal="true" aria-labelledby="drw-title" data-open="true"><div class="vd-drawer-header"><h2 id="drw-title" class="vd-drawer-title">Details</h2><button type="button" class="vd-drawer-close" aria-label="Close">×</button></div><div class="vd-drawer-body"><p>Sliding panel.</p></div></aside>',
  },
  {
    id: "tooltip",
    title: "Tooltip (.vd-tooltip)",
    basis: "A",
    tokens: "z.tooltip type.size.xs space.fib-5 radius.fib-3 motion.89",
    preview: `<span class="vd-tooltip vd-tooltip--top" role="tooltip">φ = 1.618…</span>`,
    code: '<span class="vd-tooltip" role="tooltip">Hint</span>',
  },
  {
    id: "popover",
    title: "Popover (.vd-popover)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.233",
    preview: `<div class="vd-popover"><div class="vd-popover-header">Popover title</div><div class="vd-popover-body">Anchored floating content with arrow.</div></div>`,
    code: '<div class="vd-popover" data-placement="bottom" popover="auto"><div class="vd-popover-header">Details</div><div class="vd-popover-body">Anchored disclosure panel.</div></div>',
  },
  {
    id: "menu",
    title: "Menu (.vd-menu)",
    basis: "B",
    tokens: "z.dropdown shadow.4 radius.fib-8 space.fib-8 color.role.layer-hover",
    preview: `<div class="vd-menu" role="menu"><div class="vd-menu-item" role="menuitem">Rename</div><div class="vd-menu-item" role="menuitem">Duplicate</div><div class="vd-menu-divider"></div><div class="vd-menu-item vd-menu-item--danger" role="menuitem">Delete</div></div>`,
    code: '<div class="vd-menu" role="menu"><button type="button" class="vd-menu-item" role="menuitem">Rename</button><button type="button" class="vd-menu-item" role="menuitem">Duplicate</button></div>',
  },
  {
    id: "context-menu",
    title: "Context Menu (.vd-context-menu)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-8",
    preview: `<div class="vd-context-menu" role="menu"><div class="vd-context-menu-item" role="menuitem">Open</div><div class="vd-context-menu-item vd-context-menu-item--danger" role="menuitem">Remove</div></div>`,
    code: '<div class="vd-context-menu" role="menu"><button type="button" class="vd-context-menu-item" role="menuitem">Inspect</button><button type="button" class="vd-context-menu-item vd-context-menu-item--danger" role="menuitem">Remove</button></div>',
  },
  {
    id: "menubar",
    title: "Menubar (.vd-menubar)",
    basis: "B",
    tokens: "space.fib-8 line.hair color.role.layer-hover",
    preview: `<div class="vd-menubar"><span class="vd-menubar-item" aria-haspopup="true" aria-expanded="false">File</span><span class="vd-menubar-item">Edit</span><span class="vd-menubar-item">View</span></div>`,
    code: '<div class="vd-menubar" role="menubar" aria-label="Editor"><button type="button" class="vd-menubar-item" role="menuitem" aria-haspopup="true" aria-expanded="false">File</button><button type="button" class="vd-menubar-item" role="menuitem">Edit</button></div>',
  },
  {
    id: "breadcrumb",
    title: "Breadcrumb (.vd-breadcrumb)",
    basis: "B",
    tokens: "space.fib-5 type.size.sm color.role.interactive motion.89",
    preview: `<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb"><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#foundations">Foundations</a></li><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#components" aria-current="page">Color</a></li></ol></nav>`,
    code: '<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb"><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#foundations">Foundations</a></li><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#components" aria-current="page">Color</a></li></ol></nav>',
  },
  {
    id: "pagination",
    title: "Pagination (.vd-pagination)",
    basis: "B",
    tokens: "space.fib-8 line.hair radius.fib-5 type.size.sm color.role.focus",
    preview: `<nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list"><li class="vd-pagination-item"><a class="vd-pagination-link vd-pagination-link--prev" href="#components" aria-label="Previous page">‹</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components" aria-current="page">1</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components">2</a></li></ul></nav>`,
    code: '<nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list"><li class="vd-pagination-item"><a class="vd-pagination-link" href="#page-1" aria-current="page">1</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#page-2">2</a></li></ul></nav>',
  },
  {
    id: "avatar",
    title: "Avatar (.vd-avatar)",
    basis: "A",
    tokens: "space.fib-21 space.fib-34 radius.full line.thin color.role.layer",
    preview: `<span class="vd-avatar vd-avatar--md vd-avatar--round"><span class="vd-avatar-initials">VD</span><span class="vd-avatar-status vd-avatar-status--online"></span></span>`,
    code: '<span class="vd-avatar vd-avatar--round"><span class="vd-avatar-initials">VD</span></span>',
  },
  {
    id: "progress",
    title: "Progress (.vd-progress)",
    basis: "A",
    tokens: "space.fib-5 radius.full color.role.focus motion.233",
    preview: `<div class="vd-progress" role="progressbar" aria-valuenow="62" aria-label="Upload progress"><div class="vd-progress-bar" style="--_vd-progress-value: 62%"></div></div>`,
    code: '<div class="vd-progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><div class="vd-progress-bar" style="--_vd-progress-value: 62%"></div></div>',
  },
  {
    id: "spinner",
    title: "Spinner (.vd-spinner)",
    basis: "A",
    tokens: "space.fib-21 radius.full line.hair color.role.focus motion.610 easing.linear",
    preview: `<span class="vd-spinner vd-spinner--md" role="status" aria-label="Loading"></span>`,
    code: '<span class="vd-spinner" role="status" aria-label="Loading"></span>',
  },
  {
    id: "skeleton",
    title: "Skeleton (.vd-skeleton)",
    basis: "A",
    tokens: "color.role.layer-hover radius.fib-5 motion.377 easing.in-out",
    preview: `<div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 82%"></div><div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 58%"></div>`,
    code: '<div class="vd-skeleton vd-skeleton--text"></div>',
  },
  {
    id: "slider",
    title: "Slider (.vd-slider)",
    basis: "A",
    tokens: "space.fib-3 space.fib-21 radius.full line.thin color.role.focus motion.89",
    preview: `<input type="range" class="vd-slider" min="0" max="100" value="40" aria-label="Volume">`,
    code: '<input type="range" class="vd-slider" min="0" max="100" aria-label="Volume">',
  },
  {
    id: "datepicker",
    title: "Date Picker (.vd-datepicker)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 color.role.focus",
    preview: `<div class="vd-datepicker"><div class="vd-datepicker-header"><span class="vd-datepicker-title">November 2026</span></div><div class="vd-datepicker-grid"><span class="vd-datepicker-day">15</span><span class="vd-datepicker-day" aria-selected="true">16</span><span class="vd-datepicker-day">17</span></div></div>`,
    code: '<div class="vd-datepicker" role="dialog" aria-label="Choose date"><div class="vd-datepicker-header"><span class="vd-datepicker-title">November 2026</span></div><div class="vd-datepicker-grid" role="grid"><button type="button" class="vd-datepicker-day" aria-selected="true">16</button><button type="button" class="vd-datepicker-day">17</button></div></div>',
  },
  {
    id: "timepicker",
    title: "Time Picker (.vd-timepicker)",
    basis: "B",
    tokens: "z.popover space.fib-8 type.size.sm color.role.focus",
    preview: `<div class="vd-timepicker"><div class="vd-timepicker-item" aria-selected="true">09:00</div><div class="vd-timepicker-item">09:30</div><div class="vd-timepicker-item">10:00</div></div>`,
    code: '<div class="vd-timepicker"><div class="vd-timepicker-item" aria-selected="true">09:00</div></div>',
  },
  {
    id: "upload",
    title: "File Upload (.vd-upload)",
    basis: "B",
    tokens: "line.thin radius.fib-8 space.fib-21 color.role.border icon.size.lg",
    preview: `<label class="vd-upload"><span class="vd-upload-icon" aria-hidden="true">↑</span><span class="vd-upload-text">Drop files here</span><span class="vd-upload-hint">or click to browse</span><input class="vd-upload-input" type="file" aria-label="Upload files"></label>`,
    code: '<label class="vd-upload"><input class="vd-upload-input" type="file" aria-label="Upload files"></label>',
  },
  {
    id: "carousel",
    title: "Carousel (.vd-carousel)",
    basis: "B",
    tokens: "space.fib-34 radius.fib-8 motion.377 color.role.focus focus.ring.width",
    preview: `<div class="vd-carousel"><div class="vd-carousel-track" style="--_vd-carousel-index: 0"><div class="vd-carousel-slide">Slide 1</div><div class="vd-carousel-slide">Slide 2</div></div><button type="button" class="vd-carousel-prev" aria-label="Previous slide">‹</button><button type="button" class="vd-carousel-next" aria-label="Next slide">›</button></div>`,
    code: '<div class="vd-carousel" role="region" aria-roledescription="carousel" aria-label="Slides"><div class="vd-carousel-track" style="--_vd-carousel-index: 0"><div class="vd-carousel-slide">Slide 1</div><div class="vd-carousel-slide">Slide 2</div></div><button type="button" class="vd-carousel-prev" aria-label="Previous slide">‹</button><button type="button" class="vd-carousel-next" aria-label="Next slide">›</button></div>',
  },
  {
    id: "toolbar",
    title: "Toolbar (.vd-toolbar)",
    basis: "B",
    tokens: "space.fib-8 line.hair radius.fib-8 color.role.layer",
    preview: `<div class="vd-toolbar"><div class="vd-toolbar-group"><button type="button" class="vd-toolbar-button">B</button><button type="button" class="vd-toolbar-button">I</button></div><span class="vd-toolbar-separator"></span><button type="button" class="vd-toolbar-button">Link</button></div>`,
    code: '<div class="vd-toolbar" role="toolbar" aria-label="Formatting"><div class="vd-toolbar-group"><button type="button" class="vd-toolbar-button" aria-pressed="false">Bold</button><button type="button" class="vd-toolbar-button" aria-pressed="false">Italic</button></div><span class="vd-toolbar-separator" role="separator"></span><button type="button" class="vd-toolbar-button">Link</button></div>',
  },
  {
    id: "segmented",
    title: "Segmented (.vd-segmented)",
    basis: "B",
    tokens: "radius.full line.hair space.fib-1 color.role.layer shadow.1",
    preview: `<div class="vd-segmented" role="radiogroup" aria-label="View"><button type="button" class="vd-segmented-item" aria-checked="true">Day</button><button type="button" class="vd-segmented-item" aria-checked="false">Week</button><button type="button" class="vd-segmented-item" aria-checked="false">Month</button></div>`,
    code: '<div class="vd-segmented" role="radiogroup" aria-label="View"><button type="button" class="vd-segmented-item" aria-checked="true">Day</button></div>',
  },
  {
    id: "hover-card",
    title: "Hover Card (.vd-hover-card)",
    basis: "B",
    tokens: "z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.144",
    preview: `<div class="vd-hover-card"><p class="vd-hover-card-title">Hover card</p><p class="vd-hover-card-body">Rich preview on hover or keyboard focus.</p></div>`,
    code: '<div class="vd-hover-card"><p class="vd-hover-card-title">Token Reference</p><p class="vd-hover-card-body">Fibonacci F8 spacing preview.</p></div>',
  },
  {
    id: "tour",
    title: "Tour (.vd-tour)",
    basis: "B",
    tokens: "z.popover shadow.5 radius.fib-8 space.fib-21 motion.233",
    preview: `<div class="vd-tour"><p class="vd-tour-title">Step 2 of 5</p><p class="vd-tour-body">This is where the tokens live.</p><div class="vd-tour-progress"></div><div class="vd-tour-footer"><span class="vd-tour-counter">2 / 5</span><div class="vd-tour-actions"><button type="button" class="vd-tour-btn">Back</button><button type="button" class="vd-tour-btn vd-tour-btn--primary">Next</button></div></div></div>`,
    code: '<div class="vd-tour" role="dialog" aria-labelledby="tour-title"><h2 id="tour-title" class="vd-tour-title">Step 1 of 3</h2><p class="vd-tour-body">Explore normative DTCG tokens.</p><div class="vd-tour-footer"><span class="vd-tour-counter">1 / 3</span><div class="vd-tour-actions"><button type="button" class="vd-tour-btn vd-tour-btn--primary">Next</button></div></div></div>',
  },
  {
    id: 'icon',
    title: 'Icon (.vd-icon)',
    basis: 'A',
    tokens: 'icon.size.md icon.size.lg icon.stroke.outline color.role.text-primary',
    preview: `<div class="vd-icon-pair"><span class="vd-icon vd-icon--sm vd-icon--secondary" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span><span class="vd-icon vd-icon--md vd-icon--primary" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><span class="vd-icon vd-icon--lg vd-icon--accent" aria-hidden="true"><svg viewBox="0 0 24 24"><polygon points="12 3 21 19 3 19"/></svg></span><span class="specimen-meta">Fibonacci F₇–F₁₀ (13/21/34/55px) · φ stroke 1.618</span></div>`,
    code: '<span class="vd-icon-pair"><span class="vd-icon vd-icon--md vd-icon--primary" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span><span>Golden Ratio</span></span>',
  },
  {
    id: 'layout',
    title: 'Layout Engine (.vd-split-golden)',
    basis: 'B',
    tokens: 'container.lg space.fib-21 math.phi math.inv-phi',
    preview: `<span>61.8% primary measure paired with 38.2% secondary rail inside 987px container.</span>`,
    code: '<div class="vd-container-lg vd-split-golden"><section class="vd-split-major">61.8% Primary</section><aside class="vd-split-minor">38.2% Secondary</aside></div>',
  },
];

const spacingSummaryMd = `
One normative Fibonacci ladder governs padding, margin, and layout gaps. Adjacent steps converge toward φ = 1.618; sub-13px adjustments use Registered Exception C-01.

| Step | Token | rem | px | Basis |
| --- | --- | --- | --- | --- |
| F₂ | \`space.fib-1\` | 0.125rem | 2px | C-01 |
| F₃ | \`space.fib-2\` | 0.25rem | 4px | C-01 |
| F₄ | \`space.fib-3\` | 0.375rem | 6px | C-01 |
| F₅ | \`space.fib-5\` | 0.5rem | 8px | C-01 |
| F₆ | \`space.fib-8\` | 0.75rem | 12px | C-01 |
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

const componentSpecSlugs = ["layout", "button", "dialog", "card", "input", "select", "checkbox", "radio", "badge", "navbar", "accordion", "table", "code", "toast", "switch", "alert", "tabs", "drawer", "tooltip", "popover", "menu", "context-menu", "menubar", "breadcrumb", "pagination", "avatar", "progress", "spinner", "skeleton", "slider", "datepicker", "timepicker", "upload", "carousel", "toolbar", "segmented", "hover-card", "tour", "icon"];

const stripSearchMd = (md) =>
  String(md || '')
    .replace(/^---[\s\S]*?---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`|_\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const patternSlugs = ['empty-states', 'auth-flows', 'app-shell', 'onboarding', 'disabled-read-only'];

const ssgSearchDocs = [
  ...chapters.map((ch) => {
    const sec = sectionsHtml.find((s) => s.id === ch.id);
    return {
      id: ch.id,
      title: `${ch.num} ${ch.label}`,
      category: 'Foundations',
      href: `#${ch.id}`,
      content: sec ? stripSearchMd(sec.md).slice(0, 1000) : `${ch.label} chapter`,
    };
  }),
  ...specimens.map((s) => ({
    id: `specimen-${s.id}`,
    title: s.title,
    category: 'Specimen',
    href: `#specimen-${s.id}`,
    content: `${s.tokens} ${s.code}`.slice(0, 1000),
  })),
  {
    id: 'spec-index-heading',
    title: 'Component Specification Index',
    category: 'Spec',
    href: '#spec-index-heading',
    content: stripSearchMd(readSpec('components/SPEC.md')).slice(0, 1000),
  },
  ...componentSpecSlugs.map((slug) => ({
    id: `spec-${slug}`,
    title: `${slug} specification`,
    category: 'Spec',
    href: `#spec-${slug}`,
    content: stripSearchMd(readSpec(`components/${slug}/spec.md`)).slice(0, 1000),
  })),
  {
    id: 'convention-naming',
    title: 'Public & Token Naming Conventions',
    category: 'Conventions',
    href: '#convention-naming',
    content: stripSearchMd(readSpec('conventions/naming.md')).slice(0, 1000),
  },
  {
    id: 'convention-mappings',
    title: 'Cross-System Token Mappings',
    category: 'Conventions',
    href: '#convention-mappings',
    content: stripSearchMd(readSpec('conventions/mappings.md')).slice(0, 1000),
  },
  {
    id: 'convention-content',
    title: 'Editorial Tone & Content Strings',
    category: 'Conventions',
    href: '#convention-content',
    content: stripSearchMd(readSpec('conventions/content.md')).slice(0, 1000),
  },
  {
    id: 'patterns-overview',
    title: 'Patterns — Guidance Over Components',
    category: 'Patterns',
    href: '#patterns',
    content: stripSearchMd(readSpec('patterns/PATTERNS.md')).slice(0, 1000),
  },
  ...patternSlugs.map((pat) => ({
    id: `pattern-${pat}`,
    title: `${pat} pattern`,
    category: 'Patterns',
    href: `#pattern-${pat}`,
    content: stripSearchMd(readSpec(`patterns/${pat}.md`)).slice(0, 1000),
  })),
];

const componentsSectionHtml = `
<section id="components" class="doc-section">
  <h2><span class="n">16</span> Components — 35 Primitives + Layout Engine <span class="vd-badge vd-badge--info">Zero-Framework CSS</span></h2>
  <p class="lead">
    Every core stylesheet resides inside <code>@layer vd3.components</code> or <code>@layer vd3.layout</code>,
    binds strictly to W3C DTCG tokens from <code>tokens/vd3.tokens.json</code>, and exposes machine-readable
    <code>data-vd-*</code> contracts. Every module has a per-slug behavioral spec below.
  </p>
  <h3 id="spec-index-heading">Component Specification Index</h3>
  <div class="md-doc">
    ${renderMarkdown(readSpec('components/SPEC.md'), 3, 'Component specification index')}
  </div>
  <div class="specimen-grid">
    ${specimens
      .map(
        (s) => `
    <article id="specimen-${escHtml(s.id)}" class="specimen-card" data-vd-component="${escHtml(s.id)}" data-vd-basis-class="${escHtml(s.basis)}" data-vd-tokens="${escHtml(s.tokens)}">
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
  <h3 id="per-slug-specs">Per-Slug Component Specifications (${componentSpecSlugs.length} specs, W3C APG where applicable)</h3>
  <div class="spec-entries">
    ${componentSpecSlugs
      .map(
        (slug) => `<article id="spec-${escHtml(slug)}" class="spec-entry"><h4 class="spec-entry-title">${escHtml(slug)}</h4>
  <div class="md-doc">${renderMarkdown(readSpec('components/' + slug + '/spec.md'), 4, slug + ' specification')}</div></article>`
      )
      .join('\n    ')}
  </div>
</section>`;

const conventionsSectionHtml = `
<section id="conventions" class="doc-section">
  <h2><span class="n">17</span> Conventions — Naming, Mappings &amp; Content <span class="vd-badge vd-badge--info">Normative</span></h2>
  <article id="convention-naming" class="convention-entry">
    <h3>Public &amp; Token Naming</h3>
    <div class="md-doc">${renderMarkdown(readSpec('conventions/naming.md'), 3, 'Naming convention table')}</div>
  </article>
  <article id="convention-mappings" class="convention-entry">
    <h3>Cross-System Token Mappings</h3>
    <div class="md-doc">${renderMarkdown(readSpec('conventions/mappings.md'), 3, 'Cross-system mapping table')}</div>
  </article>
  <article id="convention-content" class="convention-entry">
    <h3>Editorial Tone &amp; Content Strings</h3>
    <div class="md-doc">${renderMarkdown(readSpec('conventions/content.md'), 3, 'Content conventions table')}</div>
  </article>
</section>`;

const patternsSectionHtml = `
<section id="patterns" class="doc-section">
  <h2><span class="n">18</span> Patterns — Guidance Over Components <span class="vd-badge vd-badge--info">Guidance</span></h2>
  <div class="md-doc">${renderMarkdown(readSpec('patterns/PATTERNS.md'), 2, 'Patterns index')}</div>
  ${patternSlugs
    .map(
      (pat) => `<article id="pattern-${escHtml(pat)}" class="pattern-entry"><h3>${escHtml(pat)}</h3>
  <div class="md-doc">${renderMarkdown(readSpec('patterns/' + pat + '.md'), 3, pat + ' pattern')}</div></article>`
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
            <button type="button" class="vd-btn vd-btn--sm vd-btn--outline font-cycle-btn" title="Typeface: Open Sans — activate to change" aria-label="Cycle UI typeface"><span class="font-cycle-aa" style="font-family: &quot;Open Sans&quot;, -apple-system, BlinkMacSystemFont, sans-serif">Aa</span></button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="doc-layout">
    <aside class="doc-toc" aria-label="Chapter Table of Contents">
      <div class="vd-doc-search doc-toc-search" role="search" aria-label="Specification search">
        <div class="vd-doc-search-input-wrapper">
          <span class="vd-doc-search-icon ph ph-magnifying-glass" aria-hidden="true"></span>
          <input id="doc-search-input" type="search" class="vd-doc-search-input" placeholder="Search standard &amp; specs…" aria-label="Search VD3 specification (Cmd+K or Ctrl+K)" role="combobox" autocomplete="off" aria-expanded="false" aria-autocomplete="list" aria-controls="doc-search-results" />
          <kbd class="vd-doc-search-shortcut" aria-hidden="true">⌘K</kbd>
        </div>
        <div class="vd-doc-search-results">
          <ul id="doc-search-results" class="vd-doc-search-results-list" role="listbox" aria-label="Specification search results" hidden></ul>
        </div>
      </div>
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
          <span><strong>36</strong> zero-framework core CSS modules</span>
          <span><strong>0</strong> runtime deps — any framework</span>
          <span><strong>W3C APG</strong>-normative keyboard &amp; ARIA</span>
          <span><strong>W3C DTCG 2025.10</strong> token registry</span>
        </div>
        <div class="hero-links">
          <a href="/tokens/vd3.tokens.json" class="vd-btn vd-btn--sm vd-btn--primary">DTCG Tokens JSON</a>
          <a href="/tokens/schema.json" class="vd-btn vd-btn--sm vd-btn--outline">Token Schema JSON</a>
          <a href="/tokens/figma.manifest.json" class="vd-btn vd-btn--sm vd-btn--outline">Figma Manifest JSON</a>
          <a href="https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh" target="_blank" rel="noopener noreferrer" class="vd-btn vd-btn--sm vd-btn--outline">Figma UI Kit<span class="vd-sr-only"> (opens in new tab)</span></a>
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
  <aside id="ssg-demo-drawer" class="vd-drawer vd-drawer--end" role="dialog" aria-modal="true" aria-labelledby="ssg-drawer-title" hidden>
    <div class="vd-drawer-header">
      <h2 id="ssg-drawer-title" class="vd-drawer-title">VD3 Dual-Mode Drawer</h2>
      <button type="button" class="vd-drawer-close vd-btn vd-btn--ghost vd-btn--sm" data-drawer-close="ssg-demo-drawer" aria-label="Close drawer">×</button>
    </div>
    <div class="vd-drawer-body">
      <p>Sliding modal drawer at <code>z.modal</code> (1050) with Esc dismissal and focus restoration.</p>
    </div>
  </aside>
`;

const ssgFallbackScript = `<script id="vd3-ssg-fallback">
(function () {
  var docs = ${JSON.stringify(ssgSearchDocs).replace(/</g, '\\u003c')};
  function activeSsg() { return document.documentElement.dataset.vd3Hydrated !== 'true'; }
  document.addEventListener('click', function (e) {
    if (!activeSsg()) return;
    var t = e.target && e.target.closest ? e.target : null;
    if (!t) return;
    var dlgTrigger = t.closest('#demo-dialog-trigger');
    if (dlgTrigger) {
      var d = document.getElementById('demo-modal-dialog');
      if (d && typeof d.showModal === 'function' && !d.open) d.showModal();
      return;
    }
    if (t.closest('[data-dialog-close]')) {
      var openDlg = t.closest('dialog');
      if (openDlg && typeof openDlg.close === 'function') openDlg.close();
      return;
    }
    var drwOpen = t.closest('[data-drawer-open]');
    if (drwOpen) {
      var drw = document.getElementById(drwOpen.getAttribute('data-drawer-open'));
      if (drw) { drw.hidden = false; drw.setAttribute('data-open', 'true'); }
      return;
    }
    var drwClose = t.closest('[data-drawer-close]');
    if (drwClose) {
      var drw2 = document.getElementById(drwClose.getAttribute('data-drawer-close'));
      if (drw2) { drw2.removeAttribute('data-open'); drw2.hidden = true; }
      return;
    }
    var sw = t.closest('[role="switch"]');
    if (sw) {
      sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true'));
      return;
    }
    var tab = t.closest('[role="tab"]');
    if (tab && tab.parentElement) {
      var tabs = tab.parentElement.querySelectorAll('[role="tab"]');
      for (var i = 0; i < tabs.length; i++) {
        var sel = tabs[i] === tab;
        tabs[i].setAttribute('aria-selected', String(sel));
        tabs[i].tabIndex = sel ? 0 : -1;
        var pid = tabs[i].getAttribute('aria-controls');
        var panel = pid ? document.getElementById(pid) : null;
        if (panel) panel.hidden = !sel;
      }
      return;
    }
    var cp = t.closest('.vd-code-copy');
    if (cp && cp.parentElement) {
      var pre = cp.parentElement.querySelector('pre code');
      if (pre && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pre.textContent || '').catch(function () {});
        cp.textContent = 'Copied ✓';
      }
      return;
    }
    var fc = t.closest('.font-cycle-btn');
    if (fc) {
      var fonts = ['open-sans', 'ubuntu', 'inter', 'plus-jakarta', 'system'];
      var cur = document.documentElement.getAttribute('data-font') || 'open-sans';
      var next = fonts[(fonts.indexOf(cur) + 1) % fonts.length];
      document.documentElement.setAttribute('data-font', next);
    }
  });
  document.addEventListener('input', function (e) {
    if (!activeSsg()) return;
    var input = e.target;
    if (!input || input.id !== 'doc-search-input') return;
    var list = document.getElementById('doc-search-results');
    var box = list ? list.parentElement : null;
    if (!list || !box) return;
    var q = (input.value || '').trim().toLowerCase();
    if (!q) {
      box.classList.remove('is-open');
      list.hidden = true;
      list.innerHTML = '';
      input.setAttribute('aria-expanded', 'false');
      return;
    }
    var matches = docs.filter(function (d) {
      return d.title.toLowerCase().indexOf(q) !== -1 || d.content.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 10);
    list.innerHTML = '';
    for (var i = 0; i < matches.length; i++) {
      var li = document.createElement('li');
      li.setAttribute('role', 'none');
      var a = document.createElement('a');
      a.href = matches[i].href;
      a.className = 'vd-doc-search-result';
      a.setAttribute('role', 'option');
      a.textContent = matches[i].title + ' (' + matches[i].category + ')';
      li.appendChild(a);
      list.appendChild(li);
    }
    box.classList.add('is-open');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  });
  document.addEventListener('keydown', function (e) {
    if (!activeSsg()) return;
    if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k') {
      var inp = document.getElementById('doc-search-input');
      if (inp) { e.preventDefault(); inp.focus(); }
    }
  });
})();
</script>`;

let builtHtml = fs.readFileSync(distHtmlPath, 'utf8');
const emptyAppRegex = /<div\s+id=["']app["']\s*>\s*<\/div>/;
if (!emptyAppRegex.test(builtHtml)) {
  console.error('[build-ssg] ERROR: Could not locate empty <div id="app"></div> placeholder in site/dist/index.html.');
  process.exit(1);
}

builtHtml = builtHtml
  .replace(emptyAppRegex, `<div id="app">${ssgBody}\n</div>`)
  .replace('</body>', `${ssgFallbackScript}\n</body>`);
fs.writeFileSync(distHtmlPath, builtHtml, 'utf8');

console.log(`[build-ssg] Pre-rendered SSG HTML injected into site/dist/index.html (${builtHtml.length} chars)`);
console.log('[build-ssg] Synchronized authoritative W3C DTCG tokens to site/public/tokens/ and site/dist/tokens/');
