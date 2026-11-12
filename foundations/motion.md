# Motion

Status: stable · Spec: 2.0.0-draft

- Duration tokens form the **seven-step Fibonacci ladder** in
  `tokens/vd3.tokens.json` (group `motion`, class A): instant 55ms → fast 89 →
  snappy 144 → normal 233 → moderate 377 → slow 610 → gentle 987ms. Each tier
  has a usage class (micro-interactions → page transitions), recorded in the
  token descriptions. Durations are NOT conventional values (research brief
  F3-1). Values ILLUSTRATIVE pending the v2 audit; ladder structure binding.
- Easing MUST use the token set `easing` (out / in / in-out) — no bespoke curves
  per component.
- **MOB-001** `prefers-reduced-motion: reduce` MUST suppress all non-essential
  motion. What counts as essential (e.g., an element moving to a new permanent
  position) is defined per component spec.
- Motion MUST never be the only signal for state changes.
