# Layout Primitives Mapping (core ↔ library)

Status: stable · Spec: 1.1.0-draft

The **normative** layout system in this repo is the `components/layout.css`
engine: containers (`.vd-container*`), Fibonacci/12-column grids
(`.vd-grid-*`, `.vd-col-*`), golden splits (`.vd-split-golden*`,
`.vd-layout-golden*`), aspect utilities (`.vd-aspect-golden*`), gap utilities
(`.vd-gap-*`), and container queries (`.vd-cq`).

The implementing library (`@vanduo-oss/vd3`) additionally ships seven
flex-utility primitives that have **no core counterpart** and are declared
library-level extensions (see `components/SPEC.md` → "Out-of-standard"):

| vd3 primitive | Closest core engine | Decision |
|---|---|---|
| `VdBox` (`pad`/`bg`/`round`/`border` attrs) | `.vd-container*` + space/radius tokens | library-level utility; do not port |
| `VdStack` (flex column, `gap`) | `.vd-gap-*` on any block/flex parent | library-level utility |
| `VdInline` (flex row, wrap) | `.vd-grid-auto-fit` / flex + `.vd-gap-*` | library-level utility |
| `VdCenter` (`max` + axis) | `.vd-container-md` + `margin-inline: auto` | library-level utility |
| `VdCover` (min + gap) | `.vd-split-*` | library-level utility |
| `VdFrame` (`ratio`) | `.vd-aspect-golden` / `.vd-aspect-golden-portrait` | analogous; core is normative |
| `VdSwitcher` (`threshold`) | `.vd-grid-auto-fit` / `.vd-grid-auto-fill` | analogous; core is normative |

Rule: new layout needs go into the core engine (`layout.css`) with tokens and
verification; the vd3 primitives stay thin conveniences over it. The two
systems must never define competing grid/container semantics.
