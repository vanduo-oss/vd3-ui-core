# Line & Border Weights

Status: stable · Spec: 1.0.2-draft

Line weights and border strokes in VD3 UI CORE are strictly derived from the Fibonacci sequence ($F_n$). Every border carries an explicit basis classification and satisfies W3C non-text contrast guidelines.

## Proportional Spine

Border thickness follows the discrete sequence of initial Fibonacci numbers:

$$F_1 = 1\text{px}, \quad F_2 = 1\text{px}, \quad F_3 = 2\text{px}, \quad F_4 = 3\text{px}, \quad F_5 = 5\text{px}$$

Ad-hoc border widths (such as 4px or non-Fibonacci pixel values) are prohibited. Four canonical widths are tokenized to cover all interface demarcations.

## Normative Border Weights Table

| Token | CSS Custom Property | Legacy Alias | Value | Fibonacci Term | Basis | Intended Architectural Role |
|---|---|---|---|---|---|---|
| `line.hair` | `--vd3-border-width-hair` | `--vd-border-width`, `--vd-line-hair` | `1px` | $F_1 / F_2$ | Class A | Structural dividers, table row rules, subtle card outlines |
| `line.thin` | `--vd3-border-width-thin` | `--vd-line-thin` | `2px` | $F_3$ | Class A | Default interactive component borders (inputs, buttons, quiet tabs) |
| `line.regular` | `--vd3-border-width-regular` | `--vd-line-regular` | `3px` | $F_4$ | Class A | Active states, selection rings, focus indicators, callout strokes |
| `line.thick` | `--vd3-border-width-thick` | `--vd-line-thick` | `5px` | $F_5$ | Class A | High-emphasis accent bars (alert borders, progress tracks, active rails) |

## Hairlines and High-Density Displays

On high-density displays (`min-resolution: 2dppx` or Retina viewports), 1 CSS pixel corresponds to 2 or more physical device pixels. While subpixel hairline rendering (e.g., `0.5px`) is physically feasible on modern mobile viewports, VD3 establishes `1px` as the normative minimum baseline to guarantee predictable rasterization, anti-aliasing uniformity, and contrast integrity across heterogeneous display hardware.

### Dark-Mode Hairline Contract

Rendering solid light border lines (`#ffffff`) against dark canvas backgrounds (`#212529`) introduces harsh optical vibration and excessive luminance dissonance.

In dark themes:
1. Borders MUST NOT use opaque white.
2. Hairlines MUST use alpha-blended ink or calibrated neutral gray values:
   - Subtle boundaries: `rgba(255, 255, 255, 0.08)` ($F_6 = 8\%$) or `--vd3-color-border-subtle`.
   - Structural boundaries: `rgba(255, 255, 255, 0.13)` ($F_7 = 13\%$) or `--vd3-color-border` (`gray.7` #495057).
   - Component boundaries: `--vd3-color-border` resolving to `gray.7`.

## Structural vs Decorative Lines

VD3 categorizes all lines and rules into two operational domains:

1. **Structural Boundaries**:
   - Lines that establish essential perceptual boundaries (e.g., input field perimeters, selected tab borders, table header demarcations).
   - Conformance: MUST maintain $\ge 3:1$ non-text contrast against adjacent backgrounds to comply with WCAG 2.1 Success Criterion 1.4.11 (Non-text Contrast).
   - Token mapping: `line.thin` (`2px`) or `line.hair` (`1px`) paired with `--vd3-color-border`.

2. **Decorative Dividers**:
   - Lines that provide visual grouping without altering document comprehension (e.g., content `<hr>` separators, card section dividers).
   - Conformance: Paired with `--vd3-color-border-subtle` and accompanied by `aria-hidden="true"` or semantic semantic HTML separation.
   - Token mapping: `line.hair` (`1px`) paired with `--vd3-color-border-subtle`.

## CSS Usage Snippets

```css
/* Card boundary */
.vd-card {
  border: var(--vd3-border-width-hair, 1px) solid var(--vd3-color-border);
}

/* Form input border */
.vd-input {
  border: var(--vd3-border-width-thin, 2px) solid var(--vd3-color-border);
}

/* Callout accent rail */
.vd-callout-warning {
  border-left: var(--vd3-border-width-thick, 5px) solid var(--vd3-color-warning);
}

/* Subtle separator */
.vd-divider {
  border: 0;
  border-top: var(--vd3-border-width-hair, 1px) solid var(--vd3-color-border-subtle);
  margin-block: var(--vd3-space-fib-21);
}
```
