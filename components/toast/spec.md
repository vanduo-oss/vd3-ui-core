---
slug: toast
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
Transient, non-blocking notifications stacked in a fixed `.vd-toast-container`
on the topmost `z.toast` layer. Use for confirmations and background-task
results. NOT for: persistent contextual messages (use alert), blocking
interruptions (use dialog), or critical content the user must read (use alert
with `role="alert"`).

## Anatomy
`.vd-toast-container` (fixed placement; default `--bottom-end`; logical
modifiers `--bottom-start`, `--bottom-end`, `--top-start`, `--top-end`,
`--bottom-center`, `--top-center`) containing `.vd-toast` (Fibonacci inline bounds
`233px`–`377px`, $F_{13}$–$F_{14}$, variant accent on `border-inline-start`,
RTL-safe) with `.vd-toast-icon`, `.vd-toast-content` (`.vd-toast-title` +
`.vd-toast-message`), and optional dismiss `.vd-toast-close`. Variants:
`--info` / `--success` / `--warning` / `--danger` (alias `--critical`).
Enter/exit via `vd-toast-enter` / `vd-toast-exit` keyframes (`motion.233` = `motion.base`).

## States
Rest (layer fill, `shadow.4`, thick inline-start accent = `color.role.interactive`)
/ variant accent swap (`--info` → `color.role.info`; `--success` → `color.role.success`;
`--warning` → `color.role.warning`; `--danger` / `--critical` → `color.role.critical`) /
close hover (`color.role.text-secondary` → `color.role.text-primary`, 55ms) /
close `:focus-visible` (dual ring) / enter animation (opacity + translateY + scale,
233ms `easing.out`) / reduced motion (both `@media (prefers-reduced-motion: reduce)`
and `[data-motion="reduce"]` collapse the animation to ~0ms). Each visual state
swaps only tokens.

## Props / API
Contract-level: the container carries the live-region role — `role="status"` for
info/success (polite) and `role="alert"` for warning/danger (assertive). The
implementing layer appends toasts and controls timing; auto-dismiss MUST satisfy
WCAG 2.2 SC 2.2.1 (pausable on hover/focus, extendable) and MUST NOT apply to
`role="alert"` toasts.

## Keyboard — NORMATIVE: live-region semantics (no APG pattern)

| Key | Effect |
|---|---|
| (none) | Toasts never move focus on show; they are announced by the live region |
| Tab | Reach the dismiss button (`.vd-toast-close`) when present — the only tab stop |
| Enter / Space | Dismiss the focused toast |

## Focus
Focus is never trapped or moved into a toast on appearance (non-modal). The
dismiss button is the single tab stop with the dual ring (FOC-001…004). The
container has `pointer-events: none`; each toast has `pointer-events: auto`, so
the stack never blocks the page beneath it.

## Accessibility requirements
- TST-001 `role="status"` (implicit `aria-live="polite"`, `aria-atomic="true"`) for info/success; `role="alert"` for warning/danger/critical — announced without any focus change.
- TST-002 Toasts are non-modal: no `aria-modal`, no focus trap, no focus steal; container `pointer-events: none` with per-toast `pointer-events: auto`.
- TST-003 The dismiss button is a real `<button>` with an action-based `aria-label` ("Dismiss notification") and the dual-ring `:focus-visible` indicator.
- TST-004 Auto-dismiss (behavioral layer) must satisfy WCAG 2.2 SC 2.2.1: pausable on hover/focus and never applied to `role="alert"` toasts; the CSS provides only the enter/exit motion.
- TST-005 Reduced motion (MOB-001): enter/exit animations collapse under BOTH `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`; placements use logical properties (`inset-inline-*`) so RTL mirrors correctly.

## Tokens consumed
`z.toast`, `color.role.layer`, `color.role.canvas`, `color.role.text-primary`,
`color.role.text-secondary`, `color.role.border`, `color.role.interactive`,
`color.role.focus`, `color.role.info`, `color.role.success`, `color.role.warning`,
`color.role.critical`, `line.hair`, `line.thick`, `radius.fib-3`, `radius.fib-8`,
`shadow.4`, `space.fib-1`, `space.fib-2`, `space.fib-8`, `space.fib-13`,
`space.fib-21`, `space.fib-34`, `space.fib-89`, `space.fib-144`, `type.size.xs`,
`type.size.sm`, `type.size.base`, `type.size.lg-static`, `type.leading.snug`,
`type.leading.normal`, `motion.233` (alias `motion.base`), `motion.55`,
`easing.out`, `focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
No APG pattern exists for toasts; the contract is WAI-ARIA live-region roles
(`role="status"` / `role="alert"`). Consulted: Carbon ToastNotification — adopts
the role split (polite status vs assertive alert) and the dismiss button;
deviates on accent placement (thick `border-inline-start` bar instead of an
icon-only leading slot) and logical container modifiers (`--bottom-start/end`,
`--top-start/end`) for full RTL robustness. All status accents and Fibonacci
width bounds ($F_{13} = 233\text{px}$ – $F_{14} = 377\text{px}$) are token-driven.
