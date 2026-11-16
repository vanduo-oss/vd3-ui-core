# VD3 Gap Analysis Report — "Does the core standard encompass everything?"

**Date:** 2026-11-16 (UTC) · **Scope:** `vd3-ui-core` (spec v1.0.1-draft) vs `vd3` (`@vanduo-oss/vd3@1.9.1`) vs external design systems
**Method:** three parallel research passes (core inventory, vd3 inventory, external baselines fetched live from official sources), then independent re-verification of every load-bearing claim with `grep`/`ls`/`find` (commands in Appendix A, run from the `0_vanduo` workspace root). Note: the `0_vanduo` workspace root is not a git repo — each package is its own repo; this report was committed on the `dev` branch of `vd3-ui-core`. All research was read-only.

---

## 0. Executive answers

**Q1 — Is the core standard (`vd3-ui-core`) already complete enough that future `vd3` updates could strictly follow it?**
**No — not today.** The standard is mathematically strong (tokens + foundations + 11 CSS modules, all basis-classed and machine-verified), but its *component layer* is only ~17% specified: 1 of 11 claimed component specs exists (`dialog/spec.md`), 3 of the 11 advertised primitives (`switch`, `alert`, `tabs`) have no CSS at all, and ~46 of vd3's 66 components have no counterpart anywhere in the standard. On top of that, `vd3` does not consume `vd3-ui-core` at all — it ships its own duplicate token pipeline (`vd3/tokens/*` → `css/core/tokens.css`, 274 `--vd-*` vars) while core claims to be "audited against" vd3, not the other way round. So "strictly follow the standard" currently has no enforcement path.

