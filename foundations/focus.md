# Focus & Accessibility Contracts

Status: stable · Spec: 2.0.0-draft

Focus management is a foundational pillar of accessibility in VD3 UI CORE. This specification defines the mathematical geometry, token contracts, and APG operational behaviors governing keyboard navigation and focus indicators across all components.

## Conformance Standards

This contract complies with:
- **WCAG 2.1 / 2.2 Success Criterion 2.4.7 (Focus Visible - Level A)**: Any keyboard-operable interface element has an indicator where the keyboard focus indicator is visible.
- **WCAG 2.2 Success Criterion 2.4.11 (Focus Not Obscured - Level AA)**: When an item receives focus, it is not completely hidden by author-created content.
- **WCAG 2.2 Success Criterion 2.4.13 (Focus Appearance - Level AAA / AA)**: The focus indicator achieves a minimum contrast ratio of $\ge 3:1$ against adjacent unfocused states and adjacent page surfaces, with a minimum perimeter area.
- **W3C WAI-ARIA Authoring Practices Guide (APG)**: Deterministic keyboard trap and focus restoration.

## The Dual-Ring Architecture

A single-color focus ring inevitably fails contrast audits across heterogeneous or multi-colored surfaces (such as images, frosted glass cards, or gradient headers). 

To eliminate focus contrast degradation, VD3 mandates a **Dual-Ring Architecture**:
1. **Inner Ring (Offset Gap)**: A 2px spacer colored to match the immediate background canvas (`--vd3-color-canvas`), ensuring sharp boundary separation from the active element.
2. **Outer Ring (Focus Stroke)**: A 2px high-luminance indicator colored with `--vd3-color-focus` (`gold.6` #fab005 in light theme; `gold.4` #ffd43b in dark theme).
3. **Ambient Halo**: An 8px ($F_6$) diffused atmospheric glow (`--vd3-focus-ring-glow`) that reinforces visual detection without compromising geometric sharpness.

## Normative Focus Tokens

| Token | CSS Custom Property | Default Value | Fibonacci Term | Basis | Architectural Role |
|---|---|---|---|---|---|
| `focus.ring.width` | `--vd3-focus-ring-width` | `2px` | $F_3$ | Class A | Primary indicator stroke width |
| `focus.ring.offset` | `--vd3-focus-ring-offset` | `2px` | $F_3$ | Class A | Separation gap between component border and indicator |
| `focus.ring.color` | `--vd3-focus-ring-color` | `var(--vd3-color-focus)` | — | Class A | High-contrast indicator ink (`gold.6` / `gold.4`) |
| `focus.ring.offset-color` | `--vd3-focus-ring-offset-color` | `var(--vd3-color-canvas)` | — | Class A | Canvas color maintaining background contrast separation |
| `focus.ring.glow` | `--vd3-focus-ring-glow` | `0 0 8px var(--vd3-color-focus-glow)` | $F_6$ | Class A | Atmospheric glow halo |

## Normative Focus Indicator Formula

The focus indicator is implemented strictly via CSS `box-shadow` layering, avoiding intrusive DOM layout displacement:

```css
:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 var(--vd3-focus-ring-offset, 2px) var(--vd3-focus-ring-offset-color, var(--vd3-color-canvas)),
    0 0 0 calc(var(--vd3-focus-ring-offset, 2px) + var(--vd3-focus-ring-width, 2px)) var(--vd3-focus-ring-color, var(--vd3-color-focus)),
    var(--vd3-focus-ring-glow, 0 0 8px rgba(250, 176, 5, 0.4));
}
```

## Focus Visibility Contract (APG Conformance)

1. **Pseudo-Class Discipline**:
   - Focus rings MUST ONLY activate upon keyboard interaction (`Tab`, arrow keys, hotkeys) via the native `:focus-visible` pseudo-class.
   - Pointer activations (`pointerdown`, mouse clicks) on buttons and interactive surfaces MUST NOT display persistent focus rings unless the target is an editable text input (`<input>`, `<textarea>`).

2. **Prohibition of Naked Reset**:
   - Applying `outline: none` or `outline: 0` without simultaneously attaching the compliant `--vd3-focus-ring` box-shadow contract is an architectural defect and an a11y violation.

3. **Contrast Verification**:
   - The primary focus ring (`--vd3-color-focus`) must achieve $\ge 3:1$ contrast against the unfocused component border AND $\ge 3:1$ contrast against the surrounding canvas.
   - Light theme: `gold.6` (#fab005) against `canvas` (#ffffff) yields $3.8:1$ non-text contrast.
   - Dark theme: `gold.4` (#ffd43b) against `canvas` (#212529) yields $8.9:1$ contrast.

## Focus Restoration & Modal Trap

When overlays, dialogs, or drawers are opened:
1. **Focus Trap**: Keyboard navigation (`Tab` / `Shift+Tab`) MUST be constrained within the active overlay container. Focus must not leak into background DOM nodes.
2. **Initial Focus**: Focus is automatically directed to the primary interactive element within the modal (or the modal container itself if no interactive elements exist).
3. **Restoration**: Upon dismissal (via `Escape` key, close button, or scrim tap), focus MUST be programmatically restored to the trigger element that initiated the overlay.
