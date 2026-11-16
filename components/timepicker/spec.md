---
slug: timepicker
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A dropdown listbox of selectable time options (e.g. 30-minute steps from 00:00), anchored
to a time input. Use for choosing a time from a fixed set in context (forms, scheduling).
NOT for: free-form time entry (use a masked text input), durations or intervals (use two
pickers or a range control), or timezone selection (use a select).

## Anatomy
`.vd-timepicker` (popover surface: `role="listbox"`, accessible name via `aria-label` /
`aria-labelledby` from the invoking input) containing `.vd-timepicker-item` elements
(`role="option"`, `aria-selected="true|false"`, tabular numerals). A 12h/24h format toggle
(AM/PM segmented control) is NOT part of this surface — it renders as a separate control
above the listbox (see TMP-004).

## States
- Rest — surface: `color.role.layer` bg, `color.role.border` + `line.hair` border,
  `shadow.4`, `radius.fib-8`, `space.fib-5` padding, `space.fib-89` min inline size,
  `space.fib-144` max block size with scroll, `z.popover` stacking.
- Hover — item bg `color.role.layer-hover`, transition `motion.89` + `easing.out`;
  suppressed on selected and disabled items.
- `[aria-selected="true"]` — item bg `color.role.focus`, ink `color.primitive.gray-1000`,
  weight 600; dark theme swaps bg to `color.primitive.gold-4`.
- `:focus-visible` — dual ring from `focus.ring.offset`/`focus.ring.width` +
  `focus.ring.offset-color`/`focus.ring.color`, halo `focus.ring.glow` (FOC-001…004).
- `:disabled` / `[aria-disabled="true"]` — ink `color.role.text-secondary`,
  opacity `math.inv-phi-sq`, `not-allowed` cursor, no hover fill, skipped in navigation.

## Props / API
Contract-level: `.vd-timepicker` is a `role="listbox"` popover anchored to an invoking
time input; the behavioral layer owns open/close, positioning, and focus. Items are
`role="option"` with `aria-selected="true|false"` and optional `disabled` /
`aria-disabled="true"` (out-of-range times). The 12h/24h toggle is a separate behavioral
control (segmented `.vd-btn` group or a switch), never a listbox option. No
size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG
No APG pattern exists for a time picker. The behavioral contract is the APG Listbox
pattern (https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) applied to time options:

| Key | Effect |
|---|---|
| Down / Up arrow | Move the active option one step later / earlier |
| Home / End | Activate the first / last enabled option |
| Enter / Space | Choose the active option and close |
| Escape | Close without changing the value |
| Page Down / Page Up | Move the active option one visible page (optional) |
| Printable character | Type-ahead to the matching time label (optional) |

## Focus
Either `aria-activedescendant` on the listbox or roving tabindex on the options; the
selected option (or the first enabled option) is active on open. `:focus-visible` dual
ring (FOC-001…004) on every focusable item. On close, focus MUST return to the invoking
input.

## Accessibility requirements
- TMP-001 `.vd-timepicker` has `role="listbox"` with an accessible name; items have
  `role="option"` and `aria-selected="true|false"`.
- TMP-002 Keyboard behavior follows the listbox contract table above; disabled options
  (`:disabled`, `[aria-disabled="true"]`) are skipped.
- TMP-003 `:focus-visible` dual ring (FOC-001…004) on items; on close, focus MUST return
  to the invoking input.
- TMP-004 12h/24h: the format toggle is a separate control outside the listbox surface
  (segmented buttons or a switch); the listbox lists time options in the active format
  only. Reduced motion (MOB-001) collapses item transitions under both
  `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.border`, `color.role.canvas`
(via `focus.ring.offset-color`), `color.role.text-primary`, `color.role.text-secondary`,
`color.role.focus`, `color.primitive.gray-1000`, `color.primitive.gold-4` (dark selected),
`z.popover`, `shadow.4`, `radius.fib-5`, `radius.fib-8`, `space.fib-3/5/13/89/144`,
`line.hair`, `type.size.sm`, `type.leading.tight`, `motion.89`, `easing.out`,
`focus.ring.width/offset/color/offset-color/glow`, `math.inv-phi-sq`.

## Deviations & references
No APG timepicker pattern exists; adopts the APG Listbox keyboard contract as the
behavioral reference. Consulted: Carbon TimePicker (per `conventions/mappings.md`) —
adopts the anchored dropdown + input model and tabular numerals; deviates on surface
elevation (`shadow.4` golden fib pair instead of a flat layer) per
`foundations/elevation.md`.
