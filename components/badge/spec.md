---
slug: badge
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A badge is a compact, non-interactive pill that labels the status, count, or
category of another element; a chip is its interactive sibling (a filter or a
removable tag). Use the badge for read-only metadata attached to icons, avatars,
or table rows. NOT for: primary actions (use button), transient confirmations
(use toast), blocking or contextual page messages (use alert/dialog), or
navigation (use navbar).

## Anatomy
`.vd-badge` (a `<span>`; carries `role="status"` only when its text updates
dynamically, e.g. counters) with size modifiers `--sm` / `--lg`, status
variants `--info` / `--success` / `--warning` / `--danger` (`--critical` alias),
a `--solid` fill variant, and a `--dot` indicator variant. The interactive
`.vd-chip` (a `<button type="button" aria-pressed>` or an `<a>`) optionally
contains a `.vd-chip-close` dismiss button. Pill shape is `radius.full`
(C-04); the dot is `space.fib-5` square with `border-radius: 50%`.

## States
Rest (bg `color.role.layer`, hair border `line.hair` + `color.role.border`,
text `color.role.text-secondary`) / status variants (bg/border = golden-angle
hue at `glass.tint-md` / `glass.tint-xl` alpha, text = darkened hue; dark theme
swaps to `glass.tint-lg` alpha + luminous text, e.g. `color.primitive.gold.4`)
/ `--solid` (bg = solid `color.primitive.golden-angle.*` / `color.primitive.red.6`,
text = `color.role.canvas` or `color.primitive.gray.9`) / chip hover (bg
`color.role.layer-hover`, border `color.role.text-secondary`) / chip selected
(`[aria-pressed="true"]`: bg + border `color.role.focus`, shadow
`glow.fib-8` + `color.role.focus-glow`) / `:focus-visible` on chip and
`.vd-chip-close` (dual ring, `focus.ring.*`, FOC-001/002). Each state swaps
only tokens.

## Props / API
Contract-level: `.vd-badge` on a `<span>` (or `<data>`/`<output>` for machine
readable values); no props — variants are classes. `.vd-chip` is a native
`<button type="button">` with `aria-pressed="true|false"` (toggle chip) or an
`<a href>` (link chip); `.vd-chip-close` is a `<button type="button">` with an
action-based `aria-label` per `conventions/content.md` ("Remove filter", never
"X icon"). Sizes: badge `sm | md (default) | lg`; chip has one size.

## Keyboard — NORMATIVE: no APG pattern (behavioral contract)

No APG pattern exists for badges; the contract is the WAI-ARIA `status` role for
dynamic badges and native button/link semantics for chips.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to/from an interactive chip or its close button (a static badge is never a tab stop) |
| Space / Enter | Toggle `aria-pressed` on a button chip / activate a link chip / activate `.vd-chip-close` |

## Focus
The badge itself is not focusable. The chip and `.vd-chip-close` are ordinary
tab stops; `:focus-visible` renders the dual ring (offset `focus.ring.offset` +
canvas-colored gap `focus.ring.offset-color`, ring `focus.ring.width` +
`focus.ring.color`, halo `focus.ring.glow`) per FOC-001…004.

## Accessibility requirements
- BDG-001 A static badge is non-interactive: no `tabindex`, no role, no keyboard handler.
- BDG-002 A badge whose text changes dynamically (counters, live status) carries `role="status"` (implicit `aria-live="polite"`) so updates are announced without stealing focus.
- BDG-003 Meaning is never carried by color alone (WCAG 1.4.1): the text label is mandatory; the `--dot` variant MUST be paired with a visible or visually-hidden text label.
- BDG-004 An interactive chip exposes its state via `aria-pressed="true|false"` (toggle) or is a link with discernible text; the close button has an action-based `aria-label` per `conventions/content.md`.
- BDG-005 `:focus-visible` dual ring on chip and close button per FOC-001…004; reduced motion (MOB-001) collapses the chip/chip-close transitions (`motion.55`/`motion.89`).

## Tokens consumed
`type.size.xs`, `type.size.sm`, `type.tracking.wider`, `space.fib-1`,
`space.fib-2`, `space.fib-3`, `space.fib-5`, `space.fib-8`, `space.fib-13`,
`radius.full`, `line.hair`, `color.role.canvas`, `color.role.layer`,
`color.role.layer-hover`, `color.role.border`, `color.role.text-primary`,
`color.role.text-secondary`, `color.role.focus`, `color.role.focus-glow`,
`color.primitive.golden-angle.0`, `color.primitive.golden-angle.1`,
`color.primitive.golden-angle.6`, `color.primitive.red.6`,
`color.primitive.gold.4`, `color.primitive.gray.9`, `glass.tint-md`,
`glass.tint-lg`, `glass.tint-xl`, `glow.fib-8`, `motion.55`, `motion.89`,
`easing.out`, `focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
No APG pattern exists for badges/chips; the contract is the WAI-ARIA `status`
role plus native toggle/link semantics. Consulted: Carbon Tag — adopts the
subtle tinted variants and the status→color mapping per
`conventions/mappings.md`; deviates on the pill shape (`radius.full`, C-04)
and on the algorithmic golden-angle categorical palette
(`color.primitive.golden-angle.*`) instead of a fixed tag color set.
