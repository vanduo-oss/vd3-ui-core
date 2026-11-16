# AGENTS.md — vd3-ui-core

You are working on the normative specification and W3C DTCG token source for the **vd3** design system (`v1.0.2-draft`, published at [core.vanduo.dev](https://core.vanduo.dev/)).
Before planning or writing code for this repository or any implementing `vd3` library, read:

1. `foundations/principles.md` — always (`PRN-001`…`PRN-010`)
2. `foundations/proportion.md` — the mathematical spine ($\phi$, $F_n$, $L_n$, and the Three-Class Basis Contract)
3. The `foundations/<topic>.md` page closest to your task (`color.md`, `typography.md`, `motion.md`, `elevation.md`, `layout.md`, `line.md`, `glass.md`, `focus.md`)
4. `components/<slug>/spec.md` and `components/SPEC.md` for every component you touch
5. `conventions/naming.md` before naming any token or CSS custom property

Normative behavior reference: **W3C ARIA Authoring Practices Guide (APG)**.
Normative token format: **W3C Design Tokens Community Group (DTCG) 2025.10**.
Consulted literature (cite, don't conform): IBM Carbon. Material 3 is excluded.

## Quickref — the 95% rules

### 1. Mathematical Identity & Three-Class Basis Contract
- Every visual constant (spacing, radius, line weight, shadow pair, type step, motion duration, container width) MUST carry an explicit basis class per `foundations/proportion.md`:
  - **Class A**: Derived from $\phi \approx 1.6180339887$, $\sqrt{\phi} \approx 1.2720196495$, Fibonacci ($F_n$), Lucas ($L_n$), or Golden Angle ($137.507764^\circ$).
  - **Class B**: Conventional-by-design (12-column grid, viewport breakpoints, z-index ladder) with a written rationale.
  - **Class C**: Registered sub-pixel or perceptual exception (`C-01` small spacing rem rounding, `C-02` glass blur soft-cap, `C-04` pill radius `9999rem`).
  - **No Class D**: An unclassified constant fails `pnpm test:tokens`.
- Golden split rows partition width into $61.8\%$ ($1/\phi$) and $38.2\%$ ($1/\phi^2$). Containers land on `521px` ($L_{13}$), `610px` ($F_{15}$), `987px` ($F_{16}$), `1364px` ($L_{15}$), and `1597px` ($F_{17}$).

### 2. Tokens & CSS Custom Properties
- Authoritative source: `tokens/vd3.tokens.json` (audited against `@vanduo-oss/vd3@1.9.0`; the `@1.9.1` delta changes primitive ramps only — 0 semantic/role token changes, see `docs/token-audit.md`).
- `tokens/tokens.css` exports both the normative `--vd3-*` variables and the backwards-compatible `--vd-*` aliases inside `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities;` (order enforced by e2e TEST-T1-STD-003).
- Components consume semantic role tokens only — never raw hex or pixel literals.
- Root theme/state hooks: `data-theme="light|dark"`, `data-font`, and `data-motion` are implemented by core's `tokens/tokens.css`. `data-palette="open-color|fibonacci"`, `data-primary`, `data-neutral`, and `data-radius` are driven by the implementing library's theme bridge (e.g. `@vanduo-oss/vd3` `useTheme`), not by core's token files.

### 3. Zero-Framework CSS Components & WAI-ARIA APG Contracts
- `components/` ships 14 zero-framework CSS modules — the layout engine (`layout.css`) plus 13 component primitives (`button`, `dialog`, `card`, `form` (input/select/checkbox/radio/textarea), `badge`/chip, `navbar`, `accordion`, `table`, `code`, `toast`, `switch`, `alert`, `tabs`) — aggregated in `components/index.css`; specs live in `components/SPEC.md` and `components/<slug>/spec.md`.
- `tokens/` and `components/` MUST remain 100% framework-agnostic (zero Vue/React/Svelte runtime references; enforced by `pnpm test:components`).
- Keyboard paths, focus order, and ARIA attributes MUST follow the cited W3C APG pattern.
- Focus rings (`FOC-001`…`FOC-004`, defined in `foundations/focus.md`, tokenized as `focus.ring.*` in `tokens/vd3.tokens.json`): `:focus-visible` outline thickness $\ge 2\text{px}$ (`--vd3-line-thin`), offset $\ge 2\text{px}$.
- Reduced motion (`MOB-001`): `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]` collapse spatial transforms and durations.

### 4. Documentation Site (`site/`) & Verification Gates
- `site/` is a Vue 3 + Vite workspace app that dogfoods `@vanduo-oss/vd3` (`VdNavbar`, `VdThemeSwitcher`, `VdThemeCustomizer`) and pre-renders static HTML into `site/dist/index.html` via `scripts/build-ssg.mjs`.
- Before committing any change, run `pnpm build && pnpm test`. All 6 verification commands MUST pass with zero errors:
  - `pnpm test:tokens` (`scripts/verify-tokens.mjs`)
  - `pnpm test:components` (`scripts/verify-components.mjs`)
  - `pnpm test:m2` (`tests/challenge-m2-interactive.mjs`)
  - `pnpm typecheck` (`scripts/verify-typecheck.mjs`)
  - `pnpm test:a11y` (`scripts/verify-a11y.mjs`)
  - `pnpm test:e2e` (`tests/e2e/runner.mjs`)

### 5. Figma Design System & MCP Integration
- Canonical Figma Design file: **"VD3 Design System — UI Core & Components (v1.0)"** (`fileKey: ae5AMiPoVXuHdaRfawhyjh`, [open in Figma](https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh)).
- Machine-readable Figma binding manifest: [`tokens/figma.manifest.json`](./tokens/figma.manifest.json) (served live at [core.vanduo.dev/tokens/figma.manifest.json](https://core.vanduo.dev/tokens/figma.manifest.json)).
- Generative plugin: **"VD3 Design System Builder & Token Sync"** (`id: 473bca03-b7e4-4a6f-9b5c-1a755a58af4b`, `version: 6d6824bf91a335c4313fcd249cdcea8d64dfd4d9`), launchable directly inside the file via [try-plugin URL](https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh?try-tool-resource-content-id=473bca03-b7e4-4a6f-9b5c-1a755a58af4b&try-tool-resource-type=gen_tool).
- Dual-mode variable collections aligned to DTCG tokens (`VD3 Color Primitives` with `Fibonacci` / `Open Color` modes, `VD3 Semantic Theme` with `Light` / `Dark` aliased modes, and `VD3 Scale & Proportions`) expose `WEB` code syntax `var(--vd-*)` and normative `--vd3-*` variable descriptions.
- Any UI Kit change or MCP design-to-code lookup MUST resolve semantic tokens through `tokens/figma.manifest.json` + `tokens/vd3.tokens.json` rather than hardcoding hex or pixel literals.
