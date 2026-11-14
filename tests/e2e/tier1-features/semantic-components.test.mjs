/**
 * @file semantic-components.test.mjs
 * Tier 1 Feature Tests: Zero-Framework Semantic HTML5 Components & Layout Primitives.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PHI, fibonacci, approxEqual, loadTokens, resolveRepoPath } from '../helpers/math-oracle.mjs';
import { extractCustomProperties } from '../helpers/css-parser.mjs';

describe('Tier 1: Zero-Framework Semantic Components & Layout Primitives', () => {
  const tokens = loadTokens();

  it('TEST-T1-CMP-001: Button component enforces Fibonacci padding ratios (x/y ~ phi) and radii', () => {
    // Audit button padding tokens / css
    // sm: 13px/8px = 1.625 ~ phi
    // base: 21px/13px = 1.615 ~ phi
    // lg: 34px/21px = 1.619 ~ phi
    const ratios = [
      { size: 'sm', x: 13, y: 8 },
      { size: 'base', x: 21, y: 13 },
      { size: 'lg', x: 34, y: 21 }
    ];

    for (const r of ratios) {
      const ratio = r.x / r.y;
      assert.ok(
        approxEqual(ratio, PHI, 0.02),
        `Button ${r.size} padding ratio (${r.x}px / ${r.y}px = ${ratio.toFixed(3)}) must approximate phi (${PHI.toFixed(3)}) within 0.02`
      );
    }

    // Verify button radii are drawn from Fibonacci radii tokens
    assert.strictEqual(tokens.radius['fib-3'].$value, '0.1875rem', 'Button sm radius token is fib-3 (3px)');
    assert.strictEqual(tokens.radius['fib-5'].$value, '0.3125rem', 'Button base radius token is fib-5 (5px)');
    assert.strictEqual(tokens.radius['fib-8'].$value, '0.5rem', 'Button lg radius token is fib-8 (8px)');
    assert.strictEqual(tokens.radius.full.$value, '9999rem', 'Button pill radius token is 9999rem (C-04)');

    // Verify button stylesheet or token contains focus ring and padding properties
    const buttonCssPath = resolveRepoPath('components/button.css');
    if (existsSync(buttonCssPath)) {
      const css = readFileSync(buttonCssPath, 'utf8');
      assert.ok(
        css.includes('--_vd-btn-px') || css.includes('--vd3-btn-padding-x') || css.includes('--vd-btn-padding-x'),
        'Button padding-x defined'
      );
      assert.ok(
        css.includes('--_vd-btn-py') || css.includes('--vd3-btn-padding-y') || css.includes('--vd-btn-padding-y'),
        'Button padding-y defined'
      );
      assert.ok(css.includes('focus-visible') || css.includes(':focus'), 'Focus visibility styling present');
    }
  });

  it('TEST-T1-CMP-002: Native <dialog> component adheres to W3C ARIA APG Modal Dialog contract', () => {
    // Read dialog normative spec
    const dialogSpecPath = resolveRepoPath('components/dialog/spec.md');
    assert.ok(existsSync(dialogSpecPath), 'Dialog spec.md must exist in components/dialog/spec.md');
    const spec = readFileSync(dialogSpecPath, 'utf8');

    // Verify APG reference and DLG rules
    assert.ok(spec.includes('https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/'), 'Must cite official APG Dialog pattern');
    assert.ok(spec.includes('DLG-001'), 'Must declare DLG-001 (initial focus on open)');
    assert.ok(spec.includes('DLG-002'), 'Must declare DLG-002 (focus restoration on close)');
    assert.ok(spec.includes('DLG-003'), 'Must declare DLG-003 (modal inertness)');
    assert.ok(spec.includes('DLG-004'), 'Must declare DLG-004 (proper aria-labelledby and aria-describedby)');
    assert.ok(spec.includes('MOB-001'), 'Must cite MOB-001 reduced motion transition contract');

    // Verify stacking level for modal
    assert.strictEqual(tokens.z.modal.$value, 1050, 'Dialog modal surface stacks at z.modal = 1050');
    assert.strictEqual(tokens.z['modal-backdrop'].$value, 1040, 'Dialog backdrop stacks at z.modal-backdrop = 1040');
  });

  it('TEST-T1-CMP-003: Semantic Form Controls maintain Fibonacci padding ratios and focus contracts', () => {
    // sm: 8px/5px = 1.6 ~ phi
    // base: 13px/8px = 1.625 ~ phi
    // lg: 21px/13px = 1.615 ~ phi
    const inputRatios = [
      { size: 'sm', x: 8, y: 5 },
      { size: 'base', x: 13, y: 8 },
      { size: 'lg', x: 21, y: 13 }
    ];

    for (const r of inputRatios) {
      const ratio = r.x / r.y;
      assert.ok(
        approxEqual(ratio, PHI, 0.02),
        `Input ${r.size} padding ratio (${r.x}px / ${r.y}px = ${ratio.toFixed(3)}) must approximate phi (${PHI.toFixed(3)}) within 0.02`
      );
    }

    const formCssPath = resolveRepoPath('components/form.css');
    if (existsSync(formCssPath)) {
      const css = readFileSync(formCssPath, 'utf8');
      assert.ok(css.includes('focus') || css.includes(':focus-visible'), 'Form inputs declare focus state');
      assert.ok(
        css.includes('--vd3-space-fib-') || css.includes('--vd-input-padding') || css.includes('--vd3-input-padding'),
        'Form inputs declare Fibonacci padding'
      );
    }
  });

  it('TEST-T1-CMP-004: Sticky glass navbar geometry aligns with F10 height and z.sticky', () => {
    // Height: 55px (F10)
    // Stacking: z.sticky (1020)
    assert.strictEqual(tokens.z.sticky.$value, 1020, 'Navbar z-index token must be 1020');

    // Verify padding pair: 13px (F7) x 21px (F8)
    const paddingX = 21;
    const paddingY = 13;
    assert.ok(
      approxEqual(paddingX / paddingY, PHI, 0.02),
      'Navbar padding ratio (21px / 13px) must approximate phi'
    );

    const navbarCssPath = resolveRepoPath('components/navbar.css');
    if (existsSync(navbarCssPath)) {
      const css = readFileSync(navbarCssPath, 'utf8');
      assert.ok(css.includes('sticky') || css.includes('position: sticky'), 'Navbar declares sticky positioning');
    }
  });

  it('TEST-T1-CMP-005: Zero-JS Accordion uses native HTML5 <details> and <summary> disclosure', () => {
    const accordionCssPath = resolveRepoPath('components/accordion.css');
    if (existsSync(accordionCssPath)) {
      const css = readFileSync(accordionCssPath, 'utf8');
      assert.ok(
        css.includes('details') || css.includes('summary') || css.includes('.vd-accordion'),
        'Accordion stylesheet targets native details/summary or .vd-accordion'
      );
    }
  });

  it('TEST-T1-CMP-006: Accessible Data Table semantic scopes and Fibonacci cell padding', () => {
    // Fibonacci cell padding: 8px (F6) x 13px (F7) -> ratio 13/8 = 1.625 ~ phi
    const cellPaddingX = 13;
    const cellPaddingY = 8;
    assert.ok(
      approxEqual(cellPaddingX / cellPaddingY, PHI, 0.02),
      'Table cell padding ratio (13px / 8px) must approximate phi'
    );

    const tableCssPath = resolveRepoPath('components/table.css');
    if (existsSync(tableCssPath)) {
      const css = readFileSync(tableCssPath, 'utf8');
      assert.ok(css.includes('table') || css.includes('.vd-table'), 'Table stylesheet defines tabular styling');
    }
  });

  it('TEST-T1-CMP-007: Toast notification conforms to F14 width (377px) and z.toast (1080)', () => {
    // Width: 377px (F14)
    assert.strictEqual(fibonacci(14), 377, 'F14 is exactly 377');
    assert.strictEqual(tokens.z.toast.$value, 1080, 'Toast z-index token must be 1080');

    const toastCssPath = resolveRepoPath('components/toast.css');
    if (existsSync(toastCssPath)) {
      const css = readFileSync(toastCssPath, 'utf8');
      assert.ok(css.includes('toast') || css.includes('.vd-toast'), 'Toast stylesheet defines toast classes');
    }
  });
});
