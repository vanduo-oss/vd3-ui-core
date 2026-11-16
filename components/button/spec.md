---
slug: button
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A push button that triggers an action. Use for commands (save, delete, open a
dialog). NOT for: on/off toggles (use switch, or a button with
`aria-pressed="true"`), choosing one option from a list (use radio / checkbox /
select), or navigation chrome (use `.vd-nav-link` inside the navbar).

## Anatomy
`.vd-btn` on a `<button type="button">` (or on an `<a href>` when the action
navigates). Optional leading/trailing icon; the icon–label gap is a size token
(`space.fib-3` / `space.fib-5` / `space.fib-8` for sm / md / lg). Variant
modifiers `.vd-btn--primary|secondary|ghost|outline|danger` with single-dash
aliases `.vd-btn-primary` etc.; size modifiers `.vd-btn--sm|md|lg` with aliases
`.vd-btn-sm` etc.; icon-only `.vd-btn--icon` (alias `.vd-btn-icon`,
`aspect-ratio: 1 / 1`).

## States
- Rest: background `color.role.layer`, border `line.thin` in
  `color.role.border`, radius `radius.fib-5`, color `color.role.text-primary`,
  padding `space.fib-5` × `space.fib-13`, font `type.size.base` with
  `type.leading.tight`.
- Hover (`:not(:disabled)` only): primary swaps bg + border to
  `color.primitive.gold.7` plus a `brightness(0.96)` filter; secondary swaps bg
  to `color.role.layer-hover` and border to `color.primitive.gray.5`;
  ghost/outline swap bg to `color.role.layer-hover` (outline also raises the
  border to border-strong, falling back to `color.role.border`).
- Active: `transform: scale(0.98)` over `motion.55` / `easing.out`.
- Focus-visible: `outline: none` plus the dual-ring `box-shadow` from
  `focus.ring.offset`, `focus.ring.offset-color` (= `color.role.canvas`),
  `focus.ring.width`, `focus.ring.color`, and the optional `focus.ring.glow`
  (FOC-001…004).
- Disabled (`:disabled`, `[aria-disabled="true"]`): `cursor: not-allowed`,
  `opacity: math.inv-phi-sq`, no box-shadow, no transform.
- Dark theme (`[data-theme="dark"]`): primary swaps to
  `theme.dark.color.role.focus` / `theme.dark.color.role.interactive`
  (`color.primitive.gold.4`) with `color.primitive.gray.1000` ink; danger swaps
  to `theme.dark.color.role.critical` (`color.primitive.red.4`).
- Reduced motion (MOB-001): both `@media (prefers-reduced-motion: reduce)` and
  `[data-motion="reduce"]` set `transition: none` and `transform: none`.

## Props / API
Contract-level, markup only — core ships no script API: element + classes.
`<button type="button" class="vd-btn vd-btn--primary">Save changes</button>`; an
`<a class="vd-btn" href="…">` is valid when the action navigates. Icon-only
buttons MUST carry an action-based `aria-label` (`conventions/content.md`).
Disable with the `disabled` attribute or `aria-disabled="true"`. Variants and
sizes are orthogonal classes; combining them is the supported composition model.
Label casing and verb+noun phrasing follow `conventions/content.md`.

## Keyboard — NORMATIVE: no APG pattern exists for buttons; the contract is native element semantics

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to / from the button |
| Space / Enter | Activate (native click) on `<button>`; on `<a>`, Enter follows the link, Space does not |

No custom key handling is permitted; authors MUST use the native element.
WCAG 2.2 SC 2.5.8 (Target Size Minimum, AA): every size exceeds the 24×24 CSS px
minimum (sm ≈ 30px tall, md ≈ 40px, lg ≈ 50px; icon-only ≈ 40×40).

## Focus
One tab stop per button; `:focus-visible` dual ring per FOC-001…004
(`focus.ring.*`). A `:disabled` button leaves the tab order;
`[aria-disabled="true"]` keeps focusability but MUST announce the disabled state.

## Accessibility requirements
- BTN-001 `:focus-visible` MUST render the dual ring (outline none + box-shadow
  from `focus.ring.*`); it MUST NOT be removed without an equivalent indicator.
- BTN-002 The disabled state MUST be exposed via `:disabled` or
  `aria-disabled="true"` and MUST NOT be activatable.
- BTN-003 Icon-only buttons MUST have an action-based `aria-label` ("Delete row"),
  never an appearance-based one (`conventions/content.md`).
- BTN-004 Target size: every variant/size MUST satisfy WCAG 2.2 SC 2.5.8
  (≥ 24×24 CSS px, AA) — met by the current size scale.
- BTN-005 Reduced motion (MOB-001): both `@media (prefers-reduced-motion: reduce)`
  and `[data-motion="reduce"]` MUST collapse the transitions and the active
  `scale(0.98)` transform.

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.text-primary`,
`color.role.border`, `color.role.interactive`, `color.role.critical`,
`color.role.focus`, `color.role.focus-glow`, `color.role.canvas`,
`color.primitive.gray.1000`, `color.primitive.gray.5`, `color.primitive.gold.4`,
`color.primitive.gold.7`, `theme.dark.color.role.focus`,
`theme.dark.color.role.interactive`, `theme.dark.color.role.critical`,
`line.thin`, `line.hair`, `radius.fib-5`, `radius.fib-8`, `space.fib-3`,
`space.fib-5`, `space.fib-8`, `space.fib-13`, `space.fib-21`, `type.size.sm`,
`type.size.base`, `type.size.lg` (static value behind
`--vd3-font-size-lg-static`), `type.leading.tight`, `motion.55`, `motion.89`,
`easing.out`, `focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`, `math.inv-phi-sq`.

## Deviations & references
No APG pattern exists for buttons — the normative contract is native
`<button>`/`<a>` semantics plus WCAG 2.2 SC 2.5.8 (target size, cited above).
Consulted: Carbon Button (role mapping per `conventions/mappings.md`) — adopts
the variant families (primary / secondary / ghost / outline / danger ≈ Carbon
primary / secondary / tertiary / ghost / danger). Deviates on elevation: vd3
buttons carry no resting shadow, the dual focus ring carries the emphasis. One
CSS gap flagged for the 1.0.3 pass: the danger hover shade is a fixed literal
(`#e03131`) in `button.css` rather than a token ramp step.
