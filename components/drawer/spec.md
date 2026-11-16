---
slug: drawer
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Summary
A drawer (off-canvas panel) is a surface that slides in from a viewport edge to
hold secondary content or a task parallel to the main flow. Use for navigation
menus, filters, or detail panes that should not block the page. NOT for:
blocking confirmations (use dialog — the modal variant of the same APG pattern),
short contextual hints (use tooltip), or small rich content anchored to a
trigger (use popover). This component is the NON-MODAL variant of the APG
Dialog (Modal) pattern: background stays interactive, focus is not trapped.

## Anatomy
`.vd-drawer-backdrop` (dimmer, `z.modal-backdrop`) + `.vd-drawer` (the panel,
`z.modal`, `role="dialog"`, `aria-modal="false"`) containing `.vd-drawer-header`
(`.vd-drawer-title` + `.vd-drawer-close`), `.vd-drawer-body`, and optional
`.vd-drawer-footer`. Placement modifiers `--start` (default) / `--end` / `--top` /
`--bottom` (single-dash aliases `-start` / `-end` / `-top` / `-bottom`) select the
viewport edge; edges are set with logical `inset-inline-start/end`, so RTL
layouts mirror automatically. Open state hook: `data-open="true"` on both panel
and backdrop.

## States
Rest (closed: translated off its logical edge, `visibility: hidden`) / open
(`[data-open="true"]`, `transform: none`, slide via `transform` over
`motion.slow` = 377ms) / backdrop open (opacity 1, `color-mix` dimmer over
`color.primitive.gray-1000`) / close-button hover (swaps
`color.role.layer-hover` + `color.role.text-primary`) / `:focus-visible` dual
ring (`focus.ring.*`) / disabled (`:disabled`, `[aria-disabled="true"]`,
opacity `math.inv-phi-sq`). Each state swaps only tokens.

## Props / API
Contract-level: a container element with `role="dialog"`, `aria-modal="false"`,
`aria-labelledby` → `.vd-drawer-title` id, toggled via `data-open="true|false"`.
Placement via modifier class. Backdrop is a sibling with `data-open`. No size
props in v1 — panel inline size is the `--_vd-drawer-inline-size` private hook
(default `container.sm`); top/bottom panels cap at `100vh − 2 × space.fib-34`.
Behavioral layer (open/close, Escape handling, focus return) is the implementing
library's job; CSS only renders state.

## Keyboard — NORMATIVE: APG Dialog (Modal) Pattern, non-modal variant

| Key | Effect |
|---|---|
| Escape | Close the drawer (non-modal: page behind stays interactive) |
| Tab / Shift+Tab | Cycle through the drawer's focusable elements; in the non-modal variant focus is NOT trapped and may leave the drawer |

## Focus
On open, focus moves to the first focusable element in the drawer (or the close
button); on close, focus MUST return to the invoking element. The close button
is the only element in the drawer that requires the `:focus-visible` dual ring
in CSS; the panel itself may receive programmatic focus. Closed drawer is
`visibility: hidden`, so it is removed from the tab order.

## Accessibility requirements
- DRW-001 The panel has `role="dialog"` with `aria-modal="false"` (non-modal variant of the APG dialog pattern) and `aria-labelledby` pointing at the title.
- DRW-002 Open/closed state is exposed via `data-open="true|false"` on panel and backdrop; a closed drawer is not focusable (`visibility: hidden`).
- DRW-003 The close button has an action-based `aria-label` ("Close drawer") per `conventions/content.md`.
- DRW-004 Placement uses logical `inset-inline-start/end` so RTL layouts mirror; the slide transform sign is flipped per `:dir(rtl)` because transform axes have no logical variant (intentional physical axis).
- DRW-005 Reduced motion (MOB-001) collapses the 377ms slide to none via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas/text-primary/text-secondary/border/layer-hover`,
`color.primitive.gray-1000` (backdrop dimmer ink), `z.modal`, `z.modal-backdrop`,
`shadow.4`, `line.hair`, `radius.fib-3`, `space.fib-5/8/13/21/34`,
`container.sm`, `type.size.base/lg/xl`, `type.leading.tight/relaxed`,
`motion.slow` (377ms), `motion.89`, `easing.out`, `easing.in-out`,
`focus.ring.width/offset/color/offset-color/glow`, `math.inv-phi-sq` (disabled opacity).

## Deviations & references
Conforms to the non-modal variant of the APG Dialog (Modal) Pattern
(`aria-modal="false"`, no focus trap, background not inert). Consulted: Carbon
Side Panel (UI Shell) / Tearsheet — adopts the edge-docked sliding panel and
header/body/footer anatomy; deviates on elevation (golden `shadow.4` pair
instead of Carbon's flat layer, per `conventions/mappings.md` shadow note) and
on width (container token `container.sm` instead of a fixed px rail).
