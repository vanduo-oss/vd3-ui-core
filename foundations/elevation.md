# Elevation — golden shadows

Status: stable · Spec: 2.0.0-draft

vd3's elevation signature: each level's **y-offset and blur are a consecutive
Fibonacci pair**; x-offset and spread are 0.

| Level | Pair (offset / blur) | Used for |
|---|---|---|
| 1 | 1 / 2 | resting cards, subtle lift |
| 2 | 2 / 3 | hover lift, popovers |
| 3 | 3 / 5 | dropdowns, menus |
| 4 | 8 / 13 | dialogs, spotlights |
| 5 | 13 / 21 | overlays, drawers |
| 6 | 21 / 34 | topmost spotlights |

- Elevation levels MUST be consumed as tokens (`--vd-shadow-1`…`--vd-shadow-6`
  in `tokens/vd3.tokens.json`, group `shadow`). Audited against v1.9: each level
  is a real layered composite (pair + next-smaller pair); the conventional
  v1.9 sm/md/lg/xl shadows are class-B aliases of levels 1/3/4/5.
- Shadows carry identity; they MAY be layered with tinted borders, but a shadow
  level MUST NOT be replaced by a border alone.
- Elevation is not a stacking-context ranking: stacking order is the tokened
  `z` ladder (class B — conventional increments, tokenized; Q3 decision) plus
  per-component assignment (see `components/dialog/spec.md` for the modal
  example: `z.modal`).
