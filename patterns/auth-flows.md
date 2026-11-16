# Pattern — Auth Flows (login / signup / forgot-password)

Status: stable · Spec: 1.1.0-draft · APG: none

## When to use / when NOT

Use for the three credential flows — login, signup, forgot-password — as
centered single-column pages. Do NOT use for in-place session expiry (use
`.vd-dialog` + `.vd-alert`), for OTP entry (library-level `VdOtpInput`), or
for multi-step wizard onboarding (see `onboarding.md`).

**No core auth component by design.** Carbon treats login as a pattern, not a
component (`docs/gap-analysis.md`: "Carbon pattern-only — nobody ships it as
a component"); vd3-ui-core follows. The `@vanduo-oss/vd3` library ships the
library-level implementations `VdAuthCard`, `VdLogin`, `VdSignUp`,
`VdForgotPassword` (classes `.vd-auth*`, `.vd-auth-form`, `.vd-auth-alert`,
`.vd-auth-links`); this pattern is the normative contract they compose.

## Anatomy

A centered `.vd-container-sm` (521px, `container.sm` — the designated width
for "centered authentication dialogs" per `foundations/layout.md`) containing
one `.vd-card`:

1. `.vd-card-header` — product/brand mark + `.vd-card-title` (flow name,
   e.g. `Sign in to Vanduo`) + `.vd-card-subtitle` (one-line context).
2. `.vd-card-body` — optional `.vd-alert--critical` (`role="alert"`) error
   summary at top, then `.vd-form-group` blocks: `.vd-label` + `.vd-input`
   (email, password) + `.vd-help-text` where needed. Every error uses the
   three-part anatomy (what happened / why / how to fix) in `.vd-error-text`
   wired via `aria-describedby` + `aria-invalid="true"`.
3. `.vd-card-footer` — primary `.vd-btn--primary` full-width (`Sign in`),
   secondary `.vd-btn--ghost`/`.vd-btn--outline` link to the sibling flow
   (`Create an account`, `Forgot password?`).

## Content rules (normative, from `conventions/content.md`)

- Sentence case everywhere; primary action is Verb + Noun (`Sign in`,
  `Create account`, `Send reset link`); `Submit`/`Go`/`Click here` prohibited.
- Persistent visible `.vd-label` per field; placeholders only as concrete
  examples, never as label substitutes.
- Errors follow the three-part anatomy; icon-only buttons get action-based
  `aria-label`s (`Show password`, never `Eye icon`).

## Accessibility notes

- AUT-001 Every input has a programmatic `.vd-label` (`for`/`id`) and the
  correct `autocomplete` token (`email`, `current-password`,
  `new-password`) so password managers and assistive tech work.
- AUT-002 On failed submit, focus moves to the `.vd-alert--critical` error
  summary (`role="alert"`, assertive) or the first invalid field; per-field
  errors are referenced with `aria-describedby` + `aria-invalid="true"`.
- AUT-003 Password fields MUST offer a show/hide toggle (icon button with
  action `aria-label`, `aria-pressed`), keeping the dual-ring focus.
- AUT-004 All interactive elements keep the `:focus-visible` dual ring
  (`focus.ring.*`, FOC-001…004); no keyboard traps in the flow.

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

`container.sm` · `color.role.canvas/layer/text-primary/text-secondary/border/focus/critical` ·
`space.fib-3/5/8/13/21/34` · `radius.fib-5/fib-8` · `shadow.2` ·
`type.size.sm/base/lg/xl` · `type.leading.tight/normal` ·
`line.hair/thin` · `focus.ring.*` · `motion.89`, `easing.out`.

## Deviations & references

- Consulted: Carbon login pattern (guidance-only) — adopts pattern-not-
  component placement; deviates by tokenizing the card width to
  `container.sm` (521px, Lucas L₁₃) instead of Carbon's fixed 400px.
- No APG pattern exists for auth flows; the contract above is behavioral.
