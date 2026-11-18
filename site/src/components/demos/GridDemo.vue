<script setup lang="ts">
import { VdBadge, VdChip } from '@vanduo-oss/vd3'
</script>

<template>
  <div class="gd" aria-label="Twelve equal columns">
    <div v-for="n in 12" :key="n" />
  </div>
  <div class="gd golden" aria-label="Golden split one to 1.618">
    <div>1fr</div>
    <div>1.618fr</div>
  </div>
  <div class="chips">
    <VdChip size="sm"><strong>breakpoints</strong> 576 · 768 · 992 · 1200 · 1400 <VdBadge variant="info" pill size="sm">B</VdBadge></VdChip>
    <VdChip size="sm"><strong>gutter</strong> 13px · fib <VdBadge variant="primary" pill size="sm">A</VdBadge></VdChip>
    <VdChip size="sm"><strong>columns/row</strong> 1 → 2 → 3 → 4 → 6 → 12</VdChip>
  </div>
  <p class="footnote">Class B is a decision, not a default: golden grids win for editorial, hero,
  and marketing layouts; the conventional engine wins for data. Both ship, one class apart.</p>
</template>

<style scoped>
.gd { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--vd-space-fib-8); margin-block-start: var(--vd-space-fib-8); }
.gd > div {
  background: color-mix(in srgb, var(--vd-primary-6) 20%, var(--vd-bg-primary));
  border: 1px solid var(--vd-border-color); border-radius: var(--vd-border-radius-sm); block-size: var(--vd-space-fib-21);
}
.gd.golden { grid-template-columns: 1fr 1.618fr; margin-block-start: var(--vd-space-fib-13); }
.gd.golden > div {
  block-size: var(--vd-space-fib-55); display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; color: var(--vd-text-secondary);
}
.chips { display: flex; gap: var(--vd-space-fib-8); flex-wrap: wrap; margin-block-start: var(--vd-space-fib-13); }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-inline-start: 2px solid var(--vd-primary-6); padding-inline-start: var(--vd-space-fib-8); max-inline-size: 70ch;
}
</style>
