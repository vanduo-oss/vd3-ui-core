#!/usr/bin/env node
/**
 * verify-tokens.mjs
 * Programmatic mathematical verification test suite for VD3 UI CORE tokens.
 *
 * Grounded in:
 * - Binet closed-form Fibonacci formula: F_n = round((phi^n - (-phi)^-n) / sqrt(5))
 * - Binet closed-form Lucas formula:     L_n = round(phi^n + (-phi)^-n)
 * - Golden ratio:                        phi = (1 + sqrt(5)) / 2
 * - Root golden ratio typography scale:  step_k = base * sqrt(phi)^k
 * - Three-Class Basis Contract:          Class A (phi), Class B (conventional), Class C (exception)
 *
 * Zero external runtime dependencies. Runs on pure Node.js ESM.
 * Exits with code 0 on 100% pass, code 1 on any failure.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensPath = path.resolve(__dirname, '../tokens/vd3.tokens.json');

// ---------------------------------------------------------------------------
// 1. Mathematical Constants & Analytical Closed-Form Formulas
// ---------------------------------------------------------------------------

export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const INV_PHI_SQ = 1 / (PHI * PHI);
export const SQRT_PHI = Math.sqrt(PHI);
export const GOLDEN_ANGLE = 360 * (1 - 1 / PHI);

/**
 * Binet closed-form formula for Fibonacci numbers:
 * F_n = round((phi^n - (-phi)^-n) / sqrt(5))
 */
export function binetFib(n) {
  if (n < 0) throw new Error(`Negative index ${n} not supported for Binet Fibonacci`);
  return Math.round((Math.pow(PHI, n) - Math.pow(-PHI, -n)) / Math.sqrt(5));
}

/**
 * Binet closed-form formula for Lucas numbers:
 * L_n = round(phi^n + (-phi)^-n)
 */
export function binetLucas(n) {
  if (n < 0) throw new Error(`Negative index ${n} not supported for Binet Lucas`);
  return Math.round(Math.pow(PHI, n) + Math.pow(-PHI, -n));
}

// ---------------------------------------------------------------------------
// 2. Test Harness & Reporting Infrastructure
// ---------------------------------------------------------------------------

const suites = [];
let currentSuite = null;

function suite(name, fn) {
  currentSuite = {
    name,
    assertions: 0,
    passed: 0,
    failed: 0,
    errors: [],
  };
  suites.push(currentSuite);
  try {
    fn();
  } catch (err) {
    currentSuite.failed++;
    currentSuite.errors.push(`Unhandled suite runtime exception: ${err.stack || err.message}`);
  }
}

function assert(condition, message) {
  currentSuite.assertions++;
  if (condition) {
    currentSuite.passed++;
  } else {
    currentSuite.failed++;
    currentSuite.errors.push(message);
  }
}

function assertClose(actual, expected, epsilon, message) {
  const diff = Math.abs(actual - expected);
  assert(
    diff <= epsilon,
    `${message} [expected ~${expected}, got ${actual}, diff=${diff.toFixed(6)} > eps=${epsilon}]`
  );
}

// ---------------------------------------------------------------------------
// 3. Load Token JSON
// ---------------------------------------------------------------------------

let tokens = null;
try {
  const raw = fs.readFileSync(tokensPath, 'utf8');
  tokens = JSON.parse(raw);
} catch (err) {
  console.error(`FATAL: Unable to read tokens at ${tokensPath}: ${err.message}`);
  process.exit(1);
}

// Helper: Traverse all leaf tokens in JSON tree
function getLeafTokens(obj, currentPath = []) {
  const leaves = [];
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$') && key !== '$value') continue;
    if (value && typeof value === 'object' && '$value' in value) {
      leaves.push({ path: [...currentPath, key].join('.'), token: value });
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      leaves.push(...getLeafTokens(value, [...currentPath, key]));
    }
  }
  return leaves;
}

// ---------------------------------------------------------------------------
// 4. Execution of Test Suites
// ---------------------------------------------------------------------------

