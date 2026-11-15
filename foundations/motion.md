# Motion

Status: stable · Spec: 1.0.1-draft

Motion in VD3 UI CORE is grounded in the Fibonacci duration ladder and cubic Bézier easing curves derived from powers of the golden ratio $\phi$.

## Fibonacci Duration Ladder (Feature #23)

Transition and animation durations form an exact mathematical ladder where millisecond durations correspond to Fibonacci numbers:

| Token | CSS Variable | Duration | Named Alias | Fibonacci Term | Basis | Usage Tier |
|---|---|---|---|---|---|---|
| `motion.0` | `--vd3-duration-0` | `0ms` | — | Boundary | Class A | Instant state snap, reduced motion fallback |
| `motion.55` | `--vd3-duration-55` | `55ms` | — | $F_{10}$ | Class A | Micro-ticks, subtle toggle switch feedback |
| `motion.89` | `--vd3-duration-89` | `89ms` | `instant` | $F_{11}$ | Class A | Micro-interactions, badge pop, button press |
| `motion.144`| `--vd3-duration-144`| `144ms`| `fast` | $F_{12}$ | Class A | Icon rotation, tooltip reveal, button hover fade |
| `motion.233`| `--vd3-duration-233`| `233ms`| `base` | $F_{13}$ | Class A | Dropdowns, popovers, select menus, accordions |
| `motion.377`| `--vd3-duration-377`| `377ms`| `slow` | $F_{14}$ | Class A | Dialog modals, drawer slide-overs, tab panel shifts |
| `motion.610`| `--vd3-duration-610`| `610ms`| `slower` | $F_{15}$ | Class A | Major layout reorganizations, multi-panel expansions |
| `motion.987`| `--vd3-duration-987`| `987ms`| `slowest`| $F_{16}$ | Class A | Full-page crossfades, route transitions |

## Golden Bézier Easing Curves (Feature #24)

Easing curves in VD3 avoid arbitrary cubic coordinates. Control points derive from the reciprocal powers of $\phi$:
- $\phi^{-1} = 1/\phi \approx 0.618034$
- $\phi^{-2} = 1/\phi^2 \approx 0.381966$
- $\phi^{-3} = 1/\phi^3 \approx 0.236068$
- $2\phi^{-2} = 2 \times 0.381966 = 0.763932 \approx 0.764$

### Normative Easing Table

| Token | CSS Variable | Control Points $(x_1, y_1, x_2, y_2)$ | Exact Mathematical Formula | Basis | Motion Characteristics |
|---|---|---|---|---|---|
| `easing.out` | `--vd3-ease-out` | `(0.236, 1, 0.382, 1)` | $(\phi^{-3}, 1, \phi^{-2}, 1)$ | Class A | Decelerating curve; standard for UI elements entering the screen |
| `easing.in` | `--vd3-ease-in` | `(0.618, 0, 0.764, 0)` | $(\phi^{-1}, 0, 2\phi^{-2}, 0)$ | Class A | Accelerating curve; standard for UI elements exiting the screen |
| `easing.in-out`| `--vd3-ease-in-out`| `(0.618, 0, 0.382, 1)` | $(\phi^{-1}, 0, \phi^{-2}, 1)$ | Class A | Symmetrical curve; elements moving from point A to point B on screen |
| `easing.linear`| `--vd3-ease-linear`| `(0, 0, 1, 1)` | Linear identity | Class A | Continuous spin, opacity crossfades, progress bars |

## Reduced Motion Contract (MOB-001 / Feature #25)

In compliance with WCAG 2.1 Success Criterion 2.3.3 (Animation from Interactions), non-essential animations MUST be suppressed when users request reduced motion.

VD3 implements this contract via CSS media query and data-attribute overrides:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --vd3-duration-55: 0ms;
    --vd3-duration-89: 0ms;
    --vd3-duration-144: 0ms;
    --vd3-duration-233: 0ms;
    --vd3-duration-377: 0ms;
    --vd3-duration-610: 0ms;
    --vd3-duration-987: 0ms;
  }

  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

[data-motion="reduce"] {
  --vd3-duration-55: 0ms;
  --vd3-duration-89: 0ms;
  --vd3-duration-144: 0ms;
  --vd3-duration-233: 0ms;
  --vd3-duration-377: 0ms;
  --vd3-duration-610: 0ms;
  --vd3-duration-987: 0ms;
}
```

*Essential Motion Exemption*: Transitions that convey crucial semantic state changes (such as an accordion opening to reveal required information) complete instantaneously without spatial animation.
