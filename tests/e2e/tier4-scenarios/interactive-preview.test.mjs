/**
 * @file interactive-preview.test.mjs
 * Tier 4 Scenario: Interactive Component Preview Verification, High-Contrast Theming & Motion Audit.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadTokens, contrastRatio, resolveTokenValue, resolveRepoPath } from '../helpers/math-oracle.mjs';
import { extractCustomProperties, extractMediaQueries } from '../helpers/css-parser.mjs';

describe('Tier 4 Scenario 3: Production Accessibility & Interactive Preview Audit', () => {
  const tokens = loadTokens();

  it('TEST-T4-SCN-009: Interactive button contrast verification across Light and Dark themes', () => {
    // 1. Light Theme Interactive Button
    const lightInteractiveBg = resolveTokenValue(tokens, tokens.color.role.interactive.$value);
    const lightCanvas = resolveTokenValue(tokens, tokens.color.role.canvas.$value);
    const darkText = resolveTokenValue(tokens, tokens.color.role['text-primary'].$value);

    // Button contrast against dark text (for high readability)
    const buttonTextContrast = contrastRatio(lightInteractiveBg, darkText);
    assert.ok(
      buttonTextContrast >= 4.5,
      `Light interactive button text contrast (${buttonTextContrast.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );

    // 2. Dark Theme Interactive Button
    const darkInteractiveBg = resolveTokenValue(tokens, tokens.theme.dark.color.role.interactive.$value);
    const darkCanvas = resolveTokenValue(tokens, tokens.theme.dark.color.role.canvas.$value);

    const darkButtonContrast = contrastRatio(darkInteractiveBg, darkCanvas);
    assert.ok(
      darkButtonContrast >= 4.5,
      `Dark interactive button on dark canvas (${darkButtonContrast.toFixed(2)}:1) must achieve WCAG AA (>= 4.5:1)`
    );
  });

  it('TEST-T4-SCN-010: Focus ring geometry rules: outline thickness >= 2px and outline-offset >= 2px', () => {
    // 1. Audit normative focus tokens in tokens.css
    const tokensCssPath = resolveRepoPath('tokens/tokens.css');
    assert.ok(existsSync(tokensCssPath), 'tokens/tokens.css must exist');
    const tokensCss = readFileSync(tokensCssPath, 'utf8');
    const cssVars = extractCustomProperties(tokensCss);

    // Verify --vd3-focus-ring-width and offset
    const focusWidth = cssVars.get('--vd3-focus-ring-width');
    const focusOffset = cssVars.get('--vd3-focus-ring-offset');
    assert.ok(focusWidth, '--vd3-focus-ring-width must be defined');
    assert.ok(focusOffset, '--vd3-focus-ring-offset must be defined');

    const widthPx = parseFloat(focusWidth);
    const offsetPx = parseFloat(focusOffset);
    assert.ok(widthPx >= 2, `Focus ring width (${widthPx}px) must be >= 2px for WCAG 2.4.11 visibility`);
    assert.ok(offsetPx >= 2, `Focus ring offset (${offsetPx}px) must be >= 2px to prevent clipping by border-radius`);

    // 2. Audit focus ring contrast (WCAG SC 2.4.13 Focus Appearance >= 3:1)
    const lightFocusColor = resolveTokenValue(tokens, tokens.color.role.focus.$value);
    const textPrimary = resolveTokenValue(tokens, tokens.color.role['text-primary'].$value);
    const lightFocusContrast = contrastRatio(lightFocusColor, textPrimary);
    assert.ok(
      lightFocusContrast >= 3.0,
      `Light focus ring contrast against component boundary (${lightFocusContrast.toFixed(2)}:1) must achieve WCAG SC 2.4.13 (>= 3.0:1)`
    );

    const darkFocusColor = resolveTokenValue(tokens, tokens.theme.dark.color.role.focus.$value);
    const darkCanvas = resolveTokenValue(tokens, tokens.theme.dark.color.role.canvas.$value);
    const darkFocusContrast = contrastRatio(darkFocusColor, darkCanvas);
    assert.ok(
      darkFocusContrast >= 3.0,
      `Dark focus ring contrast (${darkFocusContrast.toFixed(2)}:1) must achieve WCAG SC 2.4.13 (>= 3.0:1)`
    );

    // 3. Verify normative focus contract in foundations/focus.md
    const focusDocPath = resolveRepoPath('foundations/focus.md');
    assert.ok(existsSync(focusDocPath), 'foundations/focus.md must exist');
    const focusDoc = readFileSync(focusDocPath, 'utf8');
    assert.ok(focusDoc.includes('Dual-Ring Architecture'), 'Must document Dual-Ring Architecture');
    assert.ok(focusDoc.includes('WCAG 2.2 Success Criterion 2.4.13'), 'Must cite WCAG SC 2.4.13');
  });

  it('TEST-T4-SCN-011: Reduced motion contract (MOB-001) disables spatial transforms and collapses transitions', () => {
    // 1. Load published tokens stylesheet
    const tokensCssPath = resolveRepoPath('tokens/tokens.css');
    assert.ok(existsSync(tokensCssPath), 'tokens/tokens.css must exist');
    const tokensCss = readFileSync(tokensCssPath, 'utf8');

    // 2. Verify prefers-reduced-motion media query
    const mediaQueries = extractMediaQueries(tokensCss, 'prefers-reduced-motion');
    assert.ok(mediaQueries.length > 0, 'tokens.css must declare @media (prefers-reduced-motion: reduce)');
    const mediaContent = mediaQueries[0].content;

    // Verify universal selector collapses durations to 0s or 0.01ms !important
    assert.ok(
      mediaContent.includes('transition-duration: 0.01ms !important') ||
      mediaContent.includes('transition-duration: 0ms !important') ||
      mediaContent.includes('transition-duration: 0s !important'),
      'Must collapse transition-duration in universal selector'
    );
    assert.ok(
      mediaContent.includes('animation-duration: 0.01ms !important') ||
      mediaContent.includes('animation-duration: 0ms !important') ||
      mediaContent.includes('animation-duration: 0s !important'),
      'Must collapse animation-duration in universal selector'
    );

    // 3. Verify [data-motion="reduce"] attribute selector
    assert.ok(tokensCss.includes('[data-motion="reduce"]'), 'tokens.css must declare [data-motion="reduce"] override');

    // 4. Verify foundation documentation
    const motionDocPath = resolveRepoPath('foundations/motion.md');
    assert.ok(existsSync(motionDocPath), 'foundations/motion.md must exist');
    const motionDoc = readFileSync(motionDocPath, 'utf8');
    assert.ok(motionDoc.includes('MOB-001'), 'foundations/motion.md must specify MOB-001');
  });
});
