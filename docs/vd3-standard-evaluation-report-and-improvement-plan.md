# Comprehensive Evaluation Report & Actionable Improvement Plan: vd3 Standard & Documentation

**Standard**: vd3 Design System (`v1.1.0-draft`)  
**Repository**: `vd3-ui-core`  
**Public Canonical URL**: [core.vanduo.dev](https://core.vanduo.dev/)  
**Date of Audit**: November 16, 2026  
**Auditor**: Evaluation Report Author (vd3 Standard Review Team)  
**Verification Baseline**: W3C DTCG 2025.10, Three-Class Basis Contract, W3C WAI-ARIA APG, WCAG 2.1 / 2.2 AA/AAA, Modern Web Platform Standards  

---

## Table of Contents

1. [Executive Summary & Review Overview](#1-executive-summary--review-overview)
   - 1.1 Scope & Objectives
   - 1.2 Evaluation Methodology
   - 1.3 Summary Findings Matrix by Criticality & Domain
2. [Evaluation Methodology & Standards Baseline](#2-evaluation-methodology--standards-baseline)
   - 2.1 W3C DTCG 2025.10 Token Specification
   - 2.2 The Three-Class Basis Contract & Mathematical Identity
   - 2.3 W3C WAI-ARIA APG Interaction Contracts
   - 2.4 WCAG 2.1 / 2.2 AA & AAA Accessibility Foundations
   - 2.5 Modern Web Platform Capabilities (`modern-web-guidance`)
3. [Criticality Grading Criteria](#3-criticality-grading-criteria)
4. [Part I: Comprehensive Evaluation Findings Catalog](#4-part-i-comprehensive-evaluation-findings-catalog)
   - 4.1 Domain A: Mathematical Spine, Foundations & Principles
   - 4.2 Domain B: Token Architecture, Formats & Tooling Bindings
   - 4.3 Domain C: Component Specifications & Zero-Framework CSS Primitives
   - 4.4 Domain D: W3C WAI-ARIA APG Conformance & Interaction Contracts
   - 4.5 Domain E: Documentation Site Architecture, SSG & Specimen Synchronization
   - 4.6 Domain F: Modern Web Standards & Platform Capabilities Alignment
5. [Part II: Prioritized Actionable Improvement Plan](#5-part-ii-prioritized-actionable-improvement-plan)
   - 5.1 Phase 1: Critical Mathematical, Token, and SSG Contradictions
   - 5.2 Phase 2: High-Priority Accessibility, RTL & Spec Alignments
   - 5.3 Phase 3: Medium-Priority Architectural & Usability Refinements
   - 5.4 Phase 4: Modern Web Platform Evolution & Polish
6. [Verification & Regression Health Check](#6-verification--regression-health-check)

---

## 1. Executive Summary & Review Overview

### 1.1 Scope & Objectives

This evaluation represents an exhaustive, multi-dimensional technical audit of the **vd3** design system core standard (`v1.1.0-draft`) and its public documentation application at `site/` (`core.vanduo.dev`). The evaluation covers the mathematical foundations ($\phi$, $F_n$, $L_n$, and the Three-Class Basis Contract), the authoritative W3C Design Tokens Community Group (DTCG 2025.10) registry (`tokens/vd3.tokens.json`), the CSS Custom Property export (`tokens/tokens.css`), TypeScript definitions (`tokens/tokens.d.ts`), Figma design binding manifest (`tokens/figma.manifest.json`), 35 zero-framework CSS component modules (`components/*.css`), 38 per-slug component specifications (`components/*/spec.md`), and the static-site generator and live client hydration architecture (`scripts/build-ssg.mjs` and `site/src/App.vue`).

The primary objectives of this evaluation were:
1. Validate absolute adherence to the **Three-Class Basis Contract** and First Principles (`PRN-001` through `PRN-010`).
2. Audit token parity, derivation fidelity, and drift between DTCG source-of-truth tokens, CSS custom properties, and external tool bindings (Figma and TypeScript).
3. Audit the 35 zero-framework CSS modules and 38 component specifications against the **W3C WAI-ARIA Authoring Practices Guide (APG)** and **WCAG 2.1/2.2 AA/AAA** accessibility standards.
4. Verify complete synchronization between pre-rendered static HTML (`scripts/build-ssg.mjs` / `site/dist/index.html`) and live reactive components (`site/src/App.vue`).
5. Evaluate the architecture against contemporary modern web platform capabilities (HTML Popover API, CSS Anchor Positioning, `<dialog>` top layer containment, discrete transitions with `allow-discrete`, CSS `light-dark()`, and Container Queries) via `modern-web-guidance`.

### 1.2 Evaluation Methodology

The audit combined rigorous manual inspection of every specification, markdown contract, and source file with deterministic programmatic assertions. Although all 585 checks in `scripts/verify-tokens.mjs`, all 922 checks across 45 suites in `scripts/verify-components.mjs`, all 47 checks in `tests/challenge-m2-interactive.mjs`, all 189 checks in `scripts/verify-typecheck.mjs`, all 918 checks in `scripts/verify-a11y.mjs`, and all 58 end-to-end assertions in `tests/e2e/runner.mjs` passed cleanly, deep manual analysis revealed that existing automated test runners harbored significant confirmation biases—such as testing hardcoded arrays of filenames rather than scanning directory structures dynamically, checking variable presence without checking value equivalence, or performing syntax transpilation rather than full TypeScript typechecking.

Through rigorous cross-examination across three specialized exploration tracks (Mathematical & Token Architecture, Component Specifications & APG Conformance, and Site Documentation & Modern Web Capabilities), and after deduplicating overlapping track findings during a second verification pass, **57 unique concrete findings** were cataloged, cited, and graded into four criticality tiers.

### 1.3 Summary Findings Matrix by Criticality & Domain

The 57 unique findings are distributed across four criticality tiers and six functional domains:

| Domain | Critical | High | Medium | Low | Total Findings |
|---|:---:|:---:|:---:|:---:|:---:|
| **Domain A**: Mathematical Spine, Foundations & Principles | 3 | 2 | 2 | 4 | **11** |
| **Domain B**: Token Architecture, Formats & Tooling Bindings | 0 | 2 | 2 | 0 | **4** |
| **Domain C**: Component Specifications & Zero-Framework CSS Primitives | 2 | 5 | 5 | 3 | **15** |
| **Domain D**: W3C WAI-ARIA APG Conformance & Interaction Contracts | 0 | 2 | 3 | 1 | **6** |
| **Domain E**: Documentation Site Architecture, SSG & Specimen Sync | 5 | 1 | 6 | 0 | **12** |
| **Domain F**: Modern Web Standards & Platform Capabilities Alignment | 0 | 3 | 2 | 4 | **9** |
| **Total Cataloged Findings** | **10** | **15** | **20** | **12** | **57** |

---

## 2. Evaluation Methodology & Standards Baseline

### 2.1 W3C DTCG 2025.10 Token Specification

The normative token source for vd3 is `tokens/vd3.tokens.json`, written under the W3C Design Tokens Community Group (DTCG 2025.10) draft specification. Under DTCG rules:
- Every token is a JSON object declaring `$value`, `$type`, and an optional `$description`.
- Custom metadata is namespaced under `$extensions.vd3`.
- Token references use the `{group.subgroup.token}` path syntax.
- All visual decisions must originate from this single source of truth (`PRN-002`). Direct manual declarations of `--vd3-*` properties in `tokens.css` that lack DTCG representation violate this standard.

### 2.2 The Three-Class Basis Contract & Mathematical Identity

The mathematical spine of vd3 is governed by `foundations/proportion.md` and `foundations/principles.md` (`PRN-001`):
- **Class A (Mathematical Derivation)**: Strictly derived from the Golden Ratio $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887$, its square root $\sqrt{\phi} \approx 1.2720196495$, Fibonacci numbers ($F_n$), Lucas numbers ($L_n$), or the Golden Angle $\theta_g = 360^\circ \times (1 - 1/\phi) \approx 137.507764^\circ$.
- **Class B (Conventional-by-Design)**: Industry conventions required for platform interoperability (e.g. 12-column grid, CSS z-index ladder, viewport breakpoints) carrying an explicit written rationale.
- **Class C (Registered Exception)**: Physical hardware, GPU sub-pixel rasterization, or accessibility constraints that override algebraic math. Must be formally cataloged in the Exceptions Registry (`C-01` small spacing rem-rounding, `C-02` glass blur soft-cap, `C-04` pill radius `9999rem`).
- **No Class D**: An unclassified or arbitrary visual constant is a specification defect.

### 2.3 W3C WAI-ARIA APG Interaction Contracts

Interactive components and zero-framework CSS modules must conform to the normative patterns established in the W3C WAI-ARIA Authoring Practices Guide (APG):
- Modal surfaces must implement focus trapping, background inertia (`inert`), and escape dismissal.
- Non-modal surfaces must leave the document interactive and allow focus to freely cycle into background content without obstruction.
- Roving `tabindex` and arrow key navigation must govern composite interactive widgets (Menu, Menubar, Tabs, Radio Group, Toolbar).
- Dual-ring focus indication (`FOC-001` through `FOC-004`) must provide minimum 2px thickness and 2px offset with $\ge 3:1$ contrast against adjacent pixels.

### 2.4 WCAG 2.1 / 2.2 AA & AAA Accessibility Foundations

Core components and documentation must satisfy:
- **SC 1.3.1 (Info and Relationships)**: Semantic HTML hierarchy, valid heading ladders, programmatic table headers (`th[scope]`), and accessible container regions.
- **SC 1.4.3 / 1.4.6 (Contrast)**: Normal text $\ge 4.5:1$ (AA) / $7:1$ (AAA); large text and UI components $\ge 3:1$.
- **SC 2.3.3 (Animation from Interactions)** / `MOB-001`: Motion reduction collapsing all durations to 0.01ms / 0ms under `prefers-reduced-motion` and `[data-motion="reduce"]`.
- **SC 2.4.7 / 2.4.13 (Focus Visible / Appearance)**: Unambiguous, high-contrast focus rings.
- **SC 2.5.5 / 2.5.8 (Target Size)**: Interactive touch targets $\ge 44\times 44\text{px}$ (preferred) or $\ge 24\times 24\text{px}$ minimum.

### 2.5 Modern Web Platform Capabilities (`modern-web-guidance`)

The design system is evaluated against contemporary browser capabilities (Baseline 2023/2024):
- **HTML Popover API**: Top-layer promotion with declarative invokers (`popovertarget`), native light dismiss, and non-modal overlays without `z-index` wars.
- **CSS Anchor Positioning**: Associating floating tooltips, menus, and popovers with anchor elements (`anchor-name`, `position-anchor`, `position-area`, `@position-try`) without JavaScript positioning libraries.
- **`<dialog>` Top Layer & Scroll Containment**: Top-layer modal dialogs with native backdrop blurring and mandatory `overscroll-behavior: contain` to prevent background scroll chaining.
- **Discrete Transitions**: Transitioning `display` and `overlay` properties into/out of the top layer, requiring the separate declaration of `transition-behavior: allow-discrete` to preserve compatibility with strict CSS parsers.
- **CSS `light-dark()` Function & OKLCH**: Modern dual-theme token definitions and wide-gamut color interpolation.
- **Container Queries**: Component-driven responsive styling (`@container`) enabling primitives to adapt to local parent layouts (e.g. golden split columns) rather than viewport widths.

---

## 3. Criticality Grading Criteria

Every finding in this report is assigned to one of four mutually exclusive criticality tiers:

```
┌─────────────────┬────────────────────────────────────────────────────────────────────────┐
│ Criticality Tier│ Definitional Scope & Impact                                            │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ CRITICAL        │ Direct specification contradictions, mathematical basis contract       │
│                 │ violations, value drift between token source and CSS exports, breaking │
│                 │ functional defects, or severe layout shifts (CLS) / heading inversions │
│                 │ that compromise core design system credibility.                        │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ HIGH            │ Normative standard deviations, W3C WAI-ARIA APG non-compliance,        │
│                 │ architectural divergences (e.g. zero-framework vs Vue SFC in core),    │
│                 │ RTL layout inversions, disabled OS dark mode, or missing reduced-motion│
│                 │ overrides.                                                             │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ MEDIUM          │ Internal documentation inconsistencies, stale status notes,            │
│                 │ un-tokenized raw values, missing legacy aliases, incomplete keyboard   │
│                 │ navigation contracts in specifications, or truncated code specimens.   │
├─────────────────┼────────────────────────────────────────────────────────────────────────┤
│ LOW             │ Ergonomic improvements, index discontinuities in mathematical ladders, │
│                 │ taxonomy polish, minor unit clarifications, or future-facing modern web│
│                 │ enhancements (e.g. OKLCH, native progress elements).                   │
└─────────────────┴────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Part I: Comprehensive Evaluation Findings Catalog

### 4.1 Domain A: Mathematical Spine, Foundations & Principles

#### [F-MATH-001] Contradiction in `space.fib-1` Classification and Derivation (Class A vs Class C-01 Exception)
- **Criticality Tier**: **Critical**
  - *Justification*: Mathematical basis contract violation and specification contradiction. `space.fib-1` claims Class A derivation from $F_1/F_2 = 1$ but ships as 2px ($0.125\text{rem}$), which violates the algebraic sequence and fits the exact definition of a Class C registered exception.
- **Citation**:
  - `foundations/proportion.md:42-44, 50, 61`
  - `tokens/vd3.tokens.json:115-116`
  - `scripts/verify-tokens.mjs:166-172`
- **Observation & Logic**:
  In `tokens/vd3.tokens.json` line 116:
  ```json
  "fib-1": {
    "$value": "0.125rem",
    "$description": "2px · --vd-space-fib-1",
    "$extensions": {
      "vd3": {
        "class": "A",
        "derivation": "Fibonacci F_1/F_2 = 1, rounded to 2px for baseline screen grid"
      }
    }
  }
  ```
  In `foundations/proportion.md` line 61:
  `| space.fib-1 | --vd3-space-fib-1 | 0.125rem | 2px | $F_1 / F_2$ | Class A | 1px rounded to 2px for baseline screen grid |`
  However, `foundations/proportion.md` line 42 defines Class A as: "Derived from Fibonacci, Lucas, or powers of $\phi$. Verified by automated test suites." Line 44 defines Class C as: "Physical hardware, GPU, or a11y overrides math | Must appear in the Exceptions Registry below; re-reviewed at each major release."
  Exception `C-01` in line 50 states: "Rem-rounded small spacing steps | Spacing tokens named `fib-2/3/5/8` ship as 4/6/8/12px to align with 4px subpixel rasterization grids; sequence is literal from 13px onwards." (Notice `fib-1` is omitted from the table description).
  Yet in `tokens/vd3.tokens.json` line 115, the description states: `"Values <= 12px follow registered exception C-01 (rem-rounded 2/4/6/8/12); literal from 13px."` (Notice 2px is included).
  In `scripts/verify-tokens.mjs` lines 166-172:
  ```javascript
  const c01Expected = { 'fib-1': 2, 'fib-2': 4, 'fib-3': 6, 'fib-5': 8, 'fib-8': 12 };
  ```
  If `space.fib-1` is 2px ($0.125\text{rem}$) because 1px is rounded to 2px for subpixel rendering, it is by definition an exception to the Fibonacci sequence ($F_1 = 1 \ne 2$). Classifying it as Class A creates an internal contradiction in the mathematical spine (note `tests/e2e/tier1-features/tokens-math.test.mjs:121, 138-142` records `basis: 'A'` in its expectation object and checks `$description` for `'C-01'`/`'rounded'`/`'exception'` on `C-01` tokens, while `site/src/spec.ts:24` checks `/C-01/.test(v.$description ?? '')` for the `SpacingDemo.vue` `C-01` badge).
- **Concrete Remediation Recommendation**:
  Update `tokens/vd3.tokens.json` line 116 to classify `space.fib-1` as `"class": "C"`, `"exceptionId": "C-01"`, include `"C-01"` in `"$description"` (e.g. `"2px · C-01 · --vd-space-fib-1"`), and set derivation to `"Rem-rounded small spacing step (1px rounded to 2px for baseline screen grid)"`. Update `foundations/proportion.md` lines 50 and 61 to include `fib-1` in Exception C-01 (`fib-1/2/3/5/8 ship as 2/4/6/8/12px`) and mark its Basis as `Class C-01`. Align the fixture metadata in `tests/e2e/tier1-features/tokens-math.test.mjs:121` (`basis: 'A'` -> `'C-01'`).

---

#### [F-MATH-002] Modular Typography Scale Value Drift & Mathematical Claim Mismatch (`lg` through `4xl`)
- **Criticality Tier**: **Critical**
  - *Justification*: Specification contradiction, token format inconsistency, and value drift between DTCG token source of truth and CSS export.
- **Citation**:
  - `tokens/vd3.tokens.json:250-264`
  - `tokens/tokens.css:122-126, 130-134`
  - `foundations/typography.md:13-24`
  - `scripts/verify-tokens.mjs:276-301, 650`
- **Observation & Logic**:
  In `tokens/vd3.tokens.json`:
  - `type.size.lg`: `"$value": "1.125rem"`, derivation: `"Modular typography step 16 * sqrt(phi)^1"`
  - `type.size.xl`: `"$value": "1.25rem"`, derivation: `"Modular typography step 16 * sqrt(phi)^2 = 16 * phi"`
  - `type.size.2xl`: `"$value": "1.5rem"`, derivation: `"Modular typography step 16 * sqrt(phi)^3"`
  - `type.size.3xl`: `"$value": "1.875rem"`, derivation: `"Modular typography step 16 * sqrt(phi)^4 = 16 * phi^2"`
  - `type.size.4xl`: `"$value": "2.25rem"`, derivation: `"Modular typography step 16 * sqrt(phi)^5"`
  - `type.size.5xl`: `"$value": "clamp(2.8rem, 2.27rem + 2.65vw, 4.25rem)"`
  - `type.size.6xl`: `"$value": "clamp(3.36rem, 2.63rem + 3.65vw, 5.375rem)"`
  In reality:
  - $1.125\text{rem} = 18\text{px}$, whereas $16 \times \sqrt{\phi} = 20.35\text{px}$.
  - $1.25\text{rem} = 20\text{px}$, whereas $16 \times \phi = 25.89\text{px}$.
  - $1.5\text{rem} = 24\text{px}$, whereas $16 \times (\sqrt{\phi})^3 = 32.93\text{px}$.
  - $1.875\text{rem} = 30\text{px}$, whereas $16 \times \phi^2 = 41.89\text{px}$.
  - $2.25\text{rem} = 36\text{px}$, whereas $16 \times (\sqrt{\phi})^5 = 53.28\text{px}$.
  The calculated values $20\text{px}, 26\text{px}, 33\text{px}, 42\text{px}, 53\text{px}$ are the MAXIMUM bounds of fluid clamp expressions (`clamp(..., 1.25rem)`, `clamp(..., 1.625rem)`, `clamp(..., 2.0625rem)`, etc.), while the `$value` stored in `vd3.tokens.json` for `lg`..`4xl` is the static value (`1.125rem`..`2.25rem`).
  Furthermore, in `tokens/tokens.css` lines 122-126 (matching the fluid strings in `foundations/typography.md` and `vd3.tokens.json` `$description` fields):
  ```css
  --vd3-font-size-lg: clamp(1.125rem, 1.08rem + .22vw, 1.25rem);
  --vd3-font-size-xl: clamp(1.35rem, 1.25rem + .5vw, 1.625rem);
  --vd3-font-size-2xl: clamp(1.62rem, 1.46rem + .8vw, 2.0625rem);
  --vd3-font-size-3xl: clamp(1.94rem, 1.69rem + 1.25vw, 2.625rem);
  --vd3-font-size-4xl: clamp(2.33rem, 1.97rem + 1.8vw, 3.3125rem);
  ```
  `tokens.css` exports fluid `clamp(...)` expressions for `--vd3-font-size-lg..4xl`, directly drifting from the DTCG `$value` (`1.125rem`..`2.25rem`)—and for `xl..4xl` the `clamp()` minimum bounds (`1.35rem`..`2.33rem`) also differ from `--vd3-font-size-*-static` (`1.25rem`..`2.25rem`). Meanwhile, `tokens.css` lines 130-134 export `--vd3-font-size-*-static`, which do not exist as DTCG tokens in `vd3.tokens.json`.
  In `scripts/verify-tokens.mjs`, Suite 18 drift gate only tests if `cssVarFor(tokenPath)` is in `definedVars`, never verifying value equivalence, allowing this value drift to go undetected.
- **Concrete Remediation Recommendation**:
  Restructure `type.size` in `tokens/vd3.tokens.json` to have an explicit architecture: either store the fluid `clamp(...)` as `$value` for all `lg`..`6xl` (matching `tokens.css`), with an explicit nested `$extensions.vd3.static` property for the static mobile fallback, OR tokenize separate `type.size.fluid.*` and `type.size.static.*` tokens. Update `scripts/verify-tokens.mjs` Suite 18 to assert value equality between `vd3.tokens.json` and `tokens.css`.

---

#### [F-MATH-003] 43 Undocumented & Un-tokenized `--vd3-*` Custom Properties in `tokens.css`
- **Criticality Tier**: **Critical**
  - *Justification*: Violates First Principles `PRN-001` ("The system MUST NOT contain undocumented visual constants... Every constant carries a basis class... There is no Class D — an unclassifiable constant is a specification defect") and `PRN-002` ("One source of truth").
- **Citation**:
  - `tokens/tokens.css:39-49, 54-57, 116-118, 130-134, 142-146, 148-153, 172-177, 286, 292, 298, 477, 534, 540`
  - `tokens/vd3.tokens.json:1-388`
  - `foundations/principles.md:7-16`
- **Observation & Logic**:
  There are 201 distinct `--vd3-*` properties declared in `tokens/tokens.css`, but only 169 leaf tokens in `tokens/vd3.tokens.json`. Exactly 43 `--vd3-*` custom properties in `tokens.css` have NO corresponding token in `tokens/vd3.tokens.json`:
  1. Pixel spacing scale (11): `--vd3-spacing-1`, `--vd3-spacing-2`, `--vd3-spacing-3`, `--vd3-spacing-5`, `--vd3-spacing-8`, `--vd3-spacing-13`, `--vd3-spacing-21`, `--vd3-spacing-34`, `--vd3-spacing-55`, `--vd3-spacing-89`, `--vd3-spacing-144`.
  2. Border widths (4): `--vd3-border-width-hair`, `--vd3-border-width-thin`, `--vd3-border-width-regular`, `--vd3-border-width-thick` (`tokens.json` only defines `line.*`).
  3. Font families (3): `--vd3-font-family-sans`, `--vd3-font-family-serif`, `--vd3-font-family-mono`.
  4. Static font sizes (5): `--vd3-font-size-lg-static`, `--vd3-font-size-xl-static`, `--vd3-font-size-2xl-static`, `--vd3-font-size-3xl-static`, `--vd3-font-size-4xl-static`.
  5. Duplicate line heights (5): `--vd3-leading-tight`, `--vd3-leading-snug`, `--vd3-leading-normal`, `--vd3-leading-relaxed`, `--vd3-leading-loose` (duplicates `--vd3-line-height-*`).
  6. Duplicate tracking (6): `--vd3-letter-spacing-tighter` through `widest` (duplicates `--vd3-tracking-*`).
  7. Named shadows (6): `--vd3-shadow-sm`, `--vd3-shadow`, `--vd3-shadow-md`, `--vd3-shadow-lg`, `--vd3-shadow-xl`, `--vd3-shadow-2xl`.
  8. Dynamic density scale (1): `--vd3-density-scale`.
  9. Canvas RGB triplet (1): `--vd3-color-canvas-rgb`.
  10. Subtle border color (1): `--vd3-color-border-subtle`.
- **Concrete Remediation Recommendation**:
  Tokenize these variables into `tokens/vd3.tokens.json` under appropriate namespaces (e.g. `font.family.*`, `spacing.px.*`, `shadow.named.*`, `color.role.border-subtle`, `color.role.canvas-rgb`) with full `$extensions.vd3.class` annotations, OR remove redundant duplicate aliases in `tokens.css` (e.g. `--vd3-leading-*` and `--vd3-letter-spacing-*`, preserving only the normative `--vd3-line-height-*` and `--vd3-tracking-*`).

---

#### [F-MATH-004] Dark Theme Elevation Shadows Lack DTCG Single-Source-of-Truth in `vd3.tokens.json`
- **Criticality Tier**: **High**
  - *Justification*: Normative standard deviation and architectural divergence from `PRN-002` ("A design decision exists in exactly one place: a single-source-of-truth DTCG token").
- **Citation**:
  - `tokens/tokens.css:548-553`
  - `tokens/vd3.tokens.json:92-111`
  - `foundations/elevation.md:22-24`
  - `foundations/principles.md:14-16`
- **Observation & Logic**:
  In `tokens/tokens.css` lines 548-553, under `[data-theme="dark"]`, `--vd3-shadow-1` through `--vd3-shadow-6` are overridden with dark-adapted box-shadow values (`#00000033`, `#0000004d`, `#00000080`).
  In `foundations/elevation.md` lines 22-24, this theme adaptation is documented as a normative requirement.
  However, in `tokens/vd3.tokens.json` lines 92-111, `theme.dark` contains ONLY `color: { role: { ... } }`. There is NO `theme.dark.shadow` group. The dark mode shadow values in `tokens.css` therefore exist solely as hardcoded CSS rules without an authoritative DTCG token representation.
- **Concrete Remediation Recommendation**:
  Add a `shadow` group under `theme.dark` in `tokens/vd3.tokens.json` with the 6 dark composite values and their corresponding Class A basis derivations, matching the structure of `theme.dark.color.role`.

---

#### [F-MATH-007] `conventions/naming.md` Conflicts with Zero-Framework Pure CSS Architecture (PRN-004)
- **Criticality Tier**: **High**
  - *Justification*: Direct specification conflict between `conventions/naming.md` and First Principles `PRN-004`.
- **Citation**:
  - `conventions/naming.md:5-14, 37-44`
  - `foundations/principles.md:20-21`
  - `AGENTS.md:§3`
- **Observation & Logic**:
  In `conventions/naming.md` lines 37-44:
  `- **Components** — Vue SFC, PascalCase, one word where possible (Dialog.vue, DatePicker.vue).`
  `- **Composables** — use⟨Feature⟩, one composable per interaction; composables are the behavior contract, markup is the presentation.`
  `- **Props** — camelCase in script, kebab-case in templates...`
  `- **Events** — past tense or state verb (closed, change)...`
  This directly contradicts `PRN-004` ("Zero-framework core surface: The core design system components, layout primitives, and typography are zero-framework pure HTML5 and modern CSS... zero client JavaScript runtime to render cleanly") and `AGENTS.md` §3 ("components/ ships 35 zero-framework CSS modules... zero Vue/React/Svelte runtime references").
  Furthermore, `conventions/naming.md` line 7 states: "CSS — custom properties always prefixed `--vd-`: the v1.9 prefix, kept verbatim for backwards compatibility". It completely omits the normative `--vd3-*` prefix established throughout the v1.1.0 specification.
- **Concrete Remediation Recommendation**:
  Update `conventions/naming.md` to specify the normative `--vd3-*` prefix for core tokens, with `--vd-*` as backwards-compatible aliases. Move Vue SFC, composable, prop, and event naming conventions into a dedicated "Implementing Libraries & Documentation Site" section or remove them from core conventions.

---

#### [F-MATH-010] Stale "Proposed / Not Yet Present" Status Notes in `foundations/icons.md` and `foundations/density.md`
- **Criticality Tier**: **Medium**
  - *Justification*: Documentation staleness leading to confusion about token integration status.
- **Citation**:
  - `foundations/icons.md:22, 56, 117-120`
  - `foundations/density.md:16, 18, 20, 125`
  - `tokens/vd3.tokens.json:146-174, 175-190`
- **Observation & Logic**:
  In `foundations/icons.md` lines 22, 56, and 117-120: "The corresponding `icon` token group is NOT yet present in `tokens/vd3.tokens.json` (verified: no `icon` key exists). The ready-to-merge snippet below is the proposed group..."
  In `foundations/density.md` lines 16, 18, 20, and 125: "This file does not edit `tokens/`; the block below is the normative snippet for the follow-up token edit" (and line 16 calls the `AGENTS.md §2` hook list a "follow-up edit" even though `data-density="compact"` is already documented there).
  In reality, both `icon` and `density` groups were integrated into `tokens/vd3.tokens.json` (lines 146-174 and 175-190) and verified by `scripts/verify-tokens.mjs`.
- **Concrete Remediation Recommendation**:
  Update `foundations/icons.md` and `foundations/density.md` to reflect that the tokens are integrated, normative, and verified.

---

#### [F-MATH-011] Missing `focus-glow` Role in `foundations/color.md` Semantic Role Table
- **Criticality Tier**: **Medium**
  - *Justification*: Omission of a production semantic color role from normative documentation.
- **Citation**:
  - `foundations/color.md:31-42`
  - `tokens/vd3.tokens.json:86, 105`
  - `tokens/tokens.css:300, 542`
  - `scripts/verify-tokens.mjs:565-568`
- **Observation & Logic**:
  `tokens/vd3.tokens.json` (lines 86 & 105) and `tokens/tokens.css` (lines 300 & 542) define `color.role.focus-glow` (light: `rgba(250, 176, 5, 0.4)`, dark: `rgba(255, 212, 59, 0.4)`).
  `scripts/verify-tokens.mjs` lines 565-568 explicitly asserts: `assert(tokens.color?.role?.['focus-glow'] !== undefined)`.
  However, in `foundations/color.md` lines 31-42, `focus-glow` is omitted from the Normative Semantic Role Mapping & Contrast Matrix table.
- **Concrete Remediation Recommendation**:
  Add `focus-glow` (`--vd3-color-focus-glow`) to the semantic role table in `foundations/color.md` documenting its light and dark alpha values and architectural role in the dual-ring focus contract.

---

#### [F-MATH-012] Elevation Shadow Ladder Index Discontinuity (Skipped $F_5, F_6 = (5\text{px}, 8\text{px})$ Pair)
- **Criticality Tier**: **Low**
  - *Justification*: Minor mathematical sequence gap inherited from backwards compatibility.
- **Citation**:
  - `foundations/elevation.md:9-21`
  - `tokens/vd3.tokens.json:202-211`
- **Observation & Logic**:
  `foundations/elevation.md` line 9 specifies: "Each elevation level's y-offset and primary blur radius are a consecutive Fibonacci pair $(F_n, F_{n+1})$".
  The ladder steps are:
  - Level 1: $(F_2, F_3) = (1, 2)$
  - Level 2: $(F_3, F_4) = (2, 3)$
  - Level 3: $(F_4, F_5) = (3, 5)$
  - Level 4: $(F_6, F_7) = (8, 13)$ (skips $n=5$)
  - Level 5: $(F_7, F_8) = (13, 21)$
  - Level 6: $(F_8, F_9) = (21, 34)$
  The consecutive pair $(F_5, F_6) = (5\text{px}, 8\text{px})$ is absent from the 6-level ladder without documented rationale.
- **Concrete Remediation Recommendation**:
  Add an explanatory note to `foundations/elevation.md` noting that Level 4 jumps to $(F_6, F_7)$ for optical separation between compact overlay panels and full modals, preserving legacy v1.9 compatibility.

---

#### [F-MATH-013] Inconsistent Classification of `icon.gap` vs Aliased Spacing Token
- **Criticality Tier**: **Low**
  - *Justification*: Minor taxonomy classification inconsistency.
- **Citation**:
  - `tokens/vd3.tokens.json:168-173`
  - `foundations/proportion.md:64`
- **Observation & Logic**:
  In `tokens/vd3.tokens.json` lines 168-173:
  `"gap": { "$type": "dimension", "$value": "{space.fib-5}", "$description": "8px icon-to-label gap · --vd3-icon-gap", "$extensions": { "vd3": { "class": "A", "derivation": "Alias for space.fib-5 (F_5 = 8px, C-01)" } } }`
  `space.fib-5` is classified as `Class C` under Exception C-01 (8px instead of 5px).
  Other alias tokens in `vd3.tokens.json` (such as `icon.color.*`) are classified as `Class B` citing their target alias. Classifying `icon.gap` as Class A while acknowledging it aliases a C-01 exception creates a taxonomy inconsistency.
- **Concrete Remediation Recommendation**:
  Either classify `icon.gap` as `Class C` citing `exceptionId: "C-01"` or as `Class B` citing `"Alias for space.fib-5"`.

---

#### [F-MATH-014] Incomplete Wildcard Override in `[data-motion="reduce"]` Relative to `@media (prefers-reduced-motion)`
- **Criticality Tier**: **Low**
  - *Justification*: Ergonomic and behavioral discrepancy in reduced motion implementation.
- **Citation**:
  - `tokens/tokens.css:559-602`
  - `foundations/motion.md:46-74`
- **Observation & Logic**:
  In `tokens/tokens.css` lines 578-583, `@media (prefers-reduced-motion: reduce)` includes:
  `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`
  However, in `[data-motion="reduce"]` (lines 586-602), only the duration CSS variables are set to `0ms`. Non-variable animations and smooth scrolling are not suppressed under manual attribute selection.
- **Concrete Remediation Recommendation**:
  Add the `[data-motion="reduce"], [data-motion="reduce"] *, [data-motion="reduce"] *::before, [data-motion="reduce"] *::after` rule to `tokens/tokens.css` (including `[data-motion="reduce"]` itself so root `html { scroll-behavior: smooth; }` is also overridden) to achieve complete parity with the media query contract.

---

#### [F-MATH-015] Dimensionless Golden Angle Token in JSON vs Degree Unit in CSS (`math.golden-angle`)
- **Criticality Tier**: **Low**
  - *Justification*: Minor unit typing inconsistency in DTCG representation.
- **Citation**:
  - `tokens/vd3.tokens.json:30-34`
  - `tokens/tokens.css:21`
- **Observation & Logic**:
  In `tokens/vd3.tokens.json` lines 30-34, `math.golden-angle` has `$value: 137.507764` with `$type: "number"`.
  In `tokens/tokens.css` line 21, `--vd3-golden-angle: 137.507764deg;` has explicit unit `deg`.
  While mathematical constants are unitless, this token is consumed as an angular rotation/hue step in CSS and Figma.
- **Concrete Remediation Recommendation**:
  Document in `vd3.tokens.json` that consumers must append `deg` when applying `math.golden-angle` in CSS transforms or color functions, or declare a dedicated dimension token `angle.golden`.

---

### 4.2 Domain B: Token Architecture, Formats & Tooling Bindings

#### [F-MATH-005] Figma Binding Manifest Mappings Point to Non-Existent CSS Variables and Mismatched Primary Hue
- **Criticality Tier**: **High**
  - *Justification*: Normative standard deviation, breaking contract for design-to-code pipelines, and architectural divergence between Figma design manifest and actual CSS tokens.
- **Citation**:
  - `tokens/figma.manifest.json:80-101`
  - `tokens/tokens.css:439-469`
  - `foundations/color.md:11, 39-40`
- **Observation & Logic**:
  In `tokens/figma.manifest.json` lines 80-101 (`VD3 Semantic Theme`), Figma variables are mapped to `web` syntax strings (and line 74 declares `"normativeTokenPattern": "--vd3-color-primitive-<family>-<step>"`, whereas `tokens/tokens.css:229-246` exports `--vd3-color-<family>-<step>` without `-primitive-`):
  - `"color/primary"` (line 90) maps to `"web": "var(--vd-color-primary)"`, with `"light": "blue/7", "dark": "gold/3"`, `"color/primary-hover"` (line 91) maps to `"web": "var(--vd-color-primary-hover)"` with `"light": "blue/8", "dark": "gold/4"`, and `"color/focus"` (line 92) maps `"light": "gold/4", "dark": "gold/3"`. However, in `foundations/color.md` lines 11, 39-40 and `tokens/vd3.tokens.json`, the light primary/focus color is `gold.6` (`#fab005`), light interactive/hover is `gold.7` (`#f59f00`), NOT Blue, and dark mode uses `gold.4` (`gold/3` and `blue` do not exist in `vd3.tokens.json`).
  - Neutral gray steps also drift from `tokens/vd3.tokens.json:82, 98-100`: `"bg/canvas"` (line 81) maps dark mode to `"gray/10"` rather than `gray.9`; `"bg/layer"` (line 82) maps dark mode to `"gray/9"` rather than `gray.8`; `"bg/layer-hover"` (line 83) maps dark mode to `"gray/8"` rather than `gray.7`; `"text/primary"` (line 84) maps light mode to `"gray/9"` rather than `gray.1000` (`#1a1d20`, corresponding to Figma anchor `"gray/10"` at line 72); and `"text/muted"` (line 86) maps to `"gray/6"` / `"gray/5"` whereas `tokens/tokens.css:463` aliases `--vd-text-muted` to `--vd3-color-text-secondary` (`gray.7` / `gray.3`).
  - Ten variables in `VD3 Semantic Theme` point to `--vd-*` CSS custom properties that do not exist in `tokens/tokens.css` or `tokens/vd3.tokens.json`:
    1. `"text/on-primary"` → `"var(--vd-text-inverse)"` (line 87)
    2. `"border/subtle"` → `"var(--vd-border-color-light)"` (line 89)
    3. `"color/focus"` → `"var(--vd-color-focus)"` (line 92)
    4. `"color/success"` → `"var(--vd-color-success)"` (line 93)
    5. `"color/success-subtle"` → `"var(--vd-success-0)"` (line 94)
    6. `"color/warning"` → `"var(--vd-color-warning)"` (line 95)
    7. `"color/warning-subtle"` → `"var(--vd-warning-0)"` (line 96)
    8. `"color/danger-subtle"` → `"var(--vd-danger-0)"` (line 98)
    9. `"color/info"` → `"var(--vd-color-info)"` (line 99)
    10. `"color/info-subtle"` → `"var(--vd-info-0)"` (line 100)
- **Concrete Remediation Recommendation**:
  Reconcile `tokens/figma.manifest.json` with `tokens/tokens.css` and `tokens/vd3.tokens.json`:
  1. Correct `"color/primary"` (`"blue/7"` → `"gold/6"` light, `"gold/3"` → `"gold/4"` dark), `"color/primary-hover"` (`"blue/8"` → `"gold/7"` light), `"color/focus"` (`"gold/4"` → `"gold/6"` light, `"gold/3"` → `"gold/4"` dark), `"bg/canvas"` (`"gray/10"` → `"gray/9"` dark), `"bg/layer"` (`"gray/9"` → `"gray/8"` dark), `"bg/layer-hover"` (`"gray/8"` → `"gray/7"` dark), `"text/primary"` (`"gray/9"` → `"gray/10"` / `gray.1000` light), `"text/muted"` (`gray/6`/`gray/5` → `gray/7`/`gray/3` if aligned with `--vd-text-muted`), and line 74's `normativeTokenPattern` (`--vd3-color-<family>-<step>`).
  2. Either export `--vd-color-focus`, `--vd-color-success`, `--vd-color-warning`, `--vd-color-info`, `--vd-border-color-light`, `--vd-text-inverse`, and subtle variants in `tokens.css` and `vd3.tokens.json`, or update `figma.manifest.json` to reference the existing semantic tokens (`--vd3-color-focus`, `--vd3-color-critical`, `--vd3-color-border-subtle`, etc.).

---

#### [F-MATH-006] `tokens/tokens.d.ts` Type Definition Gaps (`focus`, `icon`, `density`, and `--vd3-icon-*`, `--vd3-density-*`)
- **Criticality Tier**: **High**
  - *Justification*: Discrepancy between TypeScript definitions, DTCG schema, and token source of truth, violating `docs/token-sync.md` procedure step 4.
- **Citation**:
  - `tokens/tokens.d.ts:72-85, 282-304, 308-349`
  - `tokens/schema.json:7`
  - `tokens/vd3.tokens.json:136-145, 146-174, 175-190`
- **Observation & Logic**:
  `tokens/schema.json` line 7 requires: `["$description", "$vd3", "math", "color", "theme", "space", "line", "focus", "icon", "density", "radius", "shadow", "glow", "z", "container", "breakpoint", "type", "motion", "easing", "aspect", "glass"]`.
  In `tokens/tokens.d.ts` lines 282-304, the `VD3Tokens` interface declares 18 properties (16 token groups plus `$description` and `$vd3`) but completely omits `focus`, `icon`, and `density`.
  `VD3ColorRoleTokens` (lines 72-85) omits `'focus-glow'`.
  `VD3CSSPropertyName` (lines 308-349) omits all `--vd3-icon-*` and `--vd3-density-*` properties, as well as `--vd3-font-family-*`, `--vd3-font-size-*-static`, and `--vd3-color-canvas-rgb`; similarly, `VDCSSPropertyName` (lines 351-386) omits `--vd-font-family-sans` and `--vd-font-family-mono` emitted under `[data-font]` (`tokens/tokens.css:496-526`).
  `scripts/verify-typecheck.mjs` runs `esbuild.transform` and `vue/compiler-sfc` (transpilation/import checks without running `tsc` or `vue-tsc` semantic typechecking, and without validating `tokens/vd3.tokens.json` against `VD3Tokens`), so this defect was never caught by automated CI.
- **Concrete Remediation Recommendation**:
  Add `VD3FocusTokens`, `VD3IconTokens`, and `VD3DensityTokens` interfaces to `tokens/tokens.d.ts`. Add `focus`, `icon`, and `density` to `VD3Tokens`. Add `'focus-glow'` to `VD3ColorRoleTokens`. Add `--vd3-icon-*`, `--vd3-density-*`, `--vd3-font-family-*`, `--vd3-font-size-*-static`, and `--vd3-color-canvas-rgb` to `VD3CSSPropertyName`, and add `--vd-font-family-sans` and `--vd-font-family-mono` to `VDCSSPropertyName`.

---

#### [F-MATH-008] Ghost Variable Names in `conventions/mappings.md`
- **Criticality Tier**: **Medium**
  - *Justification*: Documentation inconsistency and spec-implementation discrepancy.
- **Citation**:
  - `conventions/mappings.md:9-20`
  - `tokens/tokens.css:458-468`
  - `conventions/naming.md:18-23`
- **Observation & Logic**:
  In `conventions/mappings.md` lines 9-20, the cross-system translation table cites vd3 roles as `--vd-canvas`, `--vd-layer`, `--vd-layer-hover`, `--vd-border`, `--vd-focus`, `--vd-interactive`, `--vd-critical`.
  None of these variables exist as `--vd-*` in `tokens/tokens.css`.
  In `tokens.css` lines 458-468 and `conventions/naming.md` lines 18-23, the backwards-compatible names are `--vd-bg-primary`, `--vd-bg-secondary`, `--vd-bg-tertiary`, `--vd-border-color`, `--vd-color-primary`, `--vd-color-primary-hover`, and `--vd-color-error`. The normative names are `--vd3-color-canvas`, `--vd3-color-layer`, etc.
- **Concrete Remediation Recommendation**:
  Update the "vd3 role" column in `conventions/mappings.md` to display both the normative `--vd3-color-*` custom property and the backwards-compatible `--vd-*` alias (e.g. `--vd3-color-canvas` / `--vd-bg-primary`).

---

#### [F-MATH-009] Missing Legacy `--vd-icon-*` Aliases Documented in Foundations & DTCG Tokens
- **Criticality Tier**: **Medium**
  - *Justification*: Discrepancy between foundation/token documentation and `tokens/tokens.css` exports.
- **Citation**:
  - `foundations/icons.md:97-98, 124`
  - `tokens/vd3.tokens.json:147`
  - `tokens/tokens.css:306-469`
- **Observation & Logic**:
  `foundations/icons.md` lines 97-98 and 124 and `tokens/vd3.tokens.json` line 147 explicitly state that `icon.*` tokens map to `--vd3-icon-*` with legacy aliases `--vd-icon-*` (`icon.size.sm` → `--vd3-icon-size-sm`, legacy alias `--vd-icon-size-sm`).
  However, in `tokens/tokens.css` section 18 (lines 306-469), NO `--vd-icon-*` legacy aliases are exported. (Note: similarly, the newer v1.0.2/v1.1 `focus.ring.*` and `density.scale.*` groups only export `--vd3-*` variables in `tokens.css`, though `foundations/focus.md:27` and `foundations/density.md:47` intentionally omit `--vd-focus-ring-*` and `--vd-density-*` aliases and only promise automatic inheritance of `--vd-space-fib-*`).
- **Concrete Remediation Recommendation**:
  Add backwards-compatible `--vd-icon-*` aliases pointing to their `--vd3-icon-*` counterparts in `tokens/tokens.css` section 18 (and decide whether `conventions/naming.md` requires `--vd-*` aliases for `focus.ring.*`/`density.scale.*`), OR update `foundations/icons.md` and `tokens/vd3.tokens.json:147` to clarify that legacy `--vd-` aliases are not provided for new v1.1 tokens.

---

### 4.3 Domain C: Component Specifications & Zero-Framework CSS Primitives

#### [F-COMP-001] Total Absence of Focus Indicators in Dialog (`dialog.css`) Masked by Hardcoded Test Array
- **Criticality Tier**: **Critical**
  - *Justification*: Severe WCAG 2.4.7 / 2.4.13 non-compliance and violation of `FOC-001`/`FOC-002`. An interactive overlay surface renders completely without focus indication, masked in test suites by hardcoded array omissions.
- **Citation**:
  - `components/dialog.css:1-134`
  - `scripts/verify-components.mjs:1022-1045`
  - `foundations/focus.md:7-25`
  - `components/dialog/spec.md:18, 30`
- **Observation & Logic**:
  Searching `components/dialog.css` for `focus` or `:focus-visible` returns 0 matches.
  Lines 8-33 declare the `.vd-dialog` container; lines 100-103 declare:
  ```css
  .vd-dialog__close,
  .vd-dialog-close {
    margin-inline-start: auto;
  }
  ```
  Neither `.vd-dialog` nor `.vd-dialog-close` declares `outline` or `box-shadow` focus rings.
  Specification contract: `foundations/focus.md` (`FOC-001`, `FOC-002`, `FOC-004`) and `components/dialog/spec.md:18, 30` (`DLG-001`: "On open, focus moves to the first focusable element, or the dialog surface if none").
  In `scripts/verify-components.mjs:1022-1045`, the `focusFiles` array explicitly enumerates 30 files:
  ```javascript
  const focusFiles = [
    'button.css', 'form.css', 'badge.css', 'navbar.css',
    'accordion.css', 'table.css', 'code.css', 'toast.css',
    'switch.css', 'alert.css', 'tabs.css',
    'drawer.css', 'popover.css', 'menu.css', ...
  ```
  Out of 36 CSS files in `components/`, `focusFiles` checks 30 and omits 6: `dialog.css`, `card.css` (which does implement `:focus-visible` at `card.css:102-111`), `tooltip.css` (`pointer-events: none`), `hover-card.css`, `layout.css`, and `index.css`. Consequently, `pnpm test:components` passed cleanly despite `dialog.css` completely lacking focus indicators.
- **Concrete Remediation Recommendation**:
  Add `:focus-visible` indicators to `.vd-dialog` and `.vd-dialog-close` in `components/dialog.css` adhering to `FOC-001`/`FOC-002` (2px solid outline or dual-ring box-shadow). Add `dialog.css` to `focusFiles` in `scripts/verify-components.mjs` and refactor the test suite to scan all `components/*.css` files dynamically.

---

#### [F-COMP-002] Textarea Primitive Styling & Accessibility Failure (`form.css`)
- **Criticality Tier**: **Critical**
  - *Justification*: Core primitive styling failure. Standalone `<textarea class="vd-textarea">` renders without borders, padding, font, background, focus rings, or validation states.
- **Citation**:
  - `components/form.css:26-47, 125-171, 209-234`
  - `components/input/spec.md:44-45`
- **Observation & Logic**:
  In `components/form.css:26-47`, base input properties are assigned solely to `.vd-input`:
  ```css
  .vd-input {
    width: 100%;
    box-sizing: border-box;
    font-family: inherit;
    font-size: var(--vd3-font-size-base, 1rem);
    line-height: var(--vd3-line-height-tight, 1.236);
    padding: var(--vd3-space-fib-5, 0.5rem) var(--vd3-space-fib-8, 0.75rem);
    border: var(--vd3-border-width-thin, 2px) solid var(--vd3-color-border, #dee2e6);
    border-radius: var(--vd3-radius-fib-5, 0.3125rem);
    background-color: var(--vd3-color-canvas, #ffffff);
    color: var(--vd3-color-text-primary, #1a1d20);
    transition: ...
  }

  .vd-textarea {
    min-height: var(--vd3-space-fib-89, 5.5625rem);
    resize: vertical;
    line-height: var(--vd3-line-height-normal, 1.5);
  }
  ```
  Line 42 is the sole occurrence of `.vd-textarea` in `form.css`.
  `.vd-textarea` is omitted from lines 125-128 (`:focus-visible`), lines 138-141 (`:user-invalid`), lines 145-148 (`:user-invalid:focus-visible`), lines 158-165 (`:disabled`), lines 209-210 (`:read-only`), and lines 220-233 (reduced motion).
  Specification contract: `components/input/spec.md:44-45` specifies:
  `Native markup only: <input class="vd-input" id="…" type="text">, <textarea class="vd-textarea" id="…">.`
- **Concrete Remediation Recommendation**:
  Update `components/form.css` to group `.vd-input, .vd-textarea` across all shared rules: base geometry, borders, backgrounds, typography, transitions, `:focus-visible` dual ring, `:user-invalid`, `:disabled`, `:read-only`, and reduced motion.

---

#### [F-COMP-003] Architectural Contradiction Between Full-Screen Blocking Backdrop and Non-Modal Specification (`drawer`)
- **Criticality Tier**: **High**
  - *Justification*: Architectural contradiction, APG non-modal violation, and accessibility trap. A component specified as non-modal renders a full-viewport pointer-blocking backdrop overlay. *(Consolidates duplicate track finding formerly tracked as `F-SITE-006`.)*
- **Citation**:
  - `components/drawer/spec.md:14-25, 45-51`
  - `components/drawer.css:8-27`
- **Observation & Logic**:
  In `components/drawer.css:8-27`:
  ```css
  .vd-drawer-backdrop {
    position: fixed;
    inset: 0;
    z-index: var(--vd3-z-modal-backdrop, 1040);
    background-color: color-mix(in srgb, var(--vd3-color-gray-1000, #1a1d20) 55%, transparent);
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
  .vd-drawer-backdrop[data-open="true"] {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  ```
  In `components/drawer/spec.md:14-15, 45-51`:
  "This component is the NON-MODAL variant of the APG Dialog (Modal) pattern: background stays interactive, focus is not trapped."
  "Tab / Shift+Tab | Cycle through the drawer's focusable elements; in the non-modal variant focus is NOT trapped and may leave the drawer".
  Pairing a full-screen blocking backdrop (`pointer-events: auto`, `z-index: 1040`) with a non-modal spec creates an accessibility trap: keyboard users can Tab out of the drawer into background content that pointer users cannot click, and which is visually obscured by the backdrop dimmer.
- **Concrete Remediation Recommendation**:
  Align specification and implementation: either designate the drawer as a modal surface (requiring APG focus trap, `inert` background, `aria-modal="true"`, or native `<dialog>.showModal()` per `modern-web-guidance` `navigation-drawer`), or remove the blocking `.vd-drawer-backdrop` / set `pointer-events: none` (matching `tour.css`) and specify `<dialog popover="manual">` for true non-modal off-canvas panels per `modern-web-guidance` (`dialog` guide, Rule 2).

---

#### [F-COMP-004] Invalid `:read-only` Selector on Native `<select>` Overriding Specified Canvas Background
- **Criticality Tier**: **High**
  - *Justification*: CSS Standards deviation (WHATWG HTML §4.10) causing all default `<select>` elements to render with wrong layer background.
- **Citation**:
  - `components/form.css:209-212`
  - `components/select/spec.md:23`
- **Observation & Logic**:
  `components/form.css:209-212`:
  ```css
  /* Read-only fields */
  .vd-input:read-only,
  .vd-select:read-only {
    background-color: var(--vd3-color-layer, #f8f9fa);
  }
  ```
  In WHATWG HTML §4.10 and CSS Selectors 4, `<select>` elements cannot be marked `readonly` and by definition match `:read-only` across all standard browser rendering engines. Consequently, every `<select class="vd-select">` renders with `--vd3-color-layer` (`#f8f9fa`) instead of resting `--vd3-color-canvas` (`#ffffff`), directly contradicting `components/select/spec.md:23`.
- **Concrete Remediation Recommendation**:
  Remove `.vd-select:read-only` from `components/form.css` line 210.

---

#### [F-COMP-005] Missing Reduced Motion Overrides (`MOB-001`) in `badge.css`, `code.css`, and `table.css`
- **Criticality Tier**: **High**
  - *Justification*: WCAG 2.3.3 and `foundations/motion.md` (`MOB-001`) non-compliance masked by test suite hardcoding.
- **Citation**:
  - `components/badge.css:136-139, 181-183`
  - `components/code.css:79`
  - `components/table.css:95`
  - `scripts/verify-components.mjs:1070-1077`
- **Observation & Logic**:
  - `components/badge.css:136-139` (`transition` on `.vd-chip`) and `181-183` (`transition` on `.vd-chip-close`).
  - `components/code.css:79` (`transition: background-color var(--vd3-duration-89, 89ms) var(--vd3-ease-out);`).
  - `components/table.css:95` (`transition: background-color var(--vd3-duration-89, 89ms) var(--vd3-ease-out);` on hover).
  Zero occurrences of `@media (prefers-reduced-motion: reduce)` or `[data-motion="reduce"]` exist in these three files.
  In `scripts/verify-components.mjs:1070-1077`, `animatedFiles` is a hardcoded array of 31 files that omits `badge.css`, `code.css`, and `table.css`.
- **Concrete Remediation Recommendation**:
  Add `@media (prefers-reduced-motion: reduce), [data-motion="reduce"]` blocks to `badge.css`, `code.css`, and `table.css` collapsing transitions. Refactor `scripts/verify-components.mjs` to dynamically identify files containing `transition` or `animation` rather than relying on a static list.

---

#### [F-COMP-006] Carousel Slide Translation Inverted in RTL Layouts (`carousel.css`)
- **Criticality Tier**: **High**
  - *Justification*: RTL internationalization defect breaking carousel navigation in right-to-left writing modes.
- **Citation**:
  - `components/carousel.css:19, 78-88`
- **Observation & Logic**:
  In `components/carousel.css:19`:
  ```css
  .vd-carousel-track {
    display: flex;
    transform: translateX(calc(var(--_vd-carousel-index, 0) * -100%));
    transition: transform var(--vd3-duration-377, 377ms) var(--vd3-ease-out);
    will-change: transform;
  }
  ```
  No `[dir="rtl"]` rule is provided for `.vd-carousel-track`. In RTL mode, flex items flow right-to-left; translating `-100% * index` pushes the track into negative coordinate space away from active slide contents.
- **Concrete Remediation Recommendation**:
  Add a `:dir(rtl)` (or `[dir="rtl"]`) rule in `components/carousel.css`:
  ```css
  :dir(rtl) .vd-carousel-track {
    transform: translateX(calc(var(--_vd-carousel-index, 0) * 100%));
  }
  ```
  Also verify whether `.vd-carousel-prev::before` and `.vd-carousel-next::before` directional chevron borders (lines 78-88) should mirror under `:dir(rtl)`.

---

#### [F-COMP-007] Physical Horizontal Text Alignment (`text-align: left|right`) in Table CSS Bypassing RTL Guard
- **Criticality Tier**: **High**
  - *Justification*: RTL internationalization defect and test suite regex blind spot.
- **Citation**:
  - `components/table.css:30, 42, 118`
  - `scripts/verify-components.mjs:977`
- **Observation & Logic**:
  In `components/table.css`:
  - Line 30: `text-align: left;` (on `.vd-table`)
  - Line 42: `text-align: left;` (on `.vd-table-caption`)
  - Line 118: `text-align: right;` (on `.vd-table-cell--numeric`)
  In `scripts/verify-components.mjs:977`:
  `const physical = /(^|[\s;{])(left|right)\s*:|border-(left|right)(-color)?\s*:|background-position[^;]*\b(left|right)\b/;`
  The regex checks `left:` and `right:` positioning properties and borders, but completely misses `text-align: left` and `text-align: right`.
- **Concrete Remediation Recommendation**:
  Replace `text-align: left;` with `text-align: start;` and `text-align: right;` with `text-align: end;` in `components/table.css`. Update the RTL verification regex in `scripts/verify-components.mjs` to include `text-align:\s*(left|right)`.

---

#### [F-COMP-010] Missing Specification Sections and Legacy Token Debt in `dialog/spec.md`
- **Criticality Tier**: **Medium**
  - *Justification*: Specification template non-conformance and legacy token usage.
- **Citation**:
  - `components/dialog/spec.md:1-47`
- **Observation & Logic**:
  `components/dialog/spec.md` is 47 lines long. It omits `## Props / API` and `## Accessibility requirements` sections required by `components/SPEC.md`.
  In `## Tokens consumed` (lines 39-42), it references deprecated tokens:
  `--vd-layer`, `--vd-shadow-4`, `--vd-radius-fib-8`, `--vd-z-modal`, `--vd-text-primary`, `--vd-text-secondary`, `--vd-border`, `--vd-focus`, `--vd-line-regular`, `--vd-space-fib-13`, `--vd-space-fib-21`, `--vd-duration-base`.
  It lacks documentation for anatomy classes defined in `dialog.css` (`.vd-dialog-header` / `.vd-dialog__header`, `.vd-dialog-title` / `.vd-dialog__title`, `.vd-dialog-close` / `.vd-dialog__close`, `.vd-dialog-body` / `.vd-dialog__body`, `.vd-dialog-footer` / `.vd-dialog__footer`, `.vd-dialog--md` / `.vd-dialog-md`).
- **Concrete Remediation Recommendation**:
  Expand `components/dialog/spec.md` to conform to the standard template, document all anatomy classes, and update tokens to the normative `--vd3-*` namespace.

---

#### [F-COMP-011] Pointer Activation Focus Ring Trigger via `:focus-within` in File Upload (`upload.css`)
- **Criticality Tier**: **Medium**
  - *Justification*: Violation of `FOC-001` requirement 1 ("Pointer activations on interactive surfaces MUST NOT display persistent focus rings").
- **Citation**:
  - `components/upload.css:41-48`
  - `foundations/focus.md:57-60`
- **Observation & Logic**:
  `components/upload.css:41`:
  ```css
  .vd-upload:focus-within {
    outline: none;
    border-color: var(--vd3-color-focus, #fab005);
    box-shadow:
      0 0 0 var(--vd3-focus-ring-offset, 2px) var(--vd3-focus-ring-offset-color, var(--vd3-color-canvas, #ffffff)),
      0 0 0 calc(var(--vd3-focus-ring-offset, 2px) + var(--vd3-focus-ring-width, 2px)) var(--vd3-color-focus, #fab005),
      var(--vd3-focus-ring-glow, 0 0 8px var(--vd3-color-focus-glow, rgba(250, 176, 5, 0.4)));
  }
  ```
  Clicking the upload dropzone activates `:focus-within` on the container, triggering a persistent focus ring on mouse click.
- **Concrete Remediation Recommendation**:
  Replace `:focus-within` with `:has(:focus-visible)`:
  ```css
  .vd-upload:has(:focus-visible) { ... }
  ```

---

#### [F-COMP-012] Physical Placement Class Naming Inverted in RTL Layouts (`toast.css`)
- **Criticality Tier**: **Medium**
  - *Justification*: Inverted visual placement in RTL writing modes.
- **Citation**:
  - `components/toast.css:23-25`
- **Observation & Logic**:
  In `components/toast.css:23-25`:
  ```css
  .vd-toast-container--bottom-left { bottom: 0; inset-inline-start: 0; inset-inline-end: auto; }
  .vd-toast-container--top-right   { top: 0; inset-inline-end: 0; bottom: auto; }
  .vd-toast-container--top-left    { top: 0; inset-inline-start: 0; bottom: auto; inset-inline-end: auto; }
  ```
  In RTL (`[dir="rtl"]`), `inset-inline-start` is the physical right edge. Thus, `.vd-toast-container--bottom-left` renders on the bottom-right, and `.vd-toast-container--top-right` renders on the top-left.
- **Concrete Remediation Recommendation**:
  Adopt logical placement modifier names (`--bottom-start`, `--top-end`, `--top-start`) or add physical overrides in `[dir="rtl"]`.

---

#### [F-COMP-013] Untokenized Raw Colors and Arbitrary Geometry Literals in Component CSS
- **Criticality Tier**: **Medium**
  - *Justification*: Direct violation of First Principle `PRN-001` ("The system MUST NOT contain undocumented visual constants").
- **Citation**:
  - `components/toast.css:39-40, 52-53`
  - `components/badge.css:47-105`
  - `components/button.css:74, 80-81, 94, 117, 123, 165-167`
  - `components/code.css:39-40, 95-106`
  - `components/dialog.css:54, 76`, `components/card.css:72, 78-80`, `components/navbar.css:34, 38-40`, `components/form.css:154`
- **Observation & Logic**:
  - `components/toast.css:52-53`:
    ```css
    .vd-toast--info     { border-inline-start-color: #0ab5b5; }
    .vd-toast--success  { border-inline-start-color: #0ac265; }
    ```
    Raw hex without `var(--vd3-*)` tokens or dark theme rules.
  - `components/toast.css:39-40, 64, 66, 95`: `min-width: 280px; max-width: 420px;` (arbitrary, non-Fibonacci/Lucas px), plus untokenized `1.125rem`, `0.125rem`, `1rem`.
  - `components/badge.css:34, 47-105, 151, 171-172, 180, 188`: Raw `rgba(10, 181, 181, ...)`, `#066a6a`, `#3bc9db`, `#066535`, `#69db7c`, `#8f6100`, `#ffd43b`, `#c92a2a`, `#ff8787`, `#0ab5b5`, `#0ac265`, `#fab005`, `#fa5252`, `#212529`, `rgba(0, 0, 0, 0.12)`, plus un-tokenized `0.6875rem` (11px), `1rem` (16px), and `0.7` opacity.
  - `components/badge.css:105`: Defines `.vd-badge--solid.vd-badge--danger` but omits `.vd-badge--critical`.
  - `components/button.css:123`: `--_vd-btn-color: #ffffff;` raw literal, while lines `74, 80-81, 94, 165-167` directly consume primitive tokens (`--vd3-color-gray-1000`, `--vd3-color-gold-7`, `--vd3-color-gray-5`, `--vd3-color-gold-4`) instead of semantic roles and line `117` references an undefined `--vd3-color-border-strong` fallback (`#adb5bd`).
  - `components/code.css:39-40, 95-106`: Raw literals for dark pre fill and syntax token hues.
  - Sibling glass/scrim overlays also retain raw `rgba(...)` literals instead of glass/tint tokens (`dialog.css:54, 76`, `card.css:72, 78-80`, `navbar.css:34, 38-40`, `form.css:154`).
- **Concrete Remediation Recommendation**:
  Replace raw hex literals and pixel bounds with semantic tokens (`--vd3-color-info`, `--vd3-color-success`, `--vd3-color-critical`, etc.) and Fibonacci/Lucas bounds, while keeping `#hex` fallbacks (or updating `scripts/verify-a11y.mjs:161-175`, which regex-parses `#([0-9a-fA-F]{6})` directly out of `badge.css` and `code.css`).

---

#### [F-COMP-016] Missing Vertical Orientation Support (`aria-orientation="vertical"`) in Tabs CSS
- **Criticality Tier**: **Medium**
  - *Justification*: Omission of an APG specified layout variant.
- **Citation**:
  - `components/tabs.css:12-25`
  - `components/tabs/spec.md:35-38`
- **Observation & Logic**:
  `components/tabs.css:12-25` hardcodes horizontal layout (`display: flex; border-bottom: ...`). It contains no rules for `[aria-orientation="vertical"]` or `.vd-tabs--vertical`, despite `components/tabs/spec.md:35-38` listing `Down arrow`/`Up arrow` navigation and `aria-orientation`.
- **Concrete Remediation Recommendation**:
  Add styles for `[aria-orientation="vertical"]` and `.vd-tabs--vertical` supporting vertical column layout and inline indicator borders.

---

#### [F-COMP-017] Pagination Chevron Glyphs Lack RTL Inversion
- **Criticality Tier**: **Low**
  - *Justification*: Minor RTL glyph orientation defect.
- **Citation**:
  - `components/pagination.css:73-80`
- **Observation & Logic**:
  In `components/pagination.css:73-80`:
  `.vd-pagination-link--prev::before { content: "‹"; }` and `.vd-pagination-link--next::after { content: "›"; }`.
  No RTL override exists, so previous chevrons point left and next chevrons point right in RTL.
- **Concrete Remediation Recommendation**:
  Add `[dir="rtl"]` rules in `pagination.css` swapping the chevron characters or applying `transform: scaleX(-1)`.

---

#### [F-COMP-019] Missing `vd3.utilities` Cascade Layer Declaration in `index.css` Layer Prelude
- **Criticality Tier**: **Low**
  - *Justification*: Inconsistency in cascade layer order declaration.
- **Citation**:
  - `components/index.css:6`
  - `tokens/tokens.css:10`
- **Observation & Logic**:
  `components/index.css:6`: `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components;`
  `tokens/tokens.css:10`: `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities;`
- **Concrete Remediation Recommendation**:
  Append `, vd3.utilities` to the `@layer` prelude in `components/index.css:6`.

---

#### [F-COMP-020] Redundant Hardcoded Dark Theme Focus Override in `pagination.css`
- **Criticality Tier**: **Low**
  - *Justification*: Unnecessary CSS specificity debt.
- **Citation**:
  - `components/pagination.css:117-122`
- **Observation & Logic**:
  `components/pagination.css:117-122` redefines `:focus-visible` with hardcoded dark colors under `[data-theme="dark"]`, while other modules inherit automatically from theme tokens.
- **Concrete Remediation Recommendation**:
  Remove the redundant dark theme rule and let `.vd-pagination-link:focus-visible` consume the theme-switched `--vd3-color-focus` token.

---

### 4.4 Domain D: W3C WAI-ARIA APG Conformance & Interaction Contracts

#### [F-COMP-008] Erroneous "No APG Pattern Exists" Claims in Specifications (Carousel, Breadcrumb, Alert, Button)
- **Criticality Tier**: **High**
  - *Justification*: Normative standard misrepresentation. Specifications falsely assert that no W3C APG pattern exists for four core components that have official APG patterns.
- **Citation**:
  - `components/carousel/spec.md:5, 49-51, 92`
  - `components/breadcrumb/spec.md:5, 36-38, 64`
  - `components/alert/spec.md:5, 54`
  - `components/button/spec.md:5, 56, 100`
- **Observation & Logic**:
  - `components/carousel/spec.md:5, 49-51, 92`: `apg: none`, "No APG carousel pattern exists". (Official W3C APG: `https://www.w3.org/WAI/ARIA/apg/patterns/carousel/`).
  - `components/breadcrumb/spec.md:5, 36-38, 64`: `apg: none`, "No APG breadcrumb pattern exists". (Official W3C APG: `https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/`).
  - `components/alert/spec.md:5, 54`: `apg: none`, "No APG pattern exists for alert banners". (Official W3C APG: `https://www.w3.org/WAI/ARIA/apg/patterns/alert/`).
  - `components/button/spec.md:5, 56, 100`: `apg: none`, "no APG pattern exists for buttons". (Official W3C APG: `https://www.w3.org/WAI/ARIA/apg/patterns/button/`).
- **Concrete Remediation Recommendation**:
  Update frontmatter and body text of these 4 specifications with their official canonical W3C APG URLs and interaction contracts.

---

#### [F-COMP-009] Broken 404 APG URLs for Radio Group and Segmented Control Specs
- **Criticality Tier**: **Medium**
  - *Justification*: Broken external standards hyperlinks in normative specifications.
- **Citation**:
  - `components/radio/spec.md:5`
  - `components/segmented/spec.md:5`
- **Observation & Logic**:
  `components/radio/spec.md:5` and `components/segmented/spec.md:5` cite `apg: https://www.w3.org/WAI/ARIA/apg/patterns/radio/`.
  The canonical W3C APG URL is `https://www.w3.org/WAI/ARIA/apg/patterns/radio-group/`.
- **Concrete Remediation Recommendation**:
  Update URLs to `https://www.w3.org/WAI/ARIA/apg/patterns/radio-group/`.

---

#### [F-COMP-014] Incomplete APG Menubar Horizontal Navigation Contract in `menubar/spec.md`
- **Criticality Tier**: **Medium**
  - *Justification*: Omission of normative APG keyboard sequences for Menubar.
- **Citation**:
  - `components/menubar/spec.md:38-47`
- **Observation & Logic**:
  In `components/menubar/spec.md:38-47`, the keyboard table lists keys within menubar items and dropdown items, but omits:
  - `Right Arrow` inside an open dropdown: close current menu and open next menubar dropdown.
  - `Left Arrow` inside an open dropdown: close current menu and open previous menubar dropdown.
- **Concrete Remediation Recommendation**:
  Add `Right Arrow` and `Left Arrow` submenu navigation keys to the keyboard interaction contract in `components/menubar/spec.md`.

---

#### [F-COMP-015] Incomplete APG Tabpanel Traversal & Orientation Sequences in `tabs/spec.md`
- **Criticality Tier**: **Medium**
  - *Justification*: Omission of normative APG keyboard sequences for Tabs (while conflating horizontal and vertical orientation arrows).
- **Citation**:
  - `components/tabs/spec.md:30-46, 58`
- **Observation & Logic**:
  `components/tabs/spec.md` (lines 42, 46 `TAB-002`, and 58) explicitly selects the APG Automatic Activation variant (`arrow keys move selection, not just focus`), under which `Space`/`Enter` are not required. However, in `components/tabs/spec.md:30-40`, the keyboard table omits:
  - `Tab` when focused on the active tab: moving focus out of the tablist into the active `tabpanel` (or first focusable element inside it).
  - `Shift+Tab`: navigating backwards from the `tabpanel` to the active tab.
  - Orientation separation: lines 35–36 bundle `Right / Down` and `Left / Up` together without distinguishing horizontal (`Left`/`Right`) vs vertical (`Up`/`Down` with `aria-orientation="vertical"`). (Additionally, line 38 erroneously attaches `with aria-orientation` to the optional `Delete` key.)
  - Optionally documenting the **Manual Activation** variant (`Space` / `Enter` to activate the focused tab) if products require deferred panel switching.
- **Concrete Remediation Recommendation**:
  Update `components/tabs/spec.md` keyboard table to document `Tab` (into tabpanel), `Shift+Tab` (back to active tab), horizontal vs vertical (`aria-orientation="vertical"`) arrow key separation, fix the `aria-orientation` typo on `Delete`, and optionally note the APG manual-activation (`Space`/`Enter`) alternative.

---

#### [F-COMP-018] Obsolete "Gaps Flagged for 1.0.3" in Form and Button Specifications
- **Criticality Tier**: **Low**
  - *Justification*: Stale documentation claiming resolved gaps still exist.
- **Citation**:
  - `components/input/spec.md:26, 38-39, 98-101`
  - `components/select/spec.md:90-94`
  - `components/checkbox/spec.md:17, 28, 40, 78-82`
  - `components/radio/spec.md:18, 79-82`
  - `components/button/spec.md:105-107`
- **Observation & Logic**:
  These specifications claim gaps exist (e.g. missing `MOB-001`, missing `:indeterminate` glyph, `readonly` lacking visual state, `textarea` `min-height: 80px`, `20×20` checkbox/radio literal sizing, `#e03131` danger hover literal) that were actually resolved in `components/form.css` (`var(--vd3-space-fib-89)` / `var(--vd3-space-fib-21)` / `:indeterminate` / `:read-only` / `MOB-001` blocks) and `components/button.css:129` (`filter: brightness(0.92)`), and several body sections (`input/spec.md:26, 38-39`, `checkbox/spec.md:17, 28, 40`, `radio/spec.md:18`) still repeat those outdated v1 notes.
- **Concrete Remediation Recommendation**:
  Remove obsolete gap callouts and update the affected anatomy/state prose (`80px` → `space.fib-89` 89px, `20×20` → `space.fib-21` 21px, `:indeterminate` and `:read-only` status) to reflect implemented CSS.

---

*(Note: Drawer's backdrop vs non-modal APG contradiction, formerly duplicated here as `[F-SITE-006]`, has been consolidated under `[F-COMP-003]`.)*

#### [F-SITE-011] Dialog Semantic Landmarks and ARIA Trigger Deviations
- **Criticality Tier**: **High**
  - *Justification*: APG Pattern and semantic HTML deviation. Dialog headers must use heading elements; modal triggers must not use `aria-expanded`.
- **Citation**:
  - `site/src/App.vue:596-620`
  - `scripts/build-ssg.mjs:330-337`
- **Observation & Logic**:
  1. The dialog title is marked up as `<p id="demo-dlg-title" class="vd-dialog-title">VD3 Native Modal Contract</p>` in both `App.vue` and `build-ssg.mjs`. W3C APG and modern web guidelines mandate heading tags (`<h2>` or `<h3>`) for dialog titles so screen reader users hear proper document structure when entering modal dialogs.
  2. The trigger button `#demo-dialog-trigger` in `site/src/App.vue:601` declares `:aria-expanded="dialogOpen"` (already omitted in `scripts/build-ssg.mjs:330`). Per W3C APG for Modal Dialog: triggers invoking modal dialogs do NOT use `aria-expanded`; `aria-expanded` is strictly for non-modal disclosures, accordions, and comboboxes.
- **Concrete Remediation Recommendation**:
  Change `<p id="demo-dlg-title">` to `<h2 id="demo-dlg-title" class="vd-dialog-title">`. Remove `aria-expanded` from `#demo-dialog-trigger`.

---

### 4.5 Domain E: Documentation Site Architecture, SSG & Specimen Synchronization

#### [F-SITE-001] Spacing Table Contradiction in SSG Documentation
- **Criticality Tier**: **Critical**
  - *Justification*: Direct spec contradiction. Published documentation at `site/dist/index.html` communicates false token values to developers and AI agents, violating the single-source-of-truth contract.
- **Citation**:
  - `scripts/build-ssg.mjs:627-638` vs `foundations/proportion.md:59-70` and `tokens/tokens.css:26-30`
- **Observation & Logic**:
  In `scripts/build-ssg.mjs`, `spacingSummaryMd` constructs a table for Section 03 Spacing declaring:
  ```markdown
  | Step | Token | rem | px | Basis |
  | --- | --- | --- | --- | --- |
  | F₃ | `space.fib-2` | 0.125rem | 2px | C-01 |
  | F₄ | `space.fib-3` | 0.1875rem | 3px | C-01 |
  | F₅ | `space.fib-5` | 0.3125rem | 5px | C-01 |
  | F₆ | `space.fib-8` | 0.5rem | 8px | Class A |
  | F₇ | `space.fib-13` | 0.8125rem | 13px | Class A |
  ```
  In contrast, `tokens/tokens.css` and `foundations/proportion.md` define:
  - `space.fib-1` = `0.125rem` (2px, $F_1/F_2$, Class A — recommended Class C-01 per `F-MATH-001`)
  - `space.fib-2` = `0.25rem` (4px, $F_3$, Class C-01)
  - `space.fib-3` = `0.375rem` (6px, $F_4$, Class C-01)
  - `space.fib-5` = `0.5rem` (8px, $F_5$, Class C-01)
  - `space.fib-8` = `0.75rem` (12px, $F_6$, Class C-01)
  - `space.fib-13` = `0.8125rem` (13px, $F_7$, Class A)
  The table in `build-ssg.mjs` omits `space.fib-1`, falsely asserts that `space.fib-2` is 2px, `space.fib-3` is 3px, `space.fib-5` is 5px, and `space.fib-8` is 8px (Class A).
- **Concrete Remediation Recommendation**:
  Update `spacingSummaryMd` in `scripts/build-ssg.mjs` to match `foundations/proportion.md` verbatim, including `space.fib-1` through `space.fib-144` with accurate rem/pixel values and basis classes.

---

#### [F-SITE-002] Golden-Angle Algorithmic Palette Swatch Contradiction
- **Criticality Tier**: **Critical**
  - *Justification*: Direct spec contradiction. The interactive demo contradicts the normative token source of truth, displaying completely different hex codes and color hues for the core golden-angle palette.
- **Citation**:
  - `site/src/components/demos/ColorDemo.vue:2-11, 68` vs `foundations/color.md:50-61` and `tokens/tokens.css:249-256`
- **Observation & Logic**:
  In `ColorDemo.vue`, the 8-step `goldenTrack` array (`steps 0–7`) declares:
  - Step 0: `--vd3-color-golden-0`, Hue `200.0°`, Hex `#00a3aa`, Label "Primary Water"
  - Step 1: `--vd3-color-golden-1`, Hue `337.5°`, Hex `#c900ae`, Label "Secondary"
  - Step 2: `--vd3-color-golden-2`, Hue `115.0°`, Hex `#71bf00`
  - Step 3: `--vd3-color-golden-3`, Hue `252.5°`, Hex `#0074e6`
  - Steps 4–7: `#e02100`, `#00a880`, `#9c2cf3`, `#e6a800` (`30.0°`, `167.5°`, `305.0°`, `82.5°`)
  In contrast, `foundations/color.md` and `tokens/tokens.css:249-256` establish the amber baseline ($H_0 = 43.0^\circ$):
  - Step 0: `--vd3-color-golden-0`, Hue `43.0°`, Hex `#fab005` (Gold/Amber baseline)
  - Step 1: `--vd3-color-golden-1`, Hue `180.5°`, Hex `#0ab5b5` (Cyan/Aqua)
  - Step 2: `--vd3-color-golden-2`, Hue `318.0°`, Hex `#f20d91` (Magenta/Pink)
  - Step 3: `--vd3-color-golden-3`, Hue `95.5°`, Hex `#68c20a` (Lime Green)
  - Steps 4–7: `#254ef0`, `#f22d0d`, `#0ac265`, `#ba0df2` (`233.0°`, `10.5°`, `148.0°`, `285.5°`)
  The demo presents an unaligned, arbitrary set of colors across all 8 steps under the normative token names `--vd3-color-golden-*`, and `ColorDemo.vue:68` hardcodes foreground text color selection as `[0, 2, 5, 7].includes(s.step) ? '#1a1d20' : '#ffffff'` (producing `2.26:1`–`2.53:1` failures on steps `1, 3, 6`).
- **Concrete Remediation Recommendation**:
  Synchronize all 8 steps of `goldenTrack` in `site/src/components/demos/ColorDemo.vue` with the normative tokens defined in `foundations/color.md` and `tokens/vd3.tokens.json` (or derive the swatches programmatically from `specTokens` in `site/src/spec.ts`), and update `ColorDemo.vue:68` so foreground text picks the higher-contrast ink (`#1a1d20` on `[0, 1, 2, 3, 5, 6]`, `#ffffff` on `[4, 7]`) — noting that while `0, 1, 3, 4, 6, 7` exceed `4.5:1`, steps `2` (`#f20d91`: `4.23:1` with `#1a1d20` vs `4.01:1` with `#ffffff`) and `5` (`#f22d0d`: `4.16:1` with `#1a1d20` vs `4.07:1` with `#ffffff`) require pure `#000000` (`5.24:1` / `5.16:1`) or bold/large text (`>= 3.0:1`) to satisfy the `WCAG ≥ 4.5:1` label at `ColorDemo.vue:61`.

---

#### [F-SITE-003] Inverted Golden Split Proportions in Mathematical Demo
- **Criticality Tier**: **Critical**
  - *Justification*: Mathematical basis contract contradiction. In a design system whose core axiom is the Golden Ratio ($\phi$), the foundational interactive demo inverts the mathematical identities of the major and minor partitions.
- **Citation**:
  - `site/src/components/demos/ProportionDemos.vue:21-22`
- **Observation & Logic**:
  Lines 21-22 render:
  ```html
  <div class="minor">minor · 38.2% (1/φ)</div>
  <div class="major">major · 61.8% (1 − 1/φ)</div>
  ```
  By mathematical definition:
  - $\phi \approx 1.6180339887$
  - Major partition: $1/\phi \approx 0.6180339887$ (61.8%)
  - Minor partition: $1/\phi^2 = 1 - 1/\phi \approx 0.3819660113$ (38.2%)
  The template attributes $(1/\phi)$ to the 38.2% minor partition and $(1 - 1/\phi)$ to the 61.8% major partition.
- **Concrete Remediation Recommendation**:
  Correct lines 21-22 in `site/src/components/demos/ProportionDemos.vue`:
  ```html
  <div class="minor">minor · 38.2% (1/φ²)</div>
  <div class="major">major · 61.8% (1/φ)</div>
  ```

---

#### [F-SITE-004] Severe Layout Shift (CLS) and DOM Re-ordering on Client Hydration
- **Criticality Tier**: **Critical**
  - *Justification*: Architectural divergence and breaking UX defect. Violates AGENTS.md §4 specimen synchronization contract, triggering massive layout shift and confusing human users and assistive technology.
- **Citation**:
  - `site/src/App.vue:1366-1446` vs `scripts/build-ssg.mjs:421-445, 772-776`
- **Observation & Logic**:
  In `scripts/build-ssg.mjs`, `switch` (line 421), `alert` (line 430), and `tabs` (line 438) appear immediately after `toast` (line 409) and before `drawer` (line 447), and `<h3>Component Specification Index</h3>` (line 772) appears before `<div class="specimen-grid">` (line 776).
  In `site/src/App.vue`, `drawer` (line 905) immediately follows `toast` (line 863); `switch` (line 1366), `alert` (line 1390), and `tabs` (line 1418) are pushed to the very bottom of the specimen grid after `layout` (line 1345), and `<h3>Component Specification Index</h3>` (line 1446) comes after `.specimen-grid`.
  When `createApp(App).mount('#app')` executes, Vue replaces the static SSG DOM, causing these three cards to disappear from positions 11–13 and reappear at positions 33–35 (and swapping the index table with the specimen grid).
- **Concrete Remediation Recommendation**:
  Move the `switch`, `alert`, and `tabs` `<article class="specimen-card">` blocks in `site/src/App.vue` to match the exact sequence in `scripts/build-ssg.mjs` (immediately after `toast` and before `drawer`), and align the placement of `Component Specification Index` relative to `.specimen-grid`.

---

#### [F-SITE-005] Broken Heading Hierarchy and Monotonic Inversion in Live Component Documentation
- **Criticality Tier**: **Critical**
  - *Justification*: WCAG 2.1/2.2 SC 1.3.1 (Info and Relationships) violation. Heading levels invert from `h4` to `h3` 38 times in the live application DOM.
- **Citation**:
  - `site/src/components/MdDoc.vue:5-6` and `site/src/App.vue:1447, 1450-1451, 1459-1463, 1469-1478` vs `scripts/build-ssg.mjs:774, 798, 807-811, 821`
- **Observation & Logic**:
  In `scripts/build-ssg.mjs`, per-slug component markdown is rendered with `initialLevel = 4` (line 798), shifting markdown `##` headings to `<h5>` beneath `<h4>{{ sp.slug }}</h4>`, while `SPEC.md` (`line 774`), `conventions/*` (`lines 807-811`), and per-pattern markdown (`line 821`) are rendered with `initialLevel = 3` (`<h4>` beneath `<h3>`).
  However, `site/src/components/MdDoc.vue` accepts only a `source` prop and hardcodes `renderMd(props.source)` without options, defaulting to `sectionLevel = 2`.
  In `site/src/App.vue` lines 1450-1451:
  ```vue
  <h4>{{ sp.slug }}</h4>
  <MdDoc :source="sp.src" />
  ```
  `MdDoc` renders markdown `## Summary`, `## Anatomy`, etc., as `<h3>Summary</h3>`. An `<h3>` directly follows an `<h4>`, violating monotonic heading hierarchy across all 38 component specs in the live application; similarly, `specIndexMd` (`line 1447`), `namingMd`/`mappingsMd`/`contentMd` (`lines 1459-1463`), and pattern docs (`lines 1469-1478`) render markdown `##` headings at `<h3>` alongside `<h3>` section titles instead of `<h4>`.
- **Concrete Remediation Recommendation**:
  Update `site/src/components/MdDoc.vue` to accept `sectionLevel?: number` and `tableLabel?: string` props and forward them to `renderMd(props.source, { sectionLevel: props.sectionLevel, tableLabel: props.tableLabel })`. In `site/src/App.vue`, pass `:section-level="4"` on component specs (line 1451) and `:section-level="3"` on `specIndexMd` (`line 1447`), convention docs (`lines 1459-1463`), and pattern docs (`lines 1470–1478`).

---

#### [F-SITE-008] Outdated Foundation Coverage Matrix Discrepancy & Accessibility Flaws
- **Criticality Tier**: **High**
  - *Justification*: Spec-implementation divergence and WCAG 1.3.1 table accessibility omission in live component.
- **Citation**:
  - `site/src/components/FoundationTable.vue:4-36` vs `scripts/build-ssg.mjs:293-311`
- **Observation & Logic**:
  `FoundationTable.vue` renders an outdated 14-row table:
  1. Completely omits `density`, `patterns`, `components`, and `conventions` (while retaining an older `content` row that `build-ssg.mjs` folds into `conventions`).
  2. Lists `icons` with stale note: `'Phosphor, 6 weights, fib sizing steps'`, omitting the normative contract in `foundations/icons.md` / `scripts/build-ssg.mjs:305` (Fibonacci icon sizes 13/21/34/55px $F_7..F_{10}$, $\phi$ stroke width `1.618`, semantic-role icon ink, and implementation-side glyph set independence).
  3. Uses un-scoped table markup (`<th>` without `scope="col"`, `<td>` without `th[scope="row"]`), and lacks the accessible scroll region `<div class="vd-table-container" tabindex="0" role="region" aria-label="...">` provided in `build-ssg.mjs`.
- **Concrete Remediation Recommendation**:
  Synchronize `FoundationTable.vue` with `foundationRows` from `scripts/build-ssg.mjs` (all 17 rows). Wrap table in `<div class="vd-table-container" tabindex="0" role="region" aria-label="Foundation coverage matrix">` with `th[scope="col"]` and `th[scope="row"]`.

---

#### [F-SITE-012] Truncated Placeholder Code Snippets in Documentation
- **Criticality Tier**: **Medium**
  - *Justification*: Severe documentation usability flaw. Clicking "Copy" on component specimens delivers non-functional snippets containing literal ellipses or incomplete anatomy stubs.
- **Citation**:
  - `site/src/App.vue:326-363` and `scripts/build-ssg.mjs:314-622`
- **Observation & Logic**:
  18 component code snippets in `componentSnippets` and `specimens[i].code` contain placeholder ellipses (16 with literal `...` and 2 with Unicode `…`):
  - `dialog`: `<dialog class="vd-dialog" aria-labelledby="dlg-title">...</dialog>`
  - `card`: `<article class="vd-card vd-card--elevated"><div class="vd-card-body">...</div></article>`
  - `navbar`: `<nav class="vd-navbar" aria-label="Secondary">...</nav>`
  - `table`: `<div class="vd-table-container" tabindex="0"><table class="vd-table">...</table></div>`
  - `alert`: `<div class="vd-alert vd-alert--critical" role="alert">...</div>`
  - `tabs`: `<div class="vd-tabs" role="tablist"><button class="vd-tab" role="tab" aria-selected="true">…</button></div>`
  - `drawer`: `<aside class="vd-drawer vd-drawer--end" data-open="true">...</aside>`
  - `popover`: `<div class="vd-popover" data-placement="bottom">...</div>`
  - `menu`: `<div class="vd-menu" role="menu"><div class="vd-menu-item">…</div></div>`
  - `context-menu`: `<div class="vd-context-menu" role="menu">...</div>`
  - `breadcrumb`: `<nav aria-label="Breadcrumb"><ol class="vd-breadcrumb">...</ol></nav>`
  - `pagination`: `<nav class="vd-pagination"><ul class="vd-pagination-list">...</ul></nav>`
  - `datepicker`: `<div class="vd-datepicker"><div class="vd-datepicker-grid">...</div></div>`
  - `carousel`: `<div class="vd-carousel"><div class="vd-carousel-track">...</div></div>`
  - `toolbar`: `<div class="vd-toolbar"><div class="vd-toolbar-group">...</div></div>`
  - `hover-card`: `<div class="vd-hover-card">...</div>`
  - `tour`: `<div class="vd-tour">...</div>`
  - `layout`: `<div class="vd-container-lg vd-split-golden">...</div>`
  Additionally, several non-ellipsis snippets omit required anatomy or ARIA roles shown in their previews (e.g. `upload` omits `.vd-upload-icon`, `.vd-upload-text`, and `.vd-upload-hint`; `accordion` omits `.vd-accordion-content`; `menubar` renders a single `<span>` without `role="menubar"`/`role="menuitem"`).
  Engineers copying code from the documentation site receive invalid or incomplete markup that cannot be rendered cleanly without re-authoring the component anatomy.
- **Concrete Remediation Recommendation**:
  Replace all truncated ellipses snippets and incomplete stubs with complete, functional semantic HTML specimens matching the preview anatomy.

---

#### [F-SITE-013] Inert SSG Interactive Elements & Missing Zero-JS Fallbacks
- **Criticality Tier**: **Medium**
  - *Justification*: Documentation site usability flaw in zero-JS and static crawling modes.
- **Citation**:
  - `scripts/build-ssg.mjs:330, 788, 845`
- **Observation & Logic**:
  In `scripts/build-ssg.mjs`:
  1. The 35 `.vd-code-copy` buttons in static HTML are plain `<button>` elements with no event listeners or inline fallback logic.
  2. The dialog trigger `<button id="demo-dialog-trigger">` has no declarative invoker or click handler.
  3. The font cycling button in `build-ssg.mjs` line 845 is an inert `<span>` element with no `tabindex` or keyboard support.
- **Concrete Remediation Recommendation**:
  Use native declarative invoker attributes where possible (e.g. `command="show-modal" commandfor="demo-modal-dialog"` per `modern-web-guidance` `declarative-dialog-popover-control` — noting Invoker Commands is Baseline Newly Available since Dec 2025, so pair with conditional `'commandForElement' in HTMLButtonElement.prototype` polyfill or inline click fallback), provide a lightweight vanilla script in SSG for clipboard copying, and ensure the font button renders as a native `<button>`.

---

#### [F-SITE-014] Legacy `--vd-*` Prefix & Ghost Tokens in Normative Conventions and Site Spec Data
- **Criticality Tier**: **Medium**
  - *Justification*: Inconsistency and stale documentation/demo bindings. `conventions/naming.md` and `site/src/spec.ts` have not been updated to reflect the `--vd3-*` normative namespace.
- **Citation**:
  - `conventions/naming.md:7-34`
  - `conventions/mappings.md:11-20`
  - `site/src/spec.ts:21-89`
- **Observation & Logic**:
  In `conventions/naming.md` lines 7-8: "CSS — custom properties always prefixed `--vd-`: the v1.9 prefix, kept verbatim for backwards compatibility (Q6 decision — no renames in core 1.0)." *(Overlaps with `F-MATH-007`.)*
  In `conventions/mappings.md`, all tokens are listed as `--vd-*` (including ghost names flagged in `F-MATH-008`).
  In `site/src/spec.ts` lines 21-89, demo token metadata is emitted strictly with `--vd-*` prefixes—and `roleColors` (lines 86-88: `` `--vd-${k}` ``) emits 8 non-existent ghost variables (`--vd-canvas`, `--vd-layer`, `--vd-layer-hover`, `--vd-border`, `--vd-focus`, `--vd-focus-glow`, `--vd-interactive`, `--vd-critical`) plus `--vd-shadow` (which collides with the Level-2 elevation shadow alias at `tokens/tokens.css:398` rather than `--vd3-color-shadow`), with only `--vd-text-primary` and `--vd-text-secondary` actually mapping to semantic color roles in `tokens/tokens.css`.
  This contradicts `tokens/tokens.css` and `AGENTS.md` §2, which define `--vd3-*` as the normative standard and `--vd-*` as legacy compatibility aliases.
- **Concrete Remediation Recommendation**:
  Update `conventions/naming.md` and `conventions/mappings.md` to document `--vd3-*` as the primary normative custom property namespace and `--vd-*` as the legacy alias layer. Update `site/src/spec.ts` to emit normative `--vd3-*` token names (and accurate `--vd-*` legacy aliases where applicable).

---

#### [F-SITE-017] Absence of Icon Component Stylesheet in Core Primitives
- **Criticality Tier**: **Medium**
  - *Justification*: Spec-implementation discrepancy. Foundation spec defines `.vd-icon` classes, but no stylesheet exists in `components/`.
- **Citation**:
  - `components/index.css`
  - `foundations/icons.md:89-98`
- **Observation & Logic**:
  `foundations/icons.md` specifies base class `.vd-icon`, size modifiers `.vd-icon--sm`, `.vd-icon--md`, `.vd-icon--lg`, `.vd-icon--xl`, and custom properties `--_vd-icon-size`, `--_vd-icon-color`.
  However, no `components/icon.css` or `components/icons.css` exists in the repository, `components/index.css` omits it, and the documentation site lacks an icon specimen card.
- **Concrete Remediation Recommendation**:
  Author `components/icon.css` implementing the `.vd-icon` contract, export it in `components/index.css`, and add an Icon specimen to `scripts/build-ssg.mjs` and `site/src/App.vue`.

---

#### [F-SITE-018] FOUC Theme Flash for Dark Mode Users on Initial Page Load
- **Criticality Tier**: **Medium**
  - *Justification*: Poor UX and visual comfort defect. Dark-mode visitors experience an unstyled white flash on every page load.
- **Citation**:
  - `site/index.html:1-3`
  - `site/src/components/SiteNavbar.vue:75-84`
- **Observation & Logic**:
  In `site/index.html`, `data-theme="light"` is statically declared.
  The application reads user preferences from `localStorage` inside Vue's `onMounted` lifecycle hook in `SiteNavbar.vue`.
  On initial page load, the browser renders the white light-theme canvas until the 484KB JavaScript bundle is downloaded, parsed, and executed.
- **Concrete Remediation Recommendation**:
  Inject an inline `<script>` in `<head>` before any stylesheet that reads `@vanduo-oss/vd3`'s persisted storage key `localStorage.getItem('vanduo-theme-preference')`: if `'light'` or `'dark'`, set `document.documentElement.dataset.theme` immediately; if `'system'` or unset, remove `data-theme` so CSS `@media (prefers-color-scheme: dark)` applies automatically (assuming `F-SITE-009` is also resolved).

---

#### [F-SITE-019] Sub-optimal Mobile Target Sizes on Navigation Links
- **Criticality Tier**: **Medium**
  - *Justification*: WCAG 2.5.5 / 2.5.8 accessibility non-conformance on mobile viewports.
- **Citation**:
  - `site/src/components/SiteNavbar.vue:152, 155-164`
- **Observation & Logic**:
  Navigation links in `SiteNavbar.vue` inherit `font-size: var(--vd3-font-size-sm, 0.8125rem)` (line 152) and declare (lines 155-164):
  ```css
  padding: var(--vd3-space-fib-3, 0.375rem) var(--vd3-space-fib-5, 0.5rem);
  line-height: 1.25;
  border-bottom: 2px solid transparent;
  ```
  The computed height of each link is ~30px (~28px content + padding). This falls far short of the WCAG 2.5.5 recommended $44\times 44\text{px}$ target size, increasing the rate of accidental touches on touchscreens.
- **Concrete Remediation Recommendation**:
  Increase touch target size on mobile by adding `min-height: 44px` or using pseudo-elements (`::after`) to expand the interactive hit area without altering visual line height.

---

### 4.6 Domain F: Modern Web Standards & Platform Capabilities Alignment

#### [F-SITE-007] Missing Dialog Scroll Lock and Top-Layer Scroll Chaining
- **Criticality Tier**: **High**
  - *Justification*: Modern web standards non-compliance and poor mobile/desktop ergonomics.
- **Citation**:
  - `components/dialog.css:8-33, 53-79`
- **Observation & Logic**:
  Per `modern-web-guidance` (`dialog` guide, Rule 1):
  ```css
  /* MANDATORY (both rules): without them, scrolling over the backdrop or inside the dialog scrolls the page behind it */
  dialog:modal {
    overscroll-behavior: contain;
  }
  dialog::backdrop {
    overflow: hidden;
    overscroll-behavior: contain;
  }
  ```
  `components/dialog.css` declares `overflow: auto;` on `.vd-dialog` (line 23), but completely omits `overscroll-behavior: contain` on `.vd-dialog` / `dialog:modal` and `dialog::backdrop`. When users scroll inside the modal or touch-drag on the frosted backdrop, scroll gestures chain to the root document, scrolling the background page.
- **Concrete Remediation Recommendation**:
  Add `overscroll-behavior: contain;` to `.vd-dialog` / `dialog:modal`, and add `overflow: hidden; overscroll-behavior: contain;` to `.vd-dialog::backdrop` as progressive enhancement (per `modern-web-guidance` `dialog`, do not fall back to `overflow: hidden` or `position: fixed` on `html`/`body`).

---

#### [F-SITE-009] Hardcoded Root Theme Disables Automatic OS Dark Mode
- **Criticality Tier**: **High**
  - *Justification*: Architectural divergence and modern web accessibility deviation. Users with OS dark mode preference are forced into a light theme on first visit.
- **Citation**:
  - `site/index.html:2`
  - `site/src/style.css:15, 30-92`
  - `tokens/tokens.css`
- **Observation & Logic**:
  `site/index.html` line 2 hardcodes `data-theme="light"` on `<html>`. In `site/src/style.css` line 15, `:root` sets `color-scheme: light;` (instead of `light dark`), while lines 30-92 scope automatic dark theme handling to `@media (prefers-color-scheme: dark)` `:root:not([data-theme="light"])`. Because `data-theme="light"` is always present on initial load, `:root:not([data-theme="light"])` evaluates to false. Furthermore, `tokens/tokens.css` lacks any `@media (prefers-color-scheme: dark)` declaration, forcing consumers to rely strictly on manual `[data-theme="dark"]` attribute toggling.
- **Concrete Remediation Recommendation**:
  Remove `data-theme="light"` from `site/index.html` and set `color-scheme: light dark;` on `:root` in `site/src/style.css` line 15. Add an inline `<script>` in `<head>` reading `localStorage.getItem('vanduo-theme-preference')` (`F-SITE-018`) without overriding system preference when unset/`system`. In `tokens/tokens.css`, add a `@media (prefers-color-scheme: dark)` block for `:root:not([data-theme="light"])` so token consumers receive automatic system dark mode without extra scripts.

---

#### [F-SITE-010] Discrete Transition Invalidation via Shorthand Property
- **Criticality Tier**: **High**
  - *Justification*: Browser compatibility and modern web standard violation. Placing `allow-discrete` inside the `transition` shorthand causes older/strict browsers to invalidate the entire property declaration.
- **Citation**:
  - `components/dialog.css:31-32, 61-62`
  - `components/popover.css:29`
- **Observation & Logic**:
  In `components/dialog.css` lines 28-32 (`.vd-dialog`) and lines 58-62 (`.vd-dialog::backdrop`):
  ```css
  transition:
    opacity var(--vd3-duration-233, 233ms) var(--vd3-ease-out),
    transform var(--vd3-duration-233, 233ms) var(--vd3-ease-out),
    overlay var(--vd3-duration-233, 233ms) allow-discrete,
    display var(--vd3-duration-233, 233ms) allow-discrete;
  ```
  (and similarly `backdrop-filter`, `overlay ... allow-discrete`, `display ... allow-discrete` on `.vd-dialog::backdrop` at lines 58-62).
  And in `components/popover.css` line 29:
  `display var(--vd3-duration-233, 233ms) allow-discrete;`
  Per `modern-web-guidance` (`animate-to-from-top-layer` guide):
  - "DO NOT: Use `allow-discrete` in the `transition` shorthand — it will make older browsers ignore the entire `transition` declaration. Except in use cases where that is desirable, use a separate `transition-behavior: allow-discrete` declaration."
  - `overlay` is also mandatory in the `transition` list for top-layer elements so the browser does not immediately remove the element from the top layer before exit transitions complete (`components/popover.css:26-29` omits `overlay`, whereas `dialog.css:31-32` includes it).
- **Concrete Remediation Recommendation**:
  Separate `transition-behavior: allow-discrete;` into its own CSS property declaration following the `transition:` property list on `.vd-dialog`, `.vd-dialog::backdrop` in `components/dialog.css`, and `.vd-popover` in `components/popover.css`, and add `overlay var(--vd3-duration-233, 233ms)` to `.vd-popover`'s `transition` list (`popover.css:26-29`).

---

#### [F-SITE-015] Missing Container Queries on Primitive Components
- **Criticality Tier**: **Medium**
  - *Justification*: Modern CSS architecture omission. Component primitives fail to adapt to constrained parent layouts.
- **Citation**:
  - `components/*.css` vs `foundations/layout.md`
- **Observation & Logic**:
  While `components/layout.css` defines `.vd-cq` (`container-type: inline-size`), none of the 34 component primitives (`.vd-card`, `.vd-toolbar`, `.vd-navbar`, `.vd-table`) define container-query adaptations (`@container`). Components rely exclusively on global viewport media queries (`@media (min-width: ...)`). When a `.vd-card` or `.vd-toolbar` is placed inside a 38.2% golden minor column or a narrow split panel, it behaves as if it occupies the full viewport width.
- **Concrete Remediation Recommendation**:
  Introduce container-query responsive styles (`@container (max-width: ...)`) for modular components (`card`, `toolbar`, `pagination`, `table`) with media-query fallbacks.

---

#### [F-SITE-016] Missing Native Popover API and Anchor Positioning Architecture
- **Criticality Tier**: **Medium**
  - *Justification*: Architectural stagnation and reliance on legacy absolute positioning. Overlays risk clipping at viewport edges and ancestor overflow containers.
- **Citation**:
  - `components/popover.css:12-98`
  - `components/tooltip.css:12-124`
  - `components/menu.css:9-25`
  - `components/datepicker.css:13-24`
  - `components/hover-card.css:11-33`
- **Observation & Logic**:
  Floating overlays (`popover`, `tooltip`, `menu`, `hover-card`, `datepicker`, `timepicker`, `tour`) rely on `position: absolute; z-index: ...` (`popover` and `tooltip` also style `[data-placement=...]` arrows/margins; `hover-card.css:30` and `tour.css:31` already style `:popover-open` but remain `position: absolute`). They do not leverage CSS Anchor Positioning (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`) or native `[popover]` top-layer promotion across `popover`/`tooltip`/`menu`. Without top-layer promotion and anchor positioning, floating panels are vulnerable to clipping by parent `overflow: hidden` containers and require JavaScript positioning libraries to avoid viewport edge collisions.
- **Concrete Remediation Recommendation**:
  Update specifications and component CSS for `popover`, `tooltip`, and `menu` to support the HTML Popover API and CSS Anchor Positioning (`position-area`, `position-try-fallbacks`), gating `inset: auto; margin: 0` and anchor properties inside `@supports (position-area: block-end)` per `modern-web-guidance` (`viewport-aware-dropdowns`) while preserving absolute positioning for non-`[popover]` legacy consumers.

---

#### [F-SITE-020] Physical CSS Properties in Site Stylesheet and Demos
- **Criticality Tier**: **Low**
  - *Justification*: RTL internationalization defect. Physical directional properties fail to adapt to right-to-left writing modes.
- **Citation**:
  - `site/src/style.css:268, 740, 746`
  - `site/src/components/FoundationTable.vue:44, 48`
  - `site/src/components/demos/*.vue`
- **Observation & Logic**:
  - `site/src/style.css` line 268 uses `left: var(--vd3-space-fib-8, 0.75rem);` (`.vd-skip-link:focus-visible`), and lines 740 and 746 use `right: 5rem;` and `right: var(--vd3-space-fib-8, 0.75rem);` on `.vd-code-block` children.
  - `FoundationTable.vue:44` uses `text-align: left;`.
  - Component demos and tables (`ProportionDemos.vue:64`, `LineDemo.vue:24`, `SpacingDemo.vue:36`, `GridDemo.vue:36`, `FoundationTable.vue:48`, `GlassDemo.vue:62`, `MotionDemo.vue:47`) use `border-left: 2px solid ...` and `padding-left: ...`.
  - `MotionDemo.vue:38` uses `left: 0;`.
- **Concrete Remediation Recommendation**:
  Replace physical properties with logical properties (`inset-inline-start`, `inset-inline-end`, `text-align: start`, `border-inline-start`, `padding-inline-start`).

---

#### [F-SITE-021] Missing External Link Announcements for Figma UI Kit
- **Criticality Tier**: **Low**
  - *Justification*: Accessibility polish opportunity per WCAG 2.2 Technique G201 / H83.
- **Citation**:
  - `site/src/App.vue:419`
  - `scripts/build-ssg.mjs:896`
- **Observation & Logic**:
  The hero link `<a href="https://www.figma.com/design/ae5AMiPoVXuHdaRfawhyjh" target="_blank" rel="noopener noreferrer">Figma UI Kit</a>` opens in a new browser tab without announcing this behavior to screen reader users.
- **Concrete Remediation Recommendation**:
  Add an `aria-label="Figma UI Kit (opens in new tab)"` or append `<span class="sr-only"> (opens in new tab)</span>`.

---

#### [F-SITE-022] Missing Modern CSS Light-Dark Function and OKLCH Gamut
- **Criticality Tier**: **Low**
  - *Justification*: Ergonomic enhancement and modern web guidance opportunity.
- **Citation**:
  - `tokens/tokens.css`
  - `foundations/color.md`
- **Observation & Logic**:
  Colors are expressed in legacy sRGB hex strings (`#1a1d20`, `#fab005`), and `tokens/tokens.css` does not declare `color-scheme`. Modern CSS allows pairing `:root { color-scheme: light dark; }` with `light-dark()` (e.g. `--vd3-color-canvas: light-dark(#ffffff, #212529)`) and perceptually uniform OKLCH color spaces with wide-gamut Display P3 support. Per `modern-web-guidance` (`dark-mode`), `light-dark()` is Baseline Newly Available (May 2024), so fallback custom properties / `@media (prefers-color-scheme: dark)` blocks remain required for Widely Available support.
- **Concrete Remediation Recommendation**:
  Explore adopting `color-scheme` + `light-dark()` (wrapped with `@supports (color: light-dark(white, black))` over `:root` / `prefers-color-scheme` fallbacks) in `tokens/tokens.css` and documenting OKLCH color coordinates for the golden-angle categorical palette in future roadmap phases.

---

#### [F-SITE-023] Missing Semantic HTML5 `<progress>` Support in Progress Primitive
- **Criticality Tier**: **Low**
  - *Justification*: Semantic HTML optimization per modern web guidance (`progress` guide).
- **Citation**:
  - `components/progress.css:9-29`
  - `site/src/App.vue:1105`
- **Observation & Logic**:
  `components/progress.css` only styles custom `div[role="progressbar"]` containers with nested child divs. It provides no selector rules for semantic HTML5 `<progress value="62" max="100">` elements.
- **Concrete Remediation Recommendation**:
  Extend `components/progress.css` to style native `<progress class="vd-progress">` per `modern-web-guidance` (`progress` guide): because setting `background-color` / `border-radius` disables `accent-color`, use full custom styling (`appearance: none`, `border: 0 solid`, `overflow: clip`, `::-webkit-progress-bar`, and separate ungrouped `progress::-webkit-progress-value` and `progress::-moz-progress-bar` rules, plus `container-type: inline-size` + `cqi` `translate` keyframes for `:indeterminate`, slowing rather than setting `animation: none` under reduced motion).

---

## 5. Part II: Prioritized Actionable Improvement Plan

This phased improvement plan outlines the concrete, sequential remediation tasks required to elevate the vd3 standard, tokens, component library, and documentation site to complete specification fidelity and modern web standards.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        VD3 REMEDIATION EXECUTION ROADMAP                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Critical Mathematical, Token & SSG Contradictions                             │
│   • Reclassify space.fib-1 (Class C-01) in tokens and proportion.md                    │
│   • Reconcile modular typography scale (lg..4xl) value drift                           │
│   • Tokenize 43 un-tokenized --vd3-* custom properties into DTCG                       │
│   • Synchronize SSG spacing table, ProportionDemos formulas, and ColorDemo swatches    │
│   • Fix CLS specimen card reordering and live heading monotonic inversion              │
│   • Implement dialog.css focus rings and form.css textarea base & state styling        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: High-Priority Accessibility, RTL & Spec Alignments                            │
│   • Reconcile drawer backdrop vs non-modal contract                                    │
│   • Remove invalid select:read-only from form.css                                      │
│   • Add MOB-001 reduced motion blocks to badge, code, table                            │
│   • Fix carousel RTL slide translation and table physical text-align                   │
│   • Correct erroneous "No APG Pattern" claims across 4 specifications                  │
│   • Add theme.dark elevation shadows to DTCG and fix Figma manifest mappings           │
│   • Add focus, icon, density to tokens.d.ts and decouple Vue from conventions/naming   │
│   • Add dialog scroll containment (overscroll-behavior) and split allow-discrete       │
│   • Enable automatic OS dark mode and modernize dialog semantic landmarks              │
│   • Synchronize Foundation coverage table and enhance WCAG 1.3.1 accessibility         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Medium-Priority Architectural & Usability Refinements                         │
│   • Reconcile ghost variables in mappings.md and add legacy --vd-icon-* aliases        │
│   • Remove stale "proposed" documentation notes in icons.md and density.md             │
│   • Document focus-glow in color.md and fix broken APG URLs in radio & segmented specs │
│   • Expand dialog/spec.md to standard template and remove focus-within pointer ring    │
│   • Eliminate untokenized raw colors and non-Fibonacci bounds in component CSS         │
│   • Complete keyboard navigation contracts in menubar and tabs specifications          │
│   • Replace truncated code snippets with full specimens across 18+ components          │
│   • Implement components/icon.css and eliminate dark theme FOUC flash                  │
│   • Implement static fallbacks and native buttons for inert SSG interactive elements   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Modern Web Platform Evolution & Polish                                        │
│   • Document elevation ladder Level 4 index jump and refine icon.gap taxonomy          │
│   • Align [data-motion="reduce"] wildcard rules and clarify golden-angle units         │
│   • Invert pagination chevrons in RTL and clean up obsolete 1.0.3 spec callouts        │
│   • Adopt Container Queries (@container) on modular components                         │
│   • Introduce native HTML Popover API & CSS Anchor Positioning architecture            │
│   • Explore CSS light-dark() function, OKLCH wide-gamut palettes, and native <progress>│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 5.1 Phase 1: Critical Mathematical, Token, and SSG Contradictions

#### Task 1.1: Reclassify `space.fib-1` as Registered Exception C-01
- **Addresses Finding**: `F-MATH-001`
- **Target Files**:
  - `tokens/vd3.tokens.json`
  - `foundations/proportion.md`
  - `scripts/verify-tokens.mjs`
  - `tests/e2e/tier1-features/tokens-math.test.mjs`
- **Concrete Remediation Steps**:
  1. In `tokens/vd3.tokens.json` (line 116), update `$extensions.vd3.class` to `"C"`, add `"exceptionId": "C-01"`, include `"C-01"` in `"$description"` (e.g., `"2px · C-01 · --vd-space-fib-1"`), and set derivation to `"Rem-rounded small spacing step (1px rounded to 2px for baseline screen grid)"`. (Including `"C-01"` in `$description` is required by `tests/e2e/tier1-features/tokens-math.test.mjs:138-142` and the `SpacingDemo.vue` `C-01` badge filter at `site/src/spec.ts:24`.)
  2. In `foundations/proportion.md` (lines 50 & 61), update Exception `C-01` text to explicitly include `fib-1` (`fib-1/2/3/5/8 ship as 2/4/6/8/12px`) and update the spacing table row for `space.fib-1` from `Class A` to `Class C-01`.
  3. **Regression Safeguard (E2E Math Registry Fixture)**: Update the `'fib-1'` entry in `tests/e2e/tier1-features/tokens-math.test.mjs` (line 121, `basis: 'A'` -> `'C-01'`) so the end-to-end registry fixture and `C-01` `$description` assertion stay aligned with the reclassified token.
  4. Run `pnpm test:tokens && pnpm test:e2e` to verify that basis classification and exception checks pass cleanly.
- **Acceptance Criteria**: `space.fib-1` is explicitly classified as Class C under exception `C-01` in tokens, documentation, and test assertions.

#### Task 1.2: Reconcile Modular Typography Scale Value Drift (`lg`..`4xl`)
- **Addresses Finding**: `F-MATH-002`
- **Target Files**:
  - `tokens/vd3.tokens.json`
  - `tokens/tokens.css`
  - `scripts/verify-tokens.mjs`
  - `foundations/typography.md`
- **Concrete Remediation Steps**:
  1. Align `$value` in `tokens/vd3.tokens.json` for `type.size.lg` through `type.size.4xl` with the normative fluid clamp expressions exported in `tokens/tokens.css` (e.g. `"clamp(1.125rem, 1.08rem + .22vw, 1.25rem)"`).
  2. Structure static typography fallback tokens in `vd3.tokens.json` without violating DTCG 2025.10 group/leaf rules (`type.size.<step>.static` is invalid if `type.size.<step>` already holds `$value`, and `scripts/verify-tokens.mjs:113` `getLeafTokens()` stops recursing once `'$value' in value`). In `scripts/verify-tokens.mjs` Suite 18 (line 650), `cssVarFor()` maps `p.slice(2)` directly under `type.size.*`. Therefore, choose one of:
     - Define flat sibling keys `type.size.<step>-static: { $value: "..." }` so `cssVarFor()` generates `--vd3-font-size-<step>-static`, and filter `*-static` keys in `site/src/spec.ts:48-55` so `TypeDemo.vue` does not duplicate type steps, OR
     - Define `type.size.static.<step>` AND update `cssVarFor()` in `scripts/verify-tokens.mjs` line 650 so `type.size.static.<step>` explicitly maps to `--vd3-font-size-<step>-static`.
  3. Enhance `scripts/verify-tokens.mjs` Suite 18 to verify value equivalence between DTCG tokens and CSS custom properties.
- **Acceptance Criteria**: Zero value drift between `vd3.tokens.json` and `tokens.css` for modular typography tokens, with static fallback variables mapping cleanly to `--vd3-font-size-*-static` without Suite 18 export errors.

#### Task 1.3: Tokenize 43 Undocumented `--vd3-*` Custom Properties into DTCG
- **Addresses Finding**: `F-MATH-003`
- **Target Files**:
  - `tokens/vd3.tokens.json`
  - `tokens/schema.json`
  - `tokens/tokens.css`
  - `site/src/style.css`
  - `tokens/tokens.d.ts`
  - `scripts/verify-tokens.mjs`
  - `tests/e2e/tier3-combinations/theme-contrast.test.mjs`
- **Concrete Remediation Steps**:
  1. Add missing token definitions to `tokens/vd3.tokens.json` (and permit any new top-level groups in `tokens/schema.json`):
     - `spacing.px.*` (11 tokens) for `--vd3-spacing-1` through `144`.
     - `font.family.*` (3 tokens) for `--vd3-font-family-sans`, `serif`, `mono`.
     - `border.width.*` (4 tokens) for `--vd3-border-width-hair` through `thick`.
     - `shadow.named.*` (6 tokens) for `--vd3-shadow-sm` through `2xl`.
     - `color.role.border-subtle` and `color.role.canvas-rgb` (2 tokens) — **paired with matching dark overrides under `theme.dark.color.role`** (`TEST-T3-CMB-005` in `tests/e2e/tier3-combinations/theme-contrast.test.mjs:13-30` enforces 1-to-1 key parity between `tokens.color.role` and `tokens.theme.dark.color.role`).
     - A distinct runtime multiplier token (e.g. `density.multiplier`, avoiding collision with the existing `density.scale.{comfortable,compact}` group) for `--vd3-density-scale` (1 token).
     - The 5 `--vd3-font-size-*-static` variables (`tokens/tokens.css:130-134`) are resolved jointly with **Task 1.2** (`type.size.<step>-static` or `type.size.static.<step>`).
     - **Regression Safeguard (`verify-tokens.mjs` Suite 18 `cssVarFor()`)**: Update `cssVarFor()` in `scripts/verify-tokens.mjs:625-654` to map the newly added `spacing.px.*`, `font.family.*`, `border.width.*`, `shadow.named.*`, and `density.multiplier` groups to `--vd3-spacing-*`, `--vd3-font-family-*`, `--vd3-border-width-*`, `--vd3-shadow-*`, and `--vd3-density-scale` (without this, `shadow.named.*` resolves to `--vd3-shadow-named-*` and the other groups return `null`, failing Suite 18).
  2. Clean up redundant aliases in `tokens/tokens.css` (retiring the 5 duplicate `--vd3-leading-*` vars in favor of `--vd3-line-height-*`, and the 6 duplicate `--vd3-letter-spacing-*` vars at lines `148-153` in favor of `--vd3-tracking-*`):
     - **Regression Safeguard (Typography, Legacy Aliases & Types)**: Prior to removing `--vd3-leading-*` and `--vd3-letter-spacing-*`, update `site/src/style.css` lines 480, 492, 512, 518 to consume `var(--vd3-line-height-tight, 1.236)` and `var(--vd3-line-height-snug, 1.382)`. Re-point legacy `--vd-leading-*` (`tokens/tokens.css:378-382`) and `--vd-letter-spacing-*` (`tokens/tokens.css:384-389`) aliases directly to `var(--vd3-line-height-*)` and `var(--vd3-tracking-*)` so existing consumers do not resolve to empty/initial. Update `tokens/tokens.d.ts` (lines 335-336) to deprecate or replace `--vd3-leading-*` and `--vd3-letter-spacing-*` without breaking TypeScript typecheck.
- **Acceptance Criteria**: 100% of `--vd3-*` custom properties in `tokens.css` (all 43 currently untokenized properties across Tasks 1.2 and 1.3) resolve to an authoritative leaf token in `vd3.tokens.json`; zero typography regressions in `site/src/style.css`, intact legacy `--vd-leading-*` and `--vd-letter-spacing-*` aliases, and zero typecheck errors when retiring duplicates.

#### Task 1.4: Fix Documentation Contradictions in SSG and Demos
- **Addresses Findings**: `F-SITE-001`, `F-SITE-002`, `F-SITE-003`
- **Target Files**:
  - `scripts/build-ssg.mjs`
  - `site/src/components/demos/ColorDemo.vue`
  - `site/src/components/demos/ProportionDemos.vue`
- **Concrete Remediation Steps**:
  1. In `scripts/build-ssg.mjs` lines 627-638, rewrite `spacingSummaryMd` to match `foundations/proportion.md` verbatim, restoring `space.fib-1` through `space.fib-144` with accurate px/rem values and basis classifications.
  2. In `site/src/components/demos/ColorDemo.vue` lines 2-11, replace all 8 arbitrary hex/hue entries (`steps 0..7`) in `goldenTrack` with normative tokens ($H_0 = 43^\circ$ Amber `#fab005`, $H_1 = 180.5^\circ$ Aqua `#0ab5b5`, $H_2 = 318^\circ$ Pink `#f20d91`, $H_3 = 95.5^\circ$ Lime `#68c20a`, $H_4 = 233^\circ$ Blue `#254ef0`, $H_5 = 10.5^\circ$ Red `#f22d0d`, $H_6 = 148^\circ$ Green `#0ac265`, $H_7 = 285.5^\circ$ Purple `#ba0df2`), and update `ColorDemo.vue:68` so foreground contrast uses `#1a1d20` on `[0, 1, 2, 3, 5, 6]` and `#ffffff` on `[4, 7]` (noting steps `2` and `5` measure `4.23:1` and `4.16:1` with `#1a1d20` vs `4.01:1`/`4.07:1` with `#ffffff`, so use `#000000` (`5.24:1`/`5.16:1`) or large/bold text if strictly enforcing line 61's `>= 4.5:1` guard on all 8 swatches).
  3. In `site/src/components/demos/ProportionDemos.vue` lines 21-22, swap formula labels: assign $(1/\phi^2)$ to 38.2% minor and $(1/\phi)$ to 61.8% major.
- **Acceptance Criteria**: Static documentation and interactive demos accurately reflect normative mathematical and token values.

#### Task 1.5: Fix Hydration Layout Shift (CLS) and Live Heading Hierarchy Inversions
- **Addresses Findings**: `F-SITE-004`, `F-SITE-005`
- **Target Files**:
  - `site/src/App.vue`
  - `scripts/build-ssg.mjs`
  - `site/src/components/MdDoc.vue`
- **Concrete Remediation Steps**:
  1. In `site/src/App.vue`, move `switch`, `alert`, and `tabs` specimens from the bottom of the grid to immediately after `toast` and before `drawer`, matching `scripts/build-ssg.mjs`. Also align the `Component Specification Index` entry ordering between `App.vue` (`1446`) and `scripts/build-ssg.mjs` (`772`).
  2. In `site/src/components/MdDoc.vue`, add props `sectionLevel?: number` (default 2) and `tableLabel?: string`. Pass them into `renderMd(props.source, { sectionLevel: props.sectionLevel, tableLabel: props.tableLabel })`.
  3. In `site/src/App.vue`, pass `:section-level="4"` to the component spec `<MdDoc :source="sp.src" />` (line 1451) and `:section-level="3"` to `specIndexMd` (line 1447), the convention `<MdDoc>` instances (lines 1459, 1461, 1463), and the per-pattern `<MdDoc>` instances (lines 1470, 1472, 1474, 1476, 1478) so headings descend monotonically below their section headers (matching `scripts/build-ssg.mjs` lines 774, 798, 807-811, 821).
- **Acceptance Criteria**: Zero specimen ordering shift between SSG and client hydration. Monotonic heading progression (`h1` -> `h2` -> `h3` -> `h4` -> `h5`) across live component and pattern specs.

#### Task 1.6: Implement Focus Indicators in `dialog.css` and Complete Textarea Primitive in `form.css`
- **Addresses Findings**: `F-COMP-001`, `F-COMP-002`
- **Target Files**:
  - `components/dialog.css`
  - `components/form.css`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. In `components/dialog.css`, declare `:focus-visible` dual-ring focus rules on `.vd-dialog` and `.vd-dialog-close`. Add `dialog.css` to `focusFiles` in `scripts/verify-components.mjs`.
  2. In `components/form.css`, bind `.vd-textarea` alongside `.vd-input` across base borders, sizing, background, `:focus-visible`, `:user-invalid`, `:disabled`, `:read-only`, and reduced motion.
  3. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/dialog.css` and `components/form.css` alters tracked SHA-256 hashes in `scripts/snapshots.json`. Developers must execute `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to update snapshots and satisfy Suite 41b in `scripts/verify-components.mjs`.
- **Acceptance Criteria**: Dialog surface and close button show high-contrast focus rings when focused. Textareas render with complete base styles, focus rings, and validation styling.

---

### 5.2 Phase 2: High-Priority Accessibility, RTL & Spec Alignments

#### Task 2.1: Align Drawer Backdrop Architecture with Modal/Non-Modal Specification
- **Addresses Finding**: `F-COMP-003` *(including consolidated drawer backdrop site parity)*
- **Target Files**:
  - `components/drawer.css`
  - `components/drawer/spec.md`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. If modal drawer (`<dialog>` / `role="dialog"` with `aria-modal="true"`): update `components/drawer/spec.md` to declare `aria-modal="true"`, mandate focus trap and Inertness on background content, and preserve `.vd-drawer-backdrop` / native `::backdrop`.
  2. If non-modal drawer (`popover="manual"` or non-blocking `<dialog>`): remove or scope `.vd-drawer-backdrop` to an explicit `.vd-drawer--modal` variant in `components/drawer.css` (and remove unconditional backdrop usage in `site/src/App.vue` and `scripts/build-ssg.mjs`), ensuring non-modal drawers do not block viewport pointer interactions.
  3. **Regression Safeguard (`verify-components.mjs` Suite 20 & Snapshots)**: `scripts/verify-components.mjs:934` (Suite 20) asserts that `drawer.css` contains `".vd-drawer-backdrop"`. Any refactoring that removes `.vd-drawer-backdrop` completely must update Suite 20 alongside regenerating snapshots via `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Architectural alignment between drawer backdrop pointer-events and APG/HTML modal vs non-modal contract.

#### Task 2.2: Remove Invalid `:read-only` Selector on Native `<select>`
- **Addresses Finding**: `F-COMP-004`
- **Target Files**:
  - `components/form.css`
- **Concrete Remediation Steps**:
  1. Remove `.vd-select:read-only` from `components/form.css` line 210.
  2. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/form.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Default `<select class="vd-select">` renders with `--vd3-color-canvas` resting background.

#### Task 2.3: Implement MOB-001 Reduced Motion Overrides in `badge.css`, `code.css`, `table.css`
- **Addresses Finding**: `F-COMP-005`
- **Target Files**:
  - `components/badge.css`
  - `components/code.css`
  - `components/table.css`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. Add `@media (prefers-reduced-motion: reduce), [data-motion="reduce"]` blocks to `badge.css`, `code.css`, and `table.css` setting transition durations to `0.01ms`.
  2. Refactor `scripts/verify-components.mjs` line 1070 to dynamically discover all CSS files containing `transition` or `animation`.
  3. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/badge.css`, `components/code.css`, and `components/table.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Transitions collapse cleanly under reduced motion across all 35 component CSS modules.

#### Task 2.4: Fix Carousel and Table RTL Internationalization Deficiencies
- **Addresses Findings**: `F-COMP-006`, `F-COMP-007`
- **Target Files**:
  - `components/carousel.css`
  - `components/table.css`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. In `components/carousel.css`, add `:dir(rtl) .vd-carousel-track { transform: translateX(calc(var(--_vd-carousel-index, 0) * 100%)); }` (matching `:dir(rtl)` usage in `drawer.css`) and verify/mirror the CSS chevron arrow borders (`carousel.css:78-88`) so directional controls match RTL flow.
  2. In `components/table.css`, replace `text-align: left;` with `text-align: start;` and `text-align: right;` with `text-align: end;`.
  3. In `scripts/verify-components.mjs`, expand the RTL physical regex to detect `text-align:\s*(left|right)`.
  4. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/carousel.css` and `components/table.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Carousel slides navigate correctly in RTL layouts; tables use logical text alignments.

#### Task 2.5: Correct Erroneous "No APG Pattern Exists" Claims in Specifications
- **Addresses Finding**: `F-COMP-008`
- **Target Files**:
  - `components/carousel/spec.md`
  - `components/breadcrumb/spec.md`
  - `components/alert/spec.md`
  - `components/button/spec.md`
- **Concrete Remediation Steps**:
  1. Update frontmatter `apg:` URLs to point to official W3C APG pattern guides (`patterns/carousel/`, `patterns/breadcrumb/`, `patterns/alert/`, `patterns/button/`).
  2. Rewrite spec bodies to cite official APG keyboard interaction contracts.
- **Acceptance Criteria**: All 4 component specifications accurately cite their normative W3C APG patterns.

#### Task 2.6: Add Dark Mode Elevation Shadows to DTCG and Reconcile Figma Manifest
- **Addresses Findings**: `F-MATH-004`, `F-MATH-005`
- **Target Files**:
  - `tokens/vd3.tokens.json`
  - `tokens/figma.manifest.json`
  - `scripts/verify-tokens.mjs`
  - `tokens/tokens.d.ts`
- **Concrete Remediation Steps**:
  1. Add `theme.dark.shadow` group in `tokens/vd3.tokens.json` declaring the 6 dark composite shadows.
     - **Regression Safeguard (`verify-tokens.mjs` & `tokens.d.ts`)**: Update `cssVarFor()` in `scripts/verify-tokens.mjs:627` to route `theme.dark.shadow.<step>` to `--vd3-shadow-<step>` (currently `theme.*` hardcodes `return '--vd3-color-' + kebab(p.slice(4).join('-'))`, which would emit `'--vd3-color-'` and fail Suite 18), and add `shadow?: VD3ShadowTokens` to `VD3ThemeTokens` in `tokens/tokens.d.ts:99-105`.
  2. Reconcile `tokens/figma.manifest.json`: fix `color/primary` (`"blue/7"`/`"gold/3"` → `"gold/6"`/`"gold/4"`), `color/primary-hover` (`"blue/8"` → `"gold/7"`), `color/focus` (`"gold/4"`/`"gold/3"` → `"gold/6"`/`"gold/4"`), `bg/canvas` (`"gray/10"` → `"gray/9"` dark), `bg/layer` (`"gray/9"` → `"gray/8"` dark), `bg/layer-hover` (`"gray/8"` → `"gray/7"` dark), `text/primary` (`"gray/9"` → `"gray/10"` / `gray.1000` light), `text/muted` (`"gray/6"`/`"gray/5"` → `"gray/7"`/`"gray/3"` if aligned to `--vd-text-muted`), line 74's `normativeTokenPattern` (`--vd3-color-<family>-<step>`), and resolve the 10 broken `"web"` CSS variable mappings currently emitted at `tokens/figma.manifest.json:80-101` (where, e.g., `color/focus` currently emits `var(--vd-color-focus)` and `color/danger-subtle` emits `var(--vd-danger-0)`) so every entry references an exported token (or export the missing tokens).
- **Acceptance Criteria**: Dark theme elevation shadows exist in DTCG token source of truth; Figma binding manifest references valid CSS custom properties and existing palette ramp keys.

#### Task 2.7: Update `tokens.d.ts`, Decouple `conventions/naming.md`, and Migrate Spec Tokens to `--vd3-*`
- **Addresses Findings**: `F-MATH-006`, `F-MATH-007`, `F-SITE-014`
- **Target Files**:
  - `tokens/tokens.d.ts`
  - `conventions/naming.md`
  - `conventions/mappings.md`
  - `site/src/spec.ts`
- **Concrete Remediation Steps**:
  1. In `tokens/tokens.d.ts`, declare `VD3FocusTokens`, `VD3IconTokens`, and `VD3DensityTokens`; add `focus`, `icon`, and `density` to `VD3Tokens`; add `'focus-glow'` to `VD3ColorRoleTokens`; add `--vd3-icon-*`, `--vd3-density-*`, `--vd3-font-family-*`, `--vd3-font-size-*-static`, and `--vd3-color-canvas-rgb` to `VD3CSSPropertyName`; and add `--vd-font-family-sans` and `--vd-font-family-mono` to `VDCSSPropertyName`.
  2. In `conventions/naming.md`, establish `--vd3-*` as normative prefix with `--vd-*` as legacy aliases. Move Vue SFC / composable conventions into a separate section for implementing libraries.
  3. In `conventions/naming.md`, `conventions/mappings.md`, and `site/src/spec.ts` (`lines 21-89`, including `roleColors` on lines 86-88), migrate documentation and output code generation examples from legacy `--vd-*` to normative `--vd3-*` prefixes with documented backwards-compatible aliases.
- **Acceptance Criteria**: TypeScript definitions match DTCG schema and exported CSS variables 100%; naming conventions and documentation code generator output reflect normative `--vd3-*` token architecture.

#### Task 2.8: Add Dialog Scroll Containment, Discrete Transition Fixes, and Automatic OS Dark Mode
- **Addresses Findings**: `F-SITE-007`, `F-SITE-009`, `F-SITE-010`, `F-SITE-011`
- **Target Files**:
  - `components/dialog.css`
  - `components/popover.css`
  - `site/index.html`
  - `site/src/style.css`
  - `tokens/tokens.css`
  - `site/src/App.vue`
  - `scripts/build-ssg.mjs`
- **Concrete Remediation Steps**:
  1. In `components/dialog.css`, add `overscroll-behavior: contain;` to `.vd-dialog` and `overflow: hidden; overscroll-behavior: contain;` to `.vd-dialog::backdrop`.
  2. In `components/dialog.css` (both `.vd-dialog` at lines 31-32 **and** `.vd-dialog::backdrop` at lines 58-62) and `components/popover.css`, extract `allow-discrete` out of the `transition:` shorthand into a separate `transition-behavior: allow-discrete;` property, and add `overlay var(--vd3-duration-233, 233ms)` to `.vd-popover`'s `transition` list (`popover.css:26-29`) per `animate-to-from-top-layer`.
  3. In `site/index.html`, remove hardcoded `data-theme="light"` on `<html>`. In `site/src/style.css` (line 15), change `color-scheme: light;` to `color-scheme: light dark;`. In `tokens/tokens.css`, add `@media (prefers-color-scheme: dark)` styling for `:root:not([data-theme="light"])` (alongside explicit `color-scheme` and dark surface fallbacks).
  4. In `site/src/App.vue` and `scripts/build-ssg.mjs`, change dialog title markup from `<p>` to `<h2>` and remove `aria-expanded` from the dialog trigger button.
  5. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/dialog.css` and `components/popover.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Modal dialogs contain scroll chaining; discrete transitions don't break strict CSS parsers on either dialog panels or backdrops; visitors receive automatic OS dark theme.

#### Task 2.9: Synchronize Foundation Coverage Table and Enhance Accessibility (`FoundationTable.vue`)
- **Addresses Finding**: `F-SITE-008`
- **Target Files**:
  - `site/src/components/FoundationTable.vue`
  - `scripts/build-ssg.mjs`
- **Concrete Remediation Steps**:
  1. Synchronize `FoundationTable.vue` with `foundationRows` in `scripts/build-ssg.mjs` (rendering all 17 foundation rows including density, patterns, components, conventions).
  2. Update `icons` summary notes to match `foundations/icons.md` and `scripts/build-ssg.mjs:305` (Fibonacci sizes 13/21/34/55px, $\phi$ stroke `1.618`, semantic-role icon ink).
  3. Wrap table in `<div class="vd-table-container" tabindex="0" role="region" aria-label="Foundation coverage matrix">` with `th[scope="col"]` and `th[scope="row"]`.
- **Acceptance Criteria**: Foundation table renders all 17 rows with WCAG 1.3.1 table headers and accessible scrollable container.

---

### 5.3 Phase 3: Medium-Priority Architectural & Usability Refinements

#### Task 3.1: Reconcile Ghost Variables in `mappings.md` and Add Legacy `--vd-icon-*` Aliases
- **Addresses Findings**: `F-MATH-008`, `F-MATH-009`, `F-SITE-014`
- **Target Files**:
  - `conventions/mappings.md`
  - `tokens/tokens.css`
  - `site/src/spec.ts`
- **Concrete Remediation Steps**:
  1. In `conventions/mappings.md`, update the "vd3 role" column to display both `--vd3-color-*` and `--vd-*` aliases, resolving invalid `--vd-canvas`, `--vd-layer`, `--vd-layer-hover`, `--vd-border`, `--vd-focus`, `--vd-interactive`, and `--vd-critical` ghost references.
  2. In `tokens/tokens.css`, export the documented legacy `--vd-icon-*` aliases (referenced by `foundations/icons.md` / `tokens/vd3.tokens.json:147`), and optionally decide as a compatibility policy whether to also export `--vd-density-*` and `--vd-focus-ring-*` or document `focus.ring.*` and `density.*` as normative `--vd3-*`-only tokens.
  3. In `site/src/spec.ts`, migrate token references to normative `--vd3-*` prefixes with legacy aliases.
- **Acceptance Criteria**: Mappings table references real variables; legacy `--vd-icon-*` aliases match documentation; documentation generator uses normative tokens.

#### Task 3.2: Clean Up Stale Documentation Status Notes and Add `focus-glow` to `color.md`
- **Addresses Findings**: `F-MATH-010`, `F-MATH-011`
- **Target Files**:
  - `foundations/icons.md`
  - `foundations/density.md`
  - `foundations/color.md`
- **Concrete Remediation Steps**:
  1. Remove "proposed / not yet present" notes from `foundations/icons.md` and `foundations/density.md`.
  2. Add `focus-glow` (`--vd3-color-focus-glow`) to the semantic color role table in `foundations/color.md`.
- **Acceptance Criteria**: Foundation documents accurately reflect integrated tokens.

#### Task 3.3: Fix Broken APG URLs, Expand `dialog/spec.md`, and Fix Upload Zone Focus Ring
- **Addresses Findings**: `F-COMP-009`, `F-COMP-010`, `F-COMP-011`
- **Target Files**:
  - `components/radio/spec.md`
  - `components/segmented/spec.md`
  - `components/dialog/spec.md`
  - `components/upload.css`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. Update APG URLs in `radio/spec.md` and `segmented/spec.md` to `patterns/radio-group/`.
  2. Expand `dialog/spec.md` to include anatomy classes, API props, accessibility requirements, and `--vd3-*` tokens.
  3. Replace `:focus-within` with `:has(:focus-visible)` in `components/upload.css`.
  4. **Regression Safeguard (`verify-components.mjs` Suite 35 & Snapshots)**: `scripts/verify-components.mjs:949` (Suite 35, Feature #55: File Upload) explicitly asserts that `components/upload.css` contains `':focus-within'`. Updating `upload.css` to `:has(:focus-visible)` MUST be paired with updating Suite 35 in `scripts/verify-components.mjs:949` and regenerating SHA-256 hashes via `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` for Suite 41b.
  5. **Regression Safeguard (`dialog/spec.md` String Invariants)**: To prevent breaking `TEST-T1-CMP-002` (`tests/e2e/tier1-features/semantic-components.test.mjs:56-68`), `TEST-T2-CMP-004` (`tests/e2e/tier2-boundaries/component-edges.test.mjs:113-124`), and `TEST-T3-CMB-003` (`tests/e2e/tier3-combinations/dialog-focus.test.mjs`), the expanded `components/dialog/spec.md` MUST preserve `'MOB-001'`, a valid `w3.org` APG modal dialog URL, the `'DLG-001.*first focusable.*dialog\s+surface if none'` focus clause, the exact verbatim key tokens `'Tab / Shift+Tab'` and `'Escape'`, and all four normative rule identifiers `'DLG-001'`, `'DLG-002'`, `'DLG-003'`, and `'DLG-004'`.
- **Acceptance Criteria**: Valid APG links; complete dialog spec; upload zone pointer clicks do not trigger focus rings.

#### Task 3.4: Reconcile Untokenized Literals and Toast Placement Class Naming
- **Addresses Findings**: `F-COMP-012`, `F-COMP-013`
- **Target Files**:
  - `components/toast.css`
  - `components/badge.css`
  - `components/button.css`
  - `components/code.css`
  - `components/dialog.css`, `components/card.css`, `components/navbar.css`, `components/form.css`
  - `scripts/verify-components.mjs`
  - `scripts/verify-a11y.mjs`
- **Concrete Remediation Steps**:
  1. Replace raw hex/rgba and arbitrary pixel/numeric literals in `toast.css`, `badge.css` (also adding `.vd-badge--solid.vd-badge--critical`), `button.css` (also replacing primitive `--vd3-color-gray-*`/`--vd3-color-gold-*` and undefined `--vd3-color-border-strong` references with semantic roles), `code.css`, and sibling overlay alphas (`dialog.css`, `card.css`, `navbar.css`, `form.css`) with semantic tokens.
  2. Update toast placement class names to logical variants (`--bottom-start`, `--top-end`, etc.).
  3. **Regression Safeguard (Toast Suite 16 & A11y Contrast Parser)**:
     - `scripts/verify-components.mjs:810` (Suite 16, Feature #36: Toast Notification Component) asserts literal physical toast selectors (`.vd-toast-container--bottom-left`, `--top-right`, `--top-left`, `--bottom-center`). Switching to logical modifier classes requires updating Suite 16 (or retaining deprecated legacy aliases).
     - `scripts/verify-a11y.mjs:161-175` parses `#([0-9a-fA-F]{6})` literals directly out of `components/badge.css` and `components/code.css`! Replacing raw hex literals in `badge.css` and `code.css` with CSS custom properties requires concurrently updating `verify-a11y.mjs` to resolve those tokens from `tokens.css`/`vd3.tokens.json` so automated contrast checking remains active.
  4. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `toast.css`, `badge.css`, `button.css`, `code.css`, and sibling component stylesheets alters tracked SHA-256 hashes; regenerate snapshots via `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: 100% tokenized colors and Fibonacci geometries across component CSS with intact contrast verification.

#### Task 3.5: Expand Keyboard Contracts in `menubar/spec.md` and `tabs/spec.md`, and Add Vertical Tabs CSS
- **Addresses Findings**: `F-COMP-014`, `F-COMP-015`, `F-COMP-016`
- **Target Files**:
  - `components/menubar/spec.md`
  - `components/tabs/spec.md`
  - `components/tabs.css`
- **Concrete Remediation Steps**:
  1. Add `Left Arrow` and `Right Arrow` submenu navigation keys to `menubar/spec.md`.
  2. In `tabs/spec.md`, preserve its explicit APG Automatic Activation choice (`TAB-002`) while adding the omitted `Tab` (into active tabpanel), `Shift+Tab`, horizontal (`Left/Right Arrow`) vs vertical (`aria-orientation="vertical"` `Up/Down Arrow`) split, fixing the `aria-orientation` typo on `Delete`, and optionally documenting `Space`/`Enter` for manual-activation variants.
  3. Add `[aria-orientation="vertical"]` / `.vd-tabs--vertical` styles to `components/tabs.css`.
  4. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `components/tabs.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Complete APG keyboard specifications; vertical tabs supported in CSS.

#### Task 3.6: Replace Truncated Code Snippets and Implement `components/icon.css`
- **Addresses Findings**: `F-SITE-012`, `F-SITE-017`, `F-SITE-018`, `F-SITE-019`
- **Target Files**:
  - `site/src/App.vue`
  - `scripts/build-ssg.mjs`
  - `components/icon.css`
  - `components/index.css`
  - `components/SPEC.md`
  - `scripts/verify-components.mjs`
  - `site/index.html`
  - `site/src/components/SiteNavbar.vue`
- **Concrete Remediation Steps**:
  1. Replace the 18+ truncated snippets (`16` using `...`, `2` using Unicode `…` in `tabs` and `menu`, plus incomplete structural stubs like `upload`, `accordion`, and `menubar`) in `App.vue` and `build-ssg.mjs` with complete, functional markup.
  2. Author `components/icon.css` implementing `.vd-icon` classes from `foundations/icons.md`, export it in `components/index.css`, register `icon.css` in `scripts/verify-components.mjs` (`requiredFiles` / `componentFiles`), and update module inventory counts & documentation from `35` (`layout` + `34` components) to `36` across `components/SPEC.md`, `site/src/App.vue` (`lines 410, 544`), and `scripts/build-ssg.mjs` (`lines 309, 766, 887`), adding an Icon specimen card in both `App.vue` and `build-ssg.mjs`.
  3. Add an inline `<script>` in `site/index.html` `<head>` reading `localStorage.getItem('vanduo-theme-preference')` (matching `@vanduo-oss/vd3`'s persisted key) and setting `document.documentElement.dataset.theme` to `'light'` or `'dark'` before first paint (leaving `data-theme` unset when `'system'` or `null`).
  4. Add `min-height: 44px` touch targets to navigation links in `SiteNavbar.vue`.
  5. **Regression Safeguard (Component Snapshot Integrity)**: Introducing `components/icon.css` and updating `components/index.css` alters tracked components; run `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to update `scripts/snapshots.json` for Suite 41b.
- **Acceptance Criteria**: Full copyable component snippets; standalone icon primitive; zero dark mode flash; accessible touch targets.

#### Task 3.7: Implement Static Fallbacks for Inert SSG Interactive Elements
- **Addresses Finding**: `F-SITE-013`
- **Target Files**: `scripts/build-ssg.mjs`
- **Concrete Remediation Steps**:
  1. In `scripts/build-ssg.mjs`, provide inline zero-JS event fallback or data attributes for `.vd-code-copy` buttons.
  2. Wire `#demo-dialog-trigger` in `site/src/App.vue` and `scripts/build-ssg.mjs` using native Invoker Commands (`command="show-modal" commandfor="demo-modal-dialog"`), paired with a conditional `'commandForElement' in HTMLButtonElement.prototype` progressive fallback (and `<noscript>` notice) for pre-Invoker browsers in `build-ssg.mjs`.
  3. Ensure font cycling button in `build-ssg.mjs` line 845 renders as a native `<button>` element.
- **Acceptance Criteria**: SSG interactive controls have graceful fallbacks in zero-JS environments.

---

### 5.4 Phase 4: Modern Web Platform Evolution & Polish

#### Task 4.1: Mathematical Taxonomy Refinement and Reduced Motion Parity
- **Addresses Findings**: `F-MATH-012`, `F-MATH-013`, `F-MATH-014`, `F-MATH-015`
- **Target Files**:
  - `foundations/elevation.md`
  - `foundations/motion.md`
  - `tokens/vd3.tokens.json`
  - `tokens/tokens.css`
- **Concrete Remediation Steps**:
  1. Document the Level 4 index jump in `foundations/elevation.md`.
  2. Reclassify `icon.gap` as Class C (`exceptionId: "C-01"`) in `vd3.tokens.json`.
  3. Add `[data-motion="reduce"], [data-motion="reduce"] *, [data-motion="reduce"] *::before, [data-motion="reduce"] *::after` overrides in `tokens.css` (including the root `[data-motion="reduce"]` element itself so `html { scroll-behavior: smooth; }` is also reset to `scroll-behavior: auto;`), and synchronize the `[data-motion="reduce"]` selector documentation in `foundations/motion.md:65-73`.
  4. Clarify `math.golden-angle` degree usage in `tokens.json`.
- **Acceptance Criteria**: Documented elevation sequence rationale; full reduced motion attribute parity including root scroll behavior.

#### Task 4.2: Component Polish (Pagination Chevrons, Spec Cleanup, Layer Prelude)
- **Addresses Findings**: `F-COMP-017`, `F-COMP-018`, `F-COMP-019`, `F-COMP-020`
- **Target Files**:
  - `components/pagination.css`
  - `components/input/spec.md`, `components/select/spec.md`, `components/checkbox/spec.md`, `components/radio/spec.md`, `components/button/spec.md`
  - `components/index.css`
  - `scripts/verify-components.mjs`
- **Concrete Remediation Steps**:
  1. Mirror pagination chevrons in `:dir(rtl)` (consistent with `drawer.css`).
  2. Remove obsolete "Gaps Flagged for 1.0.3" callouts and update outdated v1 anatomy/state prose (`80px` textarea height, `20×20` checkbox/radio dimensions, missing `:indeterminate` and `:read-only` support) across `input/spec.md`, `select/spec.md`, `checkbox/spec.md`, `radio/spec.md`, and `button/spec.md`.
  3. Add `vd3.utilities` to the `@layer` prelude in `components/index.css` (line 6).
  4. Remove redundant dark theme focus override in `pagination.css`.
  5. **Regression Safeguard (`verify-components.mjs` Suite 2 `@layer` Prelude & Snapshots)**: `scripts/verify-components.mjs:123` (Suite 2) asserts the exact literal string `'@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components;'`. Adding `vd3.utilities` to `components/index.css:6` requires updating Suite 2 at `scripts/verify-components.mjs:123` and regenerating `scripts/snapshots.json` via `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Flawless RTL pagination; synchronized cascade layers; clean specifications.

#### Task 4.3: Adopt Container Queries on Component Primitives
- **Addresses Finding**: `F-SITE-015`
- **Target Files**:
  - `components/card.css`
  - `components/toolbar.css`
  - `components/pagination.css`
  - `components/table.css`
- **Concrete Remediation Steps**:
  1. Add `@container (max-width: ...)` rules to `.vd-card`, `.vd-toolbar`, and `.vd-pagination` so they adapt when placed in golden split minor columns ($38.2\%$).
  2. **Regression Safeguard (Component Snapshot Integrity)**: Modifying `card.css`, `toolbar.css`, `pagination.css`, and `table.css` requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Components respond to local container widths independently of viewport width.

#### Task 4.4: Integrate HTML Popover API and CSS Anchor Positioning
- **Addresses Finding**: `F-SITE-016`
- **Target Files**:
  - `components/popover.css`
  - `components/tooltip.css`
  - `components/menu.css`
  - `components/hover-card.css`
  - `components/datepicker.css`
  - `components/timepicker.css`
  - `components/tour.css`
  - `components/popover/spec.md`
- **Concrete Remediation Steps**:
  1. Align overlay CSS rules with native `[popover]` and `:popover-open` states (building on existing `:popover-open` selectors in `hover-card.css:30` and `tour.css:31`, and adding missing placement modifiers on `menu.css`, `hover-card.css`, `datepicker.css`, `timepicker.css`, and `tour.css`).
  2. Implement CSS Anchor Positioning (`position-anchor`, `position-area`, `position-try-fallbacks`) progressively on anchored floating panels.
  3. **Regression Safeguard (Cross-Browser Top-Layer Positioning)**: CSS `@supports` cannot prevent HTML `[popover]` top-layer promotion when the `popover` attribute is present on an element; UA `[popover]` defaults center the element via `inset: 0; margin: auto;` and only strand it at `(0, 0)` if `inset: auto; margin: 0;` is applied unconditionally. Therefore, keep `inset: auto; margin: 0;`, `position-anchor`, `position-area`, and `position-try-fallbacks` **inside** `@supports (position-area: block-end)` (or `@supports (top: anchor(bottom))`), retain `@supports not (position-area: block-end)` container/JS fallback behavior (or load `@oddbird/css-anchor-positioning` where needed), since `position-area` currently has Limited availability across browsers.
  4. **Regression Safeguard (Component Snapshot Integrity)**: Modifying floating overlay CSS files requires running `UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs` to satisfy Suite 41b.
- **Acceptance Criteria**: Floating panels render cleanly in the top layer with automatic viewport flip fallbacks where Anchor Positioning is supported, without stranding panels at `(0, 0)` in unsupported browsers.

#### Task 4.5: Site Polish, Modern CSS `light-dark()`, and Semantic `<progress>`
- **Addresses Findings**: `F-SITE-020`, `F-SITE-021`, `F-SITE-022`, `F-SITE-023`
- **Target Files**:
  - `site/src/style.css`
  - `site/src/components/FoundationTable.vue`
  - `site/src/components/demos/*.vue`
  - `site/src/App.vue`
  - `scripts/build-ssg.mjs`
  - `components/progress.css`
- **Concrete Remediation Steps**:
  1. Replace remaining physical directional properties with logical properties across `site/src/style.css` (`line 268`), `FoundationTable.vue` (`line 44`), `ProportionDemos.vue` (`line 64`), and sibling demo SFCs.
  2. Add `(opens in new tab)` announcements to external `target="_blank"` Figma UI Kit links.
  3. Extend `components/progress.css` to style native `<progress class="vd-progress">` using full custom styling — **never** pairing `accent-color` with `background-color`/`border-radius` (which disables `accent-color` in Chromium): apply `appearance: none; overflow: clip;` on `progress.vd-progress`, style `::-webkit-progress-bar`, write separate (non-grouped) rule blocks for `::-webkit-progress-value` and `::-moz-progress-bar`, use `container-type: inline-size` (`cqi` units) for `:indeterminate` animation, and preserve a static visible indicator under reduced motion.
  4. Document architectural adoption criteria for CSS `color-scheme` + `light-dark()` (preserving `[data-theme]` fallbacks for custom theme switching) and OKLCH wide-gamut palettes.
- **Acceptance Criteria**: 100% logical CSS in site styles; accessible external links; standards-compliant native `<progress>` styling across WebKit/Blink/Gecko.

---

## 6. Verification & Regression Health Check

To ensure that the generation of this comprehensive evaluation report and actionable improvement plan caused zero regressions and adhered strictly to non-destructive execution rules, the full repository verification pipeline was executed.

### 6.1 Test Suite Verification Commands & Results

All 6 standard verification suites were executed directly against the repository:

```bash
$ pnpm test:tokens && pnpm test:components && pnpm test:m2 && pnpm typecheck && pnpm test:a11y && pnpm test:e2e
```

#### Suite 1: Token Math & Derivation Verification (`scripts/verify-tokens.mjs`)
- **Command**: `pnpm test:tokens`
- **Assertions**: 585 checks across 18 test suites
- **Result**: **585 / 585 PASSED (0 failures)**
- **Coverage**: Golden Ratio precision, Binet sequence identities ($F_n, L_n$), Spacing scale, Line weights, Border radius, Modular typography, Line heights, Container widths, Elevation shadows, Glow blurs, Motion durations, Golden aspect ratios, Golden angle hue steps, Golden Béziers, Three-Class Basis classifications, Focus ring geometry, Iconography and Density tokens, and DTCG-to-CSS export drift gate.

#### Suite 2: Zero-Framework Component CSS Verification (`scripts/verify-components.mjs`)
- **Command**: `pnpm test:components`
- **Assertions**: 922 checks across 45 test suites (covering all 35 CSS modules: `layout.css` + 34 component CSS files)
- **Result**: **922 / 922 PASSED (0 failures)**
- **Coverage**: Cascade layer declarations, framework runtime reference prohibitions, RTL logical property compliance, focus ring declarations, component contract selectors, cryptographic SHA-256 snapshot integrity, and reduced motion overrides.
- **Mandatory Component CSS Snapshot Update Protocol (Suite 41b)**: `scripts/verify-components.mjs` Suite 41b enforces cryptographic SHA-256 integrity against `scripts/snapshots.json` for all component stylesheets in `components/`. Any modification to component CSS files or the introduction of new CSS modules (e.g., `components/icon.css`) will alter these hashes and cause Suite 41b to fail unless snapshots are regenerated. Developers modifying component styles MUST run:
  ```bash
  UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs
  ```
  This synchronizes `scripts/snapshots.json` with the updated files before executing `pnpm test:components` or the full CI test suite.

#### Suite 3: Interactive Component Contracts (`tests/challenge-m2-interactive.mjs`)
- **Command**: `pnpm test:m2`
- **Assertions**: 47 checks across 10 test suites
- **Result**: **47 / 47 PASSED (0 failures)**
- **Coverage**: Dual-theme contrast matrix, dialog focus lifecycle, and layout engine integrity.

#### Suite 4: Static Code & Compilation Check (`scripts/verify-typecheck.mjs`)
- **Command**: `pnpm typecheck`
- **Assertions**: 189 checks
- **Result**: **189 / 189 PASSED (0 failures)**
- **Coverage**: `tsconfig.json` validation, static relative import resolution across `site/src/`, TypeScript syntax/transpilation via `esbuild.transform`, Vue SFC compilation via `vue/compiler-sfc`, and `node --check` on `.mjs` scripts (note: `verify-typecheck.mjs` does **not** run full semantic `tsc --noEmit` / `vue-tsc --noEmit` type-checking).

#### Suite 5: Pre-rendered HTML Accessibility Audit (`scripts/verify-a11y.mjs`)
- **Command**: `pnpm test:a11y`
- **Assertions**: 918 checks
- **Result**: **918 / 918 PASSED (0 failures)**
- **Coverage**: Landmark structures, heading hierarchy, image alt text, button accessible names, table scopes, and WCAG AA contrast rules in `site/dist/index.html` and CSS files.

#### Suite 6: Full End-to-End Test Suite (`tests/e2e/runner.mjs`)
- **Command**: `pnpm test:e2e`
- **Assertions**: 58 checks across 13 test suites
- **Result**: **58 / 58 PASSED (0 failures)**
- **Coverage**:
  - Tier 1: Canonical Standards Compliance (W3C DTCG 2025.10, CSS Cascade Layer Order, WCAG 2.1 AA Relative Luminance, Three-Class Basis Registry).
  - Tier 2: Boundary Conditions & Edge Cases (Pill radius invariants, Shadow ink alpha transparency, Reduced motion collapses, Stacking order zero-floor, JSON-LD syntax, Golden split subpixel rounding, Binet formula boundaries).
  - Tier 3: Combinatorial Integration Gates (Native `<dialog>` modal lifecycle, Golden Ratio layout split + modular typography, Dual-theme switching contrast matrix).
  - Tier 4: Real-World Scenarios (Headless AI Agent ingestion workflow, Zero-framework web developer workflow, Production accessibility audit).

### 6.2 Non-Destructive Integrity Attestation (Pre-Fix Evaluation Baseline)

- **Pre-existing Codebase Modification**: **NONE** at report evaluation time.
- **Deliverable & Verification Pass**: Audited and updated sole deliverable at `docs/vd3-standard-evaluation-report-and-improvement-plan.md` across a second independent claim-by-claim verification pass against the repository.
- **Git Status**: Baseline pre-fix snapshot prior to Section 7 remediation execution.

---

## 7. Remediation Verification Summary

All 4 planned remediation phases (M1 tokens/math/manifest/foundations/conventions, M2 zero-framework CSS components + `components/icon.css` Feature #61 + APG specs + verification hardening, M3 documentation site parity + FOUC/dark-mode + logical CSS + `@vanduo-oss/vd3` `useDocSearch` above Chapters, and M4 SSG/browser/adversarial verification) have been implemented and verified.

### 7.1 Post-Fix Repository Test Suite Results (`pnpm build && pnpm test`)

| Suite | Command | Passed / Total | Failed |
| --- | --- | --- | --- |
| Token Math & Derivation | `pnpm test:tokens` | **1117 / 1117** | 0 |
| Component CSS & Snapshots | `pnpm test:components` | **994 / 994** | 0 |
| Interactive Contracts | `pnpm test:m2` | **47 / 47** | 0 |
| Static Compile & Typecheck | `pnpm typecheck` | **197 / 197** | 0 |
| SSG Accessibility Audit | `pnpm test:a11y` | **989 / 989** | 0 |
| End-to-End Test Suite | `pnpm test:e2e` | **59 / 59** | 0 |

### 7.2 Live Headless Chrome Verification Highlights

- **Pre-paint & OS Dark Mode**: Cold load under OS `prefers-color-scheme: dark` preserves unset `data-theme` (does not write `'light'` into `localStorage`), renders dark canvas (`rgb(13, 17, 23)`) immediately with `0` console/page errors, and measures initial/hydration CLS = `0.0073` (no vertical hydration jump). Stored `vanduo-theme-preference = "dark"` applies `data-theme="dark"` pre-paint on reload.
- **`Cmd+K` / `Ctrl+K` Search Across All 5 Domains**: `#doc-search-input` (`SiteDocSearch.vue` powered by `@vanduo-oss/vd3` `useDocSearch`) sits above `#doc-toc-title` (`Chapters (18)`), focuses on `Meta+k` / `Ctrl+k`, displays unclipped results across **Foundations**, **Specimens**, **Component Specs**, **Conventions**, and **Patterns**, and moves keyboard focus + hash on selection (`ArrowDown` + `Enter`).
- **Interactive Specimens, Contrast, Focus Rings, & RTL**: Native `<dialog>.showModal()` (`#demo-dialog-trigger`), modal `<aside>` drawer (`#demo-drawer-panel`), APG `Tabs`, filtered `TypeDemo` (`0` `-static` duplicate rows), 8-step `ColorDemo` Golden Angle swatches, settled `:focus-visible` dual-ring shadows (`2px` canvas offset + `2px` focus ring), and `dir="rtl"` mirrored search layout (`scrollWidth === clientWidth`) all verified in headless Google Chrome.
