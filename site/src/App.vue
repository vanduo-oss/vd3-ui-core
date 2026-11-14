<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
  VdAccordion,
  VdBadge,
  VdButton,
  VdCard,
  VdChip,
  VdCodeSnippet,
  VdInput,
  VdModal,
  VdSelect,
  VdTable,
  VdToastContainer,
  useToast,
} from '@vanduo-oss/vd3'
import SiteNavbar from './components/SiteNavbar.vue'
import MdDoc from './components/MdDoc.vue'
import FoundationTable from './components/FoundationTable.vue'
import ProportionDemos from './components/demos/ProportionDemos.vue'
import SpacingDemo from './components/demos/SpacingDemo.vue'
import LineDemo from './components/demos/LineDemo.vue'
import TypeDemo from './components/demos/TypeDemo.vue'
import MotionDemo from './components/demos/MotionDemo.vue'
import ElevationDemo from './components/demos/ElevationDemo.vue'
import GlassDemo from './components/demos/GlassDemo.vue'
import ColorDemo from './components/demos/ColorDemo.vue'
import GridDemo from './components/demos/GridDemo.vue'

// The markdown spec is the source of truth — sections render it verbatim.
import principlesMd from '@spec/foundations/principles.md?raw'
import proportionMd from '@spec/foundations/proportion.md?raw'
import layoutMd from '@spec/foundations/layout.md?raw'
import lineMd from '@spec/foundations/line.md?raw'
import typographyMd from '@spec/foundations/typography.md?raw'
import motionMd from '@spec/foundations/motion.md?raw'
import elevationMd from '@spec/foundations/elevation.md?raw'
import glassMd from '@spec/foundations/glass.md?raw'
import colorMd from '@spec/foundations/color.md?raw'
import focusMd from '@spec/foundations/focus.md?raw'
import dialogMd from '@spec/components/dialog/spec.md?raw'
import namingMd from '@spec/conventions/naming.md?raw'
import mappingsMd from '@spec/conventions/mappings.md?raw'
import contentMd from '@spec/conventions/content.md?raw'

const pillars = [
  { id: 'contract', label: 'Foundations' },
  { id: 'foundations', label: 'Matrix' },
  { id: 'components', label: 'Components' },
  { id: 'conventions', label: 'Conventions' },
]

const chapters = [
  { id: 'contract', num: '01', label: 'Contract', pillar: 'contract' },
  { id: 'proportion', num: '02', label: 'Proportion', pillar: 'contract' },
  { id: 'space', num: '03', label: 'Space', pillar: 'contract' },
  { id: 'line', num: '04', label: 'Line', pillar: 'contract' },
  { id: 'type', num: '05', label: 'Type', pillar: 'contract' },
  { id: 'motion', num: '06', label: 'Motion', pillar: 'contract' },
  { id: 'elevation', num: '07', label: 'Elevation', pillar: 'contract' },
  { id: 'glass', num: '08', label: 'Glass', pillar: 'contract' },
  { id: 'color', num: '09', label: 'Color', pillar: 'contract' },
  { id: 'grid', num: '10', label: 'Grid & Layout', pillar: 'contract' },
  { id: 'focus', num: '11', label: 'Focus', pillar: 'contract' },
  { id: 'foundations', num: '12', label: 'Matrix', pillar: 'foundations' },
  { id: 'components', num: '13', label: 'Components', pillar: 'components' },
  { id: 'conventions', num: '14', label: 'Conventions', pillar: 'conventions' },
]

const activeChapter = ref('contract')
const activePillar = ref('contract')
const chipSelected = ref(true)

