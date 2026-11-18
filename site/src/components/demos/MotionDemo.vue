<script setup lang="ts">
import { ref } from 'vue'
import { VdButton } from '@vanduo-oss/vd3'
import { motionDurations } from '../../spec'

const speedOptions = [
  { scale: 8, label: '8× Slow-Mo (F₆)' },
  { scale: 5, label: '5× Slow-Mo (F₅)' },
  { scale: 1, label: '1× Real-time' },
]

const timeScale = ref(8)
const playing = ref(false)

function replay() {
  playing.value = false
  requestAnimationFrame(() => requestAnimationFrame(() => (playing.value = true)))
}

function setSpeed(scale: number) {
  timeScale.value = scale
  replay()
}
</script>

<template>
  <div class="motion-controls">
    <VdButton size="sm" @click="replay">▶ Replay ladder</VdButton>
    <div class="speed-group" role="group" aria-label="Motion playback speed">
      <button
        v-for="opt in speedOptions"
        :key="opt.scale"
        type="button"
        class="vd-chip"
        :aria-pressed="timeScale === opt.scale"
        @click="setSpeed(opt.scale)"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
  <div class="ladder">
    <div v-for="d in motionDurations" :key="d.name" class="rung" :class="{ playing }">
      <span class="mono lbl">{{ d.token }}<br /><small>{{ d.use }}</small></span>
      <div class="track">
        <span class="runner" :style="{ '--d': (d.ms * timeScale) + 'ms' }" />
      </div>
      <span class="mono dur">{{ d.ms * timeScale }}ms</span>
    </div>
  </div>
  <p class="footnote">Distances are proportional to the moving element's size class — a tooltip
  <em>feels</em> instant at 144ms; a hero unfold needs 987ms. Default preview uses 8× Fibonacci
  slow-motion (F₆ = 8; 440ms–7.9s) so relative timing curves are easy to observe. Under
  <code>prefers-reduced-motion: reduce</code> (or vd3 <code>data-motion="reduce"</code>),
  durations collapse.</p>
</template>

<style scoped>
.motion-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--vd3-space-fib-8, 0.75rem);
}
.speed-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--vd3-space-fib-5, 0.5rem);
}
.ladder { display: grid; gap: var(--vd3-space-fib-8, 0.75rem); margin-block-start: var(--vd3-space-fib-13, 0.8125rem); }
.rung { display: grid; grid-template-columns: minmax(150px, 190px) 1fr 4.5rem; gap: var(--vd3-space-fib-8, 0.75rem); align-items: center; font-size: 0.8125rem; }
.mono { font-family: var(--vd3-font-family-mono, var(--vd-font-family-mono, ui-monospace, monospace)); }
.lbl { color: var(--vd3-color-text-secondary, #495057); }
.lbl small { font-size: 0.6875rem; }
.dur { font-size: 0.75rem; color: var(--vd3-color-text-secondary, #495057); text-align: end; font-variant-numeric: tabular-nums; }
.track {
  position: relative;
  container-type: inline-size;
  block-size: var(--vd3-space-fib-13, 0.8125rem);
  background: var(--vd3-color-layer, #f8f9fa);
  border: 1px solid var(--vd3-color-border-subtle, var(--vd3-color-border, #dee2e6));
  border-radius: 999px;
  overflow: hidden;
}
.runner {
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  inline-size: 34px;
  background: var(--site-accent, var(--vd-primary-6, #1098ad));
  border-radius: 999px;
  transform: translateX(0);
}
.playing .runner {
  animation: slide var(--d, 1864ms) var(--vd3-ease-out, cubic-bezier(0.236, 1, 0.382, 1)) forwards;
}
:dir(rtl) .playing .runner {
  animation-name: slide-rtl;
}
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(calc(100cqi - 34px)); }
}
@keyframes slide-rtl {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100cqi + 34px)); }
}
@media (prefers-reduced-motion: reduce) { .playing .runner { animation-duration: 1ms; } }
[data-motion='reduce'] .playing .runner { animation-duration: 1ms; }
.footnote {
  font-size: 0.75rem; color: var(--vd3-color-text-secondary, #495057); margin-block-start: var(--vd3-space-fib-13, 0.8125rem);
  border-inline-start: 2px solid var(--site-accent, var(--vd-primary-6, #1098ad)); padding-inline-start: var(--vd3-space-fib-8, 0.75rem); max-inline-size: 70ch;
}
</style>
