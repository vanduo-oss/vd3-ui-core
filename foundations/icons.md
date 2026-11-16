# Icons — Iconography Foundation

Status: stable · Spec: 1.1.0-draft

Phase 1.1 of `docs/roadmap-1.1.0-draft.md`. This page is the library-agnostic
iconography contract for VD3 UI CORE: it fixes the size scale, the stroke
weight, the color roles, and the CSS naming for icons. Per PRN-004 the core is
zero-framework and vendors no glyphs — the glyph set is implementation-side.
The audited implementing library (`@vanduo-oss/vd3` v1.9.x) uses Phosphor
icons (six weights; `regular` + `fill` imported by default in its icons
stylesheet, which also documents `font-size: 24px` as the size mechanism), and
its icon component (`VdIcon`) renders an `<i aria-hidden="true">` with `name` /
`filled` / `size: sm|md|lg` (default `md`). Any conforming implementation may
substitute its own glyph set, provided it honors this contract.

## 1. Size scale — Fibonacci steps (Class A)

Icons are drawn on a square em box; the box size is the only normative
dimension. The scale is the Fibonacci sequence from $F_7$ to $F_{10}$
(closed-form Binet equation in `foundations/proportion.md`):

| Step | Token (proposed `icon.size.*`) | CSS variable | px | rem (16px base) | Term | Basis | Architectural role |
|---|---|---|---|---|---|---|---|
| sm | `icon.size.sm` | `--vd3-icon-size-sm` | 13px | 0.8125rem | $F_7$ | Class A | inline with text, dense controls |
| md | `icon.size.md` | `--vd3-icon-size-md` | 21px | 1.3125rem | $F_8$ | Class A | DEFAULT (`.vd-icon` base) — buttons, form controls, nav links |
| lg | `icon.size.lg` | `--vd3-icon-size-lg` | 34px | 2.125rem | $F_9$ | Class A | leading icon of alert/toast banners, empty states |
| xl | `icon.size.xl` | `--vd3-icon-size-xl` | 55px | 3.4375rem | $F_{10}$ | Class A | hero / empty-state illustration icons |

Derivations: $F_7 = 13$, $F_8 = 21$, $F_9 = 34$, $F_{10} = 55$ with
$F_n = \mathrm{round}((\phi^n - (-\phi)^{-n})/\sqrt{5})$. The rem values are
identical to `space.fib-13/21/34/55` — the icon box and the spacing scale
share the same Fibonacci spine. No other pixel sizes are permitted for icons
(ad-hoc 16/20/24/32 steps are prohibited; see Deviations).

### Mapping decision — the library's `md` = 24px (normative)

The audited library documents 24px as its default icon size and its icon
component defaults to `size="md"`. 24px is not a Fibonacci step. **Decision:
this is a deliberate, registered deviation — NOT a mapping of the library's
`md` onto core `lg`.** 24px sits between core `md` (21px, Δ = +3px) and core
`lg` (34px, Δ = +10px, i.e. +42%); aliasing `md` to `lg` would enlarge the
default icon far more than the core scale already covers that neighborhood.
The library therefore keeps `md` = 24px as a Class-B conventional alias
(16px base × 1.5 = the `type.size.2xl` static step) for backwards
compatibility with the v1.9 audit, and maps to the core scale **by name**:
library `sm`/`md`/`lg` → core `sm`/`md`/`lg` (core adds `xl`).
Reconciliation rule (PRN-002, PRN-008): `icon.size.*` in core is the single
source of truth; when the library adopts these tokens it SHOULD re-point `md`
from 24px to `icon.size.md` (21px) in the next spec-major, recorded in
`docs/token-audit.md`. No silent drift.

## 2. Stroke width — φ (Class A)

Outline (stroke-based) icons use stroke width $1.618 \approx \phi$:

- Token (proposed): `icon.stroke.outline` = `1.618` — a unitless SVG
  `stroke-width` expressed in the icon viewBox's user units (the Phosphor
  outline / regular weight is the reference glyph set).
