---
slug: context-menu
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ (menu semantics for the menu role tree)
---

## Summary
A context menu: a menu of actions for the object under the pointer, revealed by
a secondary click (right-click / long-press) or an explicit "more actions"
trigger. Use for object-scoped commands that would clutter the visible UI.
NOT for: primary commands (use menu button / menubar), navigation (use navbar),
or transient confirmations (use toast).

## Anatomy
`.vd-context-menu` (`role="menu"`, `position: fixed` at the pointer coordinates
set by the behavioral layer) containing `.vd-context-menu-item` entries
(`role="menuitem"`, or `menuitemcheckbox`/`menuitemradio`), optional
`.vd-context-menu-label` headings, and `.vd-context-menu-divider`
(`role="separator"`). Same visual language as `.vd-menu` (menu.css).

## States
Rest (layer surface, hairline border, `shadow.4`, `radius.fib-8`) / item hover
(`layer-hover` fill) / item `:focus-visible` (dual ring FOC-001…004 plus
`layer-hover` fill) / `--danger` (critical text; hover critical tint via
`color-mix` with `glass.tint-md`) / disabled (`:disabled`,
`[aria-disabled="true"]`, `math.inv-phi-sq` opacity) / dark theme (deeper
`shadow.5`). Visibility toggled via the `hidden` attribute. Each state swaps
only tokens.

## Props / API
Contract-level: `role="menu"` container opened at pointer coordinates (the
behavioral layer sets `top` / `inset-inline-start` inline); items
`role="menuitem"` with optional `aria-checked`; the invoking element keeps
`aria-haspopup="menu"` and `aria-expanded`. No size modifiers in v1.

## Keyboard — NORMATIVE: APG menu semantics (Menubar pattern menu sections)

| Key | Effect |
|---|---|
| Down / Up Arrow (on open) | Focus first / last item |
| Down / Up Arrow (in menu) | Move focus to next / previous item, wrapping at the ends |
| Home / End | Focus first / last item |
| Enter / Space (on item) | Activate the item and close the menu |
| Escape | Close the menu; focus returns to the invoking element |
| Tab | Close the menu and move focus out |
| Printable characters | Optional type-ahead within the menu |

## Focus
The menu is not a tab stop. On open, focus moves to the first item (or the
item relevant to the invoked object). On close (Escape, outside click, or
activation), focus MUST return to the invoking element. `:focus-visible` dual
ring on every item.

## Accessibility requirements
- CMX-001 The container has `role="menu"`; items use `role="menuitem"` (or `menuitemcheckbox`/`menuitemradio` with `aria-checked`); dividers use `role="separator"`.
- CMX-002 The invoking element exposes `aria-haspopup="menu"` and `aria-expanded` while the menu is open.
- CMX-003 Arrow/Home/End navigation wraps; Escape closes and restores focus to the invoking element; the menu never traps focus.
- CMX-004 Every item has a `:focus-visible` dual ring (FOC-001…004) and a disabled state (`:disabled` / `[aria-disabled="true"]`) skipped by navigation; reduced motion (MOB-001) collapses all transitions in both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`z.popover`, `color.role.canvas/layer/layer-hover/border/text-primary/text-secondary/focus/critical`,
`shadow.4`, `shadow.5` (dark elevation), `radius.fib-8`,
`space.fib-5/8/13/34/144`, `line.hair`, `focus.ring.width/offset/color/offset-color/glow`,
`type.size.xs/sm`, `type.leading.tight`, `type.tracking.wider`,
`motion.89`, `easing.out`, `math.phi` (min-width F_13 = F_12 × φ), `math.inv-phi-sq` (disabled opacity),
`glass.tint-md` (danger hover tint).

## Deviations & references
No dedicated APG context-menu pattern exists; the menu role tree and keyboard
contract follow the APG Menubar Pattern's menu sections (cited in frontmatter).
Consulted: Carbon ContextMenu-adjacent OverflowMenu (`conventions/mappings.md`)
— adopts the pointer-anchored floating list and item anatomy; deviates on
z-layer (vd3 `z.popover` 1060 above `z.dropdown` 1000, since a context menu is
invoked over arbitrary content) and on golden min-width (F_13 = 233px).
