/**
 * @file dialog-focus.test.mjs
 * Tier 3 Combination Tests: Native Modal Dialog + Focus Trap + Keyboard Contracts.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolveRepoPath, loadTokens } from '../helpers/math-oracle.mjs';
import { extractElements } from '../helpers/html-parser.mjs';

describe('Tier 3: Native Dialog + Focus Trap + APG Modal Interaction', () => {
  const tokens = loadTokens();

  it('TEST-T3-CMB-003: Native <dialog> modal lifecycle, focus trap cycle and ESC dismissal contracts', () => {
    // 1. Audit normative dialog specification
    const dialogSpecPath = resolveRepoPath('components/dialog/spec.md');
    assert.ok(existsSync(dialogSpecPath), 'components/dialog/spec.md must exist');
    const spec = readFileSync(dialogSpecPath, 'utf8');

    // Verify APG pattern citation and keyboard interaction contracts
    assert.ok(spec.includes('https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/'), 'Must cite official APG Dialog pattern');
    assert.ok(spec.includes('Tab / Shift+Tab'), 'Keyboard table must define Tab and Shift+Tab focus trap cycle');
    assert.ok(spec.includes('Escape'), 'Keyboard table must define Escape dismissal');
    assert.ok(spec.includes('DLG-001'), 'Must declare DLG-001 (initial focus on open)');
    assert.ok(spec.includes('DLG-002'), 'Must declare DLG-002 (focus return to trigger on close)');
    assert.ok(spec.includes('DLG-003'), 'Must declare DLG-003 (modal inertness)');
    assert.ok(spec.includes('DLG-004'), 'Must declare DLG-004 (proper aria-labelledby and aria-describedby)');

    // 2. Audit stacking token hierarchy in tokens.css and vd3.tokens.json
    assert.strictEqual(tokens.z.modal.$value, 1050, 'Dialog surface stacks at z.modal = 1050');
    assert.strictEqual(tokens.z['modal-backdrop'].$value, 1040, 'Backdrop stacks at z.modal-backdrop = 1040');
    assert.ok(
      tokens.z.modal.$value > tokens.z['modal-backdrop'].$value,
      'Dialog surface must stack strictly higher than backdrop'
    );
  });

  it('TEST-T3-CMB-004: Dialog accessibility attribute invariants (DLG-004 & HTML5 DOM structure)', () => {
    // Audit a canonical VD3 dialog DOM structure conforming to spec.md
    const dialogFixture = `
      <button id="btn-trigger" class="vd-btn" aria-haspopup="dialog" aria-controls="modal-delete">Delete</button>
      <dialog id="modal-delete" class="vd-dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc" data-vd-component="dialog">
        <div class="vd-dialog__surface">
          <header class="vd-dialog__header">
            <h2 id="modal-title">Delete Confirmation</h2>
            <button id="btn-close" class="vd-btn" aria-label="Close dialog">×</button>
          </header>
          <div id="modal-desc" class="vd-dialog__body">
            <p>Are you sure you want to delete this resource?</p>
          </div>
          <footer class="vd-dialog__footer">
            <button id="btn-cancel" class="vd-btn">Cancel</button>
            <button id="btn-confirm" class="vd-btn vd-btn--danger">Confirm</button>
          </footer>
        </div>
      </dialog>
    `;

    const dialogs = extractElements(dialogFixture, 'dialog');
    assert.strictEqual(dialogs.length, 1, 'Exactly one dialog element extracted');
    const dlg = dialogs[0];

    assert.strictEqual(dlg.attrs.class, 'vd-dialog', 'Dialog has class="vd-dialog"');
    assert.strictEqual(dlg.attrs['aria-modal'], 'true', 'DLG-004: aria-modal is true');
    assert.strictEqual(dlg.attrs['aria-labelledby'], 'modal-title', 'DLG-004: aria-labelledby references title');
    assert.strictEqual(dlg.attrs['aria-describedby'], 'modal-desc', 'DLG-004: aria-describedby references description');

    // Verify focusable element chain within the dialog
    const buttons = extractElements(dlg.innerHtml, 'button');
    assert.strictEqual(buttons.length, 3, 'Dialog contains 3 focusable button controls');
    assert.strictEqual(buttons[0].attrs.id, 'btn-close', 'First focusable element is close button (DLG-001)');
  });
});