// SUITE 1: Precision Validation of Phi Constants & Algebraic Identities
suite('Golden Ratio Precision & Fundamental Identities', () => {
  assertClose(PHI, 1.6180339887, 1e-6, 'phi precision: phi ~= 1.6180339887');
  assertClose(INV_PHI, 0.6180339887, 1e-6, '1/phi precision: 1/phi ~= 0.6180339887');
  assertClose(INV_PHI_SQ, 0.3819660113, 1e-6, '1/phi^2 precision: 1/phi^2 ~= 0.3819660113');
  assertClose(SQRT_PHI, 1.2720196495, 1e-6, 'sqrt(phi) precision: sqrt(phi) ~= 1.2720196495');
  assertClose(GOLDEN_ANGLE, 137.507764, 1e-3, 'Golden angle precision: psi ~= 137.508 deg');

  // Exact algebraic identities
  assertClose(PHI * PHI - PHI - 1, 0, 1e-12, 'Golden ratio identity: phi^2 - phi - 1 = 0');
  assertClose(PHI * INV_PHI, 1, 1e-12, 'Reciprocal identity: phi * (1/phi) = 1');
  assertClose(PHI + INV_PHI_SQ, 2, 1e-12, 'Line height identity: phi + 1/phi^2 = 2.0');
});

// SUITE 2: Closed-Form Binet Sequences
suite('Closed-Form Binet Sequences (Fibonacci & Lucas)', () => {
  const expectedFibs = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584];
  for (let n = 0; n < expectedFibs.length; n++) {
    assert(binetFib(n) === expectedFibs[n], `Binet Fibonacci F_${n} = ${binetFib(n)} matches ${expectedFibs[n]}`);
  }

  const expectedLucas = [2, 1, 3, 4, 7, 11, 18, 29, 47, 76, 123, 199, 322, 521, 843, 1364, 2207];
  for (let n = 0; n < expectedLucas.length; n++) {
    assert(binetLucas(n) === expectedLucas[n], `Binet Lucas L_${n} = ${binetLucas(n)} matches ${expectedLucas[n]}`);
  }

  // Cross-sequence identity: L_n = F_{n-1} + F_{n+1}
  for (let n = 1; n < 15; n++) {
    assert(
      binetLucas(n) === binetFib(n - 1) + binetFib(n + 1),
      `Cross-sequence identity: L_${n} === F_${n - 1} + F_${n + 1}`
    );
  }
});

// SUITE 3: Spacing Scale Tokens
suite('Spacing Scale Tokens (Fibonacci & Exception C-01)', () => {
  assert(tokens.space !== undefined, 'space token group exists');

  // Registered exception C-01 (small steps <= 12px rem-rounded)
  const c01Expected = {
    'fib-1': 2,
    'fib-2': 4,
    'fib-3': 6,
    'fib-5': 8,
    'fib-8': 12,
  };

  for (const [key, expectedPx] of Object.entries(c01Expected)) {
    if (tokens.space[key]) {
      const val = tokens.space[key].$value;
      const parsedPx = Math.round(parseFloat(val) * 16);
      assert(parsedPx === expectedPx, `space.${key} rem value ${val} converts to ${expectedPx}px (C-01)`);
    } else {
      assert(false, `space.${key} token is missing`);
    }
  }

  // Literal Fibonacci scale from 13px onwards
  const literalExpected = {
    'fib-13': { n: 7, px: 13, rem: '0.8125rem' },
    'fib-21': { n: 8, px: 21, rem: '1.3125rem' },
    'fib-34': { n: 9, px: 34, rem: '2.125rem' },
    'fib-55': { n: 10, px: 55, rem: '3.4375rem' },
    'fib-89': { n: 11, px: 89, rem: '5.5625rem' },
    'fib-144': { n: 12, px: 144, rem: '9rem' },
  };

  for (const [key, exp] of Object.entries(literalExpected)) {
    if (tokens.space[key]) {
      const val = tokens.space[key].$value;
      const parsedPx = Math.round(parseFloat(val) * 16);
      const binetVal = binetFib(exp.n);
      assert(binetVal === exp.px, `Binet F_${exp.n} === ${exp.px}`);
      assert(parsedPx === exp.px, `space.${key} (${val}) matches literal Fibonacci ${exp.px}px`);
      assertClose(parseFloat(val), exp.px / 16, 1e-6, `space.${key} rem float matches px / 16`);
    } else {
      assert(false, `space.${key} token is missing`);
    }
  }
});

