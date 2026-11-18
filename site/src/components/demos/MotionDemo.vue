<script setup lang="ts">
import { ref } from 'vue'
import { VdButton } from '@vanduo-oss/vd3'
import { motionDurations } from '../../spec'

const playing = ref(false)
function replay() {
  playing.value = false
  requestAnimationFrame(() => requestAnimationFrame(() => (playing.value = true)))
}
</script>

<template>
  <VdButton size="sm" @click="replay">▶ Replay ladder</VdButton>
  <div class="ladder">
    <div v-for="d in motionDurations" :key="d.name" class="rung" :class="{ playing }">
      <span class="mono lbl">{{ d.token }}<br /><small>{{ d.use }}</small></span>
      <div class="track"><span class="runner" :style="{ '--d': d.ms + 'ms' }" /></div>
    </div>
  </div>
  <p class="footnote">Distances are proportional to the moving element's size class — a tooltip
  <em>feels</em> instant at 144ms; a hero unfold needs 987ms. Under
  <code>prefers-reduced-motion: reduce</code> (or vd3 <code>data-motion="reduce"</code>),
  durations collapse.</p>
</template>

<style scoped>
.ladder { display: grid; gap: var(--vd-space-fib-8); margin-block-start: var(--vd-space-fib-13); }
.rung { display: grid; grid-template-columns: 170px 1fr; gap: var(--vd-space-fib-8); align-items: center; font-size: 0.8125rem; }
.mono { font-family: var(--vd-font-family-mono); }
.lbl { color: var(--vd-text-secondary); }
.lbl small { font-size: 10px; }
.track {
  position: relative; block-size: var(--vd-space-fib-13); background: var(--vd-bg-secondary);
  border-radius: 999px; overflow: hidden;
}
.runner {
  position: absolute; inset-block: 0; inset-inline-start: 0; inline-size: 34px; background: var(--vd-primary-6);
  border-radius: 999px; transform: translateX(-40px);
}
.playing .runner { animation: slide var(--d, 233ms) var(--vd-ease-out, cubic-bezier(0.16, 1, 0.3, 1)) forwards; }
@keyframes slide { to { transform: translateX(calc(100vw - 80px)); } }
@media (prefers-reduced-motion: reduce) { .playing .runner { animation-duration: 1ms; } }
[data-motion='reduce'] .playing .runner { animation-duration: 1ms; }
.footnote {
  font-size: 0.75rem; color: var(--vd-text-secondary); margin-block-start: var(--vd-space-fib-13);
  border-inline-start: 2px solid var(--vd-primary-6); padding-inline-start: var(--vd-space-fib-8); max-inline-size: 70ch;
}
</style>
