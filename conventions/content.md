# Editorial Tone & Content Conventions

Status: stable · Spec: 2.0.0-draft

This specification establishes the editorial voice, microcopy rules, form validation anatomy, empty state patterns, and dual human/AI readability guidelines for VD3 UI CORE.

## Core Philosophy

1. **Precision Over Verbosity**: Every word must justify its presence. Unadorned, clear explanations are preferred over promotional rhetoric.
2. **Dual Readability**: Content must serve both human readers and AI coding agents. Human users need clear visual previews and plain instructions; AI agents need structured semantic markup, explicit code blocks, machine-readable `data-vd-*` attributes, and predictable heading hierarchies.
3. **Mathematical Honesty**: Document system boundaries and constraints plainly. State clearly where Class A (mathematical derivation) applies, where Class B (convention) is adopted, and where Class C (exception) is registered.

## Button & Interactive Labels

1. **Syntactic Structure**:
   - Primary actions MUST use **Verb + Noun** (`Create token`, `Download schema`, `Export CSS`) or a recognized standalone **Verb** (`Save`, `Cancel`, `Copy`).
2. **Casing**:
   - **Sentence case** is mandatory for all labels (`Save changes`, not `Save Changes`).
3. **Prohibited Labels**:
   - Vague, ambiguous verbs such as `Click here`, `Submit`, `Go`, or `Process` are strictly prohibited.

## Form Labels & Helper Text

1. **Labels (`<label>`)**:
   - MUST use concise noun phrases describing the exact input data (`Token name`, `Base font size (px)`).
   - Placeholders MUST NOT be used as a substitute for a persistent, visible `<label>` element.
2. **Placeholders**:
   - Placeholders MUST contain concrete, valid illustrative examples (`e.g., --vd3-space-fib-8`, `e.g., 16px`).
   - Placeholders MUST NOT contain operational instructions or constraints (place those in persistent helper text below the field).
3. **Helper Text**:
   - Placed below the field, explaining format constraints or default behaviors.

## Error Messages & Form Validation

Every error message MUST implement the standard **Three-Part Anatomy**:
1. **What happened**: Direct, neutral statement of the failure state.
2. **Why it occurred**: The exact constraint or boundary violated.
3. **How to fix it**: The concrete action required to resolve the condition.

### Example
- ❌ *Bad*: "Invalid value entered."
- ✅ *Compliant*: "Invalid spacing token. Spacing values must derive from the Fibonacci sequence. Enter a recognized step such as 8px, 13px, 21px, or 34px."

## Empty States

When a data collection, table, or list contains zero items, the view MUST render the standard **Three-Part Empty State Layout**:
1. **Descriptive Title**: Plain declaration of absence (`No custom tokens found`).
2. **Contextual Explanation**: Explanation of why the state is empty (`No user-defined design tokens have been added to this namespace yet.`).
3. **Primary Call-to-Action**: Direct action button to populate the state (`[Create token]`).

## Accessibility & Screen Reader Strings

1. **Live Announcements (`aria-live="polite"`)**:
   - Screen reader announcements must be concise and verb-driven (`"Token copied to clipboard"`, `"Filter applied: 14 matching tokens"`).
2. **Icon Buttons**:
   - Every interactive icon-only button MUST supply an unambiguous `aria-label` describing the intended action, NEVER its physical appearance:
     - ❌ *Incorrect*: `aria-label="Cross icon"`, `aria-label="Magnifying glass"`
     - ✅ *Compliant*: `aria-label="Close dialog"`, `aria-label="Search tokens"`
3. **State Indicators**:
   - Toggle buttons and expandable accordions must reflect state programmatically (`aria-expanded="true/false"`, `aria-pressed="true/false"`).
