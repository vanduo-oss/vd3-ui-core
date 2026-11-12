# First principles

Status: stable · Spec: 2.0.0-draft

These are the axioms of vd3. Every rule elsewhere in this repo derives from them.

- **PRN-001 — Proportion by default, convention by decision, exceptions by
  registry.** The system MUST NOT contain undocumented visual constants. Every
  constant carries a basis class (defined in `foundations/proportion.md`):
  **class A** derives from φ (1.6180339887…), the Fibonacci sequence, the Lucas
  sequence, or any sequence whose neighbor-ratio converges to φ (the default);
  **class B** is conventional-by-design and MUST carry a written reason;
  **class C** is a registered exception in the registry (C-01…). There is no
  class D — an unclassifiable constant is a spec bug.

- **PRN-002 — One source of truth.** A design decision exists in exactly one
  place: a token or a spec section here. Everything else references it.

- **PRN-003 — Behavior is standard, identity is proprietary.** Component
  behavior (keyboard, focus, ARIA) MUST conform to the W3C ARIA Authoring
  Practices Guide. Visual identity follows no external design system.

- **PRN-004 — Minimal surface.** Implementations are Vue 3.3+ only, typed,
  SSR-safe, tree-shakeable, with zero runtime dependencies. Complexity must be
  justified in writing.

- **PRN-005 — Accessibility is a feature, not a pass.** A component without a
  complete keyboard path and visible focus is not done, regardless of how it looks.

- **PRN-006 — Docs are part of the product.** Every component ships a live demo,
  a typed API table, and a copy-paste snippet. If a page can't be written that
  way, the API is wrong, not the page.

- **PRN-007 — Decisions are recorded.** A decision made in code but not in this
  repo is a bug in process. Specs precede implementation.

- **PRN-008 — Honesty is a feature.** Every spec table carries a basis column
  (A/B/C). Publishing where φ is NOT used is a differentiator; silent drift is
  a spec bug.
