<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  FONT_OPTIONS,
  VdBadge,
  VdButton,
  VdNavbar,
  VdThemeCustomizer,
  VdThemeSwitcher,
  useThemePreference,
} from '@vanduo-oss/vd3'

const props = defineProps<{
  links: { id: string; label: string }[]
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'navigate', id: string): void
}>()

const theme = useThemePreference()
const localActiveId = ref(props.activeId ?? props.links[0]?.id ?? 'contract')

const currentActiveId = computed(() => props.activeId ?? localActiveId.value)

const fontIndex = computed(() => Math.max(0, FONT_OPTIONS.findIndex((f) => f.key === theme.state.font)))
const fontLabel = computed(() => FONT_OPTIONS[fontIndex.value]?.name ?? theme.state.font)

watch(
  () => props.activeId,
  (next) => {
    if (next) localActiveId.value = next
  },
)

watch(
  () => theme.state.font,
  (next) => {
    if (next && typeof document !== 'undefined') {
      document.documentElement.dataset.font = next
    }
  },
)

function cycleFont() {
  const next = FONT_OPTIONS[(fontIndex.value + 1) % FONT_OPTIONS.length]
  if (next) {
    theme.setFont(next.key)
    document.documentElement.dataset.font = next.key
  }
}

function selectSection(id: string) {
  localActiveId.value = id
  emit('navigate', id)
}

function onHashChange() {
  const hashId = window.location.hash.replace(/^#/, '')
  if (hashId && props.links.some((l) => l.id === hashId)) {
    localActiveId.value = hashId
  }
}

onMounted(() => {
  theme.setTheme(theme.state.theme)
  if (theme.state.font) {
    document.documentElement.dataset.font = theme.state.font
  }
  onHashChange()
  window.addEventListener('hashchange', onHashChange)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', onHashChange)
})
</script>

<template>
  <header class="site-header" role="banner">
    <VdNavbar variant="glass" position="sticky" :scroll-threshold="34">
      <template #brand>
        <a href="#main-content" class="brand">vd3<em>-ui-core</em></a>
        <VdBadge variant="info" pill>v2.0.0</VdBadge>
      </template>
      <nav class="site-nav-pillars" aria-label="Primary specification navigation">
        <a
          v-for="l in props.links"
          :key="l.id"
          :href="'#' + l.id"
          class="vd-nav-link"
          :aria-current="currentActiveId === l.id ? 'page' : undefined"
          :class="{ 'is-active': currentActiveId === l.id }"
          @click="selectSection(l.id)"
        >
          {{ l.label }}
        </a>
      </nav>
      <template #actions>
        <VdButton
          size="sm"
          outline
          ring
          :title="'Cycle global typeface: ' + fontLabel"
          @click="cycleFont"
        >
          Aa · {{ fontLabel }}
        </VdButton>
        <VdThemeSwitcher :menu="false" />
        <VdThemeCustomizer variant="panel" />
      </template>
    </VdNavbar>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: var(--vd3-z-sticky, 1020);
}
.brand {
  font-weight: 700;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: var(--vd3-color-text-primary, #1a1d20);
  text-decoration: none;
  margin-inline-end: var(--vd3-space-fib-8, 0.75rem);
}
.brand em {
  color: var(--site-accent, #1946ba);
  font-style: normal;
}
nav.site-nav-pillars {
  display: flex;
  align-items: center;
  gap: var(--vd3-space-fib-13, 0.8125rem);
  flex-wrap: wrap;
  font-size: var(--vd3-font-size-sm, 0.8125rem);
  margin-inline: auto;
}
nav a {
  display: inline-flex;
  align-items: center;
  color: var(--vd3-color-text-secondary, #495057);
  text-decoration: none;
  padding: var(--vd3-space-fib-3, 0.375rem) var(--vd3-space-fib-5, 0.5rem);
  line-height: 1.25;
  border-bottom: 2px solid transparent;
  transition: color var(--vd3-duration-89, 89ms) ease-out, border-color var(--vd3-duration-89, 89ms) ease-out;
}
nav a:hover {
  color: var(--vd3-color-text-primary, #1a1d20);
}
nav a.is-active,
nav a[aria-current="page"] {
  color: var(--vd3-color-text-primary, #1a1d20);
  font-weight: 600;
  border-bottom-color: var(--site-accent, #1946ba);
}
</style>
