# Density

Status: stable · Spec: 1.1.0-draft

Density in VD3 UI CORE is a two-mode spacing multiplier driven by one root hook. This page is the **phase 1.1 density foundation** and resolves open question **Q4** of `docs/research-brief.md` ("Density registers — Carbon-style productive/expressive modes, or is the fluid type scale + registers sufficient?"). Decision: ship a real density contract — **comfortable** (default, scale `1`) and **compact** (`data-density="compact"`, scale `0.7862`) — implemented entirely in `tokens/tokens.css` over the existing spacing tokens. No component changes are required.

## Decision — Two Density Modes (Q4 Resolution)

| Mode | Root hook | Scale token → CSS var | Value | Basis | Rule |
|---|---|---|---|---|---|
| Comfortable (default) | none | `density.scale.comfortable` → `--vd3-density-scale-comfortable` | `1` | Class B | Identity no-op default — a missing hook MUST NOT change rendering (conventional-by-design) |
| Compact | `data-density="compact"` on the root element | `density.scale.compact` → `--vd3-density-scale-compact` | `0.7862` | Class A | `1/sqrt(phi)` ≈ `0.7862`, derivation `phi^(-1/2)` — the typography modular step inverted, applied to spacing |

The compact factor reuses the system's own modular step: typography scales steps by $\sqrt{\phi} \approx 1.2720196495$ (`math.sqrt-phi`, `foundations/typography.md`); density scales spacing by the same step in reverse — `1/sqrt(phi)` = `phi^(-1/2)` ≈ `0.7862`. One golden step down in density for one golden step up in type keeps both systems in the same proportional family (PRN-001).

`data-density` joins the core-implemented root state hooks alongside `data-theme`, `data-font`, and `data-motion` (the AGENTS.md §2 hook list is a follow-up edit; this page is the normative source per PRN-002 / PRN-007).

## Tokens — proposed `density` top-level group (ready-to-paste JSON)

This file does not edit `tokens/`; the block below is the normative snippet for the follow-up token edit. Every leaf carries `$extensions.vd3.class` per the Three-Class Basis Contract.

```json
"density": {
  "$type": "number",
  "$description": "Density scale factors — exactly two modes (Q4 resolution, phase 1.1). Runtime hook data-density=\"compact\" on the root element sets --vd3-density-scale and remaps every --vd3-space-fib-* to calc(<base> * var(--vd3-density-scale)) in tokens.css. Spacing only: containers, breakpoints, type, line weights, radii are structural and never scaled. CSS mapping: density.scale.* -> --vd3-density-scale-*; runtime var --vd3-density-scale.",
  "scale": {
    "comfortable": {
      "$value": 1,
      "$description": "Default mode, identity scale · --vd3-density-scale-comfortable",
      "$extensions": { "vd3": { "class": "B", "reason": "Identity no-op default — a missing data-density hook must never change rendering; conventional-by-design" } }
    },
    "compact": {
      "$value": 0.7862,
      "$description": "Compact mode · --vd3-density-scale-compact · activated by [data-density=\"compact\"] on the root element",
      "$extensions": { "vd3": { "class": "A", "derivation": "phi^(-1/2) — reciprocal of the sqrt(phi) typography modular step, applied to spacing" } }
    }
  }
}
```

Existing token paths referenced by this page (grep-verified present in `tokens/vd3.tokens.json`): `space.fib-1/2/3/5/8/13/21/34/55/89/144`, `math.sqrt-phi`, `container.sm/md/lg/xl/2xl`, `breakpoint.sm/md/lg/xl/2xl`, `type.size.*`, `type.leading.*`, `type.tracking.*`, `line.hair/thin/regular/thick`, `radius.fib-2/3/5/8/13/21`, `radius.full`.

## Implementation contract — `tokens/tokens.css`

1. `:root` declares the two mode constants and the runtime var: `--vd3-density-scale: var(--vd3-density-scale-comfortable, 1)`.
2. `[data-density="compact"]` — same `@layer vd3.tokens`, placed after the `:root` block so it wins at equal specificity when the attribute sits on the root element — sets `--vd3-density-scale: var(--vd3-density-scale-compact, 0.7862)` and remaps **each of the 11** `--vd3-space-fib-*` vars to `calc(<base> * var(--vd3-density-scale))`.
3. The `--vd-*` aliases follow automatically: they are declared as `var(--vd3-…)` (e.g. `--vd-space-fib-8: var(--vd3-space-fib-8)`) and MUST NOT be redefined under the hook.

```css
/* --- add inside the :root block of @layer vd3.tokens, after the spacing scale --- */
    --vd3-density-scale-comfortable: 1;
    --vd3-density-scale-compact: 0.7862;
    --vd3-density-scale: var(--vd3-density-scale-comfortable, 1);

/* --- add after the :root block, same layer --- */
  [data-density="compact"] {
    --vd3-density-scale: var(--vd3-density-scale-compact, 0.7862);

    --vd3-space-fib-1: calc(0.125rem * var(--vd3-density-scale));
    --vd3-space-fib-2: calc(0.25rem * var(--vd3-density-scale));
    --vd3-space-fib-3: calc(0.375rem * var(--vd3-density-scale));
    --vd3-space-fib-5: calc(0.5rem * var(--vd3-density-scale));
    --vd3-space-fib-8: calc(0.75rem * var(--vd3-density-scale));
    --vd3-space-fib-13: calc(0.8125rem * var(--vd3-density-scale));
    --vd3-space-fib-21: calc(1.3125rem * var(--vd3-density-scale));
    --vd3-space-fib-34: calc(2.125rem * var(--vd3-density-scale));
    --vd3-space-fib-55: calc(3.4375rem * var(--vd3-density-scale));
    --vd3-space-fib-89: calc(5.5625rem * var(--vd3-density-scale));
    --vd3-space-fib-144: calc(9rem * var(--vd3-density-scale));
  }
```

