---
slug: carousel
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
---

## Summary
A carousel: a region that shows one slide at a time from an ordered set, with
prev/next controls and dot navigation. Use for promotional or media content
where only one item fits the layout at a time. NOT for: peer-level view
switching (use tabs), primary navigation (use navbar/breadcrumb), sequential
steps (use stepper), or content that must all be visible at once (use a grid
or accordion).

## Anatomy
`.vd-carousel` — root `role="region"`, `aria-roledescription="carousel"`,
accessible name via `aria-label` — containing `.vd-carousel-track` (the
behavioral layer sets `--_vd-carousel-index`, zero-based, driving
`translateX`), `.vd-carousel-slide` children (`role="group"`,
`aria-roledescription="slide"`, `aria-label="Slide n of N"`), the
`.vd-carousel-prev` / `.vd-carousel-next` `<button>` controls, and
`.vd-carousel-dots` (`<ul>`) of `.vd-carousel-dot` `<button>`s carrying
`[aria-current="true"]` / `[aria-selected="true"]` on the current slide.

## States
- Rest: `color.role.canvas` surface, `radius.fib-8` clip.
- Slide change: track `transform: translateX` driven by
  `--_vd-carousel-index`, `motion.377` (377ms) `easing.out`.
- Control hover: background `color.role.layer-hover`, border
  `color.role.text-secondary`.
- Current dot (`[aria-current]`/`[aria-selected="true"]`): background +
  border `color.role.focus`.
- Focus-visible on prev/next/dots: dual ring via `focus.ring.*` (FOC-001…004).
- Disabled controls (`:disabled`, `[aria-disabled="true"]`): opacity
  `math.inv-phi-sq`, `cursor: not-allowed`.
- Reduced motion (MOB-001): the 377ms track transition collapses to an
  instant jump; control transitions collapse.
Each state swaps only tokens.

## Props / API
Contract-level: region + track + N slides + prev/next buttons + dots list.
The behavioral layer owns `--_vd-carousel-index` on the track, `[aria-current]`
on dots, `aria-hidden` on off-screen slides, keyboard arrows, optional
autoplay/loop (`data-*` hooks), and the slide-change announcement. Core ships
presentation only; `transform` is `translateX(calc(var(--_vd-carousel-index,
0) * -100%))` with `transition: transform 377ms ease-out`.

## Keyboard — NORMATIVE: APG Carousel Pattern (`patterns/carousel/`)
Follows the official W3C ARIA APG Carousel Pattern (`role="region"`,
`aria-roledescription="carousel"`, slide picker / tab-like or button controls,
and live-region pause when auto-rotating):

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move between rotation toggle, prev/next buttons, and dot controls |
| Enter / Space | Activate the focused control / dot (or pause/resume auto-rotation) |
| Left / Right arrow | Previous / next slide (flipped logically in `:dir(rtl)` slide track and controls) |
| Home / End | First / last slide (when dot controls use tablist semantics in behavioral layer) |

## Focus
Prev, next, and dots are native buttons in the tab order, each with the
dual-ring `:focus-visible` treatment (FOC-001…004). The region itself is not
focusable unless the behavioral layer makes it a single tab stop for arrow-key
handling; slide content keeps its own natural focus order.

## Accessibility requirements
- CAR-001 The root has `role="region"`, `aria-roledescription="carousel"`, and
  an accessible name (`aria-label`, e.g. "Featured products").
- CAR-002 Each slide has `role="group"`, `aria-roledescription="slide"`, and
  `aria-label="Slide n of N"`; off-screen slides get `aria-hidden="true"`
  (behavioral layer).
- CAR-003 Slide changes are announced through a visually hidden
  `aria-live="polite"` region in the behavioral layer.
- CAR-004 Prev/next/dot controls are real `<button>`s with action-based
  accessible names ("Previous slide", "Next slide", "Go to slide n"), the
  dual-ring `:focus-visible` ring, and `:disabled`/`[aria-disabled="true"]`
  states.
- CAR-005 Reduced motion (MOB-001) collapses the track transition to an
  instant jump; any autoplay must pause on hover/focus and must not run
  under reduced motion.

## Tokens consumed
`radius.fib-8`, `radius.full`; `color.role.canvas`, `color.role.border`,
`color.role.focus`, `color.role.text-primary`, `color.role.text-secondary`,
`color.role.layer-hover`, `color.role.focus-glow`;
`space.fib-2`, `space.fib-5`, `space.fib-8`, `space.fib-34`;
`line.hair`, `line.thin`; `motion.89`, `motion.377`, `easing.out`;
`focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`; `math.inv-phi-sq`.

## Deviations & references
Conforms to the W3C ARIA APG Carousel Pattern (`https://www.w3.org/WAI/ARIA/apg/patterns/carousel/`).
Nearest consulted Carbon reference: Carbon ContentSwitcher for prev/next semantics,
per `conventions/mappings.md`. Reference implementation:
`vd3/css/components/flow.css` (`.vd-flow` / `.vd-carousel`) — adopts the
track-translateX + overlay controls + dot indicators model; deviates on
control styling (canvas chip with hair border instead of translucent dark
circles, so contrast holds over arbitrary slide imagery in both themes),
transition `motion.377` (F₁₄ = 377ms) instead of 610ms, and the golden
dual-ring focus (FOC-001…004) instead of a flat 2px outline.
