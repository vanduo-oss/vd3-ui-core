# Pattern — Disabled vs. Read-Only States

Status: stable · Spec: 1.1.0-draft · APG: none

## When to use / when NOT

Use **disabled** when the control is unusable in the current context and the
user cannot change that (permission, dependency on another field, in-flight
submission). Use **read-only** when the value is visible and selectable but
not editable (pre-filled form data, computed values). Do NOT use disabled to
mean "not applicable right now" if read-only communicates it better, and never
use opacity alone to convey state (WCAG 1.4.1).

## The three states — normative contract

| State | Markup | Focusable | Cursor | Opacity | Announced as |
|---|---|---|---|---|---|
| Disabled (native) | `:disabled` | No | `not-allowed` | `1/φ²` | natively by role |
| Disabled (ARIA) | `[aria-disabled="true"]` | Yes | `not-allowed` | `1/φ²` | `aria-disabled` |
| Read-only | `readonly` / `[aria-readonly="true"]` | Yes | `default` (text fields: text caret allowed) | **1 (unchanged)** | `aria-readonly` or native |

- **Opacity rule**: disabled states apply `opacity: var(--vd3-inv-phi-sq)` =
  1/φ² ≈ 0.382 (`math.inv-phi-sq`, Class A). Read-only MUST NOT dim — the
  content is still valid information, so it keeps full opacity and uses
  `color.role.text-secondary` + `color.role.layer` fill instead.
- **Cursor rules**: disabled → `cursor: not-allowed` (both `:disabled` and
  `[aria-disabled="true"]`); read-only → `cursor: default` on controls, text
  caret in fields so users can still select and copy the value.
- **`aria-disabled` vs `:disabled`**: prefer native `:disabled` on native
  controls (leaves the tab order, announces state for free). Use
  `aria-disabled="true"` on composite widgets (`.vd-switch`, tabs, chips,
  custom buttons) that must stay focusable; they must still ignore activation.

## Core implementation (already shipped)

Every interactive core class implements both disabled selectors —
`.vd-btn:disabled, .vd-btn[aria-disabled="true"]` (button.css),
`.vd-input/.vd-select/.vd-checkbox/.vd-radio` (form.css),
`.vd-switch[aria-disabled="true"]` (switch.css, SWT-003), `.vd-tab`
(tabs.css, TAB-004 area), `.vd-chip[aria-disabled="true"]` (badge.css) — all
with `opacity: math.inv-phi-sq`, `cursor: not-allowed`, no shadow/transform.
Form fields additionally swap fill to `color.role.layer` and border to a
subtler tone. Read-only styling for `.vd-input[readonly]` is the behavioral
companion: keep `color.role.text-primary`, no opacity change.

## Accessibility notes

- DIS-001 `:disabled` elements are not focusable and not announced as
  interactive; do not attach click handlers to them.
- DIS-002 `[aria-disabled="true"]` elements remain in the tab order, show the
  dual ring on `:focus-visible` (FOC-001…004), and MUST NOT activate on
  Enter/Space; the state change is announced by the role.
- DIS-003 Read-only fields remain focusable and selectable; pair native
  `readonly` with `aria-readonly="true"` on composites, and explain WHY a
  field is read-only in adjacent `.vd-help-text` when it is not obvious.
- DIS-004 State is never conveyed by opacity/color alone: disabled also loses
  shadow/transform and changes cursor; read-only is stated in text or
  `aria-readonly` (WCAG 1.4.1).

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

`math.inv-phi-sq` (disabled opacity 1/φ²) · `color.role.layer/layer-hover/text-primary/text-secondary/border` ·
`line.hair/thin` · `focus.ring.*` (aria-disabled focusable states) ·
`motion.0` under MOB-001 (no transitions on disabled state changes).

## Deviations & references

- Consulted: Carbon "disabled state" guidance and APG guidance on
  `aria-disabled` — adopts the focusable-ARIA vs native-disabled split;
  deviates by fixing the disabled opacity to exactly 1/φ² (Class A) instead
  of a conventional 0.5, keeping the mathematical spine (PRN-001).
- No APG pattern covers global disabled/read-only semantics (`apg: none`);
  per-component ARIA contracts live in each `components/<slug>/spec.md`.
