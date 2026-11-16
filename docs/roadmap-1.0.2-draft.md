# VD3 UI Core — Roadmap & Gap-Closure Plan (from `docs/gap-analysis.md`)

**Status:** ALL PHASES DELIVERED in `1.1.0-draft` (branch `dev`) · **Source findings:** `docs/gap-analysis.md` (2026-11-16), verified by re-runnable commands in its Appendix A.

Every gap found in the analysis is mapped below to a phase. All phases are implemented on this branch; `pnpm build && pnpm test` is the definition of done (see `CONTRIBUTING.md`).

---

## Phase 1.1.0-draft — "specs & phantom primitives" (THIS BRANCH)  —  DELIVERED

Goal: make the advertised component set real, specified, and verified; fix the doc drift that makes the standard hard to trust.

| # | Gap (from gap-analysis) | Action in this draft |
|---|---|---|
| 1.1 | `switch`, `alert`, `tabs` advertised in AGENTS.md/README/figma manifest but no CSS ships (§1.2.1) | Ship `components/switch.css` (#37), `components/alert.css` (#38), `components/tabs.css` (#39) in `@layer vd3.components`, zero-framework, dual-ring focus, MOB-001, RTL-safe logical properties; register in `components/index.css`; extend `scripts/verify-components.mjs` (file lists + 3 new feature suites) |
| 1.2 | `components/SPEC.md` missing; 10 of 11 per-slug `spec.md` dead links (§1.2.2) | Write `components/SPEC.md` master index; write `components/switch/spec.md`, `components/alert/spec.md`, `components/tabs/spec.md` per `_TEMPLATE.md` (APG switch/tabs patterns; live-region roles for alert); repoint remaining manifest `spec:` links to `components/SPEC.md#<slug>` |
| 1.3 | `FOC-001…FOC-004` cited but undefined; focus-ring tokens only in CSS, not in `vd3.tokens.json` (§1.2.3) | Define FOC-001…004 in `foundations/focus.md`; add `focus.ring.*` group to `tokens/vd3.tokens.json` (+ `color.role.focus-glow` in both themes for parity); add `focus` to `tokens/schema.json`; add verify-tokens suite 16 (ring geometry = F₃ = 2px) |
| 1.4 | Doc drift: suite count 7 vs 6, `verify-m2-prose.mjs` phantom, PRN range, layer lists, glossary `^2.x`, data-* hook claims (§1.2.5) | Correct AGENTS.md, README.md, glossary.md; clarify `data-palette/primary/neutral/radius` as library-side hooks, not core tokens |
| 1.5 | RTL breakage: physical `left/right`/`border-left` in form/toast/code (App. C.3.1) | Convert to `inset-inline-*` / `border-inline-start` in `form.css`, `toast.css`, `code.css` (LTR rendering unchanged) |
| 1.6 | Site shows only 11 primitives and 1 spec | Add switch/alert/tabs specimens + spec pages to `site/src/App.vue` and `scripts/build-ssg.mjs`; counts 11 → 14 |
| 1.7 | Draft versioning | Bump `1.0.1-draft` → `1.1.0-draft` across headers/manifests/JSON-LD/badges/e2e assertions; CHANGELOG entry |

**Explicitly out of scope for this draft** (planned below): new component families, patterns section, icons/density foundations, token codegen, vd3↔core sync enforcement.

---

## Phase 1.0.3-draft — "spec the existing 11"  —  DELIVERED

- Per-slug `spec.md` for the remaining advertised primitives, priority order matching external-system universality: `button`, `input`(+textarea), `select`, `checkbox`, `radio`, `card`, `badge`/`chip`, `navbar`, `accordion`, `table`, `code`, `toast`, `layout`.
- `components/SPEC.md` marks each `stable`; manifest links become live again.
- Extend verify-components with per-feature suites for each new spec (pattern after #37–39).

## Phase 1.1 — "patterns & foundations sections" (§3.2)  —  DELIVERED

- New `patterns/` section: empty states, auth flows, app-shell/page layout, onboarding, disabled/read-only states — reusing the 3-part anatomies already in `conventions/content.md`.
- New `foundations/icons.md`: icon sizing steps (resolve token-audit unknown re Phosphor), stroke width, library-agnostic contract.
- Density: resolve research-brief Q4 (compact/comfortable scale, likely a `space`-parallel `density` group, Class B).
- `foundations/data-viz.md` boundary note pointing at `@vanduo-oss/vd3-charts` (Carbon-style separation).
- Content strategy beyond conventions: expand `conventions/content.md` toward Carbon/Atlassian-level guidance.

## Phase 1.2 — "overlays & navigation primitives in core"  —  DELIVERED

From §3.1, the overlays/navigation every styled system ships but core lacks: drawer/offcanvas, tooltip, popover, dropdown/menu, breadcrumb, pagination, avatar, progress, spinner, skeleton, slider. vd3 already has Vue versions to port (VdOffcanvas, VdTooltip, usePopover, VdMenu, VdBreadcrumb, VdPagination, VdAvatar, VdProgress, VdSpinner, VdSkeleton, VdSlider) — port CSS to core with specs, keep zero-framework.

## Phase 1.3 — "component families both layers miss" (§3.1 bold rows)  —  DELIVERED

Date/time picker components (composables `useDatepicker`/`useTimepicker` exist in vd3 — wrap, don't rebuild), file upload, carousel, toolbar/menubar/context-menu/hover-card/segmented, tour (useSpotlight exists). Decision needed on color picker, meter, QR, descriptions/statistic (Ant-level nice-to-haves).

## Phase 1.4 — "engineering & governance"  —  DELIVERED

- **Token codegen**: full Style Dictionary codegen deferred; the JSON↔CSS **drift gate** is implemented instead (verify-tokens suite 18) — App. C.3.3.
- **vd3↔core sync**: direction decided and documented in-repo (`docs/token-sync.md`: core JSON is the single source of truth, PRN-002; library-side gate is vd3's own `tokens-sync.spec.ts`; core-side gate is the JSON↔CSS drift suite). Cross-repo CI automation deliberately deferred (no cross-repo work in this cycle).
- **vd3-only components** (~46 of 66, §2.1): declared library-level extensions in `components/SPEC.md` "Out-of-standard"; high-value ones ported in phases 1.2/1.3.
- Logical-properties enforcement: implemented as the RTL guard suite in `verify-components.mjs` (no new dependency; a stylelint rule can be added later if a lint step is introduced) — App. C.3.1.
- Regression snapshots: CSS-level sha256 snapshot suite (`scripts/snapshots.json`, UPDATE_SNAPSHOTS=1 to regenerate) stands in for Playwright visual diffing (no new deps). `CONTRIBUTING.md` added; per-component stability lives in `components/SPEC.md` status column (rendered on the site); granular npm exports deferred — package stays `private: true` (spec-only) for now.
- Layout-system reconciliation: core `.vd-container/.vd-grid-*/.vd-split-*` vs vd3 primitives (VdBox/VdStack/…) — pick one normative mapping (docs + class aliases).

---

## Definition of done for 1.1.0-draft

- `pnpm test` — all 6 suites green (tokens, components, m2, typecheck, a11y, e2e incl. new #37–39 assertions).
- `pnpm build` — SSG site builds with switch/alert/tabs specimens + specs; token files synced to `site/public`/`dist`.
- No dead references introduced: every `spec:` link in `figma.manifest.json` resolves.
- CHANGELOG + version `1.1.0-draft` consistent across package.json, tokens, site JSON-LD, badges, e2e.
