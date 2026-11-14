# Kickoff prompt — paste into Mistral Vibe (VS Code extension)

I'm starting vd3-ui-core — a spec-only repo under the vanduo-oss org.
Three things in this repo are authoritative, in this reading order:

1. docs/research-brief.md — a deep-research report on scope, coverage vs Carbon,
   and the proportional doctrine. Read it fully before doing anything.
2. The spec skeleton at the repo root (README.md, AGENTS.md, foundations/*.md,
   tokens/vd3.tokens.json, components/*, conventions/*, references.md,
   glossary.md, CHANGELOG.md) — the design bible itself.
3. site/index.html — the spec-site mockup. It must stay framework-free
   (plain HTML/CSS/SVG, no dependencies) and token-driven.

Binding rules from the research:
- Doctrine: Fibonacci/phi-first, with three basis classes: A = phi/Fibonacci/Lucas-derived
  (default), B = conventional-by-design (written reason required), C = registered
  exception (C-01: rem-rounded small spacing steps, C-02: glass blur soft-cap).
  No undocumented constants — anything you can't classify is a spec bug.
- W3C ARIA APG is normative for component behavior; W3C DTCG for token format.
  IBM Carbon is consulted literature only (cite, never conform). Material 3 is excluded.
- Markdown is the source of truth; any site output is generated from it — PRs only.
- Token values in tokens/vd3.tokens.json are ILLUSTRATIVE, pending the token audit
  against the real tokens.css of @vanduo-oss/vd3. Structure and naming are binding;
  values are not.
- Vue 3 only for the library repos (Vite + Nuxt); no React, ever.

First task: review the existing spec files for internal consistency against
docs/research-brief.md (section F3 lists known v1.9 contradictions), fix what
you find, then list the open questions from the brief that you need me to answer
before writing normative token tables.
