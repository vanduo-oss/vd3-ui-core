---
slug: dialog
status: stable
spec: vd3-ui-core@2.0.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Summary
A modal dialog: content that interrupts the task below it. Use for focused,
blocking tasks (confirmations, short forms). NOT for: navigation, non-blocking
information (use popover/toast), long forms (use a page or drawer).

## Anatomy
Surface (`--vd-shadow-4`, `--vd-radius-fib-8`, stacked at `z.modal`) · Header (title + optional dismiss) · Body ·
Footer (actions).

## States
Rest / focus-visible (`--vd-focus` ring on the first focusable or the surface
itself) / reduced-motion (no scale-in; opacity only).

## Keyboard — NORMATIVE: APG Dialog (Modal) Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Cycle within dialog (focus is trapped) |
| Escape | Close, same as cancel; announcement as dismissal |

## Focus

- DLG-001 On open, focus moves to the first focusable element, or the dialog
  surface if none.
- DLG-002 On close, focus MUST return to the invoking element.
- DLG-003 The dialog MUST be modal: background is inert (aria-inert treatment of
  siblings; scrolling locked).
- DLG-004 The dialog surface has `role="dialog"`, `aria-modal="true"`, and
  `aria-labelledby`/`aria-describedby` referencing title/description.

## Tokens consumed
`--vd-layer` (surface), `--vd-shadow-4`, `--vd-radius-fib-8`, `--vd-z-modal`,
`--vd-text-primary`, `--vd-text-secondary`, `--vd-border`, `--vd-focus`,
`--vd-line-regular`, `--vd-space-fib-13`, `--vd-space-fib-21` (padding),
`--vd-motion-normal` (open transition; suppressed on reduced motion per MOB-001).

## Deviations & references
None — conforms to APG Dialog (Modal) Pattern. Consulted: Carbon Dialog —
adopts footer-aligned actions, deviates on elevation (golden shadow-4 instead of
flat layer+border) per `foundations/elevation.md`.
