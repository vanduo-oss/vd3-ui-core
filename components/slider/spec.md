---
slug: slider
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
---

## Summary
A slider for selecting a single numeric value from a continuous or stepped
range. Use for settings where immediate visual feedback matters (volume,
brightness, zoom, price filters). NOT for: discrete multi-choice (use radio
group or segmented control), numeric text entry (use input), or ranges where
the exact value must be typed.

## Anatomy
A native `<input type="range" class="vd-slider">` — the only focusable element.
Track: `space.fib-3` (6px) pill in `color.role.layer-hover`. Thumb: `space.fib-21`
(21px) circle in `color.role.focus` with a `border-width.thin` canvas rim and
`shadow.1`. A `<label>` (or `aria-labelledby`) names the slider; an optional
output element shows the current value (`aria-live` off — the slider itself
announces).

## States
Rest (track layer-hover, thumb focus color) / hover (thumb shadow) /
`:focus-visible` (dual ring on the thumb, FOC-001…004; `outline: none` on the
input) / active drag (native) / disabled (`:disabled` or
`[aria-disabled="true"]`, opacity `math.inv-phi-sq`, `cursor: not-allowed`,
not focusable when `:disabled`) / reduced motion (MOB-001: thumb transition
collapsed).

## Props / API
Contract-level: native range input attributes — `min`, `max`, `step`, `value`,
`disabled`, `aria-label`/`aria-labelledby`, optional `aria-valuetext` and
`aria-orientation="horizontal"` (default). Class `.vd-slider` on
`input[type="range"]`. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG Slider Pattern

| Key | Effect |
|---|---|
| Right / Up arrow | Increase value by `step` |
| Left / Down arrow | Decrease value by `step` |
| Page Up | Increase by a larger step (behavioral layer) |
| Page Down | Decrease by a larger step (behavioral layer) |
| Home | Set to `min` |
| End | Set to `max` |

## Focus
Single tab stop (the native input). Focus is shown as the dual ring on the thumb
(`:focus-visible`), never as a browser-default outline on the 6px track.

## Accessibility requirements
- SLD-001 The slider is a native `input[type="range"]` with an accessible name
  (`<label>`, `aria-label`, or `aria-labelledby`); it exposes the slider role,
  value, min, and max natively.
- SLD-002 Keyboard interaction follows the APG Slider pattern exactly (table
  above); no custom key handling.
- SLD-003 `:focus-visible` shows the dual ring on the thumb using
  `focus.ring.*` (width/offset ≥ 2px = F₃).
- SLD-004 Disabled state uses `:disabled` or `aria-disabled="true"`, is not
  focusable when `:disabled`, and dims via `math.inv-phi-sq`.
- SLD-005 Reduced motion (MOB-001) collapses the 89ms thumb transition via both
  `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`space.fib-3` (track height), `space.fib-21` (thumb diameter),
`radius.full` (C-04, track + thumb), `color.role.layer-hover` (track),
`color.role.focus` (thumb + filled progress), `color.role.canvas` (thumb rim +
ring offset), `line.thin` (thumb rim), `shadow.1` (thumb elevation),
`motion.89` (thumb transition), `easing.out`, `math.inv-phi-sq` (disabled
opacity), `focus.ring.*`.

## Deviations & references
Conforms to the APG Slider pattern (keyboard contract unchanged). Consulted:
Carbon Slider — adopts the same native-input + APG keyboard contract; deviates
on geometry (track F₃ = 6px, thumb F₈ = 21px with a canvas rim and `shadow.1`,
instead of Carbon's flat 4px track / 16px thumb) and adds the filled
`::-moz-range-progress` in the focus role. Reference implementation:
`vd3/css/components/slider.css`.
