# vd3-ui-core — Research Brief

## Question

What must the **vd3-ui-core** spec repo cover for vd3 to be a comprehensive design system — given (a) what vd3 v1.9 already implements, (b) IBM Carbon as the coverage benchmark, (c) the doctrine *Fibonacci/φ-first, but pragmatic where familiarity beats math*, and (d) the requirement for clearly defined core principles? Scope includes everything proportional: border weights, glass, typography, shadows, color palette, grid, motion.

---

## Executive Summary

1. **vd3 already lives the doctrine — the core repo's job is codification, not invention.** The site already carries an honesty table ("Fibonacci/φ-first in its design language, and pragmatically conventional where familiarity beats math. We'd rather be honest than dogmatic"), a soft-capped glass blur, and a standard-vs-Fibonacci grid toggle. vd3-ui-core should formalize this as a binding **three-class proportional contract**, not create a new aesthetic. ([vd3 golden ratio page](https://vd3.vanduo.dev/core/golden-ratio))

2. **Coverage vs. Carbon is stronger than expected, with specific gaps.** vd3 covers color, grid, typography, motion, elevation/shadows, icons, theming, and accessibility — plus glass, decorative surfaces, glow and effects that Carbon deliberately lacks. Gaps worth closing in core: **border-weight tokens, z-index scale, focus-ring spec, density modes, content/writing guidelines, and data-visualization color rules** for the charts package. ([Carbon foundations](https://carbondesignsystem.com/llms.txt))

3. **The v1.9 docs already prove why a spec repo is needed: they contradict themselves.** The honesty table still labels transition timings "conventional" while v1.9 ships a full Fibonacci duration ladder (55–987ms); two parallel spacing scales coexist; small spacing steps don't match their names. A single normative source eliminates this class of bug. ([vd3 motion](https://vd3.vanduo.dev/core/motion), [vd3 fibonacci guide](https://vd3.vanduo.dev/guides/fibonacci))

4. **The pragmatic stance is the defensible one, and the literature agrees.** NN/g treats φ as a useful tool, not a magic number; the design-writing consensus is "one good proportional system among several"; practitioner critiques warn against dogmatic fibo-everything. vd3's existing honesty table is the correct answer to "we don't want to be forced fibo freaks." ([NN/g](https://www.nngroup.com/articles/golden-ratio-ui-design/), [Digital Polo](https://www.digitalpolo.com/golden-ratio-in-design/))

5. **Carbon is a coverage map, not a conformance target.** Carbon's own philosophy (2x grid: divide/multiply by two; two-value radius: 0 or 100px; square corners) is *anti-Fibonacci* — adopting its structure while keeping vd3's spine is the right relationship. Carbon also ranks #1 of 37 systems for agent-readiness, which validates using it as the completeness benchmark. ([Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/), [DesignSystems.one](https://www.designsystems.one/design-systems/carbon-design))

6. **Every constant class the user listed already has a workable Fibonacci rule** — including line weights (1/2/3/5px), glass (Fibonacci strength steps 1–89 with a documented blur soft-cap), motion (55–987ms ladder), shadows (offset/blur Fibonacci pairs), and color (137.5° golden-angle palette + golden-ratio lightness ramp). The core repo needs to write these down as normative tables with an exceptions registry.

---

## Methodology

**Sources inspected:** the vd3 documentation site (homepage, sitemap listing 95 URLs, seven foundation/guide pages read in full or near-full: golden-ratio, motion, color-palette, grid-system, typography, shadows-glow, glass, css-variables, fibonacci guide); Carbon's public documentation (foundations list via `llms.txt`, developing overview, 2x-grid page — the main site blocks automated full-page reads, so snippets were used); design literature on golden-ratio pragmatism (NN/g, A List Apart, practitioner essays, community critique).

**Limitations:** vd3's actual source code (repo internals, token CSS files) was not audited — findings rest on the shipped docs, which may lag the code (that lag is itself a finding). Contrast ratios on color pages were not independently recomputed. Component-level behavior was inventoried by sitemap, not per-page review. Carbon's component catalog was taken from its own docs index rather than an exhaustive per-component read.

---

## Findings

### F1 — What vd3 v1.9 already has

Scale: **66 components, 41 composables** in one package (`@vanduo-oss/vd3` v1.9.0, MIT, zero runtime deps, Vue 3.3+, SSR-safe), plus `vd3-charts` (6 accessible SVG chart types) and `vd3-flowchart` (diagram editor), Phosphor icons across 6 weights, 57 component reference pages, ~24 guide pages. ([vd3 homepage](https://vd3.vanduo.dev/))

Foundations already documented with working systems:

| Area | What exists |
|---|---|
| Spacing | `--vd-space-fib-*` rem scale + helper `--vd-spacing-*` px scale (see F3: duplication) |
| Type | 10 steps, √φ ≈ 1.272 steps (two steps = φ), fluid `clamp()` from augmented-fourth (1.414) mobile to φ desktop; φ-derived line-heights 1.236 (2/φ), 1.382, 1.5, 1.618; 6 tracking tokens; 6 runtime-switchable families ([typography](https://vd3.vanduo.dev/core/typography)) |
| Motion | Fibonacci duration ladder 55/89/144/233/377/610/987ms with named tokens and per-tier usage guidance; golden cubic-bezier easings; adaptive `<VdExpandTransition>`; ~2.5KB WAAPI; `data-motion="reduce\|off"` ([motion](https://vd3.vanduo.dev/core/motion)) |
| Color | Dual palette engine: Open Color default + Fibonacci golden-angle (137.5°) palette with golden-ratio lightness ramps; 13 primary hues, 5 neutral scales; three token tiers (palette → semantic → component); WCAG-rated steps; runtime `data-theme`/`data-primary`/`data-palette` switching with zero flash ([color palette](https://vd3.vanduo.dev/core/color-palette), [css variables](https://vd3.vanduo.dev/guides/css-variables)) |
| Grid | 12-column flexbox + opt-in golden layouts (`.vd-grid-golden` 1:1.618, `.vd-row-fib-3` 2:3:5, golden split 38.2/61.8); 6 breakpoints; containers 521/610/987px ([grid system](https://vd3.vanduo.dev/core/grid-system)) |
| Shadows/glow | Elevation ladder with Fibonacci offset/blur pairs 1/2 → 21/34; glow utilities with intensity variants ([shadows & glow](https://vd3.vanduo.dev/core/shadows-glow)) |
| Glass | "Seemore Glass": Fibonacci strength steps 1→89; blur soft-capped ~20px for UI, tint/edge/elevation carry the rest — a documented physics-driven deviation ([glass](https://vd3.vanduo.dev/effects/glass)) |
| Surfaces | Six decorative backdrops (Mesh, Stripe, Noise, Aurora, Dots, Grid) with Fibonacci intensity steps 3/5/8 |

**Implication:** the core repo is not a green-field design exercise; it is a *normative rewrite of a system that already works*, plus gap-closing.

### F2 — The proportional doctrine as actually implemented

Every visual constant in vd3 today, and its mathematical basis:

| Constant class | Basis | Notes |
|---|---|---|
| Spacing scale | Fibonacci px/rem | Small steps are rounded (see F3) |
| Radius | Fibonacci | `--vd-radius-fib-*` tokens exist |
| Shadows/elevation | Fibonacci pairs | 1/2, 2/3, 3/5, 8/13, 13/21, 21/34 |
| Type scale | √φ steps | 16 → 26 → 42 → 68 px at two-step multiples of φ |
| Line-heights | φ-derived | 1.236 = 2/φ; 1.618 = φ |
| Motion durations | Fibonacci ms | 55…987 |
| Containers | Fibonacci **and Lucas** | 521 = L₁₃, 610 = F₁₅, 987 = F₁₆, 1597 = F₁₇ — both sequences converge to φ |
| Golden layouts | φ | 1:1.618 splits, 2:3:5 columns, 38.2/61.8 |
| Fibonacci palette | Golden angle | Hues at 137.5° steps; golden-ratio lightness ramps |
| Glass steps | Fibonacci 1–89 | Blur deviates above step 13 (soft-cap) |
| Default grid | Conventional | 12 equal columns; golden grids are one class away |
| Breakpoints | Conventional | 576/768/992/1200/1400 — familiar values |
| z-index | Conventional | Standard increments (per honesty table) |

Two structural insights for the core spec:

- **The Lucas numbers are already citizens** (containers 521, 843, 1364 would continue the family). Both Fibonacci and Lucas converge to φ at the same rate — the doctrine should say "**any sequence whose neighbor-ratio converges to φ**" rather than "Fibonacci only."
- **The glass blur soft-cap is a pattern, not an anomaly**: where physics, performance, or platform limits cap a value (blur beyond ~20px wastes GPU for no perceptual gain), vd3 already documents the cap and lets other properties (tint, edge, elevation) continue the progression. This deserves a named rule in core — call it the **convergence zone**.

### F3 — Contradictions and gaps found (the v2 spec worklist)

1. **Honesty table is stale.** It labels transition timings "conventional," but v1.9 ships a seven-step Fibonacci duration ladder with named tokens. ([golden ratio](https://vd3.vanduo.dev/core/golden-ratio) vs [motion](https://vd3.vanduo.dev/core/motion))
2. **Small spacing steps don't match their names.** `--vd-space-fib-2` = 4px, `-3` = 6px, `-5` = 8px, `-8` = 12px — the scale only becomes literal from 13 onward. Either correct the values or codify the fudge (e.g., "steps ≤8px are the rem-rounded working scale; the sequence is literal from 13px"). The docs currently show both 1/2/3/5/8 px conceptual scales and the rounded token values without reconciling them. ([fibonacci guide](https://vd3.vanduo.dev/guides/fibonacci))
3. **Two parallel spacing systems.** Helper utilities use `--vd-spacing-*` (px) while primitives use `--vd-space-fib-*` (rem). Core must declare one normative scale and map the other to it.
4. **Glow blur intensities are arithmetic** (10/20/30px), not Fibonacci — a candidate for remapping to fib values (8/13/21) or for the exceptions registry.
5. **No border/line-weight token system.** Borders appear across components (`--vd-border-color` exists; widths don't as a scale). Carbon formalizes this; vd3 has the gap. Natural fib rule: 1/2/3/5px (`hairline`, `thin`, `regular`, `thick`).
6. **No z-index scale.** Declared "conventional" — but "conventional" should still be a named, tokened ladder in core so stacking is predictable.
7. **No focus-ring spec.** Focus colors exist per-theme; the ring geometry (width, offset) isn't a documented token.
8. **No density modes.** Carbon ships productive/expressive type pairings; vd3 has scale + registers but no density contract.
9. **No content/writing guidelines.** Carbon has voice-and-tone/content guidance; vd3 has none — real for a component library mostly at the level of built-in copy (validation messages, empty states, a11y announcements).
10. **No data-visualization color contract.** The charts package exists but the palette for categorical series, sequential ramps, and accessible chart colors isn't in the foundations.

### F4 — The evidence for "Fibonacci-first, not Fibonacci-fanatic"

The design literature supports exactly the stance vd3 already takes:

- NN/g: the golden ratio is a legitimate tool for layout and typography decisions, but it is not a magic number that guarantees good design — line-length and leading research (University of Reading 2004, cited by NN/g) matters more than ratio worship for readability. ([NN/g](https://www.nngroup.com/articles/golden-ratio-ui-design/))
- Tim Brown's modular-scale work (A List Apart): the point of a proportional scale is *conscious, consistent* measurements, not the specific ratio; φ is one good choice among several. ([A List Apart](https://alistapart.com/article/more-meaningful-typography/))
- Practitioner consensus: φ is "useful for typography scales, layout proportions, and construction grids, but its influence on famous design is often overstated"; treat it as one proportional system alongside simple ratios (1:2, 2:3, 3:5) and other modular scales. ([Digital Polo](https://www.digitalpolo.com/golden-ratio-in-design/), [Made Good](https://madegooddesigns.com/golden-ratio-design/))
- The countervailing caution exists too: golden-ratio UI kits get called out when the math is marketing rather than substance — which is precisely why vd3's *honesty table* (publishing where φ is NOT used) is a differentiator, not an apology. ([Hacker News discussion of LiftKit](https://news.ycombinator.com/item?id=46952118))
- vd3's own grid page already gives the pragmatic usage rule: standard 12-column for forms/dashboards/data tables; golden/Fibonacci for editorial, hero, and marketing layouts. Both modes ship, one class apart. ([grid system](https://vd3.vanduo.dev/core/grid-system))

**The doctrine, stated as three classes:**

1. **φ-derived (class A)** — the default. Every constant starts as Fibonacci/Lucas/φ math.
2. **Conventional-by-design (class B)** — where platform familiarity wins (breakpoints, default 12-col grid, z-index increments), vd3 *chooses* convention deliberately and documents the choice.
3. **Sanctioned exception (class C)** — where physics/perf/a11y overrides math (glass blur soft-cap; WCAG-mandated values; rem rounding at small sizes). Exceptions MUST be registered, named, and re-reviewed at each major version.

### F5 — Carbon as the coverage map

Carbon's foundations: 2x grid, accessibility, color, icons, motion, spacing, themes, typography (plus pictograms and per-component usage guidance; theming across White/Gray10/Gray90/Gray100). ([Carbon llms.txt](https://carbondesignsystem.com/llms.txt), [Carbon developing overview](https://www.carbondesignsystem.com/getting-started/developing/overview))

Coverage check against vd3:

| Carbon area | vd3 status | Action for core |
|---|---|---|
| Grid (2x, 16-col) | Covered differently (12-col + golden modes) | Write both modes as normative; keep 12-col as class B |
| Color + tokens | Covered + richer (dual palette, golden-angle) | Formalize three tiers; add contrast pair audit |
| Typography | Covered (φ scale) | Add density registers decision |
| Motion | Covered (Fibonacci ladder) | Keep; sync honesty table |
| Spacing | Covered, but split scales | Unify to one normative scale |
| Accessibility | Covered (WCAG AA posture) | Map every component to APG; contrast pair rules |
| Themes | Covered (light/dark/system + runtime) | Normative theme token matrix |
| Icons | Covered (Phosphor) | Sizing token table (fib 13/21/34?) |
| Corner radius | Covered (fib radius) vs Carbon's 2-value doctrine | Keep vd3's; document as deliberate divergence |
| Elevation/layers | Covered (shadow ladder + glass) | Add stacking-context/z-index policy |
| Line weights | **Missing** | Add fib border-weight tokens |
| Content guidelines | **Missing** | Minimal writing rules for built-in copy |
| Data-viz guidelines | **Missing (charts package exists)** | Categorical/sequential chart color contract |
| Pictograms | N/A (icons suffice for vd3's domain) | Skip unless needed |

Note the philosophical inversion: Carbon's most recognizable traits — square corners, divide-by-two 2x grid — are exactly where vd3 diverges. That is fine: the lesson from Carbon is *completeness of contract*, not its values. Carbon ranks #1 of 37 design systems for AI-agent readiness, which is the property worth emulating. ([DesignSystems.one](https://www.designsystems.one/design-systems/carbon-design))

### F6 — Core principles for vd3-ui-core (proposal)

Grounded in what v1.9 already does, tightened into axioms:

1. **PRN-1 · Proportion by default, convention by decision.** Every visual constant is class A (φ-derived) unless it is explicitly class B (conventional-by-design) or class C (registered exception). There is no class D.
2. **PRN-2 · Convergence, not dogma.** Any sequence converging to φ is lawful (Fibonacci, Lucas). Where physics, performance, or accessibility caps a value, the constant enters the convergence zone: cap it, document it, let sibling properties continue the progression.
3. **PRN-3 · Familiarity beats math at platform seams.** Breakpoints, default grids, z-index, and file-size/HTTP conventions follow the ecosystem where deviation buys nothing. Choosing convention is a design decision with a written reason — never a default.
4. **PRN-4 · One spine, three tiers.** Palette → semantic → component tokens, all `--vd-*`; one normative scale per dimension; duplicates must be aliases.
5. **PRN-5 · Behavior is W3C-standard.** APG is normative for keyboard/focus/ARIA; WCAG AA is the floor, verified per theme and per role-pair.
6. **PRN-6 · Runtime economy is part of the aesthetic.** Zero runtime deps, ~2.5KB motion engine, tree-shakeable, SSR-safe; heavy engines (GSAP/anime) are user-optional and must never be required by a core component.
7. **PRN-7 · Honesty is a feature.** Every spec table carries a *basis* column (A/B/C). Publishing where φ is not used is a differentiator; silent drift is a spec bug.
8. **PRN-8 · Specs precede code.** A decision not in vd3-ui-core is not a decision; code is the *implementation of* core, and CI proves it (token parity + behavior conformance).

### F7 — Required foundation documents for vd3-ui-core

Derived from the gap analysis; each doc must ship with normative tables, not prose:

1. `foundations/proportion.md` — the A/B/C contract, φ/Lucas/Fibonacci math, convergence-zone rule, exceptions registry (seeded: glass blur cap, rem-rounded small spacing, glow blur if kept).
2. `foundations/spacing.md` — ONE scale; small-step rule resolved; utility/primitive scales reconciled.
3. `foundations/line.md` — border-weight tokens (fib 1/2/3/5), rules for hairlines in dark mode, decorative vs structural lines.
4. `foundations/color.md` — dual-palette engine, three tiers, contrast pair matrix, data-viz color contract (extend to charts package).
5. `foundations/typography.md` — √φ scale, fluid clamps, line-heights, tracking, density registers.
6. `foundations/motion.md` — duration ladder with per-tier usage, golden easings, adaptive transition, reduced-motion law.
7. `foundations/elevation.md` — shadow pairs, glass steps (with soft-cap), surfaces intensity, z-index ladder.
8. `foundations/grid.md` — 12-col engine, golden modes, breakpoints (class B), containers (Fib/Lucas with the math stated).
9. `foundations/focus.md` — ring geometry tokens, focus-visible policy.
10. `foundations/icons.md` — Phosphor weights, sizing steps, do/don't.
11. `conventions/content.md` — writing rules for built-in strings (validation, empty states, aria-labels).
12. `components/*.md` — 66 specs over time; prioritize interactive widgets (dialog, menu, combobox/autocomplete, tabs, tree) first.

---

## Source Notes

| Source | Credibility | Last updated |
|---|---|---|
| [vd3 UI — homepage](https://vd3.vanduo.dev/) | 5/5 | 2026-11-11 |
| [vd3 — Golden Ratio page](https://vd3.vanduo.dev/core/golden-ratio) | 5/5 | 2026-11-11 |
| [vd3 — Motion](https://vd3.vanduo.dev/core/motion) | 5/5 | 2026-11-11 |
| [vd3 — Color Palette](https://vd3.vanduo.dev/core/color-palette) | 5/5 | 2026-11-11 |
| [vd3 — Grid System](https://vd3.vanduo.dev/core/grid-system) | 5/5 | 2026-11-11 |
| [vd3 — Typography](https://vd3.vanduo.dev/core/typography) | 5/5 | 2026-11-11 |
| [vd3 — Shadows & Glow](https://vd3.vanduo.dev/core/shadows-glow) | 5/5 | 2026-11-11 |
| [vd3 — Seemore Glass](https://vd3.vanduo.dev/effects/glass) | 5/5 | 2026-11-11 |
| [vd3 — CSS variables guide](https://vd3.vanduo.dev/guides/css-variables) | 5/5 | 2026-11-11 |
| [vd3 — Fibonacci scale guide](https://vd3.vanduo.dev/guides/fibonacci) | 5/5 | 2026-11-11 |
| [vd3 — sitemap.xml](https://vd3.vanduo.dev/sitemap.xml) | 5/5 | 2026-11-11 |
| [Carbon Design System — llms.txt foundations index](https://carbondesignsystem.com/llms.txt) | 4/5 | - |
| [Carbon — Developing overview](https://www.carbondesignsystem.com/getting-started/developing/overview) | 4/5 | - |
| [Carbon — 2x Grid overview](https://carbondesignsystem.com/elements/2x-grid/overview/) | 4/5 | - |
| [DesignSystems.one — IBM Carbon breakdown](https://www.designsystems.one/design-systems/carbon-design) | 3/5 | - |
| [NN/g — The Golden Ratio and User-Interface Design](https://www.nngroup.com/articles/golden-ratio-ui-design/) | 5/5 | - |
| [A List Apart — More Meaningful Typography (Tim Brown)](https://alistapart.com/article/more-meaningful-typography/) | 4/5 | - |
| [Digital Polo — The Golden Ratio in Design](https://www.digitalpolo.com/golden-ratio-in-design/) | 3/5 | - |
| [Made Good — The Golden Ratio in Design](https://madegooddesigns.com/golden-ratio-design/) | 3/5 | - |
| [8th Light — Designing Irrationally](https://8thlight.com/insights/designing-irrationally) | 3/5 | - |
| [Hacker News — LiftKit golden-ratio discussion](https://news.ycombinator.com/item?id=46952118) | 2/5 | - |

**Caveats:** vd3 source code was not audited — the spacing/type token values reported come from shipped docs and may differ from the package. Carbon's main site blocks full automated reads; its foundation list was taken from its own `llms.txt` index and search snippets. The two parallel spacing scales and the rounded small steps are doc-level findings and need confirmation against `tokens.css` before writing the normative tables.

---

## Open Questions

1. **Small-step fudge: fix or codify?** Are `--vd-space-fib-2` = 4px etc. intentional working-scale rounding or drift? Needs the real `tokens.css` before the spec can rule. (Recommendation: codify — 4/6/8/12 are what people ship; the sequence becomes literal at ≥13.)
2. **Glow blur intensities** — remap 10/20/30px to Fibonacci (8/13/21) or register as exception?
3. **Z-index policy** — keep conventional increments (class B) or tokenize a Fibonacci stacking ladder (55/89/144/233…)?
4. **Density registers** — does vd3 want Carbon-style productive/expressive modes, or is the fluid type scale + glass/surface register system sufficient?
5. **Lucas numbers' status** — coequal φ-convergent citizens (containers already use L₁₃ = 521) or Fib-only doctrine?
6. **DTCG export** — should the normative token JSON adopt current `--vd-*` names verbatim, or use v2 as the moment for semantic renames?
7. **Charts color contract** — derived from the Fibonacci palette alone, or defined for both palette engines?

## Recommendations / Next Steps

1. **Adopt the three-class proportional contract (A/B/C) + exceptions registry as the philosophical core** of vd3-ui-core — it already describes vd3's practice; codify it before any other spec work.
2. **Migrate the honesty table into core as the normative "basis" table** and fix its stale rows (motion is class A now) — this is the first concrete proof of the spec repo's value.
3. **Run the v2 token audit** against the real `tokens.css` and resolve the open questions above (especially spacing unification and small steps) before writing normative tables.
4. **Close the six Carbon-coverage gaps in core**: line weights, z-index, focus ring, density decision, content guidelines, data-viz colors.
5. **Write the 12 foundation docs (F7) with tables, requirement IDs, and status headers**; seed the exceptions registry with the three known exceptions (glass cap, rounded small steps, glow blur — pending Q2).
6. **Spec the top interactive components first** (dialog, menu, autocomplete, tabs, tree) against APG, then batch the rest.
7. **Ship CI conformance from day one**: DTCG token parity in every library repo, behavior specs as testable requirements.
8. **Keep Carbon as the checklist, not the compass**: each foundation doc gets a short "Carbon says / vd3 does / why" note where the systems differ — it teaches agents the reasoning, which is the real product of a design bible.
