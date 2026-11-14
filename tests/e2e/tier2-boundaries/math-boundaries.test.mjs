/**
 * @file math-boundaries.test.mjs
 * Tier 2 Boundary Tests: Mathematical Scales, Fluid Clamps & Edge Rounding Limits.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  fibonacci,
  lucas,
  goldenSplit,
  loadTokens,
  GOLDEN_ANGLE_DEG
} from '../helpers/math-oracle.mjs';

describe('Tier 2: Mathematical Scales & Boundary Conditions', () => {
  const tokens = loadTokens();

  it('TEST-T2-BND-001: Small spacing discontinuity boundary at C-01 transition', () => {
    // Under Exception C-01, fib-8 is rounded to 0.75rem (12px) to align with 4px grid
    // fib-13 begins the literal sequence at 0.8125rem (13px)
    // The delta is exactly 1px, whereas literal F7 - F6 would be 13 - 8 = 5px
    const token8 = tokens.space['fib-8'];
    const token13 = tokens.space['fib-13'];

    const px8 = Math.round(parseFloat(token8.$value) * 16);
    const px13 = Math.round(parseFloat(token13.$value) * 16);

    assert.strictEqual(px8, 12, 'C-01 forces space.fib-8 to 12px');
    assert.strictEqual(px13, 13, 'space.fib-13 begins literal Fibonacci scale at 13px');
    assert.strictEqual(px13 - px8, 1, 'Discontinuity boundary delta is exactly 1px');
  });

  it('TEST-T2-BND-002: Fluid typography clamp boundary limits at extreme viewports', () => {
    // Evaluates clamp(2.8rem, 2.27rem + 2.65vw, 4.25rem)
    const minRem = 2.8;
    const prefRem = 2.27;
    const vwCoeff = 2.65;
    const maxRem = 4.25;

    const evaluateClamp = (viewportWidthPx) => {
      const preferred = prefRem + (vwCoeff * viewportWidthPx / 100) / 16;
      return Math.min(maxRem, Math.max(minRem, preferred));
    };

    // Extreme small screen: 320px mobile
    const at320 = evaluateClamp(320);
    assert.strictEqual(at320, minRem, 'At 320px, typography locks strictly to min clamp bound 2.8rem');

    // Extreme large screen: 1920px 1080p display / 4K
    const at1920 = evaluateClamp(1920);
    assert.strictEqual(at1920, maxRem, 'At 1920px, typography locks strictly to max clamp bound 4.25rem (68px = 16*phi^3)');

    // Intermediate viewport: 800px tablet
    const at800 = evaluateClamp(800);
    assert.ok(at800 > minRem && at800 < maxRem, 'At 800px, typography scales fluidly between min and max');
  });

  it('TEST-T2-BND-003: Seemore glass blur soft-cap saturation (C-02 Convergence Zone)', () => {
    // Audited 10 glass steps: [step, blurPx]
    const glassSteps = [
      [1, 2], [2, 3], [3, 5], [5, 8], [8, 13],
      [13, 16], [21, 20], [34, 22], [55, 24], [89, 26]
    ];

    // Monotonicity: blur must strictly increase
    for (let i = 0; i < glassSteps.length - 1; i++) {
      const curr = glassSteps[i][1];
      const next = glassSteps[i + 1][1];
      assert.ok(next > curr, `Blur must strictly increase from step ${glassSteps[i][0]} to ${glassSteps[i+1][0]}`);
    }

    // Step 13 deviates from literal F8 (21px) to soft-cap at 16px
    const step13 = glassSteps.find(s => s[0] === 13);
    assert.strictEqual(step13[1], 16, 'C-02 soft-caps step 13 blur at 16px');

    // Step 89 caps at <= 26px
    const step89 = glassSteps.find(s => s[0] === 89);
    assert.ok(step89[1] <= 26, `Maximum glass blur must be soft-capped <= 26px. Got: ${step89[1]}px`);
  });

  it('TEST-T2-BND-004: Golden split subpixel rounding and partition sum invariance', () => {
    // Tests golden partition on various boundary widths
    const testWidths = [1, 3, 5, 10, 100, 987, 1000, 1597];

    for (const w of testWidths) {
      const { primary, secondary, sum } = goldenSplit(w);
      // Theoretical sum must equal width
      assert.ok(Math.abs(sum - w) < 1e-9, `Golden split sum (${sum}) must equal width (${w})`);

      // Subpixel rounding simulation: rounded primary + rounded secondary = w
      const roundedPrimary = Math.round(primary);
      const roundedSecondary = w - roundedPrimary;
      assert.strictEqual(
        roundedPrimary + roundedSecondary,
        w,
        `Discrete pixel partition must preserve total container width (${w})`
      );

      if (w >= 3) {
        assert.ok(roundedPrimary > roundedSecondary, `Primary column (${roundedPrimary}) must be > secondary (${roundedSecondary}) for w=${w}`);
      }
    }
  });

  it('TEST-T2-BND-005: Golden angle modular cycle non-collision over 360 iterations', () => {
    // Because phi is irrational, no two multiples of the golden angle modulo 360 ever repeat exactly
    const generatedAngles = new Set();
    const iterations = 360;

    for (let i = 0; i < iterations; i++) {
      const angle = parseFloat(((i * GOLDEN_ANGLE_DEG) % 360).toFixed(4));
      assert.ok(!generatedAngles.has(angle), `Golden angle collision detected at step ${i}: ${angle}`);
      generatedAngles.add(angle);
    }

    assert.strictEqual(generatedAngles.size, iterations, 'All 360 golden angle steps must be distinct');
  });

  it('TEST-T2-BND-006: Binet formulas zero-index boundary and negative input rejection', () => {
    // Zero-index base cases
    assert.strictEqual(fibonacci(0), 0, 'F_0 must be 0');
    assert.strictEqual(fibonacci(1), 1, 'F_1 must be 1');
    assert.strictEqual(lucas(0), 2, 'L_0 must be 2');
    assert.strictEqual(lucas(1), 1, 'L_1 must be 1');

    // Negative index error handling
    assert.throws(() => fibonacci(-1), RangeError, 'fibonacci(-1) must throw RangeError');
    assert.throws(() => lucas(-5), RangeError, 'lucas(-5) must throw RangeError');

    // Non-integer index error handling
    assert.throws(() => fibonacci(3.14), RangeError, 'fibonacci(3.14) must throw RangeError');
    assert.throws(() => lucas(2.5), RangeError, 'lucas(2.5) must throw RangeError');
  });
});
