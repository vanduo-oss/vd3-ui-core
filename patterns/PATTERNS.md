# Patterns — Index

Status: stable · Spec: 1.1.0-draft · APG: none

Patterns are **guidance**; the components in `components/` (indexed in
`components/SPEC.md`) are **normative**. A pattern doc tells you how to
compose normative core classes (`.vd-*`) and tokens (`tokens/vd3.tokens.json`)
into a recurring UX structure. Where a pattern names a library-level
(`@vanduo-oss/vd3`) component, that component is an extension, not part of
this standard (see `components/SPEC.md` "Out-of-standard"). This structure
mirrors the consulted literature, where IBM Carbon ships patterns as
guidance-only alongside normative components (`docs/gap-analysis.md` §3.2).

No W3C APG pattern exists for the page-level structures indexed here
(`apg: none`); each doc states its own behavioral contract. Component-level
APG conformance lives in the per-slug `components/<slug>/spec.md` files.

## Pattern docs

| Pattern | Doc | Core components that implement it |
|---|---|---|
| Empty states | [`empty-states.md`](./empty-states.md) | `.vd-container*`, `.vd-card`, `.vd-table`, `.vd-btn` (CTA); anatomy rendered library-level by `VdEmptyState` |
| Auth flows (login / signup / forgot-password) | [`auth-flows.md`](./auth-flows.md) | `.vd-card`, `.vd-form-group`/`.vd-label`/`.vd-input`, `.vd-btn`, `.vd-alert`, `.vd-container-sm` |
| App shell / page layout | [`app-shell.md`](./app-shell.md) | `.vd-navbar` + `.vd-nav-link`, `.vd-container*`, `.vd-layout-golden`/`.vd-split-golden` (+ `.vd-split-major`/`.vd-split-minor`); sidenav/drawer/footer are library-level (`VdSidenav`, `VdOffcanvas`, `VdFooter`) until phase 1.2 |
| Onboarding (tour / spotlight) | [`onboarding.md`](./onboarding.md) | tour component (Feature #60) + progress indicator; composed over `.vd-card`, `.vd-btn`, `.vd-dialog` focus rules |
| Disabled & read-only states | [`disabled-read-only.md`](./disabled-read-only.md) | every interactive core component: `.vd-btn`, `.vd-input`/`.vd-select`/`.vd-checkbox`/`.vd-radio`, `.vd-switch`, `.vd-tab`, `.vd-chip`, `.vd-alert-close` |

## Cross-cutting rules for every pattern

- **Tokens only**: compose from `tokens/vd3.tokens.json` semantic roles; no
  raw hex/px as primary values (`conventions/naming.md`).
- **Focus**: dual-ring `:focus-visible` per `foundations/focus.md`
  FOC-001…004 (`focus.ring.*`).
- **Reduced motion**: MOB-001 — both `@media (prefers-reduced-motion: reduce)`
  and `[data-motion="reduce"]` (`foundations/motion.md`).
- **RTL**: CSS logical properties (`inset-inline-*`, `border-inline-*`,
  `margin-inline-*`) for all directionality.
- **Content**: sentence case, Verb + Noun action labels, three-part error
  anatomy, action-based `aria-label`s (`conventions/content.md`).
- **Zero framework**: patterns describe markup contracts, not runtime code;
  `patterns/` and `foundations/` carry no framework references.