// Live @vanduo-oss/vd3 interactive specimen bindings
const vdModalOpen = ref(false)
const demoTokenInput = ref('space.fib-21')
const demoBasisClass = ref<'A' | 'B' | 'C'>('A')
const basisSelectOptions = [
  { value: 'A' as const, label: 'Class A — Pure Fibonacci / φ' },
  { value: 'B' as const, label: 'Class B — φ-Anchored Ergonomic' },
  { value: 'C' as const, label: 'Class C — Registered Exception' },
]
const demoAccordionOpen = ref('spec-a')
const accordionItems = [
  {
    id: 'spec-a',
    title: 'VdAccordion — Adaptive Fibonacci Motion (144ms)',
    content: 'Dogfooding @vanduo-oss/vd3 <VdAccordion> with W3C APG aria-expanded & aria-controls.',
  },
  {
    id: 'spec-b',
    title: 'Zero-JS <details> Disclosure Companion',
    content: 'Normative pure HTML/CSS fallback operates identically without hydration.',
  },
]
const demoTableCols = [
  { key: 'step', label: 'Step' },
  { key: 'px', label: 'px' },
  { key: 'role', label: 'Normative Role' },
]
const demoTableRows = [
  { step: 'F₈', px: '21px', role: 'Section & card gutter' },
  { step: 'L₁₃', px: '521px', role: 'Dialog max-width' },
  { step: 'F₁₆', px: '987px', role: 'Reading column ceiling' },
]

// Interactive Dialog specimen state
const demoDialogRef = ref<HTMLDialogElement | null>(null)
const dialogOpen = ref(false)
const dialogStatus = ref('Native <dialog> closed')

function openDemoDialog() {
  const dlg = demoDialogRef.value
  if (!dlg) return
  if (typeof dlg.showModal === 'function') {
    if (!dlg.open) dlg.showModal()
  } else {
    dlg.setAttribute('open', '')
  }
  dialogOpen.value = true
  dialogStatus.value = 'Modal top-layer open (Esc to dismiss)'
}

function closeDemoDialog() {
  const dlg = demoDialogRef.value
  if (!dlg) return
  if (typeof dlg.close === 'function') {
    if (dlg.open) dlg.close('dismiss')
  } else {
    dlg.removeAttribute('open')
  }
  dialogOpen.value = false
  dialogStatus.value = 'Closed via button / Esc; focus restored'
}

function confirmDemoDialog() {
  closeDemoDialog()
  spawnToast('success', 'Contract acknowledged', 'W3C APG modal focus restored to trigger.')
}

function onDialogClose() {
  dialogOpen.value = false
  dialogStatus.value = 'Closed; native returnFocus restored'
}

// Interactive Toast notifications powered by @vanduo-oss/vd3 useToast()
const toast = useToast()

function spawnToast(variant: 'success' | 'info' | 'warning', title: string, message: string) {
  toast[variant](message, {
    title,
    duration: 4181,
    position: 'bottom-right',
    dismissible: true,
  })
}

// Interactive Code Block copy state
const copiedKey = ref<string | null>(null)
let copyTimer: number | undefined

async function copySnippet(key: string, text: string) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
    } else {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
  } catch {
    // Graceful fallback if clipboard API is denied in restricted frames
  }
  copiedKey.value = key
  if (copyTimer !== undefined) window.clearTimeout(copyTimer)
  copyTimer = window.setTimeout(() => {
    if (copiedKey.value === key) copiedKey.value = null
  }, 1597)
}

function selectChapter(id: string) {
  activeChapter.value = id
  const found = chapters.find((c) => c.id === id)
  if (found) activePillar.value = found.pillar
}

function onNavigatePillar(pillarId: string) {
  activePillar.value = pillarId
  activeChapter.value = pillarId
}

let observer: IntersectionObserver | null = null

onMounted(() => {
  const hashId = window.location.hash.replace(/^#/, '')
  if (hashId) selectChapter(hashId)

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]?.target
        if (top && top.id) {
          const match = chapters.find((c) => c.id === top.id)
          if (match) {
            activeChapter.value = match.id
            activePillar.value = match.pillar
          }
        }
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0 },
    )
    for (const ch of chapters) {
      const el = document.getElementById(ch.id)
      if (el) observer.observe(el)
    }
  }
})

onUnmounted(() => {
  observer?.disconnect()
  if (copyTimer !== undefined) window.clearTimeout(copyTimer)
})

