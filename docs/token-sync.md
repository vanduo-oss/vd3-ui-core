# Token Sync Contract (core ↔ implementing libraries)

Status: stable · Spec: 1.1.0-draft

## Decision (resolves gap-analysis §4.1)

**`tokens/vd3.tokens.json` in this repo is the single source of truth**
(PRN-002). Implementing libraries (`@vanduo-oss/vd3`, …) align their generated
CSS and runtime token data to it; they do not maintain a parallel normative
token set. `vd3-ui-core` does not consume library output — the
`$vd3.auditedAgainst` field records which library version the values were
audited against (`docs/token-audit.md`).

## Enforcement (in-repo, no cross-repo automation)

1. **JSON ↔ CSS drift gate** — `scripts/verify-tokens.mjs` suite 18 maps every
   leaf token in `vd3.tokens.json` to its `--vd3-*` custom property and fails
   `pnpm test` if `tokens/tokens.css` does not export it (and vice versa for
   removed files via the component snapshot suite). Regenerate CSS-adjacent
   artifacts after token changes with `pnpm build` (syncs `site/public/tokens/`
   and `site/dist/tokens/`).
2. **Library-side gate** — the `vd3` package already runs
   `tests/tokens-sync.spec.ts`, which fails its CI when shipped
   `css/core/tokens.css` drifts from the DTCG-derived data. Library PRs that
   change token values must reference a core spec version that contains them.
3. **Version stamping** — the spec version (`$vd3.spec`, package.json,
   JSON-LD, badges, e2e assertions) is bumped in lockstep on every draft, so
   any consumer can declare `"implements": "vd3-ui-core@^X.Y"` unambiguously.

## Change procedure for a token change

1. Edit `tokens/vd3.tokens.json` (every leaf needs `$extensions.vd3.class`
   A/B/C; class C must cite C-01…C-04).
2. Mirror the value in `tokens/tokens.css` (drift gate checks presence).
3. Update `tokens/schema.json` `required`/`properties` when adding a group.
4. Update `tokens/tokens.d.ts` if the typed mirror changes shape.
5. Add/adjust the `verify-tokens` suite for the new math.
6. `pnpm build && pnpm test` must be green; bump the draft version and add a
   CHANGELOG entry.
