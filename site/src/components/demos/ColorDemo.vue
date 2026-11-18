<script setup lang="ts">
const goldenTrack = [
  { step: 0, token: '--vd3-color-golden-0', hue: '45.0°', hex: '#fab005', label: 'Base (+0×φ)' },
  { step: 1, token: '--vd3-color-golden-1', hue: '182.5°', hex: '#0ab5b5', label: 'Phi +1' },
  { step: 2, token: '--vd3-color-golden-2', hue: '320.0°', hex: '#f20d91', label: 'Phi +2' },
  { step: 3, token: '--vd3-color-golden-3', hue: '97.5°', hex: '#68c20a', label: 'Phi +3' },
  { step: 4, token: '--vd3-color-golden-4', hue: '235.0°', hex: '#254ef0', label: 'Phi +4' },
  { step: 5, token: '--vd3-color-golden-5', hue: '12.5°', hex: '#f22d0d', label: 'Phi +5' },
  { step: 6, token: '--vd3-color-golden-6', hue: '150.0°', hex: '#0ac265', label: 'Phi +6' },
  { step: 7, token: '--vd3-color-golden-7', hue: '287.5°', hex: '#ba0df2', label: 'Phi +7' }
]

const fibRamps = [
  {
    name: 'Red (Crimson)',
    hue: '20°',
    shades: ['#fff0f0', '#ffd8d9', '#ffb2b6', '#ff868f', '#ff576b', '#ff2b4d', '#de003a', '#b3002d', '#870020', '#5e0014']
  },
  {
    name: 'Orange',
    hue: '48°',
    shades: ['#fff4eb', '#ffe0c7', '#ffc391', '#ffa252', '#ff881b', '#ff7e2d', '#ec6a00', '#b75100', '#843900', '#542200']
  },
  {
    name: 'Amber',
    hue: '72°',
    shades: ['#fff9e6', '#ffecb3', '#ffdc73', '#ffca28', '#ffb700', '#fba500', '#e89800', '#b07200', '#7c4f00', '#4b2e00']
  },
  {
    name: 'Yellow (Gold)',
    hue: '95°',
    shades: ['#fffde6', '#fff7b3', '#ffef73', '#ffe529', '#f7d600', '#eec800', '#e3be00', '#a88d00', '#736000', '#423600']
  },
  {
    name: 'Green',
    hue: '148°',
    shades: ['#ebfff1', '#c7ffda', '#8effb6', '#46f089', '#00d963', '#00c44f', '#00ae45', '#008734', '#006123', '#003d14']
  },
  {
    name: 'Teal',
    hue: '178°',
    shades: ['#eafffb', '#c3fff4', '#86ffe9', '#3df0d3', '#00d4b7', '#00bca2', '#00a68f', '#00816f', '#005c4f', '#003930']
  },
  {
    name: 'Blue',
    hue: '255°',
    shades: ['#eef5ff', '#d5e6ff', '#adcfff', '#7db3ff', '#4d9bff', '#268cff', '#0074e1', '#005db6', '#00468c', '#003063']
  },
  {
    name: 'Violet',
    hue: '295°',
    shades: ['#f6f0ff', '#e7d8ff', '#cfb2ff', '#b587ff', '#a36eff', '#9b6aff', '#893dfb', '#7025d3', '#5610a8', '#3c007d']
  }
]
</script>

<template>
  <div class="demo-panel" aria-label="Golden angle color wheel and Fibonacci chromatic scales">
    <div class="color-demo-header">
      <strong class="color-demo-title">Golden-Angle Track (137.508° step · C × φ)</strong>
      <span class="color-demo-subtitle">Step 6 peak chroma · WCAG ≥ 4.5:1 contrast guard</span>
    </div>
    <div class="color-wheel-strip">
      <div
        v-for="s in goldenTrack"
        :key="s.step"
        class="color-swatch-card"
        :style="{
          backgroundColor: s.hex,
          color: [2, 5].includes(s.step) ? '#000000' : [0, 1, 3, 6].includes(s.step) ? '#1a1d20' : '#ffffff'
        }"
      >
        <strong>{{ s.hue }}</strong>
        <span>{{ s.token }}</span>
        <code>{{ s.hex }}</code>
      </div>
    </div>

    <div class="color-demo-header" style="margin-block-start: 1.3125rem">
      <strong class="color-demo-title">Fibonacci Chromatic Scales (0 → 9 · Peak at Step 6 = round(9 / φ))</strong>
      <span class="color-demo-subtitle">Cusp-anchored OKLCH ramps · True Crimson (20°)</span>
    </div>
    <div class="fib-ramp-grid">
      <div v-for="ramp in fibRamps" :key="ramp.name" class="fib-ramp-row">
        <div class="fib-ramp-meta">
          <strong>{{ ramp.name }}</strong>
          <span>{{ ramp.hue }}</span>
        </div>
        <div class="fib-ramp-cells">
          <div
            v-for="(hex, idx) in ramp.shades"
            :key="idx"
            class="fib-ramp-cell"
            :class="{ 'is-main-step': idx === 6 }"
            :style="{ backgroundColor: hex, color: idx <= 4 ? '#1a1d20' : idx >= 7 ? '#ffffff' : (['Orange', 'Amber', 'Yellow (Gold)', 'Green', 'Teal'].includes(ramp.name) ? '#1a1d20' : '#ffffff') }"
            :title="`${ramp.name} step ${idx}: ${hex}`"
          >
            <span class="fib-step-num">{{ idx }}</span>
            <code class="fib-step-hex">{{ hex }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