Effective compact values on the 16px base (factor `0.7862`):

| Token | Comfortable | Compact |
|---|---|---|
| `space.fib-1` | `0.125rem` = 2px | ≈ 1.77px |
| `space.fib-2` | `0.25rem` = 4px | ≈ 3.54px |
| `space.fib-3` | `0.375rem` = 6px | ≈ 5.32px |
| `space.fib-5` | `0.5rem` = 8px | ≈ 7.09px |
| `space.fib-8` | `0.75rem` = 12px | ≈ 10.63px |
| `space.fib-13` | `0.8125rem` = 13px | ≈ 11.52px |
| `space.fib-21` | `1.3125rem` = 21px | ≈ 18.61px |
| `space.fib-34` | `2.125rem` = 34px | ≈ 30.13px |
| `space.fib-55` | `3.4375rem` = 55px | ≈ 48.74px |
| `space.fib-89` | `5.5625rem` = 89px | ≈ 78.87px |
| `space.fib-144` | `9rem` = 144px | ≈ 127.66px |

## Scope — spacing only

Density scales **SPACING only**. The following are structural and MUST NOT be multiplied by `--vd3-density-scale`:

| Structural group | Tokens | Why not scaled |
|---|---|---|
| Containers | `container.sm…2xl` | Layout skeleton / max-widths |
| Breakpoints | `breakpoint.sm…2xl` | Viewport seams (class B platform values) |
| Type | `type.size.*`, `type.leading.*`, `type.tracking.*` | Type metrics are their own modular system |
| Line weights | `line.hair/thin/regular/thick` | The 1px hairline and the 2px focus-ring geometry (`focus.ring.width/offset`) must stay raster-crisp (FOC-001…004) |
| Radii | `radius.fib-*`, `radius.full` | Shape semantics, not rhythm |

## Component impact — none

Every component consumes the space tokens (`var(--vd3-space-fib-*, …)`), so both modes reach all components with zero edits: `calc()` preserves the rem unit and composes through `var()`. The files under `components/` (CSS, specs, markup) are untouched by this decision.

## Reduced motion — MOB-001 unaffected

Density is not motion. `data-density="compact"` never touches `--vd3-duration-*` / `--vd3-ease-*`; `[data-density="compact"]` and `[data-motion="reduce"]` are independent root hooks whose blocks coexist in `tokens/tokens.css`. The MOB-001 contract (`foundations/motion.md`) is unchanged.

## Requirements

- **DEN-001** — Exactly two density modes exist: comfortable (default, `1`, Class B) and compact (`0.7862`, Class A, derivation `phi^(-1/2)`). No third mode.
- **DEN-002** — Compact is activated only by `data-density="compact"` on the root element; no attribute MUST render identical to comfortable.
- **DEN-003** — `:root` MUST declare `--vd3-density-scale-comfortable`, `--vd3-density-scale-compact`, and the runtime `--vd3-density-scale` (defaulting to the comfortable value).
- **DEN-004** — `[data-density="compact"]` MUST remap all 11 `--vd3-space-fib-*` vars to `calc(<base> * var(--vd3-density-scale))`.
- **DEN-005** — `--vd-*` aliases MUST NOT be redefined under the hook; they inherit through their `var(--vd3-…)` references.
- **DEN-006** — Density scales spacing only; `container.*`, `breakpoint.*`, `type.*`, `line.*`, `radius.*` MUST NOT be scaled.
- **DEN-007** — Components need no changes; they consume `space.fib-*` tokens and inherit both modes automatically.
- **DEN-008** — MOB-001 is unaffected; the density hook MUST NOT alter motion tokens.
- **DEN-009** — Both `density.scale.*` leaves MUST carry `$extensions.vd3.class` (compact: `A` + derivation; comfortable: `B` + reason).

## Deviations & references

- Consulted, not conformed (per AGENTS.md): IBM Carbon ships **productive/expressive** density pairs per theme on its 2x spacing grid ([Carbon themes](https://carbondesignsystem.com/elements/themes/overview/), [Carbon 2x grid](https://carbondesignsystem.com/elements/2x-grid/overview/)). vd3 deliberately diverges: one root hook, one Class A factor (`phi^(-1/2)`), spacing-only. Carbon's fixed 2x steps are the class B convention vd3 does not adopt (PRN-003, PRN-008).
- The Q4 alternative — fluid type scale + glass/surface registers alone — was rejected as insufficient: those change type expression and surface strength, not rhythm. Compact mode complements them.
- This document does not edit `tokens/`; the JSON and CSS blocks above are the ready-to-paste normative snippets for the follow-up token-file edit.
