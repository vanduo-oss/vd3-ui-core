# Layout Primitives & Proportions

Status: stable · Spec: 1.0.0-draft

Layout structures in VD3 UI CORE are governed by the Golden Section ($\phi \approx 1.6180339887$), Fibonacci column scaling ($1, 2, 3, 5, 8$), and Lucas/Fibonacci container max-width thresholds.

## Golden Ratio Layout Splits (Feature #13)

For any two-column interface container of total width $W$, the normative golden division divides space into major ($1/\phi$) and minor ($1/\phi^2$) segments:

$$\text{Major Section} = W \times \frac{1}{\phi} = W \times (\phi - 1) \approx 61.8034\% \approx 61.8\%$$
$$\text{Minor Section} = W \times \frac{1}{\phi^2} = W \times \left(1 - \frac{1}{\phi}\right) \approx 38.1966\% \approx 38.2\%$$
$$\text{Sum Check}: 61.8034\% + 38.1966\% = 100.0000\%$$

### Standard Applications
1. **Default Golden Split (`.vd-layout-golden`)**:
   - $61.8\%$ Primary Work Canvas / Editorial Reading Column.
   - $38.2\%$ Contextual Inspector / Metadata Sidebar / Outline.
2. **Inverted Golden Split (`.vd-layout-golden-rev`)**:
   - $38.2\%$ Navigation Tree / Catalog Filter Rail.
   - $61.8\%$ Main Article / Results Stream.

### CSS Implementation
```css
.vd-layout-golden {
  display: grid;
  grid-template-columns: 61.8% 38.2%;
  gap: var(--vd3-space-fib-21);
}

.vd-layout-golden-rev {
  display: grid;
  grid-template-columns: 38.2% 61.8%;
  gap: var(--vd3-space-fib-21);
}

@media (max-width: 768px) {
  .vd-layout-golden,
  .vd-layout-golden-rev {
    grid-template-columns: 1fr;
    gap: var(--vd3-space-fib-13);
  }
}
```

## Fibonacci Column Grids (Feature #14)

Instead of arbitrary column divisions, multi-column layouts scale strictly across Fibonacci numbers: $1, 2, 3, 5, 8$ columns ($F_1, F_3, F_4, F_5, F_6$).

| Grid Class | Columns | Fibonacci Term | Usage Context | Standard Gutter |
|---|---|---|---|---|
| `.vd-grid-fib-1` | 1 | $F_1 / F_2$ | Single-column editorial reading measure | None |
| `.vd-grid-fib-2` | 2 | $F_3$ | Dual split (50/50 comparison or 61.8/38.2 golden split) | `space.fib-13` (13px) |
| `.vd-grid-fib-3` | 3 | $F_4$ | Feature showcase, card grid | `space.fib-21` (21px) |
| `.vd-grid-fib-5` | 5 | $F_5$ | Complex dashboard summary, KPI metrics matrix | `space.fib-13` (13px) |
| `.vd-grid-fib-8` | 8 | $F_6$ | Dense analytical workspace, data table sub-grid | `space.fib-8` (12px / 8px) |

## 12-Column Conventional Grid Engine (Feature #15)

Where interoperability with external enterprise templates demands a 12-column grid, VD3 provides a conventional 12-column engine classified as **Class B** (familiarity beats math, PRN-001). The 12-column grid pairs exclusively with Fibonacci gutters (`space.fib-8` = 12px/8px, `space.fib-13` = 13px, `space.fib-21` = 21px).

```css
.vd-grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--vd3-space-fib-13);
}
```

## Container Max-Width Thresholds (Features #3, #11)

All page content containers are bounded by integer values from the Lucas and Fibonacci sequences, ensuring harmonic alignment with typography and layout scales:

| Token | CSS Variable | Max-Width | Derivation Sequence | Basis | Content Usage |
|---|---|---|---|---|---|
| `container.sm` | `--vd3-container-sm` | `521px` | Lucas $L_{13} = \text{round}(\phi^{13} + (-\phi)^{-13})$ | Class A | Narrow forms, centered authentication dialogs, single-column prose |
| `container.md` | `--vd3-container-md` | `610px` | Fibonacci $F_{15} = \text{round}((\phi^{15} - (-\phi)^{-15}) / \sqrt{5})$ | Class A | Standard reading measure (optimal 65-75 character lines) |
| `container.lg` | `--vd3-container-lg` | `987px` | Fibonacci $F_{16} = \text{round}((\phi^{16} - (-\phi)^{-16}) / \sqrt{5})$ | Class A | Standard documentation bible layout, standard application dashboard |
| `container.xl` | `--vd3-container-xl` | `1364px` | Lucas $L_{15} = \text{round}(\phi^{15} + (-\phi)^{-15})$ | Class A | Wide workstation canvas, dual-panel workbench |
| `container.2xl`| `--vd3-container-2xl`| `1597px` | Fibonacci $F_{17} = \text{round}((\phi^{17} - (-\phi)^{-17}) / \sqrt{5})$ | Class A | Full-width data grid view, analytics telemetry wall |

## Golden Aspect Ratio Sizing (Feature #12)

Visual media, cards, dialog windows, and hero viewports utilize golden aspect ratios:

| Token | CSS Variable | Ratio Value | Orientation | Basis | Primary Use Case |
|---|---|---|---|---|---|
| `aspect.golden` | `--vd3-aspect-golden` | `1.618 / 1` | Landscape | Class A | Feature cards, preview viewports, dialog dimensions |
| `aspect.golden-portrait` | `--vd3-aspect-golden-portrait` | `1 / 1.618` | Portrait | Class A | Mobile preview modals, vertical gallery media |

```css
.vd-card-media {
  aspect-ratio: var(--vd3-aspect-golden, 1.618 / 1);
  object-fit: cover;
  width: 100%;
}
```
