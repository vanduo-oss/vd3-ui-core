<script setup lang="ts">
import { VdBadge } from '@vanduo-oss/vd3'

const rows: { name: string; status: string; basis: ('a' | 'b' | 'c')[]; note: string }[] = [
  { name: 'proportion', status: 'Spec’d', basis: ['a'], note: 'A/B/C contract, Fibonacci & Lucas Binet lattices, golden convergence' },
  { name: 'spacing', status: 'Unified', basis: ['a', 'c'], note: 'Fibonacci rem ladder (2..144px) with physical sub-pixel Exception C-01' },
  { name: 'line', status: 'New in 1.0', basis: ['a'], note: 'Fibonacci hairline/thin/regular/thick stroke widths (1/2/3/5px)' },
  { name: 'typography', status: 'Spec’d', basis: ['a'], note: '√φ modular scale, fluid clamp() expressions, φ line-heights' },
  { name: 'motion', status: 'Spec’d', basis: ['a'], note: '55..987ms Fibonacci durations, golden Bézier easings, MOB-001 0ms contract' },
  { name: 'elevation', status: 'Spec’d', basis: ['a'], note: 'Consecutive Fibonacci shadow offset/blur pairs F_k / F_k+2' },
  { name: 'glass + surfaces', status: 'Spec’d', basis: ['a', 'c'], note: 'Frosted blur steps 1..89 capped per GPU safety Exception C-02' },
  { name: 'color', status: 'Spec’d', basis: ['a', 'b'], note: 'Semantic dual-theme WCAG AAA/AA roles + 137.508° golden-angle palette' },
  { name: 'grid + layout', status: 'Spec’d', basis: ['b', 'a'], note: '12-column responsive engine + Class A golden split & Fibonacci grids' },
  { name: 'z-index', status: 'New in 1.0', basis: ['b'], note: 'Conventional semantic layering from base (0) to toast (1080)' },
  { name: 'focus', status: 'New in 1.0', basis: ['b'], note: 'WCAG 2.2 SC 2.4.13 Dual-Ring focus indicator with inner offset gap' },
  { name: 'icons', status: 'New in 1.1', basis: ['a'], note: 'Fibonacci icon sizes 13/21/34/55px (F_7..F_10), phi stroke 1.618, semantic-role icon ink' },
  { name: 'density', status: 'New in 1.1', basis: ['a', 'b'], note: 'Two modes via [data-density]: comfortable (1) and compact (1/sqrt(phi) spacing scale)' },
  { name: 'data-viz', status: 'Boundary', basis: ['a'], note: 'vd3-charts / vd3-flowchart consume the golden-angle palette; core ships no chart components' },
  { name: 'patterns', status: 'New in 1.1', basis: ['b'], note: 'Empty states, auth flows, app shell, onboarding, disabled/read-only — guidance over normative components' },
  { name: 'components', status: 'New in 1.0', basis: ['a', 'b', 'c'], note: '36 zero-framework CSS modules (layout engine + 35 primitives), 39 per-slug specs, @layer vd3.components' },
  { name: 'conventions', status: 'Normative', basis: ['b'], note: 'Identifier naming, cross-system mappings, and editorial copy rules' },
]
const badgeVariant = { a: 'primary', b: 'info', c: 'warning' } as const
</script>

<template>
  <div class="vd-table-container" role="region" aria-label="Foundation specification chapters" tabindex="0">
    <table>
      <thead>
        <tr>
          <th scope="col">Area</th>
          <th scope="col">Status</th>
          <th scope="col">Basis</th>
          <th scope="col">Summary</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.name">
          <th scope="row">{{ r.name }}</th>
          <td>{{ r.status }}</td>
          <td><VdBadge v-for="b in r.basis" :key="b" :variant="badgeVariant[b]" pill size="sm">{{ b.toUpperCase() }}</VdBadge></td>
          <td>{{ r.note }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="footnote">Behavior — keyboard, focus, ARIA — is normative from the W3C ARIA Authoring
  Practices Guide for every component spec. Carbon is cited as consulted literature; Material 3 is
  deliberately excluded.</p>
</template>

<style scoped>
table { border-collapse: collapse; inline-size: 100%; font-size: 0.8125rem; margin-block-start: var(--vd3-space-fib-8, 0.75rem); }
th, td { text-align: start; padding: var(--vd3-space-fib-5, 0.5rem) var(--vd3-space-fib-8, 0.75rem); border-block-end: 1px solid var(--vd3-color-border, #dee2e6); vertical-align: top; }
thead th { color: var(--vd3-color-text-secondary, #495057); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
tbody th { font-weight: 600; color: var(--vd3-color-text-primary, #1a1d20); }
.footnote {
  font-size: 0.75rem; color: var(--vd3-color-text-secondary, #495057); margin-block-start: var(--vd3-space-fib-13, 0.8125rem);
  border-inline-start: 2px solid var(--vd3-color-interactive, var(--site-accent, #1946ba)); padding-inline-start: var(--vd3-space-fib-8, 0.75rem); max-inline-size: 70ch;
}
</style>
