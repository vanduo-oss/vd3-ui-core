# Color — semantic role model

Status: stable · Spec: 2.0.0-draft

## Three tiers

1. **Primitive palette** — raw scales (hue/lightness ramps). Never used directly
   by components.
2. **Semantic roles** — what a color *means*: `--vd-layer`, `--vd-text-primary`,
   `--vd-text-secondary`, `--vd-border`, `--vd-focus`, `--vd-interactive`,
   `--vd-critical`… Components consume ONLY these.
3. **Component tokens** — role refinements scoped to one component
   (`--vd-btn-layer-hover`), defined as references to tier 2.

## Themes

- Themes: `light` / `dark` / `system`, switched by the `data-theme` attribute on
  the root element (v1.9 hook, kept verbatim).
- Re-theming MUST complete in the same frame (no flash, no transition on switch).
- The user's preference persists; `system` tracks `prefers-color-scheme`.
- Every semantic role MUST be defined in every theme. A role that is undefined in
  dark mode is a build error, not a runtime fallback.
- Token layout in `tokens/vd3.tokens.json`: `color.role` holds the default
  (light) values; `theme.dark.color.role` MUST define every role. Generated CSS
  emits `[data-theme="dark"]` overrides — custom-property names never carry
  the theme.

## Live theming

Primary hue, neutrals, radius, and font are runtime-changeable theme variables.
They feed semantic roles; components MUST NOT cache resolved values.

## Contrast

Semantic roles MUST meet WCAG AA in every theme at every type size they are used
with. Role pairs (text-on-layer) are audited as pairs, not as isolated colors.

## Data visualization (vd3-charts)

The chart color contract is defined for **both palette engines** (Q7 decision):
the active engine supplies the hues; the contract fixes the *structure*.

- **Categorical series** — hues at successive golden-angle steps (137.5°) within
  the active engine, so series are perceptually spread by construction.
- **Sequential ramps** — a golden-ratio lightness ramp of a single hue.
- **Diverging ramps** — two hues offset from a neutral midpoint by ± the golden
  angle.
- Every chart pair (series-on-canvas, label-on-series) MUST meet WCAG AA
  (4.5:1 for text, 3:1 for graphical objects) in every theme; audited as pairs,
  like semantic roles. Exact swatch values are normative in the charts package
  spec, pending the v2 audit.
