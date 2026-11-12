# AGENTS.md — vd3-ui-core

You are working on a design system whose contract lives in this repo.
Before planning or writing any code for a vd3 library, read:

1. `foundations/principles.md` — always
2. The `foundations/` page closest to your task (proportion, color, …)
3. The `components/<slug>/spec.md` for every component you touch
4. `conventions/naming.md` before naming anything

Normative behavior reference: **W3C ARIA Authoring Practices Guide (APG)**.
Consulted literature (cite, don't conform): IBM Carbon. Material is not a reference.

## Quickref — the 95% rules

### Identity
- Every visual constant (spacing, radius, shadow, type step, container width) MUST carry a basis class per `foundations/proportion.md`: A = φ/Fibonacci/Lucas-derived (default), B = conventional-by-design (written reason required), C = registered exception. No class D — an undocumented constant is a spec bug.
- The golden-ratio spine is vd3's identity; never "fix" it toward a mainstream system's look.
- Golden rows split 1:1.618. Containers land on 521 / 610 / 987 / 1597px (L₁₃, F₁₅, F₁₆, F₁₇).

### Tokens
- Components consume SEMANTIC tokens only (`--vd-layer`, `--vd-text-primary`…) — never raw hex or px literals.
- CSS custom properties are prefixed `--vd-` (the v1.9 prefix, kept verbatim for backwards compatibility); theme/state attributes are the v1.9 hooks `data-theme` / `data-primary` / `data-palette` / `data-motion` on the root element.
- The normative token source is `tokens/vd3.tokens.json` (DTCG). Generated CSS MUST match it.
- Themes: `light` / `dark` / `system`; re-theming MUST happen in the same frame; user preference persists.

### Behavior & accessibility (normative: APG)
- Keyboard paths, focus order, and ARIA follow the cited APG pattern for the component — deviations require a written justification in the spec.
- Every interactive element MUST have a visible focus state and a keyboard path.
- `prefers-reduced-motion` MUST disable non-essential motion.

### Vue engineering
- Vue 3.3+ `<script setup>` with types. No state library, zero runtime dependencies.
- SSR-safe, tree-shakeable: ship what gets imported.
- Every interaction is a composable (`use…`) behind markup.
- `site/` is the exception that proves the rule: a pnpm workspace app (root
  `package.json` + `site/`) that builds this spec site with
  `@vanduo-oss/vd3` itself — `VdNavbar variant="glass"`, `useThemePreference()` /
  `VdThemeSwitcher`, vd3 font tokens. Its page content is generated from the
  markdown spec (`?raw` imports) and `tokens/vd3.tokens.json`; never hand-edit
  generated output.

### Specs
- RFC 2119: MUST / SHOULD / MAY are contract language; treat them as test requirements.
- Requirement IDs are stable (`DLG-003`); cite them from code comments, tests, and docs.
- Status headers (`stable | experimental | deprecated`) are binding; never implement against `experimental` specs in release code.

### Process
- Found a decision this repo doesn't cover? Write the decision in the spec PR — don't decide silently in code.
- Cite consulted literature as: "Adopt X per Carbon ⟨section⟩; deviate on Y because ⟨golden-ratio reason⟩."
