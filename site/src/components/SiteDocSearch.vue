<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useDocSearch, type DocSearchDoc, type DocSearchResult } from '@vanduo-oss/vd3'

const props = defineProps<{
  docs: DocSearchDoc[]
}>()

const rootRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

function navigateToResult(result: DocSearchResult) {
  const hash = result.href?.startsWith('#') ? result.href : `#${result.id}`
  const targetId = hash.slice(1)
  const el = typeof document !== 'undefined' ? document.getElementById(targetId) : null
  if (el) {
    const reduced =
      document.documentElement.getAttribute('data-motion') === 'reduce' ||
      document.documentElement.getAttribute('data-motion') === 'off' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '-1')
    }
    el.focus({ preventScroll: true })
  }
  if (typeof history !== 'undefined' && typeof history.replaceState === 'function') {
    history.replaceState(null, '', hash)
  }
}

const { query, results, isOpen, activeIndex, search, open, close, select, handleKeydown } = useDocSearch(
  computed(() => props.docs),
  {
    minQueryLength: 1,
    maxResults: 12,
    debounceMs: 0,
    keyboardShortcut: true,
    input: inputRef,
    onSelect: navigateToResult,
  }
)

const hasQuery = computed(() => query.value.trim().length > 0)
const dropdownOpen = computed(() => isOpen.value && hasQuery.value)
const activeOptionId = computed(() =>
  dropdownOpen.value && activeIndex.value >= 0 ? `doc-search-opt-${activeIndex.value}` : undefined
)

function handleFocus() {
  if (hasQuery.value) {
    search(query.value)
    open()
  }
}

function clearSearch() {
  query.value = ''
  close()
  inputRef.value?.focus()
}

function handleDocumentPointerDown(e: PointerEvent) {
  const root = rootRef.value
  const target = e.target as Node | null
  if (root && target && !root.contains(target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('pointerdown', handleDocumentPointerDown, true)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleDocumentPointerDown, true)
})
</script>

<template>
  <div ref="rootRef" class="vd-doc-search doc-toc-search" role="search" aria-label="Specification search">
    <div class="vd-doc-search-input-wrapper">
      <span class="vd-doc-search-icon ph ph-magnifying-glass" aria-hidden="true"></span>
      <input
        id="doc-search-input"
        ref="inputRef"
        v-model="query"
        type="search"
        class="vd-doc-search-input"
        placeholder="Search standard & specs…"
        aria-label="Search VD3 specification (Cmd+K or Ctrl+K)"
        role="combobox"
        autocomplete="off"
        :aria-expanded="dropdownOpen"
        aria-autocomplete="list"
        aria-controls="doc-search-results"
        :aria-activedescendant="activeOptionId"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      <kbd class="vd-doc-search-shortcut" aria-hidden="true">⌘K</kbd>
      <button
        v-if="hasQuery"
        type="button"
        class="doc-search-clear"
        aria-label="Clear specification search"
        @click="clearSearch"
      >
        ×
      </button>
    </div>

    <div
      class="vd-doc-search-results"
      :class="{ 'is-open': dropdownOpen }"
    >
      <div v-if="dropdownOpen && results.length === 0" class="vd-doc-search-empty" role="status">
        <div class="vd-doc-search-empty-title">No matching results</div>
        <div class="vd-doc-search-empty-text">No chapters, tokens, components, or patterns matched “{{ query }}”.</div>
      </div>

      <ul
        v-show="dropdownOpen && results.length > 0"
        id="doc-search-results"
        class="vd-doc-search-results-list"
        role="listbox"
        aria-label="Specification search results"
      >
        <li v-for="(r, idx) in results" :key="r.id" role="none">
          <a
            :id="`doc-search-opt-${idx}`"
            :href="r.href"
            class="vd-doc-search-result"
            :class="{ 'is-active': idx === activeIndex }"
            role="option"
            :aria-selected="idx === activeIndex"
            @mousedown.prevent="select(idx)"
            @click.prevent="select(idx)"
          >
            <span class="vd-doc-search-result-content">
              <span class="vd-doc-search-result-title" v-html="r.titleHtml"></span>
              <span class="vd-doc-search-result-category">{{ r.category }}</span>
              <span v-if="r.excerptHtml" class="vd-doc-search-result-excerpt" v-html="r.excerptHtml"></span>
            </span>
          </a>
        </li>
      </ul>

      <div v-if="dropdownOpen" class="vd-doc-search-footer" aria-hidden="true">
        <span class="vd-doc-search-footer-item"><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
        <span class="vd-doc-search-footer-item"><kbd>↵</kbd> select</span>
        <span class="vd-doc-search-footer-item"><kbd>esc</kbd> close</span>
      </div>
    </div>
  </div>
</template>
