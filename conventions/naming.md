# Naming conventions

Status: stable · Spec: 2.0.0-draft

- **Tokens** — semantic, kebab-case, no theme in the name (`--vd-layer-hover`,
  never `--vd-layer-hover-dark`; themes swap values, names stay).
- **CSS** — custom properties always prefixed `--vd-`: the v1.9 prefix, kept
  verbatim for backwards compatibility (Q6 decision — no renames at v2).
  Component-scoped tokens as `--vd-⟨component⟩-⟨role⟩`. Mapping from DTCG
  path: `--vd-` + path with `.` → `-`, except the `color.role.*` tier, which
  collapses to `--vd-⟨name⟩` (semantic roles are the public API). Where v1.9
  shipped a different public name (e.g. `--vd-border-color`), the v1.9 name
  wins; the v2 audit maps any alias.
- **Attributes** — the v1.9 hooks verbatim, on the root element: `data-theme`,
  `data-primary`, `data-palette`, `data-motion`.
- **Components** — Vue SFC, PascalCase, one word where possible
  (`Dialog.vue`, `DatePicker.vue`).
- **Composables** — `use⟨Feature⟩`, one composable per interaction; composables
  are the behavior contract, markup is the presentation.
- **Props** — camelCase in script, kebab-case in templates; boolean props named
  for their effect, not their absence (`disabled`, not `not-enabled`).
- **Events** — past tense or state verb (`closed`, `change`) — pick per family
  and stay consistent.
- **Requirement IDs** — `⟨SLUG⟩-⟨3-digit⟩`, assigned once, never reused.
