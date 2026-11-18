<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
  type DocSearchDoc,
} from '@vanduo-oss/vd3'
import SiteNavbar from './components/SiteNavbar.vue'
import SiteDocSearch from './components/SiteDocSearch.vue'
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
import specIndexMd from '@spec/components/SPEC.md?raw'
import specLayoutMd from '@spec/components/layout/spec.md?raw'
import specButtonMd from '@spec/components/button/spec.md?raw'
import specDialogMd from '@spec/components/dialog/spec.md?raw'
import specCardMd from '@spec/components/card/spec.md?raw'
import specInputMd from '@spec/components/input/spec.md?raw'
import specSelectMd from '@spec/components/select/spec.md?raw'
import specCheckboxMd from '@spec/components/checkbox/spec.md?raw'
import specRadioMd from '@spec/components/radio/spec.md?raw'
import specBadgeMd from '@spec/components/badge/spec.md?raw'
import specNavbarMd from '@spec/components/navbar/spec.md?raw'
import specAccordionMd from '@spec/components/accordion/spec.md?raw'
import specTableMd from '@spec/components/table/spec.md?raw'
import specCodeMd from '@spec/components/code/spec.md?raw'
import specToastMd from '@spec/components/toast/spec.md?raw'
import specSwitchMd from '@spec/components/switch/spec.md?raw'
import specAlertMd from '@spec/components/alert/spec.md?raw'
import specTabsMd from '@spec/components/tabs/spec.md?raw'
import specDrawerMd from '@spec/components/drawer/spec.md?raw'
import specTooltipMd from '@spec/components/tooltip/spec.md?raw'
import specPopoverMd from '@spec/components/popover/spec.md?raw'
import specMenuMd from '@spec/components/menu/spec.md?raw'
import specContextMenuMd from '@spec/components/context-menu/spec.md?raw'
import specMenubarMd from '@spec/components/menubar/spec.md?raw'
import specBreadcrumbMd from '@spec/components/breadcrumb/spec.md?raw'
import specPaginationMd from '@spec/components/pagination/spec.md?raw'
import specAvatarMd from '@spec/components/avatar/spec.md?raw'
import specProgressMd from '@spec/components/progress/spec.md?raw'
import specSpinnerMd from '@spec/components/spinner/spec.md?raw'
import specSkeletonMd from '@spec/components/skeleton/spec.md?raw'
import specSliderMd from '@spec/components/slider/spec.md?raw'
import specDatepickerMd from '@spec/components/datepicker/spec.md?raw'
import specTimepickerMd from '@spec/components/timepicker/spec.md?raw'
import specUploadMd from '@spec/components/upload/spec.md?raw'
import specCarouselMd from '@spec/components/carousel/spec.md?raw'
import specToolbarMd from '@spec/components/toolbar/spec.md?raw'
import specSegmentedMd from '@spec/components/segmented/spec.md?raw'
import specHoverCardMd from '@spec/components/hover-card/spec.md?raw'
import specTourMd from '@spec/components/tour/spec.md?raw'
import specIconMd from '@spec/components/icon/spec.md?raw'
import iconsMd from '@spec/foundations/icons.md?raw'
import densityMd from '@spec/foundations/density.md?raw'
import dataVizMd from '@spec/foundations/data-viz.md?raw'
import patternsMd from '@spec/patterns/PATTERNS.md?raw'
import patternEmptyStatesMd from '@spec/patterns/empty-states.md?raw'
import patternAuthFlowsMd from '@spec/patterns/auth-flows.md?raw'
import patternAppShellMd from '@spec/patterns/app-shell.md?raw'
import patternOnboardingMd from '@spec/patterns/onboarding.md?raw'
import patternDisabledMd from '@spec/patterns/disabled-read-only.md?raw'
import namingMd from '@spec/conventions/naming.md?raw'
import mappingsMd from '@spec/conventions/mappings.md?raw'
import contentMd from '@spec/conventions/content.md?raw'

const componentSpecs = [
  { slug: 'layout', src: specLayoutMd },
  { slug: 'button', src: specButtonMd },
  { slug: 'dialog', src: specDialogMd },
  { slug: 'card', src: specCardMd },
  { slug: 'input', src: specInputMd },
  { slug: 'select', src: specSelectMd },
  { slug: 'checkbox', src: specCheckboxMd },
  { slug: 'radio', src: specRadioMd },
  { slug: 'badge', src: specBadgeMd },
  { slug: 'navbar', src: specNavbarMd },
  { slug: 'accordion', src: specAccordionMd },
  { slug: 'table', src: specTableMd },
  { slug: 'code', src: specCodeMd },
  { slug: 'toast', src: specToastMd },
  { slug: 'switch', src: specSwitchMd },
  { slug: 'alert', src: specAlertMd },
  { slug: 'tabs', src: specTabsMd },
  { slug: 'drawer', src: specDrawerMd },
  { slug: 'tooltip', src: specTooltipMd },
  { slug: 'popover', src: specPopoverMd },
  { slug: 'menu', src: specMenuMd },
  { slug: 'context-menu', src: specContextMenuMd },
  { slug: 'menubar', src: specMenubarMd },
  { slug: 'breadcrumb', src: specBreadcrumbMd },
  { slug: 'pagination', src: specPaginationMd },
  { slug: 'avatar', src: specAvatarMd },
  { slug: 'progress', src: specProgressMd },
  { slug: 'spinner', src: specSpinnerMd },
  { slug: 'skeleton', src: specSkeletonMd },
  { slug: 'slider', src: specSliderMd },
  { slug: 'datepicker', src: specDatepickerMd },
  { slug: 'timepicker', src: specTimepickerMd },
  { slug: 'upload', src: specUploadMd },
  { slug: 'carousel', src: specCarouselMd },
  { slug: 'toolbar', src: specToolbarMd },
  { slug: 'segmented', src: specSegmentedMd },
  { slug: 'hover-card', src: specHoverCardMd },
  { slug: 'tour', src: specTourMd },
  { slug: 'icon', src: specIconMd },
]


const pillars = [
  { id: 'contract', label: 'Foundations' },
  { id: 'foundations', label: 'Matrix' },
  { id: 'components', label: 'Components' },
  { id: 'conventions', label: 'Conventions' },  { id: 'patterns', label: 'Patterns' },
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
  { id: 'icons', num: '12', label: 'Icons', pillar: 'contract' },
  { id: 'density', num: '13', label: 'Density', pillar: 'contract' },
  { id: 'data-viz', num: '14', label: 'Data Viz', pillar: 'contract' },
  { id: 'foundations', num: '15', label: 'Matrix', pillar: 'foundations' },
  { id: 'components', num: '16', label: 'Components', pillar: 'components' },
  { id: 'conventions', num: '17', label: 'Conventions', pillar: 'conventions' },
  { id: 'patterns', num: '18', label: 'Patterns', pillar: 'patterns' },
];

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
  document.documentElement.dataset.vd3Hydrated = 'true'
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

