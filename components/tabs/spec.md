---
slug: tabs
status: stable
spec: vd3-ui-core@1.0.2-draft
apg: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
---

## Summary
A tab set for switching between views of related content within the same context.
Use when content is peer-level and switching should not change the URL context.
NOT for: sequential steps (use stepper), primary navigation (use navbar), or
content that should all be visible (use accordion).

## Anatomy
`.vd-tabs` (`role="tablist"`) containing `.vd-tab` buttons (`role="tab"`,
`aria-selected`, `aria-controls` → panel id), followed by `.vd-tab-panel`
elements (`role="tabpanel"`, `aria-labelledby` → tab id, `hidden` when inactive).
Selected tab indicator: `border-bottom` 2px (`line.thin` = F₃) in `color.role.focus`.

## States
Rest / hover (layer-hover fill) / `[aria-selected="true"]` (active: text-primary,
600 weight, focus-colored underline) / `:focus-visible` (dual ring, FOC-001/002) /
disabled (`:disabled`, `[aria-disabled="true"]`, opacity 1/φ²).

## Props / API
Contract-level: `role="tablist"` wrapper; each tab `role="tab"` +
`aria-selected="true|false"` + `aria-controls="<panel-id>"`; panels
`role="tabpanel"` + `aria-labelledby="<tab-id>"`. No size/variant modifiers in v1.

## Keyboard — NORMATIVE: APG Tabs Pattern

| Key | Effect |
|---|---|
| Tab | Move focus into the tablist (selected tab is the single tab stop, roving tabindex) |
| Right / Down arrow | Activate next tab, wrapping at the end |
| Left / Up arrow | Activate previous tab, wrapping at the start |
| Home / End | Activate first / last tab |
| Delete | (Optional, with `aria-orientation`) delete the tab if closable |

## Focus
Roving tabindex: only the selected tab is in the tab order; arrow keys move focus
AND selection (automatic activation). `:focus-visible` dual ring on the focused tab.

## Accessibility requirements
- TAB-001 Tablist/tab/tabpanel roles and `aria-controls`/`aria-labelledby` wiring are mandatory.
- TAB-002 Automatic activation: arrow keys move selection, not just focus.
- TAB-003 Exactly one tab has `aria-selected="true"`; its panel is visible, others `hidden`.
- TAB-004 Roving tabindex: `tabindex="0"` on the selected tab, `tabindex="-1"` on the rest (behavioral layer; CSS styles `[aria-selected]` state).
- TAB-005 Reduced motion (MOB-001) collapses tab state transitions.

## Tokens consumed
`space.fib-8/13/21`, `border-width hair/thin`, `radius.fib-3`,
`color.role.border/layer-hover/text-primary/text-secondary/focus`,
`font-size base`, `line-height tight`, `duration 89`, `ease-out`,
`focus.ring.*`, `math.inv-phi-sq` (disabled opacity).

## Deviations & references
None — conforms to APG Tabs Pattern (automatic activation variant). Consulted:
Carbon Tabs / Material tabs — same roles; deviates on indicator thickness
(F₃ = 2px, matching the focus ring, instead of conventional 3–4px).
