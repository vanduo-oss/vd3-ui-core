<script setup lang="ts">
import { VdBadge } from '@vanduo-oss/vd3'

const rows: { name: string; status: string; basis: ('a' | 'b' | 'c')[]; note: string }[] = [
  { name: 'proportion', status: '✓ spec’d', basis: ['a'], note: 'A/B/C contract, Fib+Lucas lawful, convergence zone' },
  { name: 'spacing', status: '✓ unified', basis: ['a', 'c'], note: 'Two v1.9 scales reconcile to one normative scale' },
  { name: 'line', status: 'new in 1.0', basis: ['a'], note: '1/2/3/5px — the gap Carbon exposed' },
  { name: 'typography', status: '✓ spec’d', basis: ['a'], note: '√φ steps, fluid clamps, φ line-heights' },
  { name: 'motion', status: '✓ spec’d', basis: ['a'], note: '55–987ms ladder, golden easings, reduced-motion law' },
  { name: 'elevation', status: '✓ spec’d', basis: ['a'], note: 'Fibonacci pairs; Carbon uses flat layers — deliberate divergence' },
  { name: 'glass + surfaces', status: '✓ spec’d', basis: ['a', 'c'], note: 'Strength steps 1–89; soft-cap in the convergence zone' },
  { name: 'color', status: '✓ spec’d', basis: ['a', 'b'], note: 'Open Color default · Fibonacci golden-angle opt-in' },
  { name: 'grid', status: '✓ spec’d', basis: ['b', 'a'], note: '12-col engine + golden modes' },
  { name: 'z-index', status: 'new in 1.0', basis: ['b'], note: 'Conventional increments, tokened — Q3 decided' },
  { name: 'focus', status: 'new in 1.0', basis: ['b'], note: 'Ring geometry tokens, focus-visible policy' },
  { name: 'icons', status: '✓ spec’d', basis: ['a'], note: 'Phosphor, 6 weights, fib sizing steps' },
  { name: 'content', status: 'new in 1.0', basis: [], note: 'Writing rules for built-in strings' },
  { name: 'data-viz color', status: 'new in 1.0', basis: ['a'], note: 'Categorical/sequential/diverging contract for vd3-charts — both palette engines (Q7)' },
]
const badgeVariant = { a: 'primary', b: 'info', c: 'warning' } as const
</script>

<template>
  <table>
    <thead>
      <tr><th>Foundation</th><th>Status</th><th>Basis</th><th>Note</th></tr>
    </thead>
    <tbody>
      <tr v-for="r in rows" :key="r.name">
        <td>{{ r.name }}</td>
        <td>{{ r.status }}</td>
        <td><VdBadge v-for="b in r.basis" :key="b" :variant="badgeVariant[b]" pill size="sm">{{ b.toUpperCase() }}</VdBadge></td>
        <td>{{ r.note }}</td>
      </tr>
    </tbody>
  </table>
  <p class="footnote">Behavior — keyboard, focus, ARIA — is normative from the W3C ARIA Authoring
  Practices Guide for every component spec. Carbon is cited as consulted literature; Material 3 is
  deliberately excluded.</p>
</template>

<style scoped>
table { border-collapse: collapse; width: 100%; font-size: 0.8125rem; margin-block-start: var(--vd-space-fib-8); }
th, td { text-align: left; padding: var(--vd-space-fib-5) var(--vd-space-fib-8); border-bottom: 1px solid var(--vd-border-color); vertical-align: top; }
th { color: var(--vd-text-secondary); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-left: 2px solid var(--vd-primary-6); padding-left: var(--vd-space-fib-8); max-width: 70ch;
}
</style>
