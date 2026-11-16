---
slug: code
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
Code presentation: inline `code.vd-code-inline` for short snippets inside prose,
`pre.vd-code` blocks for multi-line samples with an optional language badge
(`data-language`) and copy button (`.vd-code-copy`), plus `.vd-spec-card` for
token documentation. NOT for: user-editable text (use the form textarea), or
highlighting that conveys meaning by color alone.

## Anatomy
Inline: `code.vd-code-inline` (also applied to any `code` not inside `pre`).
Block: `pre.vd-code > code`, optional `data-language` attribute rendered as a
pseudo-element badge at `inset-inline-end`, optional `.vd-code-copy` button.
Syntax tokens: `.token-keyword`, `.token-string`, `.token-number`,
`.token-property`, `.token-selector`, `.token-comment`. Spec card:
`.vd-spec-card` > `.vd-spec-card-header` (`.vd-spec-card-token` +
`.vd-spec-card-value`).

## States
Rest (layer fill, hairline border) / `.vd-code-copy` hover (`color.role.layer-hover`)
and `:focus-visible` (dual ring, `focus.ring.*`) / `[data-theme="dark"]` block
inversion / reduced motion (the copy button's 89ms transition collapses per
MOB-001). Each state swaps only tokens.

## Props / API
Contract-level: `data-language="<lang>"` on `pre.vd-code` shows the language
badge; `.vd-code-copy` is a `<button type="button">` whose click copies the block
text (the wiring belongs to the implementing layer; the button MUST carry an
action-based `aria-label` and SHOULD surface a "Copied" confirmation).

## Keyboard — NORMATIVE: no APG pattern (read-only content + one button)
No APG pattern exists for code display. Behavioral contract: the code text is
read-only and needs no keys; the only tab stop in a block is `.vd-code-copy`.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move to / from the copy button (single tab stop in the block) |
| Enter / Space | Activate copy when the button is focused |

## Focus
The copy button is the only focusable element; `:focus-visible` dual ring per
FOC-001…004. A horizontally overflowing `pre.vd-code` may be given
`tabindex="0"` so keyboard users can scroll it (same scrollable-region contract
as TBL-002), receiving the dual ring when focusable.

## Accessibility requirements
- COD-001 Inline vs block semantics are preserved: `<code>` inside `<pre>` keeps monospace styling while `pre` preserves whitespace, line breaks, and indentation (WCAG 1.3.1).
- COD-002 The copy button is a real `<button>` with an action-based accessible name ("Copy code"), receives the dual-ring focus indicator, and announces the copy result (visible label change and/or an `aria-live="polite"` status).
- COD-003 Syntax highlighting (`.token-*`) is decorative: meaning is carried by the code text, never by color alone (WCAG 1.4.1); token hues must stay legible in dark theme and in forced-colors / high-contrast modes.
- COD-004 Horizontal overflow in `pre.vd-code` (`overflow-x: auto`) is keyboard reachable when scrollable; the copy button's transition collapses under MOB-001 (both `prefers-reduced-motion: reduce` and `[data-motion="reduce"]`).

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.canvas`,
`color.role.text-primary`, `color.role.text-secondary`, `color.role.border`,
`color.role.focus`, `line.hair`, `radius.fib-3`, `radius.fib-5`, `radius.fib-8`,
`space.fib-1`, `space.fib-2`, `space.fib-3`, `space.fib-5`, `space.fib-8`,
`space.fib-13`, `space.fib-21`, `space.fib-89`, `type.size.xs`, `type.size.sm`,
`type.leading.normal`, `type.tracking.wider`, `motion.89`, `easing.out`,
`focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`.

## Deviations & references
No APG pattern exists for code display; the contract is WCAG 1.3.1 / 1.4.1 plus
native `<code>` / `<pre>` semantics. Consulted: Carbon CodeSnippet — adopts the
copy-button affordance and the language badge; deviates on syntax hues: the
`.token-*` colors and the dark `pre` fill are raw literals in `code.css` (only
the light keyword hue `#254ef0` coincides with `color.primitive.golden-angle.4`;
the dark block fill matches `color.primitive.gray.1000` / `color.primitive.gray.0`
by value) — tokenizing a syntax-hue group is a known 1.0.3 gap. The inline border
also references a `--vd3-color-border-subtle` alias that falls back to
`color.role.border`.
