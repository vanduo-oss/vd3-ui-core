---
slug: radio
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
---

## Summary
A radio button: exactly one choice inside a mutually exclusive group. Native
`<input type="radio" class="vd-radio" name="…">` styled with
`appearance: none` and `radius.full`, grouped by a shared `name` (native) or by
`role="radiogroup"`. NOT for: independent binary toggles (use checkbox/switch),
multiple selections (use checkboxes), or free text (use input).

## Anatomy
Group: `<fieldset>` + `<legend>` (or `role="radiogroup"` +
`aria-labelledby`) containing one row per option: `<label>` wrapping or
`for`-bound to a `.vd-radio`. The control is a 20×20 circle with border
`line.thin` and radius `radius.full` (C-04); the checked indicator is an 8px
`::before` dot in `color.role.focus`.

## States
- Rest: background `color.role.canvas`, border `line.thin` ×
  `color.role.border`, `cursor: pointer`.
- Checked (`:checked`, or `aria-checked="true"`): border → `color.role.focus`,
  `::before` dot background `color.role.focus`.
- Focus-visible: dual ring `focus.ring.*` (outline none + box-shadow).
- Disabled (`:disabled`, `[aria-disabled="true"]`): background
  `color.role.layer`, border `color.primitive.gray.2`, color
  `color.role.text-secondary`, 0.618 opacity, `cursor: not-allowed`.
- Motion: transitions over `motion.89` / `easing.out`; the MOB-001 collapse
  applies (RAD-005).

## Props / API
Native: `<input type="radio" class="vd-radio" name="group" id="…">` plus one
`<label for="…">` per option; the group is named by `<fieldset>`/`<legend>` and
scoped by the shared `name` attribute. Custom build: `role="radiogroup"` +
`aria-labelledby`, options `role="radio"` + `aria-checked`. Disabled per control
via `disabled` / `aria-disabled="true"`. Core ships no script API.

## Keyboard — NORMATIVE: APG Radio Group Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Enter / leave the group; the checked radio (or the first, if none is checked) is the single tab stop |
| Down / Right arrow | Check the next radio in the group, wrapping at the end |
| Up / Left arrow | Check the previous radio in the group, wrapping at the start |
| Space | Check the focused radio |

Native radio groups implement this natively; custom `role="radiogroup"` builds
MUST replicate it with a roving tabindex.

## Focus
Roving tabindex inside the group: only the checked (or first) radio is in the
tab order; `:focus-visible` dual ring on the focused radio (FOC-001…004).

## Accessibility requirements
- RAD-001 The group MUST be named (`<legend>` or `aria-labelledby`) and every
  radio MUST have an associated label; state is native `checked` or
  `aria-checked="true"`.
- RAD-002 `:focus-visible` MUST render the dual ring (`focus.ring.*`).
- RAD-003 The checked visual MUST be the `color.role.focus` border plus the
  `color.role.focus` dot inside a `radius.full` circle.
- RAD-004 Disabled radios (`:disabled` / `[aria-disabled="true"]`) MUST be
  skipped by arrow keys and MUST NOT be checkable.
- RAD-005 Reduced motion (MOB-001): `@media (prefers-reduced-motion: reduce)` AND
  `[data-motion="reduce"]` MUST collapse the `motion.89` transitions.

## Tokens consumed
`color.role.canvas`, `color.role.border`, `color.role.focus`, `color.role.layer`,
`color.role.text-secondary`, `color.primitive.gray.2`, `line.thin`,
`radius.full`, `motion.89`, `easing.out`, `focus.ring.width`,
`focus.ring.offset`, `focus.ring.color`, `focus.ring.offset-color`,
`focus.ring.glow`.

## Deviations & references
Conforms to the APG Radio Group Pattern. Consulted: Carbon RadioButton /
RadioButtonGroup (role mapping per `conventions/mappings.md`) — same group
naming and roving-tabindex contract. Deviations flagged for the 1.0.3 CSS pass:
(1) the 20×20 control size is a fixed literal, not a token; (2) the two MOB-001
reduce blocks are absent from `form.css` v1 — RAD-005 is normative and the CSS
gap is flagged.
