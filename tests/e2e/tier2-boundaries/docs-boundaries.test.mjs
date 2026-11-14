/**
 * @file docs-boundaries.test.mjs
 * Tier 2 Boundary Tests: Documentation Malformed Inputs, Template Leaks & Boundary Edge Validation.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolveRepoPath, loadTokens } from '../helpers/math-oracle.mjs';
import {
  extractJsonLd,
  extractHeadings,
  validateHeadingLadder,
  detectUnrenderedPlaceholders,
  extractElementsByAttribute,
  parseAttributes
} from '../helpers/html-parser.mjs';

describe('Tier 2: Documentation Site Boundary & Edge Cases', () => {
  const tokens = loadTokens();

  it('TEST-T2-DOC-001: Template delimiter leak detection catches mustache syntax and empty CSR shells', () => {
    // 1. Template mustache syntax
    const mustacheHtml = '<section><h2>Title</h2><p>{{ user.profile.name }}</p></section>';
    const mustacheIssues = detectUnrenderedPlaceholders(mustacheHtml);
    assert.ok(mustacheIssues.length > 0, 'Must detect mustache syntax');
    assert.ok(mustacheIssues.some(i => i.includes('mustache')), 'Flags uncompiled mustache');

    // 2. Vue directive leak
    const directiveHtml = '<div v-if="isActive" v-for="item in items">{{ item }}</div>';
    const directiveIssues = detectUnrenderedPlaceholders(directiveHtml);
    assert.ok(directiveIssues.length > 0, 'Must detect Vue directives (v-if, v-for)');

    // 3. Empty CSR app container shell
    const emptyAppHtml = '<!doctype html><html><body><div id="app"></div></body></html>';
    const appIssues = detectUnrenderedPlaceholders(emptyAppHtml);
    assert.ok(appIssues.length > 0, 'Must detect empty CSR shell <div id="app"></div>');
  });

  it('TEST-T2-DOC-002: Heading ladder edge cases: multiple H1s, non-H1 roots, and empty headings', () => {
    // Multiple H1s
    const multiH1 = [
      { level: 1, text: 'First H1' },
      { level: 2, text: 'Chapter 1' },
      { level: 1, text: 'Second H1' }
    ];
    const multiH1Validation = validateHeadingLadder(multiH1);
    assert.strictEqual(multiH1Validation.valid, false, 'Multiple H1s must fail validation');
    assert.ok(multiH1Validation.errors.some(e => e.includes('exactly 1 <h1>')), 'Error mentions H1 count');

    // First heading is H2 instead of H1
    const h2Root = [
      { level: 2, text: 'Starting at H2' },
      { level: 3, text: 'Subheading' }
    ];
    const h2RootValidation = validateHeadingLadder(h2Root);
    assert.strictEqual(h2RootValidation.valid, false, 'Starting at H2 must fail validation');
    assert.ok(h2RootValidation.errors.some(e => e.includes('First heading must be <h1>')), 'Flags first heading level');

    // Empty heading list
    const emptyValidation = validateHeadingLadder([]);
    assert.strictEqual(emptyValidation.valid, false, 'Empty heading list must fail');
  });

  it('TEST-T2-DOC-003: Rejection of invalid basis class "D" and malformed data-vd-* attributes', () => {
    // 1. Verify Axiom PRN-001 in First Principles
    const principlesPath = resolveRepoPath('foundations/principles.md');
    assert.ok(existsSync(principlesPath), 'foundations/principles.md must exist');
    const principles = readFileSync(principlesPath, 'utf8');

    // PRN-001 defines Class A, B, and C and explicitly bans Class D
    assert.ok(principles.includes('PRN-001'), 'Must declare Axiom PRN-001');
    assert.ok(principles.includes('Class A'), 'Must define Class A');
    assert.ok(principles.includes('Class B'), 'Must define Class B');
    assert.ok(principles.includes('Class C'), 'Must define Class C');
    assert.ok(
      /There is no Class D/i.test(principles),
      'Axiom PRN-001 must explicitly state that Class D does not exist'
    );

    // 2. Audit token registry extensions for strict basis compliance
    const tokenClasses = new Set();
    const scanTokens = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (obj.$extensions && obj.$extensions.vd3 && obj.$extensions.vd3.class) {
        tokenClasses.add(obj.$extensions.vd3.class);
      }
      for (const val of Object.values(obj)) {
        if (typeof val === 'object') scanTokens(val);
      }
    };
    scanTokens(tokens);

    // Every token must belong to A, B, or C; D is forbidden
    assert.ok(tokenClasses.size > 0, 'Tokens must declare basis classes in $extensions.vd3.class');
    for (const cls of tokenClasses) {
      assert.ok(['A', 'B', 'C'].includes(cls), `Found illegal basis class "${cls}". Only A, B, C are permitted.`);
    }

    // 3. Attribute parser rejects malformed data-vd-* attributes in HTML fixtures
    const sampleHtml = '<div data-vd-component="card" data-vd-basis="A" data-vd-tokens="space.fib-8">Preview</div>';
    const parsed = extractElementsByAttribute(sampleHtml, 'data-vd-component');
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].attrs['data-vd-basis'], 'A', 'Valid basis class A parsed');
  });

  it('TEST-T2-DOC-004: JSON-LD syntax integrity, error handling and missing @graph recovery', () => {
    // Malformed JSON inside script tag
    const malformedHtml = '<script type="application/ld+json">{ "unterminated": "string </script>';
    const results = extractJsonLd(malformedHtml);
    assert.strictEqual(results.length, 1, 'Should extract the script block');
    assert.strictEqual(results[0].error, 'INVALID_JSON', 'Should record INVALID_JSON error gracefully');

    // Valid JSON but missing @graph
    const missingGraphHtml = '<script type="application/ld+json">{ "@context": "https://schema.org", "@type": "WebSite" }</script>';
    const validResults = extractJsonLd(missingGraphHtml);
    assert.strictEqual(validResults[0]['@context'], 'https://schema.org');
    assert.strictEqual(Array.isArray(validResults[0]['@graph']), false, '@graph is absent in single-entity schema');
  });

  it('TEST-T2-DOC-005: HTML attribute parser handles unquoted attributes, boolean flags, and entity encodings', () => {
    const rawAttrs = 'class="vd-btn" data-vd-component=button disabled data-vd-tokens="--vd3-space-fib-8 --vd3-focus"';
    const parsed = parseAttributes(rawAttrs);

    assert.strictEqual(parsed.class, 'vd-btn', 'Parses quoted class');
    assert.strictEqual(parsed['data-vd-component'], 'button', 'Parses unquoted attribute value');
    assert.strictEqual(parsed.disabled, '', 'Parses boolean flag attribute');
    assert.strictEqual(parsed['data-vd-tokens'], '--vd3-space-fib-8 --vd3-focus', 'Parses space-separated list');
  });
});