**Q2 — Compared to IBM Carbon, Material 3, Fluent, Atlassian, Ant, Radix/Base UI/shadcn, are we missing something?**
**Yes, at both layers.** The *library* (`vd3`) covers most common components, but the *standard* (`vd3-ui-core`) specifies only 11 of the ~40 canonical components every mature system ships, and has no patterns section at all (empty states, auth/login, onboarding, page layout are guidance-only in Carbon — vd3 has components/conventions for some, but the standard doesn't). Both layers are missing: date/time picker, color picker, file upload, carousel, toolbar, segmented control, menubar/context-menu, hover card, scroll area, meter, QR, descriptions/statistic, tour — plus standard-level sections for **icons**, **density** (explicitly left open), and **data-viz bridging** (vd3-charts exists but is outside the core spec).

---

## 1. What the standard actually is (vd3-ui-core, proof-backed)

### 1.1 Inventory (verified by subagent + re-grepped)

| Layer | Contents | Proof |
|---|---|---|
| Foundations | 10 files: principles (PRN-001…010), proportion (Three-Class Basis Contract A/B/C, C-01…C-04), color, typography, motion (MOB-001), elevation, layout, line, glass, focus | `ls vd3-ui-core/foundations/` |
| Tokens | `tokens/vd3.tokens.json` — 16 top-level groups, **150 leaf tokens**, every leaf carries `$extensions.vd3.class` A/B/C; `tokens/tokens.css` (561 lines, 370 `--vd3-*` + 175 `--vd-*` aliases) in `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities` | counted programmatically by subagent |
| Components (CSS) | **11 modules**: layout, button, dialog, card, form (bundles input/select/checkbox/radio/textarea), badge (+chip), navbar, accordion, table, code, toast | `components/index.css` imports; class inventory re-grepped: `.vd-btn`, `.vd-dialog`, `.vd-card`, `.vd-input/.vd-select/.vd-checkbox/.vd-radio/.vd-textarea`, `.vd-badge/.vd-chip`, `.vd-navbar`, `.vd-accordion`, `.vd-table*`, `.vd-code*`, `.vd-toast*`, layout engine `.vd-container*/.vd-grid-*/.vd-col-*/.vd-split-*/.vd-layout-golden*/.vd-cq` |
| Component specs | **1 of 11**: only `components/dialog/spec.md` (DLG-001…004). `_TEMPLATE.md` exists. `components/SPEC.md` **does not exist** | `find vd3-ui-core/components -name "*.md"` → `_TEMPLATE.md`, `dialog/spec.md` only |
| Conventions | naming.md, mappings.md (IBM Carbon translation table), content.md (incl. 3-part error + 3-part empty-state anatomy) | `ls conventions/` |
| Verification | 6 test commands (`test:tokens`, `test:components`, `test:m2`, `typecheck`, `test:a11y`, `test:e2e` → 11 e2e files / 35 tests); zero-framework enforcement on `components/` | `package.json` scripts |

### 1.2 Internal gaps inside the standard itself (each verified)

1. **Advertised vs shipped mismatch.** `AGENTS.md:33` / `README.md:38` claim 11 primitives `button, input, select, checkbox, radio, switch, card, badge, alert, tabs, dialog`. Actual CSS has **no `.vd-switch`, no `.vd-alert`, no `.vd-tab*`** (grep: zero matches) and instead ships navbar/accordion/table/code/toast, which are absent from the advertised list.
2. **Spec coverage.** `AGENTS.md:9` mandates `components/<slug>/spec.md` + `components/SPEC.md`; `tokens/figma.manifest.json:142-236` links 11 Figma component sets to `components/<slug>/spec.md` — **10 of 11 are dead links**; `SPEC.md` is missing entirely.
3. **Undefined normative IDs.** `AGENTS.md:36` cites `FOC-001…FOC-004`; `foundations/focus.md` defines no FOC IDs, and the focus-ring tokens exist only as CSS vars in `tokens/tokens.css` §16 — **no `focus` group in `vd3.tokens.json`/`schema.json`**.
4. **Unimplemented root hooks.** `AGENTS.md:31` claims `data-palette`, `data-primary`, `data-neutral`, `data-radius`; only `data-theme`, `data-font`, `data-motion` exist in core's `tokens/`/`components/` (the others are v1.9 library hooks).
5. **Doc drift.** "7 verification suites" claimed vs 6 in `package.json`; `scripts/verify-m2-prose.mjs` referenced but missing (real: `tests/challenge-m2-interactive.mjs`); `foundations/space.md` cited by figma manifest but missing; PRN count 8 vs 10; layer-order lists differ across three files; glossary says `^2.x`, README says `^1.0`.
6. **Open questions by design:** density modes (research-brief Q4), normative focus-ring geometry, Phosphor icon sizing (token-audit "Remaining unknowns").

---

## 2. What the library actually is (vd3@1.9.1, proof-backed)

- **66 components verified**: `ls src/components/*.vue | wc -l` → **59**, `src/components/primitives/*.vue` → **7** (VdBox, VdCenter, VdCover, VdFrame, VdInline, VdStack, VdSwitcher). Matches README's "66 = 59 + 7".
- **41 composables verified**: `ls src/composables/*.ts | wc -l` → **41**.
- **54 component CSS files** in `css/components/` (accordion … waypoint) — far beyond core's 11 modules.
- **vd3 does not import vd3-ui-core anywhere** (`grep -rn "ui-core" src scripts package.json` → no hits). It owns its own DTCG sources (`tokens/primitive/*`, `tokens/semantic/*`, `tokens/customizer/options.json`) compiled by `scripts/build-tokens.mjs` into `css/core/tokens.css` (274 `--vd-*` vars) + `src/theme/generated/tokens.data.ts`; `tests/tokens-sync.spec.ts` gates them. Sync direction is **core → audited against vd3@1.9.0** (`vd3-ui-core/tokens/vd3.tokens.json` `$vd3.auditedAgainst`), not consumption.
- `openspec/specs/` documents 8 areas (components, composables, theme-runtime, design-tokens, data-table, …) — the library has its own spec process separate from core.

### 2.1 Cross-map: vd3 component → core standard coverage

| Core standard covers (CSS + spec) | Core covers (CSS only) | **vd3-only: no core counterpart at all** |
|---|---|---|
| dialog (spec ✓) | button, card, form controls (input/select/checkbox/radio/textarea), badge/chip, navbar, accordion, table, code, toast, layout engine | **~46 of 66**: VdAlert, VdAvatar, VdBreadcrumb, VdButtonGroup, VdCollection, VdDocSearch, VdDock(+Item), VdEmptyState, VdExpandTransition, VdFab, VdFlow, VdFooter, VdForgotPassword, VdGlobalSearch, VdIcon, VdImageBox, VdLogin, VdMenu, VdOffcanvas, VdOtpInput, VdPagination, VdPreloader, VdProgress, VdRating, VdSeparator, VdSidenav, VdSignUp, VdSkeleton, VdSlider, VdSpinner, **VdSwitch, VdTabs** (claimed by core, unshipped), VdThemeCustomizer, VdThemeSwitcher, VdTooltip, VdTransfer, VdTransition, VdTree(+Node), VdAuthCard, + all 7 layout primitives (core uses different class names; only VdFrame≈`.vd-aspect-golden*`, VdSwitcher≈`.vd-grid-auto-*` are analogous) |

| Core primitive with **no** vd3 wrapper | Notes |
|---|---|
| Entire layout engine (`.vd-container*`, `.vd-grid-*`, `.vd-col-*`, `.vd-split-*`, `.vd-layout-golden*`, `.vd-cq`) | vd3 has primitives with different names instead — two parallel layout systems |
| `.vd-textarea` | no `VdTextarea` component (grep: none) |

**Conclusion Q1:** the standard's *foundations/tokens* layer is genuinely strong and could be the single source of truth, but its *component* layer covers 11 modules with 1 spec. vd3 cannot "strictly follow the standard" until (a) the ~46 vd3-only components get core specs or are explicitly declared out-of-standard, (b) the 3 phantom primitives (switch/alert/tabs) are shipped or the docs fixed, (c) SPEC.md + per-slug specs are written, and (d) a real sync mechanism replaces the current "core is audited against vd3" one-way relationship.

---

## 3. External baseline (fetched live 2026-11-16, sources in Appendix B)

| System | Components | Notes |
|---|---|---|
| IBM Carbon (`@carbon/react` 1.120.0) | 41 "core" on site; ~100 exports in package | + 17 patterns (guidance-only incl. **empty-states, login, global-header**), 10 data-viz guidance pages + separate `@carbon/charts`, 9 "building experiences" incl. onboarding |
| Material 3 / Material Web 2.5.0 | 36 in 6 categories | no patterns section; no table, no empty state, no auth |
| Fluent UI (React v9 / WC v3) | 47 | |
| Atlassian | 72 current + 13 primitives | ships **Empty state as a component**; onboarding deprecated |
| Ant Design v6.7.1 | 73 | |
| Radix Primitives / Base UI / shadcn | 30 / 38 / 60 (+18 AI elements) | headless: no styled table/avatar/forms beyond basics |

Universal across all styled systems: buttons, inputs, select, checkbox, radio, switch, slider, tabs, dialog, drawer, menus, popover, tooltip, progress, spinner, skeleton, card, badge/chip, alert/toast, table (except M3/Fluent-web), tree, breadcrumb, pagination, avatar (except Carbon/M3). Differentiators: **data display** (table/tree/avatar), **empty state** (Atlassian/Ant/shadcn ship it; Carbon only guidance), **auth/login** (Carbon guidance only), **command palette** (only shadcn), **OTP** (only Radix/Base UI/shadcn), **data-viz** (Carbon guidance + separate lib; shadcn Chart; others none).

### 3.1 Gap matrix — canonical component vs **vd3-ui-core standard** vs **vd3 library**

Legend: ● shipped · ◐ partial/composable-only/guidance · ○ missing

| Canonical item | Core standard | vd3 library | External norm |
|---|---|---|---|
| button, input, select, checkbox, radio, card, badge/chip, navbar, accordion, table, code, toast, dialog, layout | ● | ● | universal |
| switch, alert, tabs | ○ CSS (advertised only) | ● VdSwitch/VdAlert/VdTabs | universal in all 6 styled systems |
| textarea | ● `.vd-textarea` | ○ no VdTextarea | universal |
| slider | ○ | ● VdSlider | universal |
| progress / spinner / skeleton | ○ | ● VdProgress/VdSpinner/VdSkeleton | universal |
| menu/dropdown, popover, tooltip | ○ | ● VdMenu, usePopover, VdTooltip | universal |
| drawer/offcanvas, sidenav | ○ | ● VdOffcanvas, VdSidenav | universal (drawer/sheets/side panel) |
| breadcrumb, pagination | ○ | ● VdBreadcrumb, VdPagination | Carbon/Fluent/Atlassian/Ant/shadcn |
| avatar | ○ | ● VdAvatar | Fluent/Atlassian/Ant/Radix/shadcn |
| tree | ○ | ● VdTree(+Node) | Carbon/Fluent/Ant |
| data table w/ sort/page/select | ◐ `.vd-table` static | ● VdDataTable + useTableState | Carbon/Atlassian/Ant/shadcn |
| tabs | ○ (advertised only) | ● VdTabs + useTabs | universal |
| **date picker / time picker** | ○ | ◐ useDatepicker/useTimepicker composables, **no component** | Carbon/M3/Atlassian/Ant |
| **color picker** | ○ | ○ | Ant only — still a common gap |
| **file upload** | ○ | ○ | Carbon/Ant |
| **rating** | ○ | ● VdRating | Fluent/Ant |
| **stepper** | ○ | ◐ useStepper composable only | Carbon/Atlassian/Ant Steps |
| **OTP input** | ○ | ● VdOtpInput | Radix/Base UI/shadcn only |
| **transfer (dual-list)** | ○ | ● VdTransfer | Ant only |
| command palette / global search | ○ | ● VdGlobalSearch + useGlobalSearch/useSpotlight | shadcn Command only |
| docs search / suggest/autocomplete | ○ | ◐ useDocSearch/useSuggest (no dedicated component) | Fluent Searchbox/Ant AutoComplete |
| FAB, button group | ○ | ● VdFab, VdButtonGroup | M3/Ant/shadcn |
| separator/divider | ○ | ● VdSeparator | M3/Fluent/Ant/Radix |
| empty state | ◐ content convention only (3-part anatomy in conventions/content.md) | ● VdEmptyState | Atlassian/Ant/shadcn ship component; Carbon guidance |
| **auth / login / signup / forgot-password** | ◐ content guidance only | ● VdLogin/VdSignUp/VdForgotPassword/VdAuthCard | Carbon **pattern-only** — nobody ships it as a component |
| **carousel** | ○ | ○ (VdFlow is step progress, not carousel) | M3/Fluent/Ant/shadcn |
| **toolbar, menubar, context menu, hover card, segmented control, scroll area, resizable, meter, kbd** | ○ | ○ | present in Radix/Base UI/shadcn/Fluent |
| **tour / spotlight / onboarding** | ○ | ◐ useSpotlight composable only | Atlassian (deprecated), Ant Tour, Carbon experience guidance |
| **timeline** | ○ | ◐ useTimeline composable only | Ant |
| icon system | ○ (**no foundations/icons.md**; Phosphor sizing is an open unknown) | ● VdIcon + css/icons | every system has icon guidance |
| typography/text primitive | ◐ foundations only | ◐ no VdText component | Fluent Text, Atlassian Text, Ant Typography, shadcn Typography |
| **data visualization** | ○ outside spec (vd3-charts is a separate package) | separate pkg | Carbon: guidance + `@carbon/charts` |
| **density modes** | ○ explicitly open (research-brief Q4) | ○ | Carbon/M3/Fluent all ship density |
| footer | ○ | ● VdFooter | rare everywhere (Ant Layout.Footer) |

### 3.2 Missing *sections* of a standard (not just components)

Compared to Carbon's structure (foundations + components + **patterns** + data-viz + experiences), vd3-ui-core has foundations + components + conventions, but **no patterns section** (empty states, auth flows, page/app-shell layout, onboarding, disabled/read-only states), **no icons foundation**, **no density spec**, **no data-viz bridge** (vd3-charts and vd3-flowchart are separate packages not referenced by the core spec), and its **content conventions** (content.md) are the only content strategy — Carbon/Atlassian ship full content guidance.

---

## 4. Recommendations (priority order)

1. **Decide the sync direction and enforce it.** Either make `vd3` consume core's `tokens/vd3.tokens.json`/`tokens.css` (single source of truth, PRN-002), or formally declare core "audited against" vd3 and add an automated drift check (there is a token audit doc, but no CI gate between the two repos).
2. **Ship or de-claim the phantom primitives.** Add `switch.css`, `alert.css`, `tabs.css` to core (vd3 already has the Vue versions to port), or fix AGENTS.md/README/manifest.
3. **Write the missing specs.** `components/SPEC.md` + per-slug `spec.md` for the 10 dead-linked components, starting with switch/alert/tabs; define FOC-001…004 and add the `focus` token group to `vd3.tokens.json`.
4. **Either spec or scope out the ~46 vd3-only components** — at minimum the ones external systems all ship (alert, switch, tabs, slider, progress, spinner, skeleton, menu, tooltip, popover, drawer, breadcrumb, pagination, avatar, tree).
5. **Close component-level gaps both layers share:** date/time picker components (composables exist), file upload, carousel, toolbar/menubar/context-menu/hover-card/segmented, tour; decide on color picker, meter, QR, descriptions/statistic.
6. **Add the missing standard sections:** patterns (empty state/auth/app-shell/onboarding — content.md already defines the anatomy), icons foundation (incl. Phosphor sizing), density (resolve research-brief Q4), and a data-viz boundary note pointing at vd3-charts.
7. **Fix doc drift** so future updates can rely on the standard: suite count (7 vs 6), verify-m2-prose.mjs, layer-order lists, PRN range, glossary version, `data-*` hook claims, schema.json `required` missing `theme`/`breakpoint`.

---

## Appendix A — Proof commands (re-runnable)

```bash
# counts
ls vd3/src/components/*.vue | wc -l            # 59
ls vd3/src/components/primitives/*.vue | wc -l # 7
ls vd3/src/composables/*.ts | wc -l            # 41
ls vd3/css/components | wc -l                  # 54
find vd3-ui-core/components -name "*.md"       # _TEMPLATE.md, dialog/spec.md
ls vd3-ui-core/components/*.css                # 11 modules

# phantom primitives: no switch/alert/tabs CSS in core
grep -rnE '\.vd-switch\b|\.vd-alert\b|\.vd-tab-|\.vd-tabs\b' vd3-ui-core/components/*.css   # no matches

# vd3 does not consume core
grep -rn "ui-core" vd3/src vd3/scripts vd3/package.json                                       # no matches

# no textarea / datepicker / upload / carousel components in vd3
ls vd3/src/components/ | grep -iE 'textarea|date|time|upload|color|carousel'                # no matches
ls vd3/src/composables | grep -iE 'datepicker|timepicker|spotlight|suggest'                  # useDatepicker, useSpotlight, useSuggest, useTimepicker

# core foundations: no icons/spacing/grid docs
ls vd3-ui-core/foundations/                    # 10 files, none named icons/space/grid
```

Key file references: `vd3-ui-core/AGENTS.md:9,24,31,33,36,43`; `vd3-ui-core/components/index.css:6`; `vd3-ui-core/components/dialog/spec.md`; `vd3-ui-core/tokens/vd3.tokens.json` (`$vd3.auditedAgainst: @vanduo-oss/vd3@1.9.0`); `vd3-ui-core/tokens/figma.manifest.json:142-236`; `vd3/package.json:3` (1.9.1); `vd3/src/index.ts:11-77,80-120`; `vd3/scripts/build-tokens.mjs`; `vd3/tests/tokens-sync.spec.ts`.

## Appendix B — External sources (checked 2026-11-16)

- Carbon: https://carbondesignsystem.com/building-blocks/core/components/overview/components · https://carbondesignsystem.com/llms.txt · github.com/carbon-design-system/carbon `packages/react/src/index.ts` (@carbon/react 1.120.0) · patterns: /building-blocks/core/patterns/overview · data-viz: /building-blocks/data-visualization/overview
- Material 3: https://m3.material.io/components (36, six categories) · github.com/material-components/material-web (@material/web 2.5.0, maintenance mode)
- Fluent: https://fluent2.microsoft.design/components/web/react/ (47) · github.com/microsoft/fluentui packages/web-components
- Atlassian: https://atlassian.design/components (72 current + 13 primitives)
- Ant: https://ant.design/components/overview (73, v6.7.1)
- Headless: radix-ui.com/primitives (30+5), base-ui.com/react/components (38), ui.shadcn.com/docs/components (60+18)

---

## Appendix C — Cross-check vs the external "architecture audit" report (`docs/vanduo_ui_core_vd3_architecture_audit_report.md`, untracked, self-described as evaluating `v0.1.0-alpha`)

Verdict: **~70% of it either overlaps what this report already found or is stale/false against the current `1.0.1-draft`.** It adds a small number of genuinely new, verified findings (C.3).

### C.1 Claims that are FALSE against the current repo (stale — likely written against the alpha)

| Audit claim | Reality (proof) |
|---|---|
| "No automated tests / no Playwright-Vitest suite" | 6 suites in `package.json` (`test:tokens`, `test:components`, `test:m2`, `typecheck`, `test:a11y`, `test:e2e` → 11 files / 35 named tests) + CI `.github/workflows/ci.yml`. (True only that there is no *screenshot/visual-regression* diffing — e2e is structural: `grep -ri screenshot tests/ scripts/ .github/` → no hits.) |
| "Standard selector specificity, no `@layer`" | Layers declared and e2e-enforced: `tokens/tokens.css:10` `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities` (TEST-T1-STD-003). |
| "Lacks W3C DTCG JSON source-of-truth" | `tokens/vd3.tokens.json` is DTCG 2025.10 + `schema.json` + `figma.manifest.json`. (True nuance, see C.3.3: CSS is *not generated* from the JSON.) |
| "Motion tokens / reduced-motion missing" | `motion` group (14 tokens: Fibonacci ladder + aliases), `easing` (4 golden béziers), `foundations/motion.md` MOB-001, reduced-motion in `tokens.css` §20. |
| "Z-index scale missing" | `z` group: 9 tokens, `z.base 0 … z.toast 1080`. |
| "No ARIA contracts / focus-visible / contrast verification" | `foundations/focus.md` dual-ring contract; `:focus-visible` enforced in 8 CSS files by `verify-components.mjs`; `test:a11y` computes WCAG contrast (text-primary ≥7:1 AAA); `dialog/spec.md` cites APG. (True only that per-component ARIA/keyboard matrices exist for 1 of 11 components — our spec-coverage finding.) |
| "Form Field wrapper missing" | `.vd-form-group`, `.vd-label`, `.vd-help-text`, `.vd-error-text`, `:user-invalid` all ship in `components/form.css`. |
| "Dialog / Toast missing" | Both ship: `dialog.css` (+ the only `spec.md`), `toast.css` with live-region contract. Accordion also ships (`accordion.css`), listed by the audit as missing. |
| Naming `.vd3-btn` classes, "2-tier tokens" | Actual classes are `.vd-*` (vars are `--vd3-*` + `--vd-*` aliases); color is 3-tier (primitive/role/component) per `foundations/color.md`. |

### C.2 Overlaps with this report (already uncovered)

Missing overlays (drawer/tooltip/popover/dropdown/context-menu), combobox/multi-select, file dropzone, range slider, skeleton/progress, tabs, breadcrumb, avatar, sortable data-table features, empty-state as component, icons foundation — all already in §2.1/§3.1. The "headless JS layer" is not a gap but a design decision: PRN-004 mandates a zero-framework core, and the behavior lives in `vd3`'s 41 composables (`useFocusTrap`, `useDropdown`, …) — worth a strategic note, not a missing feature.

### C.3 Genuinely NEW findings from the audit (verified here, not in earlier sections)

1. **RTL/i18n: physical directional properties are used.** `border-left` in `form.css:107`, `toast.css:47,52-56`; `border-right` in `accordion.css:63`; `left/right` positioning in `toast.css:19-29`, `code.css:56,70`. Only 4 files use logical properties (`badge`, `dialog`, `layout`, `navbar`); core has **no stylelint config** to enforce them (`ls stylelint.config.*` → none, unlike `vd3`). → add logical-properties rule + refactor.
2. **Docs portal guide gaps.** `site/src/` is a single `App.vue` that renders the spec markdown; there are **no Getting Started/installation, theming guide, principles do/don't pages, or interactive prop/API playgrounds** (`grep -riE "getting.?started|installation|theming|playground" site/src` → no hits).
3. **No JSON→CSS compile pipeline.** `tokens/vd3.tokens.json` is the source, but `scripts/build-ssg.mjs:32-39` only *copies* `tokens/tokens.css` into the site — the CSS is hand-maintained alongside the JSON; `verify-tokens.mjs` checks math but never regenerates. → generate `tokens.css` from the DTCG JSON (or add a drift check that fails CI when they diverge).
4. **Minor governance gaps:** no visual-regression snapshots, no `CONTRIBUTING.md` in core (vd3 has one), no per-component stability badges (only the `_TEMPLATE.md` frontmatter has `status`), no granular npm exports — moot today since `package.json` is `"private": true` ("Spec-only except site/"), but relevant if the package is ever published.

