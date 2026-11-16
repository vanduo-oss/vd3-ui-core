# Elevation — Golden Shadows & Glow

Status: stable · Spec: 1.0.2-draft

Elevation in VD3 UI CORE conveys spatial depth through consecutive Fibonacci shadow pairs, ambient golden glow blurs, and a tokenized stacking ladder.

## Fibonacci Elevation Shadows (Feature #21)

VD3 elevation shadows avoid arbitrary Gaussian approximations. Each elevation level's **y-offset and primary blur radius are a consecutive Fibonacci pair** $(F_n, F_{n+1})$, while the horizontal offset is zero.

Each level is constructed as a dual-layer composite (primary shadow + ambient fill):

| Level | Primary Pair $(y / \text{blur})$ | Fibonacci Terms | CSS Variable | Legacy Alias | Intended Architectural Role |
|---|---|---|---|---|---|
| **1** | `1px / 2px` | $(F_2, F_3)$ | `--vd3-shadow-1` | `--vd-shadow-sm` | Resting cards, subtle list item lift |
| **2** | `2px / 3px` | $(F_3, F_4)$ | `--vd3-shadow-2` | `--vd-shadow` | Interactive hover lift, dropdown buttons |
| **3** | `3px / 5px` | $(F_4, F_5)$ | `--vd3-shadow-3` | `--vd-shadow-md` | Contextual popovers, menus, select pickers |
| **4** | `8px / 13px` | $(F_6, F_7)$ | `--vd3-shadow-4` | `--vd-shadow-lg` | Dialog modals, drawer slide-overs |
| **5** | `13px / 21px` | $(F_7, F_8)$ | `--vd3-shadow-5` | `--vd-shadow-xl` | Active drawers, focused modal overlays |
| **6** | `21px / 34px` | $(F_8, F_9)$ | `--vd3-shadow-6` | `--vd-shadow-2xl` | Topmost spotlights, lightbox media viewers |

### Shadow Theme Adaptation
- **Light Theme**: Shadow ink uses `--vd3-color-shadow: #0000001a` (10% alpha black).
- **Dark Theme**: Shadow ink adjusts to `--vd3-color-shadow: #0000004d` (30% alpha black) with elevated secondary layer opacity to maintain depth perception against dark surfaces.

## Ambient Glow Steps (Feature #22)

Ambient illumination and luminous focus indicators utilize blur radii derived from Fibonacci steps:

| Token | CSS Variable | Rem Value | Pixel Value | Fibonacci Term | Basis | Intended Role |
|---|---|---|---|---|---|---|
| `glow.fib-8` | `--vd3-glow-fib-8` | `0.5rem` | `8px` | $F_6$ | Class A | Focus ring atmospheric halo, selected chip glow |
| `glow.fib-13`| `--vd3-glow-fib-13`| `0.8125rem` | `13px` | $F_7$ | Class A | Hover state card illumination, active badge halo |
| `glow.fib-21`| `--vd3-glow-fib-21`| `1.3125rem` | `21px` | $F_8$ | Class A | Modal ambient spotlight, hero graphic glow |

## Stacking Ladder ($z$-index) (Feature #26)

Stacking context in VD3 is strictly separated from visual shadow elevation. Visual shadows express distance from the background; the tokenized `$z` ladder governs browser composite rendering order (Class B, conventional platform increments):

| Token | CSS Custom Property | Value | Basis | Assigned UI Layer |
|---|---|---|---|---|
| `z.base` | `--vd3-z-base` | `0` | Class B | Default canvas content layer |
| `z.dropdown` | `--vd3-z-dropdown` | `1000` | Class B | Autocomplete menus, dropdown options |
| `z.sticky` | `--vd3-z-sticky` | `1020` | Class B | Sticky navigation headers, fixed table column headers |
| `z.fixed` | `--vd3-z-fixed` | `1030` | Class B | Floating action buttons, corner widgets |
| `z.modal-backdrop`| `--vd3-z-modal-backdrop`| `1040` | Class B | Dimmer backdrop overlay beneath modal dialogs |
| `z.modal` | `--vd3-z-modal` | `1050` | Class B | Native `<dialog>` and application modal windows |
| `z.popover` | `--vd3-z-popover` | `1060` | Class B | Floating tooltips, contextual popover dialogs |
| `z.tooltip` | `--vd3-z-tooltip` | `1070` | Class B | Hover tooltips and instant micro-hints |
| `z.toast` | `--vd3-z-toast` | `1080` | Class B | Floating toast notification alerts and snackbars |
