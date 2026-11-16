---
slug: switch
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
---

## Summary
A toggle switch for a single binary setting (on/off). Use when the effect of the
change should be immediate and visible. NOT for: multi-option choices (use radio
group or segmented control), or settings that need a confirmation (use checkbox +
submit).

## Anatomy
Track (`.vd-switch`, `role="switch"`, `aria-checked`) containing a thumb
(`.vd-switch-thumb`). Typically paired with a `.vd-label` via `aria-labelledby`
or a wrapping `<label>`. Track ratio is golden at every size: sm 21/13, md 34/21,
lg 55/34 ≈ φ.

## States
Rest (layer fill, border) / hover (border darkens; checked track dims 4%) /
`aria-checked="true"` (track = `color.role.focus`, thumb = ink, travel 144ms via
`inset-inline-start` — logical property, RTL-safe) / `:focus-visible` (dual ring,
FOC-001/002) / disabled (`:disabled`, `[aria-disabled="true"]`, opacity 1/φ²).
Each state swaps only tokens.

## Props / API
Contract-level: `role="switch"` + `aria-checked="true|false"` on a
`<button type="button">` (or `<input type="checkbox" role="switch">`). Label via
`aria-labelledby` or wrapping label. Sizes: `sm | md | lg` classes.

## Keyboard — NORMATIVE: APG Switch Pattern

| Key | Effect |
|---|---|
| Space / Enter | Toggle `aria-checked` |
| Tab / Shift+Tab | Move focus to/from the switch (switch is a single tab stop) |

## Focus
Single tab stop; `:focus-visible` dual ring per FOC-001…004.

## Accessibility requirements
- SWT-001 The element has `role="switch"` and `aria-checked` reflecting state.
- SWT-002 State changes are announced by the role natively (no extra live region).
- SWT-003 Disabled state uses `:disabled` or `aria-disabled="true"` and is not focusable when `:disabled`.
- SWT-004 Thumb travel uses logical `inset-inline-start` so RTL layouts mirror the direction of travel.
- SWT-005 Reduced motion (MOB-001) collapses the 144ms thumb transition.

## Tokens consumed
`space.fib-1/13/21/34/55`, `border-width hair/thin`, `radius.full` (C-04),
`color.role.layer/border/focus/text-secondary`, `color.primitive.gray-1000`,
`color.primitive.gold-4` (dark checked), `duration 89/144`, `ease-out`,
`focus.ring.*`, `math.inv-phi-sq` (disabled opacity).

## Deviations & references
None — conforms to APG Switch Pattern. Consulted: Carbon Toggle — adopts the
same role/aria-checked contract; deviates on track proportions (golden φ ratio
instead of fixed 2:1).
