# First Principles

Status: stable · Spec: 2.0.0-draft

These are the axioms of VD3 UI CORE. Every rule, component, token, and layout primitive elsewhere in this system derives from them.

- **PRN-001 — Proportion by default, convention by decision, exceptions by registry.**
  The system MUST NOT contain undocumented visual constants. Every constant carries a basis class (defined in `foundations/proportion.md`):
  - **Class A**: Derives from $\phi$ (1.6180339887…), the Fibonacci sequence ($F_n$), the Lucas sequence ($L_n$), or any sequence whose neighbor-ratio converges to $\phi$ (the default).
  - **Class B**: Conventional-by-design and MUST carry a written reason in the specification (e.g., standard breakpoints, 12-column grid, stacking ladder).
  - **Class C**: Registered exception in the registry (`C-01`…`C-04`) justified by physical device limits, GPU constraints, or accessibility.
  There is no Class D — an unclassifiable constant is a specification defect.

- **PRN-002 — One source of truth.**
  A design decision exists in exactly one place: a single-source-of-truth DTCG token or a foundation specification section here. Everything else references it.

- **PRN-003 — Behavior is standard, identity is proprietary.**
  Component behavior (keyboard navigation, focus restoration, ARIA roles, state announcements) MUST conform strictly to the W3C ARIA Authoring Practices Guide (APG). Visual identity, proportions, and geometries follow no external design system.

- **PRN-004 — Zero-framework core surface.**
  The core design system components, layout primitives, and typography are zero-framework pure HTML5 and modern CSS organized via native `@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities`. HTML elements require zero client JavaScript runtime to render cleanly. Vue 3.3+ is used exclusively within `site/` for the documentation bible SSG pre-rendering pipeline and interactive documentation playgrounds.

- **PRN-005 — Accessibility is a feature, not a pass.**
  A component without a complete keyboard navigation path, visible dual-ring focus contract, and WCAG AA/AAA compliant color contrast is incomplete, regardless of visual aesthetics.

- **PRN-006 — Docs are part of the product & dual readability.**
  Every component ships with semantic HTML markup, machine-readable `data-vd-*` attributes, a live interactive demo, a typed API specification table, and copy-paste code snippets. The documentation bible in `site/` is engineered for dual readability: intuitive editorial typography for human designers and structured static semantic HTML with Schema.org JSON-LD for AI coding agents.

- **PRN-007 — Decisions are recorded.**
  A decision made in code but absent from these specifications is a process defect. Specifications precede and govern implementation.

- **PRN-008 — Honesty is a feature.**
  Every specification table carries an explicit Basis column (Class A / B / C). Publishing where $\phi$ is NOT used is a differentiator; silent drift is an architectural bug.

- **PRN-009 — Architectural Integrity Guard (Feature #47).**
  The team and system strictly prohibit copying core logic from external open-source component libraries or importing third-party UI framework dependencies for core functionality. All mathematical derivations, layout calculations, and component behaviors are built natively.

- **PRN-010 — Public Endpoints & Machine Ingestion (Feature #41).**
  Authoritative design tokens (`vd3.tokens.json`), schemas (`schema.json`), and compiled styles (`tokens.css`) MUST be served as static, publicly fetchable endpoints under `/tokens/` for automated consumption by AI agents, build pipelines, and external integrations.
