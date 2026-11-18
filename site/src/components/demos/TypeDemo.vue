<script setup lang="ts">
import { VdCard, VdChip } from '@vanduo-oss/vd3'
import { leadings, typeSizes } from '../../spec'
</script>

<template>
  <VdCard>
    <div v-for="s in typeSizes" :key="s.name" class="type-row">
      <span class="lbl mono">{{ s.name }} · {{ s.px }}px {{ s.desc }}</span>
      <span :style="{ fontSize: s.css }">Golden rhythm</span>
    </div>
  </VdCard>
  <div class="chips">
    <VdChip v-for="l in leadings" :key="l.name" size="sm">
      <strong>{{ l.name }}</strong> {{ l.value }} {{ l.desc }}
    </VdChip>
  </div>
</template>

<style scoped>
.type-row {
  display: flex; align-items: baseline; gap: var(--vd-space-fib-13);
  border-block-end: 1px solid var(--vd-border-color); padding-block: var(--vd-space-fib-5);
}
.lbl { font-size: 0.75rem; color: var(--vd-text-secondary); inline-size: 170px; flex-shrink: 0; }
.mono { font-family: var(--vd-font-family-mono); }
.chips { display: flex; gap: var(--vd-space-fib-8); flex-wrap: wrap; margin-block-start: var(--vd-space-fib-13); }
</style>
