# Proportion — the golden spine

Status: stable · Spec: 2.0.0-draft

φ = (1 + √5)/2 = 1.6180339887…  ·  Golden angle = 137.5077640…°

## The three-class contract (PRN-001)

Every visual constant belongs to exactly one basis class. There is no class D.

| Class | Meaning | Rule |
|---|---|---|
| **A — φ-derived** | the default | Fibonacci, Lucas, φ itself, or any sequence whose neighbor-ratio converges to φ |
| **B — conventional-by-design** | familiarity beats math | allowed only with a written reason in the spec (breakpoints, default 12-column grid, the `z` stacking ladder — conventional increments, tokenized; Q3 decision) |
| **C — registered exception** | physics, performance, or a11y overrides math | MUST appear in the exceptions registry below; re-reviewed at each major version |

**Convergence zone:** where physics, performance, or platform limits cap a
value, the constant is capped, documented, and its sibling properties continue
the progression. C-02 (glass blur soft-cap) is the seeded example.

## Exceptions registry

| ID | Exception | Rule | Status |
|---|---|---|---|
| C-01 | Rem-rounded small spacing steps | Spacing tokens named `fib-2/3/5/8` ship as 4/6/8/12px; the sequence is literal from 13px | registered |
| C-02 | Glass blur soft-cap | Blur soft-caps at ~20px (convergence zone); tint, edge, and elevation continue the Fibonacci progression | registered |
| C-03 | Glow blur intensities | Resolved (Q2): remapped from arithmetic 10/20/30px to Fibonacci 8/13/21 — now class A, no longer an exception. ID retired, never reused. See the `glow` token group. | resolved |
| C-04 | Pill radius | `radius.full` (9999rem) is a shape semantic, not a scale step | registered |

## Fibonacci spacing scale

One normative scale (PRN-002). Names are Fibonacci numbers; values are rem on a
16px base. Small steps follow C-01:

| Token | Value | px | Basis |
|---|---|---|---|
| `space.fib-1`  | 0.125rem  | 2  | A (rounded) |
| `space.fib-2`  | 0.25rem   | 4  | C-01 |
| `space.fib-3`  | 0.375rem  | 6  | C-01 |
| `space.fib-5`  | 0.5rem    | 8  | C-01 |
| `space.fib-8`  | 0.75rem   | 12 | C-01 |
| `space.fib-13` | 0.8125rem | 13 | A — literal from here |
| `space.fib-21` | 1.3125rem | 21 | A |
| `space.fib-34` | 2.125rem  | 34 | A |
| `space.fib-55` | 3.4375rem | 55 | A |

The px helper scale (`--vd-spacing-*`) MUST be generated as aliases of these
tokens — one scale, two units, no parallel system. Components MUST NOT use
ad-hoc gaps. (Values ILLUSTRATIVE pending the v2 audit; names and structure are
binding — concrete mapping in `tokens/vd3.tokens.json`.)

## Containers

Fibonacci and Lucas are both citizens — both sequences converge to φ at the same
rate, so both are lawful class A:

- Small container: **521px** (L₁₃, Lucas)
- Medium container: **610px** (F₁₅)
- Standard container: **987px** (F₁₆)
- Wide container: **1597px** (F₁₇)

## Golden rows

Two-part splits divide **1 : 1.618**. For a row of width W:
the primary part is W × 0.618, the secondary W × 0.382.

## Fibonacci palette (optional theme)

Hues placed at successive multiples of the golden angle (137.5°) around the hue
wheel — the same distribution as phyllotaxis in plants — yielding hues that are
maximally spread. The default theme MAY use a conventional palette (class B);
the Fibonacci palette is an opt-in preset.

## Shadows

Each elevation level's offset and blur are a consecutive Fibonacci pair:
1/2, 2/3, 3/5, 8/13, 13/21, 21/34 (see `elevation.md`).

**Anti-rule:** a visual constant with no basis class is out of contract.
Classify it (A/B/C) or change the constant — never ship it silently.
