---
slug: spinner
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A small animated indicator that a region is busy with an unknown-duration
operation. Use inside or above the loading region, paired with a `role="status"`
label. NOT for: determinate progress (use progress), full-page loads where a
skeleton previews the layout (use skeleton), or transient confirmations (use
toast).

## Anatomy
`.vd-spinner` (the border spinner, decorative — `aria-hidden="true"`) optionally
paired with `.vd-spinner--label` (visible status text) inside a container
carrying `role="status"` (polite live region). Sizes: `sm` 13px / `md` 21px /
`lg` 34px (Fibonacci F₇/F₈/F₉).

## States
Rest (hair ring, transparent body, `border-top-color` = `color.role.focus`,
rotating 610ms = `motion.610` linear infinite) / sizes `sm|md|lg` (swap
`--_vd-spinner-size` only) / `[aria-disabled="true"]` (opacity
`math.inv-phi-sq`) / `:focus-visible` (dual ring, only if made focusable) /
reduced motion (MOB-001: animation stops entirely, a static ring remains).

## Props / API
Contract-level: a `<span class="vd-spinner" aria-hidden="true">` inside a
wrapper with `role="status"` and an accessible name (visible
`.vd-spinner--label` text or `aria-label`). Size classes
`.vd-spinner--sm|--md|--lg` (single-dash aliases too). No value props — the
spinner communicates "busy", never "how much".

## Keyboard — NORMATIVE: APG
No APG pattern exists for a spinner; the contract is the WAI-ARIA `status` role /
`aria-busy` state. The spinner is not focusable and has no key bindings.

| Key | Effect |
|---|---|
| — | None. The spinner is a non-focusable status indicator with no keyboard interaction |

## Focus
Not focusable; the `role="status"` wrapper is not a tab stop either. If a
behavioral layer makes the spinner focusable, it receives the dual-ring
`:focus-visible` treatment (FOC-001…004).

## Accessibility requirements
- SPN-001 The spinner glyph is `aria-hidden="true"`; the busy state is carried
  by `role="status"` on the wrapper (or `aria-busy="true"` on the loading
  region).
- SPN-002 The status wrapper has an accessible name — visible label text
  (`.vd-spinner--label`) or `aria-label` — announced politely when it appears.
- SPN-003 Reduced motion (MOB-001) stops the 610ms rotation via both
  `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`; the
  static ring remains visible so the busy state is not lost.

## Tokens consumed
`space.fib-13/21/34` (sizes), `space.fib-5` (label gap),
`line.hair` (ring weight), `radius.full` (C-04),
`color.role.focus` (arc), `color.role.text-secondary` (label),
`color.role.canvas` (ring offset), `type.size.sm` + `type.leading.normal`
(label), `motion.610` (rotation), `easing.linear`, `math.inv-phi-sq`
(disabled opacity), `focus.ring.*`.

## Deviations & references
No APG pattern exists; contract is WAI-ARIA live-region roles (`status`) plus
`aria-busy`. Consulted: Carbon Loading — adopts the same decorative-glyph +
live-region split; deviates on cadence (F₁₅ = 610ms linear instead of Carbon's
~2s ease) and on the size ladder (Fibonacci 13/21/34px instead of fixed px
steps). Reference implementations: `vd3/css/components/spinner.css`,
`vd3/css/components/preloader.css`.
