---
spec: vd3-ui-core@1.0.2-draft
status: stable
---

# Component Specification Index

Master index of the zero-framework CSS primitives in `components/` and their
behavioral specifications. Every component has a per-slug spec at
`components/<slug>/spec.md` (authoring format: `_TEMPLATE.md`). Requirement IDs
use the `⟨SLUG⟩-⟨3-digit⟩` convention (`conventions/naming.md`).

Normative behavior reference: **W3C ARIA Authoring Practices Guide (APG)**.
Normative tokens: `tokens/vd3.tokens.json` (DTCG 2025.10) — components consume
semantic role tokens only.

## CSS modules (registered in `index.css`)

| Module | Classes | Layer | Spec | Status |
|---|---|---|---|---|
| `layout.css` | `.vd-container*`, `.vd-grid-*`, `.vd-col-*`, `.vd-split-*`, `.vd-layout-golden*`, `.vd-aspect-golden*`, `.vd-cq`, `.vd-gap-*` | `vd3.layout` | `SPEC.md#layout` (planned 1.0.3) | CSS stable · spec planned |
| `button.css` | `.vd-btn` + variants/sizes | `vd3.components` | `SPEC.md#button` (planned 1.0.3) | CSS stable · spec planned |
| `dialog.css` | `.vd-dialog` + anatomy | `vd3.components` | [`dialog/spec.md`](./dialog/spec.md) (DLG-001…004) | **spec stable** |
| `card.css` | `.vd-card` + variants/anatomy | `vd3.components` | `SPEC.md#card` (planned 1.0.3) | CSS stable · spec planned |
| `form.css` | `.vd-form-group`, `.vd-label`, `.vd-input`, `.vd-textarea`, `.vd-select`, `.vd-checkbox`, `.vd-radio`, `.vd-help-text`, `.vd-error-text` | `vd3.components` | `SPEC.md#form` (planned 1.0.3) | CSS stable · spec planned |
| `badge.css` | `.vd-badge`, `.vd-chip` | `vd3.components` | `SPEC.md#badge` (planned 1.0.3) | CSS stable · spec planned |
| `navbar.css` | `.vd-navbar` + anatomy, `.vd-nav-link` | `vd3.components` | `SPEC.md#navbar` (planned 1.0.3) | CSS stable · spec planned |
| `accordion.css` | `.vd-accordion` (`<details>/<summary>`) | `vd3.components` | `SPEC.md#accordion` (planned 1.0.3) | CSS stable · spec planned |
| `table.css` | `.vd-table` + modifiers, `.vd-table-container` | `vd3.components` | `SPEC.md#table` (planned 1.0.3) | CSS stable · spec planned |
| `code.css` | `code.vd-code-inline`, `pre.vd-code`, `.vd-code-copy`, `.vd-spec-card`, `.token-*` | `vd3.components` | `SPEC.md#code` (planned 1.0.3) | CSS stable · spec planned |
| `toast.css` | `.vd-toast` + variants/placements, `.vd-toast-container` | `vd3.components` | `SPEC.md#toast` (planned 1.0.3) | CSS stable · spec planned |
| `switch.css` | `.vd-switch`, `.vd-switch-thumb` | `vd3.components` | [`switch/spec.md`](./switch/spec.md) (SWT-001…005) | **spec stable** (new in 1.0.2) |
| `alert.css` | `.vd-alert` + variants/anatomy | `vd3.components` | [`alert/spec.md`](./alert/spec.md) (ALR-001…004) | **spec stable** (new in 1.0.2) |
| `tabs.css` | `.vd-tabs`, `.vd-tab`, `.vd-tab-panel` | `vd3.components` | [`tabs/spec.md`](./tabs/spec.md) (TAB-001…005) | **spec stable** (new in 1.0.2) |

## Cross-cutting contracts (apply to every component)

- **Focus**: dual-ring `:focus-visible` per `foundations/focus.md` FOC-001…004
  (ring width/offset ≥ 2px = `line.thin` = F₃, tokens `focus.ring.*`).
- **Reduced motion**: MOB-001 — both `@media (prefers-reduced-motion: reduce)`
  and `[data-motion="reduce"]` collapse transitions/animations.
- **Zero framework**: no runtime framework references anywhere in `components/`
  (enforced by `pnpm test:components`, suite 19).
- **Tokens only**: semantic role tokens from `tokens/vd3.tokens.json`; no raw hex
  or pixel literals without a registered basis class.
- **RTL**: directional layout uses CSS logical properties (`inset-inline-*`,
  `border-inline-*`, `margin-inline-*`) so right-to-left layouts mirror correctly.

## Out-of-standard (library-level) components

The `vd3` package (`@vanduo-oss/vd3`) ships ~46 components without a core
counterpart (see `docs/gap-analysis.md` §2.1). Until a 1.x phase specs them here,
they are **library-level extensions**, not part of this standard. Planned for
phase 1.2 of `docs/roadmap-1.0.2-draft.md`: drawer, tooltip, popover, menu,
breadcrumb, pagination, avatar, progress, spinner, skeleton, slider.
