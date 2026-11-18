# Cross-system translations

Status: stable · Spec: 1.1.0-draft

Orientation for people (and agents) arriving from other systems. **This is a
translation table, not conformance.** vd3 follows no external design system
(`foundations/principles.md` PRN-003).

| Normative `--vd3-*` Role | Legacy `--vd-*` Alias | Carbon Equivalent | Note |
|---|---|---|---|
| `--vd3-color-canvas` | `--vd-bg-primary` | `background` | page behind all layers |
| `--vd3-color-layer` | `--vd-bg-secondary` | `layer` | raised surface |
| `--vd3-color-layer-hover` | `--vd-bg-tertiary` | `layer-hover` | |
| `--vd3-color-text-primary` | `--vd-text-primary` | `text-primary` | |
| `--vd3-color-text-secondary` | `--vd-text-secondary` (`--vd-text-muted`) | `text-secondary` | |
| `--vd3-color-border` (`--vd3-color-border-subtle`) | `--vd-border-color` | `border-subtle` | |
| `--vd3-color-focus` (`--vd3-color-focus-glow`) | `--vd-color-primary` | `focus` | vd3: golden hue by default |
| `--vd3-color-interactive` | `--vd-color-primary-hover` | `link-primary` | vd3 generalizes to all interaction |
| `--vd3-color-critical` | `--vd-color-error` (`--vd-color-danger`) | `danger` | |
| `--vd3-shadow-1..6` | `--vd-shadow-1..6` (`--vd-shadow-sm..2xl`) | — (Carbon uses flat layers) | intentional identity deviation |

Spacing: Carbon's 2x grid (2/4/8/16/24/32) overlaps vd3's normative scale at 2,
4, 8 (with registered exception C-01 on the small steps) — the systems are
cousins, not twins. vd3 ships one scale; the px helpers are aliases.
