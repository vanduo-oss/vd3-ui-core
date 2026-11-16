/**
 * @file ai-agent-ingestion.test.mjs
 * Tier 4 Scenario: Headless AI Agent Ingestion of Documentation Site Bible with Zero Client JS.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolveRepoPath, loadTokens } from '../helpers/math-oracle.mjs';
import {
  extractJsonLd,
  extractHeadings,
  validateHeadingLadder,
  extractElementsByAttribute,
  detectUnrenderedPlaceholders
} from '../helpers/html-parser.mjs';

/**
 * Loads the real built static documentation artifact from site/dist/index.html.
 * Verifies that the artifact is fully compiled and contains no unrendered CSR placeholders.
 */
function loadBibleDocumentationHtml() {
  const distHtmlPath = resolveRepoPath('site/dist/index.html');
  assert.ok(
    existsSync(distHtmlPath),
    `Headless AI ingestion scenario requires pre-rendered SSG artifact at "${distHtmlPath}". Run "pnpm build" before executing Tier 4 scenario tests.`
  );
  const html = readFileSync(distHtmlPath, 'utf8');
  const unrendered = detectUnrenderedPlaceholders(html);
  assert.strictEqual(
    unrendered.length,
    0,
    `Headless AI agent cannot ingest uncompiled documentation site: ${unrendered.join('; ')}`
  );
  return { path: distHtmlPath, html };
}

describe('Tier 4 Scenario 1: Headless AI Agent Ingestion Workflow', () => {
  const tokens = loadTokens();

  it('TEST-T4-SCN-001: Headless AI agent extracts Schema.org JSON-LD metadata graph without executing JavaScript', () => {
    const { path: distHtmlPath, html: targetHtml } = loadBibleDocumentationHtml();

    const jsonLdBlocks = extractJsonLd(targetHtml);
    assert.ok(
      jsonLdBlocks.length > 0,
      `AI agent must find at least one JSON-LD metadata block in "${distHtmlPath}"`
    );

    const schemaGraph = jsonLdBlocks[0]['@graph'];
    assert.ok(Array.isArray(schemaGraph), 'JSON-LD must define a @graph array for entity discovery');

    // Verify TechArticle discovery
    const techArticle = schemaGraph.find(e => e['@type'] === 'TechArticle');
    assert.ok(techArticle, 'Must discover TechArticle entity');
    assert.strictEqual(techArticle.version, '1.1.0-draft', 'Version must be 1.1.0-draft');
    assert.ok(techArticle.about && techArticle.about.length >= 1, 'TechArticle must index design system foundations');

    // Verify DefinedTermSet discovery
    const termSet = schemaGraph.find(e => e['@type'] === 'DefinedTermSet');
    assert.ok(termSet, 'Must discover DefinedTermSet entity for design tokens');
  });

  it('TEST-T4-SCN-002: Headless AI agent reconstructs document hierarchy via strict heading ladder', () => {
    const { path: distHtmlPath, html: targetHtml } = loadBibleDocumentationHtml();

    const headings = extractHeadings(targetHtml);
    assert.ok(
      headings.length >= 4,
      `AI agent expects >= 4 headings in "${distHtmlPath}", found ${headings.length}`
    );

    // Verify heading ladder validity (zero skipped levels)
    const ladder = validateHeadingLadder(headings);
    assert.strictEqual(ladder.valid, true, `Heading ladder must be 100% valid: ${ladder.errors.join('; ')}`);

    // Verify exactly one H1 root
    const h1Count = headings.filter(h => h.level === 1).length;
    assert.strictEqual(h1Count, 1, 'Document must have exactly 1 H1 element for unambiguous agent parsing');
  });

  it('TEST-T4-SCN-003: Headless AI agent parses data-vd-* preview elements and reconciles token registry', () => {
    // Helper: Strict DTCG token resolution verifying full path traversal to normative leaf ($value)
    const resolveDtcgToken = (registry, tokenPath) => {
      const parts = tokenPath.replace(/^--vd3?-/, '').split('.');
      let current = registry;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return {
            resolved: false,
            token: null,
            reason: `Segment "${part}" does not exist in token path "${tokenPath}"`
          };
        }
      }
      if (!current || typeof current !== 'object' || !('$value' in current)) {
        return {
          resolved: false,
          token: null,
          reason: `Path "${tokenPath}" does not resolve to a normative leaf token with $value`
        };
      }
      return { resolved: true, token: current, reason: null };
    };

    // 1. Adversarial verification: verify that hallucinated, non-existent, or non-leaf tokens are rejected
    const hallucinatedTokens = [
      'space.fib-9999',
      'color.fake.hallucinated',
      'nonexistent.token',
      'space',             // group container, not a leaf token
      'type.size.unknown'
    ];
    for (const fakeToken of hallucinatedTokens) {
      const res = resolveDtcgToken(tokens, fakeToken);
      assert.strictEqual(
        res.resolved,
        false,
        `Hallucinated token "${fakeToken}" must be strictly rejected by reconciliation logic`
      );
    }

    // 2. Real artifact verification: evaluate site/dist/index.html
    const { path: distHtmlPath, html: targetHtml } = loadBibleDocumentationHtml();

    const previewElements = extractElementsByAttribute(targetHtml, 'data-vd-component');
    assert.ok(
      previewElements.length >= 2,
      `AI agent must discover >= 2 preview elements in "${distHtmlPath}", found ${previewElements.length}`
    );

    // Verify token reconciliation for each preview element
    for (const el of previewElements) {
      const componentName = el.attrs['data-vd-component'];
      const basisClass = el.attrs['data-vd-basis-class'];
      const tokenList = (el.attrs['data-vd-tokens'] || '').split(/\s+/).filter(Boolean);

      assert.ok(componentName, `Element <${el.tag}> must have non-empty data-vd-component`);
      assert.ok(['A', 'B', 'C'].includes(basisClass), `Basis class must be A, B, or C, got "${basisClass}"`);
      assert.ok(tokenList.length > 0, `Preview element for "${componentName}" must reference at least one token in data-vd-tokens`);

      for (const tokenPath of tokenList) {
        const res = resolveDtcgToken(tokens, tokenPath);
        assert.ok(
          res.resolved,
          `Referenced token "${tokenPath}" on <${el.tag} data-vd-component="${componentName}"> must exist in tokens/vd3.tokens.json: ${res.reason}`
        );
      }
    }
  });

  it('TEST-T4-SCN-004: Public fetchable token link discovery in HTML head', () => {
    const { path: distHtmlPath, html: targetHtml } = loadBibleDocumentationHtml();

    assert.ok(
      targetHtml.includes('rel="design-tokens"') || targetHtml.includes('vd3.tokens.json'),
      `HTML in "${distHtmlPath}" must provide discoverable link to design tokens JSON`
    );
  });
});
