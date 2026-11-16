# Contributing to vd3-ui-core

## Branch and remote actions

Start a `dev` branch from freshly fetched `origin/main` (this repo's working
branch is `dev`). Keep work and commits local until local QA is green. Push,
PR, merge, publish, and deploy require explicit authorization. Do not edit
`main`.

## Setup

Requires **Node 26** and **pnpm 10** (`mise.toml` pins both).

```sh
pnpm install
```

## Gates — run before every commit

```sh
pnpm build   # site build + SSG pre-render + token sync into site/public and site/dist
pnpm test    # all 6 verification commands, zero errors required:
             # test:tokens (math + basis classes + focus/icon/density + JSON↔CSS drift gate)
             # test:components (43 suites: features #13-16/#27-60, RTL guard, snapshots, zero-framework)
             # test:m2 (adversarial CSS challenge suite)
             # typecheck (strict TS + Vue SFC compile + node --check on all .mjs)
             # test:a11y (WCAG contrast from tokens + built-HTML audit)
             # test:e2e (11 files, 4 tiers over site/dist/index.html)
```

If you intentionally change a component stylesheet, regenerate the snapshot
baseline in the same commit:

```sh
UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs
```

## Rules of the house

- Every visual constant carries a basis class (A/B/C — no Class D); enforced by `test:tokens` suite 15.
- Components consume semantic role tokens from `tokens/vd3.tokens.json` only — never raw hex/px.
- New components: add `components/<slug>.css` (single `@layer vd3.components` block, dual-ring `:focus-visible`, MOB-001 blocks, logical properties) + `components/<slug>/spec.md` (per `_TEMPLATE.md`), register in `components/index.css`, extend `scripts/verify-components.mjs`, add a site specimen in `scripts/build-ssg.mjs` and `site/src/App.vue`.
- Never add framework names to `components/*.css` (zero-framework contract, suite 43).
- Docs: AGENTS.md is the entry point; keep README/glossary/manifest in sync when counts change.
