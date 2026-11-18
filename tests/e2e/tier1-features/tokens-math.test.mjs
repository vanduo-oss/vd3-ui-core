/**
 * @file tokens-math.test.mjs
 * Tier 1 Feature Tests: Mathematical Token Scales and Ground-Truth Invariants.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PHI,
  INV_PHI,
  INV_PHI_SQ,
  SQRT_PHI,
  GOLDEN_ANGLE_DEG,
  fibonacci,
  lucas,
  approxEqual,
  loadTokens
} from '../helpers/math-oracle.mjs';

describe('Tier 1: Mathematical Foundations & Design Tokens', () => {
  const tokens = loadTokens();

  it('TEST-T1-MTH-001: Golden Ratio phi and closed-form irrational constants match oracle', () => {
    // 1. Audit tokens.math group in tokens/vd3.tokens.json (Axiom PRN-001 Class A DNA)
    assert.ok(tokens.math, 'tokens.math group must exist in vd3.tokens.json');

    const requiredMathTokens = ['phi', 'inv-phi', 'inv-phi-sq', 'sqrt-phi', 'golden-angle'];
    for (const key of requiredMathTokens) {
      assert.ok(tokens.math[key], `tokens.math.${key} token definition must exist`);
      assert.strictEqual(
        typeof tokens.math[key].$value,
        'number',
        `tokens.math.${key}.$value must be a numeric literal`
      );
    }

    // 2. Numerical precision and fidelity: >= 6 decimal places verified against oracle
    assert.ok(
      approxEqual(tokens.math.phi.$value, PHI, 1e-6),
      `tokens.math.phi (${tokens.math.phi.$value}) must match oracle PHI (${PHI}) within 1e-6 precision`
    );
    assert.ok(
      approxEqual(tokens.math['inv-phi'].$value, INV_PHI, 1e-6),
      `tokens.math['inv-phi'] (${tokens.math['inv-phi'].$value}) must match oracle INV_PHI within 1e-6 precision`
    );
    assert.ok(
      approxEqual(tokens.math['inv-phi-sq'].$value, INV_PHI_SQ, 1e-6),
      `tokens.math['inv-phi-sq'] (${tokens.math['inv-phi-sq'].$value}) must match oracle INV_PHI_SQ within 1e-6 precision`
    );
    assert.ok(
      approxEqual(tokens.math['sqrt-phi'].$value, SQRT_PHI, 1e-6),
      `tokens.math['sqrt-phi'] (${tokens.math['sqrt-phi'].$value}) must match oracle SQRT_PHI within 1e-6 precision`
    );
    assert.ok(
      approxEqual(tokens.math['golden-angle'].$value, GOLDEN_ANGLE_DEG, 1e-4),
      `tokens.math['golden-angle'] (${tokens.math['golden-angle'].$value}) must match oracle GOLDEN_ANGLE_DEG within 1e-4 precision`
    );

    // 3. Precision decimal count guard: prevent truncations (e.g. 1.61803 with 5 decimals fails)
    for (const key of requiredMathTokens) {
      const valStr = String(tokens.math[key].$value);
      const decimals = valStr.includes('.') ? valStr.split('.')[1].length : 0;
      assert.ok(
        decimals >= 6,
        `tokens.math.${key}.$value must provide at least 6 decimal places of precision, got ${decimals} ("${valStr}")`
      );
    }

    // 4. Closed-form irrational identity properties
    // Reciprocal identity: 1/phi === phi - 1
    assert.ok(approxEqual(INV_PHI, PHI - 1, 1e-9), '1/phi === phi - 1');
    assert.ok(approxEqual(INV_PHI, 0.6180339887, 1e-6), '1/phi matches 0.6180339887');

    // Square reciprocal identity: 1/phi^2 === 2 - phi === 1 - 1/phi
    assert.ok(approxEqual(INV_PHI_SQ, 2 - PHI, 1e-9), '1/phi^2 === 2 - phi');
    assert.ok(approxEqual(INV_PHI + INV_PHI_SQ, 1.0, 1e-9), '1/phi + 1/phi^2 === 1');
    assert.ok(approxEqual(INV_PHI_SQ, 0.3819660113, 1e-6), '1/phi^2 matches 0.3819660113');

    // Double reciprocal: 2/phi (used in tight line-height)
    const tightLeading = 2 / PHI;
    assert.ok(approxEqual(tightLeading, 1.2360679775, 1e-6), '2/phi matches 1.2360679775');

    // Snug line-height: 1 + 1/phi^2
    const snugLeading = 1 + INV_PHI_SQ;
    assert.ok(approxEqual(snugLeading, 1.3819660113, 1e-6), '1 + 1/phi^2 matches 1.3819660113');

    // Square root of phi: modular typography scale step multiplier
    assert.ok(approxEqual(SQRT_PHI, 1.2720196495, 1e-6), 'sqrt(phi) matches 1.2720196495');
    assert.ok(approxEqual(Math.pow(SQRT_PHI, 2), PHI, 1e-9), 'sqrt(phi)^2 === phi');

    // Golden angle: 360 * (1 - 1/phi)
    assert.ok(approxEqual(GOLDEN_ANGLE_DEG, 137.507764, 1e-4), 'golden angle matches 137.508 deg');
  });

  it('TEST-T1-MTH-002: Fibonacci & Lucas Binet formulas generate lawful container widths', () => {
    // Audited Fibonacci sequence: F_0..F_17
    const expectedFib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];
    expectedFib.forEach((val, idx) => {
      assert.strictEqual(fibonacci(idx), val, `Fibonacci F_${idx} must be ${val}`);
    });

    // Audited Lucas sequence: L_0..L_16
    const expectedLucas = [2, 1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521, 843, 1364, 2207];
    expectedLucas.forEach((val, idx) => {
      assert.strictEqual(lucas(idx), val, `Lucas L_${idx} must be ${val}`);
    });

    // Container thresholds in DTCG tokens
    const containers = tokens.container;
    assert.strictEqual(containers.sm.$value, '521px', 'container.sm must be 521px (Lucas L13)');
    assert.strictEqual(containers.md.$value, '610px', 'container.md must be 610px (Fibonacci F15)');
    assert.strictEqual(containers.lg.$value, '987px', 'container.lg must be 987px (Fibonacci F16)');
    assert.strictEqual(containers.xl.$value, '1364px', 'container.xl must be 1364px (Lucas L15/16)');
    assert.strictEqual(containers['2xl'].$value, '1597px', 'container.2xl must be 1597px (Fibonacci F17)');
  });

  it('TEST-T1-MTH-003: DTCG normative spacing scale enforces C-01 exception and rem calculations', () => {
    assert.ok(tokens.space, 'Tokens space group must exist');

    const expectedSpacing = {
      'fib-1': { rem: '0.125rem', px: 2, basis: 'C-01' },
      'fib-2': { rem: '0.25rem', px: 4, basis: 'C-01' },
      'fib-3': { rem: '0.375rem', px: 6, basis: 'C-01' },
      'fib-5': { rem: '0.5rem', px: 8, basis: 'C-01' },
      'fib-8': { rem: '0.75rem', px: 12, basis: 'C-01' },
      'fib-13': { rem: '0.8125rem', px: 13, basis: 'A' },
      'fib-21': { rem: '1.3125rem', px: 21, basis: 'A' },
      'fib-34': { rem: '2.125rem', px: 34, basis: 'A' },
      'fib-55': { rem: '3.4375rem', px: 55, basis: 'A' }
    };

    for (const [key, exp] of Object.entries(expectedSpacing)) {
      const token = tokens.space[key];
      assert.ok(token, `Token space.${key} must exist`);
      assert.strictEqual(token.$value, exp.rem, `space.${key} rem value`);
      const px = Math.round(parseFloat(token.$value) * 16);
      assert.strictEqual(px, exp.px, `space.${key} converted px on 16px root`);
      if (exp.basis === 'C-01') {
        assert.ok(
          token.$description?.includes('C-01') || token.$description?.includes('rounded') || token.$description?.includes('exception'),
          `space.${key} must document C-01 exception in description`
        );
      }
    }
  });

  it('TEST-T1-MTH-004: Line weights sequence strictly follows Fibonacci numbers', () => {
    assert.ok(tokens.line, 'Tokens line group must exist');
    assert.strictEqual(tokens.line.hair.$value, '1px', 'line.hair must be 1px (F1/F2)');
    assert.strictEqual(tokens.line.thin.$value, '2px', 'line.thin must be 2px (F3)');
    assert.strictEqual(tokens.line.regular.$value, '3px', 'line.regular must be 3px (F4)');
    assert.strictEqual(tokens.line.thick.$value, '5px', 'line.thick must be 5px (F5)');
  });

  it('TEST-T1-MTH-005: Modular typography scale and phi-derived line-height constants', () => {
    assert.ok(tokens.type, 'Tokens type group must exist');
    const leading = tokens.type.leading;

    // Line heights: tight, snug, normal, relaxed
    assert.strictEqual(leading.tight.$value, 1.236, 'type.leading.tight must be 1.236 (2/phi)');
    assert.strictEqual(leading.snug.$value, 1.382, 'type.leading.snug must be 1.382 (1 + 1/phi^2)');
    assert.strictEqual(leading.normal.$value, 1.5, 'type.leading.normal must be 1.5');
    assert.strictEqual(leading.relaxed.$value, 1.618, 'type.leading.relaxed must be 1.618 (phi)');

    // Font size steps: base is 1rem (16px), 5xl clamps to max 4.25rem = 68px = 16 * phi^3
    const sizes = tokens.type.size;
    assert.strictEqual(sizes.base.$value, '1rem', 'type.size.base must be 1rem');
    assert.ok(
      sizes['5xl'].$value.includes('4.25rem'),
      'type.size.5xl max bound must be 4.25rem (68px = 16 * phi^3)'
    );
  });

  it('TEST-T1-MTH-006: Consecutive Fibonacci elevation shadow pairs (y, blur)', () => {
    assert.ok(tokens.shadow, 'Tokens shadow group must exist');

    const expectedPairs = [
      { level: '1', y: 1, blur: 2 },
      { level: '2', y: 2, blur: 3 },
      { level: '3', y: 3, blur: 5 },
      { level: '4', y: 8, blur: 13 },
      { level: '5', y: 13, blur: 21 },
      { level: '6', y: 21, blur: 34 }
    ];

    for (const exp of expectedPairs) {
      const token = tokens.shadow[exp.level];
      assert.ok(token, `Shadow level ${exp.level} must exist`);
      const val = token.$value;
      const pattern = new RegExp(`0\\s+${exp.y}px\\s+${exp.blur}px`);
      assert.ok(
        pattern.test(val),
        `Shadow level ${exp.level} must contain consecutive Fibonacci pair (${exp.y}px, ${exp.blur}px). Got: "${val}"`
      );
    }
  });

  it('TEST-T1-MTH-007: Fibonacci motion duration ladder and golden cubic-bezier curves', () => {
    assert.ok(tokens.motion, 'Tokens motion group must exist');
    assert.ok(tokens.easing, 'Tokens easing group must exist');

    const expectedDurations = {
      '0': '0ms',
      '55': '55ms',
      '89': '89ms',
      '144': '144ms',
      '233': '233ms',
      '377': '377ms',
      '610': '610ms',
      '987': '987ms'
    };

    for (const [k, expected] of Object.entries(expectedDurations)) {
      assert.strictEqual(tokens.motion[k].$value, expected, `motion.${k} duration`);
    }

    // Golden cubic-bezier control points
    assert.deepStrictEqual(tokens.easing.out.$value, [0.236, 1, 0.382, 1], 'easing.out control points');
    assert.deepStrictEqual(tokens.easing.in.$value, [0.618, 0, 0.764, 0], 'easing.in control points');
    assert.deepStrictEqual(tokens.easing['in-out'].$value, [0.618, 0, 0.382, 1], 'easing.in-out control points');
    assert.deepStrictEqual(tokens.easing.linear.$value, [0, 0, 1, 1], 'easing.linear control points');
  });

  it('TEST-T1-MTH-008: Golden angle palette generates unique non-repeating hue distribution', () => {
    // Golden angle step: ~137.508 deg
    const hues = Array.from({ length: 10 }, (_, i) => {
      const angle = (i * GOLDEN_ANGLE_DEG) % 360;
      return parseFloat(angle.toFixed(1));
    });

    const uniqueHues = new Set(hues);
    assert.strictEqual(uniqueHues.size, 10, 'All 10 golden angle swatches must produce unique hues');

    // Quadrant distribution: ensures colors span the whole color wheel
    const q1 = hues.some(h => h >= 0 && h < 90);
    const q2 = hues.some(h => h >= 90 && h < 180);
    const q3 = hues.some(h => h >= 180 && h < 270);
    const q4 = hues.some(h => h >= 270 && h < 360);

    assert.ok(q1 && q2 && q3 && q4, 'Golden angle hues must span all 4 quadrants of the 360-degree color wheel');
  });
});
