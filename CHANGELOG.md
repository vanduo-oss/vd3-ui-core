# Changelog

Spec follows semver independently of library releases.

## 1.0.2-draft — phantom primitives shipped, component specs, focus tokens, RTL-safe CSS

- New zero-framework primitives in `components/`: `switch.css` (Feature #37, APG
  Switch pattern, golden φ track ratios 21/13 · 34/21 · 55/34, RTL-safe
  `inset-inline-start` thumb travel), `alert.css` (#38, live-region roles,
  info/success/warning/critical variants, RTL-safe `border-inline-start` accent),
  `tabs.css` (#39, APG Tabs pattern, 2px = F₃ active indicator). Registered in
  `components/index.css`; `scripts/verify-components.mjs` extended (3 new feature
  suites #37–39, focus/MOB-001/zero-framework lists) — 416/416 assertions pass.
- New specs: `components/SPEC.md` master index + `components/switch/spec.md`
  (SWT-001…005), `components/alert/spec.md` (ALR-001…004),
  `components/tabs/spec.md` (TAB-001…005). Figma manifest `spec:` links repointed
  to live targets (`SPEC.md#<slug>` anchors or real per-slug specs); dead
  `foundations/space.md` board reference repointed to `foundations/proportion.md`.
- Focus contract tokenized: `focus.ring.*` group added to `tokens/vd3.tokens.json`
  (width/offset = F₃ = 2px Class A; color/offset-color alias semantic roles;
  glow = F₆ = 8px) + `color.role.focus-glow` in light and dark themes (parity);
  `focus`, `theme`, `breakpoint` added to `tokens/schema.json` `required`;
  `FOC-001…FOC-004` defined in `foundations/focus.md`; new verify-tokens suite 16
  (385/385 assertions pass).
- RTL: physical `left/right`/`border-left` replaced with logical
  `inset-inline-*`/`border-inline-start` in `form.css`, `toast.css`, `code.css`
  (LTR rendering unchanged; RTL now mirrors). Accordion chevron intentionally kept
  physical (rotated glyph, not layout).
- Doc drift fixed: AGENTS.md/README (6 verification commands, real component
  list of 14 modules, PRN-001…010, canonical layer order, data-* hook ownership,
  test:m2 script path), glossary conformance `^1.0`.
- Site: switch/alert/tabs specimens (with `data-vd-*` contracts) and their specs
  added to the Components chapter (`site/src/App.vue` + `scripts/build-ssg.mjs`);
  counts 11 → 14 CSS modules.
- Analysis artifacts: `docs/gap-analysis.md` (core vs vd3 vs Carbon/M3/Fluent/
  Atlassian/Ant/Radix/shadcn, with proof commands) and `docs/roadmap-1.0.2-draft.md`
  (phased gap-closure plan).
- Spec version renumbered `1.0.1-draft` → `1.0.2-draft` across spec headers,
  package manifests, JSON-LD, badges, and e2e assertions.

## 1.0.1-draft — framework-agnostic positioning & site polish

- Site hero/meta/JSON-LD/README now state the contract explicitly: "VD3 UI Core —
  Framework-Agnostic Design System on Golden-Ratio Math", consumable from any
  stack (vanilla JS, React, Vue, Svelte) with zero runtime dependency. Project
  codename "HydroCORE" recorded (vanduo = water, Lithuanian).
- Docs site adopts the vanduo-oss home/vd3-docs visual direction: self-hosted
  Michroma display face on the hero, glass hero card, subtle CSS gradient wash
  (WebGL liquid layer dropped). Navbar font cycler unified with the theme
  switcher/customizer actions (2.125rem circular outline button, "Aa" in the
  active font, info toast on change).
- Cyan is the site default primary in both themes: `data-primary="cyan"` first
  paint + `setThemeDefaults({ PRIMARY_LIGHT/DARK: 'cyan' })` so the customizer
  "Reset to default" restores cyan; accent/interactive/focus tokens follow
  `--vd-primary-*` via a single bridge. Global default font is Open Sans
  (`FONT: 'open-sans'`, also on reset and first paint via `data-font`).
- `@vanduo-oss/vd3` bumped `^1.9.0` → `^1.9.1`. Audited delta: 181 changed values,
  all primitive ramps (`--vd-fib-*`, OC rose/purple/fuchsia/golden); zero
  semantic `--vd3-*` or role `--vd-color-*` changes. Recorded in
  `docs/token-audit.md`; normative `tokens/` values unchanged.
- Spec version renumbered `1.0.0-draft` → `1.0.1-draft` across spec headers,
  package manifests, JSON-LD, badges, and e2e assertions.

## 1.0.0-draft — incepting

- First principles (PRN-001…007), proportional spine, semantic color model,
  golden elevation ladder.
- Normative references set: W3C APG (behavior), W3C DTCG (tokens).
- Consulted literature: IBM Carbon only; Material 3 excluded.
- Token architecture: three tiers (primitive → semantic role → component).
- Conformance model: `"implements": "vd3-ui-core@^1.0"` + CI drift checks.
- Components scaffolded: `_TEMPLATE.md`, worked example `dialog/spec.md`.
- VALUES IN `tokens/vd3.tokens.json` ARE ILLUSTRATIVE — pending the token
  audit; structure and naming are binding, values are not.
- Consistency pass against `docs/research-brief.md` (F3): three-class A/B/C
  contract codified in `principles.md` (PRN-001, PRN-008) and
  `foundations/proportion.md`; exceptions registry seeded (C-01 rem-rounded
  small spacing steps, C-02 glass blur soft-cap, C-03 glow blur pending Q2,
  C-04 pill radius). Lucas numbers confirmed class A (containers 521/610 added).
- `tokens/vd3.tokens.json`: dangling `color.primitive.*` / `color.role.shadow`
  references fixed (primitive scales added); per-theme role sets added
  (`theme.dark.color.role`); motion group replaced with the seven-step
  Fibonacci ladder 55–987ms (F3-1); spacing renamed to `fib-N` with C-01
  working values and the px-helper-as-alias rule (F3-2/3); shadow values
  corrected to their pair labels and extended to 6 levels (through 21/34);
  `line` (1/2/3/5px, F3-5) and `type` groups added; radius moved to Fibonacci
  steps with `full` registered as C-04.
- `foundations/motion.md`, `elevation.md`, `typography.md`, `color.md`,
  `components/dialog/spec.md`, `conventions/mappings.md` aligned to the token
  structure above; `site/index.html` gained shadow-6 and a tokenized z-index.
- Open questions from `docs/research-brief.md` resolved: **Q2** glow blurs
  remapped from arithmetic 10/20/30px to Fibonacci 8/13/21 (`glow` group;
  registry C-03 retired). **Q3** z-index = tokened ladder of conventional
  increments, class B with written reason (`z` group). **Q6** public CSS prefix
  stays `--vd-` verbatim — the draft `--vd3-` prefix is retired everywhere;
  v1.9 attribute hooks `data-theme` / `data-primary` / `data-palette` /
  `data-motion` adopted (backwards compatibility; leaf-name aliases reconciled
  in the token audit). **Q7** chart color contract defined for both palette engines
  (`foundations/color.md` → Data visualization). **Q4** density: recommendation
  recorded in `foundations/typography.md` (registers + fluid scale suffice;
  Carbon-style productive/expressive modes not adopted) — decision stays open.
- Q1 (small-step fudge) codified as C-01 and Q5 (Lucas = class A) settled by the
  kickoff doctrine; both still need value confirmation in the token audit.
- Repo layout: the spec skeleton moved from `export-from-vibe-web/` to the repo
  root; the folder is gone.
- `site/` rebuilt as a real app dogfooding `@vanduo-oss/vd3@1.9.0` (pnpm
  workspace: root `package.json` + `site/`, Vue 3 + Vite). Glass navbar via
  `VdNavbar variant="glass" position="sticky"`, theme via `useThemePreference()`
  + `VdThemeSwitcher`, vd3 font tokens with a navbar font cycler. Page content
  is generated from the markdown spec and `tokens/vd3.tokens.json` at build
  time (`@spec` alias, `?raw` imports); the framework-free `site/index.html`
  mockup was replaced by the app entry. Verified with `vite build` + headless
  browser run (theme/font switching, zero console errors).
- token audit COMPLETE — see `docs/token-audit.md`. `tokens/vd3.tokens.json`
  values now audited against `@vanduo-oss/vd3@1.9.0` (dist/tokens.json + vd3-core.css
  + vd3.css); ILLUSTRATIVE flags removed. Highlights: space 9/9 confirmed (C-01
  exact: fib-2=4px, -3=6px, -5=8px, -8=12px, literal from 13); fib shadow pairs
  1/2…21/34 all ship as real composites; radius-fib extended to 21; containers
  521/610/987/1364/1597; breakpoints 576…1400 (new group, class B); z ladder =
  v1.9 --vd-z-* 1000…1080 (class B); motion = numeric ladder --vd-duration-55…987
  plus named aliases; easing = real golden beziers (1/φ, 1/φ² control points);
  type scale + φ leadings + 6 tracking tokens confirmed; glass blur soft-cap
  (C-02) confirmed at 14–26px past fib 13; line weights and focus geometry
  confirmed as real v1.9 gaps (new in 1.0). `conventions/naming.md` gained the
  audited DTCG-path → public CSS-name table.