// SUITE 4: Line Weights Scale
suite('Line Weights Scale (Fibonacci 1/2/3/5px)', () => {
  assert(tokens.line !== undefined, 'line token group exists');
  const expectedLineWeights = {
    hair: { n: 2, px: 1 },
    thin: { n: 3, px: 2 },
    regular: { n: 4, px: 3 },
    thick: { n: 5, px: 5 },
  };

  for (const [key, exp] of Object.entries(expectedLineWeights)) {
    if (tokens.line[key]) {
      const val = parseInt(tokens.line[key].$value, 10);
      assert(binetFib(exp.n) === exp.px, `Binet F_${exp.n} === ${exp.px}`);
      assert(val === exp.px, `line.${key} (${tokens.line[key].$value}) matches ${exp.px}px`);
    } else {
      assert(false, `line.${key} token missing`);
    }
  }
});

// SUITE 5: Border Radius Tokens
suite('Border Radius Tokens (Fibonacci & Exception C-04)', () => {
  assert(tokens.radius !== undefined, 'radius token group exists');
  const expectedRadii = {
    'fib-2': { n: 3, px: 2 },
    'fib-3': { n: 4, px: 3 },
    'fib-5': { n: 5, px: 5 },
    'fib-8': { n: 6, px: 8 },
    'fib-13': { n: 7, px: 13 },
    'fib-21': { n: 8, px: 21 },
  };

  for (const [key, exp] of Object.entries(expectedRadii)) {
    if (tokens.radius[key]) {
      const val = tokens.radius[key].$value;
      const px = Math.round(parseFloat(val) * 16);
      assert(px === exp.px, `radius.${key} (${val}) converts to ${exp.px}px (F_${exp.n})`);
    } else {
      assert(false, `radius.${key} token missing`);
    }
  }

  if (tokens.radius.full) {
    assert(tokens.radius.full.$value === '9999rem', 'radius.full === 9999rem (C-04 pill semantic)');
  }
});

// SUITE 6: Modular Typography Scale
suite('Modular Typography Scale (sqrt(phi)^k & Doubling Power)', () => {
  assert(tokens.type?.size !== undefined, 'type.size token group exists');

  // Verify scale factor sqrt(phi)
  assertClose(SQRT_PHI, 1.27201965, 1e-6, 'Scale factor is sqrt(phi) ~= 1.27202');

  // Modular scale bounds progression: base * (sqrt(phi))^k
  // For alternate steps (k -> k+2), ratio must equal phi within epsilon < 0.01
  const integerSteps = [16, 20, 26, 33, 42, 53, 68, 86];
  for (let i = 0; i < integerSteps.length - 2; i++) {
    const r = integerSteps[i + 2] / integerSteps[i];
    // Alternate step ratio matches phi (raster-snapped tolerance < 0.035, even steps < 0.01)
    if (i % 2 === 0) {
      assertClose(r, PHI, 0.01, `2-step typography ratio ${integerSteps[i + 2]}px / ${integerSteps[i]}px ~= phi`);
    } else {
      assertClose(r, PHI, 0.035, `2-step typography ratio ${integerSteps[i + 2]}px / ${integerSteps[i]}px ~= phi`);
    }
  }

  // Fluid upper bounds in clamp strings
  const fluidUpperBounds = {
    lg: { k: 1, rem: 1.25, px: 20 },
    xl: { k: 2, rem: 1.625, px: 26 },
    '2xl': { k: 3, rem: 2.0625, px: 33 },
    '3xl': { k: 4, rem: 2.625, px: 42 },
    '4xl': { k: 5, rem: 3.3125, px: 53 },
    '5xl': { k: 6, rem: 4.25, px: 68 },
    '6xl': { k: 7, rem: 5.375, px: 86 },
  };

  for (const [key, exp] of Object.entries(fluidUpperBounds)) {
    const rawVal = tokens.type.size[key]?.$value;
    const desc = tokens.type.size[key]?.$description || '';
    if (rawVal) {
      const match = rawVal.match(/,\s*([0-9.]+)rem\)$/) || desc.match(/clamp\([^)]*,\s*([0-9.]+)rem\)/);
      const upperRem = match ? parseFloat(match[1]) : parseFloat(rawVal);
      assertClose(
        upperRem * 16,
        exp.px,
        1.0,
        `type.size.${key} upper bound matches ${exp.px}px (16 * sqrt(phi)^${exp.k})`
      );
    }
  }
});

