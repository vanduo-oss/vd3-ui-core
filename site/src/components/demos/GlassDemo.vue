<script setup lang="ts">
import { computed, ref } from 'vue'
import { VdChip } from '@vanduo-oss/vd3'

// strength step -> [blur px, tint alpha, edge alpha]; blur soft-caps ~20px (C-02)
const steps: [number, number, number, number][] = [
  [1, 2, 0.08, 0.12], [2, 3, 0.12, 0.16], [3, 5, 0.16, 0.2], [5, 8, 0.2, 0.24],
  [8, 13, 0.28, 0.3], [13, 16, 0.32, 0.34], [21, 20, 0.38, 0.38], [34, 22, 0.46, 0.44],
  [55, 24, 0.55, 0.5], [89, 26, 0.66, 0.58],
]
const current = ref(5)
const active = computed(() => steps.find((s) => s[0] === current.value) ?? steps[3])
</script>

<template>
  <div class="glass-stage">
    <div class="glass-panel" :style="{
      backdropFilter: `blur(${active[1]}px)`,
      WebkitBackdropFilter: `blur(${active[1]}px)`,
      background: `color-mix(in srgb, var(--vd-primary-6) 8%, var(--vd-glass-tint, rgba(255,255,255,0.55)) ${active[2] * 100}%)`,
      border: `1px solid color-mix(in srgb, var(--vd-primary-6) 30%, var(--vd-glass-edge, rgba(255,255,255,0.65)) ${active[3] * 100}%)`,
    }">
      <strong style="font-size: 0.8125rem">Glass step {{ active[0] }}</strong>
      <div class="mono" style="font-size: 0.75rem; opacity: 0.8">
        blur {{ active[1] }}px · tint {{ active[2].toFixed(2) }} · edge {{ active[3].toFixed(2) }}
      </div>
    </div>
  </div>
  <div class="glass-steps" role="group" aria-label="Glass strength steps">
    <VdChip
      v-for="s in steps" :key="s[0]" size="sm" clickable
      :variant="s[0] === current ? 'primary' : 'secondary'"
      :aria-pressed="String(s[0] === current)"
      @click="current = s[0]"
    >{{ s[0] }}</VdChip>
  </div>
  <p class="footnote"><strong>Exception C-02 — convergence zone:</strong> blur soft-caps at ~20px;
  past step 13, tint, edge, and elevation continue the progression while blur barely moves.
  Physics caps the value; the sequence keeps its voice.</p>
</template>

<style scoped>
.glass-stage {
  position: relative; border-radius: var(--vd-border-radius-md); overflow: hidden;
  border: 1px solid var(--vd-border-color); min-height: 240px;
  background:
    radial-gradient(circle at 20% 30%, hsl(43 80% 55% / 0.8), transparent 45%),
    radial-gradient(circle at 80% 20%, hsl(190 80% 50% / 0.8), transparent 40%),
    radial-gradient(circle at 60% 85%, hsl(275 70% 60% / 0.8), transparent 45%),
    linear-gradient(135deg, hsl(160 70% 45% / 0.7), transparent 60%),
    var(--vd-bg-secondary);
}
.glass-panel {
  position: absolute; inset: auto var(--vd-space-fib-21) var(--vd-space-fib-21) var(--vd-space-fib-21);
  padding: var(--vd-space-fib-13); border-radius: var(--vd-border-radius-md);
  transition: all var(--vd-duration-233, 233ms) var(--vd-ease-out, cubic-bezier(0.16, 1, 0.3, 1));
}
.glass-steps { display: flex; gap: var(--vd-space-fib-3); flex-wrap: wrap; margin-block-start: var(--vd-space-fib-8); }
.mono { font-family: var(--vd-font-family-mono); }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-inline-start: 2px solid var(--vd-primary-6); padding-inline-start: var(--vd-space-fib-8); max-inline-size: 70ch;
}
</style>
