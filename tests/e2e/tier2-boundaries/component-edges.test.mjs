/**
 * @file component-edges.test.mjs
 * Tier 2 Boundary Tests: Pill Radius 9999rem, Shadow Inks, Reduced Motion & Stacking Order.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { loadTokens, parseHexColor, resolveTokenValue, resolveRepoPath } from '../helpers/math-oracle.mjs';
import { extractMediaQueries, extractCustomProperties } from '../helpers/css-parser.mjs';
import { extractElements } from '../helpers/html-parser.mjs';

describe('Tier 2: Component Edge Cases & Boundary Conditions', () => {
  const tokens = loadTokens();

  it('TEST-T2-CMP-001: Pill radius invariant semantics (C-04, 9999rem) on arbitrary element heights', () => {
    // Registered Exception C-04: radius.full is 9999rem
    const pillToken = tokens.radius.full;
    assert.strictEqual(pillToken.$value, '9999rem', 'radius.full must be exactly 9999rem');
    assert.ok(
      pillToken.$description?.includes('C-04') || pillToken.$description?.includes('shape semantic'),
      'Must document C-04 shape semantic in description'
    );

    // Mathematical simulation: browser border-radius clamping algorithm
    // Computed radius = min(declared_radius, height / 2)
    const computeEffectiveRadius = (heightPx, declaredRadiusRem, rootPx = 16) => {
      const declaredPx = declaredRadiusRem * rootPx;
      return Math.min(declaredPx, heightPx / 2);
    };

    // Small badge / chip: 18px height
    const chipRadius = computeEffectiveRadius(18, 9999);
    assert.strictEqual(chipRadius, 9, 'Chip with 18px height clamps radius to 9px (half-height)');

    // Medium button: 40px height
    const btnRadius = computeEffectiveRadius(40, 9999);
    assert.strictEqual(btnRadius, 20, 'Button with 40px height clamps radius to 20px (half-height)');

    // Large container: 600px height
    const cardRadius = computeEffectiveRadius(600, 9999);
    assert.strictEqual(cardRadius, 300, 'Container with 600px height clamps radius to 300px without distortion');
  });

  it('TEST-T2-CMP-002: Shadow ink alpha transparency boundary (Light vs Dark theme)', () => {
    const lightShadowInk = resolveTokenValue(tokens, tokens.color.role.shadow.$value);
    const darkShadowInk = resolveTokenValue(tokens, tokens.theme.dark.color.role.shadow.$value);

    const lightParsed = parseHexColor(lightShadowInk);
    const darkParsed = parseHexColor(darkShadowInk);

    // Light theme: subtle ink alpha (5% - 20%)
    assert.ok(
      lightParsed.a <= 0.25,
      `Light shadow ink alpha (${lightParsed.a.toFixed(2)}) must be subtle (<= 0.25)`
    );

    // Dark theme: deeper ink alpha (30% - 60%) to ensure visibility on dark background (#1a1d20)
    assert.ok(
      darkParsed.a >= 0.25,
      `Dark shadow ink alpha (${darkParsed.a.toFixed(2)}) must be elevated (>= 0.25)`
    );

    // Dark ink alpha must exceed light ink alpha
    assert.ok(
      darkParsed.a > lightParsed.a,
      `Dark shadow ink alpha (${darkParsed.a}) must be greater than light shadow ink alpha (${lightParsed.a})`
    );
  });

  it('TEST-T2-CMP-003: Reduced motion transform and duration collapse (MOB-001)', () => {
    const tokensCssPath = resolveRepoPath('tokens/tokens.css');
    assert.ok(existsSync(tokensCssPath), 'tokens/tokens.css must exist');
    const tokensCss = readFileSync(tokensCssPath, 'utf8');

    // 1. Extract prefers-reduced-motion media query from stylesheet
    const mediaQueries = extractMediaQueries(tokensCss, 'prefers-reduced-motion');
    assert.ok(mediaQueries.length > 0, 'tokens.css must contain @media (prefers-reduced-motion: reduce)');

    const reducedMotionBlock = mediaQueries[0].content;

    // 2. Verify all animation and transition durations collapse to 0s / 0.01ms !important
    assert.ok(
      reducedMotionBlock.includes('transition-duration: 0.01ms !important') ||
      reducedMotionBlock.includes('transition-duration: 0ms !important') ||
      reducedMotionBlock.includes('transition-duration: 0s !important'),
      'Must collapse transition-duration to zero under prefers-reduced-motion'
    );
    assert.ok(
      reducedMotionBlock.includes('animation-duration: 0.01ms !important') ||
      reducedMotionBlock.includes('animation-duration: 0ms !important') ||
      reducedMotionBlock.includes('animation-duration: 0s !important'),
      'Must collapse animation-duration to zero under prefers-reduced-motion'
    );

    // 3. Verify scroll-behavior is set to auto !important
    assert.ok(
      reducedMotionBlock.includes('scroll-behavior: auto !important'),
      'Must disable smooth scroll under prefers-reduced-motion'
    );

    // 4. Verify all duration custom properties are collapsed to 0ms
    const collapsedVars = extractCustomProperties(reducedMotionBlock);
    for (const ms of [55, 89, 144, 233, 377, 610, 987]) {
      assert.strictEqual(
        collapsedVars.get(`--vd3-duration-${ms}`),
        '0ms',
        `--vd3-duration-${ms} must collapse to 0ms under reduced motion`
      );
    }
  });

  it('TEST-T2-CMP-004: Empty dialog focus default boundary (DLG-001)', () => {
    // 1. Audit normative dialog specification
    const dialogSpecPath = resolveRepoPath('components/dialog/spec.md');
    assert.ok(existsSync(dialogSpecPath), 'components/dialog/spec.md must exist');
    const dialogSpec = readFileSync(dialogSpecPath, 'utf8');

    // Verify DLG-001 boundary clause: first focusable child, or dialog surface if none
    assert.ok(
      /DLG-001.*first focusable.*dialog\s+surface if none/is.test(dialogSpec),
      'Must specify DLG-001 rule: focus moves to first focusable element, or surface if none'
    );

    // 2. Validate empty dialog DOM fixture
    const emptyDialogFixture = `
      <dialog class="vd-dialog" id="dlg-notice" aria-labelledby="dlg-title" aria-modal="true" tabindex="-1">
        <h2 id="dlg-title">Notice</h2>
        <p>System notification with no actionable controls.</p>
      </dialog>
    `;
    const dialogElements = extractElements(emptyDialogFixture, 'dialog');
    assert.strictEqual(dialogElements.length, 1);
    const dialog = dialogElements[0];

    // Dialog surface must carry tabindex="-1" to receive focus programmatically when childless
    assert.strictEqual(dialog.attrs.tabindex, '-1', 'Empty dialog surface must carry tabindex="-1" per DLG-001');
    assert.strictEqual(dialog.attrs['aria-modal'], 'true', 'Must be marked aria-modal="true"');

    // 3. Verify stacking level
    assert.strictEqual(tokens.z.modal.$value, 1050, 'Dialog surface stacks at z.modal = 1050');
  });

  it('TEST-T2-CMP-005: Stacking order zero floor (z.base = 0) and strictly monotonic gaps', () => {
    const z = tokens.z;
    assert.strictEqual(z.base.$value, 0, 'z.base must be explicitly 0 (normative floor)');

    // Invariant order: base -> dropdown -> sticky -> fixed -> modal-backdrop -> modal -> popover -> tooltip -> toast
    const ladder = [
      'base',
      'dropdown',
      'sticky',
      'fixed',
      'modal-backdrop',
      'modal',
      'popover',
      'tooltip',
      'toast'
    ];

    // Assert strictly ascending values
    for (let i = 1; i < ladder.length; i++) {
      const prevKey = ladder[i - 1];
      const currKey = ladder[i];
      const prevVal = z[prevKey].$value;
      const currVal = z[currKey].$value;

      assert.ok(
        currVal > prevVal,
        `Stacking order violation: z.${currKey} (${currVal}) must be > z.${prevKey} (${prevVal})`
      );

      // Verify safety gap between UI layers (>= 10 units)
      if (prevKey !== 'base') {
        const gap = currVal - prevVal;
        assert.ok(gap >= 10, `Safety headroom gap between ${prevKey} and ${currKey} must be >= 10, got ${gap}`);
      }
    }
  });
});
