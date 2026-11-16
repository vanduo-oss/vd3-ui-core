---
slug: upload
status: stable
spec: vd3-ui-core@1.1.0-draft
apg: none
---

## Summary
A file-upload dropzone: a `<label>` zone wrapping a visually hidden native
`<input type="file">`, plus a list of the selected files. Use when users must
attach one or more files to a form or action (documents, images, avatars).
NOT for: choosing from existing server-side assets (use a picker/menu),
multi-step flows (use a wizard), or when the file content itself must be
previewed inline before submit (use an image editor/cropper).

## Anatomy
`.vd-upload` — the dropzone `<label>` (dashed thin border, `radius.fib-8`,
`layer` fill, `space.fib-21` padding) containing `.vd-upload-icon`,
`.vd-upload-text` (primary line), `.vd-upload-hint` (help-text microcopy), and
the visually hidden `.vd-upload-input` (`<input type="file">`). Below the zone,
`.vd-upload-list` (`<ul>`) holds one `.vd-upload-file` row per selected file
(name + size as text).

## States
- Rest: `color.role.border` dashed `line.thin` border on `color.role.layer` fill.
- Hover: border-color swaps to `color.role.focus` (zone is not disabled).
- Drag-over (`.vd-upload--dragover` / `.vd-upload-dragover`, toggled by the
  behavioral layer on dragenter/dragleave): border-color `color.role.focus` +
  background `color.role.layer-hover`.
- Focus-within (hidden input focused): dual ring via `focus.ring.*` on the zone.
- Disabled (`:has(.vd-upload-input:disabled)` or `[aria-disabled="true"]`):
  `cursor: not-allowed`, opacity `math.inv-phi-sq`.
- Reduced motion (MOB-001): border/background/box-shadow transitions collapse.
Each state swaps only tokens.

## Props / API
Contract-level: a native `<input type="file">` (optionally `multiple`,
`accept`) made visually hidden via `.vd-upload-input`, wrapped in — or wired
by `for`/`id` to — a `<label class="vd-upload">`. The behavioral layer toggles
`.vd-upload--dragover` on drag events and renders `.vd-upload-list` /
`.vd-upload-file` rows from the input's `FileList`. No framework API in core.

## Keyboard — NORMATIVE: no APG pattern exists
No APG pattern covers file upload; the normative contract is the native file
input + label pattern (HTML-AAM), with the drag-over state as a progressive
enhancement.

| Key | Effect |
|---|---|
| Tab / Shift+Tab | Move focus to / from the dropzone (the hidden input is the single tab stop) |
| Enter / Space | Open the native file picker (native input behavior) |
| Drag & drop | `dragenter` adds `.vd-upload--dragover`, `dragleave`/`drop` removes it (behavioral layer) |

## Focus
Single tab stop: the file input. Because it is clipped, the zone renders the
dual ring via `.vd-upload:focus-within` per FOC-001…004; the input's own
`:focus-visible` outline is suppressed.

## Accessibility requirements
- UPL-001 The dropzone is a `<label>` wrapping the `<input type="file">` (or
  `label[for]` + input), so the whole zone is clickable and the input is the
  only focusable element.
- UPL-002 The input is visually hidden with the clip pattern
  (`.vd-upload-input`) yet remains in the accessibility tree and keyboard
  operable; its accessible name comes from `.vd-upload-text`/`aria-label`.
- UPL-003 Drop-availability is stated in text (`.vd-upload-hint`), never by
  the dragover style alone (WCAG 1.4.1 — color is not the only indicator).
- UPL-004 Selected files are exposed as text rows in `.vd-upload-list` /
  `.vd-upload-file`; additions/removals are announced by the behavioral layer
  via an `aria-live="polite"` region (the input's native change semantics are
  not sufficient for list updates).
- UPL-005 Reduced motion (MOB-001) collapses the dropzone transitions; the
  disabled state uses opacity `math.inv-phi-sq` and removes pointer interaction.

## Tokens consumed
`color.role.layer`, `color.role.layer-hover`, `color.role.border`,
`color.role.focus`, `color.role.canvas`, `color.role.text-primary`,
`color.role.text-secondary`, `color.role.focus-glow`;
`space.fib-5`, `space.fib-8`, `space.fib-13`, `space.fib-21`;
`line.hair`, `line.thin`; `radius.fib-5`, `radius.fib-8`;
`type.size.xs`, `type.size.sm`, `type.size.base`, `type.size.2xl` (icon lg
hook `--vd3-icon-size-lg` falls back to it);
`type.leading.tight`, `type.leading.normal`; `motion.89`, `easing.out`;
`focus.ring.width`, `focus.ring.offset`, `focus.ring.color`,
`focus.ring.offset-color`, `focus.ring.glow`; `math.inv-phi-sq`.

## Deviations & references
No APG pattern exists for upload; the contract is the native file input +
label pattern. Consulted: Carbon FileUploader / FileUploaderItem — adopts the
hidden-input-inside-label dropzone and per-file list rows; deviates on zone
styling (dashed `line.thin` border, `radius.fib-8`, `space.fib-21` padding,
golden dual-ring focus) per `foundations/proportion.md` and
`foundations/focus.md`, and on announcing list changes via a live region
instead of relying on the input event alone.
