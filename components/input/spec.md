---
slug: input
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
Free-form text entry: a single-line `.vd-input` on `<input>` (text-like types:
text, email, search, tel, url, password, number) or a multi-line `.vd-textarea`
on `<textarea>`, always inside a `.vd-form-group` with a persistent `.vd-label`.
NOT for: choosing from a fixed list (use select), a binary choice (use
checkbox/switch), one-of-few choices (use radio), or commands (use button).

## Anatomy
`.vd-form-group` (flex column, `gap: space.fib-3`, `margin-block-end: space.fib-13`)
→ `.vd-label` (`<label for="…">`, `type.size.sm`, weight 600,
`color.role.text-primary`) → control `.vd-input` / `.vd-textarea` → optional
`.vd-help-text` and/or `.vd-error-text`, wired to the control via
`aria-describedby`.

## States
- Rest: background `color.role.canvas`, border `line.thin` ×
  `color.role.border`, radius `radius.fib-5`, color `color.role.text-primary`,
  padding `space.fib-5` × `space.fib-8`, font `type.size.base`, line-height
  `type.leading.tight`. `.vd-textarea` adds `min-height: 80px`,
  `resize: vertical`, line-height `type.leading.normal`.
- Hover: no dedicated hover style in v1 (native cursor only).
- Focus-visible: border-color → `color.role.focus` plus the dual-ring box-shadow
  from `focus.ring.*` (offset ring in `color.role.canvas`).
- Invalid (`:user-invalid` or `[aria-invalid="true"]`): border →
  `color.role.critical`; on `:focus-visible` the whole ring swaps to
  `color.role.critical` with a critical glow. `.vd-error-text` uses
  `color.role.critical` (dark theme: `theme.dark.color.role.critical`).
- Disabled (`:disabled`, `[aria-disabled="true"]`): background
  `color.role.layer`, border `color.primitive.gray.2` (border-subtle), color
  `color.role.text-secondary`, `cursor: not-allowed`, `opacity: 0.618` (1/φ).
- Read-only: native `readonly` has no dedicated visual state in v1 (see
  Deviations).
- Motion: border-color / box-shadow transitions over `motion.89` / `easing.out`;
  the MOB-001 collapse applies (INP-005).

## Props / API
Native markup only: `<input class="vd-input" id="…" type="text">`,
`<textarea class="vd-textarea" id="…">`. Label association via `for`/`id` is
mandatory; help/error text via `aria-describedby`; invalid via
`aria-invalid="true"` (or native `:user-invalid`); disabled via `disabled` /
`aria-disabled="true"`. Core ships no script API — the contract is the native
element plus classes.

## Keyboard — NORMATIVE: no APG pattern exists for native text fields; behavioral contract

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to / from the field |
| Enter | Submits the surrounding `<form>` (single-line input, native); inserts a newline in `<textarea>` |
| Printable keys, arrows, Home/End, selection chords | Native text editing behavior |

No custom key handling; the contract is the native element with correct labeling
and `aria-describedby` wiring.

## Focus
Each field is a single tab stop in DOM order; `:focus-visible` dual ring per
FOC-001…004 (`focus.ring.*`). Disabled fields leave the tab order.

## Accessibility requirements
- INP-001 Every field MUST have a persistent, visible `<label class="vd-label">`
  associated via `for`/`id`; a placeholder MUST NOT substitute for a label
  (`conventions/content.md`).
- INP-002 `:focus-visible` MUST render the dual ring (outline none + box-shadow
  from `focus.ring.*`) plus the `color.role.focus` border.
- INP-003 The invalid state MUST be exposed via `:user-invalid` or
  `aria-invalid="true"`, swap border and ring to `color.role.critical`, and pair
  with `.vd-error-text` following the three-part message anatomy
  (`conventions/content.md`), wired via `aria-describedby`. `.vd-help-text`
  carries non-error guidance the same way.
- INP-004 The disabled state (`:disabled` / `[aria-disabled="true"]`) MUST
  remove the field from interaction, apply the layer background and 0.618
  opacity, and show `cursor: not-allowed`.
- INP-005 Reduced motion (MOB-001): `@media (prefers-reduced-motion: reduce)` AND
  `[data-motion="reduce"]` MUST collapse the `motion.89` transitions.

## Tokens consumed
`color.role.canvas`, `color.role.border`, `color.role.text-primary`,
`color.role.text-secondary`, `color.role.layer`, `color.role.focus`,
`color.role.critical`, `color.primitive.gray.2`, `theme.dark.color.role.critical`,
`line.thin`, `radius.fib-5`, `space.fib-3`, `space.fib-5`, `space.fib-8`,
`space.fib-13`, `type.size.xs`, `type.size.sm`, `type.size.base`,
`type.leading.tight`, `type.leading.normal`, `motion.89`, `easing.out`,
`focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
No APG pattern exists for native text inputs — the contract is the WAI-ARIA
textbox role (native) plus WCAG labeling rules. Consulted: Carbon TextInput /
TextArea (role mapping per `conventions/mappings.md`) — adopts the
label-above-field anatomy, invalid border + message pairing, and helper text
below the field. Gaps flagged for the 1.0.3 CSS pass: (1) `form.css` v1 ships
the `motion.89` transitions but not yet the two MOB-001 reduce blocks — INP-005
is normative and the CSS gap is flagged; (2) `readonly` has no dedicated visual
state in v1; (3) the textarea `min-height: 80px` is a fixed literal, not a token.