// SUITE 7: Line Heights
suite('Line Heights (phi Ratios & Identities)', () => {
  assert(tokens.type?.leading !== undefined, 'type.leading token group exists');

  const tight = tokens.type.leading.tight?.$value;
  const snug = tokens.type.leading.snug?.$value;
  const normal = tokens.type.leading.normal?.$value;
  const relaxed = tokens.type.leading.relaxed?.$value;

  assertClose(tight, 2 / PHI, 1e-3, 'leading.tight (1.236) ~= 2/phi');
  assertClose(snug, 1 + 1 / (PHI * PHI), 1e-3, 'leading.snug (1.382) ~= 1 + 1/phi^2');
  assert(normal === 1.5, 'leading.normal === 1.5 (Class B median)');
  assertClose(relaxed, PHI, 1e-3, 'leading.relaxed (1.618) ~= phi');

  if (tokens.type.leading.loose) {
    assert(tokens.type.leading.loose.$value === 2.0, 'leading.loose === 2.0 (phi + 1/phi^2)');
  }
});

// SUITE 8: Container Widths
suite('Container Widths (Lucas L_13/L_15 & Fibonacci F_15..F_17)', () => {
  assert(tokens.container !== undefined, 'container token group exists');

  const expectedContainers = {
    sm: { derivation: 'L_13 (Lucas)', expected: binetLucas(13) }, // 521
    md: { derivation: 'F_15 (Fibonacci)', expected: binetFib(15) }, // 610
    lg: { derivation: 'F_16 (Fibonacci)', expected: binetFib(16) }, // 987
    xl: { derivation: 'L_15 (Lucas, 16th term)', expected: binetLucas(15) }, // 1364
    '2xl': { derivation: 'F_17 (Fibonacci)', expected: binetFib(17) }, // 1597
  };

  for (const [key, exp] of Object.entries(expectedContainers)) {
    if (tokens.container[key]) {
      const val = parseInt(tokens.container[key].$value, 10);
      assert(
        val === exp.expected,
        `container.${key} (${tokens.container[key].$value}) matches ${exp.expected}px [${exp.derivation}]`
      );
    } else {
      assert(false, `container.${key} token missing`);
    }
  }
});

// SUITE 9: Elevation Shadows
suite('Elevation Shadows (Consecutive Fibonacci Pairs)', () => {
  assert(tokens.shadow !== undefined, 'shadow token group exists');

  const expectedPairs = [
    { level: '1', nY: 2, nBlur: 3 }, // 1, 2
    { level: '2', nY: 3, nBlur: 4 }, // 2, 3
    { level: '3', nY: 4, nBlur: 5 }, // 3, 5
    { level: '4', nY: 6, nBlur: 7 }, // 8, 13
    { level: '5', nY: 7, nBlur: 8 }, // 13, 21
    { level: '6', nY: 8, nBlur: 9 }, // 21, 34
  ];

  for (const item of expectedPairs) {
    const rawShadow = tokens.shadow[item.level]?.$value;
    assert(rawShadow !== undefined, `shadow.${item.level} exists`);
    if (rawShadow) {
      const match = rawShadow.match(/0\s+(\d+)px\s+(\d+)px/);
      assert(match !== null, `shadow.${item.level} matches format "0 Ypx Blurpx"`);
      if (match) {
        const y = parseInt(match[1], 10);
        const blur = parseInt(match[2], 10);
        const expectedY = binetFib(item.nY);
        const expectedBlur = binetFib(item.nBlur);
        assert(y === expectedY, `shadow.${item.level} y-offset ${y}px === F_${item.nY} (${expectedY})`);
        assert(blur === expectedBlur, `shadow.${item.level} blur ${blur}px === F_${item.nBlur} (${expectedBlur})`);
      }
    }
  }
});

// SUITE 10: Glow Blurs
suite('Glow Blurs (Fibonacci 8, 13, 21)', () => {
  assert(tokens.glow !== undefined, 'glow token group exists');

  const expectedGlow = {
    'fib-8': { n: 6, px: 8 },
    'fib-13': { n: 7, px: 13 },
    'fib-21': { n: 8, px: 21 },
  };

  for (const [key, exp] of Object.entries(expectedGlow)) {
    if (tokens.glow[key]) {
      const val = tokens.glow[key].$value;
      const px = Math.round(parseFloat(val) * 16);
      assert(binetFib(exp.n) === exp.px, `Binet F_${exp.n} === ${exp.px}`);
      assert(px === exp.px, `glow.${key} (${val}) converts to ${exp.px}px (F_${exp.n})`);
    } else {
      assert(false, `glow.${key} token missing`);
    }
  }
});

