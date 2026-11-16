# Pattern — App Shell / Page Layout

Status: stable · Spec: 1.1.0-draft · APG: none

## When to use / when NOT

Use for the standard authenticated application page: top navigation, optional
left navigation rail, main content region, footer. Do NOT use for marketing /
documentation pages (use `.vd-container-md` prose measure + `.vd-navbar`
only) or for focused single tasks (use `auth-flows.md` or `.vd-dialog`).

## Anatomy

```
.vd-navbar                      (sticky top bar, z.sticky)
└── .vd-navbar-container        (max-width container.xl)
    ├── .vd-navbar-brand / .vd-navbar-brand-link
    ├── .vd-navbar-nav > .vd-navbar-list > .vd-nav-link[aria-current="page"]
    └── .vd-navbar-actions      (CTA .vd-btn, theme switcher)
.vd-layout-golden               (61.8% main / 38.2% aside — see below)
├── <main> .vd-container        (content, container.lg default)
└── <aside> rail: library-level .vd-sidenav* (VdSidenav) or drawer .vd-offcanvas*
.vd-footer*                     (library-level VdFooter)
```

- **Header**: `.vd-navbar` is sticky (`z.sticky`), glass-2 blur
  (`glass.blur-md`/`saturate-md`/`tint-md`); anchor targets get
  `scroll-margin-top` automatically (navbar.css). Current page is marked with
  `aria-current="page"` on `.vd-nav-link`.
- **Body**: a `.vd-layout-golden` / `.vd-split-golden` grid splits the work
  area into `.vd-split-major` (61.8%, main) and `.vd-split-minor` (38.2%,
  aside); `.vd-layout-golden-rev` inverts it for an inline-start rail. Both
  stack to one column below `breakpoint.md` (768px). Content is bounded by
  `.vd-container` … `.vd-container-2xl` and gridded with `.vd-grid-*` /
  `.vd-grid-12` + `.vd-col-span-*`.
- **Sidenav/drawer & footer**: core has none (planned phase 1.2,
  `components/SPEC.md` "Out-of-standard"); the library ships `VdSidenav`
  (`.vd-sidenav*`), `VdOffcanvas` (`.vd-offcanvas*`), `VdFooter`
  (`.vd-footer*`) — compose as library-level extensions stacked at `z.fixed`
  / `z.modal` per the overlay's role.

## Golden split usage

The 61.8/38.2 golden split (`math.inv-phi`/`math.inv-phi-sq`,
`foundations/layout.md` Feature #13) is the default for main-vs-aside; use
`.vd-layout-golden-rev` when the 38.2% rail (filters, inspector) sits on the
inline-start. Never hand-roll `62%/38%` — the classes bring the stacking
breakpoints and container-query behavior along.

## Accessibility notes

- APP-001 A skip link ("Skip to main content") is the first focusable element;
  it targets `<main id="main">` and uses the dual-ring `:focus-visible`.
- APP-002 `<main>` has `tabindex="-1"` so the skip link can move focus;
  exactly one `<h1>` per page lives inside main.
- APP-003 Nav landmarks: `<header>` wraps `.vd-navbar`, `<nav aria-label>`
  wraps `.vd-navbar-nav`; the sidenav/drawer exposes `aria-label` +
  `aria-current` on the active item.
- APP-004 A modal drawer follows the APG Dialog (Modal) contract (Escape,
  focus trap, focus return — `components/dialog/spec.md`); the persistent
  rail needs no trap.

## Tokens consumed (verified against `tokens/vd3.tokens.json`)

`z.sticky/fixed/modal` · `glass.blur-md/saturate-md/tint-md` ·
`container.xl/lg` · `color.role.canvas/layer/layer-hover/text-primary/text-secondary/border/focus` ·
`space.fib-8/13/21` (gaps, padding) · `line.hair` · `radius.fib-5/fib-8` ·
`shadow.2` (navbar) · `breakpoint.md` (stacking) · `math.inv-phi/inv-phi-sq` (split) ·
`focus.ring.*` · `motion.233`, `easing.out`.

## Deviations & references

- Consulted: Carbon UI shell / global header pattern (guidance-only) — adopts
  header + content + optional rail structure; deviates by making the golden
  split (not a fixed 256px rail) the normative body division, and by keeping
  sidenav/footer library-level until phase 1.2.
- No APG pattern covers app shells; `apg: none`, contract is behavioral.
