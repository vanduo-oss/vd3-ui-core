# Typography

Status: stable · Spec: 2.0.0-draft

## Scale

Type steps follow the same proportional spine as spacing: consecutive steps
relate by **√φ ≈ 1.272**, so every two steps multiply by φ (16 → 26 → 42 → 68px).
Line-heights come straight from φ (1.236 = 2/φ … 1.618 = φ). The exact step
values are normative in `tokens/vd3.tokens.json` (group `type`); fluid
`clamp()` ranges per the v1.9 docs are confirmed in the v2 audit.

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
