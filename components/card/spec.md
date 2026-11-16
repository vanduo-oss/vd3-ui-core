---
slug: card
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A card is a contained surface that groups related content, media, and actions
into one unit. Use for dashboard tiles, previews, and forms in context. NOT
for: modal interruptions (use dialog), transient confirmations (use toast),
inline status messages (use alert), or primary navigation chrome (use navbar).

## Anatomy
`.vd-card` (an `<article>`, `<div>`, or interactive `<a>`/`<button>`) with
optional sub-elements: `.vd-card-image` (media, `img` with `object-fit:
cover`), `.vd-card-header` (`.vd-card-title` + `.vd-card-subtitle`),
`.vd-card-body`, `.vd-card-footer`. When any sub-element is present the
container padding resets to 0 and sections carry their own padding. Modifiers:
`--golden` / `--golden-portrait` (aspect ratio), `--compact` / `--spacious`
(padding scale), `--elevated` (shadow step), `--glass` (frosted, C-02),
`--interactive` (or `a.vd-card` / `button.vd-card`).

## States
Rest (bg `color.role.layer`, border `line.hair` + `color.role.border`,
`radius.fib-8`, `shadow.1`, padding `space.fib-21`) / `--elevated` (swaps
`shadow.1` → `shadow.2`) / `--glass` (bg → canvas at `glass.tint-lg` alpha,
`backdrop-filter` `glass.blur-lg` + `glass.saturate-lg`, `shadow.3`; dark theme
swaps the tint base and adds an inset hairline) / hover on interactive cards
(translateY `-space.fib-1`, `shadow.4` + `glow.fib-13` `color.role.focus-glow`,
border → `color.role.focus`) / `:focus-visible` on interactive cards (dual
ring, `focus.ring.*`, FOC-001/002) / reduced motion (MOB-001: transform and
`motion.base` transitions collapse). Each state swaps only tokens.

## Props / API
Contract-level: `.vd-card` on a semantic container; the interactive variant
MUST be a native `<a href>` or `<button type="button">` (never a `<div>` with
`tabindex`). Variants are classes: `golden | golden-portrait | compact |
spacious | elevated | glass | interactive`. No JavaScript is required; heading
level inside `.vd-card-title` follows the page outline (h2–h4).

## Keyboard — NORMATIVE: no APG pattern (behavioral contract)

No APG pattern exists for cards; a static card has no keyboard interaction, and
an interactive card inherits native link/button semantics.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to/from an interactive card (`a.vd-card`, `button.vd-card`); a static card is never a tab stop |
| Enter / Space | Activate the native link or button the interactive card wraps |

## Focus
A static card is not focusable. An interactive card is a single tab stop in
DOM order; `:focus-visible` renders the dual ring (`focus.ring.offset` +
`focus.ring.offset-color` gap, `focus.ring.width` + `focus.ring.color` ring,
`focus.ring.glow` halo) per FOC-001…004.

## Accessibility requirements
- CRD-001 A static card carries no ARIA role; grouping semantics come from the native container (`<article>`/`<section>`) and the heading inside `.vd-card-title`.
- CRD-002 An interactive card MUST be a native `<a href>` or `<button>` so focusability and activation are free; `tabindex` on a non-interactive element is prohibited.
- CRD-003 `.vd-card-title` contains a real heading element matched to the page outline; `.vd-card-subtitle` is descriptive text, not a heading.
- CRD-004 `.vd-card-image img` MUST have a meaningful `alt`, or `alt=""` when purely decorative (WCAG 1.1.1).
- CRD-005 Hover elevation (translateY) and all card transitions MUST collapse under MOB-001 (`prefers-reduced-motion: reduce` and `[data-motion="reduce"]`); interactive focus ring per FOC-001…004.

## Tokens consumed
`color.role.canvas`, `color.role.layer`, `color.role.border`,
`color.role.text-primary`, `color.role.focus`, `color.role.focus-glow`,
`line.hair`, `radius.fib-8`, `shadow.1`, `shadow.2`, `shadow.3`, `shadow.4`,
`space.fib-1`, `space.fib-2`, `space.fib-8`, `space.fib-13`, `space.fib-21`,
`space.fib-34`, `type.size.xl`, `type.size.sm`, `type.size.base`,
`type.leading.snug`, `type.leading.normal`, `motion.base`, `easing.out`,
`aspect.golden`, `aspect.golden-portrait`, `glass.tint-lg`, `glass.blur-lg`,
`glass.saturate-lg`, `glow.fib-13`, `focus.ring.width`, `focus.ring.offset`,
`focus.ring.color`, `focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
No APG pattern exists for cards; the contract is native landmark/heading
semantics plus native link/button activation for the interactive variant.
Consulted: Carbon Tile — adopts the header/body/footer anatomy and the
elevated/interactive variants per `conventions/mappings.md`; deviates on
elevation (the Fibonacci shadow ladder `shadow.1`–`shadow.4` instead of
Carbon's flat layers) and adds the golden aspect-ratio variants
(`aspect.golden` / `aspect.golden-portrait`).
