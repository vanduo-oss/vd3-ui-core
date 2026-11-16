---
slug: select
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
---

## Summary
A select-only listbox: choose exactly one option from a fixed list. Native
`<select class="vd-select">` (styled with `appearance: none` plus a chevron
glyph) or a custom `role="listbox"` build. NOT for: free-text entry (use input),
multiple selection (use a checkbox group or multi-select listbox), or commands
(use button).

## Anatomy
`.vd-form-group` → `.vd-label` → the control: native
`<select class="vd-select">` with `<option>` children, or a custom element with
`role="listbox"` (`aria-labelledby` → label id) containing `role="option"`
children (`aria-selected`). The chevron is a decorative CSS background SVG
(inherently aria-hidden); inline-end padding `space.fib-34` reserves its space.

## States
- Rest: the same field chrome as `.vd-input` (background `color.role.canvas`,
  border `line.thin` × `color.role.border`, radius `radius.fib-5`, color
  `color.role.text-primary`, font `type.size.base` / `type.leading.tight`),
  plus `appearance: none` and the chevron background image (light theme fill
  `color.primitive.gray.7`; dark theme stroke `color.primitive.gray.3`).
- Focus-visible: border → `color.role.focus` plus the dual ring `focus.ring.*`.
- Invalid: `:user-invalid` / `[aria-invalid="true"]` → border and focus ring →
  `color.role.critical`.
- Disabled (`:disabled`, `[aria-disabled="true"]`): as `.vd-input` — layer
  background, `color.primitive.gray.2` border, 0.618 opacity, not-allowed.
- Motion: `motion.89` / `easing.out` transitions on border-color / box-shadow;
  the MOB-001 collapse applies (SEL-005).

## Props / API
Native: `<select class="vd-select" id="…"><option>…</option></select>` with a
`.vd-label` bound via `for`/`id`. Custom listbox: `role="listbox"` +
`aria-labelledby`, options with `role="option"` + `aria-selected`, and either
`aria-activedescendant` or focus-follows-option (one strategy per product).
Invalid/disabled wiring is identical to input (`aria-invalid`,
`disabled` / `aria-disabled`).

## Keyboard — NORMATIVE: APG Listbox Pattern (select-only variant)

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to / from the collapsed select (single tab stop) |
| Down / Right arrow | Open the popup and/or move to the next option |
| Up / Left arrow | Open the popup and/or move to the previous option |
| Home / End | First / last option |
| Enter / Space | Select the focused option and close the popup |
| Escape | Close the popup without changing the selection |
| Printable character | Type-ahead: jump to the next matching option |

A native `<select>` implements this contract via platform behavior; a custom
listbox MUST replicate it exactly.

## Focus
Single tab stop on the collapsed control; `:focus-visible` dual ring per
FOC-001…004. With the popup open, focus either stays on the listbox with
`aria-activedescendant` or moves onto the options — both are APG-conformant.

## Accessibility requirements
- SEL-001 The select MUST have an accessible name via label association
  (`for`/`id` on the native select, `aria-labelledby` on a custom listbox).
- SEL-002 `:focus-visible` MUST render the dual ring (`focus.ring.*`) plus the
  `color.role.focus` border.
- SEL-003 The invalid state MUST use `:user-invalid` / `aria-invalid="true"`
  with the `color.role.critical` border/ring and `.vd-error-text` wired via
  `aria-describedby`.
- SEL-004 Disabled (`:disabled` / `[aria-disabled="true"]`) MUST remove the
  control from interaction (layer background, 0.618 opacity, not-allowed).
- SEL-005 Reduced motion (MOB-001): `@media (prefers-reduced-motion: reduce)` AND
  `[data-motion="reduce"]` MUST collapse the `motion.89` transitions.

## Tokens consumed
`color.role.canvas`, `color.role.border`, `color.role.text-primary`,
`color.role.text-secondary`, `color.role.layer`, `color.role.focus`,
`color.role.critical`, `color.primitive.gray.2`, `color.primitive.gray.3`,
`color.primitive.gray.7`, `line.thin`, `radius.fib-5`, `space.fib-5`,
`space.fib-8`, `space.fib-34`, `type.size.base`, `type.leading.tight`,
`motion.89`, `easing.out`, `focus.ring.width`, `focus.ring.offset`,
`focus.ring.color`, `focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
Conforms to the APG Listbox Pattern (select-only variant) for custom builds; the
native select satisfies it through platform behavior. Consulted: Carbon Select
/ Dropdown / ComboBox (role mapping per `conventions/mappings.md`) — adopts
single-select semantics and label association. Deviations flagged for the 1.0.3
CSS pass: (1) the chevron background is positioned with physical `right` in
`form.css` v1 — migration to logical `inset-inline-end` for RTL is flagged;
(2) the two MOB-001 reduce blocks are absent from `form.css` v1 — SEL-005 is
normative and the CSS gap is flagged.
