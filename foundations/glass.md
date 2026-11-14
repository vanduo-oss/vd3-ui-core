# Glassmorphism & The Convergence Zone

Status: stable · Spec: 2.0.0-draft

Frosted glass surfaces (`backdrop-filter: blur(...)`) in VD3 UI CORE deliver depth, optical layering, and contextual transparency while strictly adhering to hardware performance constraints.

## The Convergence Zone Axiom (C-02)

In an unconstrained mathematical model, successive elevation steps would demand infinite exponential scaling. However, in physical web rendering:
1. **GPU Fill-Rate Exhaustion**: Applying continuous multi-pass Gaussian blur kernels exceeding 20px–26px during document scroll operations triggers significant framerate drop and battery drain on mobile and low-power devices.
2. **Perceptual Diminishing Returns**: Above 20px, human visual acuity perceives negligible additional optical diffusion; background shapes are already completely unresolvable.

Under Registered Exception **C-02**, VD3 implements the **Convergence Zone**:
- **Blur Radius**: Soft-capped at **20px** (cards / popovers) and hard-capped at **26px** (modals / drawers).
- **Sibling Unconstrained Progression**: While blur radius soft-caps, all sibling properties (tint opacity, border hairlines, saturation boosts, elevation shadows) continue their Fibonacci progression without truncation.

## Glass Surface Progression Ladder

| Level | Role | Blur Radius | Tint Opacity | Saturation Boost | Border Hairline | Shadow Composite | Basis |
|---|---|---|---|---|---|---|---|
| **Glass 1** | Subtle Overlay / Status Pill | `5px` ($F_5$) | `8%` ($F_6$) | `127%` ($\sqrt{\phi}$) | `1px solid rgba(255, 255, 255, 0.13)` | None | Class A |
| **Glass 2** | Sticky Navbar / Floating Toolbar | `13px` ($F_7$) | `13%` ($F_7$) | `138%` ($1+\phi^{-2}$) | `1px solid rgba(255, 255, 255, 0.21)` | `--vd3-shadow-2` | Class A |
| **Glass 3** | Cards / Popover Menus | `20px` (C-02 soft-cap) | `21%` ($F_8$) | `162%` ($\phi$) | `1px solid rgba(255, 255, 255, 0.34)` | `--vd3-shadow-3` | Class C-02 |
| **Glass 4** | Modal Backdrops / Drawers | `26px` (C-02 hard-cap) | `34%` ($F_9$) | `200%` ($2.0$) | `1px solid rgba(255, 255, 255, 0.55)` | `--vd3-shadow-4` | Class C-02 |

## Tokens & CSS Custom Properties

```css
/* Blur radii */
--vd3-glass-blur-sm: 5px;   /* F_5 */
--vd3-glass-blur-md: 13px;  /* F_7 */
--vd3-glass-blur-lg: 20px;  /* C-02 soft-cap */
--vd3-glass-blur-xl: 26px;  /* C-02 hard-cap */

/* Saturation boosts */
--vd3-glass-saturate-md: 138%; /* 1 + 1/phi^2 */
--vd3-glass-saturate-lg: 162%; /* phi */

/* Tint opacities */
--vd3-glass-tint-sm: 0.08;  /* F_6 = 8% */
--vd3-glass-tint-md: 0.13;  /* F_7 = 13% */
--vd3-glass-tint-lg: 0.21;  /* F_8 = 21% */
--vd3-glass-tint-xl: 0.34;  /* F_9 = 34% */
```

## Dark Theme Adaptation

In dark mode, applying a white translucent tint causes milky optical haze that degrades contrast and readability.

The dark-theme glass contract replaces white alpha tint with a calibrated neutral layer tint and attaches a specular top highlight:
```css
[data-theme="dark"] .vd-glass-surface {
  background: rgba(33, 37, 41, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.13);
}
```

## Fallback Graceful Degradation

If the client user agent or hardware platform does not support CSS `backdrop-filter`, glass surfaces gracefully degrade to an opaque high-contrast layer without broken visual layout:

```css
.vd-glass-surface {
  background: var(--vd3-color-layer);
}

@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  .vd-glass-surface {
    background: rgba(var(--vd3-color-canvas-rgb), 0.72);
    backdrop-filter: blur(var(--vd3-glass-blur-md)) saturate(var(--vd3-glass-saturate-lg));
    -webkit-backdrop-filter: blur(var(--vd3-glass-blur-md)) saturate(var(--vd3-glass-saturate-lg));
  }
}
```
