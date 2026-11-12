<script setup lang="ts">
import { computed } from 'vue'
import { VdBadge, VdButton, VdNavbar, VdThemeSwitcher, useThemePreference, FONT_OPTIONS } from '@vanduo-oss/vd3'

const props = defineProps<{ links: { id: string; label: string }[] }>()

const theme = useThemePreference()
const fontIndex = computed(() => Math.max(0, FONT_OPTIONS.findIndex((f) => f.key === theme.state.font)))
const fontLabel = computed(() => FONT_OPTIONS[fontIndex.value]?.name ?? theme.state.font)
function cycleFont() {
  const next = FONT_OPTIONS[(fontIndex.value + 1) % FONT_OPTIONS.length]
  if (next) theme.setFont(next.key)
}
</script>

<template>
  <VdNavbar variant="glass" position="sticky" :scroll-threshold="34">
    <template #brand>
      <a href="#top" class="brand">vd3<em>-ui-core</em></a>
      <VdBadge variant="info" pill>spec 2.0.0-draft</VdBadge>
    </template>
    <nav aria-label="Sections">
      <a v-for="l in props.links" :key="l.id" :href="'#' + l.id">{{ l.label }}</a>
    </nav>
    <template #actions>
      <VdButton size="sm" outline :title="'Font: ' + fontLabel" @click="cycleFont">
        Aa · {{ fontLabel }}
      </VdButton>
      <VdThemeSwitcher menu align="end" />
    </template>
  </VdNavbar>
</template>

<style scoped>
.brand {
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: var(--vd-text-primary);
  text-decoration: none;
  margin-inline-end: var(--vd-space-fib-8);
}
.brand em { color: var(--vd-primary-6); font-style: normal; }
nav { display: flex; gap: var(--vd-space-fib-13); flex-wrap: wrap; font-size: var(--vd-text-sm, 0.8125rem); }
nav a { color: var(--vd-text-secondary); text-decoration: none; }
nav a:hover { color: var(--vd-primary-6); }
</style>
