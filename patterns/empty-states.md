# Pattern — Empty States

Status: stable · Spec: 1.1.0-draft · APG: none

## When to use / when NOT

Use when a collection, table, list, or searchable region legitimately contains
zero items, so the user needs an explanation and a next action. Do NOT use
for errors (use `.vd-alert` with `role="alert"`), for loading (use skeleton /
spinner — library-level, phase 1.2), or to pad a page that is simply sparse.

## Anatomy — the Three-Part Empty State

Normative anatomy from `conventions/content.md` ("Empty States"):

1. **Descriptive title** — plain declaration of absence
   (`No custom tokens found`).
2. **Contextual explanation** — why the state is empty, one sentence.
3. **Primary call-to-action** — a `.vd-btn--primary` button that populates
   the state (`Create token`), Verb + Noun, sentence case.

An optional decorative icon sits above the title (`aria-hidden="true"`;
meaning is never carried by the icon alone, WCAG 1.4.1).

## Implementation

- **Core**: the anatomy is composed from `.vd-container*` (centering),
  `.vd-card` (optional surface), and `.vd-btn--primary` (CTA). Inside a
  `.vd-table-container` / `.vd-table` region, render the empty state as a
  full-width row/cell, not a floating overlay.
- **Library-level**: `@vanduo-oss/vd3` ships `VdEmptyState` implementing this
  anatomy with classes `.vd-empty`, `.vd-empty-icon`, `.vd-empty-title`,
  `.vd-empty-description`, `.vd-empty-action`. Core intentionally has no
  empty-state component (Atlassian/Ant ship one; Carbon treats it as pattern
  guidance — we follow Carbon, see `docs/gap-analysis.md` §2.1).

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

- Icon size: `icon.size.lg` (planned — see Deviations).
- Text: `color.role.text-primary` (title, `type.size.xl`), `color.role.text-secondary` (explanation, `type.size.base`, `type.leading.normal`).
- Spacing: `space.fib-8/13/21/34` (stack gaps, centered padding).
- Surface: `color.role.layer` / `color.role.canvas`, `radius.fib-8`, `shadow.2` when carded.
- CTA: inherits `.vd-btn--primary` tokens (`color.role.interactive`, `focus.ring.*`).

## Accessibility notes

- EMP-001 The title is a real heading (`<h2>`–`<h3>` depending on page
  hierarchy), so the state is discoverable in the document outline.
- EMP-002 The icon is `aria-hidden="true"`; the title text carries the meaning.
- EMP-003 The CTA is a real `<button>`/link with a dual-ring `:focus-visible`
  (FOC-001…004) and a Verb + Noun label per `conventions/content.md`.
- EMP-004 The empty state is static content — NOT a live region; do not
  announce it on render, announce only the result of the CTA action.

## Deviations & references

- `icon.size.lg` is the planned icon-size token from the phase-1.1 icons
  foundation (`docs/roadmap-1.0.2-draft.md`); it is NOT yet in
  `tokens/vd3.tokens.json`. Interim rule: size the icon via the `type.size.*`
  scale or a component-scoped `--vd-empty-icon-size` token. This is a
  registered forward reference, not a consumed token.
- Consulted: Carbon Empty State pattern (guidance-only) and Atlassian Empty
  State component — adopts the 3-part anatomy verbatim from
  `conventions/content.md`; deviates from Atlassian by keeping the component
  library-level rather than in core.
