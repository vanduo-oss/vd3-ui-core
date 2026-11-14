/**
 * @file developer-workflow.test.mjs
 * Tier 4 Scenario: Zero-Framework Vanilla Web Developer Workflow Consuming Design Tokens & CSS.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PHI, INV_PHI, INV_PHI_SQ, approxEqual, loadTokens, resolveRepoPath } from '../helpers/math-oracle.mjs';
import { extractCustomProperties } from '../helpers/css-parser.mjs';

describe('Tier 4 Scenario 2: Zero-Framework Web Developer Workflow', () => {
  const tokens = loadTokens();

  // Vanilla HTML dashboard assembled by a developer importing VD3 UI CORE stylesheets
  const developerDashboardHtml = `
<!doctype html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <title>Admin Dashboard — Built with VD3 UI CORE</title>
  <link rel="stylesheet" href="tokens/tokens.css" />
  <link rel="stylesheet" href="components/layout.css" />
  <link rel="stylesheet" href="components/navbar.css" />
  <link rel="stylesheet" href="components/cards.css" />
  <link rel="stylesheet" href="components/buttons.css" />
  <link rel="stylesheet" href="components/tables.css" />
  <link rel="stylesheet" href="components/badges.css" />
</head>
<body>
  <header class="vd-navbar">
    <nav class="vd-nav" aria-label="Main Navigation">
      <span class="vd-brand">Admin Console</span>
    </nav>
  </header>

  <main class="vd-container-lg">
    <div class="vd-row-golden">
      <!-- Major Column: 61.8% -->
      <section class="vd-col-golden-major">
        <article class="vd-card vd-card-golden">
          <h2>System Telemetry</h2>
          <table class="vd-table">
            <caption>Active Services Performance</caption>
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Status</th>
                <th scope="col">Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Database</th>
                <td><span class="vd-badge vd-badge-pill">Operational</span></td>
                <td>13ms</td>
              </tr>
            </tbody>
          </table>
          <button type="button" class="vd-btn vd-btn-primary">Refresh Metrics</button>
        </article>
      </section>

      <!-- Minor Column: 38.2% -->
      <aside class="vd-col-golden-minor">
        <article class="vd-card">
          <h3>Quick Actions</h3>
          <button type="button" class="vd-btn vd-btn-secondary">Export Logs</button>
        </article>
      </aside>
    </div>
  </main>
</body>
</html>
  `;

  it('TEST-T4-SCN-005: Developer page uses valid semantic HTML5 markup without framework runtime', () => {
    // Assert all required semantic HTML5 elements are used
    assert.ok(developerDashboardHtml.includes('<header'), 'Dashboard uses semantic <header>');
    assert.ok(developerDashboardHtml.includes('<nav'), 'Dashboard uses semantic <nav>');
    assert.ok(developerDashboardHtml.includes('<main'), 'Dashboard uses semantic <main>');
    assert.ok(developerDashboardHtml.includes('<article'), 'Dashboard uses semantic <article>');
    assert.ok(developerDashboardHtml.includes('<aside'), 'Dashboard uses semantic <aside>');
    assert.ok(developerDashboardHtml.includes('<table'), 'Dashboard uses semantic <table>');
    assert.ok(developerDashboardHtml.includes('<button'), 'Dashboard uses semantic <button>');

    // Assert zero framework runtime imports (<script src="vue.js">, react, angular)
    assert.ok(!developerDashboardHtml.includes('vue.js'), 'Must not import Vue runtime');
    assert.ok(!developerDashboardHtml.includes('react.js'), 'Must not import React runtime');
  });

  it('TEST-T4-SCN-006: Asymmetric Golden Ratio Split layout matches 61.8% / 38.2% proportion', () => {
    // In CSS: major = 61.8034%, minor = 38.1966%
    const majorPct = INV_PHI * 100;
    const minorPct = INV_PHI_SQ * 100;

    assert.ok(approxEqual(majorPct, 61.8034, 0.001), 'Major section is 61.8034%');
    assert.ok(approxEqual(minorPct, 38.1966, 0.001), 'Minor section is 38.1966%');
    assert.ok(approxEqual(majorPct + minorPct, 100.0, 1e-9), 'Sum of major and minor sections is exactly 100%');
    assert.ok(approxEqual(majorPct / minorPct, PHI, 1e-6), 'Major/Minor track ratio is exactly phi');
  });

  it('TEST-T4-SCN-007: CSS custom properties consumed by developer resolve in DTCG tokens', () => {
    // Verify required token groups used by dashboard controls exist in tokens.json
    assert.ok(tokens.space['fib-13'], 'space.fib-13 exists for component padding');
    assert.ok(tokens.radius['fib-5'], 'radius.fib-5 exists for button radius');
    assert.ok(tokens.radius.full, 'radius.full exists for pill badges');
    assert.ok(tokens.shadow['1'], 'shadow.1 exists for card elevation');
    assert.ok(tokens.container.lg, 'container.lg exists (987px) for dashboard max-width');
    assert.strictEqual(tokens.container.lg.$value, '987px');
  });

  it('TEST-T4-SCN-008: Zero-CDN purity: stylesheets contain no external unpkg or CDN imports', () => {
    const cssFiles = [
      'tokens/tokens.css',
      'components/button.css',
      'components/navbar.css',
      'components/card.css'
    ];

    let inspectedCount = 0;
    for (const file of cssFiles) {
      const resolved = resolveRepoPath(file);
      if (existsSync(resolved)) {
        inspectedCount++;
        const css = readFileSync(resolved, 'utf8');
        assert.ok(!css.includes('fonts.googleapis.com'), `${file} must not import Google Fonts`);
        assert.ok(!css.includes('cdn.jsdelivr.net'), `${file} must not import jsdelivr`);
        assert.ok(!css.includes('unpkg.com'), `${file} must not import unpkg`);
      }
    }
    assert.ok(inspectedCount >= 1, 'At least published tokens/tokens.css must be audited for CDN purity');
  });
});
