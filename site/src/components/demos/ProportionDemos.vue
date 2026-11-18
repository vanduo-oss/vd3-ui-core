<script setup lang="ts">
import { VdCard, VdChip } from '@vanduo-oss/vd3'
import { containers } from '../../spec'

const GA = (137.508 * Math.PI) / 180
const N = 300
const dots = Array.from({ length: N }, (_, i) => {
  const r = 2.2 * Math.sqrt(i + 1)
  const a = i * GA
  return {
    cx: (r * Math.cos(a)).toFixed(2),
    cy: (r * Math.sin(a)).toFixed(2),
    r: Math.max(1, Math.sqrt(i) * 0.55).toFixed(2),
    fill: `hsl(${((i * 137.508) % 360).toFixed(1)} 65% 52%)`,
  }
})
</script>

<template>
  <div class="gs" role="img" aria-label="Golden split: minor 38.2 percent, major 61.8 percent">
    <div class="minor">minor · 38.2% (1/φ²)</div>
    <div class="major">major · 61.8% (1/φ)</div>
  </div>

  <h3>Containers — Fibonacci &amp; Lucas are both citizens</h3>
  <div class="chips">
    <VdChip v-for="c in containers" :key="c.name" size="sm">
      <strong>{{ c.px }}px</strong> · {{ c.note }}
    </VdChip>
  </div>

  <h3>Phyllotaxis — hues at the golden angle</h3>
  <div class="grid-2">
    <VdCard class="center">
      <svg width="300" height="300" viewBox="-150 -150 300 300" role="img"
           aria-label="Phyllotaxis spiral of 300 dots at the golden angle">
        <circle v-for="(d, i) in dots" :key="i" :cx="d.cx" :cy="d.cy" :r="d.r" :fill="d.fill" />
      </svg>
    </VdCard>
    <VdCard>
      <p><strong>Why it matters.</strong> Golden-angle spacing maximizes the distance between
      successive hues. A palette built this way is perceptually spread by construction,
      not by hand-picking.</p>
      <p class="footnote">The dots above are generated at build time from the angle constant —
      the figure cannot drift from the math it illustrates.</p>
    </VdCard>
  </div>
</template>

<style scoped>
.gs {
  display: flex; border-radius: var(--vd-border-radius-md); overflow: hidden;
  border: 1px solid var(--vd-border-color); min-block-size: var(--vd-space-fib-34);
  margin-block: var(--vd-space-fib-8);
}
.gs > div { display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; }
.gs .minor { flex: 0.382; background: color-mix(in srgb, var(--vd-primary-6) 22%, var(--vd-bg-primary)); }
.gs .major { flex: 0.618; background: color-mix(in srgb, var(--vd-primary-6) 55%, var(--vd-bg-primary)); color: #fff; }
.chips { display: flex; gap: var(--vd-space-fib-8); flex-wrap: wrap; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--vd-space-fib-21); }
.center { display: flex; justify-content: center; }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-inline-start: 2px solid var(--vd-primary-6); padding-inline-start: var(--vd-space-fib-8);
}
</style>
