# Color — Semantic Role Model

Status: stable · Spec: 1.1.0-draft

The color system in VD3 UI CORE is architected across three strict tiers, guaranteeing high contrast accessibility (WCAG AA/AAA) and algorithmic color harmony derived from the golden angle ($\psi \approx 137.508^\circ$).

## The Three Tiers (Feature #17)

1. **Primitive Palette (`color.primitive`)**:
   - Raw color values, hue scales, and lightness ramps.
   - Includes Open Color neutrals (`gray.0` through `gray.1000`), brand accents (`gold.4`, `gold.6`, `gold.7`), functional alerts (`red.4`, `red.6`), and the algorithmic golden-angle categorical swatches.
   - *Rule*: UI components MUST NOT reference primitive color tokens directly.

2. **Semantic Roles (`color.role`)**:
   - Meaning-based color mappings: `--vd3-color-canvas`, `--vd3-color-layer`, `--vd3-color-text-primary`, `--vd3-color-border`, `--vd3-color-focus`, `--vd3-color-critical`.
   - *Rule*: Components consume ONLY semantic role tokens.

3. **Component Tokens**:
   - Scoped refinements within individual component stylesheets (e.g., `--vd-btn-layer-hover`), mapped directly to semantic roles.

## Dual-Theme System (`light` & `dark`) (Feature #19)

Theme switching supports both OS-level color-scheme preference and explicit `data-theme` attribute overrides on the root `<html>` element:
- `:root` declares `color-scheme: light dark;` and the default light theme tokens.
- `@media (prefers-color-scheme: dark)` on `:root:not([data-theme="light"])` automatically applies dark overrides (`color-scheme: dark`, dark `color.role.*`, and dark `shadow.*`) when the user has not explicitly forced light mode.
- `[data-theme="light"]` locks `color-scheme: light;` and preserves light defaults regardless of OS preference.
- `[data-theme="dark"]` locks `color-scheme: dark;` and enforces dark overrides regardless of OS preference.
- *Performance Contract*: Re-theming executes in zero frames (single cascade recalculation without transition flashes).
- *Parity Contract*: Every semantic role defined in the light theme MUST be defined in the dark theme.

### Normative Semantic Role Mapping & Contrast Matrix

| Semantic Role Token | CSS Custom Property | Light Theme Value | Dark Theme Value | Verified Contrast Ratio | WCAG Rating |
|---|---|---|---|---|---|
| `canvas` | `--vd3-color-canvas` | `#ffffff` | `#212529` (`gray.9`) | — | Base surface |
| `canvas-rgb` | `--vd3-color-canvas-rgb` | `255, 255, 255` | `33, 37, 41` | — | RGB triplet for `rgba()` glass/layer compositing |
| `layer` | `--vd3-color-layer` | `#f8f9fa` (`gray.0`) | `#343a40` (`gray.8`) | — | Card / panel surface |
| `layer-hover` | `--vd3-color-layer-hover` | `#f1f3f5` (`gray.1`) | `#495057` (`gray.7`) | — | Interactive layer hover |
| `text-primary` | `--vd3-color-text-primary` | `#1a1d20` (`gray.1000`) | `#f8f9fa` (`gray.0`) | **17.5:1** (light) / **15.8:1** (dark) | **WCAG AAA** |
| `text-secondary`| `--vd3-color-text-secondary`| `#495057` (`gray.7`) | `#dee2e6` (`gray.3`) | **5.8:1** (light) / **7.2:1** (dark) | **WCAG AA / AAA** |
| `border` | `--vd3-color-border` | `#dee2e6` (`gray.3`) | `#495057` (`gray.7`) | **$\ge 3.0:1$** non-text boundary | **WCAG Non-text** |
| `border-subtle` | `--vd3-color-border-subtle` | `#e9ecef` (`gray.2`) | `#343a40` (`gray.8`) | Decorative / subtle divider | Low-emphasis divider |
| `focus` | `--vd3-color-focus` | `#fab005` (`gold.6`) | `#ffd43b` (`gold.4`) | **$\ge 3.5:1$** focus ring contrast | **WCAG 2.4.13** |
| `focus-glow` | `--vd3-color-focus-glow` | `rgba(250, 176, 5, 0.4)` | `rgba(255, 212, 59, 0.4)` | Dual-ring focus halo (`F_6 = 8px`) | **FOC-001…004** |
| `interactive` | `--vd3-color-interactive` | `#f59f00` (`gold.7`) | `#ffd43b` (`gold.4`) | **$\ge 4.5:1$** button text contrast | **WCAG AA** |
| `critical` | `--vd3-color-critical` | `#fa5252` (`red.6`) | `#ff8787` (`red.4`) | **$\ge 4.5:1$** alert text contrast | **WCAG AA** |
| `info` | `--vd3-color-info` | `#0ab5b5` (`golden-angle.1`) | `#0ab5b5` (`golden-angle.1`) | **6.09:1** (dark); darken on light surfaces | Status accent (`color-mix` text on light) |
| `success` | `--vd3-color-success` | `#0ac265` (`golden-angle.6`) | `#0ac265` (`golden-angle.6`) | **6.55:1** (dark); darken on light surfaces | Status accent (`color-mix` text on light) |
| `warning` | `--vd3-color-warning` | `#fab005` (`gold.6`) | `#ffd43b` (`gold.4`) | **10.82:1** (dark); darken on light surfaces | Status accent (`color-mix` text on light) |
| `shadow` | `--vd3-color-shadow` | `#0000001a` | `#0000004d` | — | Ambient elevation ink |

