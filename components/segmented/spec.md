---
slug: segmented
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
---

## Summary
A segmented control is a single-select row of pill options — a visible,
mutually exclusive choice set. Use when there are 2–5 short, always-visible
options (view modes, ranges, filters). NOT for: navigation between views (use
tabs), multi-select (use a checkbox group), more than ~5 options or long
labels (use a select), or binary on/off (use switch).

## Anatomy
`.vd-segmented` (`role="radiogroup"` + `aria-label`) containing
`.vd-segmented-item` buttons (`role="radio"` + `aria-checked="true|false"`).
When the segments act as toggles instead of a choice set, items may use
`aria-pressed` instead (see SEG-003). The selected item is the canvas pill
with `shadow.1`.

## States
Rest (layer pill container, hair border) / item hover (`color.role.layer-hover`
fill, text-primary) / selected `[aria-checked="true"]` or `[aria-pressed="true"]`
(canvas fill + `shadow.1` + text-primary, 600 weight; dark theme uses
`layer-hover` fill for contrast) / `:focus-visible` dual ring (`focus.ring.*`)
/ disabled (`:disabled`, `[aria-disabled="true"]`, opacity `math.inv-phi-sq`).
Each state swaps only tokens.

## Props / API
Contract-level: `role="radiogroup"` wrapper with an accessible name; each item
a `<button type="button">` with `role="radio"` + `aria-checked` (single-select)
or `aria-pressed` (toggle segments). Exactly one item checked in single-select
mode. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG Radio Group Pattern (radiogroup semantics)

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move into / out of the group; the checked item (or the first, if none) is the single tab stop |
| Right / Down arrow | Move focus AND check the next item, wrapping at the end |
| Left / Up arrow | Move focus AND check the previous item, wrapping at the start |
| Space | Check the focused item (when focus moved without activation) |

## Focus
Roving tabindex: only the checked item (or the first item when none is
checked) has `tabindex="0"`; the rest `tabindex="-1"` (behavioral layer). CSS
renders the `[aria-checked]`/`[aria-pressed]` selected state and the
`:focus-visible` dual ring on `.vd-segmented-item`.

## Accessibility requirements
- SEG-001 `role="radiogroup"` with an accessible name, items with `role="radio"` + `aria-checked`, wiring is mandatory for single-select.
- SEG-002 Roving tabindex per APG radio: one tab stop; arrow keys move focus and selection (automatic activation), wrapping at both ends.
- SEG-003 An `aria-pressed` variant is allowed for toggle-style segments (e.g. inside a toolbar); single-select must use `aria-checked`.
- SEG-004 Disabled items use `:disabled` or `aria-disabled="true"`, leave the roving order, and render at `math.inv-phi-sq` opacity; reduced motion (MOB-001) collapses the 89ms state transitions.

## Tokens consumed
`space.fib-1/3/13`, `line.hair`, `radius.full` (C-04), `shadow.1`,
`color.role.layer/layer-hover/canvas/text-primary/text-secondary/border`,
`color.role.focus` + `color.role.focus-glow` (via `focus.ring.*`),
`focus.ring.width/offset/color/offset-color/glow`, `type.size.sm`,
`type.leading.tight`, `motion.89`, `easing.out`, `math.inv-phi-sq`.

## Deviations & references
Conforms to the APG Radio Group pattern (radiogroup semantics) for the
single-select form. Consulted: Carbon SegmentedControl / ButtonGroup — adopts
the pill container and single-selection model; deviates on the selected
treatment (canvas pill + `shadow.1` instead of a flat fill) per
`foundations/elevation.md`, and on dark-theme selected fill (layer-hover)
for contrast parity.
