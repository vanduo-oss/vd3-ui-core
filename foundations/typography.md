# Typography

Status: stable · Spec: 2.0.0-draft

## Scale

Type steps follow the same proportional spine as spacing: consecutive steps
relate by **√φ ≈ 1.272**, so every two steps multiply by φ (16 → 26 → 42 → 68px).
Audited against v1.9 (`docs/token-audit-v2.md`): static steps xs…4xl
(12/13/16/18/20/24/30/36px) plus fluid `clamp()` for lg…6xl whose max bounds are
φ multiples (…1.625/2.0625/2.625/3.3125/4.25/5.375rem — 68px = 16·φ³ at 5xl).
Line-heights come straight from φ (1.236 = 2/φ, 1.382, 1.5, 1.618 = φ); v1.9
also ships conventional 1.25/1.5/1.75/2 (class-B aliases). Six tracking tokens
(−0.05em…0.1em, class B) are in `type.tracking`. Exact values are normative in
`tokens/vd3.tokens.json` (group `type`).

- Each step MUST pair with a line-height drawn from the same spine.
- Two functional registers exist: **app** (dense, product UI) and **editorial**
  (larger, expressive). Registers change defaults; they do not change the scale.
- **Density (Q4) — recommendation recorded, decision open:** the registers plus
  the fluid scale are vd3's density contract for 2.0. Carbon-style
  productive/expressive density modes are advised against: they multiply every
  component spec and every token table without a demonstrated product need.
  Revisit at the v2 audit if a concrete need appears.

## Font family

The font family is a theme variable (user-swappable); the scale MUST hold for
the default family and SHOULD degrade gracefully for substitutes.
