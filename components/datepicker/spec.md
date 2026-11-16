---
slug: datepicker
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/grid/
---

## Summary
A calendar popover for picking a date from a month grid, anchored to a date input. Use
when a date must be chosen in context (forms, filters, booking). NOT for: free-text dates
(use a text input with validation), long multi-month ranges (use two pickers or a
dedicated range control), or moving between pages/sections (use breadcrumb/pagination).

## Anatomy
`.vd-datepicker` (popover surface: `role="dialog"`, `aria-modal="false"`,
`aria-labelledby` → title id) containing `.vd-datepicker-header` (`.vd-datepicker-prev`
button, `.vd-datepicker-title` month/year label, `.vd-datepicker-next` button),
`.vd-datepicker-grid` (`role="grid"`, 7 columns: `.vd-datepicker-weekday` cells with
`role="columnheader"`, then `.vd-datepicker-day` buttons grouped in `role="row"` weeks),
and `.vd-datepicker-footer` (Today / Clear / Apply actions rendered with `.vd-btn`).

## States
- Rest — surface: `color.role.layer` bg, `color.role.border` + `line.hair` border,
  `shadow.4`, `radius.fib-8`, `space.fib-13` padding, `z.popover` stacking.
- Hover (day / prev / next) — bg `color.role.layer-hover`, transition `motion.89` +
  `easing.out`; suppressed on selected and disabled days.
- `[aria-selected="true"]` day — bg `color.role.focus`, ink `color.primitive.gray-1000`,
  weight 600; dark theme swaps bg to `color.primitive.gold-4`.
- `[data-today]` day — `line.hair` outline in `color.role.focus` (inset, replaced by the
  focus ring on `:focus-visible`).
- `:focus-visible` — dual ring from `focus.ring.offset`/`focus.ring.width` +
  `focus.ring.offset-color`/`focus.ring.color`, halo `focus.ring.glow` (FOC-001…004).
- `:disabled` / `[aria-disabled="true"]` — ink `color.role.text-secondary`,
  opacity `math.inv-phi-sq`, `not-allowed` cursor, no hover fill.

## Props / API
Contract-level: the popover is anchored to an invoking date input; the behavioral layer
owns open/close, positioning, and focus management. Markup contract: surface
`role="dialog"` + `aria-modal="false"` + `aria-labelledby` → `.vd-datepicker-title`;
grid/row/columnheader wiring per Anatomy; each `.vd-datepicker-day` is a
`<button type="button">` with `aria-selected="true|false"`, `data-today` on the current
day, and `disabled` / `aria-disabled="true"` on out-of-range days. Prev/next buttons are
ordinary tab stops that change the displayed month. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG
The date-picker dialog is the APG Grid Pattern's reference dialog example
(https://www.w3.org/WAI/ARIA/apg/patterns/grid/). Key → effect:

| Key | Effect |
|---|---|
| Right / Left arrow | Move focus one day later / earlier (wraps across weeks) |
| Down / Up arrow | Move focus one week later / earlier |
| Home / End | Move focus to the first / last day of the current week |
| Page Down / Page Up | Move focus to the same day next / previous month (Shift: next / previous year) |
| Enter / Space | Select the focused date; value lands in the invoking input |
| Escape | Close the popover without changing the value |

## Focus
Roving tabindex on day cells: the selected day (or today's day when nothing is selected)
is the single `tabindex="0"`; all other days are `tabindex="-1"`. On open, focus moves to
the roving day cell. On close (Escape, selection, or outside dismissal), focus MUST return
to the invoking input. `:focus-visible` dual ring (FOC-001…004) on days and prev/next
buttons.

## Accessibility requirements
- DTP-001 Surface roles: `role="dialog"`, `aria-modal="false"`, `aria-labelledby` →
  `.vd-datepicker-title`; grid `role="grid"`, week rows `role="row"`,
  `.vd-datepicker-weekday` cells `role="columnheader"`.
- DTP-002 Each day is a `<button type="button">` carrying `aria-selected="true|false"`;
  at most one day is selected; `[data-today]` marks the current day; unavailable days are
  `disabled` or `aria-disabled="true"` and are skipped by keyboard navigation.
- DTP-003 Roving tabindex: exactly one day cell has `tabindex="0"` (the selected day, else
  today); all others `tabindex="-1"`.
- DTP-004 Keyboard behavior follows the APG grid / date-picker-dialog table above without
  deviation; prev/next month buttons are plain tab stops outside the grid.
- DTP-005 The popover is non-modal (`aria-modal="false"`): background is not trapped; on
  close, focus MUST return to the invoking input.
- DTP-006 Reduced motion (MOB-001): day and nav-button transitions collapse under both
  `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.border`, `color.role.canvas`
(via `focus.ring.offset-color`), `color.role.text-primary`, `color.role.text-secondary`,
`color.role.focus`, `color.primitive.gray-1000`, `color.primitive.gold-4` (dark selected),
`z.popover`, `shadow.4`, `radius.fib-8`, `radius.full`, `space.fib-1/2/5/8/13/34`,
`line.hair`, `line.thin`, `type.size.xs/sm/base`, `type.leading.tight`,
`type.tracking.wider`, `motion.89`, `easing.out`,
`focus.ring.width/offset/color/offset-color/glow`, `math.inv-phi-sq`.

## Deviations & references
Conforms to the APG Grid Pattern date-picker dialog keyboard contract. Consulted: Carbon
DatePicker / DatePickerInput (per `conventions/mappings.md`) — adopts the anchored-popover +
input model; deviates on surface elevation (`shadow.4` golden fib pair instead of Carbon's
flat layer+border) per `foundations/elevation.md`, and on selected-day ink
(`color.primitive.gray-1000` on the golden focus hue instead of white) for contrast on
`color.role.focus`.