const drawerOpen = ref(false)
const drawerTriggerRef = ref<HTMLButtonElement | null>(null)
const drawerCloseRef = ref<HTMLButtonElement | null>(null)
const switchPrimaryOn = ref(true)
const switchCompactOn = ref(false)
const activeSpecimenTab = ref<'a' | 'b'>('a')

function openDemoDrawer() {
  drawerOpen.value = true
  window.requestAnimationFrame(() => drawerCloseRef.value?.focus())
}

function closeDemoDrawer() {
  drawerOpen.value = false
  window.requestAnimationFrame(() => drawerTriggerRef.value?.focus())
}

const componentSnippets: Record<string, string> = {
  button: '<button type="button" class="vd-btn vd-btn--primary">Save Token</button>',
  dialog:
    '<dialog class="vd-dialog" aria-labelledby="dlg-title"><div class="vd-dialog-header"><h2 id="dlg-title" class="vd-dialog-title">Confirm</h2><button type="button" class="vd-dialog-close" aria-label="Close">×</button></div><div class="vd-dialog-body"><p>Lucas L13 modal contract.</p></div></dialog>',
  card: '<article class="vd-card vd-card--elevated"><div class="vd-card-body">Golden proportion card surface bound to shadow.2.</div></article>',
  form: '<label for="tok-in" class="vd-label">Token</label><input id="tok-in" class="vd-input" />',
  badge: '<span class="vd-badge vd-badge--info">Class A</span>',
  navbar:
    '<nav class="vd-navbar" aria-label="Secondary"><div class="vd-navbar-container"><a href="#overview" class="vd-navbar-brand">vd3</a><div class="vd-navbar-menu"><a class="vd-nav-link" href="#foundations" aria-current="page">Foundations</a></div></div></nav>',
  accordion: '<details class="vd-accordion"><summary class="vd-accordion-summary">Spec</summary><div class="vd-accordion-content">Disclosure body.</div></details>',
  table:
    '<div class="vd-table-container" tabindex="0" role="region" aria-label="Metric table"><table class="vd-table"><thead><tr><th scope="col">Step</th><th scope="col">Value</th></tr></thead><tbody><tr><th scope="row">F8</th><td>21px</td></tr></tbody></table></div>',
  code: '<pre class="vd-code" data-language="css" tabindex="0"><code>:root { --vd3-phi: 1.618; }</code></pre>',
  toast: '<div class="vd-toast vd-toast--success" role="status">Verified</div>',
  switch:
    '<button type="button" role="switch" aria-checked="false" class="vd-switch" aria-label="Enable option"><span class="vd-switch-thumb"></span></button>',
  alert:
    '<div class="vd-alert vd-alert--critical" role="alert"><span class="vd-alert-icon" aria-hidden="true">!</span><div class="vd-alert-content"><p class="vd-alert-title">Critical Notice</p><p class="vd-alert-body">Semantic role token check failed.</p></div></div>',
  tabs:
    '<div class="vd-tabs" role="tablist" aria-label="Views"><button type="button" class="vd-tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">Tokens</button><button type="button" class="vd-tab" role="tab" id="t2" aria-selected="false" aria-controls="p2" tabindex="-1">CSS</button></div><div class="vd-tab-panel" role="tabpanel" id="p1" aria-labelledby="t1">DTCG content</div>',
  drawer:
    '<aside class="vd-drawer vd-drawer--end" role="dialog" aria-modal="true" aria-labelledby="drw-title" data-open="true"><div class="vd-drawer-header"><h2 id="drw-title" class="vd-drawer-title">Details</h2><button type="button" class="vd-drawer-close" aria-label="Close">×</button></div><div class="vd-drawer-body"><p>Sliding panel.</p></div></aside>',
  tooltip: '<span class="vd-tooltip" role="tooltip">Hint</span>',
  popover:
    '<div class="vd-popover" data-placement="bottom" popover="auto"><div class="vd-popover-header">Details</div><div class="vd-popover-body">Anchored disclosure panel.</div></div>',
  menu: '<div class="vd-menu" role="menu"><button type="button" class="vd-menu-item" role="menuitem">Rename</button><button type="button" class="vd-menu-item" role="menuitem">Duplicate</button></div>',
  'context-menu':
    '<div class="vd-context-menu" role="menu"><button type="button" class="vd-context-menu-item" role="menuitem">Inspect</button><button type="button" class="vd-context-menu-item vd-context-menu-item--danger" role="menuitem">Remove</button></div>',
  menubar:
    '<div class="vd-menubar" role="menubar" aria-label="Editor"><button type="button" class="vd-menubar-item" role="menuitem" aria-haspopup="true" aria-expanded="false">File</button><button type="button" class="vd-menubar-item" role="menuitem">Edit</button></div>',
  breadcrumb:
    '<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb"><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#foundations">Foundations</a></li><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#components" aria-current="page">Color</a></li></ol></nav>',
  pagination:
    '<nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list"><li class="vd-pagination-item"><a class="vd-pagination-link" href="#page-1" aria-current="page">1</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#page-2">2</a></li></ul></nav>',
  avatar: '<span class="vd-avatar vd-avatar--round"><span class="vd-avatar-initials">VD</span></span>',
  progress:
    '<div class="vd-progress" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" aria-label="Progress"><div class="vd-progress-bar" style="--_vd-progress-value: 62%"></div></div>',
  spinner: '<span class="vd-spinner" role="status" aria-label="Loading"></span>',
  skeleton: '<div class="vd-skeleton vd-skeleton--text"></div>',
  slider: '<input type="range" class="vd-slider" min="0" max="100" aria-label="Volume">',
  datepicker:
    '<div class="vd-datepicker" role="dialog" aria-label="Choose date"><div class="vd-datepicker-header"><span class="vd-datepicker-title">November 2026</span></div><div class="vd-datepicker-grid" role="grid"><button type="button" class="vd-datepicker-day" aria-selected="true">16</button><button type="button" class="vd-datepicker-day">17</button></div></div>',
  timepicker: '<div class="vd-timepicker"><div class="vd-timepicker-item" aria-selected="true">09:00</div></div>',
  upload:
    '<label class="vd-upload"><input class="vd-upload-input" type="file" aria-label="Upload files"></label>',
  carousel:
    '<div class="vd-carousel" role="region" aria-roledescription="carousel" aria-label="Slides"><div class="vd-carousel-track" style="--_vd-carousel-index: 0"><div class="vd-carousel-slide">Slide 1</div><div class="vd-carousel-slide">Slide 2</div></div><button type="button" class="vd-carousel-prev" aria-label="Previous slide">‹</button><button type="button" class="vd-carousel-next" aria-label="Next slide">›</button></div>',
  toolbar:
    '<div class="vd-toolbar" role="toolbar" aria-label="Formatting"><div class="vd-toolbar-group"><button type="button" class="vd-toolbar-button" aria-pressed="false">Bold</button><button type="button" class="vd-toolbar-button" aria-pressed="false">Italic</button></div><span class="vd-toolbar-separator" role="separator"></span><button type="button" class="vd-toolbar-button">Link</button></div>',
  segmented:
    '<div class="vd-segmented" role="radiogroup" aria-label="View"><button type="button" class="vd-segmented-item" aria-checked="true">Day</button></div>',
  'hover-card':
    '<div class="vd-hover-card"><p class="vd-hover-card-title">Token Reference</p><p class="vd-hover-card-body">Fibonacci F8 spacing preview.</p></div>',
  tour:
    '<div class="vd-tour" role="dialog" aria-labelledby="tour-title"><h2 id="tour-title" class="vd-tour-title">Step 1 of 3</h2><p class="vd-tour-body">Explore normative DTCG tokens.</p><div class="vd-tour-footer"><span class="vd-tour-counter">1 / 3</span><div class="vd-tour-actions"><button type="button" class="vd-tour-btn vd-tour-btn--primary">Next</button></div></div></div>',
  icon:
    '<span class="vd-icon-pair"><span class="vd-icon vd-icon--md vd-icon--primary" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/></svg></span><span>Golden Ratio</span></span>',
  layout:
    '<div class="vd-container-lg vd-split-golden"><section class="vd-split-major">61.8% Primary</section><aside class="vd-split-minor">38.2% Secondary</aside></div>',
}

