---
slug: alert
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
---

## Summary
An inline status banner that communicates the outcome or state of a page region
or a just-performed action. Use for persistent, contextual messages. NOT for:
transient confirmations (use toast), blocking interruptions (use dialog), or
navigation (use breadcrumb).

## Anatomy
`.vd-alert` (the banner, carries the live-region role) containing optional
`.vd-alert-icon`, `.vd-alert-content` (`.vd-alert-title` + `.vd-alert-body`),
and optional dismiss `.vd-alert-close`. Accent bar on `border-inline-start`
(RTL-safe). Variants: `info` / `success` / `warning` / `critical`.

## States
Rest / hover on close / `:focus-visible` dual ring on the dismiss action /
variants swap only the `--_vd-alert-accent` custom property.

## Props / API
Contract-level: `role="alert"` for warning/critical (assertive), `role="status"`
for info/success (polite, `aria-live="polite"` implied). Dismissible via
`.vd-alert-close` button with an action `aria-label` per `conventions/content.md`.

## Keyboard — NORMATIVE: APG Alert Pattern (`patterns/alert/`)
Conforms to the W3C ARIA APG Alert Pattern (alerts are dynamically announced via
live-region roles without stealing keyboard focus):

| Key | Effect |
|---|---|
| Tab | Focus the dismiss button when present (only tab stop inside the alert) |
| Enter / Space | Activate dismiss |

## Focus
The alert itself is not focusable; the dismiss button is the single tab stop and
uses the dual ring (FOC-001/002).

## Accessibility requirements
- ALR-001 `role="alert"` is reserved for warning/critical; info/success use `role="status"`.
- ALR-002 Title + body follow the three-part content anatomy where applicable (`conventions/content.md`).
- ALR-003 Dismiss button has an action-based `aria-label` ("Dismiss notification"), never an appearance-based one.
- ALR-004 Accent bar is decorative structure: meaning is carried by text, not color alone (WCAG 1.4.1).

## Tokens consumed
`space.fib-1/2/13/21`, `border-width hair/regular`, `radius.fib-3/fib-8/full`,
`color.role.layer/border/text-primary/text-secondary`,
`color.primitive.golden-1` (info), `golden-6` (success), `color.role.focus`
(warning), `color.role.critical` (critical), `font-size xs/sm/base`,
`line-height tight/normal`, `focus.ring.*`, `duration 55`, `ease-out`.

## Deviations & references
Conforms to the W3C ARIA APG Alert Pattern (`https://www.w3.org/WAI/ARIA/apg/patterns/alert/`)
with `role="alert"` for warning/critical and `role="status"` (`aria-live="polite"`)
for info/success, consuming semantic status tokens (`color.role.info|success|warning|critical`).
Consulted: Carbon ActionableNotification / InlineNotification — adopts role
split (toast vs inline); deviates on accent placement (inline-start bar instead
of icon-only) for RTL robustness.
