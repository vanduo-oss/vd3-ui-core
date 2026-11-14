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

copyIfExists(tokensJsonSrc, path.join(siteDir, 'public', 'tokens', 'vd3.tokens.json'));
copyIfExists(tokensJsonSrc, path.join(distDir, 'tokens', 'vd3.tokens.json'));
copyIfExists(tokensCssSrc, path.join(siteDir, 'public', 'tokens', 'tokens.css'));
copyIfExists(tokensCssSrc, path.join(distDir, 'tokens', 'tokens.css'));
copyIfExists(schemaJsonSrc, path.join(siteDir, 'public', 'tokens', 'schema.json'));
copyIfExists(schemaJsonSrc, path.join(distDir, 'tokens', 'schema.json'));

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
  { id: 'foundations', num: '12', label: 'Matrix' },
  { id: 'components', num: '13', label: 'Components' },
  { id: 'conventions', num: '14', label: 'Conventions' },
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
  ['components', 'New in 1.0', 'A / B / C', '11 zero-framework semantic HTML + @layer vd3.components stylesheets'],
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
];

const foundationMatrixHtml = `
<section id="foundations" class="doc-section">
  <h2><span class="n">12</span> Foundation Coverage Matrix <span class="vd-badge vd-badge--info">DTCG 2025.10</span></h2>
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

const componentsSectionHtml = `
<section id="components" class="doc-section">
  <h2><span class="n">13</span> Components — 11 Normative UI Primitives <span class="vd-badge vd-badge--info">Zero-Framework CSS</span></h2>
  <p class="lead">
    Every core stylesheet resides inside <code>@layer vd3.components</code> or <code>@layer vd3.layout</code>,
    binds strictly to W3C DTCG tokens from <code>tokens/vd3.tokens.json</code>, and exposes machine-readable
    <code>data-vd-*</code> contracts.
  </p>
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
  <h3>Dialog Behavioral Specification (W3C APG Modal Pattern)</h3>
  <div class="md-doc">
    ${renderMarkdown(readSpec('components/dialog/spec.md'), 3, 'Dialog specification table')}
  </div>
</section>`;

const conventionsSectionHtml = `
<section id="conventions" class="doc-section">
  <h2><span class="n">14</span> Conventions — Naming, Mappings &amp; Content <span class="vd-badge vd-badge--info">Normative</span></h2>
  <h3>Public &amp; Token Naming</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/naming.md'), 3, 'Naming convention table')}</div>
  <h3>Cross-System Token Mappings</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/mappings.md'), 3, 'Cross-system mapping table')}</div>
  <h3>Editorial Tone &amp; Content Strings</h3>
  <div class="md-doc">${renderMarkdown(readSpec('conventions/content.md'), 3, 'Content conventions table')}</div>
</section>`;

const ssgBody = `
  <a href="#main-content" class="vd-skip-link">Skip to main specification</a>
  <header class="site-header" role="banner">
    <div class="vd-navbar vd-navbar--sticky vd-navbar--glass">
      <div class="vd-navbar-container">
        <div class="vd-navbar-brand">
          <a href="#main-content" class="brand">vd3<em>-ui-core</em></a>
          <span class="vd-badge vd-badge--info" data-version="1.0.0-draft">v1.0.0 · draft</span>
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
            <span class="vd-btn vd-btn--sm vd-btn--outline vd-btn-ring">Aa · Ubuntu</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="doc-layout">
    <aside class="doc-toc" aria-label="Chapter Table of Contents">
      <div id="doc-toc-title" class="doc-toc-title">Chapters (14)</div>
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
        <h1>VD3 UI CORE — The Golden-Ratio Web Design Bible</h1>
        <p class="lead">
          First principles, mathematical proportions, layered CSS component primitives, and normative
          W3C DTCG tokens for the <strong>vd3</strong> design system. Fibonacci-first — conventional
          only where web standards and human ergonomics demand it. Engineered cleanly for both human
          engineers and machine agents.
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
          <span><strong>11</strong> zero-framework core CSS modules</span>
          <span><strong>W3C APG</strong>-normative keyboard &amp; ARIA</span>
          <span><strong>W3C DTCG 2025.10</strong> token registry</span>
        </div>
        <div class="hero-links">
          <a href="/tokens/vd3.tokens.json" class="vd-btn vd-btn--sm vd-btn--primary">DTCG Tokens JSON</a>
          <a href="/tokens/schema.json" class="vd-btn vd-btn--sm vd-btn--outline">Token Schema JSON</a>
          <a href="#components" class="vd-btn vd-btn--sm vd-btn--outline">Jump to Components</a>
        </div>
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
    </main>
  </div>

  <footer>
    <div class="inner">
      <p>
        <strong>vd3-ui-core</strong> · Specification v1.0.0-draft · Markdown specs and W3C DTCG
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