const componentSnippets = {
  button: '<button type="button" class="vd-btn vd-btn--primary">Save Token</button>',
  dialog: '<dialog class="vd-dialog" aria-labelledby="dlg-title">...</dialog>',
  card: '<article class="vd-card vd-card--elevated"><div class="vd-card-body">...</div></article>',
  form: '<label for="tok-in" class="vd-label">Token</label><input id="tok-in" class="vd-input" />',
  badge: '<span class="vd-badge vd-badge--info">Class A</span>',
  navbar: '<nav class="vd-navbar" aria-label="Secondary">...</nav>',
  accordion: '<details class="vd-accordion"><summary class="vd-accordion-summary">Spec</summary></details>',
  table: '<div class="vd-table-container" tabindex="0"><table class="vd-table">...</table></div>',
  code: '<pre class="vd-code" data-language="css" tabindex="0"><code>:root { --vd3-phi: 1.618; }</code></pre>',
  toast: '<div class="vd-toast vd-toast--success" role="status">Verified</div>',
  layout: '<div class="vd-container-lg vd-split-golden">...</div>',
}
</script>

<template>
  <a href="#main-content" class="vd-skip-link">Skip to main specification</a>
  <SiteNavbar :links="pillars" :active-id="activePillar" @navigate="onNavigatePillar" />

  <div class="doc-layout">
    <aside class="doc-toc" aria-label="Chapter Table of Contents">
      <div id="doc-toc-title" class="doc-toc-title">Chapters (14)</div>
      <nav aria-labelledby="doc-toc-title">
        <ol class="doc-toc-list">
          <li v-for="ch in chapters" :key="ch.id">
            <a
              :href="'#' + ch.id"
              class="doc-toc-link"
              :aria-current="activeChapter === ch.id ? 'location' : undefined"
              :class="{ 'is-active': activeChapter === ch.id }"
              @click="selectChapter(ch.id)"
            >
              <span class="doc-toc-num">{{ ch.num }}</span>
              <span>{{ ch.label }}</span>
            </a>
          </li>
        </ol>
      </nav>
    </aside>

    <main id="main-content" class="doc-main">
      <!-- HERO -->
      <section id="overview" class="hero">
        <h1>VD3 UI CORE — The Golden-Ratio Web Design Bible</h1>
        <p class="lead">
          First principles, mathematical proportions, layered CSS component primitives, and normative
          W3C DTCG tokens for the <strong>vd3</strong> design system. Fibonacci-first — conventional
          only where web standards and human ergonomics demand it. Built cleanly for both human
          engineers and machine agents.
        </p>
        <VdCard glass class="phi-card">
          <span class="phi-eq">φ = (1 + √5) ⁄ 2 = 1.6180339887…</span>
          <VdChip size="sm"><span class="vd-chip-label"><strong>Golden angle</strong> <span>137.5077640…°</span></span></VdChip>
          <VdChip size="sm"><span class="vd-chip-label"><strong>√φ</strong> <span>1.272 — type steps</span></span></VdChip>
          <VdChip size="sm"><span class="vd-chip-label"><strong>Lucas L₁₃ / L₁₅</strong> <span>521px / 1364px</span></span></VdChip>
        </VdCard>
        <div class="hero-meta">
          <span><strong>3</strong> basis classes — A / B / C (No Class D)</span>
          <span><strong>11</strong> zero-framework core CSS modules</span>
          <span><strong>W3C APG</strong>-normative keyboard &amp; ARIA</span>
          <span><strong>W3C DTCG 2025.10</strong> token registry</span>
        </div>
        <div class="hero-links">
          <a href="/tokens/vd3.tokens.json" class="vd-btn vd-btn--sm vd-btn--primary">DTCG Tokens JSON</a>
          <a href="/tokens/schema.json" class="vd-btn vd-btn--sm vd-btn--outline">Token Schema JSON</a>
          <a href="#components" class="vd-btn vd-btn--sm vd-btn--outline">Jump to Components</a>
        </div>
        <p class="footnote">
          Markdown documents in <code>foundations/</code>, <code>components/</code>, and
          <code>conventions/</code> alongside <code>tokens/vd3.tokens.json</code> are the single
          authoritative source of truth.
        </p>
      </section>

      <!-- 01 CONTRACT -->
      <section id="contract" class="doc-section">
        <h2><span class="n">01</span> The Proportional Contract <VdBadge variant="primary" pill>A/B/C</VdBadge></h2>
        <MdDoc :source="principlesMd" />
      </section>

      <!-- 02 PROPORTION -->
      <section id="proportion" class="doc-section">
        <h2><span class="n">02</span> The Golden Spine <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <ProportionDemos />
        <MdDoc :source="proportionMd" />
      </section>

      <!-- 03 SPACE -->
      <section id="space" class="doc-section">
        <h2><span class="n">03</span> Spacing <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="warning" pill>C-01 small steps</VdBadge></h2>
        <p class="lead">
          One normative Fibonacci ladder. Adjacent steps converge toward φ; physical pixel sub-steps
          below 8px follow Registered Exception C-01.
        </p>
        <SpacingDemo />
      </section>

      <!-- 04 LINE -->
      <section id="line" class="doc-section">
        <h2><span class="n">04</span> Line Weights <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <p class="lead">Four border weights from the Fibonacci sequence (1, 2, 3, 5px).</p>
        <LineDemo />
        <MdDoc :source="lineMd" />
      </section>

      <!-- 05 TYPE -->
      <section id="type" class="doc-section">
        <h2><span class="n">05</span> Typography <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <TypeDemo />
        <MdDoc :source="typographyMd" />
      </section>

      <!-- 06 MOTION -->
      <section id="motion" class="doc-section">
        <h2><span class="n">06</span> Motion <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <MotionDemo />
        <MdDoc :source="motionMd" />
      </section>

      <!-- 07 ELEVATION -->
      <section id="elevation" class="doc-section">
        <h2><span class="n">07</span> Elevation <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <p class="lead">Shadow offsets and blurs derive from consecutive Fibonacci pairs (F_k, F_k+2).</p>
        <ElevationDemo />
        <MdDoc :source="elevationMd" />
      </section>

      <!-- 08 GLASS -->
      <section id="glass" class="doc-section">
        <h2><span class="n">08</span> Seemore Glass <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="warning" pill>C-02 blur cap</VdBadge></h2>
        <p class="lead">Frosted translucency in Fibonacci strength steps with mandatory GPU-safe cap C-02.</p>
        <GlassDemo />
        <MdDoc :source="glassMd" />
      </section>

      <!-- 09 COLOR -->
      <section id="color" class="doc-section">
        <h2><span class="n">09</span> Color <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="info" pill>class B — Open Color default</VdBadge></h2>
        <p class="lead">
          Dual-theme semantic roles enforce WCAG AAA primary copy (≥7.0:1) and WCAG AA secondary copy
          (≥4.5:1), paired with a golden-angle 137.508° harmonic palette.
        </p>
        <ColorDemo />
        <div style="height: var(--vd3-space-fib-21, 1.3125rem)"></div>
        <MdDoc :source="colorMd" />
      </section>

      <!-- 10 GRID & LAYOUT -->
      <section id="grid" class="doc-section">
        <h2><span class="n">10</span> Grid &amp; Layout Primitives <VdBadge variant="info" pill>class B</VdBadge> <VdBadge variant="primary" pill>golden modes</VdBadge></h2>
        <p class="lead">Conventional 12-column responsiveness combined with Class A golden-split containers.</p>
        <GridDemo />
        <MdDoc :source="layoutMd" />
      </section>

      <!-- 11 FOCUS -->
      <section id="focus" class="doc-section">
        <h2><span class="n">11</span> Focus &amp; Accessibility <VdBadge variant="info" pill>WCAG 2.2 AA/AAA</VdBadge></h2>
        <MdDoc :source="focusMd" />
      </section>

      <!-- 12 FOUNDATION COVERAGE MATRIX -->
      <section id="foundations" class="doc-section">
        <h2><span class="n">12</span> Foundation Coverage Matrix <VdBadge variant="primary" pill>DTCG</VdBadge></h2>
        <FoundationTable />
      </section>

      <!-- 13 COMPONENTS -->
      <section id="components" class="doc-section">
        <h2>
          <span class="n">13</span> Components — 11 Normative UI Primitives
          <VdBadge variant="primary" pill>Zero-Framework CSS</VdBadge>
          <VdBadge variant="info" pill>@vanduo-oss/vd3 Live</VdBadge>
        </h2>
        <p class="lead">
          Each primitive lives inside <code>@layer vd3.components</code> or <code>@layer vd3.layout</code>,
          consumes only DTCG tokens from <code>tokens/vd3.tokens.json</code>, and exposes machine-readable
          <code>data-vd-*</code> contracts alongside live <code>@vanduo-oss/vd3</code> Vue components.
        </p>

        <div class="specimen-grid">
          <article
            class="specimen-card"
            data-vd-component="button"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-8 space.fib-13 radius.fib-5 color.role.interactive color.role.focus"
          >
            <div class="specimen-header">
              <h3>Button (<code>.vd-btn</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview">
              <VdButton
                variant="primary"
                @click="spawnToast('info', 'Primary button', 'Class A interactive trigger activated.')"
              >
                Primary Action
              </VdButton>
              <VdButton variant="secondary" outline>Secondary</VdButton>
              <VdButton variant="ghost" disabled>Disabled</VdButton>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.button"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy button HTML snippet" @click="copySnippet('button', componentSnippets.button)">
                {{ copiedKey === 'button' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="dialog"
            data-vd-basis-class="B"
            data-vd-tokens="container.sm radius.fib-13 shadow.5 z.modal"
          >
            <div class="specimen-header">
              <h3>Dialog (<code>.vd-dialog</code> / <code>VdModal</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--stack">
              <div class="specimen-actions">
                <button
                  id="demo-dialog-trigger"
                  type="button"
                  class="vd-btn vd-btn--outline vd-btn--sm"
                  aria-haspopup="dialog"
                  aria-controls="demo-modal-dialog"
                  :aria-expanded="dialogOpen"
                  @click="openDemoDialog"
                >
                  Open Live Modal
                </button>
                <VdButton size="sm" variant="primary" @click="vdModalOpen = true">
                  Open VdModal
                </VdButton>
              </div>
              <span class="specimen-meta">{{ dialogStatus }}</span>
              <dialog
                ref="demoDialogRef"
                id="demo-modal-dialog"
                class="vd-dialog"
                aria-labelledby="demo-dlg-title"
                @close="onDialogClose"
              >
                <div class="vd-dialog-header">
                  <p id="demo-dlg-title" class="vd-dialog-title">VD3 Native Modal Contract</p>
                  <button
                    type="button"
                    class="vd-btn vd-btn--ghost vd-btn--sm vd-dialog-close"
                    aria-label="Close dialog"
                    @click="closeDemoDialog"
                  >
                    ×
                  </button>
                </div>
                <div class="vd-dialog-body">
                  <p>
                    Opened via native <code>&lt;dialog&gt;.showModal()</code> inside the browser
                    top layer: Lucas L₁₃ <code>521px</code> max-width, frosted C-02 glass backdrop,
                    automatic <code>Esc</code> dismissal, and focus restoration on close.
                  </p>
                </div>
                <div class="vd-dialog-footer">
                  <button type="button" class="vd-btn vd-btn--outline vd-btn--sm" @click="closeDemoDialog">Cancel</button>
                  <button type="button" class="vd-btn vd-btn--primary vd-btn--sm" @click="confirmDemoDialog">Acknowledge</button>
                </div>
              </dialog>
              <VdModal v-model:open="vdModalOpen" title="VD3 @vanduo-oss/vd3 Modal" glass>
                <p>
                  Dogfooding <code>&lt;VdModal glass&gt;</code> with focus trap, <code>Esc</code>
                  dismissal, and frosted C-02 glass backdrop.
                </p>
                <template #footer>
                  <VdButton size="sm" outline @click="vdModalOpen = false">Close</VdButton>
                  <VdButton
                    size="sm"
                    variant="primary"
                    @click="vdModalOpen = false; spawnToast('success', 'VdModal confirmed', 'Focus restored cleanly to trigger.')"
                  >
                    Confirm
                  </VdButton>
                </template>
              </VdModal>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.dialog"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy dialog HTML snippet" @click="copySnippet('dialog', componentSnippets.dialog)">
                {{ copiedKey === 'dialog' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="card"
            data-vd-basis-class="A"
            data-vd-tokens="math.phi radius.fib-8 space.fib-21 shadow.2"
          >
            <div class="specimen-header">
              <h3>Card (<code>.vd-card</code> / <code>VdCard</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <VdCard glass>
                Golden proportion card surface bound to Fibonacci shadow level 2 and frosted glass elevation.
              </VdCard>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.card"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy card HTML snippet" @click="copySnippet('card', componentSnippets.card)">
                {{ copiedKey === 'card' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="form"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-8 space.fib-13 radius.fib-5 color.role.border color.role.critical"
          >
            <div class="specimen-header">
              <h3>Form Controls (<code>VdInput</code> / <code>VdSelect</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--stack">
              <VdInput
                id="demo-token-input"
                v-model="demoTokenInput"
                label="Token Identifier"
                placeholder="space.fib-21"
                hint="Normative dot-separated DTCG path"
              />
              <div class="demo-select-field">
                <label for="demo-basis-select" class="vd-label">Basis Class</label>
                <VdSelect
                  id="demo-basis-select"
                  v-model="demoBasisClass"
                  :options="basisSelectOptions"
                />
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.form"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy form HTML snippet" @click="copySnippet('form', componentSnippets.form)">
                {{ copiedKey === 'form' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="badge"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-3 space.fib-8 radius.full type.size.xs"
          >
            <div class="specimen-header">
              <h3>Badges &amp; Chips (<code>VdBadge</code> / <code>VdChip</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview">
              <VdBadge variant="info">Info</VdBadge>
              <VdBadge variant="success">Pass</VdBadge>
              <VdBadge variant="warning">Exception C</VdBadge>
              <VdBadge variant="error">Critical</VdBadge>
              <VdChip
                size="sm"
                clickable
                :outline="!chipSelected"
                :variant="chipSelected ? 'primary' : 'secondary'"
                @click="chipSelected = !chipSelected"
              >
                Filter: φ {{ chipSelected ? 'On' : 'Off' }}
              </VdChip>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.badge"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy badge HTML snippet" @click="copySnippet('badge', componentSnippets.badge)">
                {{ copiedKey === 'badge' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="navbar"
            data-vd-basis-class="B"
            data-vd-tokens="z.sticky space.fib-13 color.role.canvas line.hair"
          >
            <div class="specimen-header">
              <h3>Navbar (<code>.vd-navbar</code> / <code>VdNavbar</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview">
              <VdBadge variant="info">z-sticky: 1020</VdBadge>
              <VdChip size="sm" outline>Auto / Light / Dark + Customizer</VdChip>
              <span>Pairs sticky glassmorphic header with anchor scroll-margin-top compensation.</span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.navbar"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy navbar HTML snippet" @click="copySnippet('navbar', componentSnippets.navbar)">
                {{ copiedKey === 'navbar' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="accordion"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-13 space.fib-21 radius.fib-8 motion.144"
          >
            <div class="specimen-header">
              <h3>Accordion (<code>.vd-accordion</code> / <code>VdAccordion</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--stack">
              <VdAccordion
                v-model="demoAccordionOpen"
                :items="accordionItems"
                exclusive
              />
              <details class="vd-accordion">
                <summary class="vd-accordion-summary">Native disclosure contract (144ms)</summary>
                <div class="vd-accordion-content">Zero JS required for keyboard Enter/Space toggling.</div>
              </details>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.accordion"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy accordion HTML snippet" @click="copySnippet('accordion', componentSnippets.accordion)">
                {{ copiedKey === 'accordion' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="table"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-8 space.fib-13 line.hair color.role.layer"
          >
            <div class="specimen-header">
              <h3>Data Table (<code>.vd-table</code> / <code>VdTable</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-table-container" tabindex="0" role="region" aria-label="Sample metric table">
                <VdTable
                  :columns="demoTableCols"
                  :rows="demoTableRows"
                  striped
                  hover
                />
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.table"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy table HTML snippet" @click="copySnippet('table', componentSnippets.table)">
                {{ copiedKey === 'table' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="code"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-13 radius.fib-8 math.golden-angle color.role.layer"
          >
            <div class="specimen-header">
              <h3>Code Block (<code>.vd-code</code> / <code>VdCodeSnippet</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <VdCodeSnippet
                :collapsible="true"
                toggle-label="Inspect VdCodeSnippet Multi-Tab"
                :html="componentSnippets.code"
                css=":root { --vd3-phi: 1.6180339887; }"
              />
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.code"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy code block snippet" @click="copySnippet('code', componentSnippets.code)">
                {{ copiedKey === 'code' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="toast"
            data-vd-basis-class="A"
            data-vd-tokens="z.toast space.fib-13 radius.fib-8 shadow.4 motion.233"
          >
            <div class="specimen-header">
              <h3>Toast (<code>.vd-toast</code> / <code>useToast()</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--stack">
              <div class="specimen-actions">
                <VdButton
                  size="sm"
                  variant="primary"
                  @click="spawnToast('success', 'Tokens verified', '368/368 DTCG assertions passed.')"
                >
                  Trigger Live Toast
                </VdButton>
                <VdButton
                  size="sm"
                  outline
                  @click="spawnToast('info', 'Golden spine active', 'Container L₁₅ = 1364px, φ = 1.618.')"
                >
                  Trigger Info Toast
                </VdButton>
              </div>
              <div class="vd-toast vd-toast--success" role="status">
                <div class="vd-toast-content">
                  <div class="vd-toast-title">Static specimen preview</div>
                  <p class="vd-toast-message">Tokens verified (368/368) · Auto-dismisses live notifications after 4181ms (F₁₉).</p>
                </div>
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.toast"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy toast HTML snippet" @click="copySnippet('toast', componentSnippets.toast)">
                {{ copiedKey === 'toast' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            class="specimen-card"
            data-vd-component="layout"
            data-vd-basis-class="B"
            data-vd-tokens="container.lg space.fib-21 math.phi math.inv-phi"
          >
            <div class="specimen-header">
              <h3>Layout Engine (<code>.vd-split-golden</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview">
              <span>61.8% primary measure paired with 38.2% secondary rail inside 987px Lucas/Fibonacci container.</span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.layout"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy layout HTML snippet" @click="copySnippet('layout', componentSnippets.layout)">
                {{ copiedKey === 'layout' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>
        </div>

        <h3>Dialog Behavioral Specification (W3C APG Modal Pattern)</h3>
        <MdDoc :source="dialogMd" />
      </section>

      <!-- 14 CONVENTIONS -->
      <section id="conventions" class="doc-section">
        <h2><span class="n">14</span> Conventions — Naming, Mappings &amp; Content <VdBadge variant="info" pill>Normative</VdBadge></h2>
        <h3>Public &amp; Token Naming</h3>
        <MdDoc :source="namingMd" />
        <h3>Cross-System Token Mappings</h3>
        <MdDoc :source="mappingsMd" />
        <h3>Editorial Tone &amp; Content Strings</h3>
        <MdDoc :source="contentMd" />
      </section>
    </main>
  </div>

  <!-- Live Toast Portal powered by @vanduo-oss/vd3 -->
  <VdToastContainer />

  <footer>
    <div class="inner">
      <p>
        <strong>vd3-ui-core</strong> · Specification v1.0.0-draft · Markdown specs and W3C DTCG
        <code>tokens/vd3.tokens.json</code> are the normative source of truth. Library conformance:
        <code>"implements": "vd3-ui-core@^1.0"</code>.
      </p>
    </div>
  </footer>
</template>
