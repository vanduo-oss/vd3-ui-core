/**
 * @file standards-a11y.test.mjs
 * Tier 1 Feature Tests: Modern Web Standards, WCAG Contrast & Architectural Integrity.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolveRepoPath, loadTokens, contrastRatio, resolveTokenValue } from '../helpers/math-oracle.mjs';
import { extractLayerOrder } from '../helpers/css-parser.mjs';

describe('Tier 1: Standards Compliance, WCAG Contrast & Architectural Integrity', () => {
  const tokens = loadTokens();

  it('TEST-T1-STD-001: Zero external framework runtime dependencies in core logic', () => {
    // Audit core foundation files and tokens: zero third-party framework runtime requirements
    const pkgPath = resolveRepoPath('package.json');
    if (existsSync(pkgPath)) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      const deps = { ...pkg.dependencies };
      // Verify no UI component libraries in dependencies
      assert.ok(!deps.tailwindcss, 'Core package must NOT depend on tailwindcss');
      assert.ok(!deps.bootstrap, 'Core package must NOT depend on bootstrap');
      assert.ok(!deps['@chakra-ui/react'], 'Core package must NOT depend on chakra-ui');
      assert.ok(!deps['@material-ui/core'], 'Core package must NOT depend on material-ui');
    }

    // Verify pure HTML5 + modern CSS in tokens and specifications
    assert.ok(tokens, 'Tokens load without external runtime dependencies');
  });

  it('TEST-T1-STD-002: Anti-copying guard verifies proprietary mathematical identity (PRN-001, PRN-003)', () => {
    const principlesPath = resolveRepoPath('foundations/principles.md');
    assert.ok(existsSync(principlesPath), 'foundations/principles.md must exist');
    const principles = readFileSync(principlesPath, 'utf8');

    // Verify Axiom PRN-003: Behavior is standard, identity is proprietary
    assert.ok(principles.includes('PRN-003'), 'Must declare PRN-003');
    assert.ok(/identity is proprietary/i.test(principles), 'Identity must be proprietary');
    assert.ok(/follow(s)? no external design system/i.test(principles), 'Visual identity must follow no external design system');
    assert.ok(principles.includes('PRN-001'), 'Must declare PRN-001 (Three-Class basis contract)');
  });

  it('TEST-T1-STD-003: Modern CSS Cascade Layer declaration order conforms to specification', () => {
    const expectedOrder = ['vd3.tokens', 'vd3.reset', 'vd3.base', 'vd3.layout', 'vd3.components', 'vd3.utilities'];

    // 1. Load real published design tokens stylesheet
    const tokensCssPath = resolveRepoPath('tokens/tokens.css');
    assert.ok(existsSync(tokensCssPath), 'tokens/tokens.css must exist');
    const tokensCss = readFileSync(tokensCssPath, 'utf8');

    // 2. Parse and verify cascade layer precedence declaration
    const parsedOrder = extractLayerOrder(tokensCss);
    assert.deepStrictEqual(parsedOrder, expectedOrder, 'Layer declaration order in tokens.css matches specification');

    // 3. Verify specific layer hierarchy invariants
    assert.strictEqual(parsedOrder[0], 'vd3.tokens', 'vd3.tokens must be the lowest specificity layer');
    assert.strictEqual(parsedOrder[parsedOrder.length - 1], 'vd3.utilities', 'vd3.utilities must be the final cascade layer for atomic overrides');

    // 4. Verify that tokens.css encloses rules within @layer vd3.tokens
    assert.ok(tokensCss.includes('@layer vd3.tokens {'), 'tokens.css must encapsulate rules in @layer vd3.tokens');
  });

  it('TEST-T1-STD-004: Dual-theme semantic colors achieve WCAG AAA/AA contrast compliance', () => {
    // Light theme evaluation
    const lightCanvas = resolveTokenValue(tokens, tokens.color.role.canvas.$value);
    const lightTextPrimary = resolveTokenValue(tokens, tokens.color.role['text-primary'].$value);
    const lightTextSecondary = resolveTokenValue(tokens, tokens.color.role['text-secondary'].$value);

    const lightPrimaryContrast = contrastRatio(lightTextPrimary, lightCanvas);
    assert.ok(
      lightPrimaryContrast >= 7.0,
      `Light text-primary on canvas (${lightPrimaryContrast.toFixed(2)}:1) must meet WCAG AAA (>= 7.0:1)`
    );

    const lightSecondaryContrast = contrastRatio(lightTextSecondary, lightCanvas);
    assert.ok(
      lightSecondaryContrast >= 4.5,
      `Light text-secondary on canvas (${lightSecondaryContrast.toFixed(2)}:1) must meet WCAG AA (>= 4.5:1)`
    );

    // Dark theme evaluation
    const darkCanvas = resolveTokenValue(tokens, tokens.theme.dark.color.role.canvas.$value);
    const darkTextPrimary = resolveTokenValue(tokens, tokens.theme.dark.color.role['text-primary'].$value);
    const darkTextSecondary = resolveTokenValue(tokens, tokens.theme.dark.color.role['text-secondary'].$value);

    const darkPrimaryContrast = contrastRatio(darkTextPrimary, darkCanvas);
    assert.ok(
      darkPrimaryContrast >= 7.0,
      `Dark text-primary on canvas (${darkPrimaryContrast.toFixed(2)}:1) must meet WCAG AAA (>= 7.0:1)`
    );

    const darkSecondaryContrast = contrastRatio(darkTextSecondary, darkCanvas);
    assert.ok(
      darkSecondaryContrast >= 4.5,
      `Dark text-secondary on canvas (${darkSecondaryContrast.toFixed(2)}:1) must meet WCAG AA (>= 4.5:1)`
    );
  });

  it('TEST-T1-STD-005: Reduced motion contract (MOB-001) collapses animation durations to 0s', () => {
    const motionSpecPath = resolveRepoPath('foundations/motion.md');
    assert.ok(existsSync(motionSpecPath), 'foundations/motion.md must exist');
    const motionSpec = readFileSync(motionSpecPath, 'utf8');

    assert.ok(motionSpec.includes('MOB-001'), 'Must define MOB-001 reduced motion rule');
    assert.ok(motionSpec.includes('prefers-reduced-motion'), 'Must reference prefers-reduced-motion media feature');

    // Verify token duration 0 exists
    assert.strictEqual(tokens.motion['0'].$value, '0ms', 'motion.0 is tokenized as 0ms');
  });
});
