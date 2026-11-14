/**
 * @file theme-contrast.test.mjs
 * Tier 3 Combination Tests: Dual-Theme Switching + Full Semantic Role Contrast Matrix.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { loadTokens, contrastRatio, resolveTokenValue } from '../helpers/math-oracle.mjs';

describe('Tier 3: Dual-Theme Switching & WCAG Contrast Matrix Integration', () => {
  const tokens = loadTokens();

  it('TEST-T3-CMB-005: 1-to-1 semantic role parity between Light and Dark themes (zero-frame switch)', () => {
    const lightRoles = Object.keys(tokens.color.role).filter(k => !k.startsWith('$'));
    const darkRoles = Object.keys(tokens.theme.dark.color.role).filter(k => !k.startsWith('$'));

    // Verify 100% role parity: Every role in light must exist in dark
    for (const role of lightRoles) {
      assert.ok(
        darkRoles.includes(role),
        `Dark theme MUST define identical role "${role}" for zero-frame switching`
      );
    }

    assert.strictEqual(
      lightRoles.length,
      darkRoles.length,
      `Light theme (${lightRoles.length} roles) and Dark theme (${darkRoles.length} roles) must have identical role count`
    );
  });

  it('TEST-T3-CMB-006: Comprehensive WCAG AAA/AA relative luminance contrast matrix across themes', () => {
    // 1. Audit Light Theme Roles
    const lightRoles = tokens.color.role;
    const lightCanvas = resolveTokenValue(tokens, lightRoles.canvas.$value);
    const lightLayer = resolveTokenValue(tokens, lightRoles.layer.$value);
    const lightTextPrimary = resolveTokenValue(tokens, lightRoles['text-primary'].$value);
    const lightTextSecondary = resolveTokenValue(tokens, lightRoles['text-secondary'].$value);
    const lightFocus = resolveTokenValue(tokens, lightRoles.focus.$value);

    // Text primary on canvas: WCAG AAA (>= 7.0:1)
    const lightTextOnCanvas = contrastRatio(lightTextPrimary, lightCanvas);
    assert.ok(
      lightTextOnCanvas >= 7.0,
      `Light text-primary on canvas (${lightTextOnCanvas.toFixed(2)}:1) must achieve WCAG AAA (>= 7.0:1)`
    );

    // Text primary on elevated layer: WCAG AA (>= 4.5:1)
    const lightTextOnLayer = contrastRatio(lightTextPrimary, lightLayer);
    assert.ok(
      lightTextOnLayer >= 4.5,
      `Light text-primary on layer (${lightTextOnLayer.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );

    // Text secondary on canvas: WCAG AA (>= 4.5:1)
    const lightSecOnCanvas = contrastRatio(lightTextSecondary, lightCanvas);
    assert.ok(
      lightSecOnCanvas >= 4.5,
      `Light text-secondary on canvas (${lightSecOnCanvas.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );

    // Focus ring contrast: Non-text contrast (>= 3.0:1) against adjacent focused element surface
    const lightFocusOnElement = contrastRatio(lightFocus, lightTextPrimary);
    assert.ok(
      lightFocusOnElement >= 3.0,
      `Light focus ring against focused surface (${lightFocusOnElement.toFixed(2)}:1) must achieve >= 3.0:1`
    );

    // 2. Audit Dark Theme Roles
    const darkRoles = tokens.theme.dark.color.role;
    const darkCanvas = resolveTokenValue(tokens, darkRoles.canvas.$value);
    const darkLayer = resolveTokenValue(tokens, darkRoles.layer.$value);
    const darkTextPrimary = resolveTokenValue(tokens, darkRoles['text-primary'].$value);
    const darkTextSecondary = resolveTokenValue(tokens, darkRoles['text-secondary'].$value);
    const darkFocus = resolveTokenValue(tokens, darkRoles.focus.$value);

    // Dark text primary on dark canvas: WCAG AAA (>= 7.0:1)
    const darkTextOnCanvas = contrastRatio(darkTextPrimary, darkCanvas);
    assert.ok(
      darkTextOnCanvas >= 7.0,
      `Dark text-primary on dark canvas (${darkTextOnCanvas.toFixed(2)}:1) must achieve WCAG AAA (>= 7.0:1)`
    );

    // Dark text primary on dark layer: WCAG AA (>= 4.5:1)
    const darkTextOnLayer = contrastRatio(darkTextPrimary, darkLayer);
    assert.ok(
      darkTextOnLayer >= 4.5,
      `Dark text-primary on dark layer (${darkTextOnLayer.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );

    // Dark text secondary on dark canvas: WCAG AA (>= 4.5:1)
    const darkSecOnCanvas = contrastRatio(darkTextSecondary, darkCanvas);
    assert.ok(
      darkSecOnCanvas >= 4.5,
      `Dark text-secondary on dark canvas (${darkSecOnCanvas.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );

    // Dark focus ring on dark canvas: Non-text contrast (>= 3.0:1)
    const darkFocusOnCanvas = contrastRatio(darkFocus, darkCanvas);
    assert.ok(
      darkFocusOnCanvas >= 3.0,
      `Dark focus ring on dark canvas (${darkFocusOnCanvas.toFixed(2)}:1) must achieve >= 3.0:1`
    );
  });
});
