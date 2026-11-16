# Naming conventions

Status: stable · Spec: 1.1.0-draft

- **Tokens** — semantic, kebab-case, no theme in the name (`--vd-layer-hover`,
  never `--vd-layer-hover-dark`; themes swap values, names stay).
- **CSS** — custom properties always prefixed `--vd-`: the v1.9 prefix, kept
  verbatim for backwards compatibility (Q6 decision — no renames in core 1.0).
  Component-scoped tokens as `--vd-⟨component⟩-⟨role⟩`. Mapping from DTCG
  path: `--vd-` + path with `.` → `-`, except the `color.role.*` tier, which
  collapses to `--vd-⟨name⟩` (semantic roles are the public API). Where v1.9
  shipped a different public name (e.g. `--vd-border-color`), the v1.9 name
  wins; the token audit maps any alias. Audited DTCG-path → public CSS name table
  (v1.9, from `docs/token-audit.md`):

  | DTCG path | public CSS var |
  |---|---|
  | `color.role.canvas` | `--vd-bg-primary` |
  | `color.role.layer` / `layer-hover` | `--vd-bg-secondary` / `--vd-bg-tertiary` |
  | `color.role.text-primary` / `text-secondary` | `--vd-text-primary` / `--vd-text-secondary` |
  | `color.role.border` | `--vd-border-color` |
  | `color.role.focus` / `interactive` | `--vd-color-primary` (`-hover`) |
  | `color.role.critical` | `--vd-color-error` |
  | `space.fib-N` | `--vd-space-fib-N` |
  | `radius.fib-N` | `--vd-radius-fib-N` |
  | `motion.N` / `motion.base`… | `--vd-duration-N` / `--vd-duration-base`… |
  | `easing.out` / `in` / `in-out` | `--vd-ease-out` / `-in` / `-in-out` |
  | `shadow.N` | `--vd-shadow-*` (fib variant) |
  | `z.modal` etc. | `--vd-z-modal` etc. |
  | `container.lg` etc. | `--vd-container-lg` etc. |
  | `breakpoint.md` etc. | `--vd-breakpoint-md` etc. |
  | `type.size.base` | `--vd-font-size-base` |
  | `type.leading.tight` | `--vd-line-height-tight` |
  | `type.tracking.wide` | `--vd-letter-spacing-wide` |
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
