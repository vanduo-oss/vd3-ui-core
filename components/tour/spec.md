---
slug: tour
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A tour is a sequence of anchored step cards that walk a user through a feature.
Use for first-run feature discovery on an otherwise complete page. NOT for:
onboarding that must be completed before continuing (use a modal tearsheet),
a single hint (use tooltip/hover-card), or marketing content (use a page).

## Anatomy
`.vd-tour` (anchored floating card, `z.popover`, `shadow.5`, fib-8 radius,
max-width F14 = 377px) containing `.vd-tour-title`, `.vd-tour-body`,
`.vd-tour-progress` (thin fib-2 bar; fill width set behaviorally via
`--_vd-tour-progress`), and `.vd-tour-footer` with `.vd-tour-counter`
("Step X of Y") plus `.vd-tour-actions` holding `.vd-tour-btn` prev/next
buttons (`.vd-tour-btn--primary` / `.vd-tour-btn-primary` for Next).
Optional `.vd-tour-backdrop` scrim (`z.modal-backdrop`, `pointer-events:
none` — the tour is non-blocking, so the scrim is decorative and
`aria-hidden="true"`).

## States
Closed (opacity 0, visibility hidden) / open (`[data-open="true"]` /
`:popover-open`: 144ms fade via `motion.144`) / `[hidden]` (display none) /
button hover (layer-hover or `color.role.interactive` for primary) /
`:focus-visible` dual ring (`focus.ring.*`) / disabled prev on first step
(`:disabled`, `[aria-disabled="true"]`, opacity `math.inv-phi-sq`). Reduced
motion (MOB-001) collapses the fade and the progress-fill transition. Each
state swaps only tokens.

## Props / API
Contract-level: a step card associated to its anchor target by the behavioral
layer; card named via `aria-labelledby` → `.vd-tour-title`, described via
`aria-describedby` → `.vd-tour-body`; counter text "Step X of Y"; prev/next
are `<button type="button">` elements. The backdrop is optional and purely
visual. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: no APG tour pattern; behavioral contract (non-modal dialog)

No APG pattern exists for tours. The contract is non-modal dialog behavior per
the APG Dialog pattern's non-modal guidance
(https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):

| Key | Effect |
|---|---|
| Escape | Dismiss the tour at any step; focus returns to the invoking element |
| Tab / Shift+Tab | Move through the card's actions and any focusable card content, then continue into the page (no focus trap — non-modal) |
| Enter / Space | Activate the focused prev/next button |
| Left / Right arrow (optional) | Previous / next step (behavioral layer) |

## Focus
On open, focus moves to the step card's primary action (or the card surface
if no action exists); the page is NOT made inert. On dismiss, focus MUST return
to the invoking element. `:focus-visible` dual ring on `.vd-tour-btn`.

## Accessibility requirements
- TUR-001 No APG tour pattern exists; the step card follows non-modal dialog behavior (no focus trap, page stays interactive) per APG Dialog non-modal guidance.
- TUR-002 Escape dismisses the tour at any step and focus MUST return to the invoking element (focus restoration).
- TUR-003 Each step is anchored to its target; the card is named by `.vd-tour-title` (`aria-labelledby`) and described by `.vd-tour-body` (`aria-describedby`); the step counter is real text ("Step X of Y"), never color/position alone.
- TUR-004 When a backdrop is present it is `pointer-events: none` and `aria-hidden="true"` — the tour is non-blocking by design.
- TUR-005 Reduced motion (MOB-001) collapses the 144ms fade and the progress-fill transition; prev/next buttons expose `:focus-visible` dual ring and `:disabled`/`[aria-disabled="true"]` states.

## Tokens consumed
`z.popover`, `z.modal-backdrop`, `space.fib-2/3/5/8/13/21/89/144` (fib-144 +
fib-89 derive the F14 = 377px max-width), `line.hair`,
`radius.fib-5/fib-8/full`, `shadow.5`,
`color.role.layer/layer-hover/text-primary/text-secondary/border/focus/interactive`,
`color.primitive.gray-1000` (backdrop ink), `glass.tint-lg/tint-xl` (backdrop
opacity, dark uses tint-xl), `focus.ring.width/offset/color/offset-color/glow`,
`type.size.xs/sm/lg`, `type.leading.tight/snug/normal`, `motion.89/144/233`,
`easing.out`, `math.inv-phi-sq` (disabled opacity).

## Deviations & references
No APG pattern exists for tours; contract is APG Dialog (non-modal) +
step-progress semantics. Consulted: Carbon Coachmark / ProductTour — adopts
anchored step cards with prev/next and a step counter; deviates on modality
(vd3 tour is non-modal with a `pointer-events: none` scrim instead of a
blocking backdrop), on elevation (`shadow.5` instead of flat layer), and on
width (F14 = 377px token-derived cap instead of a fixed rem value).
