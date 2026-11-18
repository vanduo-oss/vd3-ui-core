---
slug: icon
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

# Icon

## Summary
Zero-framework icon primitive (`components/icon.css`, Feature #61) implementing the
sizing, golden-ratio stroke, semantic ink, and RTL mirroring contract defined in
`foundations/icons.md`. Use `.vd-icon` to wrap inline SVG glyphs or icon font elements
when icon sizing (`sm`–`xl`) or semantic role color must follow Fibonacci proportions.
Do NOT use `.vd-icon` as a standalone clickable control without an interactive `<button>`
or `<a>` host and accessible name.

## Anatomy
- `.vd-icon`: Inline-flex box (`1:1` Fibonacci square) inheriting `currentColor` and `icon.stroke.outline` ($\phi \approx 1.618$).
- `.vd-icon > svg`: Scales to `100%` of `--_vd-icon-size`, inheriting `stroke: currentColor` and `stroke-width`.
- `.vd-icon-pair`: Inline-flex label+icon helper spacing items by `icon.gap` (`8px`).

## States
- **Rest**: `--_vd-icon-size: var(--vd3-icon-size-md)` (`21px`), `--_vd-icon-color: currentColor`.
- **Disabled (`.vd-icon--disabled`, `[aria-disabled="true"]`)**: opacity reduces to `0.382` (`math.inv-phi-sq`).
- **Focus-visible (when hosted on a focusable element)**: Dual-ring focus indicator (`focus.ring.*`, `2px` width/offset).
- **RTL (`.vd-icon--directional`)**: Mirrors horizontally (`transform: scaleX(-1)`) inside `:dir(rtl)` / `[dir="rtl"]`.

## Props / API
- **Size modifiers**: `.vd-icon--sm` / `.vd-icon-sm` (`13px` / $F_7$), `.vd-icon--md` / `.vd-icon-md` (`21px` / $F_8$, default), `.vd-icon--lg` / `.vd-icon-lg` (`34px` / $F_9$), `.vd-icon--xl` / `.vd-icon-xl` (`55px` / $F_{10}$).
- **Semantic ink modifiers**: `.vd-icon--primary`, `.vd-icon--secondary` (`.vd-icon--muted`), `.vd-icon--accent` (`.vd-icon--interactive`), `.vd-icon--critical`.
- **Direction modifier**: `.vd-icon--directional` for arrows, chevrons, and directional indicators.
- **Scoped custom properties**: `--_vd-icon-size`, `--_vd-icon-color`.

## Keyboard — ⟨NORMATIVE: APG⟩
- Non-interactive decorative or status indicator; not keyboard-focusable on its own.
- When paired inside a `<button>` or `<a>`, keyboard activation and focus follow the host pattern.

## Focus
- Decorative icons have `aria-hidden="true"` and never receive focus.
- Standalone semantic icons with `role="img"` and `aria-label` follow host focus rules; if focusable, `.vd-icon:focus-visible` provides the dual-ring focus contract (`FOC-001`–`FOC-004`).

## Accessibility requirements
- **ICN-001**: Decorative icons MUST carry `aria-hidden="true"` (and `focusable="false"` on legacy SVG hosts).
- **ICN-002**: Standalone meaningful icons without adjacent visible text MUST declare `role="img"` and `aria-label` (or visually hidden text).
- **ICN-003**: Critical/error icons (`.vd-icon--critical`) MUST be paired with visible text or status wording so state is never conveyed by color alone (WCAG 1.4.1).
- **ICN-004**: Directional icons inside `.vd-icon--directional` flip horizontally under RTL without affecting symmetrical glyphs (checkmarks, plus, close, search).
- **ICN-005 (MOB-001)**: Color and transform transitions collapse under `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
- `icon.size.sm`, `icon.size.md`, `icon.size.lg`, `icon.size.xl`
- `icon.stroke.outline` ($\phi \approx 1.618$, Class A)
- `icon.gap` (`8px` / `space.fib-5`)
- `icon.color`, `icon.color.secondary`, `icon.color.accent`, `icon.color.critical`
- `focus.ring.*`, `motion.89`, `easing.out`, `math.inv-phi-sq`

## Deviations & references
- Sizes use Fibonacci $F_7$–$F_{10}$ (`13px`–`55px`, Class A); downstream Vue library (`@vanduo-oss/vd3`) aliases `md = 24px` (Class B library deviation documented in `foundations/icons.md` §1 & §5).
