<script setup lang="ts">
const swatches = Array.from({ length: 10 }, (_, i) => {
  const h = (i * 137.508) % 360
  const l = 38 + 18 * ((i * 0.618) % 1) // lightness walks the golden fractional part
  return { h: h.toFixed(1), l: l.toFixed(1), bg: `hsl(${h.toFixed(1)} 68% ${l.toFixed(1)}%)` }
})
</script>

<template>
  <div class="swatches">
    <div v-for="(s, i) in swatches" :key="i" class="swatch" :style="{ background: s.bg }">
      <small>{{ s.h }}°</small>
    </div>
  </div>
</template>

<style scoped>
.swatches { display: flex; gap: var(--vd-space-fib-5); margin-block-start: var(--vd-space-fib-8); flex-wrap: wrap; }
.swatch {
  width: var(--vd-space-fib-34); height: var(--vd-space-fib-34); border-radius: var(--vd-border-radius-md);
  border: 1px solid color-mix(in srgb, var(--vd-text-secondary) 25%, transparent); position: relative;
}
.swatch small {
  position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%);
  font-size: 9px; color: var(--vd-text-secondary);
}
</style>
