---
slug: accordion
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
---

## Summary
A native disclosure widget built on `<details>`/`<summary>`: a header that
expands to reveal a content panel. Use for FAQs, settings lists, and any
progressive disclosure of related content. NOT for: switching between peer
views (use tabs), blocking interruptions (use dialog), or long multi-step
content (use a page/stepper).

## Anatomy
`.vd-accordion` is the `<details>` element (`open` attribute = expanded state);
`.vd-accordion-summary` is its `<summary>` child (implicit button role,
natively focusable and togglable). The chevron is `.vd-accordion-icon` or the
`.vd-accordion-summary::after` glyph (decorative, rotated 45deg → -135deg on
`[open]`; the physical `border-right`/`border-bottom` strokes are intentional
— a rotated chevron glyph, the only permitted physical-direction use).
`.vd-accordion-content` is the panel body. Sibling `.vd-accordion` elements
can be made mutually exclusive with the native `name` attribute.

## States
Rest (bg `color.role.canvas`, border `line.hair` + `color.role.border`,
`radius.fib-5`, margin-block-end `space.fib-8`) / summary hover (bg
`color.role.layer-hover`, transition `motion.89` + `easing.out`) / `[open]`
(chevron rotates to -135deg over `motion.144` + `easing.out`, panel reveals
with a `line.hair` top border, body text `color.role.text-secondary` at
`type.leading.relaxed`) / `:focus-visible` on the summary (inset dual ring:
`focus.ring.offset` canvas-colored gap + `focus.ring.width` ring in
`focus.ring.color`, FOC-001/002) / reduced motion (MOB-001: chevron transition
collapsed under both `prefers-reduced-motion: reduce` and
`[data-motion="reduce"]`). Each state swaps only tokens.

## Props / API
Contract-level: `<details class="vd-accordion" [open] [name="group"]>` with a
`<summary class="vd-accordion-summary">` and a
`<div class="vd-accordion-content">` panel. Zero JavaScript; the `open`
attribute is the single source of truth for expanded state. When a behavioral
layer re-implements the header as a `<button>`, it MUST mirror the state with
`aria-expanded` + `aria-controls` per `conventions/content.md`. No
size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG Accordion Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to/from each summary header (every summary is a tab stop, DOM order) |
| Enter / Space | Toggle the panel open/closed (native `<summary>` activation) |
| Down / Up arrow (optional per APG) | Move focus to the next/previous accordion header — optional in the APG; native `<details>` relies on Tab (see Deviations) |
| Home / End (optional per APG) | Move focus to the first/last header — optional, not provided by native `<details>` |

## Focus
Each `<summary>` is natively focusable and is the only tab stop per item;
focus stays on the summary when the panel toggles (the panel itself is not a
focus container). `:focus-visible` renders the inset dual ring per
FOC-001…004.

## Accessibility requirements
- ACC-001 Native disclosure semantics: `<details>`/`<summary>` expose the expanded state to AT without extra ARIA; the `open` attribute is the state.
- ACC-002 If a behavioral layer replaces the summary with a `<button>`, `aria-expanded="true|false"` and `aria-controls="<panel-id>"` MUST be kept in sync with the panel's visibility (conventions/content.md).
- ACC-003 The chevron glyph is decorative (`aria-hidden="true"` when an element icon): state is conveyed by the disclosure itself, never by the glyph or color alone.
- ACC-004 `:focus-visible` inset dual ring on the summary per FOC-001…004 (`focus.ring.offset`, `focus.ring.width`, `focus.ring.color`, canvas gap).
- ACC-005 Reduced motion (MOB-001) collapses the `motion.144` chevron rotation under both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`line.hair`, `line.thin`, `radius.fib-5`, `color.role.canvas`,
`color.role.border`, `color.role.text-primary`, `color.role.text-secondary`,
`color.role.layer-hover`, `color.role.focus`, `space.fib-8`, `space.fib-13`,
`space.fib-21`, `type.size.base`, `type.leading.tight`, `type.leading.relaxed`,
`motion.89`, `motion.144`, `easing.out`, `focus.ring.offset`,
`focus.ring.width`, `focus.ring.color`.

## Deviations & references
Conforms to the APG Accordion Pattern via native `<details>`/`<summary>`;
the APG-optional arrow/Home/End header navigation is not provided by the
native element (Tab order instead) — a behavioral layer may add it without
changing the CSS contract. Consulted: Carbon Accordion — adopts the
header/content anatomy and the chevron rotation direction per
`conventions/mappings.md`; deviates on native `<details>` disclosure (zero-JS,
`open` attribute as state) instead of JS-driven height animation, and on the
inset (rather than outset) focus ring so the ring stays inside the rounded
`radius.fib-5` container.
