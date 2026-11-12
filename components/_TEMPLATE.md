# Component spec template

Copy for each component. Delete guidance lines marked ⟵.

---
slug: <kebab-case name>
status: stable | experimental | deprecated
spec: vd3-ui-core@2.0.0-draft
apg: <URL of the APG pattern this component conforms to, or "none">
---

## Summary
One paragraph: what it is, when to use it, when NOT to use it. ⟵ "when not" is mandatory

## Anatomy
Elements and their roles. ⟵ name parts; stable part names are cited by code and docs

## States
Rest, hover, active, focus-visible, disabled, loading, read-only… as applicable.
Each state MUST name the tokens it swaps.

## Props / API
Contract-level description of the public API (not implementation). Breaking
changes here are spec-major.

## Keyboard — ⟨NORMATIVE: APG⟩
Table: key → effect. If the component has an APG pattern, this section MUST
match it; deviations are listed under "Deviations" with justification.

## Focus
Focus order, initial focus, focus restoration, focus-visible treatment.

## Accessibility requirements
ARIA roles/states, announcements, reduced-motion behavior. Numbered ⟨SLUG-###⟩.

## Tokens consumed
Semantic roles and component tokens used — from tokens/vd3.tokens.json only.

## Deviations & references
- "Adopt X per Carbon ⟨section⟩" or "Deviates from APG ⟨§⟩ because ⟨reason⟩."
