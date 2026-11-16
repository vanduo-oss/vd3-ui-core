---
slug: menu
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
---

## Summary
A dropdown menu: a floating list of actions or options revealed from a trigger
button. Use for a compact set of commands attached to a button, toolbar action,
or menubar item. NOT for: primary navigation (use navbar/menubar), selecting one
option from a small visible set (use radio group or select), or content that
must stay visible (use popover/tooltip).

## Anatomy
`.vd-menu` (`role="menu"`, `aria-labelledby` → trigger id) containing
`.vd-menu-item` entries (`role="menuitem"`, or `menuitemcheckbox` /
`menuitemradio` with `aria-checked`), optional `.vd-menu-label` group headings,
and `.vd-menu-divider` separators (`role="separator"`). The trigger carries
`aria-haspopup="menu"` and `aria-expanded`. The menu anchors beneath a
relatively positioned parent (`.vd-menu` is `position: absolute`).

## States
Rest (layer surface, hairline border, `shadow.4`) / item hover (`layer-hover`
fill) / item `:focus-visible` (dual ring per FOC-001…004 plus `layer-hover`
fill) / `[aria-current]` (focus-colored text, 600 weight) / `--danger` (critical
text; hover swaps to a critical tint via `color-mix` with `glass.tint-md`) /
disabled (`:disabled`, `[aria-disabled="true"]`, `math.inv-phi-sq` opacity) /
dark theme (deeper `shadow.5` elevation). Each state swaps only tokens.

## Props / API
Contract-level: `role="menu"` container; each item `role="menuitem"` +
optional `aria-checked` (checkbox/radio variants) or `aria-current`; trigger
`aria-haspopup="menu"` + `aria-expanded="true|false"`. Visibility is toggled
by the behavioral layer via the `hidden` attribute (`.vd-menu[hidden]` is
`display: none`). No size modifiers in v1.

## Keyboard — NORMATIVE: APG Menu Button Pattern

| Key | Effect |
|---|---|
| Enter / Space / Down Arrow (on trigger) | Open the menu; focus the first item (Down) — Up Arrow focuses the last |
| Down / Up Arrow (in menu) | Move focus to next / previous item, wrapping at the ends |
| Home / End | Focus first / last item |
| Enter / Space (on item) | Activate the item and close the menu |
| Escape | Close the menu; focus returns to the trigger |
| Tab | Close the menu and move focus out (default tab order resumes) |
| Printable characters | Optional type-ahead: focus the next item whose label starts with the character |

## Focus
The menu itself is not a tab stop; items are reached by arrow keys (roving
focus managed by the behavioral layer, `tabindex="-1"` on items). On open,
focus moves to the first item (or the selected item). On close, focus MUST
return to the trigger. `:focus-visible` dual ring on every item.

## Accessibility requirements
- MNU-001 The container has `role="menu"` and is labelled by its trigger (`aria-labelledby`); items use `role="menuitem"` (or `menuitemcheckbox`/`menuitemradio` with `aria-checked`).
- MNU-002 The trigger exposes `aria-haspopup="menu"` and `aria-expanded` reflecting open state.
- MNU-003 Arrow/Home/End navigation wraps; Escape closes and restores focus to the trigger (APG Menu Button Pattern, no deviation).
- MNU-004 Every item has a `:focus-visible` dual ring (FOC-001…004) and a disabled state (`:disabled` / `[aria-disabled="true"]`) that is skipped by navigation and announced as unavailable.
- MNU-005 Reduced motion (MOB-001) collapses all menu transitions in both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`z.dropdown`, `color.role.canvas/layer/layer-hover/border/text-primary/text-secondary/focus/critical`,
`shadow.4`, `shadow.5` (dark elevation), `radius.fib-8`,
`space.fib-2/5/8/13/34/144`, `line.hair`, `focus.ring.width/offset/color/offset-color/glow`,
`type.size.xs/sm`, `type.leading.tight`, `type.tracking.wider`,
`motion.89`, `easing.out`, `math.phi` (min-width F_13 = F_12 × φ), `math.inv-phi-sq` (disabled opacity),
`glass.tint-md` (danger hover tint).

## Deviations & references
Conforms to the APG Menu Button Pattern; no keyboard deviations. Consulted:
Carbon Dropdown / OverflowMenu (`conventions/mappings.md`) — adopts the
trigger + floating list anatomy and `aria-haspopup`/`aria-expanded` contract;
deviates on surface treatment (vd3 identity keeps the fib `shadow.4` elevation
instead of Carbon's flat `layer` + border) and on min-width (F_13 = 233px golden
derivation instead of a fixed rem literal).