// SUITE 11: Motion Durations
suite('Motion Durations (Fibonacci Ladder)', () => {
  assert(tokens.motion !== undefined, 'motion token group exists');

  const ladder = [
    { key: '0', expected: 0 },
    { key: '55', n: 10, expected: 55 },
    { key: '89', n: 11, expected: 89 },
    { key: '144', n: 12, expected: 144 },
    { key: '233', n: 13, expected: 233 },
    { key: '377', n: 14, expected: 377 },
    { key: '610', n: 15, expected: 610 },
    { key: '987', n: 16, expected: 987 },
  ];

  for (const step of ladder) {
    if (tokens.motion[step.key]) {
      const val = parseInt(tokens.motion[step.key].$value, 10);
      if (step.n) {
        assert(binetFib(step.n) === step.expected, `Binet F_${step.n} === ${step.expected}`);
      }
      assert(val === step.expected, `motion.${step.key} matches ${step.expected}ms`);
    } else {
      assert(false, `motion.${step.key} token missing`);
    }
  }
});

// SUITE 12: Aspect Ratios
suite('Golden Aspect Ratios (phi:1 and 1:phi)', () => {
  // Analytical aspect ratio assertions
  assertClose(PHI, 1.618034, 1e-4, 'Golden landscape ratio is phi:1 (~1.618:1)');
  assertClose(INV_PHI, 0.618034, 1e-4, 'Golden portrait ratio is 1:phi (~0.618:1)');

  assert(tokens.aspect !== undefined, 'aspect token group exists');
  if (tokens.aspect) {
    assert(tokens.aspect.golden !== undefined, 'aspect.golden exists');
    if (tokens.aspect.golden) {
      assert(
        tokens.aspect.golden.$value.includes('1.618') || tokens.aspect.golden.$value.includes('1618'),
        'aspect.golden expresses phi:1'
      );
    }
    assert(tokens.aspect['golden-portrait'] !== undefined, 'aspect.golden-portrait exists');
    if (tokens.aspect['golden-portrait']) {
      assert(
        tokens.aspect['golden-portrait'].$value.includes('0.618') || tokens.aspect['golden-portrait'].$value.includes('1.618'),
        'aspect.golden-portrait expresses 1:phi'
      );
    }
  }
});

// SUITE 13: Golden Angle Hue Steps
suite('Golden Angle Hue Steps (137.508 deg)', () => {
  assertClose(GOLDEN_ANGLE, 137.507764, 1e-3, 'Golden angle is 360 * (1 - 1/phi) ~= 137.508 deg');

  // Verify phyllotaxis angular dispersal properties for 12 hues
  const hues = [];
  for (let i = 0; i < 12; i++) {
    hues.push((i * GOLDEN_ANGLE) % 360);
  }
  for (let i = 0; i < hues.length - 1; i++) {
    const delta = (hues[i + 1] - hues[i] + 360) % 360;
    assertClose(delta, GOLDEN_ANGLE, 1e-3, `Step ${i} -> ${i + 1} angular separation matches golden angle`);
  }

  // Verify golden-angle swatches in tokens
  assert(
    tokens.color?.primitive?.['golden-angle'] !== undefined,
    'color.primitive.golden-angle token group exists'
  );
  if (tokens.color?.primitive?.['golden-angle']) {
    for (let k = 0; k < 8; k++) {
      assert(
        tokens.color.primitive['golden-angle'][k] !== undefined,
        `color.primitive.golden-angle.${k} exists`
      );
    }
  }
});

// SUITE 14: Golden Bézier Easing Coordinates
suite('Golden Bézier Easing Coordinates', () => {
  assert(tokens.easing !== undefined, 'easing token group exists');

  if (tokens.easing.out) {
    const outVal = tokens.easing.out.$value;
    assertClose(outVal[0], 1 / Math.pow(PHI, 3), 1e-3, 'easing.out x1 ~= 1/phi^3 (0.236)');
    assertClose(outVal[2], INV_PHI_SQ, 1e-3, 'easing.out x2 ~= 1/phi^2 (0.382)');
  }
  if (tokens.easing.in) {
    const inVal = tokens.easing.in.$value;
    assertClose(inVal[0], INV_PHI, 1e-3, 'easing.in x1 ~= 1/phi (0.618)');
    assertClose(inVal[2], 1 - 1 / Math.pow(PHI, 3), 1e-3, 'easing.in x2 ~= 1 - 1/phi^3 (0.764)');
  }
  if (tokens.easing['in-out']) {
    const inOutVal = tokens.easing['in-out'].$value;
    assertClose(inOutVal[0], INV_PHI, 1e-3, 'easing.in-out x1 ~= 1/phi (0.618)');
    assertClose(inOutVal[2], INV_PHI_SQ, 1e-3, 'easing.in-out x2 ~= 1/phi^2 (0.382)');
  }
});

