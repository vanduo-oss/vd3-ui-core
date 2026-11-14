/**
 * @file documentation-ssg.test.mjs
 * Tier 1 Feature Tests: Documentation Site Pre-rendered Static HTML & AI Agent Readability.
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
 * Fails with an actionable diagnostic if the file does not exist.
 */
function loadLiveDocumentationHtml() {
  const distHtmlPath = resolveRepoPath('site/dist/index.html');
  assert.ok(
    existsSync(distHtmlPath),
    `Pre-rendered SSG artifact not found at "${distHtmlPath}". Run "pnpm build" to generate the pre-rendered documentation site before executing acceptance tests.`
  );
  return { path: distHtmlPath, html: readFileSync(distHtmlPath, 'utf8') };
}

describe('Tier 1: Documentation Site Pre-rendered Static HTML & AI Readability', () => {
  const tokens = loadTokens();

  it('TEST-T1-SSG-001: Pre-rendered static semantic HTML structure and placeholder detection', () => {
    // 1. Negative verification: ensure placeholder detector correctly catches defective CSR shells and template leaks
    const emptyCsrSample = '<!doctype html><html><body><div id="app"></div></body></html>';
    const csrIssues = detectUnrenderedPlaceholders(emptyCsrSample);
    assert.ok(csrIssues.length > 0, 'Placeholder detector must catch empty CSR container <div id="app"></div>');
    assert.ok(csrIssues.some(msg => msg.includes('<div id="app"></div>')), 'Flags CSR container');

    const uncompiledSample = '<div>Hello {{ user.name }}</div>';
    const templateIssues = detectUnrenderedPlaceholders(uncompiledSample);
    assert.ok(templateIssues.length > 0, 'Placeholder detector must catch uncompiled mustache {{ ... }}');

    // 2. Real artifact verification: evaluate site/dist/index.html
    const { path: distPath, html: liveHtml } = loadLiveDocumentationHtml();

    const cleanIssues = detectUnrenderedPlaceholders(liveHtml);
    assert.strictEqual(
      cleanIssues.length,
      0,
      `Pre-rendered SSG HTML in "${distPath}" must contain zero unrendered placeholders, but found: ${cleanIssues.join('; ')}`
    );

    // 3. Document completeness & semantic landmarks in site/dist/index.html
    assert.ok(
      liveHtml.length >= 5000,
      `Pre-rendered SSG HTML in "${distPath}" must be substantial (>5,000 characters). Got: ${liveHtml.length} characters.`
    );
    assert.ok(liveHtml.includes('<header'), 'Pre-rendered SSG HTML must contain semantic <header> landmark');
    assert.ok(liveHtml.includes('<nav'), 'Pre-rendered SSG HTML must contain semantic <nav> landmark');
    assert.ok(liveHtml.includes('<main'), 'Pre-rendered SSG HTML must contain semantic <main> landmark');
    assert.ok(liveHtml.includes('<section'), 'Pre-rendered SSG HTML must contain semantic <section> elements');
  });

  it('TEST-T1-SSG-002: Predictable Heading Ladder validates strict H1 -> H2 -> H3 hierarchy with zero skips', () => {
    // 1. Real artifact verification: extract headings from site/dist/index.html
    const { path: distPath, html: liveHtml } = loadLiveDocumentationHtml();
    const headings = extractHeadings(liveHtml);
    assert.ok(
      headings.length >= 4,
      `Expected at least 4 headings in "${distPath}", but found ${headings.length}. Static documentation must be pre-rendered.`
    );

    // Validate ladder integrity
    const validation = validateHeadingLadder(headings);
    assert.strictEqual(
      validation.valid,
      true,
      `Heading ladder in "${distPath}" must be valid: ${validation.errors.join('; ')}`
    );
    assert.strictEqual(headings[0].level, 1, `First heading in "${distPath}" must be H1`);

    // 2. Negative verification: check that skipping H2 directly to H4 is caught by validator
    const invalidHeadings = [
      { level: 1, text: 'Title' },
      { level: 3, text: 'Skipped H2' }
    ];
    const invalidValidation = validateHeadingLadder(invalidHeadings);
    assert.strictEqual(invalidValidation.valid, false, 'Validator must reject skipped heading levels');
    assert.ok(invalidValidation.errors.some(e => e.includes('Heading skip')), 'Error mentions heading skip');
  });

  it('TEST-T1-SSG-003: Embedded Schema.org JSON-LD structured metadata contains WebSite and TechArticle', () => {
    const { path: distPath, html: liveHtml } = loadLiveDocumentationHtml();
    const jsonLdEntities = extractJsonLd(liveHtml);
    assert.ok(
      jsonLdEntities.length > 0,
      `site/dist/index.html must contain at least one <script type="application/ld+json"> block for machine discoverability`
    );

    const graph = jsonLdEntities[0]['@graph'];
    assert.ok(Array.isArray(graph), 'JSON-LD in site/dist/index.html must define a @graph array');

    const webSite = graph.find(e => e['@type'] === 'WebSite');
    assert.ok(webSite, 'Schema.org graph in site/dist/index.html must contain WebSite entity');
    assert.ok(
      webSite.name && webSite.name.toLowerCase().includes('vd3'),
      'WebSite entity name must mention vd3'
    );

    const techArticle = graph.find(e => e['@type'] === 'TechArticle');
    assert.ok(techArticle, 'Schema.org graph in site/dist/index.html must contain TechArticle entity');
    assert.strictEqual(techArticle.version, '1.0.0-draft', 'TechArticle version in site/dist/index.html must be 1.0.0-draft');

    const termSet = graph.find(e => e['@type'] === 'DefinedTermSet');
    assert.ok(termSet, 'Schema.org graph in site/dist/index.html must contain DefinedTermSet for design tokens');
  });

  it('TEST-T1-SSG-004: Machine-readable data-vd-* attributes enable unambiguous AI agent extraction', () => {
    const { path: distPath, html: liveHtml } = loadLiveDocumentationHtml();
    const previewElements = extractElementsByAttribute(liveHtml, 'data-vd-component');
    assert.ok(
      previewElements.length >= 2,
      `Preview elements carrying data-vd-component must be found in "${distPath}", but found ${previewElements.length}`
    );

    for (const el of previewElements) {
      assert.ok(el.attrs['data-vd-component'], 'Must have data-vd-component');
      assert.ok(el.attrs['data-vd-basis-class'], 'Must have data-vd-basis-class');
      assert.ok(
        ['A', 'B', 'C'].includes(el.attrs['data-vd-basis-class']),
        `data-vd-basis-class must be A, B, or C. Got: ${el.attrs['data-vd-basis-class']}`
      );
      assert.ok(el.attrs['data-vd-tokens'], 'Must have data-vd-tokens');
    }
  });

  it('TEST-T1-SSG-005: Public fetchable token source of truth file exists and adheres to W3C DTCG format', () => {
    const tokenPath = resolveRepoPath('tokens/vd3.tokens.json');
    assert.ok(existsSync(tokenPath), 'Authoritative tokens file must exist in tokens/vd3.tokens.json');

    const content = JSON.parse(readFileSync(tokenPath, 'utf8'));
    assert.ok(content.color, 'Tokens must have color group');
    assert.ok(content.space, 'Tokens must have space group');
    assert.ok(content.line, 'Tokens must have line group');
    assert.ok(content.radius, 'Tokens must have radius group');
    assert.ok(content.shadow, 'Tokens must have shadow group');
    assert.ok(content.motion, 'Tokens must have motion group');
    assert.ok(content.type, 'Tokens must have type group');
    assert.ok(content.container, 'Tokens must have container group');

    // Verify public fetchable token endpoint in site/public/
    const publicTokenPath = resolveRepoPath('site/public/tokens/vd3.tokens.json');
    if (existsSync(publicTokenPath)) {
      const publicContent = JSON.parse(readFileSync(publicTokenPath, 'utf8'));
      assert.strictEqual(
        publicContent.version || publicContent.$version,
        content.version || content.$version,
        'Public tokens file must match authoritative tokens version'
      );
    }
  });
});
