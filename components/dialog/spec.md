---
slug: dialog
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
---

## Summary
A modal dialog: content that interrupts the task below it. Use for focused,
blocking tasks (confirmations, short forms). NOT for: navigation, non-blocking
information (use popover/toast), long forms (use a page or drawer).

## Anatomy
Native `<dialog class="vd-dialog">` (promoting to the browser top layer via
`.showModal()`) with `.vd-dialog--md` / `.vd-dialog-md` width modifier,
`.vd-dialog__header` / `.vd-dialog-header` containing `.vd-dialog__title` /
`.vd-dialog-title` (`<h2>`/`<h3>`) + optional `.vd-dialog__close` /
`.vd-dialog-close` dismiss button, `.vd-dialog__body` / `.vd-dialog-body`, and
`.vd-dialog__footer` / `.vd-dialog-footer` (actions), plus frosted glass
`.vd-dialog::backdrop` (`C-02` Convergence Zone Glass 4).

## States
- Rest (closed): `opacity: 0; transform: scale(0.95);`, `display: none` via UA `<dialog>`.
- Open (`[open]`): `opacity: 1; transform: scale(1);`, entered via `@starting-style` and discrete `transition` (`overlay` + `display`) with standalone `transition-behavior: allow-discrete;` (`motion.base` = 233ms, `easing.out`).
- Scroll containment: `overscroll-behavior: contain` on `.vd-dialog` and `dialog.vd-dialog:modal`; `overflow: hidden; overscroll-behavior: contain;` on `::backdrop`.
- Focus-visible: dual-ring (`focus.ring.*`) on `.vd-dialog:focus-visible`, `.vd-dialog__close:focus-visible`, and `.vd-dialog-close:focus-visible`.
- Dark theme: `[data-theme="dark"] .vd-dialog::backdrop` deepens backdrop tint (`68%` `color.primitive.gray-1000`) and saturation (`200%`).
- Reduced motion (`MOB-001`): collapses `transition` and `transform` via both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Props / API
Contract-level: `<dialog class="vd-dialog" aria-labelledby="<title-id>" aria-describedby="<body-id>">`
opened with `dialog.showModal()` (or declarative Invoker Commands `command="show-modal" commandfor="..."`).
Width variants: default `container.sm` (`521px`), `.vd-dialog--md` / `.vd-dialog-md` `container.md` (`610px`).
Behavioral layer manages `showModal()`/`close()` and focus restoration if custom triggers require it.

## Keyboard — NORMATIVE: APG Dialog (Modal) Pattern

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Cycle within dialog (focus is trapped) |
| Escape | Close, same as cancel; announcement as dismissal |

## Focus
Dual-ring `:focus-visible` indicator (`focus.ring.*`) on `.vd-dialog` and
`.vd-dialog__close` / `.vd-dialog-close`.

## Accessibility requirements
- DLG-001 On open, focus moves to the first focusable element, or the dialog
  surface if none.
- DLG-002 On close, focus MUST return to the invoking element.
- DLG-003 The dialog MUST be modal: background is inert (aria-inert treatment of
  siblings; scrolling locked via top layer and `overscroll-behavior: contain`).
- DLG-004 The dialog surface has `role="dialog"`, `aria-modal="true"`, and
  `aria-labelledby`/`aria-describedby` referencing title/description (provided
  natively by `<dialog>.showModal()` plus heading title markup).
- DLG-005 Reduced motion (`MOB-001`): open/close and backdrop transitions collapse
  under both `@media (prefers-reduced-motion: reduce)` and `[data-motion="reduce"]`.

## Tokens consumed
`color.role.canvas`, `color.role.text-primary`, `color.role.text-secondary`,
`color.role.border`, `color.role.focus`, `color.role.focus-glow`,
`color.primitive.gray-1000`, `shadow.4`, `radius.fib-8`, `z.modal`,
`line.hair`, `space.fib-8`, `space.fib-13`, `space.fib-21`, `space.fib-34`,
`container.sm`, `container.md`, `type.size.base`, `type.size.xl` (static),
`type.leading.tight`, `type.leading.relaxed`, `glass.blur-xl`,
`motion.233` (`motion.base`), `easing.out`, `focus.ring.width`,
`focus.ring.offset`, `focus.ring.color`, `focus.ring.offset-color`,
`focus.ring.glow`.

## Deviations & references
None — conforms to APG Dialog (Modal) Pattern. Consulted: Carbon Dialog —
adopts footer-aligned actions, deviates on elevation (golden `shadow.4` instead
of flat layer+border) per `foundations/elevation.md`.
