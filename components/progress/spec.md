---
slug: progress
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A progress bar indicating completion of a determinate task, or ongoing activity
when indeterminate. Use for uploads, form submission, multi-step processes, and
any operation whose completion percentage is known (or whose duration is not).
NOT for: instantaneous feedback (use toast), blocking interruptions (use dialog),
or unknown-duration work where a spinner communicates better (use spinner).

## Anatomy
`.vd-progress` (the track, carries `role="progressbar"`) containing a single
`.vd-progress-bar` (the fill). Track: layer fill, `radius.full` pill,
`space.fib-5` (8px) tall. Fill: `color.role.focus` by default, width driven by
the `--_vd-progress-value` custom property.

## States
Rest (fill at `--_vd-progress-value`, default 0%) / determinate update
(`transition: width` 233ms = `motion.233`, `ease-out`) / indeterminate
(`.vd-progress--indeterminate`: golden-split bar 1/φ² wide sliding via
`inset-inline-start` keyframes at 987ms = `motion.987`, `ease-in-out` — logical
property, RTL-safe) / variants `.vd-progress--success|--warning|--critical`
(swap only the `--_vd-progress-fill` custom property: `golden-3` / `focus` /
`critical`) / `[aria-disabled="true"]` (opacity `math.inv-phi-sq`) /
`:focus-visible` (dual ring, only if the behavioral layer makes the track
focusable) / reduced motion (MOB-001: width transition and slide animation
collapsed).

## Props / API
Contract-level: `role="progressbar"` on `.vd-progress` with `aria-valuemin`,
`aria-valuemax`, `aria-valuenow` (all omitted when indeterminate) and an
accessible name via `aria-label`/`aria-labelledby`. The value is delivered by
the behavioral layer — it sets the `--_vd-progress-value` custom property on
`.vd-progress` (or an inline `width` on `.vd-progress-bar`); the CSS ships no
hardcoded value. Optional `aria-valuetext` for human-readable progress.
Variant classes `.vd-progress--success|--warning|--critical` (single-dash
aliases too) may sit on the track or the bar.

## Keyboard — NORMATIVE: APG
No APG pattern exists for progress; the contract is the WAI-ARIA `progressbar`
role. The component is not focusable and has no key bindings — value changes are
conveyed through `aria-valuenow`/`aria-valuetext`, never through keys.

| Key | Effect |
|---|---|
| — | None. Progress is a non-focusable status indicator with no keyboard interaction |

## Focus
Not focusable by default. If a behavioral layer makes the track focusable, it
receives the dual-ring `:focus-visible` treatment (FOC-001…004).

## Accessibility requirements
- PRG-001 `.vd-progress` has `role="progressbar"`; determinate usage sets
  `aria-valuemin`/`aria-valuemax`/`aria-valuenow`, indeterminate usage omits
  `aria-valuenow`.
- PRG-002 The progressbar has an accessible name (`aria-label` or
  `aria-labelledby`); `aria-valuetext` is used when the numeric value is not
  human-meaningful.
- PRG-003 Indeterminate state is signaled by the absence of `aria-valuenow` plus
  `aria-busy="true"` on the surrounding region while the operation runs.
- PRG-004 Reduced motion (MOB-001) collapses the 233ms width transition and stops
  the 987ms indeterminate slide; the bar remains visible as a static fill.

## Tokens consumed
`space.fib-5` (track height), `radius.full` (C-04), `color.role.layer` (track),
`color.role.focus` (default/warning fill), `color.role.critical` (critical
fill), `color.primitive.golden-angle.3` (success fill, light),
`color.primitive.golden-angle.6` (success fill, dark), `math.inv-phi-sq`
(indeterminate width + disabled opacity), `motion.233` (width transition),
`motion.987` (slide), `easing.out`, `easing.in-out`, `focus.ring.*`,
`color.role.canvas` (ring offset).

## Deviations & references
No APG pattern exists; contract is the WAI-ARIA `progressbar` role. Consulted:
Carbon ProgressBar — adopts the same role/aria-valuenow contract; deviates on
track geometry (F₅ = 8px pill on `color.role.layer` instead of Carbon's
layer-02 track) and on indeterminate motion (logical `inset-inline-start` slide
at F₁₆ = 987ms instead of a physical translate, so RTL mirrors correctly).
Reference implementation: `vd3/css/components/progress.css`.
