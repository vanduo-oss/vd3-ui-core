# Typography

Status: stable · Spec: 2.0.0-draft

The typographic hierarchy in VD3 UI CORE is governed by a modular scale factor of $\sqrt{\phi} \approx 1.2720196495$, paired with line-height ratios derived from $\phi$.

## Modular Typography Scale (Feature #8)

Consecutive typographic steps scale by $\sqrt{\phi} \approx 1.272$. Consequently, every two steps multiply type size by the golden ratio $\phi \approx 1.618034$ ($16 \to 26 \to 42 \to 68\text{px}$), establishing a natural doubling power progression.

### Normative Scale Table

| Step $k$ | Token | Mathematical Formula | Static Value | Fluid Responsive Clamp Expression | Basis | Intended Role |
|---|---|---|---|---|---|---|
| -2 | `type.size.xs` | $16 \times (\sqrt{\phi})^{-2} \approx 9.88\text{px}$ | `0.75rem` / 12px | — | Class B | Badges, captions, legal microcopy |
| -1 | `type.size.sm` | $16 \times (\sqrt{\phi})^{-1} \approx 12.58\text{px}$ | `0.8125rem` / 13px | — | Class A | Secondary body, metadata, helper text ($F_7$) |
| 0 | `type.size.base` | $16 \times (\sqrt{\phi})^0 = 16\text{px}$ | `1.0rem` / 16px | — | Class A | Primary body copy, input text, table cells |
| 1 | `type.size.lg` | $16 \times (\sqrt{\phi})^1 \approx 20.35\text{px}$ | `1.125rem` / 18px | `clamp(1.125rem, 1.08rem + .22vw, 1.25rem)` | Class A | Subheadings, card titles, lead paragraphs |
| 2 | `type.size.xl` | $16 \times (\sqrt{\phi})^2 = 16\phi \approx 25.89\text{px}$ | `1.25rem` / 20px | `clamp(1.35rem, 1.25rem + .5vw, 1.625rem)` | Class A | Section headers (H3), dialog modal titles |
| 3 | `type.size.2xl` | $16 \times (\sqrt{\phi})^3 \approx 32.93\text{px}$ | `1.5rem` / 24px | `clamp(1.62rem, 1.46rem + .8vw, 2.0625rem)` | Class A | Chapter subheadings (H2), metric cards |
| 4 | `type.size.3xl` | $16 \times (\sqrt{\phi})^4 = 16\phi^2 \approx 41.89\text{px}$ | `1.875rem` / 30px | `clamp(1.94rem, 1.69rem + 1.25vw, 2.625rem)` | Class A | Major section titles, page titles (H1) |
| 5 | `type.size.4xl` | $16 \times (\sqrt{\phi})^5 \approx 53.28\text{px}$ | `2.25rem` / 36px | `clamp(2.33rem, 1.97rem + 1.8vw, 3.3125rem)` | Class A | Large hero headlines |
| 6 | `type.size.5xl` | $16 \times (\sqrt{\phi})^6 = 16\phi^3 \approx 67.78\text{px}$ | `4.25rem` / 68px | `clamp(2.8rem, 2.27rem + 2.65vw, 4.25rem)` | Class A | Display editorial headlines |
| 7 | `type.size.6xl` | $16 \times (\sqrt{\phi})^7 \approx 86.21\text{px}$ | `5.375rem` / 86px | `clamp(3.36rem, 2.63rem + 3.65vw, 5.375rem)` | Class A | Monumental display titles |

## Normative Line Heights (Feature #9)

Every typographic scale step MUST pair with a line-height drawn from the $\phi$ proportional spine:

| Token | CSS Custom Property | Ratio Value | Exact Derivation | Basis | Intended Pairing & Context |
|---|---|---|---|---|---|
| `type.leading.tight` | `--vd3-line-height-tight` | `1.236` | $2/\phi = 2 \times 0.618034$ | Class A | Display headlines (`3xl`–`6xl`) |
| `type.leading.snug` | `--vd3-line-height-snug` | `1.382` | $1 + 1/\phi^2 = 1 + 0.381966$ | Class A | Section headers, card titles (`xl`–`2xl`) |
| `type.leading.normal`| `--vd3-line-height-normal`| `1.5` | Harmonic median bridge | Class B | Dense UI controls, form inputs (`base`) |
| `type.leading.relaxed`| `--vd3-line-height-relaxed`| `1.618`| $\phi$ | Class A | Long-form body prose, documentation articles (`base`, `lg`) |
| `type.leading.loose` | `--vd3-line-height-loose` | `2.0` | $\phi + 1/\phi^2 = 2.0$ | Class B | Double-spaced editorial reading, legal text |

## Tracking & Letter Spacing

Six tracking tokens (`type.tracking`) calibrate optical kerning across size registers:
- `tighter` (`-0.05em`) / `tight` (`-0.025em`): Optical compaction for large display titles (`3xl`–`6xl`).
- `normal` (`0`): Standard body baseline.
- `wide` (`0.025em`) / `wider` (`0.05em`): Expanded spacing for small caps, buttons, and badges.
- `widest` (`0.1em`): Wide tracking for uppercase labels and table headers.

## Functional Registers (Feature #10)

VD3 defines two distinct functional registers:

1. **App Register (Dense Product UI)**:
   - Engineered for high information density (telemetry dashboards, tabular inspectors, data grids).
   - Headings range compactly from `base` to `2xl`, paired with `tight` (1.236) or `snug` (1.382) line heights and `tight` tracking (`-0.025em`).
   - Body copy utilizes `base` (16px) or `sm` (13px) with `normal` (1.5) line height.

2. **Editorial Register (Long-Form Reading)**:
   - Engineered for readability in design bibles, documentation articles, and research whitepapers.
   - Headings leverage fluid responsive clamp scaling (`3xl` to `6xl`).
   - Body copy utilizes `base` (16px) with `relaxed` (1.618) line height.
   - Column measure is strictly constrained to 65–75 characters per line using `container.md` (610px) or `container.lg` (987px).
