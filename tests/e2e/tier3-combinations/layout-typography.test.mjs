/**
 * @file layout-typography.test.mjs
 * Tier 3 Combination Tests: Golden Ratio Layout Splits + Modular Typography Scales.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import {
  PHI,
  INV_PHI,
  INV_PHI_SQ,
  SQRT_PHI,
  goldenSplit,
  sqrtPhiTypeScale,
  approxEqual,
  loadTokens,
  resolveRepoPath
} from '../helpers/math-oracle.mjs';

describe('Tier 3: Golden Ratio Layout Split + Modular Typography Integration', () => {
  const tokens = loadTokens();

  it('TEST-T3-CMB-001: Golden ratio split proportions (61.8% / 38.2%) combined with modular typography', () => {
    // 1. Validate mathematical proportions of the two-column split
    const containerWidth = 987; // Standard F16 container width
    const { primary, secondary, sum } = goldenSplit(containerWidth);

    assert.ok(approxEqual(primary, 610, 1.0), `Primary major column of 987px must be ~610px (F15). Got ${primary.toFixed(1)}`);
    assert.ok(approxEqual(secondary, 377, 1.0), `Secondary minor column of 987px must be ~377px (F14). Got ${secondary.toFixed(1)}`);
    assert.ok(approxEqual(sum, containerWidth, 1e-6), 'Partition sum equals container width');

    // 2. Validate width ratios
    const colRatio = primary / secondary;
    assert.ok(
      approxEqual(colRatio, PHI, 1e-4),
      `Major/Minor width ratio (${colRatio.toFixed(4)}) must equal phi (${PHI.toFixed(4)})`
    );

    // 3. Inspect grid stylesheet rules for golden ratio classes
    const gridCssPath = resolveRepoPath('components/layout.css');
    if (existsSync(gridCssPath)) {
      const css = readFileSync(gridCssPath, 'utf8');
      assert.ok(
        css.includes('61.803399%') || css.includes('61.8%') || css.includes('1.618fr') || css.includes('golden'),
        'Grid stylesheet defines golden split column tracks'
      );
      assert.ok(
        css.includes('38.196601%') || css.includes('38.2%') || css.includes('1fr') || css.includes('golden'),
        'Grid stylesheet defines minor golden split column tracks'
      );
    }
  });

  it('TEST-T3-CMB-002: Modular sqrt(phi) scale doubling power and line-height pairing', () => {
    const baseFontSizePx = 16; // 1rem

    // Typography steps scaling by sqrt(phi) ≈ 1.27202:
    // Step 0: 16px (base)
    // Step 1: 16 * 1.272 = 20.35px
    // Step 2: 16 * 1.272^2 = 16 * phi = 25.89px ≈ 26px (md/lg)
    // Step 4: 16 * phi^2 = 41.89px ≈ 42px (2xl/3xl)
    // Step 6: 16 * phi^3 = 67.78px ≈ 68px = 4.25rem (5xl/6xl)
    const step0 = sqrtPhiTypeScale(baseFontSizePx, 0);
    const step2 = sqrtPhiTypeScale(baseFontSizePx, 2);
    const step4 = sqrtPhiTypeScale(baseFontSizePx, 4);
    const step6 = sqrtPhiTypeScale(baseFontSizePx, 6);

    assert.strictEqual(step0, 16, 'Step 0 is 16px (1rem)');
    assert.ok(approxEqual(step2, 16 * PHI, 1e-4), 'Step 2 doubles power by factor of phi');
    assert.ok(approxEqual(step4, 16 * Math.pow(PHI, 2), 1e-4), 'Step 4 scales by phi^2');
    assert.ok(approxEqual(step6, 16 * Math.pow(PHI, 3), 1e-4), 'Step 6 scales by phi^3 (~68px / 4.25rem)');

    // Line height pairing:
    // Large display text (Step 6 / 5xl) uses tight line-height 1.236 (2/phi)
    // Body reading text (Step 0 / base) uses relaxed line-height 1.618 (phi)
    const tightLeading = tokens.type.leading.tight.$value;
    const relaxedLeading = tokens.type.leading.relaxed.$value;

    assert.strictEqual(tightLeading, 1.236, 'Display text uses tight leading 1.236 (2/phi)');
    assert.strictEqual(relaxedLeading, 1.618, 'Body text uses relaxed leading 1.618 (phi)');

    // Product of tight and relaxed leading
    assert.ok(
      approxEqual(tightLeading * relaxedLeading, 2.0, 0.001),
      'Leading product (2/phi * phi) equals 2.0 exactly'
    );
  });
});
