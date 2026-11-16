---
slug: menubar
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
---

## Summary
A menubar: a horizontal strip of top-level menu triggers, each hosting a
`.vd-menu` dropdown. Use for application-level command groups that must stay
visible (File / Edit / View…). NOT for: page-level navigation (use navbar),
single trigger actions (use menu button alone), or view switching within one
page region (use tabs).

## Anatomy
`.vd-menubar` (`role="menubar"`, horizontal by default, `aria-orientation` may
be set) containing `.vd-menubar-item` triggers (`role="menuitem"`,
`aria-haspopup="menu"`, `aria-expanded`, optional chevron glyph). Each item
hosts a `.vd-menu` (`role="menu"`) anchored beneath it; the menubar item is
`position: relative` so the absolute `.vd-menu` drops from it.

## States
Bar rest (layer surface, hairline block-end border) / item hover (text-primary
+ `layer-hover` fill) / `[aria-expanded="true"]` (text-primary, 600 weight,
`layer-hover` fill — the open item) / item `:focus-visible` (dual ring
FOC-001…004) / disabled (`:disabled`, `[aria-disabled="true"]`,
`math.inv-phi-sq` opacity) / dark theme (layer + border role swaps). Each
state swaps only tokens.

## Props / API
Contract-level: `role="menubar"` wrapper (default `aria-orientation="horizontal"`);
each item `role="menuitem"` + `aria-haspopup="menu"` + `aria-expanded="true|false"`;
hosted `.vd-menu` per menu/spec.md (MNU-001…005). Visibility of each dropdown
toggled via `hidden`. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG Menubar Pattern

| Key | Effect |
|---|---|
| Right / Left Arrow (in menubar) | Move focus to next / previous menubar item, wrapping at the ends |
| Down Arrow (on a menubar item) | Open its dropdown and focus the first menu item |
| Enter / Space (on a menubar item) | Open its dropdown and focus the first menu item |
| Up Arrow (on a menubar item) | Open its dropdown and focus the last menu item |
| Escape (in dropdown) | Close the dropdown; focus returns to the menubar item |
| Down / Up / Home / End (in dropdown) | Navigate menu items per the APG menu contract (wrapping) |
| Tab | Leave the menubar (dropdowns close) |

## Focus
Roving tabindex in the menubar: only one item is in the tab order
(`tabindex="0"` on the current item, `-1` on the rest). Arrow keys move focus
across items; opening a dropdown moves focus into its `.vd-menu`. `:focus-visible`
dual ring on the focused item.

## Accessibility requirements
- MBR-001 The bar has `role="menubar"` (horizontal default); each trigger is `role="menuitem"` with `aria-haspopup="menu"` and `aria-expanded` reflecting its dropdown state.
- MBR-002 Horizontal arrow keys move focus between menubar items with wrap-around; Down/Enter/Space open the focused item's dropdown and move focus into it.
- MBR-003 Exactly one menubar item may hold focus at a time (roving tabindex, managed by the behavioral layer); CSS styles `[aria-expanded]` and `:focus-visible` states.
- MBR-004 The chevron glyph on `[aria-haspopup]` items is decorative (`aria-hidden` by default via `content: ""` pseudo-element) and uses physical border strokes intentionally (rotated glyph), mirrored under `[dir="rtl"]`.
- MBR-005 Reduced motion (MOB-001) collapses all menubar transitions in both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas/layer/layer-hover/border/text-primary/text-secondary/focus`,
`space.fib-1/2/5/8`, `line.hair`, `line.thin` (chevron stroke), `radius.fib-5`,
`focus.ring.width/offset/color/offset-color/glow`, `type.size.sm`,
`type.leading.tight`, `motion.89`, `easing.out`, `math.inv-phi-sq` (disabled opacity).
Dropdown tokens are consumed by the hosted `.vd-menu` per menu/spec.md.

## Deviations & references
Conforms to the APG Menubar Pattern; no keyboard deviations. Consulted: Carbon
UI Shell Header + OverflowMenu (`conventions/mappings.md`) — adopts the
persistent horizontal command bar and trigger-with-dropdown anatomy; deviates
on surface (vd3 `layer` strip with hairline block-end border instead of a
separate shell background) and on spacing (Fibonacci scale instead of Carbon's
2x grid).
