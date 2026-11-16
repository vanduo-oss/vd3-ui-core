---
slug: hover-card
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A hover card shows a rich preview (title + body, optionally actions) when the
pointer rests on — or keyboard focus lands on — a trigger. Use for supplementary
previews of a target (user card, link preview, entity summary). NOT for:
information that must be read to complete the task (put it inline or in a
tooltip), content needed on touch devices (no hover — use a popover/disclosure),
or blocking interruptions (use dialog).

## Anatomy
`.vd-hover-card` (floating surface, `z.popover`, `shadow.4`, fib-8 radius)
containing `.vd-hover-card-title` and `.vd-hover-card-body`. The card is
anchored to its trigger by the behavioral layer (positioning, open delay,
hover grace). Open state is rendered via `[data-open="true"]` or
`:popover-open`.

## States
Closed (opacity 0, visibility hidden) / open (`[data-open="true"]` /
`:popover-open`: opacity 1, visible, 144ms fade via `motion.144`) / `[hidden]`
(display none). Reduced motion (MOB-001) collapses the fade. The card itself
is not focusable; any focusable content inside it is styled by its own
component.

## Props / API
Contract-level: trigger element (usually a link or button) with
`aria-expanded="true|false"` wired by the behavioral layer; the card is
associated to the trigger and, when it has a name, carries `aria-labelledby`
pointing at `.vd-hover-card-title`. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: no APG hover-card pattern; behavioral contract per APG Tooltip

No APG pattern exists for hover cards; the behavioral contract follows the APG
Tooltip pattern (https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/) extended
with hoverable content:

| Key / pointer | Effect |
|---|---|
| Pointer rest on trigger | Open after the behavioral open delay |
| Focus trigger | Open after the behavioral open delay |
| Pointer leaves trigger and card | Close after the behavioral grace period (card is hoverable) |
| Escape | Close immediately, focus stays on trigger |
| Tab | If the card contains focusable elements, Tab moves into the card; Escape or blur closes it |

## Focus
The trigger keeps focus while the card is open; the card is non-modal and does
not trap focus. If the card contains focusable content, it must be reachable by
Tab and dismissible with Escape (behavioral layer).

## Accessibility requirements
- HVC-001 No APG hover-card pattern exists; open/close behavior follows the APG Tooltip pattern (delayed open on hover/focus, Escape dismiss, hover grace) implemented by the behavioral layer. CSS only renders the surface and the 144ms fade.
- HVC-002 The trigger carries `aria-expanded="true|false"` and the card is referenced from it; the card title names the card via `aria-labelledby`.
- HVC-003 The card must stay open while the pointer travels from trigger to card (hoverable grace period) — behavioral contract, not CSS.
- HVC-004 Reduced motion (MOB-001) collapses the 144ms fade (`motion.144`); content must not be conveyed by motion alone.

## Tokens consumed
`z.popover`, `container.sm` (max-width 521px), `space.fib-5/13`, `line.hair`,
`radius.fib-8`, `shadow.4`, `color.role.layer/text-primary/text-secondary/border`,
`type.size.base/sm`, `type.leading.snug/normal`, `motion.144`, `easing.out`.

## Deviations & references
No APG pattern exists for hover cards; the contract is the APG Tooltip pattern
applied to hoverable rich content. Consulted: Carbon Toggletip / Popover —
adopts the floating-surface model (layer + `shadow.4` + fib-8 radius, z
popover); deviates on max width (`container.sm` = 521px Lucas L13 instead of a
fixed rem cap) per `conventions/mappings.md`.
