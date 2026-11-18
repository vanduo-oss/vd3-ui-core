---
slug: breadcrumb
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
---

## Summary
A breadcrumb trail showing the user's location within the site hierarchy and
the path back to each ancestor page. Use for secondary navigation of nested
content (e.g. Shop / Category / Product). NOT for: primary navigation (use
navbar), linear multi-step flows (use a stepper), or flat single-level
structures where the current location is already obvious.

## Anatomy
`<nav aria-label="Breadcrumb">` (navigation landmark) containing
`.vd-breadcrumb` (`<ol>`) of `.vd-breadcrumb-item` (`<li>`) elements. Each
crumb holds a `.vd-breadcrumb-link` (`<a href>`); the last item's link carries
`aria-current="page"`. The separator is a decorative `::after` glyph (`/`) on
every item except the last, rendered with empty alt text so it is hidden from
assistive technology.

## States
Rest (interactive-color link) / hover (text-primary + layer-hover fill +
underline) / `:focus-visible` (dual ring via `focus.ring.*`) /
`[aria-current="page"]` (text-secondary, 600 weight, non-interactive) /
`:disabled` and `[aria-disabled="true"]` (text-secondary, opacity
`math.inv-phi-sq`). Each state swaps only tokens.

## Props / API
Contract-level markup: `<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb">`
with `<li class="vd-breadcrumb-item"><a class="vd-breadcrumb-link" href="…">…</a></li>`
per crumb; the current page keeps the same classes plus `aria-current="page"`.
No size or variant modifiers in v1.

## Keyboard — NORMATIVE: APG Breadcrumb Pattern (`patterns/breadcrumb/`)
Follows the official W3C ARIA APG Breadcrumb Pattern (ordered link list inside a
named `<nav>` landmark, with `aria-current="page"` on the current crumb):

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus through the breadcrumb links in DOM order |
| Enter | Activate the focused link (native `<a href>`) |
| — | No arrow-key roving: the trail is a link list, not a composite widget |

## Focus
Links are sequential tab stops in DOM order; `:focus-visible` dual ring per
FOC-001…004 (`focus.ring.*`). The `aria-current="page"` crumb is rendered
non-interactive (no pointer events, not a navigation target).

## Accessibility requirements
- BRC-001 The trail MUST be wrapped in a `<nav>` landmark with an accessible name (`aria-label`, e.g. "Breadcrumb").
- BRC-002 The last crumb MUST expose `aria-current="page"` and MUST NOT be a link to the current page.
- BRC-003 Separators are decorative: the `::after` glyph uses the empty alt-text syntax (`content: "/" / ""`) and is never announced; hierarchy meaning is carried by the list structure, not the glyph.
- BRC-004 Reduced motion (MOB-001) collapses link color/background transitions via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.interactive`, `color.role.text-primary`, `color.role.text-secondary`,
`color.role.layer-hover`, `color.role.canvas`, `focus.ring.*`, `space.fib-5`,
`radius.fib-3`, `type.size.sm`, `type.leading.tight`, `motion.89`, `easing.out`,
`math.inv-phi-sq`.

## Deviations & references
Conforms to the W3C ARIA APG Breadcrumb Pattern (`https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/`,
`<nav aria-label="Breadcrumb">` + `<ol>` + `aria-current="page"`). Consulted: Carbon Breadcrumb —
adopts the `nav > ol > li` anatomy and `aria-current` on the last item; deviates
on the separator (generated `::after` with empty alt text instead of a painted
`::before` glyph, so the separator is never announced and never leads the first
item) per `conventions/mappings.md` (vd3 follows no external system; Carbon is
consulted, not conformed to).