const stripSearchMd = (md: string) =>
  md
    .replace(/^---[\s\S]*?---\r?\n/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*`|_\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const foundationTextMap: Record<string, string> = {
  contract: principlesMd,
  proportion: proportionMd,
  space: 'One normative Fibonacci spacing ladder: space.fib-1 (2px C-01) through space.fib-144 (144px Class A).',
  line: lineMd,
  type: typographyMd,
  motion: motionMd,
  elevation: elevationMd,
  glass: glassMd,
  color: colorMd,
  grid: layoutMd,
  focus: focusMd,
  icons: iconsMd,
  density: densityMd,
  'data-viz': dataVizMd,
  foundations: 'Foundation coverage matrix mapping 17 standard chapters, basis classes A/B/C, and normative DTCG status.',
  components: '36 zero-framework CSS modules (layout engine + 35 primitives), 39 per-slug W3C APG specs, specimens.',
  conventions: 'Public identifier naming (--vd3-* and --vd-* aliases), cross-system token mappings, and editorial copy rules.',
  patterns: patternsMd,
}

const specimenSearchMeta: Record<string, { title: string; summary: string }> = {
  button: { title: 'Button (.vd-btn)', summary: 'Primary, outline, and ghost buttons built on space.fib-8/13 and color.role.interactive.' },
  dialog: { title: 'Dialog (.vd-dialog / VdModal)', summary: 'Native top-layer dialog.showModal(), Lucas L13 521px max-width, Esc dismissal, focus restoration.' },
  card: { title: 'Card (.vd-card)', summary: 'Golden proportion card container with Fibonacci shadow.2 elevation.' },
  form: { title: 'Form Controls (.vd-input / .vd-select)', summary: 'Labeled input, select, checkbox, and radio controls with border and critical tokens.' },
  badge: { title: 'Badges & Chips (.vd-badge / .vd-chip)', summary: 'Status pill badges and toggle chips using radius.full.' },
  navbar: { title: 'Navbar (.vd-navbar)', summary: 'Sticky frosted header bar at z.sticky 1020 with scroll-margin compensation.' },
  accordion: { title: 'Accordion (.vd-accordion)', summary: 'Disclosure accordion with Enter/Space toggling and 144ms motion.' },
  table: { title: 'Data Table (.vd-table)', summary: 'Responsive scrollable table container with th[scope] headers.' },
  code: { title: 'Code Block (.vd-code)', summary: 'Scrollable code block (tabindex="0") with Golden Angle syntax palette.' },
  toast: { title: 'Toast (.vd-toast)', summary: 'Status toast with logical placement modifiers, F13-F14 bounds, and 4181ms auto-dismiss.' },
  switch: { title: 'Switch (.vd-switch)', summary: 'Binary W3C APG switch control using role="switch" and aria-checked.' },
  alert: { title: 'Alert (.vd-alert)', summary: 'Inline banner alert supporting critical and warning status roles.' },
  tabs: { title: 'Tabs (.vd-tabs / .vd-tab)', summary: 'APG tablist with roving tabindex and synchronized tabpanel.' },
  drawer: { title: 'Drawer (.vd-drawer)', summary: 'Dual-mode sliding panel: modal dialog default + opt-in non-modal mode.' },
  tooltip: { title: 'Tooltip (.vd-tooltip)', summary: 'Hover and focus tooltip at z.tooltip with CSS Anchor Positioning support.' },
  popover: { title: 'Popover (.vd-popover)', summary: 'Discrete Popover API surface with :popover-open and anchor placement.' },
  menu: { title: 'Menu (.vd-menu)', summary: 'APG menu with roving focus and danger item variant.' },
  'context-menu': { title: 'Context Menu (.vd-context-menu)', summary: 'Floating context menu anchored to cursor or trigger.' },
  menubar: { title: 'Menubar (.vd-menubar)', summary: 'Horizontal application menubar with popup menu indicators.' },
  breadcrumb: { title: 'Breadcrumb (.vd-breadcrumb)', summary: 'Landmark navigation trail with aria-current="page".' },
  pagination: { title: 'Pagination (.vd-pagination)', summary: 'Page links built on Fibonacci spacing and dual-ring focus indicator.' },
  avatar: { title: 'Avatar (.vd-avatar)', summary: 'Circular initials or media avatar with F8/F9 sizes and status dot.' },
  progress: { title: 'Progress (.vd-progress)', summary: 'Determinate linear progressbar with ARIA value attributes.' },
  spinner: { title: 'Spinner (.vd-spinner)', summary: 'Loading indicator on motion.610 linear rotation and MOB-001 fallback.' },
  skeleton: { title: 'Skeleton (.vd-skeleton)', summary: 'Loading skeleton block respecting reduced-motion settings.' },
  slider: { title: 'Slider (.vd-slider)', summary: 'Native range slider with engine-isolated WebKit/Gecko styles.' },
  datepicker: { title: 'Date Picker (.vd-datepicker)', summary: 'Calendar popup at z.popover with day grid selection.' },
  timepicker: { title: 'Time Picker (.vd-timepicker)', summary: 'Scrollable time option list at z.popover.' },
  upload: { title: 'File Upload (.vd-upload)', summary: 'Drag-and-drop file upload dropzone with Fibonacci spacing and icon sizing.' },
  carousel: { title: 'Carousel (.vd-carousel)', summary: 'Slide deck using motion.377 transitions and prev/next controls.' },
  toolbar: { title: 'Toolbar (.vd-toolbar)', summary: 'Grouped action toolbar with separators and pressed button states.' },
  segmented: { title: 'Segmented (.vd-segmented)', summary: 'Segmented pill radiogroup with checked option highlight.' },
  'hover-card': { title: 'Hover Card (.vd-hover-card)', summary: 'Rich hover preview card anchored at z.popover.' },
  tour: { title: 'Tour (.vd-tour)', summary: 'Guided onboarding step dialog with step counter and navigation.' },
  icon: { title: 'Icon (.vd-icon)', summary: 'Feature #61 SVG/glyph icon primitive: Fibonacci sizes 13/21/34/55px, phi stroke 1.618, semantic ink.' },
  layout: { title: 'Layout Engine (.vd-split-golden)', summary: 'Golden split (61.8% / 38.2%), Lucas/Fibonacci containers, and 12-column responsive grid.' },
}

const patternDocs = [
  { slug: 'empty-states', src: patternEmptyStatesMd },
  { slug: 'auth-flows', src: patternAuthFlowsMd },
  { slug: 'app-shell', src: patternAppShellMd },
  { slug: 'onboarding', src: patternOnboardingMd },
  { slug: 'disabled-read-only', src: patternDisabledMd },
]

const searchDocs = computed<DocSearchDoc[]>(() => [
  ...chapters.map((ch) => ({
    id: ch.id,
    title: `${ch.num} ${ch.label}`,
    category: 'Foundations',
    href: `#${ch.id}`,
    content: stripSearchMd(foundationTextMap[ch.id] ?? '').slice(0, 1400),
    keywords: [ch.id, ch.label, ch.pillar, 'foundation'],
  })),
  ...Object.entries(specimenSearchMeta).map(([slug, meta]) => ({
    id: `specimen-${slug}`,
    title: meta.title,
    category: 'Specimen',
    href: `#specimen-${slug}`,
    content: `${meta.summary} ${componentSnippets[slug] ?? ''}`,
    keywords: [slug, 'specimen', 'component', 'css', 'html'],
  })),
  {
    id: 'spec-index-heading',
    title: 'Component Specification Index',
    category: 'Spec',
    href: '#spec-index-heading',
    content: stripSearchMd(specIndexMd).slice(0, 1400),
    keywords: ['SPEC', 'index', 'components', 'features'],
  },
  ...componentSpecs.map((sp) => ({
    id: `spec-${sp.slug}`,
    title: `${sp.slug} specification`,
    category: 'Spec',
    href: `#spec-${sp.slug}`,
    content: stripSearchMd(sp.src).slice(0, 1200),
    keywords: [sp.slug, 'spec', 'apg', 'aria', 'tokens'],
  })),
  {
    id: 'convention-naming',
    title: 'Public & Token Naming Conventions',
    category: 'Conventions',
    href: '#convention-naming',
    content: stripSearchMd(namingMd).slice(0, 1400),
    keywords: ['naming', 'tokens', '--vd3', '--vd', 'conventions'],
  },
  {
    id: 'convention-mappings',
    title: 'Cross-System Token Mappings',
    category: 'Conventions',
    href: '#convention-mappings',
    content: stripSearchMd(mappingsMd).slice(0, 1400),
    keywords: ['mappings', 'carbon', 'dtcg', 'conventions'],
  },
  {
    id: 'convention-content',
    title: 'Editorial Tone & Content Strings',
    category: 'Conventions',
    href: '#convention-content',
    content: stripSearchMd(contentMd).slice(0, 1400),
    keywords: ['content', 'copy', 'microcopy', 'conventions'],
  },
  {
    id: 'patterns-overview',
    title: 'Patterns — Guidance Over Components',
    category: 'Patterns',
    href: '#patterns',
    content: stripSearchMd(patternsMd).slice(0, 1200),
    keywords: ['patterns', 'guidance'],
  },
  ...patternDocs.map((p) => ({
    id: `pattern-${p.slug}`,
    title: `${p.slug} pattern`,
    category: 'Patterns',
    href: `#pattern-${p.slug}`,
    content: stripSearchMd(p.src).slice(0, 1400),
    keywords: [p.slug, 'pattern', 'guidance'],
  })),
])
</script>