- Basis: Class A, derivation $\phi = (1+\sqrt{5})/2 = 1.6180339887$, rounded
  to three decimals.
- Precedent in core: the dark-theme select chevron in `components/form.css:191`
  is an inline SVG with `stroke-width='1.618'` (round caps and joins) — the
  icon contract and the form chevron share the same stroke weight.
- Relationship to `line.*`: icon strokes are deliberately NOT part of the
  `line` group (UI borders: `line.hair` 1px / `line.thin` 2px / …).
  $\phi \approx 1.618$ sits between `line.hair` and `line.thin` on purpose:
  glyph strokes are finer than structural UI borders inside the same em box.
  Fill and duotone weights ignore the stroke token.

## 3. Color — semantic roles only

Icon ink MUST come from semantic role tokens (`color.role.*`), never raw hex
and never `color.primitive.*` (tier rules in `foundations/color.md`). Icons
inherit `currentColor`, so the class sets `color` once and both font glyphs
and SVG `fill`/`stroke: currentColor` follow:

| Context | Token | CSS variable |
|---|---|---|
| Default icon ink | `color.role.text-primary` | `--vd3-color-text-primary` |
| Muted / caption icons | `color.role.text-secondary` | `--vd3-color-text-secondary` |
| Interactive / active accent | `color.role.focus` | `--vd3-color-focus` |
| Error status icons (always paired with text) | `color.role.critical` | `--vd3-color-critical` |

Dark theme swaps automatically through `theme.dark.color.role.*` (parity
contract in `foundations/color.md`) — no per-icon dark overrides.

## 4. Naming

- Base class: `.vd-icon` (defaults to `md` = 21px).
- Size modifiers in both registered forms, matching `button` / `badge` /
  `table`: `.vd-icon--sm` + alias `.vd-icon-sm`, `.vd-icon--md` +
  `.vd-icon-md`, `.vd-icon--lg` + `.vd-icon-lg`, `.vd-icon--xl` +
  `.vd-icon-xl`.
- Scoped custom properties follow the `--_vd-<slug>-*` pattern:
  `--_vd-icon-size`, `--_vd-icon-color`, consumed as
  `var(--vd3-icon-size-md, 1.3125rem)` etc. Token→CSS mapping per
  `conventions/naming.md`: `icon.size.sm` → `--vd3-icon-size-sm` (legacy
  alias `--vd-icon-size-sm`).
- Icon-to-label gap: `space.fib-5` (8px) — already registered as "icon gap"
  in `foundations/proportion.md`.

## 5. Sizing registry — resolves the token-audit unknown

`docs/token-audit.md` ("Remaining unknowns") records: *"Icon sizing steps
(brief suggested fib 13/21/34) — Phosphor weights confirmed, size tokens not
yet located."* This section closes that unknown:

