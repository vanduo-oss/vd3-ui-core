---
slug: checkbox
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
---

## Summary
A checkbox for one binary option, or a tri-state ("mixed") parent row. Native
`<input type="checkbox" class="vd-checkbox">` styled with `appearance: none`, or
a custom `role="checkbox"` build. NOT for: settings that apply immediately (use
switch), one-of-many choices (use a radio group), or multi-select lists (use
several checkboxes).

## Anatomy
A `<label>` wrapping the control or bound via `for`/`id`, containing
`.vd-checkbox` + label text. The control is a 21×21 (`space.fib-21` = $F_8$) box with border
`line.thin` and radius `radius.fib-3`; the checkmark is a `::before` glyph built
from `border-inline-start` + `border-bottom` rotated −45° — a logical border
(RTL-safe); only the glyph's rotation is a physical transform, which is
intentional.

## States
- Rest: background `color.role.canvas`, border `line.thin` ×
  `color.role.border`, `cursor: pointer`.
- Checked (`:checked`, or `aria-checked="true"`): background + border →
  `color.role.focus`; the `::before` check renders in `color.primitive.gray.1000`.
- Indeterminate (`:indeterminate`, paired with `aria-checked="mixed"` on custom
  builds): background + border → `color.role.focus`; `::before` renders a
  horizontal dash (`spacing.8` × `line.thin`) in `color.primitive.gray.1000`.
- Focus-visible: dual ring `focus.ring.*` (outline none + box-shadow).
- Disabled (`:disabled`, `[aria-disabled="true"]`): background
  `color.role.layer`, border `color.primitive.gray.2`, color
  `color.role.text-secondary`, 0.618 opacity, `cursor: not-allowed`.
- Motion: border-color / background-color / box-shadow transitions over
  `motion.89` / `easing.out`; the MOB-001 collapse applies (CHK-005).

## Props / API
Native `<input type="checkbox" class="vd-checkbox" id="…">` + `<label for="…">`.
Tri-state: custom build with `aria-checked="mixed"`, or the native
`indeterminate` IDL property (behavioral layer sets the property; CSS renders the
`:indeterminate` horizontal bar).
Disabled via `disabled` / `aria-disabled="true"`. Core ships no script API.

## Keyboard — NORMATIVE: APG Checkbox Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to / from the checkbox (one tab stop per checkbox) |
| Space | Toggle `checked` (native); in a tri-state custom build, Space cycles unchecked → checked → mixed per APG |

Native checkboxes implement this natively; custom `role="checkbox"` builds MUST
replicate it. Enter does NOT toggle a checkbox — it submits the surrounding form.

## Focus
One tab stop per checkbox; `:focus-visible` dual ring per FOC-001…004
(`focus.ring.*`). A `:disabled` checkbox leaves the tab order.

## Accessibility requirements
- CHK-001 The control MUST be a native checkbox or `role="checkbox"` with
  `aria-checked` (`"true" | "false" | "mixed"`) and an associated label.
- CHK-002 `:focus-visible` MUST render the dual ring (`focus.ring.*`).
- CHK-003 The checked visual MUST use the `color.role.focus` fill/border with
  the `color.primitive.gray.1000` check glyph on logical `border-inline-start`,
  so RTL layouts mirror correctly.
- CHK-004 Disabled (`:disabled` / `[aria-disabled="true"]`) MUST be unfocusable
  when `:disabled` and non-toggleable, with the reduced-opacity treatment.
- CHK-005 Reduced motion (MOB-001): `@media (prefers-reduced-motion: reduce)` AND
  `[data-motion="reduce"]` MUST collapse the `motion.89` transitions.

## Tokens consumed
`color.role.canvas`, `color.role.border`, `color.role.focus`, `color.role.layer`,
`color.role.text-secondary`, `color.primitive.gray.1000`, `color.primitive.gray.2`,
`line.thin`, `radius.fib-3`, `motion.89`, `easing.out`, `focus.ring.width`,
`focus.ring.offset`, `focus.ring.color`, `focus.ring.offset-color`,
`focus.ring.glow`.

## Deviations & references
Conforms to the APG Checkbox Pattern. Consulted: Carbon Checkbox — same native
input + label contract and Space-to-toggle. The `:indeterminate` dash glyph,
tokenized `space.fib-21` control size, `color.role.border-subtle` disabled
border, and both `MOB-001` reduced-motion blocks (`@media (prefers-reduced-motion: reduce)`
and `[data-motion="reduce"]`) are implemented in `components/form.css`.
