# Changelog

Spec follows semver independently of library releases.

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
