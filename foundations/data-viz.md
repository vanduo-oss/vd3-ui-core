# Data Visualization — Boundary Note

Status: stable · Spec: 1.1.0-draft

## Scope boundary

Data visualization is **OUT of vd3-ui-core scope**. Core ships foundations,
tokens, and zero-framework component CSS only; it deliberately ships no chart,
graph, or flowchart component (PRN-004, PRN-009). The charting packages
**`@vanduo-oss/vd3-charts`** and **`@vanduo-oss/vd3-flowchart`** (same
`@vanduo-oss` org as `@vanduo-oss/vd3`) are the sanctioned consumers of this
spec. This mirrors the consulted literature: IBM Carbon keeps data-viz
guidance in the standard and ships `@carbon/charts` separately
(`docs/gap-analysis.md` §3).

This page is the normative bridge: the two packages MUST follow the rules
below. They consume `tokens/vd3.tokens.json` (DTCG 2025.10) as their single
source of truth and re-export the same `--vd3-*` custom properties.

## Normative rules for consuming packages

1. **Categorical series** MUST use `color.primitive.golden-angle.0` …
   `color.primitive.golden-angle.7` **in order**, then repeat from 0 (max 8
   distinct series before shape/pattern encoding is required). Hues are the
   golden-angle steps $H_k = (43 + k \times 137.508)^\circ \bmod 360^\circ$
   (`math.golden-angle` = 137.507764°, Class A; see `foundations/color.md`
   Feature #18). The packages map these primitives onto series roles
   (`--vd-chart-series-k`); end-user components still consume only
   `color.role.*`.
2. **Sequential and diverging scales** MUST use single-hue ramps from the
   primitive scales `color.primitive.gray.*`, `color.primitive.gold.*`,
   `color.primitive.red.*` — never multi-hue gradients. Diverging scales
   anchor on a neutral midpoint and diverge within one hue family toward the
   red ramp for the negative pole.
3. **Chart text** (titles, axis labels, legends, annotations) MUST use
   `color.role.text-primary` and `color.role.text-secondary` — never
   primitives — so dark theme (`theme.dark.color.role.*`) parity is
   automatic.
4. **Axes, gridlines, and tick marks** MUST use `line.hair` (1px) in
   `color.role.border`; emphasis axes may use `line.thin`. No heavier
   strokes for structural elements.
5. **Non-text contrast (WCAG 2.1/2.2 SC 1.4.11)**: every data mark (series
   stroke, bar, point, area edge) MUST have contrast ≥ 3:1 against its
   adjacent background (`color.role.canvas` / `color.role.layer`), and
   series MUST be distinguishable by more than hue alone (shape, pattern, or
   direct label) per WCAG 1.4.1.
6. **Motion** MUST follow MOB-001 (`foundations/motion.md`): all entrance,
   transition, and looping animation MUST collapse under both
   `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`;
   durations come from the `motion.*` Fibonacci ladder (`motion.233` base for
   chart transitions, `motion.610` for major re-layouts), easing from
   `easing.*`.
7. **Text sizing** in charts uses `type.size.xs` / `type.size.sm` minimum —
   never smaller — with `type.leading.snug` for labels.

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

`math.golden-angle` · `color.primitive.golden-angle.0…7` ·
`color.primitive.gray.0…9,1000` · `color.primitive.gold.4/6/7` ·
`color.primitive.red.4/6` · `color.role.canvas/layer/text-primary/text-secondary/border` ·
`theme.dark.color.role.*` (parity) · `line.hair/thin` · `type.size.xs/sm` ·
`type.leading.snug` · `motion.233/610`, `motion.0` (reduced motion) ·
`easing.out/in-out/linear`.

## Deviations & references

- Consulted: IBM Carbon data-visualization guidance + `@carbon/charts`
  (separate package — same separation adopted here). No APG pattern exists
  for charts; the accessibility contract is WCAG 2.1/2.2 SC 1.4.1 / 1.4.11 /
  2.3.3 plus ARIA `role="img"` + `aria-label`/`aria-describedby` on the chart
  container for a text alternative.
- Deviation from the core tier rule (`foundations/color.md`): the chart
  packages are the sanctioned mapping layer and MAY consume
  `color.primitive.*`; all other consumers MUST NOT.
