---
slug: table
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/table/
---

## Summary
A semantic data table for presenting structured, multi-record information with
row and column headers. Use for comparable rows of data (specs, pricing, logs).
NOT for: interactive widget grids (upgrade to `role="grid"` per the APG Grid
pattern), page layout (use `layout.css`), or single-cell callouts (use alert).

## Anatomy
`.vd-table-container` (scrollable wrapper, hairline border + `radius.fib-8`)
containing a native `<table class="vd-table">`: `<caption class="vd-table-caption">` ·
`thead > tr > th[scope="col"]` · `tbody > tr > th[scope="row"] | td`. Modifiers:
`--striped`, `--bordered`, `--hover`, `--compact` (alias `-sm`), `--sticky-header`;
numeric cells via `[data-align="numeric"]` or `.vd-table-cell--numeric`. Both
double-dash (`.vd-table--striped`) and single-dash (`.vd-table-striped`) modifier
aliases exist.

## States
Rest (canvas fill, hairline row rules) / `--striped` (even rows = `color.role.layer`) /
`--hover` (row = `color.role.layer-hover`, 89ms fade via `motion.89` + `easing.out`,
collapsed per MOB-001) / `--sticky-header` (`thead` pinned at `top: 0` above a layer
fill) / container `:focus-visible` (dual ring, `focus.ring.*`) when the scroll region
is keyboard-focusable. Each state swaps only tokens.

## Props / API
Contract-level: a plain HTML `<table>` with the classes above. No size variants
beyond `--compact`; core ships no JS API — sorting, filtering, and selection are
added by the implementing layer and MUST then follow the APG Grid pattern
(`role="grid"`, roving tabindex), not this spec.

## Keyboard — NORMATIVE: APG Table Pattern
A plain data table has no mandatory key bindings; focus moves through focusable
descendants (sort buttons in `th`, row actions, links) in DOM order.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move to next / previous focusable element inside the table, in DOM order |
| (none) | Arrow keys are NOT required for a data table; if the table becomes a `role="grid"` widget, APG Grid keys apply instead |

## Focus
The table itself is not focusable. `.vd-table-container` is the scroll region:
when content overflows it SHOULD carry `tabindex="0"`, `role="region"`, and an
accessible name so keyboard users can scroll it; it then receives the dual-ring
`:focus-visible` treatment (FOC-001…004).

## Accessibility requirements
- TBL-001 Native semantics are mandatory: `<table>`, `<caption>`, `th scope="col"`, and `th scope="row"` for row headers — do not replace them with ARIA roles (APG Table Pattern prefers native HTML semantics).
- TBL-002 An overflowing `.vd-table-container` is a keyboard-scrollable region (`tabindex="0"` + `role="region"` + `aria-label`) with the dual-ring focus indicator (WCAG 2.1 SC 2.4.3 / 2.4.7, SC 1.4.11 non-text contrast).
- TBL-003 Striping (`--striped`) and hover (`--hover`) are decorative emphasis only; no information may be conveyed by row color alone (WCAG 1.4.1).
- TBL-004 Numeric alignment (`[data-align="numeric"]`, `font-variant-numeric: tabular-nums`) is presentational; cell content remains the accessible value for assistive technology.
- TBL-005 The sticky header (`--sticky-header`) must keep header/row contrast in both themes; the hover transition collapses under MOB-001 (both `prefers-reduced-motion: reduce` and `[data-motion="reduce"]`).

## Tokens consumed
`color.role.canvas`, `color.role.layer`, `color.role.layer-hover`,
`color.role.text-primary`, `color.role.text-secondary`, `color.role.border`,
`line.hair`, `line.thin`, `radius.fib-8`, `space.fib-5`, `space.fib-8`,
`space.fib-13`, `type.size.xs`, `type.size.sm`, `type.size.base`,
`type.leading.normal`, `type.tracking.widest`, `motion.89`, `easing.out`,
`focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
None from the APG Table Pattern. Consulted: Carbon DataTable — adopts native
table + caption + scope semantics and the scrollable wrapper; deviates on density
(Fibonacci padding `space.fib-8` / `space.fib-13` instead of Carbon's 2x-grid row
padding) and on striping (even rows only, instead of Carbon's odd-row zebra).
