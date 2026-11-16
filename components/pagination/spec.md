---
slug: pagination
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A page-navigation control that splits large collections into pages and lets the
user move between them, with previous/next controls and a current-page
indicator. Use for paginated lists, tables, or search results. NOT for:
infinite scroll content, a single unbroken list (omit it), or step-by-step
wizards (use a stepper).

## Anatomy
`<nav class="vd-pagination" aria-label="Pagination">` (navigation landmark)
containing `.vd-pagination-list` (`<ol>` or `<ul>`) of `.vd-pagination-item`
(`<li>`) elements, each holding a `.vd-pagination-link` (`<a href>` or
`<button type="button">`). The current page's link carries
`aria-current="page"`. Prev/next items use `.vd-pagination-link--prev` /
`.vd-pagination-link--next` (single-dash aliases `.vd-pagination-link-prev` /
`-next`) with chevron glyphs and an action `aria-label`.

## States
Rest (canvas fill, hairline border) / hover (layer-hover fill, secondary-text
border) / `[aria-current="page"]` (focus-color fill, gray-1000 ink, 600) /
`:focus-visible` (dual ring via `focus.ring.*`, raised z-index) /
`:disabled` and `[aria-disabled="true"]` (secondary text, opacity
`math.inv-phi-sq`, no pointer events). Each state swaps only tokens.

## Props / API
Contract-level markup: `<nav class="vd-pagination" aria-label="Pagination"><ul class="vd-pagination-list">`
with `<li class="vd-pagination-item"><a class="vd-pagination-link" href="?page=2">2</a></li>`
per page; current page adds `aria-current="page"`; prev/next add the modifier
class plus `aria-label="Previous page"` / `"Next page"` and are disabled at the
bounds. No size modifiers in v1.

## Keyboard — NORMATIVE: no APG pattern exists
No APG pagination pattern exists; the behavioral contract is the native
link/button model inside a navigation landmark:

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus through the page links in DOM order (disabled controls are skipped) |
| Enter / Space | Activate the focused page link or button |
| — | No arrow-key roving: pagination is a link list, not a widget |

## Focus
Sequential tab stops in DOM order; `:focus-visible` dual ring per FOC-001…004
with `z-index` raise so the ring is not clipped by the neighboring item.
Disabled prev/next are not focusable (`:disabled`, or `aria-disabled="true"`
with pointer-events none).

## Accessibility requirements
- PAG-001 The control MUST be wrapped in a `<nav>` landmark with an accessible name (`aria-label`, e.g. "Pagination"); page links SHOULD use descriptive text or `aria-label` ("Page 2") in addition to the number.
- PAG-002 The current page's link MUST expose `aria-current="page"` and MUST NOT navigate on activation.
- PAG-003 Prev/next controls MUST have action-based `aria-label`s ("Previous page", "Next page") and MUST be disabled (`:disabled` / `aria-disabled="true"`) at the first/last page.
- PAG-004 Reduced motion (MOB-001) collapses link transitions via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas`, `color.role.layer`, `color.role.layer-hover`,
`color.role.text-primary`, `color.role.text-secondary`, `color.role.border`,
`color.role.focus`, `color.role.focus-glow`, `color.primitive.gray-1000`,
`line.hair`, `space.fib-2`, `space.fib-3`, `space.fib-5`, `space.fib-8`,
`space.fib-34`, `radius.fib-5`, `type.size.sm`, `type.leading.tight`,
`focus.ring.*`, `motion.89`, `easing.out`, `math.inv-phi-sq`.

## Deviations & references
No APG pattern exists for pagination; the contract is the WAI-ARIA navigation
landmark plus `aria-current="page"`. Consulted: Carbon Pagination — adopts the
nav landmark, `aria-label` on prev/next, and `aria-current` on the active page;
deviates on sizing (golden `space.fib-34` = 34px minimum hit width instead of a
fixed 32px) and on the active fill (focus role color instead of a dedicated
layer token) per `conventions/mappings.md`.
