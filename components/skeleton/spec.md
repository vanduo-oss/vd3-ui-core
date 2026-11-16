---
slug: skeleton
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A placeholder shape that previews the layout of content while it loads. Use
inside a container marked `aria-busy="true"` during data fetching. NOT for:
unknown-duration busy states without a known layout (use spinner), determinate
completion (use progress), or empty states after loading finished (use real
content or an empty-state pattern).

## Anatomy
One or more `.vd-skeleton` blocks inside the loading container. Shapes:
`.vd-skeleton--text` (1em tall line) and `.vd-skeleton--circle` (square via
`aspect-ratio`, pill radius, default F₉ = 34px). Width of any shape is set by
the behavioral layer through the `--_vd-skeleton-w` custom property (inline
style or utility), height through `--_vd-skeleton-h`.

## States
Rest (`color.role.layer-hover` fill, `radius.fib-5`, pulsing opacity 1 →
1/φ² over 377ms = `motion.377` `ease-in-out` infinite alternate) / shapes
`--text` / `--circle` / `[aria-disabled="true"]` (opacity `math.inv-phi-sq`) /
`:focus-visible` (dual ring, only if made focusable) / reduced motion
(MOB-001: pulse stops, static placeholder at full opacity).

## Props / API
Contract-level: purely presentational blocks, all `aria-hidden="true"`, inside
a container with `aria-busy="true"`. Sizing is data-driven: the behavioral
layer sets `--_vd-skeleton-w` (and optionally `--_vd-skeleton-h`) per block;
the CSS ships only defaults (100% width, F₇ height, F₉ circle). Shape
classes `.vd-skeleton--text|--circle` (single-dash aliases too).

## Keyboard — NORMATIVE: APG
No APG pattern exists for skeletons; the contract is `aria-busy` on the loading
container. Placeholders are not focusable and have no key bindings.

| Key | Effect |
|---|---|
| — | None. Skeleton blocks are non-focusable placeholders with no keyboard interaction |

## Focus
Not focusable. If a behavioral layer makes a placeholder focusable, it receives
the dual-ring `:focus-visible` treatment (FOC-001…004).

## Accessibility requirements
- SKL-001 The loading container carries `aria-busy="true"` while skeletons are
  shown; every `.vd-skeleton` block is `aria-hidden="true"`.
- SKL-002 When content arrives, the skeletons are removed and `aria-busy` is
  removed from the container so assistive technology announces the loaded
  content.
- SKL-003 Reduced motion (MOB-001) stops the 377ms opacity pulse via both
  `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`; a
  static placeholder remains visible.

## Tokens consumed
`color.role.layer-hover` (fill), `color.role.canvas` (ring offset),
`radius.fib-5` (base radius), `radius.full` (C-04, circle),
`space.fib-13` (default height), `space.fib-34` (default circle width),
`motion.377` (pulse), `easing.in-out`, `math.inv-phi-sq` (pulse floor +
disabled opacity), `focus.ring.*`.

## Deviations & references
No APG pattern exists; contract is `aria-busy` on the container. Consulted:
Carbon SkeletonPlaceholder — deviates on the animation (opacity pulse at
F₁₄ = 377ms `ease-in-out` alternate instead of Carbon's shimmer sweep), on the
fill token (`color.role.layer-hover` instead of a raw gray), and on sizing
(behavioral `--_vd-skeleton-w` custom property instead of fixed width
utilities). Reference implementation: `vd3/css/components/skeleton.css`.