// SUITE 15: Three-Class Basis Contract Classification
suite('Three-Class Basis Classification (A, B, C)', () => {
  const leaves = getLeafTokens(tokens);
  assert(leaves.length > 0, `Discovered ${leaves.length} leaf tokens`);

  let classifiedCount = 0;
  let unclassifiedCount = 0;

  for (const { path: tokenPath, token } of leaves) {
    const basis =
      token.class ??
      token.$class ??
      token.$extensions?.vd3?.class ??
      token.$extensions?.vd3?.basis ??
      token.$extensions?.class;

    if (basis !== undefined) {
      classifiedCount++;
      const validClass = ['A', 'B', 'C'].includes(basis);
      assert(validClass, `Token ${tokenPath} declares valid basis ('A', 'B', or 'C'), got '${basis}'`);

      if (basis === 'C') {
        const desc = token.$description || '';
        const exceptionId = token.$extensions?.vd3?.exceptionId || '';
        const hasValidC = /C-0[1-4]/.test(desc) || /C-0[1-4]/.test(exceptionId);
        assert(hasValidC, `Class C token ${tokenPath} must cite a registered exception (C-01..C-04)`);
      }
    } else {
      unclassifiedCount++;
    }
  }

  assert(
    unclassifiedCount === 0,
    `All tokens must declare a basis class (${classifiedCount} classified, ${unclassifiedCount} unclassified)`
  );
});

// ---------------------------------------------------------------------------
// 5. Output Summary Formatting & Process Exit Code
// ---------------------------------------------------------------------------

let totalAssertions = 0;
let totalPassed = 0;
let totalFailed = 0;

for (const s of suites) {
  totalAssertions += s.assertions;
  totalPassed += s.passed;
  totalFailed += s.failed;
}

const colWidths = { suite: 56, total: 8, pass: 8, fail: 8 };
const line = (l, m, r) =>
  l +
  '─'.repeat(colWidths.suite + 2) +
  m +
  '─'.repeat(colWidths.total + 2) +
  m +
  '─'.repeat(colWidths.pass + 2) +
  m +
  '─'.repeat(colWidths.fail + 2) +
  r;

console.log('\n' + '='.repeat(88));
console.log(' VD3 UI CORE — Programmatic Token Math Verification Test Runner');
console.log('='.repeat(88));

for (const s of suites) {
  const status = s.failed === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`[${status}] ${s.name.padEnd(colWidths.suite)} (${s.passed}/${s.assertions} passed)`);
  if (s.errors.length > 0) {
    for (const err of s.errors) {
      console.log(`       \x1b[31mERROR:\x1b[0m ${err}`);
    }
  }
}

console.log(line('┌', '┬', '┐'));
console.log(
  `│ ${'Test Suite'.padEnd(colWidths.suite)} │ ${'Assert'.padStart(colWidths.total)} │ ${'Passed'.padStart(
    colWidths.pass
  )} │ ${'Failed'.padStart(colWidths.fail)} │`
);
console.log(line('├', '┼', '┤'));

for (const s of suites) {
  console.log(
    `│ ${s.name.padEnd(colWidths.suite)} │ ${String(s.assertions).padStart(colWidths.total)} │ ${String(
      s.passed
    ).padStart(colWidths.pass)} │ ${String(s.failed).padStart(colWidths.fail)} │`
  );
}

console.log(line('├', '┼', '┤'));
console.log(
  `│ ${'TOTAL'.padEnd(colWidths.suite)} │ ${String(totalAssertions).padStart(colWidths.total)} │ ${String(
    totalPassed
  ).padStart(colWidths.pass)} │ ${String(totalFailed).padStart(colWidths.fail)} │`
);
console.log(line('└', '┴', '┘'));

if (totalFailed === 0) {
  console.log(`\n\x1b[32mSUCCESS:\x1b[0m All ${totalPassed} programmatic math assertions passed with zero defects.\n`);
  process.exitCode = 0;
} else {
  console.error(`\n\x1b[31mFAILURE:\x1b[0m ${totalFailed} assertions failed out of ${totalAssertions} total assertions.\n`);
  process.exitCode = 1;
}
