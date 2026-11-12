# Motion

Status: stable · Spec: 2.0.0-draft

- Duration tokens form the **Fibonacci ladder** in `tokens/vd3.tokens.json`
  (group `motion`, class A), audited against v1.9 (`--vd-duration-55…987`, plus
  `--vd-duration-0`): 55 → 89 → 144 → 233 → 377 → 610 → 987ms. The v1.9 named
  layer is kept as aliases: `instant`=89, `fast`=144, `base`=233, `slow`=377,
  `slower`=610, `slowest`=987. Usage classes: micro-interactions → page
  transitions (see token descriptions).
- Easing MUST use the token set `easing` (out / in / in-out / linear) — the
  golden beziers whose control points are 1/φ and 1/φ². No bespoke curves per
  component.
- v1.9 also ships motion primitives: `--vd-motion-crossfade` (= duration-89),
  `--vd-motion-scale-from` (.95), `--vd-motion-shift` (.5rem = 8px).
- **MOB-001** `prefers-reduced-motion: reduce` MUST suppress all non-essential
  motion (v1.9 collapses durations to 0s under `data-motion="reduce"`). What
  counts as essential (e.g., an element moving to a new permanent position) is
  defined per component spec.
- Motion MUST never be the only signal for state changes.
