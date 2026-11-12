<script setup lang="ts">
import { VdBadge } from '@vanduo-oss/vd3'
import { spaceSteps } from '../../spec'
</script>

<template>
  <div class="scale">
    <div v-for="s in spaceSteps" :key="s.name" class="scale-row">
      <span class="mono lbl">{{ s.token }}</span>
      <div class="scale-bar" :style="{ width: Math.min(s.px * 8, 400) + 'px' }" />
      <span class="val">{{ s.px }}px
        <VdBadge v-if="s.c01" variant="warning" pill size="sm">C-01</VdBadge>
      </span>
    </div>
  </div>
  <p class="footnote"><strong>Exception C-01:</strong> steps ≤ 12px ship as the rem-rounded working
  scale (2·4·6·8·12); the sequence becomes literal from 13px onward. Registered, reviewed at each major.
  The px helper scale (<code>--vd-spacing-*</code>) is generated as aliases of these tokens.</p>
</template>

<style scoped>
.scale { display: grid; gap: var(--vd-space-fib-5); }
.scale-row {
  display: grid; grid-template-columns: 150px 1fr 110px; gap: var(--vd-space-fib-8);
  align-items: center; font-size: 0.8125rem;
}
.mono { font-family: var(--vd-font-family-mono); }
.lbl { color: var(--vd-text-secondary); }
.scale-bar {
  height: var(--vd-space-fib-8); border-radius: var(--vd-border-radius-sm);
  background: linear-gradient(90deg, color-mix(in srgb, var(--vd-primary-6) 70%, var(--vd-bg-primary)), var(--vd-primary-6));
}
.val { color: var(--vd-text-secondary); font-size: 0.75rem; display: flex; align-items: center; gap: var(--vd-space-fib-3); }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-left: 2px solid var(--vd-primary-6); padding-left: var(--vd-space-fib-8); max-width: 70ch;
}
</style>
