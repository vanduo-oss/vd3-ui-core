# vd3-ui-core

**Spec version:** 1.0.0-draft · **Status:** incepting

vd3-ui-core is the source of truth for the vd3 design system: first principles,
foundations, proportions, per-component contracts, and the normative design
tokens from which all vd3 libraries generate their CSS.

The spec itself contains **no component code** — it is what the code implements.
The one exception is `site/`: the spec site is a real app that dogfoods
`@vanduo-oss/vd3` (Vue 3 + Vite, pnpm workspace) and generates its content from
the markdown spec and `tokens/vd3.tokens.json` at build time.

## Repository roles (vanduo-oss)

| Repo | Role |
|---|---|
| `vd3-ui-core` (this repo) | Specification, normative tokens (DTCG), references |
| `vd3` | Vue 3 component library (`@vanduo-oss/vd3`) — implements this spec |
| future repos (tokens, charts, etc.) | Implement this spec; declare conformance |

## Conformance

Implementing libraries declare the spec they follow in `package.json`:

```json
"implements": "vd3-ui-core@^1.0"
```

CI in each library repo MUST verify: (1) generated CSS custom properties match
`tokens/vd3.tokens.json`, (2) component behavior matches the cited WAI-ARIA APG
patterns. Drift fails the build.

## What lives here

- `foundations/` — first principles and the proportional spine (why the system looks as it does)
- `tokens/` — normative token files in W3C DTCG format; single source of truth for values
- `components/` — one spec per component: anatomy, states, keyboard, focus, a11y
- `conventions/` — naming rules and cross-system translation tables
- `references.md` — normative standards vs consulted literature
- `site/` — the spec site (Vue 3 + Vite + `@vanduo-oss/vd3`); `pnpm dev` / `pnpm build` from the repo root

## How it changes

Spec changes go through PRs against this repo. Spec follows semver independently
of any library release: additive rules are minor, changed contracts are major.
Libraries then bump their `implements` field when they catch up.

## License

Documentation: CC BY 4.0. Token files (data): Apache-2.0.
"vd3" and the golden-ratio mark are Povilas's; do not imply IBM or W3C endorsement.
