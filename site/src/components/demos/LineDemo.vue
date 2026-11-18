<script setup lang="ts">
import { VdCard } from '@vanduo-oss/vd3'
import { lineWeights } from '../../spec'
</script>

<template>
  <div class="lw">
    <VdCard v-for="w in lineWeights" :key="w.name" class="lw-card">
      <div class="demo" :style="{ borderTop: w.css + ' solid var(--vd-primary-6)' }" />
      <span class="mono">{{ w.token }}</span> · {{ w.px }}px
    </VdCard>
  </div>
  <p class="footnote">Foundation added in core 1.0 — the one gap Carbon exposed that v1.9 had not
  filled. Hairlines in dark mode are why <code>--vd-line-hair</code> is a token, not a literal.</p>
</template>

<style scoped>
.lw { display: flex; gap: var(--vd-space-fib-13); flex-wrap: wrap; margin-block-start: var(--vd-space-fib-8); }
.lw-card { flex: 1; min-inline-size: 130px; text-align: center; font-size: 0.8125rem; }
.demo { block-size: var(--vd-space-fib-34); background: var(--vd-bg-secondary); border-radius: var(--vd-border-radius-sm); margin-block-end: var(--vd-space-fib-5); }
.mono { font-family: var(--vd-font-family-mono); }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-inline-start: 2px solid var(--vd-primary-6); padding-inline-start: var(--vd-space-fib-8); max-inline-size: 70ch;
}
</style>
