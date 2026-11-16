# Pattern — Onboarding (tour / spotlight)

Status: stable · Spec: 1.1.0-draft · APG: none

## When to use / when NOT

Use a guided tour (spotlight + step card) to introduce 3–7 new features of an
already-working product to a returning user. Do NOT use for first-run
mandatory education that blocks the app (that is a blocking `.vd-dialog`
sequence), for contextual help on a single control (tooltip, phase 1.2), or
for sequential task completion (stepper, phase 1.2).

## Anatomy

Built from the **tour component (Feature #60)** plus a progress indicator:

1. **Spotlight** — a highlight ring around the target element, rendered by
   the tour component's spotlight layer (library composable `useSpotlight`,
   `.vd-spotlight*`); the ring uses `focus.ring.*` geometry so it reads as a
   focus indicator, `z.popover` stacking.
2. **Step card** — a non-modal popover anchored to the target, composed from
   `.vd-card` anatomy: `.vd-card-header` (`.vd-card-title` = step title),
   `.vd-card-body` (explanation, sentence case, one idea per step),
   `.vd-card-footer` with `.vd-btn--ghost` (Back), `.vd-btn--primary` (Next /
   Done), and a text Skip link.
3. **Progress indicator** — a thin progress bar (library-level `VdProgress`,
   `.vd-progress*`) plus text `Step k of n` in `.vd-card-subtitle`; bar fill
   uses `color.role.focus`, track uses `color.role.layer-hover`.

## Keyboard & focus — behavioral contract (no APG pattern exists)

| Key | Effect |
|---|---|
| Escape | End the tour immediately; focus returns to the invoking element |
| Right / Down arrow (in card) | Next step |
| Left / Up arrow (in card) | Previous step |
| Tab | Cycles only within the step card (non-modal: page stays reachable) |

- ONB-001 On each step change, focus moves into the step card (title or
  primary action); on tour end/cancel, focus returns to the element that
  launched the tour (same restoration rule as DLG-002).
- ONB-002 The step card is a non-modal dialog: `role="dialog"`,
  `aria-modal="false"`, `aria-labelledby` → step title, `aria-describedby` →
  step body. Page content is NOT inert.
- ONB-003 Step changes are announced via `aria-live="polite"` on the `Step k
  of n` text (concise, verb-driven per `conventions/content.md`).
- ONB-004 The spotlight ring is decorative (`aria-hidden="true"`); all meaning
  lives in the card text; targets are not focus-locked.
- ONB-005 Motion (spotlight movement, card transitions) uses `motion.233` /
  `easing.out` and MUST collapse under MOB-001 (both
  `prefers-reduced-motion: reduce` and `[data-motion="reduce"]`).
- ONB-006 Every step has a visible Skip; the tour is never the only way to
  reach the featured functionality.

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

`z.popover` · `focus.ring.width/offset/color/glow` (spotlight ring) ·
`color.role.layer/layer-hover/text-primary/text-secondary/border/focus` ·
`radius.fib-8` · `shadow.4` (step card) · `space.fib-8/13/21` ·
`type.size.sm/base/xl` · `type.leading.snug/normal` · `line.hair` ·
`motion.233`, `easing.out` · `duration` collapses per `motion.0` under MOB-001.

## Deviations & references

- No APG pattern exists for tours/onboarding (`apg: none`); the table above is
  the normative behavioral contract. Consulted: Carbon onboarding experience
  guidance and Ant Tour — adopts non-modal spotlight + card composition;
  deviates by requiring `aria-live` step announcements and golden easing,
  and by fixing progress to a Fibonacci-height bar rather than dots.
- Tour component is Feature #60 (new); progress/stepper primitives are
  library-level until core phase 1.2 (`components/SPEC.md`).
