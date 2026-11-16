---
slug: navbar
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A sticky top navigation bar with a frosted-glass backdrop, carrying the brand,
the primary link list, and an actions area. Use for site-wide primary
navigation. NOT for: in-page section switching (use tabs or an anchor list),
sequential steps (use a stepper), or contextual page messages (use alert).

## Anatomy
`.vd-navbar` (a `<header>`, `position: sticky`, `z.sticky`) containing
`.vd-navbar-container` (max-width `container.xl`) with three regions:
`.vd-navbar-brand` (`.vd-navbar-brand-link`), `.vd-navbar-nav` wrapping a
`<nav aria-label="…">` landmark whose `.vd-navbar-list` holds `li > .vd-nav-link`
items, and `.vd-navbar-actions` (CTAs, theme switcher). The bar also sets
`scroll-margin-top` on `[id]` targets so in-page anchors are not hidden beneath
the sticky bar (compensation = `--vd-navbar-height` + `space.fib-13`).

## States
Rest (solid bg `color.role.canvas`, bottom border `line.hair` +
`color.role.border`, `shadow.2`; under `@supports (backdrop-filter)` the glass
state swaps bg to canvas at `glass.tint-md` alpha with `glass.blur-md` +
`glass.saturate-md`, dark theme via `[data-theme="dark"]`) / link hover (text →
`color.role.text-primary`, bg → `color.role.layer-hover`) / current page
(`.vd-nav-link[aria-current="page"]`: text `color.role.focus`, weight 600) /
`:focus-visible` on `.vd-nav-link` and `.vd-navbar-brand-link` (dual ring,
`focus.ring.*`, FOC-001/002). Link color/bg transitions run at `motion.89` +
`easing.out` and collapse under MOB-001. Each state swaps only tokens.

## Props / API
Contract-level: `<header class="vd-navbar">` with a single `<nav
aria-label="Primary">` inside `.vd-navbar-nav` (the accessible name is
mandatory when more than one `<nav>` exists on the page). Links are plain
`<a href>` elements with class `.vd-nav-link`; the active route link carries
`aria-current="page"`. `.vd-navbar-actions` hosts buttons (e.g. theme switcher)
and CTA links. No size variants in v1.

## Keyboard — NORMATIVE: no APG pattern (behavioral contract)

No APG pattern exists for a navigation bar; the contract is the WAI-ARIA
`navigation` landmark plus standard link semantics — no roving tabindex, no
arrow-key handling.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus through brand link, nav links (DOM order), and action buttons |
| Enter | Activate the focused link or button (native `<a>`/`<button>` behavior) |

## Focus
All links and buttons inside the navbar are tab stops in DOM order;
`:focus-visible` renders the dual ring (`focus.ring.offset` +
`focus.ring.offset-color`, `focus.ring.width` + `focus.ring.color`,
`focus.ring.glow`) per FOC-001…004.

## Accessibility requirements
- NAV-001 The link list is wrapped in a `<nav>` landmark with an accessible name (`aria-label` / `aria-labelledby`); `.vd-navbar` itself is a `<header>` banner when it spans the page width.
- NAV-002 The link to the current page carries `aria-current="page"`.
- NAV-003 The bar is `position: sticky` (in-flow, reserves layout space — no content overlap) and in-page anchor targets get `scroll-margin-top` so headings are not hidden under the bar.
- NAV-004 The glass backdrop is progressive enhancement behind `@supports (backdrop-filter)`; without support the solid `color.role.canvas` fallback preserves contrast.
- NAV-005 `:focus-visible` dual ring on every link per FOC-001…004; link transitions MUST collapse under MOB-001 (`prefers-reduced-motion: reduce` and `[data-motion="reduce"]`).

## Tokens consumed
`z.sticky`, `shadow.2`, `line.hair`, `container.xl`, `radius.fib-5`,
`space.fib-5`, `space.fib-8`, `space.fib-13`, `space.fib-21`, `space.fib-34`,
`type.size.lg`, `type.size.sm`, `color.role.canvas`, `color.role.layer-hover`,
`color.role.border`, `color.role.text-primary`, `color.role.text-secondary`,
`color.role.focus`, `color.role.focus-glow`, `glass.tint-md`, `glass.blur-md`,
`glass.saturate-md`, `motion.89`, `easing.out`, `focus.ring.width`,
`focus.ring.offset`, `focus.ring.color`, `focus.ring.offset-color`,
`focus.ring.glow`.

## Deviations & references
No APG pattern exists for a navbar; the contract is the WAI-ARIA `navigation`
landmark with native link semantics. Consulted: Carbon UI Shell Header —
adopts the sticky glass header, brand/actions regions, and the
`aria-current="page"` pattern per `conventions/mappings.md`; deviates on the
Fibonacci spacing scale and the golden focus hue (`color.role.focus`) instead
of Carbon's fixed header height and blue focus.
