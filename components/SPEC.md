---
spec: vd3-ui-core@1.1.0-draft
status: stable
---

# Component Specification Index

Master index of the zero-framework CSS primitives in `components/` and their
behavioral specifications. Every module has a per-slug spec at
`components/<slug>/spec.md` (authoring format: `_TEMPLATE.md`). Requirement IDs
use the `⟨SLUG⟩-⟨3-digit⟩` convention (`conventions/naming.md`).

Normative behavior reference: **W3C ARIA Authoring Practices Guide (APG)**.
Normative tokens: `tokens/vd3.tokens.json` (DTCG 2025.10) — components consume
semantic role tokens only.

## CSS modules (registered in `index.css`, cascade `@layer vd3.components` / `vd3.layout`)

| Module | Feature | Classes (base) | Spec | Status |
|---|---|---|---|---|
| `layout.css` | #13–16 | `.vd-container*`, `.vd-grid-*`, `.vd-col-*`, `.vd-split-*`, `.vd-layout-golden*`, `.vd-aspect-*`, `.vd-cq`, `.vd-gap-*` | [`layout/spec.md`](./layout/spec.md) (LAY) | spec stable |
| `button.css` | #27 | `.vd-btn` | [`button/spec.md`](./button/spec.md) (BTN) | spec stable |
| `dialog.css` | #28 | `.vd-dialog` | [`dialog/spec.md`](./dialog/spec.md) (DLG) | spec stable |
| `card.css` | #29 | `.vd-card` | [`card/spec.md`](./card/spec.md) (CRD) | spec stable |
| `form.css` | #30 | `.vd-form-group`, `.vd-label`, `.vd-input`, `.vd-textarea`, `.vd-select`, `.vd-checkbox`, `.vd-radio`, `.vd-help-text`, `.vd-error-text` | [`input/spec.md`](./input/spec.md) (INP) · [`select/spec.md`](./select/spec.md) (SEL) · [`checkbox/spec.md`](./checkbox/spec.md) (CHK) · [`radio/spec.md`](./radio/spec.md) (RAD) | spec stable |
| `badge.css` | #31 | `.vd-badge`, `.vd-chip` | [`badge/spec.md`](./badge/spec.md) (BDG) | spec stable |
| `navbar.css` | #32 | `.vd-navbar`, `.vd-nav-link` | [`navbar/spec.md`](./navbar/spec.md) (NAV) | spec stable |
| `accordion.css` | #33 | `.vd-accordion` | [`accordion/spec.md`](./accordion/spec.md) (ACC) | spec stable |
| `table.css` | #34 | `.vd-table`, `.vd-table-container` | [`table/spec.md`](./table/spec.md) (TBL) | spec stable |
| `code.css` | #35 | `pre.vd-code`, `.vd-code-copy`, `.vd-spec-card`, `.token-*` | [`code/spec.md`](./code/spec.md) (COD) | spec stable |
| `toast.css` | #36 | `.vd-toast`, `.vd-toast-container` | [`toast/spec.md`](./toast/spec.md) (TST) | spec stable |
| `switch.css` | #37 | `.vd-switch`, `.vd-switch-thumb` | [`switch/spec.md`](./switch/spec.md) (SWT) | spec stable (1.0.2) |
| `alert.css` | #38 | `.vd-alert` | [`alert/spec.md`](./alert/spec.md) (ALR) | spec stable (1.0.2) |
| `tabs.css` | #39 | `.vd-tabs`, `.vd-tab`, `.vd-tab-panel` | [`tabs/spec.md`](./tabs/spec.md) (TAB) | spec stable (1.0.2) |
| `drawer.css` | #40 | `.vd-drawer`, `.vd-drawer-backdrop` | [`drawer/spec.md`](./drawer/spec.md) (DRW) | spec stable (1.1) |
| `tooltip.css` | #41 | `.vd-tooltip` | [`tooltip/spec.md`](./tooltip/spec.md) (TIP) | spec stable (1.1) |
| `popover.css` | #42 | `.vd-popover` | [`popover/spec.md`](./popover/spec.md) (POP) | spec stable (1.1) |
| `menu.css` | #43 | `.vd-menu`, `.vd-menu-item` | [`menu/spec.md`](./menu/spec.md) (MNU) | spec stable (1.1) |
| `context-menu.css` | #44 | `.vd-context-menu`, `.vd-context-menu-item` | [`context-menu/spec.md`](./context-menu/spec.md) (CMX) | spec stable (1.1) |
| `menubar.css` | #45 | `.vd-menubar`, `.vd-menubar-item` | [`menubar/spec.md`](./menubar/spec.md) (MBR) | spec stable (1.1) |
| `breadcrumb.css` | #46 | `.vd-breadcrumb`, `.vd-breadcrumb-item`, `.vd-breadcrumb-link` | [`breadcrumb/spec.md`](./breadcrumb/spec.md) (BRC) | spec stable (1.1) |
| `pagination.css` | #47 | `.vd-pagination`, `.vd-pagination-link` | [`pagination/spec.md`](./pagination/spec.md) (PAG) | spec stable (1.1) |
| `avatar.css` | #48 | `.vd-avatar`, `.vd-avatar-status`, `.vd-avatar-group` | [`avatar/spec.md`](./avatar/spec.md) (AVT) | spec stable (1.1) |
| `progress.css` | #49 | `.vd-progress`, `.vd-progress-bar` | [`progress/spec.md`](./progress/spec.md) (PRG) | spec stable (1.1) |
| `spinner.css` | #50 | `.vd-spinner` | [`spinner/spec.md`](./spinner/spec.md) (SPN) | spec stable (1.1) |
| `skeleton.css` | #51 | `.vd-skeleton` | [`skeleton/spec.md`](./skeleton/spec.md) (SKL) | spec stable (1.1) |
| `slider.css` | #52 | `input[type=range].vd-slider` | [`slider/spec.md`](./slider/spec.md) (SLD) | spec stable (1.1) |
| `datepicker.css` | #53 | `.vd-datepicker`, `.vd-datepicker-day` | [`datepicker/spec.md`](./datepicker/spec.md) (DTP) | spec stable (1.1) |
| `timepicker.css` | #54 | `.vd-timepicker`, `.vd-timepicker-item` | [`timepicker/spec.md`](./timepicker/spec.md) (TMP) | spec stable (1.1) |
| `upload.css` | #55 | `.vd-upload`, `.vd-upload-input` | [`upload/spec.md`](./upload/spec.md) (UPL) | spec stable (1.1) |
| `carousel.css` | #56 | `.vd-carousel`, `.vd-carousel-slide`, `.vd-carousel-dot` | [`carousel/spec.md`](./carousel/spec.md) (CAR) | spec stable (1.1) |
| `toolbar.css` | #57 | `.vd-toolbar`, `.vd-toolbar-button` | [`toolbar/spec.md`](./toolbar/spec.md) (TLB) | spec stable (1.1) |
| `segmented.css` | #58 | `.vd-segmented`, `.vd-segmented-item` | [`segmented/spec.md`](./segmented/spec.md) (SEG) | spec stable (1.1) |
| `hover-card.css` | #59 | `.vd-hover-card` | [`hover-card/spec.md`](./hover-card/spec.md) (HVC) | spec stable (1.1) |
| `tour.css` | #60 | `.vd-tour`, `.vd-tour-btn` | [`tour/spec.md`](./tour/spec.md) (TUR) | spec stable (1.1) |

