# Glossary

- **φ (phi)** — the golden ratio, 1.6180339887…; the system's proportional constant.
- **Golden angle** — 137.5077…°; drives the optional Fibonacci palette's hue placement.
- **Semantic role** — a color/dimension token named for meaning, not value; the only tokens components may consume.
- **Layer** — a raised surface on the canvas; vd3 pairs layers with golden shadow steps.
- **DTCG** — W3C Design Tokens Community Group format; the JSON structure of `tokens/vd3.tokens.json`.
- **APG** — W3C ARIA Authoring Practices Guide; the normative behavior reference.
- **Conformance** — a library's declared `"implements": "vd3-ui-core@^1.0"`; verified by CI.
- **Spec semver** — this repo versions independently of library releases.
- **Golden row** — a 1 : 1.618 two-part split of a container.
- **Basis class (A/B/C)** — the proportional contract's classification of every visual constant: A = φ/Fibonacci/Lucas-derived (default), B = conventional-by-design (written reason required), C = registered exception. No class D.
- **Convergence zone** — the rule that where physics, performance, or a11y caps a value, the constant is capped and documented while sibling properties continue the progression.
- **Exceptions registry** — the numbered list of class-C exceptions in `foundations/proportion.md` (C-01 rem-rounded small spacing, C-02 glass blur soft-cap, …), re-reviewed at each major version.
- **Density** — the two-mode spacing multiplier (`foundations/density.md`): comfortable (1) vs compact (`1/√φ`) via `[data-density="compact"]`.
- **Icon size** — Fibonacci icon box steps 13/21/34/55px (`icon.size.*`, `foundations/icons.md`); outline stroke is φ (1.618).
