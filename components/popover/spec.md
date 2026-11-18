---
slug: popover
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A popover is a floating surface anchored to a trigger that shows rich,
non-modal content (menus, forms, detail cards). Use when the content needs more
room or interactivity than a tooltip but must stay contextually attached to its
trigger. NOT for: blocking tasks (use dialog), secondary page-level navigation
(use drawer), or transient confirmations (use toast).

## Anatomy
`.vd-popover` (the panel, `role="dialog"`, `aria-modal="false"`, closed with the
`hidden` attribute) optionally containing `.vd-popover-arrow` (positioned via
`[data-placement="top|bottom|start|end"]` on the panel), `.vd-popover-header`,
and `.vd-popover-body`. The trigger carries `aria-expanded="true|false"` and
`aria-controls="<popover-id>"` / `aria-haspopup="dialog"`. Surface layer:
`color.role.canvas` fill, `shadow.4`, `radius.fib-8`, stacked at `z.popover`.

## States
Rest (closed: `hidden` or non-`:popover-open`, `display: none`) / open
(`:not([hidden]):not([popover])` or native `:popover-open`: opacity 1,
`transform: none`, entrance via `@starting-style` + `overlay` + `display` with
standalone `transition-behavior: allow-discrete;` over `motion.233` = 233ms) /
`:focus-visible` dual ring on the panel when it receives programmatic focus
(`focus.ring.*` + retained `shadow.4`). Under `@supports (position-area: block-end)`,
`[popover]` panels promote to the browser top layer and position via CSS Anchor
Positioning (`position-anchor: var(--_vd-anchor)`, `position-area`,
`position-try-fallbacks: flip-block, flip-inline`), gracefully falling back to
container-relative `position: absolute` in browsers without Anchor Positioning.
Each state swaps only tokens.

## Props / API
Contract-level: trigger button with `aria-haspopup="dialog"`,
`aria-expanded="true|false"`, `aria-controls` → popover id (or native HTML Popover
API `popovertarget="<popover-id>"` with `popover="auto"`/`"manual"`); popover
element `role="dialog"`, `aria-modal="false"`, `aria-labelledby` → header id,
toggled via `:popover-open` or removing/adding `hidden`. Placement via
`data-placement`. Progressive CSS Anchor Positioning pairs with `--_vd-anchor` /
`anchor-name` while preserving container-relative fallback positioning.

## Keyboard — NORMATIVE: no APG pattern exists
There is no APG popover pattern; the behavioral contract is the non-modal dialog
semantics (`role="dialog"` + `aria-expanded` on the trigger):

| Key | Effect |
|---|---|
| Escape | Close the popover and return focus to the trigger |
| Tab / Shift+Tab | In the non-modal variant focus is NOT trapped; Tab from the last popover element moves to the next page element |
| Enter / Space (on trigger) | Toggle `aria-expanded` and show/hide the popover |

## Focus
On open, focus MAY move into the popover (first focusable element) or stay on
the trigger per content type; on close, focus MUST return to the trigger. The
panel is removed from the tab order when `hidden`. `:focus-visible` dual ring
applies to the panel and to every focusable element inside it.

## Accessibility requirements
- POP-001 The trigger exposes `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls` → popover id.
- POP-002 The panel has `role="dialog"`, `aria-modal="false"`, and `aria-labelledby` → header (or `aria-label`).
- POP-003 Closed state uses the `hidden` attribute (`display: none`), so a closed popover is not focusable or announced.
- POP-004 Escape closes the popover and focus returns to the trigger; outside pointer interaction dismissal is behavioral.
- POP-005 Reduced motion (MOB-001) collapses the 233ms scale/fade via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas/text-primary/border`, `z.popover`, `shadow.4`, `line.hair`,
`radius.fib-8`, `space.fib-3/8/13/144`, `container.sm`, `type.size.sm`,
`type.leading.tight/normal`, `motion.233`, `easing.out`,
`focus.ring.width/offset/color/offset-color/glow`.

## Deviations & references
No APG pattern exists for popover; the contract is WAI-ARIA non-modal dialog
semantics plus `aria-expanded` on the trigger. Consulted: Carbon Popover /
Toggletip — adopts the trigger (`aria-expanded`/`aria-controls`) and anchored
floating panel anatomy; deviates on elevation (golden `shadow.4` pair instead
of Carbon's flat layer, per `conventions/mappings.md` shadow note) and on the
arrow being a real `.vd-popover-arrow` element colored in `color.role.border`
instead of a pseudo-element.