<template>
  <a href="#main-content" class="vd-skip-link">Skip to main specification</a>
  <SiteNavbar :links="pillars" :active-id="activePillar" @navigate="onNavigatePillar" />

  <div class="doc-layout">
    <aside class="doc-toc" aria-label="Chapter Table of Contents">
      <SiteDocSearch :docs="searchDocs" />
      <div id="doc-toc-title" class="doc-toc-title">Chapters (18)</div>
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
        <h1>VD3 UI Core — Framework-Agnostic Design System on Golden-Ratio Math</h1>
        <p class="lead">
          First principles, mathematical proportions, layered CSS component primitives, and normative
          W3C DTCG tokens for the <strong>vd3</strong> design system. Fibonacci-first — conventional
          only where web standards and human ergonomics demand it. Consume the tokens and CSS from any
          stack — vanilla JS, React, Vue, Svelte — with zero runtime dependency. Built cleanly for both
          human engineers and machine agents.
        </p>
        <VdCard glass class="phi-card">
          <span class="phi-eq">φ = (1 + √5) ⁄ 2 = 1.6180339887…</span>
          <VdChip size="sm"><span class="vd-chip-label"><strong>Golden angle</strong> <span>137.5077640…°</span></span></VdChip>
          <VdChip size="sm"><span class="vd-chip-label"><strong>√φ</strong> <span>1.272 — type steps</span></span></VdChip>
          <VdChip size="sm"><span class="vd-chip-label"><strong>Lucas L₁₃ / L₁₅</strong> <span>521px / 1364px</span></span></VdChip>
        </VdCard>
        <div class="hero-meta">
          <span><strong>3</strong> basis classes — A / B / C (No Class D)</span>
          <span><strong>36</strong> zero-framework core CSS modules</span>
          <span><strong>0</strong> runtime deps — any framework</span>
          <span><strong>W3C APG</strong>-normative keyboard &amp; ARIA</span>
          <span><strong>W3C DTCG 2025.10</strong> token registry</span>
        </div>
        <div class="hero-links">
          <a href="/tokens/vd3.tokens.json" class="vd-btn vd-btn--sm vd-btn--primary">DTCG Tokens JSON</a>
          <a href="/tokens/schema.json" class="vd-btn vd-btn--sm vd-btn--outline">Token Schema JSON</a>
          <a href="/tokens/figma.manifest.json" class="vd-btn vd-btn--sm vd-btn--outline">Figma Manifest JSON</a>
          <a href="https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh" target="_blank" rel="noopener noreferrer" class="vd-btn vd-btn--sm vd-btn--outline">Figma UI Kit<span class="vd-sr-only"> (opens in new tab)</span></a>
          <a href="#components" class="vd-btn vd-btn--sm vd-btn--outline">Jump to Components</a>
        </div>
        <p class="footnote">
          Markdown documents in <code>foundations/</code>, <code>components/</code>, and
          <code>conventions/</code> alongside <code>tokens/vd3.tokens.json</code> are the single
          authoritative source of truth. Project codename: <strong>HydroCORE</strong>
          (<em>Project HydroCORE</em> — <em>vanduo</em> means water in Lithuanian).
        </p>
      </section>

      <!-- 01 CONTRACT -->
      <section id="contract" class="doc-section">
        <h2><span class="n">01</span> The Proportional Contract <VdBadge variant="primary" pill>A/B/C</VdBadge></h2>
        <MdDoc :source="principlesMd" :section-level="2" table-label="Proportional contract principles" />
      </section>

      <!-- 02 PROPORTION -->
      <section id="proportion" class="doc-section">
        <h2><span class="n">02</span> The Golden Spine <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <ProportionDemos />
        <MdDoc :source="proportionMd" :section-level="2" table-label="Proportion specification table" />
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
        <MdDoc :source="lineMd" :section-level="2" table-label="Line weights specification table" />
      </section>

      <!-- 05 TYPE -->
      <section id="type" class="doc-section">
        <h2><span class="n">05</span> Typography <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <TypeDemo />
        <MdDoc :source="typographyMd" :section-level="2" table-label="Typography specification table" />
      </section>

      <!-- 06 MOTION -->
      <section id="motion" class="doc-section">
        <h2><span class="n">06</span> Motion <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <MotionDemo />
        <MdDoc :source="motionMd" :section-level="2" table-label="Motion specification table" />
      </section>

      <!-- 07 ELEVATION -->
      <section id="elevation" class="doc-section">
        <h2><span class="n">07</span> Elevation <VdBadge variant="primary" pill>class A</VdBadge></h2>
        <p class="lead">Shadow offsets and blurs derive from consecutive Fibonacci pairs (F_k, F_k+2).</p>
        <ElevationDemo />
        <MdDoc :source="elevationMd" :section-level="2" table-label="Elevation specification table" />
      </section>

      <!-- 08 GLASS -->
      <section id="glass" class="doc-section">
        <h2><span class="n">08</span> Seemore Glass <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="warning" pill>C-02 blur cap</VdBadge></h2>
        <p class="lead">Frosted translucency in Fibonacci strength steps with mandatory GPU-safe cap C-02.</p>
        <GlassDemo />
        <MdDoc :source="glassMd" :section-level="2" table-label="Seemore Glass specification table" />
      </section>

      <!-- 09 COLOR -->
      <section id="color" class="doc-section">
        <h2><span class="n">09</span> Color <VdBadge variant="primary" pill>class A</VdBadge> <VdBadge variant="info" pill>class B — Open Color default</VdBadge></h2>
        <p class="lead">
          Dual-theme semantic roles enforce WCAG AAA primary copy (≥7.0:1) and WCAG AA secondary copy
          (≥4.5:1), paired with a golden-angle 137.508° harmonic palette.
        </p>
        <ColorDemo />
        <div style="block-size: var(--vd3-space-fib-21, 1.3125rem)"></div>
        <MdDoc :source="colorMd" :section-level="2" table-label="Color system specification table" />
      </section>

      <!-- 10 GRID & LAYOUT -->
      <section id="grid" class="doc-section">
        <h2><span class="n">10</span> Grid &amp; Layout Primitives <VdBadge variant="info" pill>class B</VdBadge> <VdBadge variant="primary" pill>golden modes</VdBadge></h2>
        <p class="lead">Conventional 12-column responsiveness combined with Class A golden-split containers.</p>
        <GridDemo />
        <MdDoc :source="layoutMd" :section-level="2" table-label="Grid and layout specification table" />
      </section>

      <!-- 11 FOCUS -->
      <section id="focus" class="doc-section">
        <h2><span class="n">11</span> Focus &amp; Accessibility <VdBadge variant="info" pill>WCAG 2.2 AA/AAA</VdBadge></h2>
        <MdDoc :source="focusMd" :section-level="2" table-label="Focus and accessibility specification table" />
      </section>

      <!-- 12 ICONS -->
      <section id="icons" class="doc-section">
        <h2><span class="n">12</span> Iconography Contract <VdBadge variant="info" pill>Class A</VdBadge></h2>
        <MdDoc :source="iconsMd" :section-level="2" table-label="Iconography specification table" />
      </section>

      <!-- 13 DENSITY -->
      <section id="density" class="doc-section">
        <h2><span class="n">13</span> Density Modes <VdBadge variant="warning" pill>A / B</VdBadge></h2>
        <MdDoc :source="densityMd" :section-level="2" table-label="Density modes specification table" />
      </section>

      <!-- 14 DATA VIZ -->
      <section id="data-viz" class="doc-section">
        <h2><span class="n">14</span> Data Visualization Boundary <VdBadge variant="info" pill>Class A</VdBadge></h2>
        <MdDoc :source="dataVizMd" :section-level="2" table-label="Data visualization boundary table" />
      </section>

      <!-- 12 FOUNDATION COVERAGE MATRIX -->
      <section id="foundations" class="doc-section">
        <h2><span class="n">15</span> Foundation Coverage Matrix <VdBadge variant="primary" pill>DTCG</VdBadge></h2>
        <FoundationTable />
      </section>

      <!-- 13 COMPONENTS -->
      <section id="components" class="doc-section">
        <h2>
          <span class="n">16</span> Components — 35 Primitives + Layout Engine
          <VdBadge variant="primary" pill>Zero-Framework CSS</VdBadge>
          <VdBadge variant="info" pill>@vanduo-oss/vd3 Live</VdBadge>
        </h2>
        <p class="lead">
          Each primitive lives inside <code>@layer vd3.components</code> or <code>@layer vd3.layout</code>,
          consumes only DTCG tokens from <code>tokens/vd3.tokens.json</code>, and exposes machine-readable
          <code>data-vd-*</code> contracts alongside live <code>@vanduo-oss/vd3</code> Vue components.
        </p>

        <h3 id="spec-index-heading">Component Specification Index</h3>
        <MdDoc :source="specIndexMd" :section-level="3" table-label="Component specification index" />

        <div class="specimen-grid">
          <article
            id="specimen-button"
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
            id="specimen-dialog"
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
                  command="show-modal"
                  commandfor="demo-modal-dialog"
                  aria-haspopup="dialog"
                  aria-controls="demo-modal-dialog"
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
                  <h2 id="demo-dlg-title" class="vd-dialog-title">VD3 Native Modal Contract</h2>
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
            id="specimen-card"
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
            id="specimen-form"
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
            id="specimen-badge"
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
            id="specimen-navbar"
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
            id="specimen-accordion"
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
            id="specimen-table"
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
            id="specimen-code"
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
            id="specimen-toast"
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
            id="specimen-switch"
            class="specimen-card"
            data-vd-component="switch"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-21 space.fib-34 radius.full color.role.focus focus.ring.width motion.144"
          >
            <div class="specimen-header">
              <h3>Switch (<code>.vd-switch</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview">
              <button
                type="button"
                role="switch"
                :aria-checked="String(switchPrimaryOn)"
                class="vd-switch"
                aria-label="Notifications enabled"
                @click="switchPrimaryOn = !switchPrimaryOn"
              >
                <span class="vd-switch-thumb"></span>
              </button>
              <button
                type="button"
                role="switch"
                :aria-checked="String(switchCompactOn)"
                class="vd-switch vd-switch--sm"
                aria-label="Compact mode"
                @click="switchCompactOn = !switchCompactOn"
              ></button>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.switch"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy switch HTML snippet" @click="copySnippet('switch', componentSnippets.switch)">
                {{ copiedKey === 'switch' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-alert"
            class="specimen-card"
            data-vd-component="alert"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-13 space.fib-21 line.regular color.role.critical color.role.focus radius.fib-8"
          >
            <div class="specimen-header">
              <h3>Alert (<code>.vd-alert</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-alert vd-alert--warning" role="alert">
                <span class="vd-alert-icon" aria-hidden="true">!</span>
                <div class="vd-alert-content">
                  <p class="vd-alert-title">Registered exception C-02</p>
                  <p class="vd-alert-body">Glass blur soft-caps at 20px — the Convergence Zone is documented in the glass foundation.</p>
                </div>
                <button type="button" class="vd-alert-close" aria-label="Dismiss alert">×</button>
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.alert"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy alert HTML snippet" @click="copySnippet('alert', componentSnippets.alert)">
                {{ copiedKey === 'alert' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-tabs"
            class="specimen-card"
            data-vd-component="tabs"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-8 space.fib-13 line.hair line.thin color.role.focus motion.89"
          >
            <div class="specimen-header">
              <h3>Tabs (<code>.vd-tabs</code> / <code>.vd-tab</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-tabs" role="tablist" aria-label="Specimen tabs">
                <button
                  type="button"
                  class="vd-tab"
                  role="tab"
                  id="app-tab-a"
                  :aria-selected="String(activeSpecimenTab === 'a')"
                  aria-controls="app-panel-a"
                  :tabindex="activeSpecimenTab === 'a' ? 0 : -1"
                  @click="activeSpecimenTab = 'a'"
                  @keydown.arrow-right.prevent="activeSpecimenTab = 'b'"
                  @keydown.arrow-left.prevent="activeSpecimenTab = 'b'"
                >
                  Tokens
                </button>
                <button
                  type="button"
                  class="vd-tab"
                  role="tab"
                  id="app-tab-b"
                  :aria-selected="String(activeSpecimenTab === 'b')"
                  aria-controls="app-panel-b"
                  :tabindex="activeSpecimenTab === 'b' ? 0 : -1"
                  @click="activeSpecimenTab = 'b'"
                  @keydown.arrow-right.prevent="activeSpecimenTab = 'a'"
                  @keydown.arrow-left.prevent="activeSpecimenTab = 'a'"
                >
                  Components
                </button>
              </div>
              <div
                class="vd-tab-panel"
                role="tabpanel"
                id="app-panel-a"
                aria-labelledby="app-tab-a"
                :hidden="activeSpecimenTab !== 'a'"
              >
                DTCG 2025.10 registry — every leaf token carries a basis class (A/B/C).
              </div>
              <div
                class="vd-tab-panel"
                role="tabpanel"
                id="app-panel-b"
                aria-labelledby="app-tab-b"
                :hidden="activeSpecimenTab !== 'b'"
              >
                36 zero-framework CSS modules in @layer vd3.components and @layer vd3.layout.
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.tabs"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy tabs HTML snippet" @click="copySnippet('tabs', componentSnippets.tabs)">
                {{ copiedKey === 'tabs' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-drawer"
            class="specimen-card"
            data-vd-component="drawer"
            data-vd-basis-class="B"
            data-vd-tokens="z.modal z.modal-backdrop container.sm space.fib-21 motion.slow"
          >
            <div class="specimen-header">
              <h3>Drawer (<code>.vd-drawer</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <button
                ref="drawerTriggerRef"
                type="button"
                class="vd-btn vd-btn--outline vd-btn--sm"
                aria-haspopup="dialog"
                aria-controls="demo-drawer-panel"
                @click="openDemoDrawer"
              >
                Open drawer
              </button>
              <span class="specimen-meta">Fixed panel at z.modal, Esc + backdrop close, slide 377ms.</span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.drawer"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy drawer HTML snippet" @click="copySnippet('drawer', componentSnippets.drawer)">
                {{ copiedKey === 'drawer' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-tooltip"
            class="specimen-card"
            data-vd-component="tooltip"
            data-vd-basis-class="A"
            data-vd-tokens="z.tooltip type.size.xs space.fib-5 radius.fib-3 motion.89"
          >
            <div class="specimen-header">
              <h3>Tooltip (<code>.vd-tooltip</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <span class="vd-tooltip vd-tooltip--top" role="tooltip">φ = 1.618…</span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.tooltip"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy tooltip HTML snippet" @click="copySnippet('tooltip', componentSnippets.tooltip)">
                {{ copiedKey === 'tooltip' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-popover"
            class="specimen-card"
            data-vd-component="popover"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.233"
          >
            <div class="specimen-header">
              <h3>Popover (<code>.vd-popover</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-popover"><div class="vd-popover-header">Popover title</div><div class="vd-popover-body">Anchored floating content with arrow.</div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.popover"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy popover HTML snippet" @click="copySnippet('popover', componentSnippets.popover)">
                {{ copiedKey === 'popover' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-menu"
            class="specimen-card"
            data-vd-component="menu"
            data-vd-basis-class="B"
            data-vd-tokens="z.dropdown shadow.4 radius.fib-8 space.fib-8 color.role.layer-hover"
          >
            <div class="specimen-header">
              <h3>Menu (<code>.vd-menu</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-menu" role="menu"><div class="vd-menu-item" role="menuitem">Rename</div><div class="vd-menu-item" role="menuitem">Duplicate</div><div class="vd-menu-divider"></div><div class="vd-menu-item vd-menu-item--danger" role="menuitem">Delete</div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.menu"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy menu HTML snippet" @click="copySnippet('menu', componentSnippets.menu)">
                {{ copiedKey === 'menu' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-context-menu"
            class="specimen-card"
            data-vd-component="context-menu"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover shadow.4 radius.fib-8 space.fib-8"
          >
            <div class="specimen-header">
              <h3>Context Menu (<code>.vd-context-menu</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-context-menu" role="menu"><div class="vd-context-menu-item" role="menuitem">Open</div><div class="vd-context-menu-item vd-context-menu-item--danger" role="menuitem">Remove</div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets['context-menu']"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy context-menu HTML snippet" @click="copySnippet('context-menu', componentSnippets['context-menu'])">
                {{ copiedKey === 'context-menu' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-menubar"
            class="specimen-card"
            data-vd-component="menubar"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-8 line.hair color.role.layer-hover"
          >
            <div class="specimen-header">
              <h3>Menubar (<code>.vd-menubar</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-menubar"><span class="vd-menubar-item" aria-haspopup="true" aria-expanded="false">File</span><span class="vd-menubar-item">Edit</span><span class="vd-menubar-item">View</span></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.menubar"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy menubar HTML snippet" @click="copySnippet('menubar', componentSnippets.menubar)">
                {{ copiedKey === 'menubar' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-breadcrumb"
            class="specimen-card"
            data-vd-component="breadcrumb"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-5 type.size.sm color.role.interactive motion.89"
          >
            <div class="specimen-header">
              <h3>Breadcrumb (<code>.vd-breadcrumb</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <nav aria-label="Breadcrumb"><ol class="vd-breadcrumb"><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#foundations">Foundations</a></li><li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="#components" aria-current="page">Color</a></li></ol></nav>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.breadcrumb"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy breadcrumb HTML snippet" @click="copySnippet('breadcrumb', componentSnippets.breadcrumb)">
                {{ copiedKey === 'breadcrumb' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-pagination"
            class="specimen-card"
            data-vd-component="pagination"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-8 line.hair radius.fib-5 type.size.sm color.role.focus"
          >
            <div class="specimen-header">
              <h3>Pagination (<code>.vd-pagination</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list"><li class="vd-pagination-item"><a class="vd-pagination-link vd-pagination-link--prev" href="#components" aria-label="Previous page">‹</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components" aria-current="page">1</a></li><li class="vd-pagination-item"><a class="vd-pagination-link" href="#components">2</a></li></ul></nav>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.pagination"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy pagination HTML snippet" @click="copySnippet('pagination', componentSnippets.pagination)">
                {{ copiedKey === 'pagination' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-avatar"
            class="specimen-card"
            data-vd-component="avatar"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-21 space.fib-34 radius.full line.thin color.role.layer"
          >
            <div class="specimen-header">
              <h3>Avatar (<code>.vd-avatar</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <span class="vd-avatar vd-avatar--md vd-avatar--round"><span class="vd-avatar-initials">VD</span><span class="vd-avatar-status vd-avatar-status--online"></span></span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.avatar"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy avatar HTML snippet" @click="copySnippet('avatar', componentSnippets.avatar)">
                {{ copiedKey === 'avatar' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-progress"
            class="specimen-card"
            data-vd-component="progress"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-5 radius.full color.role.focus motion.233"
          >
            <div class="specimen-header">
              <h3>Progress (<code>.vd-progress</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-progress" role="progressbar" aria-valuenow="62" aria-label="Upload progress"><div class="vd-progress-bar" style="--_vd-progress-value: 62%"></div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.progress"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy progress HTML snippet" @click="copySnippet('progress', componentSnippets.progress)">
                {{ copiedKey === 'progress' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-spinner"
            class="specimen-card"
            data-vd-component="spinner"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-21 radius.full line.hair color.role.focus motion.610 easing.linear"
          >
            <div class="specimen-header">
              <h3>Spinner (<code>.vd-spinner</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <span class="vd-spinner vd-spinner--md" role="status" aria-label="Loading"></span>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.spinner"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy spinner HTML snippet" @click="copySnippet('spinner', componentSnippets.spinner)">
                {{ copiedKey === 'spinner' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-skeleton"
            class="specimen-card"
            data-vd-component="skeleton"
            data-vd-basis-class="A"
            data-vd-tokens="color.role.layer-hover radius.fib-5 motion.377 easing.in-out"
          >
            <div class="specimen-header">
              <h3>Skeleton (<code>.vd-skeleton</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 82%"></div><div class="vd-skeleton vd-skeleton--text" style="--_vd-skeleton-w: 58%"></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.skeleton"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy skeleton HTML snippet" @click="copySnippet('skeleton', componentSnippets.skeleton)">
                {{ copiedKey === 'skeleton' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-slider"
            class="specimen-card"
            data-vd-component="slider"
            data-vd-basis-class="A"
            data-vd-tokens="space.fib-3 space.fib-21 radius.full line.thin color.role.focus motion.89"
          >
            <div class="specimen-header">
              <h3>Slider (<code>.vd-slider</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <input type="range" class="vd-slider" min="0" max="100" value="40" aria-label="Volume">
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.slider"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy slider HTML snippet" @click="copySnippet('slider', componentSnippets.slider)">
                {{ copiedKey === 'slider' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-datepicker"
            class="specimen-card"
            data-vd-component="datepicker"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover shadow.4 radius.fib-8 space.fib-13 color.role.focus"
          >
            <div class="specimen-header">
              <h3>Date Picker (<code>.vd-datepicker</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-datepicker"><div class="vd-datepicker-header"><span class="vd-datepicker-title">November 2026</span></div><div class="vd-datepicker-grid"><span class="vd-datepicker-day">15</span><span class="vd-datepicker-day" aria-selected="true">16</span><span class="vd-datepicker-day">17</span></div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.datepicker"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy datepicker HTML snippet" @click="copySnippet('datepicker', componentSnippets.datepicker)">
                {{ copiedKey === 'datepicker' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-timepicker"
            class="specimen-card"
            data-vd-component="timepicker"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover space.fib-8 type.size.sm color.role.focus"
          >
            <div class="specimen-header">
              <h3>Time Picker (<code>.vd-timepicker</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-timepicker"><div class="vd-timepicker-item" aria-selected="true">09:00</div><div class="vd-timepicker-item">09:30</div><div class="vd-timepicker-item">10:00</div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.timepicker"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy timepicker HTML snippet" @click="copySnippet('timepicker', componentSnippets.timepicker)">
                {{ copiedKey === 'timepicker' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-upload"
            class="specimen-card"
            data-vd-component="upload"
            data-vd-basis-class="B"
            data-vd-tokens="line.thin radius.fib-8 space.fib-21 color.role.border icon.size.lg"
          >
            <div class="specimen-header">
              <h3>File Upload (<code>.vd-upload</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <label class="vd-upload"><span class="vd-upload-icon" aria-hidden="true">↑</span><span class="vd-upload-text">Drop files here</span><span class="vd-upload-hint">or click to browse</span><input class="vd-upload-input" type="file" aria-label="Upload files"></label>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.upload"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy upload HTML snippet" @click="copySnippet('upload', componentSnippets.upload)">
                {{ copiedKey === 'upload' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-carousel"
            class="specimen-card"
            data-vd-component="carousel"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-34 radius.fib-8 motion.377 color.role.focus focus.ring.width"
          >
            <div class="specimen-header">
              <h3>Carousel (<code>.vd-carousel</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-carousel"><div class="vd-carousel-track" style="--_vd-carousel-index: 0"><div class="vd-carousel-slide">Slide 1</div><div class="vd-carousel-slide">Slide 2</div></div><button type="button" class="vd-carousel-prev" aria-label="Previous slide">‹</button><button type="button" class="vd-carousel-next" aria-label="Next slide">›</button></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.carousel"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy carousel HTML snippet" @click="copySnippet('carousel', componentSnippets.carousel)">
                {{ copiedKey === 'carousel' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-toolbar"
            class="specimen-card"
            data-vd-component="toolbar"
            data-vd-basis-class="B"
            data-vd-tokens="space.fib-8 line.hair radius.fib-8 color.role.layer"
          >
            <div class="specimen-header">
              <h3>Toolbar (<code>.vd-toolbar</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-toolbar"><div class="vd-toolbar-group"><button type="button" class="vd-toolbar-button">B</button><button type="button" class="vd-toolbar-button">I</button></div><span class="vd-toolbar-separator"></span><button type="button" class="vd-toolbar-button">Link</button></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.toolbar"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy toolbar HTML snippet" @click="copySnippet('toolbar', componentSnippets.toolbar)">
                {{ copiedKey === 'toolbar' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-segmented"
            class="specimen-card"
            data-vd-component="segmented"
            data-vd-basis-class="B"
            data-vd-tokens="radius.full line.hair space.fib-1 color.role.layer shadow.1"
          >
            <div class="specimen-header">
              <h3>Segmented (<code>.vd-segmented</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-segmented" role="radiogroup" aria-label="View"><button type="button" class="vd-segmented-item" aria-checked="true">Day</button><button type="button" class="vd-segmented-item" aria-checked="false">Week</button><button type="button" class="vd-segmented-item" aria-checked="false">Month</button></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.segmented"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy segmented HTML snippet" @click="copySnippet('segmented', componentSnippets.segmented)">
                {{ copiedKey === 'segmented' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-hover-card"
            class="specimen-card"
            data-vd-component="hover-card"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover shadow.4 radius.fib-8 space.fib-13 container.sm motion.144"
          >
            <div class="specimen-header">
              <h3>Hover Card (<code>.vd-hover-card</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-hover-card"><p class="vd-hover-card-title">Hover card</p><p class="vd-hover-card-body">Rich preview on hover or keyboard focus.</p></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets['hover-card']"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy hover-card HTML snippet" @click="copySnippet('hover-card', componentSnippets['hover-card'])">
                {{ copiedKey === 'hover-card' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-tour"
            class="specimen-card"
            data-vd-component="tour"
            data-vd-basis-class="B"
            data-vd-tokens="z.popover shadow.5 radius.fib-8 space.fib-21 motion.233"
          >
            <div class="specimen-header">
              <h3>Tour (<code>.vd-tour</code>)</h3>
              <VdBadge variant="warning">Class B</VdBadge>
            </div>
            <div class="specimen-preview specimen-preview--block">
              <div class="vd-tour"><p class="vd-tour-title">Step 2 of 5</p><p class="vd-tour-body">This is where the tokens live.</p><div class="vd-tour-progress"></div><div class="vd-tour-footer"><span class="vd-tour-counter">2 / 5</span><div class="vd-tour-actions"><button type="button" class="vd-tour-btn">Back</button><button type="button" class="vd-tour-btn vd-tour-btn--primary">Next</button></div></div></div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.tour"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy tour HTML snippet" @click="copySnippet('tour', componentSnippets.tour)">
                {{ copiedKey === 'tour' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>
          <article
            id="specimen-icon"
            class="specimen-card"
            data-vd-component="icon"
            data-vd-basis-class="A"
            data-vd-tokens="icon.size.md icon.size.lg icon.stroke.outline color.role.text-primary"
          >
            <div class="specimen-header">
              <h3>Icon (<code>.vd-icon</code>)</h3>
              <VdBadge variant="info">Class A</VdBadge>
            </div>
            <div class="specimen-preview">
              <div class="vd-icon-pair">
                <span class="vd-icon vd-icon--sm vd-icon--secondary" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg>
                </span>
                <span class="vd-icon vd-icon--md vd-icon--primary" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                </span>
                <span class="vd-icon vd-icon--lg vd-icon--accent" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><polygon points="12 3 21 19 3 19" /></svg>
                </span>
                <span class="vd-icon vd-icon--critical" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 8v5" /><circle cx="12" cy="17" r="1" /></svg>
                </span>
                <span class="specimen-meta">Fibonacci F₇–F₁₀ (13/21/34/55px) · φ stroke 1.618</span>
              </div>
            </div>
            <div class="vd-code-block">
              <pre class="vd-code" data-language="html" tabindex="0"><code v-text="componentSnippets.icon"></code></pre>
              <button type="button" class="vd-code-copy" aria-label="Copy icon HTML snippet" @click="copySnippet('icon', componentSnippets.icon)">
                {{ copiedKey === 'icon' ? 'Copied ✓' : 'Copy' }}
              </button>
            </div>
          </article>

          <article
            id="specimen-layout"
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

        <h3 id="per-slug-specs">Per-Slug Component Specifications ({{ componentSpecs.length }} specs, W3C APG where applicable)</h3>
        <div class="spec-entries">
          <article v-for="sp in componentSpecs" :key="sp.slug" :id="`spec-${sp.slug}`" class="spec-entry">
            <h4 class="spec-entry-title">{{ sp.slug }}</h4>
            <MdDoc :source="sp.src" :section-level="4" :table-label="`${sp.slug} specification`" />
          </article>
        </div>
      </section>

      <!-- 17 CONVENTIONS -->
      <section id="conventions" class="doc-section">
        <h2><span class="n">17</span> Conventions — Naming, Mappings &amp; Content <VdBadge variant="info" pill>Normative</VdBadge></h2>
        <article id="convention-naming" class="convention-entry">
          <h3>Public &amp; Token Naming</h3>
          <MdDoc :source="namingMd" :section-level="3" table-label="Naming convention table" />
        </article>
        <article id="convention-mappings" class="convention-entry">
          <h3>Cross-System Token Mappings</h3>
          <MdDoc :source="mappingsMd" :section-level="3" table-label="Cross-system mapping table" />
        </article>
        <article id="convention-content" class="convention-entry">
          <h3>Editorial Tone &amp; Content Strings</h3>
          <MdDoc :source="contentMd" :section-level="3" table-label="Content conventions table" />
        </article>
      </section>

      <!-- 18 PATTERNS -->
      <section id="patterns" class="doc-section">
        <h2><span class="n">18</span> Patterns — Guidance Over Components <VdBadge variant="info" pill>Guidance</VdBadge></h2>
        <MdDoc :source="patternsMd" :section-level="2" table-label="Patterns index" />
        <article v-for="p in patternDocs" :key="p.slug" :id="`pattern-${p.slug}`" class="pattern-entry">
          <h3>{{ p.slug }}</h3>
          <MdDoc :source="p.src" :section-level="3" :table-label="`${p.slug} pattern`" />
        </article>
      </section>
    </main>
  </div>

  <!-- Live Drawer & Toast Portals -->
  <div v-if="drawerOpen" class="vd-drawer-backdrop" @click="closeDemoDrawer"></div>
  <aside
    v-if="drawerOpen"
    id="demo-drawer-panel"
    class="vd-drawer vd-drawer--end"
    data-open="true"
    role="dialog"
    aria-modal="true"
    aria-labelledby="demo-drawer-title"
    @keydown.esc="closeDemoDrawer"
  >
    <div class="vd-drawer-header">
      <h2 id="demo-drawer-title" class="vd-drawer-title">VD3 Dual-Mode Drawer</h2>
      <button
        ref="drawerCloseRef"
        type="button"
        class="vd-drawer-close vd-btn vd-btn--ghost vd-btn--sm"
        aria-label="Close drawer"
        @click="closeDemoDrawer"
      >
        ×
      </button>
    </div>
    <div class="vd-drawer-body">
      <p>Sliding modal drawer at <code>z.modal</code> (1050) with Esc dismissal and focus restoration.</p>
    </div>
  </aside>

  <VdToastContainer />

  <footer>
    <div class="inner">
      <p>
        <strong>vd3-ui-core</strong> · Specification v1.1.0-draft · Markdown specs and W3C DTCG
        <code>tokens/vd3.tokens.json</code> are the normative source of truth. Library conformance:
        <code>"implements": "vd3-ui-core@^1.0"</code>.
      </p>
    </div>
  </footer>
</template>
