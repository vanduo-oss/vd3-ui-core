/**
 * Normative markdown renderer for the vd3-ui-core specification subset:
 * frontmatter stripping, fenced code blocks, strict heading ladder shifting
 * (stripping duplicated H1 and mapping ##..#### -> h3..h5 without skipped levels),
 * responsive scrollable tables with explicit th[scope], lists, blockquotes, and inline markup.
 */
export interface RenderMdOptions {
  /** Heading level of the enclosing section title (default 2 -> md ## becomes h3). */
  sectionLevel?: number
  /** Table accessible caption/region label. */
  tableLabel?: string
}

export function renderMd(src: string, options: RenderMdOptions = {}): string {
  const sectionLevel = options.sectionLevel ?? 2
  let lastHeadingLevel = sectionLevel

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const formatMathBody = (raw: string) => {
    let s = esc(raw.trim())
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
      .replace(/\^(-?[a-zA-Z0-9]+)/g, '<sup>$1</sup>')
    for (let k = 0; k < 4; k++) {
      s = s
        .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)')
    }
    s = s
      .replace(/\(1\)\s*\/\s*\((φ(?:<sup>[0-9-]+<\/sup>)?)\)/g, '1/$1')
      .replace(/\(([^()]+)\)\s*\/\s*\(√5\)/g, '($1) / √5')
      .replace(/\(([^()]+)\)\s*\/\s*\(2\)/g, '($1) / 2')
    return s
  }

  const inline = (s: string) => {
    const codeSpans: string[] = []
    const tokenized = s
      .replace(/`([^`]+)`/g, (_, code: string) => {
        const idx = codeSpans.length
        codeSpans.push(`<code class="vd-code-inline">${esc(code)}</code>`)
        return `\u0000CODE${idx}\u0000`
      })
      .replace(/\$\$([^$]+)\$\$/g, (_, math: string) => {
        const idx = codeSpans.length
        codeSpans.push(`<code class="vd-code-inline vd-math-block">${formatMathBody(math)}</code>`)
        return `\u0000CODE${idx}\u0000`
      })
      .replace(/\$([^$\n]+)\$/g, (_, math: string) => {
        const idx = codeSpans.length
        codeSpans.push(`<span class="vd-math">${formatMathBody(math)}</span>`)
        return `\u0000CODE${idx}\u0000`
      })

    const formatted = esc(tokenized)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    return formatted.replace(/\u0000CODE(\d+)\u0000/g, (_, idx) => codeSpans[Number(idx)] ?? '')
  }

  const lines = src.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split(/\r?\n/)
  const out: string[] = []
  let para: string[] = []
  let skippedTopH1 = false

  const flushPara = () => {
    if (para.length) {
      out.push(`<p>${inline(para.join(' '))}</p>`)
      para = []
    }
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Fenced code blocks (` ```lang ... ``` `)
    const fence = /^\s*```([a-zA-Z0-9_-]*)\s*$/.exec(line)
    if (fence) {
      flushPara()
      const lang = fence[1]?.trim() ?? ''
      const codeLines: string[] = []
      i++
      while (i < lines.length && !/^\s*```\s*$/.test(lines[i])) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++
      const langAttr = lang ? ` data-language="${esc(lang)}"` : ''
      out.push(`<pre class="vd-code"${langAttr} tabindex="0"><code>${esc(codeLines.join('\n'))}</code></pre>`)
      continue
    }

    // Markdown pipe tables wrapped in accessible scroll region
    if (/^\s*\|.*\|\s*$/.test(line)) {
      flushPara()
      const rows: string[][] = []
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].split('|').slice(1, -1).map((c) => c.trim())
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells)
        i++
      }
      const head = rows[0] ?? []
      const label = esc(options.tableLabel ?? 'Specification table')
      out.push(
        `<div class="vd-table-container" tabindex="0" role="region" aria-label="${label}">` +
          '<table class="vd-table vd-table--hover"><thead><tr>' +
          head.map((c) => `<th scope="col">${inline(c)}</th>`).join('') +
          '</tr></thead><tbody>' +
          rows
            .slice(1)
            .map(
              (r) =>
                '<tr>' +
                r
                  .map((c, idx) => (idx === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`))
                  .join('') +
                '</tr>',
            )
            .join('') +
          '</tbody></table></div>',
      )
      continue
    }

    // Headings — strip first H1 (section provides H2) and clamp level transitions (no skips)
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      flushPara()
      const rawLevel = h[1].length
      if (rawLevel === 1 && !skippedTopH1) {
        skippedTopH1 = true
        i++
        continue
      }
      const shifted = Math.min(6, Math.max(sectionLevel + 1, rawLevel + (sectionLevel - 1)))
      const level = Math.min(6, Math.min(shifted, lastHeadingLevel + 1))
      lastHeadingLevel = level
      out.push(`<h${level}>${inline(h[2].trim())}</h${level}>`)
      i++
      continue
    }

    if (/^\s*---\s*$/.test(line)) {
      flushPara()
      out.push('<hr/>')
      i++
      continue
    }

    // Blockquotes
    if (/^\s*>\s?/.test(line)) {
      flushPara()
      const quoteLines: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, '').trim())
        i++
      }
      out.push(`<blockquote><p>${inline(quoteLines.join(' '))}</p></blockquote>`)
      continue
    }

    // Unordered lists
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara()
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, '').trim())
        i++
      }
      out.push('<ul>' + items.map((item) => `<li>${inline(item)}</li>`).join('') + '</ul>')
      continue
    }

    // Ordered lists
    if (/^\s*\d+\.\s+/.test(line)) {
      flushPara()
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim())
        i++
      }
      out.push('<ol>' + items.map((item) => `<li>${inline(item)}</li>`).join('') + '</ol>')
      continue
    }

    if (line.trim() === '') {
      flushPara()
      i++
      continue
    }

    para.push(line.trim())
    i++
  }

  flushPara()
  return out.join('\n')
}
