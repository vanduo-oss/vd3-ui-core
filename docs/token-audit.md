# Token audit — `@vanduo-oss/vd3@1.9.0` vs `tokens/vd3.tokens.json`

Status: stable · Spec: 1.0.1-draft · Date of audit: against vd3 **1.9.0**

## 1.9.1 delta (site dep bumped to `@vanduo-oss/vd3@1.9.1`)

Programmatic diff of `dist/tokens.json` 1.9.0 → 1.9.1: 998 → 998 variables, 0 removed,
0 added, 181 changed — **all** changes are primitive ramps only (`--vd-fib-*`, plus Open
Color `rose`/`purple`/`fuchsia`/`golden` steps). Zero `--vd3-*` semantic tokens and zero
`--vd-color-*` role tokens changed, and `customizer` is identical, so every conformance
statement below still holds against 1.9.1. The spec's `golden-angle` primitives remain
audited at 1.9.0 values; the 1.9.1 fib-ramp shift is recorded here, not silently merged.

## Method

Sources inspected locally (no doc-snippet guessing this time):

- `node_modules/@vanduo-oss/vd3/dist/tokens.json` — 878 generated CSS variables
  (`cssVariables`) + `customizer` (palettes, primary, neutral, radius, fonts,
  themeModes, motionModes, defaults)
- `dist/vd3-core.css` and `dist/vd3.css` — every `--vd-*` declaration, including
  `[data-theme="dark"]` blocks and component-level overrides
- runtime defaults observed in a headless browser: `data-palette="open-color"`,
  default light primary = **amber**, neutral = charcoal, font = ubuntu

Every spec group below is classified: **confirmed** (spec == v1.9), **remapped**
(spec name kept, value/name follows v1.9 per Q6 backwards compatibility),
**new in 1.0** (v1.9 gap, spec adds it), **class-B alias** (v1.9 ships both; the
conventional set is classified B), or **exception** (registry C-xx).

## Results per group

