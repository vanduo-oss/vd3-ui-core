---
slug: tooltip
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
---

## Summary
A tooltip is a small dark bubble of contextual text that appears on hover or
keyboard focus of a trigger and disappears on pointer leave / blur / Escape.
Use for short, non-essential hints (icon labels, truncated-text ellipsis).
NOT for: essential information (put it in visible text), interactive content
(use popover), or blocking messages (use dialog/alert).

## Anatomy
`.vd-tooltip` (the bubble, `role="tooltip"`, referenced from the trigger via
`aria-describedby`) optionally placed with `--top` / `--bottom` / `--start` /
`--end` modifiers (single-dash aliases and `[data-placement]` equivalents) which
also render the optional arrow (`::before`) and offset the bubble one
arrow-length from the trigger. Open state hook: `data-open="true"`. Positioning
against the trigger rect is the behavioral layer's job; CSS only renders the
bubble, arrow, and fade.

## States
Rest (hidden: `opacity: 0`, `visibility: hidden`, `pointer-events: none`) /
open (`[data-open="true"]`, fade-in `motion.89` = 89ms `easing.out`) / arrow
placement variants (swap only the arrow edge + margin side). The bubble is dark
ink (`color.primitive.gray-1000`) with light text (`color.primitive.gray-0`) in
both themes — an intentional inverted bubble, so no `[data-theme="dark"]` swap.

## Props / API
Contract-level: trigger element carries `aria-describedby="<tooltip-id>"`; the
tooltip element has `role="tooltip"` and `data-open="true|false"` toggled by the
behavioral layer on hover/focus/blur/Escape. Placement via modifier class or
`data-placement`. No size variants in v1.

## Keyboard — NORMATIVE: APG Tooltip Pattern

| Key | Effect |
|---|---|
| Escape | Dismiss the tooltip (focus stays on the trigger) |
| Tab / Shift+Tab | Moving focus away from the trigger dismisses the tooltip |

(Hover/focus show and blur/leave hide are behavioral-layer concerns; the APG
pattern additionally expects the tooltip to appear on mouse hover and keyboard
focus of the trigger.)

## Focus
The tooltip itself is never focusable and never in the tab order
(`pointer-events: none`, no tab stop); focus remains on the trigger. The APG
pattern requires no focus ring on the tooltip because it is not interactive.

## Accessibility requirements
- TIP-001 The tooltip element has `role="tooltip"` and is referenced by the trigger's `aria-describedby`.
- TIP-002 The tooltip is non-interactive: `pointer-events: none` and no tab stop; it must not contain focusable content.
- TIP-003 Escape dismisses the tooltip without moving focus off the trigger.
- TIP-004 Reduced motion (MOB-001) collapses the 89ms fade via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.primitive.gray-1000` (bubble ink), `color.primitive.gray-0` (bubble text),
`z.tooltip`, `shadow.2`, `radius.fib-3`, `space.fib-3/5/8`, `container.sm`
(max inline size), `type.size.xs`, `type.leading.normal`, `motion.89`,
`easing.out`.

## Deviations & references
Conforms to the APG Tooltip Pattern (described-by association, Escape dismiss,
non-interactive bubble). Consulted: Carbon Tooltip — adopts the same
`aria-describedby` + `role="tooltip"` contract and hover/focus triggers; deviates
on styling (permanent dark ink bubble in both themes instead of Carbon's
theme-following gray, matching the vd3 reference tooltip's dark variant).