| Registry entry | Value | Basis | Derivation | Status |
|---|---|---|---|---|
| `icon.size.sm` | 13px (0.8125rem) | Class A | $F_7 = 13$ | Registered (this page) |
| `icon.size.md` | 21px (1.3125rem) | Class A | $F_8 = 21$ | Registered — default |
| `icon.size.lg` | 34px (2.125rem) | Class A | $F_9 = 34$ | Registered |
| `icon.size.xl` | 55px (3.4375rem) | Class A | $F_{10} = 55$ | Registered (extends the brief's 13/21/34) |
| `icon.stroke.outline` | 1.618 | Class A | $\phi$, 3-decimal rounding | Registered |
| library `md` = 24px | 24px | Class B (library alias) | type-scale step × 1.5; deliberate deviation, see §1 | Registered deviation |

The corresponding `icon` token group is NOT yet present in
`tokens/vd3.tokens.json` (verified: no `icon` key exists). The
ready-to-merge snippet below is the proposed group — integration adds it to
the token file; this phase does not edit `tokens/vd3.tokens.json`:

```json
"icon": {
  "$description": "Iconography contract (foundations/icons.md, phase 1.1). Sizes are Fibonacci steps F_7..F_10 (Class A) on a 16px rem base; stroke width is phi (Class A); color leaves are semantic-role aliases only. Resolves the token-audit open unknown 'Phosphor icon sizing steps' (docs/token-audit.md). CSS mapping per conventions/naming.md: icon.* -> --vd3-icon-* (legacy alias --vd-icon-*).",
  "size": {
    "$type": "dimension",
    "$description": "Icon box sizes — Fibonacci F_7..F_10. Base .vd-icon defaults to md (F_8 = 21px).",
    "sm": { "$value": "0.8125rem", "$description": "13px · --vd3-icon-size-sm", "$extensions": { "vd3": { "class": "A", "derivation": "Fibonacci F_7 = 13 (Binet); rem value identical to space.fib-13" } } },
    "md": { "$value": "1.3125rem", "$description": "21px · --vd3-icon-size-md · default", "$extensions": { "vd3": { "class": "A", "derivation": "Fibonacci F_8 = 21; rem value identical to space.fib-21" } } },
    "lg": { "$value": "2.125rem", "$description": "34px · --vd3-icon-size-lg", "$extensions": { "vd3": { "class": "A", "derivation": "Fibonacci F_9 = 34; rem value identical to space.fib-34" } } },
    "xl": { "$value": "3.4375rem", "$description": "55px · --vd3-icon-size-xl", "$extensions": { "vd3": { "class": "A", "derivation": "Fibonacci F_10 = 55; rem value identical to space.fib-55" } } }
  },
  "stroke": {
    "$description": "Outline icon stroke — SVG stroke-width in user units of the icon viewBox (Phosphor outline/regular weight is the reference).",
    "outline": { "$type": "number", "$value": 1.618, "$description": "--vd3-icon-stroke-outline · 1.618 = phi rounded to 3 decimals; matches the select chevron in components/form.css (stroke-width='1.618')", "$extensions": { "vd3": { "class": "A", "derivation": "phi = (1 + sqrt(5)) / 2 = 1.6180339887, rounded to 3 decimals" } } }
  },
  "color": {
    "$type": "color",
    "$description": "Icon ink — semantic-role aliases only; components never consume primitives directly (foundations/color.md).",
    "default":   { "$value": "{color.role.text-primary}",   "$description": "--vd3-icon-color · default icon ink (inherits currentColor)", "$extensions": { "vd3": { "class": "B", "reason": "Alias of color.role.text-primary" } } },
    "secondary": { "$value": "{color.role.text-secondary}", "$description": "--vd3-icon-color-secondary · muted / caption icons", "$extensions": { "vd3": { "class": "B", "reason": "Alias of color.role.text-secondary" } } },
    "accent":    { "$value": "{color.role.focus}",          "$description": "--vd3-icon-color-accent · interactive / active icons", "$extensions": { "vd3": { "class": "B", "reason": "Alias of color.role.focus" } } },
    "critical":  { "$value": "{color.role.critical}",       "$description": "--vd3-icon-color-critical · error status icons, always paired with text (WCAG 1.4.1)", "$extensions": { "vd3": { "class": "B", "reason": "Alias of color.role.critical" } } }
  },
  "gap": {
    "$type": "dimension",
    "$value": "{space.fib-5}",
    "$description": "8px icon-to-label gap · --vd3-icon-gap (proportion.md registers 'icon gap' at space.fib-5)",
    "$extensions": { "vd3": { "class": "A", "derivation": "Alias for space.fib-5 (F_5 = 8px, C-01)" } }
  }
}
```

## 6. Weights — glyph-set property, not a core token

The audited library imports Phosphor `regular` + `fill` by default; `bold`,
`light`, `thin`, `duotone` are opt-in direct imports (six weights total).
Core tokenizes only the outline stroke width (§2) because it affects geometry
and contrast; weight selection stays with the glyph set.

## 7. Do / Don't

- DO pair every action icon with a visible text label; use `sm` inline with
  text, `md` (default) inside controls, `lg` as a banner-leading icon, `xl`
  in empty / hero states.
- DO mark purely decorative icons `aria-hidden="true"` (the library icon
  component does this by default).
- DO keep icon ink on the semantic roles in §3.
- DO NOT use an icon alone to carry status or error meaning — pair it with
  text (WCAG 2.1 SC 1.4.1).
- DO NOT use raw hex or primitive tokens for icon ink; DO NOT invent icon
  sizes outside the registry (no 16/20/24/32 steps).
- DO NOT animate icons longer than `motion.144` (icon rotation per
  `foundations/motion.md`); the MOB-001 collapse applies.

## 8. Accessibility requirements

- ICN-001 Decorative icons MUST be hidden from assistive technology
  (`aria-hidden="true"`) and MUST NOT be focusable.
- ICN-002 An icon that conveys information on its own MUST have an accessible
  name or adjacent visible text — WCAG 2.1 SC 1.1.1
  (<https://www.w3.org/TR/WCAG22/#non-text-content>).
- ICN-003 Icon-only interactive controls MUST have an action-based accessible
  name (`conventions/content.md`) and the dual-ring `:focus-visible` contract
  FOC-001…004 — WCAG 2.2 SC 2.4.13.
- ICN-004 Informative (non-decorative) icons MUST meet ≥ 3:1 contrast against
  adjacent backgrounds — WCAG 2.1 SC 1.4.11
  (<https://www.w3.org/TR/WCAG22/#non-text-contrast>). Decorative icons are
  exempt.
- ICN-005 Icon color MUST resolve through `color.role.*` (light) and
  `theme.dark.color.role.*` (dark); raw hex is prohibited.
- ICN-006 Icon motion uses at most `motion.144` and MUST be collapsed under
  MOB-001 (`@media (prefers-reduced-motion: reduce)` and
  `[data-motion="reduce"]`).
- APG: none — the ARIA Authoring Practices Guide defines no icon pattern; the
  behavioral contract above follows WAI-ARIA `aria-hidden` plus WCAG 2.1/2.2
  SC 1.1.1, 1.4.1, 1.4.3, 1.4.11, 2.4.13.

## 9. Tokens consumed (existing paths in `tokens/vd3.tokens.json`, grep-verified)

- `math.phi`, `math.inv-phi-sq` (φ derivations; 1/φ² for icon opacity inside disabled controls)
- `color.role.text-primary`, `color.role.text-secondary`, `color.role.focus`, `color.role.critical`
- `theme.dark.color.role.text-primary`, `theme.dark.color.role.text-secondary`, `theme.dark.color.role.focus`, `theme.dark.color.role.critical`
- `space.fib-5` (icon-to-label gap), `space.fib-8` (banner icon inset)
- `motion.144` (icon rotation), `motion.55`
- `line.hair`, `line.thin` (boundary reference only — the icon stroke is φ, not a `line` step)

## 10. Deviations & references

- Consulted Carbon Icon usage
  (<https://carbondesignsystem.com/components/icon/usage/>): Carbon ships
  16/20/24/32px icon sizes. vd3 core deviates — Fibonacci 13/21/34/55px
  (Class A) per PRN-003/PRN-008; recorded here, not conformed.
- Deliberate deviation: the implementing library's default `md` icon renders
  at 24px (Class-B alias), not core `icon.size.md` = 21px — mapping decision
  in §1; to be reconciled in the library's next spec-major per PRN-002.
- APG: none (no icon pattern exists); see ICN-001…006 for the contract.
- References read: the library's `css/icons/icons.css` (Phosphor
  regular+fill default imports; `font-size: 24px` usage note) and its icon
  component (`VdIcon`: `name` / `filled` / `size sm|md|lg`, `aria-hidden="true"`),
  `components/form.css:191` (chevron `stroke-width='1.618'`),
  `docs/token-audit.md` (open unknown closed in §5),
  `docs/research-brief.md` (sizing-table gap; item 10 do/don't),
  `docs/roadmap-1.1.0-draft.md` (phase 1.1 scope).
