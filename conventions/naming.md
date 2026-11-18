# Naming conventions

Status: stable · Spec: 1.1.0-draft

## Core Normative Naming (`vd3-ui-core`)

- **Tokens** — semantic, kebab-case, no theme in the name (`--vd3-color-layer-hover`, never `--vd3-color-layer-hover-dark`; themes swap values under `theme.dark.*`, names stay constant).
- **Normative CSS Prefix (`--vd3-*`)** — all normative custom properties in `tokens/tokens.css` use the `--vd3-` prefix: `--vd3-⟨group⟩-⟨token⟩` (e.g., `--vd3-space-fib-8`, `--vd3-focus-ring-width`, `--vd3-icon-size-md`). Semantic color roles use `--vd3-color-⟨name⟩`.
- **Legacy Aliases (`--vd-*`)** — v1.9 custom properties (`--vd-bg-primary`, `--vd-text-primary`, `--vd-border-color`, `--vd-color-primary`, `--vd-color-error`, `--vd-space-fib-*`, etc.) are exported in `tokens/tokens.css` §18 as `var(--vd3-*)` aliases for backwards compatibility. Note: `focus.ring.*` and `density.*` are `--vd3-*`-only (no `--vd-focus-ring-*` or `--vd-density-*` aliases), and `--vd-color-info` / `--vd-color-success` are intentionally left unaliased in core §18 so `@vanduo-oss/vd3` v1.9 Open Color defaults do not collide with core's golden-angle status hues.
- **Internal Component Custom Properties (`--_vd-*`)** — private component-scoped refinements inside `components/*.css` use `--_vd-⟨component⟩-⟨role⟩` (e.g., `--_vd-alert-accent`, `--_vd-icon-size`).
- **Component CSS Classes** — framework-agnostic HTML/CSS BEM-like classes: `.vd-⟨component⟩`, `.vd-⟨component⟩--⟨modifier⟩`, and `.vd-⟨component⟩-⟨element⟩` (with legacy short aliases where registered in `components/*/spec.md`).
- **Requirement IDs** — `⟨SLUG⟩-⟨3-digit⟩`, assigned once, never reused.

### Normative DTCG-to-CSS Mapping Table

| DTCG Path | Normative CSS Var (`--vd3-*`) | Legacy Alias (`--vd-*`) |
|---|---|---|
| `math.phi` / `golden-angle` | `--vd3-phi` / `--vd3-golden-angle` | `--vd-phi` / `--vd-golden-angle` |
| `color.role.canvas` / `canvas-rgb` | `--vd3-color-canvas` / `--vd3-color-canvas-rgb` | `--vd-bg-primary` / — |
| `color.role.layer` / `layer-hover` | `--vd3-color-layer` / `--vd3-color-layer-hover` | `--vd-bg-secondary` / `--vd-bg-tertiary` |
| `color.role.text-primary` / `text-secondary` | `--vd3-color-text-primary` / `--vd3-color-text-secondary` | `--vd-text-primary` / `--vd-text-secondary`, `--vd-text-muted` |
| `color.role.border` / `border-subtle` | `--vd3-color-border` / `--vd3-color-border-subtle` | `--vd-border-color` / — |
| `color.role.focus` / `focus-glow` | `--vd3-color-focus` / `--vd3-color-focus-glow` | `--vd-color-primary` / — |
| `color.role.interactive` | `--vd3-color-interactive` | `--vd-color-primary-hover` |
| `color.role.critical` | `--vd3-color-critical` | `--vd-color-error`, `--vd-color-danger` |
| `color.role.info` / `success` / `warning` | `--vd3-color-info` / `--vd3-color-success` / `--vd3-color-warning` | — / — / `--vd-color-warning` |
| `color.role.shadow` | `--vd3-color-shadow` | — |
| `space.fib-N` / `spacing.px.N` | `--vd3-space-fib-N` / `--vd3-spacing-N` | `--vd-space-fib-N` / `--vd-spacing-N` |
| `line.*` / `border.width.*` | `--vd3-line-*` / `--vd3-border-width-*` | `--vd-line-*` / `--vd-border-width` (`hair`) |
| `focus.ring.*` | `--vd3-focus-ring-{width,offset,color,offset-color,glow}` | — (`--vd3-*` only) |
| `icon.*` | `--vd3-icon-{size-*,stroke-outline,color*,gap}` | `--vd-icon-{size-*,stroke-outline,color*,gap}` |
| `density.scale.*` / `density.multiplier` | `--vd3-density-scale-{comfortable,compact}` / `--vd3-density-scale` | — (`--vd3-*` only) |
| `radius.fib-N` / `radius.full` | `--vd3-radius-fib-N` / `--vd3-radius-full` | `--vd-radius-fib-N` / `--vd-radius-full` |
| `shadow.1..6` / `shadow.named.*` | `--vd3-shadow-1..6` / `--vd3-shadow-{sm,md,lg,xl,2xl}`, `--vd3-shadow` | `--vd-shadow-1..6` / `--vd-shadow-{sm,md,lg,xl,2xl}`, `--vd-shadow` |
| `glow.fib-{8,13,21}` | `--vd3-glow-fib-{8,13,21}` | `--vd-glow-fib-{8,13,21}` |
| `z.*` | `--vd3-z-*` | `--vd-z-*` |
| `container.*` / `breakpoint.*` | `--vd3-container-*` / `--vd3-breakpoint-*` | `--vd-container-*` / `--vd-breakpoint-*` |
| `font.family.{sans,serif,mono}` | `--vd3-font-family-{sans,serif,mono}` | `--vd-font-family-{sans,mono}` (runtime hook) |
| `type.size.*` / `type.size.*-static` | `--vd3-font-size-*` / `--vd3-font-size-*-static` | `--vd-font-size-*` / — |
| `type.leading.*` | `--vd3-line-height-*` | `--vd-line-height-*`, `--vd-leading-*` |
| `type.tracking.*` | `--vd3-tracking-*` | `--vd-letter-spacing-*` |
| `motion.*` / `easing.*` | `--vd3-duration-*` / `--vd3-ease-*` | `--vd-duration-*` / `--vd-ease-*` |
| `aspect.*` / `glass.*` | `--vd3-aspect-*` / `--vd3-glass-*` | — (`--vd3-*` only) |

### Root State Attributes

- **Core-implemented hooks (`tokens/tokens.css`)**: `data-theme="light|dark"`, `data-font`, `data-motion="reduce"`, `data-density="compact"`.
- **Implementing-library theme bridge hooks (e.g., `@vanduo-oss/vd3` `useTheme`, NOT defined in `tokens/tokens.css`)**: `data-palette="open-color|fibonacci"`, `data-primary`, `data-neutral`, `data-radius`.

## Implementing Libraries & Documentation Site (Non-Core)

Per `PRN-004` (`foundations/principles.md`), `vd3-ui-core` is 100% framework-agnostic. The conventions below govern downstream implementing libraries (such as `@vanduo-oss/vd3`) and the `site/` documentation app:

- **Components** — Vue SFC, PascalCase, one word where possible (`Dialog.vue`, `DatePicker.vue`), or prefixed (`VdNavbar`, `VdThemeSwitcher`).
- **Composables** — `use⟨Feature⟩`, one composable per interaction; composables are the behavior contract, markup is the presentation.
- **Props** — camelCase in script, kebab-case in templates; boolean props named for their effect, not their absence (`disabled`, not `not-enabled`).
- **Events** — past tense or state verb (`closed`, `change`) — pick per family and stay consistent.
