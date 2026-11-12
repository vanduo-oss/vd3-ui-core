# vd3-ui-core — transport bundle

Everything from the design-system research sessions, structured as the real
repo skeleton so you can unzip it and start working.

## Contents

- `README.md`, `AGENTS.md`, `references.md`, `glossary.md`, `CHANGELOG.md` —
  the spec repo entrypoints (from the scaffold).
- `foundations/` — principles, proportion, color, typography, motion, elevation.
- `tokens/vd3.tokens.json` — normative DTCG token skeleton (values ILLUSTRATIVE
  pending the v2 token audit; structure and naming binding).
- `components/` — spec template + worked dialog example.
- `conventions/` — naming rules + Carbon translation table.
- `docs/research-brief.md` — the deep-research report (scope, A/B/C contract,
  coverage vs Carbon, inconsistencies found in v1.9, recommendations).
- `docs/kickoff-prompt.md` — paste-ready prompt for the Mistral Vibe VS Code
  extension, pointing the agent at the right files in the right order.
- `site/index.html` — framework-free spec-site mockup; every measurement derives
  from its own token block.

## How to use

1. Unzip into your working folder (e.g. the future `vanduo-oss/vd3-ui-core` repo).
2. Open the folder in VS Code with the Mistral Vibe extension installed
   (https://docs.mistral.ai/vibe/code/vs-code-extension/install-authenticate).
3. Paste docs/kickoff-prompt.md into a new Vibe session.

Note: token values in this bundle are the illustrative placeholders from the
research; the v2 audit against the real tokens.css of @vanduo-oss/vd3 is the
first real task. Do not publish the bundle as a release before that audit.
