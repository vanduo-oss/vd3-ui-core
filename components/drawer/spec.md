---
slug: drawer
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Summary
A drawer (off-canvas panel) is a surface that slides in from a viewport edge to
hold contextual flows, filters, or secondary navigation. Supports a **Dual-Mode
Contract**:
- **Modal default (`.vd-drawer` + `.vd-drawer-backdrop`)**: blocks background
  interaction (`role="dialog"`, `aria-modal="true"`, focus trap per `FOC-004`,
  `inert` background, `Escape` + backdrop dismissal).
- **Non-modal variant (`.vd-drawer--non-modal` / `aria-modal="false"` /
  `popover="manual"`)**: parallel task rail at `z.fixed` (`1020`) with **no**
  blocking backdrop so background content stays interactive and focus is not
  trapped.
NOT for: blocking confirmations (use `dialog`), short contextual hints (use
`tooltip`), or small rich content anchored to a trigger (use `popover`).

## Anatomy
Modal default: `.vd-drawer-backdrop` (`pointer-events: auto`, `z.modal-backdrop`
`1040`) + `.vd-drawer` (the panel, `z.modal` `1050`, `role="dialog"`,
`aria-modal="true"`) containing `.vd-drawer-header` (`.vd-drawer-title` +
`.vd-drawer-close`), `.vd-drawer-body`, and optional `.vd-drawer-footer`.
Non-modal variant: `.vd-drawer.vd-drawer--non-modal` (with `aria-modal="false"`,
`z.fixed` `1020`, no blocking backdrop; sibling `.vd-drawer-backdrop` or
`.vd-drawer-backdrop--non-modal` is hidden with `pointer-events: none`).
Placement modifiers `--start` (default) / `--end` / `--top` / `--bottom`
(single-dash aliases `-start` / `-end` / `-top` / `-bottom`) select the viewport
edge using logical `inset-inline-start/end`, so RTL layouts mirror
automatically. Open state hook: `data-open="true"` on panel (and backdrop in modal
mode).

## States
Rest (closed: translated off its logical edge, `visibility: hidden`) / open
(`[data-open="true"]`, `transform: none`, slide via `transform` over
`motion.slow` = 377ms, `overscroll-behavior: contain`) / modal backdrop open
(opacity 1, `color-mix` dimmer over `color.primitive.gray-1000`) / non-modal
(`.vd-drawer--non-modal`, `z.fixed`, backdrop disabled) / close-button &
drawer-surface `:focus-visible` dual ring (`focus.ring.*`) / close-button hover
(`color.role.layer-hover` + `color.role.text-primary`) / disabled (`:disabled`,
`[aria-disabled="true"]`, opacity `math.inv-phi-sq`). Each state swaps only
tokens.

## Props / API
Contract-level: a container element with `role="dialog"`, `aria-modal="true"`
(modal default) or `aria-modal="false"` (with `.vd-drawer--non-modal`),
`aria-labelledby` → `.vd-drawer-title` id, toggled via `data-open="true|false"`.
Placement via modifier class. In modal mode, `.vd-drawer-backdrop` is a sibling
with `data-open`. No size props in v1 — panel inline size is the
`--_vd-drawer-inline-size` private hook (default `container.sm`); top/bottom
panels cap at `100vh − 2 × space.fib-34`. Behavioral layer (open/close, focus
trap + background `inert` in modal mode, `Escape` handling, focus return) is
the implementing library's job; CSS renders state.

## Keyboard — NORMATIVE: APG Dialog (Modal) Pattern & Non-Modal Variant

| Key | Effect |
|---|---|
| Escape | Close the drawer and restore focus to the invoking element |
| Tab / Shift+Tab | Modal default: trap focus cycling inside the open drawer while background is `inert`. Non-modal (`.vd-drawer--non-modal`): move through drawer controls and return to the document (`F6` recommended to jump between regions) |

## Focus
On open, focus moves to the first focusable element in the drawer (or the
drawer surface/close button); on close, focus MUST return to the invoking
element. Modal drawers trap focus per `FOC-004`; non-modal drawers
(`.vd-drawer--non-modal`) do not trap focus. Both `.vd-drawer` and
`.vd-drawer-close` implement `:focus-visible` dual-ring focus indicators. Closed
drawer is `visibility: hidden`, removing it from the tab order.

## Accessibility requirements
- DRW-001 Default modal drawers use `role="dialog"`, `aria-modal="true"`, focus trapping, and background `inert`; non-modal drawers use `.vd-drawer--non-modal` with `aria-modal="false"`, no focus trap, and no blocking backdrop. `aria-labelledby` points to the drawer title in both modes.
- DRW-002 Open/closed state is exposed via `data-open="true|false"`; a closed drawer is not focusable (`visibility: hidden`).
- DRW-003 The close button has an action-based `aria-label` ("Close drawer") per `conventions/content.md`.
- DRW-004 Placement uses logical `inset-inline-start/end` so RTL layouts mirror; the slide transform sign is flipped per `:dir(rtl)` because transform axes have no logical variant (intentional physical axis).
- DRW-005 Reduced motion (MOB-001) collapses the 377ms slide to none via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas/text-primary/text-secondary/border/layer-hover`,
`color.primitive.gray-1000` (backdrop dimmer ink), `z.modal`, `z.modal-backdrop`,
`z.fixed` (non-modal rail), `shadow.4`, `line.hair`, `radius.fib-3`,
`space.fib-5/8/13/21/34`, `container.sm`, `type.size.base/lg/xl`,
`type.leading.tight/relaxed`, `motion.slow` (377ms), `motion.89`, `easing.out`,
`easing.in-out`, `focus.ring.width/offset/color/offset-color/glow`,
`math.inv-phi-sq` (disabled opacity).

## Deviations & references
Default modal mode conforms to the APG Dialog (Modal) Pattern (`aria-modal="true"`,
focus trap per `foundations/focus.md` `FOC-004`, `inert` background); `.vd-drawer--non-modal`
implements the non-modal rail pattern referenced in `patterns/app-shell.md` (`APP-004`).
Consulted: Carbon Side Panel (UI Shell) / Tearsheet — adopts the edge-docked
sliding panel and header/body/footer anatomy; deviates on elevation (golden
`shadow.4` pair instead of Carbon's flat layer, per `conventions/mappings.md`
shadow note) and on width (`container.sm` instead of a fixed px rail).
