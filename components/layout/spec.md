---
slug: layout
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
The CSS layout engine: centered containers on Lucas/Fibonacci max-widths,
golden-ratio splits, Fibonacci column grids, a conventional 12-column grid, gap
utilities, golden aspect-ratio utilities, and container-query contexts. Use for
page structure and section arrangement. NOT for: component chrome (use the
component modules) or tabular data (use table).

## Anatomy
Containers: `.vd-container` + `-sm` / `-md` / `-lg` / `-xl` / `-2xl` / `-fluid`.
Container-query context: `.vd-container-query` / `.vd-cq`
(`container-type: inline-size`, `container-name: vd-layout`). Golden splits:
`.vd-split-golden` / `.vd-layout-golden` (+ `-rev`), children `.vd-split-major`
/ `.vd-split-minor`, flex fallback `.vd-split-flex`. Fibonacci grids:
`.vd-grid-1/-2/-3/-5/-8` (aliases `.vd-grid-fib-*`), `.vd-grid-auto-fit`,
`.vd-grid-auto-fill` with `.vd-grid-min-89/-144/-233/-377/-610`. 12-column
engine: `.vd-grid-12` with `.vd-col-span-1…12` / `.vd-col-span-full`,
`.vd-col-offset-0…11`, responsive `.vd-col-span-{sm,md,lg,xl,2xl}-N`, stack
modifiers `.vd-grid-stack-md` / `.vd-grid-stack-sm`. Gap utilities:
`.vd-gap-fib-1…55` / `.vd-gap-N`. Aspect: `.vd-aspect-golden`,
`.vd-aspect-golden-portrait`. Cascade layer: `vd3.layout`.

## States
Rest / viewport states: grids and splits collapse at the `breakpoint.*`
thresholds (992 / 768 / 576px media queries; golden splits also stack inside
`@container (max-width: 768px)` when nested in a `.vd-cq`) / container inline
padding swaps `space.fib-21` → `space.fib-13` below `breakpoint.md` (768px).
No hover / focus / disabled states — layout is non-interactive; every sizing
value is a token.

## Props / API
Contract-level: two local custom properties tune grids — `--vd-grid-gap`
(gutter override, defaults to the `space.fib-*` step baked into each grid
class) and `--vd-grid-min-col` (auto-grid minimum column width, set by the
`.vd-grid-min-*` modifiers, default 233px). No JS API; layout is pure CSS in
the `vd3.layout` layer.

## Keyboard — NORMATIVE: no APG pattern (presentational CSS layout engine)
Layout primitives are non-interactive: no key bindings, no tab stops, no ARIA
roles. Behavioral contract: visual order MUST match DOM order (WCAG 2.1 SC 1.3.2)
— never reorder content visually (via `order` or grid placement) in a way that
breaks the meaningful sequence or the focus order.

| Key | Effect |
|---|---|
| (none) | No keyboard interaction; layout must not alter focus order |

## Focus
No focusable elements. Interactive children placed inside a grid or split keep
their own focus behavior; layout MUST NOT remove or weaken their focus
indicators (WCAG 2.1 SC 2.4.7).

## Accessibility requirements
- LAY-001 Containers are bounded by `container.*` (521 / 610 / 987 / 1364 / 1597px — Lucas and Fibonacci, class A) and centered with `margin-inline: auto`; all sizing uses logical properties (`inline-size`, `margin-inline`, `padding-inline`) so RTL layouts mirror correctly.
- LAY-002 Golden splits partition width into 61.8% / 38.2% (`math.inv-phi` / `math.inv-phi-sq`, implemented as `1.618fr` / `1fr` = `math.phi`) and MUST stack to a single column below `breakpoint.md` (768px) via both a media query and a container query.
- LAY-003 The 12-column grid (`.vd-grid-12`) is class B conventional-by-design (interoperability with external enterprise templates, per `foundations/layout.md`); spans, offsets, and per-breakpoint responsive spans follow `breakpoint.sm/md/lg/xl/2xl`; stack modifiers force `span 12` below 768px / 576px.
- LAY-004 `.vd-cq` / `.vd-container-query` establishes the `vd-layout` container context; children respond via `@container` queries, and authors MUST keep the media-query fallbacks for engines without container-query support.
- LAY-005 Aspect utilities (`aspect.golden` = 1.618/1, `aspect.golden-portrait` = 1/1.618) are for media and preview surfaces only — never apply them to text containers in a way that clips content (WCAG 1.3.1, 1.4.10 reflow).

## Tokens consumed
`container.sm`, `container.md`, `container.lg`, `container.xl`, `container.2xl`,
`breakpoint.sm`, `breakpoint.md`, `breakpoint.lg`, `breakpoint.xl`,
`breakpoint.2xl`, `space.fib-8`, `space.fib-13`, `space.fib-21`,
`aspect.golden`, `aspect.golden-portrait`, `math.phi`, `math.inv-phi`,
`math.inv-phi-sq`.

## Deviations & references
No APG pattern exists (this is a CSS layout engine, not a widget). Consulted:
Carbon Grid — adopts the conventional 12-column engine and breakpoint-driven
responsive spans as class B; deviates on gutters (Fibonacci `space.fib-*` instead
of Carbon's 2x-grid gaps) and on container widths (Lucas/Fibonacci `container.*`
instead of Carbon's breakpoint-only max widths). Media and container queries use
literal px values equal to `breakpoint.*` because CSS media queries cannot
consume `var()`.
