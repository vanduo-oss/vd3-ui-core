---
slug: toolbar
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
---

## Summary
A toolbar is a compact strip of grouped action buttons attached to a content
region (e.g. a formatting bar above an editor). Use when several related
commands should stay one glance away from the region they act on. NOT for:
primary or page-level navigation (use navbar), single isolated actions (use a
plain button), or view switching (use tabs).

## Anatomy
`.vd-toolbar` (`role="toolbar"` + accessible name via `aria-label` /
`aria-labelledby`) containing one or more `.vd-toolbar-group`
(`role="group"` + `aria-label`) of `.vd-toolbar-button` elements, with
`.vd-toolbar-separator` (`role="separator"`, `aria-orientation="vertical"`)
between groups.

## States
Rest (layer surface, hair border, fib-8 radius) / button hover
(`color.role.layer-hover` fill) / toggle `[aria-pressed="true"]` (layer-hover
fill, 600 weight) / `:focus-visible` dual ring (`focus.ring.*`) / disabled
(`:disabled`, `[aria-disabled="true"]`, opacity `math.inv-phi-sq`, skipped by
the roving tabindex). Each state swaps only tokens.

## Props / API
Contract-level: `role="toolbar"` with an accessible name; groups
`role="group"` + `aria-label`; buttons are `<button type="button">` and may
carry `aria-pressed="true|false"` when they toggle; separators
`role="separator"`. No size/variant modifiers in v1. Button styling is a local
ghost restyle — the toolbar does not depend on `button.css`.

## Keyboard — NORMATIVE: APG Toolbar Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Enter / leave the toolbar; a single control is the tab stop (roving tabindex) |
| Right / Down arrow | Move focus to the next control, wrapping at the end |
| Left / Up arrow | Move focus to the previous control, wrapping at the start |
| Home / End | Move focus to the first / last control |
| Enter / Space | Activate the focused button (native button behavior) |

## Focus
Roving tabindex managed by the behavioral layer: exactly one control
(`tabindex="0"`) is in the tab order, the rest `tabindex="-1"`. If the toolbar
contains no focusable controls, the toolbar itself takes `tabindex="0"`. CSS
renders the `:focus-visible` dual ring on `.vd-toolbar-button`; the toolbar
container is not focus-styled otherwise.

## Accessibility requirements
- TLB-001 `role="toolbar"` with an accessible name (`aria-label` or `aria-labelledby`) is mandatory.
- TLB-002 Groups use `role="group"` + `aria-label`; separators use `role="separator"` with `aria-orientation="vertical"`.
- TLB-003 Roving tabindex per APG: one tab stop; arrow keys/Home/End move focus (behavioral layer); CSS renders `[aria-pressed]` toggle state and the dual ring.
- TLB-004 Disabled buttons use `:disabled` or `aria-disabled="true"`, are removed from the roving order, and render at `math.inv-phi-sq` opacity.

## Tokens consumed
`space.fib-2/5/8/13`, `line.hair` (border widths), `radius.fib-5/fib-8`,
`color.role.layer/layer-hover/text-primary/border`, `color.role.canvas` +
`color.role.focus` + `color.role.focus-glow` (via `focus.ring.*`),
`focus.ring.width/offset/color/offset-color/glow`, `type.size.sm`,
`type.leading.tight`, `motion.55`, `motion.89`, `easing.out`,
`math.inv-phi-sq` (disabled opacity).

## Deviations & references
None — conforms to the APG Toolbar Pattern. Consulted: Carbon Toolbar —
adopts grouped actions and separators; deviates on the surface treatment
(vd3 layer fill + hair border + fib-8 radius instead of Carbon's flat
transparent strip) per `conventions/mappings.md` (shadow/layer identity
deviation).