Total: **35 CSS modules** (layout engine + 34 component primitives), 35 per-slug
specs, all `stable`. Verified by `pnpm test:components` (43 suites, features
#13–16 + #27–60, RTL guard, snapshot integrity).

## Cross-cutting contracts (apply to every component)

- **Focus**: dual-ring `:focus-visible` per `foundations/focus.md` FOC-001…004
  (ring width/offset ≥ 2px = `line.thin` = F₃, tokens `focus.ring.*`).
- **Reduced motion**: MOB-001 — both `@media (prefers-reduced-motion: reduce)`
  and `[data-motion="reduce"]` collapse transitions/animations.
- **Zero framework**: no runtime framework references anywhere in `components/`
  (enforced by `pnpm test:components`, suite 43).
- **Tokens only**: semantic role tokens from `tokens/vd3.tokens.json`; no raw hex
  or pixel literals without a registered basis class.
- **RTL**: directional layout uses CSS logical properties (`inset-inline-*`,
  `border-inline-*`, `margin-inline-*`); physical `left`/`right` only for rotated
  glyph strokes, always commented (enforced by the RTL guard suite).
- **Density**: spacing scales via `[data-density="compact"]` (`foundations/density.md`).

## Patterns (guidance, not components)

See [`patterns/PATTERNS.md`](../patterns/PATTERNS.md): empty states, auth flows,
app shell, onboarding, disabled/read-only — guidance built on the components above.

## Out-of-standard (library-level) components

The `vd3` package (`@vanduo-oss/vd3`) ships additional components without a core
counterpart (see `docs/gap-analysis.md` §2.1). They are **library-level
extensions**, not part of this standard. Deliberately not planned for core:
color picker, meter, QR code, descriptions/statistic, dock, data-table behaviors
(sorting/pagination live in the library's `useTableState`), auth screens (covered
by `patterns/auth-flows.md`).