*Status Accent Contrast & Legacy Alias Rule*: `info`, `success`, `warning`, and `critical` are semantic accent hues (`#0ab5b5`, `#0ac265`, `#fab005`, `#fa5252` in light mode — all below `4.5:1` on `#ffffff`). On light surfaces (`canvas` / `layer`), body text or badge labels using these roles MUST either darken via `color-mix(in srgb, var(--vd3-color-<status>) 38.2%, var(--vd3-color-text-primary))` ($\ge 6.1:1$ on 13% tinted surfaces, $\ge 6.6:1$ on `canvas`/`layer`) or pair with `text-primary` ink (`gray.1000`). In `tokens/tokens.css` §18, `--vd-color-warning` aliases `--vd3-color-warning`, whereas `--vd-color-info` and `--vd-color-success` remain unaliased in core so `@vanduo-oss/vd3` v1.9 Open Color semantics (`#228be6` / `#40c057`) do not collide.

## Modern CSS Color Architecture

VD3 progressive-enhancement color architecture aligns with CSS Color Level 4 & 5:
- **`color-scheme` Root Declaration**: `:root` declares `color-scheme: light dark;` so native scrollbars, form controls, and `light-dark()` adapt automatically to OS preference, while `[data-theme="light"]` and `[data-theme="dark"]` explicitly lock `color-scheme: light` or `color-scheme: dark`.
- **`light-dark()` Progressive Enhancement**: `tokens/tokens.css` pairs explicit sRGB fallbacks and `@media (prefers-color-scheme: dark)` with `@supports (color: light-dark(#fff, #000))` on `:root:not([data-theme])` for native two-mode resolution without overriding explicit `[data-theme]` attributes.
- **Wide-Gamut OKLCH / Display P3 Notes**: All normative sRGB hexes in `tokens/vd3.tokens.json` remain the authoritative WCAG-verified baseline (`TEST-T3-CMB-006`). Future wide-gamut golden-angle chroma expansions MUST gate `oklch(...)` values behind `@supports (color: oklch(0% 0 0))` and `@media (color-gamut: p3)` while preserving sRGB fallback contrast parity.

## Golden-Angle Algorithmic Palette (Feature #18)

For categorical data visualization, status badges, and multi-tenant tagging, VD3 implements an algorithmic palette placing hues at successive golden angle steps ($\psi \approx 137.507764^\circ$) around the 360° color wheel:

$$H_k = (H_0 + k \times 137.507764^\circ) \pmod{360^\circ}$$

Starting from the primary Amber baseline ($H_0 = 43^\circ$):

| Step $k$ | Calculated Hue $H_k$ | Color Family | Hex Value | Token Reference | Basis |
|---|---|---|---|---|---|
| 0 | $43.0^\circ$ | Gold / Amber baseline | `#fab005` | `color.primitive.golden-angle.0` | Class A |
| 1 | $180.5^\circ$ | Cyan / Aqua | `#0ab5b5` | `color.primitive.golden-angle.1` | Class A |
| 2 | $318.0^\circ$ | Magenta / Pink | `#f20d91` | `color.primitive.golden-angle.2` | Class A |
| 3 | $95.5^\circ$ | Lime Green | `#68c20a` | `color.primitive.golden-angle.3` | Class A |
| 4 | $233.0^\circ$ | Cobalt Blue | `#254ef0` | `color.primitive.golden-angle.4` | Class A |
| 5 | $10.5^\circ$ | Crimson Red | `#f22d0d` | `color.primitive.golden-angle.5` | Class A |
| 6 | $148.0^\circ$ | Emerald Teal | `#0ac265` | `color.primitive.golden-angle.6` | Class A |
| 7 | $285.5^\circ$ | Violet Purple | `#ba0df2` | `color.primitive.golden-angle.7` | Class A |

Because the golden angle is the most irrational fraction of a circle ($1 - 1/\phi$), successive hues achieve maximal perceptual dispersion without clustering, providing ideal color separation for data visualization charts and telemetry graphs.
