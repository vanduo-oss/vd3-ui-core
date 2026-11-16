---
slug: avatar
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A compact visual representation of a user or entity: a photo when available,
initials as fallback. Use in profiles, comments, lists, and stacked groups.
NOT for: primary navigation identity (use navbar brand), status-critical
information alone (the status dot is decorative — pair it with text when the
status matters), or large hero imagery (use a media component).

## Anatomy
`.vd-avatar` — the shape, either an `<img>` filling it (`.vd-avatar img` /
`.vd-avatar-img`) or initials text (`.vd-avatar-initials`). Optional
`.vd-avatar-status` dot (decorative, `aria-hidden="true"`) anchored at the
inline-end/block-end corner. `.vd-avatar-group` stacks avatars with a negative
`margin-inline-start` overlap (logical property, RTL-safe).

## States
Rest (layer fill, secondary-text initials) / interactive hover on `a.vd-avatar`
/ `button.vd-avatar` (scale 1.05) / `:focus-visible` (dual ring via
`focus.ring.*`) / `:disabled`, `[aria-disabled="true"]` (opacity
`math.inv-phi-sq`, no transform). Status modifiers swap only the dot's
background token: online (`color.primitive.golden-angle.6`), away
(`color.role.focus`), busy (`color.role.critical`), info
(`color.primitive.golden-angle.1`), offline (`color.primitive.gray.5`, dark
`gray.6`).

## Props / API
Contract-level: `<span class="vd-avatar"><img src="…" alt="…"></span>` or
`<span class="vd-avatar"><span class="vd-avatar-initials">AB</span></span>`;
status adds `<span class="vd-avatar-status vd-avatar-status--online" aria-hidden="true"></span>`.
Modifiers: sizes `--sm | --md | --lg` (single-dash aliases `-sm/-md/-lg`) =
golden 21/34/55px (`space.fib-21/34/55`); shapes `--round | --square` (aliases
`-round/-square`) = `radius.full` / `radius.fib-5`; group wrapper
`.vd-avatar-group`. Interactive use is `a.vd-avatar` / `button.vd-avatar`.

## Keyboard — NORMATIVE: no APG pattern exists
No APG avatar pattern exists; an avatar is static content unless it is a link or
button, in which case the native model applies:

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to/from an interactive avatar (single tab stop) |
| Enter / Space | Activate the avatar link / button (native behavior) |
| — | A static avatar is not focusable and has no key handling |

## Focus
Static avatars are not focusable. Interactive avatars are single tab stops with
the `:focus-visible` dual ring per FOC-001…004.

## Accessibility requirements
- AVT-001 The img variant MUST have a meaningful `alt` (the person's name), or `alt=""` when the name is already adjacent visible text; the initials fallback is real text and is announced as-is.
- AVT-002 The status dot is decorative (`aria-hidden="true"`); when presence status is meaningful, it MUST be conveyed in text (e.g. visually hidden "online") — never by the dot color alone (WCAG 1.4.1).
- AVT-003 Group overlap uses logical `margin-inline-start` so right-to-left layouts mirror the stacking direction.
- AVT-004 Reduced motion (MOB-001) collapses the interactive hover scale and transitions via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.text-secondary`,
`color.role.canvas`, `color.role.focus`, `color.role.focus-glow`,
`color.role.critical`, `color.primitive.golden-angle.1`,
`color.primitive.golden-angle.6`, `color.primitive.gray.5`,
`color.primitive.gray.6`, `line.thin`, `radius.full`, `radius.fib-5`,
`space.fib-8`, `space.fib-21`, `space.fib-34`, `space.fib-55`,
`focus.ring.*`, `motion.144`, `easing.out`, `math.inv-phi-sq`.

## Deviations & references
No APG pattern exists for avatars; the contract is native img alt semantics plus
a decorative `aria-hidden` status dot. Consulted: Carbon UserAvatar — adopts
the img-with-initials-fallback anatomy and the status dot; deviates on sizes
(golden Fibonacci 21/34/55px instead of fixed 32/40/48px) and on group overlap
(logical `margin-inline-start` instead of physical `margin-left`, for RTL
correctness) per `conventions/mappings.md`.