| Spec group | v1.9 source | Verdict |
|---|---|---|
| `space` (fib-N) | `--vd-space-fib-1…55` | **confirmed 9/9** — incl. C-01 (fib-2=4px, fib-3=6px, fib-5=8px, fib-8=12px; literal from 13). Also found: `--vd-spacing-*` = literal Fibonacci **px** (0,1,2,3,5,8,13,21,34,55,89,144) and `--vd-space-1…16` = 4px-based conventional scale (4/8/12/16/20/24/32/40/48/64px). Resolution of F3-3: one normative scale (`space`, rem, C-01); `--vd-spacing-*` is its px alias; `--vd-space-*` is a class-B conventional utility scale. |
| `line` | only `--vd-border-width: 1px` exists | **new in 1.0** — F3-5 confirmed as a real gap. Spec adds 1/2/3/5px (class A); 1px maps to `line.hair`. |
| `radius` | `--vd-radius-fib-2/3/5/8/13/21` + `--vd-border-radius-sm/md/lg/xl` (4/8/12/16px) | **confirmed + extended** — spec now carries fib-2…fib-21 (v1.9 values); conventional sm/md/lg/xl = class-B aliases; `full` = C-04. |
| `shadow` | fib pairs in css: `--vd-shadow-sm` 1/2, `--vd-shadow` 2/3, md 3/5, lg 8/13, xl 13/21, `--vd-shadow-2xl` 21/34; plus conventional sm/md/lg/xl in tokens.json | **confirmed 6/6** — all six pairs exist, as layered composites (level N = pair + next-smaller pair). Spec values replaced with the real composites. Conventional set = class-B aliases. |
| `glow` | glow blur lives untokenized in component classes (arithmetic 10/20/30px) | **remapped per Q2** — fib 8/13/21px, class A; tokenization itself is new in 1.0. |
| `z` | `--vd-z-dropdown 1000, sticky 1020, fixed 1030, modal-backdrop 1040, modal 1050, popover 1060, tooltip 1070, toast 1080` | **remapped per Q3+Q6** — named conventional 10-step ladder from 1000, class B; `base: 0` new in 1.0. |
| `container` | `--vd-container-sm/md/lg/xl/2xl` = 521/610/987/**1364**/1597px | **confirmed + extended** — 1364px (Lucas L16) added. |
| `breakpoint` (new group) | `--vd-breakpoint-sm/md/lg/xl/2xl` = 576/768/992/1200/1400px | **confirmed, new group** — class B. |
| `type.size` | `--vd-font-size-xs…4xl` static (12/13/16/18/20/24/30/36px) + fluid `clamp()` lg…6xl with phi-multiple max bounds (…/1.25/1.625/2.0625/2.625/3.3125/4.25/5.375rem) | **confirmed** — spec adopts static min bounds + fluid clamps for 5xl/6xl (68px = 16·φ³, 86px max). Class A. |
| `type.leading` | φ set present in css (tight 1.236, snug 1.382, normal 1.5, relaxed 1.618); conventional 1.25/1.5/1.75/2 also present | **confirmed** — φ set is normative (class A); conventional set = class-B aliases. |
| `type.tracking` (new) | `--vd-letter-spacing-*` ×6 (−0.05…0.1em) | **confirmed, new group** — class B (brief's "6 tracking tokens"). |
| `motion` | `--vd-duration-0,55,89,144,233,377,610,987` + named aliases `instant…slowest` (= 89…987) | **confirmed ladder; names remapped** — spec keys are now the numeric ladder, named aliases kept as DTCG references (v1.9 layer). CSS mapping `motion.* → --vd-duration-*`. Note: v1.9 `instant` = 89ms, not 55 — 55ms exists only as the numeric token. Class A. |
| `easing` | `--vd-ease-out (.236,1,.382,1)`, `-in (.618,0,.764,0)`, `-in-out (.618,0,.382,1)`, `-linear` | **confirmed** — control points are literally 1/φ and 1/φ². Class A. |
| `color.primitive` | `--vd-gray-*`, `--vd-yellow-*` (amber), `--vd-red-*` (Open Color baseline); `--vd-oc-*` raw + `--vd-fib-*`/`--vd-golden-*` (Fibonacci golden-angle engine) | **confirmed** — dual palette engine is real: `data-palette` switches `--vd-*` between `--vd-oc-*` and `--vd-fib-*`. Spec primitive now carries the real baseline hexes. |
| `color.role` (light) | `--vd-bg-primary #fff`, `--vd-bg-secondary gray-0`, `--vd-bg-tertiary gray-1`, `--vd-text-primary #1a1d20`, `--vd-text-secondary/muted gray-7`, `--vd-border-color gray-3`, `--vd-color-primary` (default light primary **amber** = yellow-6), `--vd-color-error red-6` | **confirmed + remapped names** — public CSS names follow v1.9 (see naming.md table). No `--vd-focus` var exists: focus ring = `--vd-color-primary`, geometry is component-level (2px/3px shadows) → **F3-7 confirmed as a real gap**; `focus` role maps to `--vd-color-primary`, geometry tokens new in 1.0. |
| `theme.dark` | `[data-theme="dark"]` block: bg-primary gray-9, bg-secondary gray-8, text-primary gray-0, text-secondary gray-3, border gray-7, color-primary primary-4 | **confirmed** — spec dark role set filled with these. |
| glass (C-02) | `--vd-glass-blur` steps observed: 2/3/5/8/13px then capped 14/16/20/22/24/26px | **C-02 confirmed** — soft-cap begins right after fib 13; max 26px. tint/edge/saturate continue (bg-opacity .08–.42, border-alpha .22–.28, saturate 1.35–2.2). |
| motion extras | `--vd-motion-crossfade = var(--vd-duration-89)`, `--vd-motion-scale-from .95`, `--vd-motion-shift .5rem` (8px) | noted for `foundations/motion.md`; reduce-mode collapses durations to 0s (observed in css). |

## F3 worklist — resolution status

1. Stale honesty table (motion "conventional") — **resolved**: ladder confirmed, spec motion group now numeric fib + v1.9 aliases.
2. Small spacing steps — **resolved**: C-01 values confirmed exactly (4/6/8/12).
3. Two parallel spacing scales — **resolved**: `space` normative; `--vd-spacing-*` px alias; `--vd-space-*` class-B utility.
4. Glow blur arithmetic — **resolved** per Q2: remapped to 8/13/21, tokenized.
5. No border-weight tokens — **confirmed gap**, `line` group new in 1.0.
6. No z-index scale — **resolved**: v1.9 `--vd-z-*` ladder adopted (class B).
7. No focus-ring spec — **confirmed gap**: no geometry tokens in v1.9; new in 1.0 (`foundations/focus.md` to write).
8. No density modes — open (Q4 advice recorded: registers suffice).
9. No content guidelines — open (`conventions/content.md` to write).
10. No data-viz color contract — decided (Q7: both engines) in color.md; swatch values for charts still to write.

## What changed in the repo because of this audit

- `tokens/vd3.tokens.json` — values replaced with audited v1.9 values; new groups
  `breakpoint`, `type.tracking`; `radius` extended to fib-21; `container` gained
  xl=1364; `z` remapped to the real ladder; `motion` numeric + named aliases;
  `easing` real golden beziers; `shadow` real composites; ILLUSTRATIVE flags removed.
- `conventions/naming.md` — CSS-name mapping table (spec path → v1.9 public var).
- Site demos re-derive from the audited file automatically (token-driven).

## Remaining unknowns (for the next audit round)

- Exact default primary per theme mode (light=amber observed; dark=?), and the
  full `--vd-primary-*` ramp per `data-primary` hue — the runtime generates them
  from `theme/generated`; spec keeps `color.role` as the stable contract.
- Icon sizing steps (brief suggested fib 13/21/34) — Phosphor weights confirmed,
  size tokens not yet located.
- Focus-ring geometry values (F3-7) — observed 2px/3px in component rules; needs
  a normative decision.
