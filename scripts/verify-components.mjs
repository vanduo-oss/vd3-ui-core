#!/usr/bin/env node
/**
 * VD3 UI CORE — Programmatic Component Verification Test Runner (Milestone 2)
 *
 * Automated verification of Milestone 2 CSS deliverables:
 * - Cascade Layers: @layer vd3.layout and @layer vd3.components
 * - Master Index Architecture (@layer ordering & imports)
 * - 38 Target Features (#13-16 layout, #27-60 components)
 * - W3C ARIA APG Accessibility Contracts (keyboard navigation, dialog backdrop, scope semantics, live regions)
 * - M1 Contrast Advisory: Dual-Ring Focus Pattern Resolution
 * - MOB-001 Reduced Motion Overrides
 * - Zero External Framework Dependencies
 *
 * Zero external runtime dependencies (pure Node.js ESM).
 * Exits with code 0 on 100% pass, 1 on any failure.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.resolve(rootDir, 'components');

// Test Suite State Tracking
const suites = [];
let currentSuite = null;

function suite(name) {
  currentSuite = { name, assertions: 0, passed: 0, failed: 0, errors: [] };
  suites.push(currentSuite);
}

function assert(condition, message) {
  if (!currentSuite) {
    throw new Error('assert() called without an active suite');
  }
  currentSuite.assertions++;
  if (condition) {
    currentSuite.passed++;
  } else {
    currentSuite.failed++;
    currentSuite.errors.push(message);
  }
}

function readFile(relativePath) {
  const fullPath = path.resolve(componentsDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return fs.readFileSync(fullPath, 'utf8');
}

// =============================================================================
// Suite 1: File Existence & Non-Empty Status
// =============================================================================
suite('File Existence & Non-Empty Status');

const requiredFiles = [
  'layout.css',
  'button.css',
  'dialog.css',
  'card.css',
  'form.css',
  'badge.css',
  'navbar.css',
  'accordion.css',
  'table.css',
  'code.css',
  'toast.css',
  'switch.css',
  'alert.css',
  'tabs.css',
  'drawer.css',
  'tooltip.css',
  'popover.css',
  'menu.css',
  'context-menu.css',
  'menubar.css',
  'breadcrumb.css',
  'pagination.css',
  'avatar.css',
  'progress.css',
  'spinner.css',
  'skeleton.css',
  'slider.css',
  'datepicker.css',
  'timepicker.css',
  'upload.css',
  'carousel.css',
  'toolbar.css',
  'segmented.css',
  'hover-card.css',
  'tour.css',
  'icon.css',
  'index.css',
];

const fileContents = {};

for (const file of requiredFiles) {
  const content = readFile(file);
  assert(content !== null, `File components/${file} must exist`);
  assert(content !== null && content.trim().length > 50, `File components/${file} must not be empty`);
  if (content !== null) {
    fileContents[file] = content;
  }
}

// =============================================================================
// Suite 2: Cascade Layer & Master Index Architecture
// =============================================================================
suite('Cascade Layer & Master Index Architecture');

const indexCss = fileContents['index.css'] || '';
const layoutCss = fileContents['layout.css'] || '';

// Canonical layer order declaration
assert(
  indexCss.includes('@layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities;'),
  'index.css must declare canonical layer order @layer vd3.tokens, vd3.reset, vd3.base, vd3.layout, vd3.components, vd3.utilities;'
);

// Import of layout primitives
assert(
  indexCss.includes("@import './layout.css' layer(vd3.layout);"),
  "index.css must import layout.css into layer(vd3.layout)"
);

// Imports of 35 components
const componentFiles = [
  'button.css', 'dialog.css', 'card.css', 'form.css', 'badge.css',
  'navbar.css', 'accordion.css', 'table.css', 'code.css', 'toast.css',
  'switch.css', 'alert.css', 'tabs.css',
  'drawer.css', 'tooltip.css', 'popover.css', 'menu.css', 'context-menu.css',
  'menubar.css', 'breadcrumb.css', 'pagination.css', 'avatar.css', 'progress.css',
  'spinner.css', 'skeleton.css', 'slider.css', 'datepicker.css', 'timepicker.css',
  'upload.css', 'carousel.css', 'toolbar.css', 'segmented.css', 'hover-card.css', 'tour.css', 'icon.css'
];

for (const comp of componentFiles) {
  assert(
    indexCss.includes(`@import './${comp}' layer(vd3.components);`),
    `index.css must import ${comp} into layer(vd3.components)`
  );
}

// Layout file layer encapsulation
assert(
  layoutCss.includes('@layer vd3.layout {'),
  'layout.css must enclose rules within @layer vd3.layout {'
);

// All 34 component files must enclose rules within @layer vd3.components {
for (const comp of componentFiles) {
  const compContent = fileContents[comp] || '';
  assert(
    compContent.includes('@layer vd3.components {'),
    `${comp} must enclose rules within @layer vd3.components {`
  );
}

// =============================================================================
// Suite 3: Feature #13: Golden Ratio Layout Splits
// =============================================================================
suite('Feature #13: Golden Ratio Layout Splits');

assert(
  layoutCss.includes('.vd-split-golden') && layoutCss.includes('.vd-layout-golden'),
  'layout.css must define .vd-split-golden and alias .vd-layout-golden'
);
assert(
  layoutCss.includes('.vd-split-golden-rev') && layoutCss.includes('.vd-layout-golden-rev'),
  'layout.css must define .vd-split-golden-rev and alias .vd-layout-golden-rev'
);
assert(
  layoutCss.includes('minmax(0, 1.618fr) minmax(0, 1fr)'),
  'Golden split must use minmax(0, 1.618fr) minmax(0, 1fr) to guarantee golden proportion and prevent track blowout'
);
assert(
  layoutCss.includes('minmax(0, 1fr) minmax(0, 1.618fr)'),
  'Reverse golden split must use minmax(0, 1fr) minmax(0, 1.618fr)'
);
assert(
  layoutCss.includes('.vd-split-major') && layoutCss.includes('.vd-split-minor'),
  'layout.css must define .vd-split-major and .vd-split-minor child roles'
);
assert(
  layoutCss.includes('.vd-split-flex'),
  'layout.css must define .vd-split-flex flexbox fallback'
);
assert(
  layoutCss.includes('flex: 1.618 1 0%') && layoutCss.includes('flex: 1 1 0%'),
  '.vd-split-flex must apply 1.618 and 1.0 flex basis to major and minor segments'
);
assert(
  layoutCss.includes('@media (max-width: 768px)') &&
  layoutCss.includes('@container (max-width: 768px)'),
  'layout.css must provide responsive stacking at 768px via @media and @container queries'
);

// =============================================================================
// Suite 4: Feature #14: Fibonacci Column Grids
// =============================================================================
suite('Feature #14: Fibonacci Column Grids');

const fibGrids = [1, 2, 3, 5, 8];
for (const n of fibGrids) {
  assert(
    layoutCss.includes(`.vd-grid-${n}`) && layoutCss.includes(`.vd-grid-fib-${n}`),
    `layout.css must define .vd-grid-${n} and alias .vd-grid-fib-${n}`
  );
}

assert(
  layoutCss.includes('repeat(2, minmax(0, 1fr))') &&
  layoutCss.includes('repeat(3, minmax(0, 1fr))') &&
  layoutCss.includes('repeat(5, minmax(0, 1fr))') &&
  layoutCss.includes('repeat(8, minmax(0, 1fr))'),
  'Fibonacci grids must use repeat(N, minmax(0, 1fr)) tracks'
);

assert(
  layoutCss.includes('.vd-grid-auto-fit') && layoutCss.includes('.vd-grid-auto-fill'),
  'layout.css must define .vd-grid-auto-fit and .vd-grid-auto-fill'
);

const fibMinCols = [89, 144, 233, 377, 610];
for (const w of fibMinCols) {
  assert(
    layoutCss.includes(`.vd-grid-min-${w}`),
    `layout.css must define Fibonacci min-column width modifier .vd-grid-min-${w}`
  );
}

const fibGaps = [1, 2, 3, 5, 8, 13, 21, 34, 55];
for (const g of fibGaps) {
  assert(
    layoutCss.includes(`.vd-gap-fib-${g}`) && layoutCss.includes(`.vd-gap-${g}`),
    `layout.css must define Fibonacci gap utility .vd-gap-fib-${g} and alias .vd-gap-${g}`
  );
}

// =============================================================================
// Suite 5: Feature #15: 12-Column Conventional Grid Engine
// =============================================================================
suite('Feature #15: 12-Column Conventional Grid Engine');

assert(
  layoutCss.includes('.vd-grid-12') && layoutCss.includes('repeat(12, minmax(0, 1fr))'),
  'layout.css must define .vd-grid-12 with 12 equal minmax(0, 1fr) tracks'
);

for (let i = 1; i <= 12; i++) {
  assert(
    layoutCss.includes(`.vd-col-span-${i}`),
    `layout.css must define .vd-col-span-${i}`
  );
}
assert(
  layoutCss.includes('.vd-col-span-full'),
  'layout.css must define .vd-col-span-full'
);

for (let i = 0; i <= 11; i++) {
  assert(
    layoutCss.includes(`.vd-col-offset-${i}`),
    `layout.css must define .vd-col-offset-${i}`
  );
}

const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
for (const bp of breakpoints) {
  assert(
    layoutCss.includes(`.vd-col-span-${bp}-1`) && layoutCss.includes(`.vd-col-span-${bp}-12`),
    `layout.css must define responsive span classes for breakpoint ${bp}`
  );
}

assert(
  layoutCss.includes('.vd-grid-stack-md') && layoutCss.includes('.vd-grid-stack-sm'),
  'layout.css must define .vd-grid-stack-md and .vd-grid-stack-sm stacking modifiers'
);

// =============================================================================
// Suite 6: Feature #16: Breakpoints Ladder & Layout Containers
// =============================================================================
suite('Feature #16: Breakpoints Ladder & Layout Containers');

assert(
  layoutCss.includes('.vd-container') &&
  layoutCss.includes('.vd-container-sm') &&
  layoutCss.includes('.vd-container-md') &&
  layoutCss.includes('.vd-container-lg') &&
  layoutCss.includes('.vd-container-xl') &&
  layoutCss.includes('.vd-container-2xl') &&
  layoutCss.includes('.vd-container-fluid'),
  'layout.css must define complete container suite (base, sm, md, lg, xl, 2xl, fluid)'
);

assert(
  layoutCss.includes('--vd3-container-sm') &&
  layoutCss.includes('--vd3-container-md') &&
  layoutCss.includes('--vd3-container-lg') &&
  layoutCss.includes('--vd3-container-xl') &&
  layoutCss.includes('--vd3-container-2xl'),
  'Containers must bind to Class A Lucas/Fibonacci container tokens'
);

assert(
  layoutCss.includes('.vd-container-query') && layoutCss.includes('.vd-cq'),
  'layout.css must define container query utilities .vd-container-query and .vd-cq'
);

assert(
  layoutCss.includes('.vd-aspect-golden') && layoutCss.includes('.vd-aspect-golden-portrait'),
  'layout.css must define golden aspect ratio utilities .vd-aspect-golden and .vd-aspect-golden-portrait'
);

const minWidthBreakpoints = [576, 768, 992, 1200, 1400];
for (const bp of minWidthBreakpoints) {
  assert(
    layoutCss.includes(`@media (min-width: ${bp}px)`),
    `layout.css must implement media query for breakpoint ${bp}px`
  );
}

// =============================================================================
// Suite 7: Feature #27: Zero-Framework Semantic Button
// =============================================================================
suite('Feature #27: Zero-Framework Semantic Button');

const buttonCss = fileContents['button.css'] || '';

assert(
  buttonCss.includes('.vd-btn'),
  'button.css must define base .vd-btn class'
);

const btnVariants = ['primary', 'secondary', 'ghost', 'danger'];
for (const v of btnVariants) {
  assert(
    buttonCss.includes(`.vd-btn--${v}`) && buttonCss.includes(`.vd-btn-${v}`),
    `button.css must define .vd-btn--${v} and alias .vd-btn-${v}`
  );
}

const btnSizes = ['sm', 'md', 'lg'];
for (const s of btnSizes) {
  assert(
    buttonCss.includes(`.vd-btn--${s}`) && buttonCss.includes(`.vd-btn-${s}`),
    `button.css must define .vd-btn--${s} and alias .vd-btn-${s}`
  );
}

assert(
  buttonCss.includes('.vd-btn--icon') && buttonCss.includes('.vd-btn-icon'),
  'button.css must define .vd-btn--icon and alias .vd-btn-icon'
);

assert(
  buttonCss.includes('.vd-btn:active:not(:disabled)'),
  'button.css must define active state micro-compression'
);

assert(
  buttonCss.includes('.vd-btn:disabled') && buttonCss.includes('.vd-btn[aria-disabled="true"]'),
  'button.css must style :disabled and [aria-disabled="true"] states'
);

assert(
  buttonCss.includes('.vd-btn:focus-visible'),
  'button.css must define :focus-visible dual-ring focus pattern'
);

assert(
  buttonCss.includes('[data-theme="dark"] .vd-btn--primary'),
  'button.css must provide dark theme variant color overrides'
);

// =============================================================================
// Suite 8: Feature #28: Native HTML5 Dialog Component
// =============================================================================
suite('Feature #28: Native HTML5 Dialog Component');

const dialogCss = fileContents['dialog.css'] || '';

assert(
  dialogCss.includes('.vd-dialog'),
  'dialog.css must define .vd-dialog class for native <dialog>'
);

assert(
  dialogCss.includes('--vd3-container-sm') || dialogCss.includes('521px'),
  'dialog.css must size dialog to Lucas L_13 = 521px container threshold'
);

assert(
  dialogCss.includes('.vd-dialog::backdrop'),
  'dialog.css must style native ::backdrop pseudo-element'
);

assert(
  dialogCss.includes('--vd3-glass-blur-xl') || dialogCss.includes('26px'),
  'dialog.css backdrop must implement Glass 4 frosted filter with 26px blur'
);

assert(
  dialogCss.includes('@starting-style'),
  'dialog.css must use @starting-style for discrete modal entrance animation'
);

const dialogAnatomy = [
  'header', 'title', 'close', 'body', 'footer'
];
for (const part of dialogAnatomy) {
  assert(
    dialogCss.includes(`.vd-dialog__${part}`) && dialogCss.includes(`.vd-dialog-${part}`),
    `dialog.css must define .vd-dialog__${part} and alias .vd-dialog-${part}`
  );
}

// =============================================================================
// Suite 9: Feature #29: Golden Card Surface Component
// =============================================================================
suite('Feature #29: Golden Card Surface Component');

const cardCss = fileContents['card.css'] || '';

assert(
  cardCss.includes('.vd-card'),
  'card.css must define base .vd-card class'
);

assert(
  cardCss.includes('.vd-card--golden') && cardCss.includes('.vd-card-golden'),
  'card.css must define .vd-card--golden and alias .vd-card-golden'
);

assert(
  cardCss.includes('.vd-card--golden-portrait') && cardCss.includes('.vd-card-golden-portrait'),
  'card.css must define .vd-card--golden-portrait and alias .vd-card-golden-portrait'
);

assert(
  cardCss.includes('.vd-card--compact') && cardCss.includes('.vd-card--spacious'),
  'card.css must define .vd-card--compact and .vd-card--spacious padding modifiers'
);

assert(
  cardCss.includes('.vd-card--elevated') && cardCss.includes('.vd-card-elevated'),
  'card.css must define elevated card variant'
);

assert(
  cardCss.includes('.vd-card--glass') && cardCss.includes('.vd-card-glass'),
  'card.css must define frosted glass variant (C-02 Convergence Zone)'
);

assert(
  cardCss.includes('--vd3-glass-blur-lg') || cardCss.includes('20px'),
  'card.css glass variant must bind to Glass 3 soft-cap 20px blur token'
);

assert(
  cardCss.includes('.vd-card--interactive') || cardCss.includes('.vd-card-interactive'),
  'card.css must define interactive card elevation and hover lift'
);

const cardAnatomy = [
  'header', 'title', 'subtitle', 'body', 'footer', 'image'
];
for (const part of cardAnatomy) {
  assert(
    cardCss.includes(`.vd-card-${part}`),
    `card.css must define internal anatomy section .vd-card-${part}`
  );
}

// =============================================================================
// Suite 10: Feature #30: Pure Semantic Form Controls
// =============================================================================
suite('Feature #30: Pure Semantic Form Controls');

const formCss = fileContents['form.css'] || '';

assert(
  formCss.includes('.vd-form-group'),
  'form.css must define .vd-form-group container'
);

assert(
  formCss.includes('.vd-label'),
  'form.css must define .vd-label'
);

assert(
  formCss.includes('.vd-input'),
  'form.css must define .vd-input'
);

assert(
  formCss.includes('.vd-textarea'),
  'form.css must define .vd-textarea'
);

assert(
  formCss.includes('.vd-select'),
  'form.css must define .vd-select'
);

assert(
  formCss.includes('.vd-checkbox') && formCss.includes('.vd-radio'),
  'form.css must define .vd-checkbox and .vd-radio controls'
);

assert(
  formCss.includes(':user-invalid') && formCss.includes('[aria-invalid="true"]'),
  'form.css must implement :user-invalid and [aria-invalid="true"] validation states'
);

assert(
  formCss.includes('.vd-help-text') && formCss.includes('.vd-error-text'),
  'form.css must define .vd-help-text and .vd-error-text'
);

assert(
  formCss.includes(':disabled') && formCss.includes('[aria-disabled="true"]'),
  'form.css must style disabled states'
);

// =============================================================================
// Suite 11: Feature #31: Badges & Chips Components
// =============================================================================
suite('Feature #31: Badges & Chips Components');

const badgeCss = fileContents['badge.css'] || '';

assert(
  badgeCss.includes('.vd-badge'),
  'badge.css must define .vd-badge'
);

assert(
  badgeCss.includes('.vd-badge--sm') && badgeCss.includes('.vd-badge--lg'),
  'badge.css must define badge sizing modifiers'
);

const badgeVariants = ['info', 'success', 'warning', 'danger'];
for (const v of badgeVariants) {
  assert(
    badgeCss.includes(`.vd-badge--${v}`) && badgeCss.includes(`.vd-badge-${v}`),
    `badge.css must define status badge variant .vd-badge--${v}`
  );
}

assert(
  badgeCss.includes('.vd-badge--dot') && badgeCss.includes('.vd-badge-dot'),
  'badge.css must define dot indicator badge .vd-badge--dot'
);

assert(
  badgeCss.includes('.vd-chip'),
  'badge.css must define .vd-chip'
);

assert(
  badgeCss.includes('.vd-chip--selected') || badgeCss.includes('[aria-pressed="true"]'),
  'badge.css must define active/selected chip state'
);

assert(
  badgeCss.includes('.vd-chip-close'),
  'badge.css must define .vd-chip-close dismiss action'
);

assert(
  badgeCss.includes('--vd3-radius-full') || badgeCss.includes('9999rem'),
  'badge.css must bind to full pill radius (9999rem)'
);

// =============================================================================
// Suite 12: Feature #32: Sticky Glassmorphic Navbar
// =============================================================================
suite('Feature #32: Sticky Glassmorphic Navbar');

const navbarCss = fileContents['navbar.css'] || '';

assert(
  navbarCss.includes('.vd-navbar'),
  'navbar.css must define .vd-navbar'
);

assert(
  navbarCss.includes('position: sticky') && navbarCss.includes('top: 0'),
  'navbar.css must declare position: sticky; top: 0;'
);

assert(
  navbarCss.includes('--vd3-z-sticky') || navbarCss.includes('1020'),
  'navbar.css must bind to z-index sticky token (1020)'
);

assert(
  navbarCss.includes('--vd3-glass-blur-md') || navbarCss.includes('13px'),
  'navbar.css must implement Glass 2 frosted filter with 13px blur'
);

assert(
  navbarCss.includes('.vd-navbar-container') &&
  navbarCss.includes('.vd-navbar-brand') &&
  navbarCss.includes('.vd-navbar-nav') &&
  navbarCss.includes('.vd-nav-link'),
  'navbar.css must define navbar structural sub-elements'
);

assert(
  navbarCss.includes('[aria-current="page"]'),
  'navbar.css must style active navigation links via [aria-current="page"]'
);

assert(
  navbarCss.includes('scroll-margin-top: calc(var(--vd-navbar-height, 4rem) + var(--vd3-space-fib-13, 0.8125rem));') ||
  navbarCss.includes('scroll-margin-top:'),
  'navbar.css must implement in-page anchor scroll-margin-top compensation'
);

// =============================================================================
// Suite 13: Feature #33: Native Disclosure / Accordion
// =============================================================================
suite('Feature #33: Native Disclosure / Accordion');

const accordionCss = fileContents['accordion.css'] || '';

assert(
  accordionCss.includes('.vd-accordion'),
  'accordion.css must define .vd-accordion'
);

assert(
  accordionCss.includes('.vd-accordion-summary'),
  'accordion.css must define .vd-accordion-summary'
);

assert(
  accordionCss.includes('::-webkit-details-marker') && accordionCss.includes('::marker'),
  'accordion.css must suppress native user-agent details triangle markers'
);

assert(
  accordionCss.includes('.vd-accordion-icon') || accordionCss.includes('.vd-accordion-summary::after'),
  'accordion.css must define custom chevron indicator'
);

assert(
  accordionCss.includes('rotate(45deg)') && accordionCss.includes('rotate(-135deg)'),
  'accordion.css chevron must rotate on open state'
);

assert(
  accordionCss.includes('--vd3-duration-144') || accordionCss.includes('144ms'),
  'accordion.css chevron transition must use Fibonacci duration F_12 = 144ms'
);

assert(
  accordionCss.includes('.vd-accordion-content'),
  'accordion.css must define .vd-accordion-content'
);

// =============================================================================
// Suite 14: Feature #34: Accessible Data Table
// =============================================================================
suite('Feature #34: Accessible Data Table');

const tableCss = fileContents['table.css'] || '';

assert(
  tableCss.includes('.vd-table-container'),
  'table.css must define .vd-table-container scrollable wrapper'
);

assert(
  tableCss.includes('overflow-x: auto'),
  '.vd-table-container must enable horizontal scroll'
);

assert(
  tableCss.includes('.vd-table'),
  'table.css must define .vd-table'
);

assert(
  tableCss.includes('th[scope="row"]'),
  'table.css must support semantic row headers th[scope="row"]'
);

assert(
  tableCss.includes('.vd-table--striped') && tableCss.includes('.vd-table-striped'),
  'table.css must define striped table option'
);

assert(
  tableCss.includes('.vd-table--bordered') && tableCss.includes('.vd-table-bordered'),
  'table.css must define bordered table option'
);

assert(
  tableCss.includes('.vd-table--hover') && tableCss.includes('.vd-table-hover'),
  'table.css must define interactive hover table option'
);

assert(
  tableCss.includes('.vd-table--compact') && tableCss.includes('.vd-table-sm'),
  'table.css must define compact density table option'
);

assert(
  tableCss.includes('.vd-table--sticky-header'),
  'table.css must define sticky header table option'
);

assert(
  tableCss.includes('tabular-nums'),
  'table.css must support tabular numbers for numeric alignment'
);

// =============================================================================
// Suite 15: Feature #35: Code Block & Spec Viewer
// =============================================================================
suite('Feature #35: Code Block & Spec Viewer');

const codeCss = fileContents['code.css'] || '';

assert(
  codeCss.includes('code.vd-code-inline'),
  'code.css must define inline code styling'
);

assert(
  codeCss.includes('pre.vd-code'),
  'code.css must define preformatted code block'
);

assert(
  codeCss.includes('pre.vd-code[data-language]::before'),
  'code.css must define language badge via data-language attribute'
);

assert(
  codeCss.includes('.vd-code-copy'),
  'code.css must define .vd-code-copy affordance button'
);

const syntaxTokens = ['keyword', 'string', 'number', 'property', 'selector', 'comment'];
for (const tok of syntaxTokens) {
  assert(
    codeCss.includes(`.token-${tok}`),
    `code.css must define golden-angle syntax highlighting class .token-${tok}`
  );
}

assert(
  codeCss.includes('.vd-spec-card'),
  'code.css must define .vd-spec-card token spec inspection viewer'
);

// =============================================================================
// Suite 16: Feature #36: Toast Notification Component
// =============================================================================
suite('Feature #36: Toast Notification Component');

const toastCss = fileContents['toast.css'] || '';

assert(
  toastCss.includes('.vd-toast-container'),
  'toast.css must define .vd-toast-container fixed stacking container'
);

assert(
  toastCss.includes('position: fixed') && toastCss.includes('pointer-events: none'),
  '.vd-toast-container must be fixed with pointer-events: none'
);

assert(
  toastCss.includes('.vd-toast') && toastCss.includes('pointer-events: auto'),
  '.vd-toast must reactivate pointer-events: auto'
);

const toastVariants = ['info', 'success', 'warning', 'danger'];
for (const v of toastVariants) {
  assert(
    toastCss.includes(`.vd-toast--${v}`),
    `toast.css must define toast variant .vd-toast--${v}`
  );
}

assert(
  toastCss.includes('@keyframes vd-toast-enter') && toastCss.includes('@keyframes vd-toast-exit'),
  'toast.css must define entrance and exit keyframes'
);

assert(
  toastCss.includes('--vd3-duration-233') || toastCss.includes('233ms'),
  'toast.css entrance animation must bind to Fibonacci duration F_13 = 233ms'
);

const toastPlacements = ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'bottom-center', 'top-center'];
for (const p of toastPlacements) {
  assert(
    toastCss.includes(`.vd-toast-container--${p}`),
    `toast.css must define placement modifier .vd-toast-container--${p}`
  );
}

// =============================================================================
// Suite 17: Feature #37: Switch Toggle (APG Switch Pattern, RTL-safe)
// =============================================================================
suite('Feature #37: Switch Toggle (APG Switch Pattern, RTL-safe)');

const switchCss = fileContents['switch.css'] || '';

assert(
  switchCss.includes('.vd-switch') && switchCss.includes('.vd-switch-thumb'),
  'switch.css must define .vd-switch track and .vd-switch-thumb'
);
assert(
  switchCss.includes('[aria-checked="true"]'),
  'switch.css must style the aria-checked="true" state (role="switch" contract)'
);
assert(
  switchCss.includes('inset-inline-start'),
  'switch.css thumb travel must use the logical property inset-inline-start (RTL-safe)'
);
assert(
  switchCss.includes('.vd-switch:focus-visible') &&
    switchCss.includes('--vd3-focus-ring-offset') && switchCss.includes('--vd3-focus-ring-width'),
  'switch.css must implement the dual-ring :focus-visible pattern'
);
assert(
  switchCss.includes('.vd-switch:disabled') && switchCss.includes('[aria-disabled="true"]'),
  'switch.css must style :disabled and [aria-disabled="true"]'
);
assert(
  switchCss.includes('.vd-switch--sm') && switchCss.includes('.vd-switch-sm') &&
    switchCss.includes('.vd-switch--lg') && switchCss.includes('.vd-switch-lg'),
  'switch.css must define sm/lg size modifiers with single-dash aliases'
);
assert(
  switchCss.includes('var(--vd3-radius-full') || switchCss.includes('9999rem'),
  'switch.css must use the pill radius (C-04) for track and thumb'
);
assert(
  switchCss.includes('var(--vd3-space-fib-34') && switchCss.includes('var(--vd3-space-fib-21'),
  'switch.css md track must bind to Fibonacci space tokens (34px / 21px ≈ φ ratio)'
);

// =============================================================================
// Suite 18: Feature #38: Alert Banner (live-region roles, RTL-safe accent)
// =============================================================================
suite('Feature #38: Alert Banner (live-region roles, RTL-safe accent)');

const alertCss = fileContents['alert.css'] || '';

assert(
  alertCss.includes('.vd-alert'),
  'alert.css must define base .vd-alert class'
);

const alertVariants = ['info', 'success', 'warning', 'critical'];
for (const v of alertVariants) {
  assert(
    alertCss.includes(`.vd-alert--${v}`) && alertCss.includes(`.vd-alert-${v}`),
    `alert.css must define variant .vd-alert--${v} and alias .vd-alert-${v}`
  );
}

const alertAnatomy = ['icon', 'content', 'title', 'body', 'close'];
for (const part of alertAnatomy) {
  assert(
    alertCss.includes(`.vd-alert-${part}`),
    `alert.css must define anatomy part .vd-alert-${part}`
  );
}
assert(
  alertCss.includes('border-inline-start'),
  'alert.css accent bar must use the logical property border-inline-start (RTL-safe)'
);
assert(
  alertCss.includes('.vd-alert-close:focus-visible'),
  'alert.css must define :focus-visible dual ring on the dismiss action'
);

// =============================================================================
// Suite 19: Feature #39: Tabs (APG Tabs Pattern)
// =============================================================================
suite('Feature #39: Tabs (APG Tabs Pattern)');

const tabsCss = fileContents['tabs.css'] || '';

assert(
  tabsCss.includes('.vd-tabs') && tabsCss.includes('.vd-tab') && tabsCss.includes('.vd-tab-panel'),
  'tabs.css must define .vd-tabs tablist, .vd-tab, and .vd-tab-panel'
);
assert(
  tabsCss.includes('[aria-selected="true"]'),
  'tabs.css must style the aria-selected="true" active tab'
);
assert(
  tabsCss.includes('.vd-tab:focus-visible') &&
    tabsCss.includes('--vd3-focus-ring-offset') && tabsCss.includes('--vd3-focus-ring-width'),
  'tabs.css must implement the dual-ring :focus-visible pattern on tabs'
);
assert(
  tabsCss.includes('.vd-tab:disabled') && tabsCss.includes('[aria-disabled="true"]'),
  'tabs.css must style disabled tabs'
);
assert(
  tabsCss.includes('.vd-tab-panel[hidden]') && tabsCss.includes('display: none'),
  'tabs.css must hide inactive panels via [hidden]'
);
assert(
  tabsCss.includes('var(--vd3-border-width-thin') && tabsCss.includes('var(--vd3-color-focus'),
  'tabs.css active indicator must bind to line.thin (2px) in color.role.focus'
);

// =============================================================================
// Suites 20-40: New Component Features #40-60 (phase 1.2/1.3 primitives)
// =============================================================================

const newFeatures = [
  { file: "drawer.css", num: 40, name: "Drawer / Offcanvas", base: ".vd-drawer", checks: [".vd-drawer-backdrop", ".vd-drawer--start", ".vd-drawer--end", ".vd-drawer--top", ".vd-drawer--bottom", ".vd-drawer-header", ".vd-drawer-body", ".vd-drawer-footer", ".vd-drawer-close", "var(--vd3-z-modal", "var(--vd3-z-modal-backdrop"] },
  { file: "tooltip.css", num: 41, name: "Tooltip", base: ".vd-tooltip", checks: [".vd-tooltip--top", ".vd-tooltip--bottom", "var(--vd3-z-tooltip", "::before"] },
  { file: "popover.css", num: 42, name: "Popover", base: ".vd-popover", checks: [".vd-popover-arrow", ".vd-popover-header", ".vd-popover-body", "var(--vd3-z-popover"] },
  { file: "menu.css", num: 43, name: "Dropdown Menu", base: ".vd-menu", checks: [".vd-menu-item", ".vd-menu-divider", ".vd-menu-label", "var(--vd3-z-dropdown", "[aria-current"] },
  { file: "context-menu.css", num: 44, name: "Context Menu", base: ".vd-context-menu", checks: [".vd-context-menu-item", ".vd-context-menu-divider", "var(--vd3-z-popover"] },
  { file: "menubar.css", num: 45, name: "Menubar", base: ".vd-menubar", checks: [".vd-menubar-item", "[aria-haspopup]", "[aria-expanded=\"true\"]"] },
  { file: "breadcrumb.css", num: 46, name: "Breadcrumb", base: ".vd-breadcrumb", checks: [".vd-breadcrumb-item", ".vd-breadcrumb-link", "[aria-current=\"page\"]"] },
  { file: "pagination.css", num: 47, name: "Pagination", base: ".vd-pagination", checks: [".vd-pagination-list", ".vd-pagination-item", ".vd-pagination-link", ".vd-pagination-link--prev", "[aria-current=\"page\"]"] },
  { file: "avatar.css", num: 48, name: "Avatar", base: ".vd-avatar", checks: [".vd-avatar--sm", ".vd-avatar--lg", ".vd-avatar--round", ".vd-avatar-status", ".vd-avatar-group", "margin-inline-start"] },
  { file: "progress.css", num: 49, name: "Progress Bar", base: ".vd-progress", checks: [".vd-progress-bar", ".vd-progress--indeterminate", "--_vd-progress-value", "@keyframes", ".vd-progress--critical"] },
  { file: "spinner.css", num: 50, name: "Spinner", base: ".vd-spinner", checks: [".vd-spinner--sm", ".vd-spinner--lg", "@keyframes"] },
  { file: "skeleton.css", num: 51, name: "Skeleton Loader", base: ".vd-skeleton", checks: [".vd-skeleton--text", ".vd-skeleton--circle", "@keyframes"] },
  { file: "slider.css", num: 52, name: "Range Slider", base: ".vd-slider", checks: ["::-webkit-slider-thumb", "::-moz-range-thumb", ":focus-visible"] },
  { file: "datepicker.css", num: 53, name: "Date Picker", base: ".vd-datepicker", checks: [".vd-datepicker-grid", ".vd-datepicker-day", "[aria-selected=\"true\"]", "[data-today]", ".vd-datepicker-prev", ".vd-datepicker-next"] },
  { file: "timepicker.css", num: 54, name: "Time Picker", base: ".vd-timepicker", checks: [".vd-timepicker-item", "[aria-selected=\"true\"]", ":focus-visible"] },
  { file: "upload.css", num: 55, name: "File Upload", base: ".vd-upload", checks: [".vd-upload--dragover", ".vd-upload-input", ".vd-upload-list", ":has(:focus-visible)"] },
  { file: "carousel.css", num: 56, name: "Carousel", base: ".vd-carousel", checks: [".vd-carousel-track", ".vd-carousel-slide", ".vd-carousel-prev", ".vd-carousel-next", ".vd-carousel-dots", ".vd-carousel-dot"] },
  { file: "toolbar.css", num: 57, name: "Toolbar", base: ".vd-toolbar", checks: [".vd-toolbar-group", ".vd-toolbar-button", ".vd-toolbar-separator"] },
  { file: "segmented.css", num: 58, name: "Segmented Control", base: ".vd-segmented", checks: [".vd-segmented-item", "[aria-checked=\"true\"]"] },
  { file: "hover-card.css", num: 59, name: "Hover Card", base: ".vd-hover-card", checks: [".vd-hover-card-title", ".vd-hover-card-body", "var(--vd3-z-popover"] },
  { file: "tour.css", num: 60, name: "Tour / Spotlight", base: ".vd-tour", checks: [".vd-tour-title", ".vd-tour-progress", ".vd-tour-btn", ".vd-tour-backdrop", "var(--vd3-z-"] },
  { file: "icon.css", num: 61, name: "Icon Primitive", base: ".vd-icon", checks: [".vd-icon--sm", ".vd-icon--md", ".vd-icon--lg", ".vd-icon--xl", "--_vd-icon-size", "--_vd-icon-color", "var(--vd3-icon-size-md"] },
];

for (const feat of newFeatures) {
  suite(`Feature #${feat.num}: ${feat.name}`);
  const featCss = fileContents[feat.file] || "";
  assert(featCss.includes(feat.base), `${feat.file} must define base class ${feat.base}`);
  for (const c of feat.checks) {
    assert(featCss.includes(c), `${feat.file} must contain ${c}`);
  }
}

// =============================================================================
// Suite 41a: RTL Guard — physical horizontal properties only as commented glyphs
// =============================================================================
suite('RTL Guard: logical properties only (physical horizontal props need a glyph/rtl comment)');
{
  const allCss = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.css'));
  for (const f of allCss) {
    const raw = fs.readFileSync(path.join(componentsDir, f), 'utf8');
    const linesArr = raw.split('\n');
    // blank out block comments so only real code is scanned
    const codeOnly = raw.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n');
    const physical = /(^|[\s;{])(left|right)\s*:|border-(left|right)(-color|-width|-style)?\s*:|background-position[^;]*\b(left|right)\b|text-align\s*:\s*(left|right)\b|margin-(left|right)\s*:|padding-(left|right)\s*:|float\s*:\s*(left|right)\b|clear\s*:\s*(left|right)\b/;
    linesArr.forEach((orig, i) => {
      if (!physical.test(codeOnly[i])) return;
      const context = [linesArr[i - 2] || '', linesArr[i - 1] || '', orig].join('\n');
      assert(
        /intentional|physical|\[dir="rtl"\]|:dir\(rtl\)/.test(context),
        `${f}:${i + 1} uses a physical horizontal property without an intentional-glyph/rtl comment: ${orig.trim()}`
      );
    });
  }
}

// =============================================================================
// Suite 41b: CSS Snapshot Integrity (regenerate intentionally with UPDATE_SNAPSHOTS=1)
// =============================================================================
suite('CSS Snapshot Integrity (UPDATE_SNAPSHOTS=1 to regenerate)');
{
  const snapPath = path.resolve(__dirname, 'snapshots.json');
  const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.css')).sort();
  const current = {};
  for (const f of files) {
    current[f] = crypto.createHash('sha256').update(fs.readFileSync(path.join(componentsDir, f))).digest('hex');
  }
  if (process.env.UPDATE_SNAPSHOTS === '1') {
    fs.writeFileSync(snapPath, JSON.stringify(current, null, 2) + '\n');
    console.log('  [snapshots] scripts/snapshots.json regenerated for ' + files.length + ' files');
  }
  assert(fs.existsSync(snapPath), 'scripts/snapshots.json must exist (run UPDATE_SNAPSHOTS=1 once)');
  const snap = JSON.parse(fs.readFileSync(snapPath, 'utf8'));
  for (const f of files) {
    assert(
      snap[f] === current[f],
      `${f} differs from scripts/snapshots.json — if this change is intentional, regenerate with UPDATE_SNAPSHOTS=1 node scripts/verify-components.mjs`
    );
  }
  for (const f of Object.keys(snap)) {
    assert(files.includes(f), `snapshots.json lists removed file ${f}`);
  }
}

// =============================================================================
// Suite 41c: Vendor Pseudo-Element Selector Isolation (CSSOM drop prevention)
// =============================================================================
suite('Vendor Pseudo-Element Selector Isolation (no cross-engine selector lists)');
{
  const allCss = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.css')).sort();
  for (const f of allCss) {
    const raw = fs.readFileSync(path.join(componentsDir, f), 'utf8');
    const stripped = raw.replace(/\/\*[\s\S]*?\*\//g, '');
    // Extract selector headers preceding '{' blocks (skip @at-rules)
    const ruleRegex = /(?:^|[;{}])\s*([^{}@;][^{};]*?)\s*\{/g;
    let match;
    const violations = [];
    while ((match = ruleRegex.exec(stripped)) !== null) {
      const sel = match[1].trim();
      if (!sel || sel.startsWith('@')) continue;
      if (/::-(?:webkit|moz)-/.test(sel) && sel.includes(',')) {
        const parts = sel.split(',').map((s) => s.trim()).filter(Boolean);
        const hasWebkit = parts.some((p) => p.includes('::-webkit-'));
        const hasMoz = parts.some((p) => p.includes('::-moz-'));
        const hasStandardMix = parts.some((p) => !/::-(?:webkit|moz)-/.test(p));
        const hasGroupedProgress = parts.some((p) => /::-(?:webkit|moz)-progress-/.test(p)) && parts.length > 1;
        if ((hasWebkit && hasMoz) || hasStandardMix || hasGroupedProgress) {
          violations.push(sel.replace(/\s+/g, ' '));
        }
      }
    }
    assert(
      violations.length === 0,
      `${f} combines vendor pseudo-elements in a comma-separated selector list (CSSOM drops entire rule): ${violations.join(' | ')}`
    );
  }
}

// =============================================================================
// Suite 41: M1 Contrast Advisory & Dual-Ring Focus Resolution
// =============================================================================
suite('M1 Contrast Advisory & Dual-Ring Focus Resolution');

const nonFocusFiles = new Set(['index.css', 'layout.css', 'tooltip.css', 'hover-card.css']);
const focusFiles = fs.readdirSync(componentsDir)
  .filter((f) => f.endsWith('.css') && !nonFocusFiles.has(f))
  .sort();

assert(
  focusFiles.length >= 33,
  `Expected dynamic scan to find >= 33 focus-capable component CSS files, found ${focusFiles.length}`
);

for (const f of focusFiles) {
  const content = fileContents[f] || '';
  assert(
    content.includes(':focus-visible'),
    `${f} must define :focus-visible pseudo-class rules`
  );
}

// Check normative dual-ring formula properties
assert(
  buttonCss.includes('--vd3-focus-ring-offset') && buttonCss.includes('--vd3-focus-ring-width'),
  'button.css must implement dual-ring focus pattern (offset spacer + focus ring + halo)'
);
assert(
  formCss.includes('--vd3-focus-ring-offset') && formCss.includes('--vd3-focus-ring-width'),
  'form.css must implement dual-ring focus pattern on form inputs'
);

// =============================================================================
// Suite 42: Reduced Motion Overrides (MOB-001)
// =============================================================================
suite('Reduced Motion Overrides (MOB-001)');

const animatedFiles = fs.readdirSync(componentsDir)
  .filter((f) => f.endsWith('.css'))
  .sort()
  .filter((f) => {
    const raw = fs.readFileSync(path.join(componentsDir, f), 'utf8');
    const codeOnly = raw.replace(/\/\*[\s\S]*?\*\//g, '');
    return /(^|[\s;{])(transition|animation)(-[a-z-]+)?\s*:/m.test(codeOnly);
  });

assert(
  animatedFiles.length >= 34,
  `Expected dynamic scan to find >= 34 animated component CSS files, found ${animatedFiles.length}`
);

for (const f of animatedFiles) {
  const content = fileContents[f] || '';
  assert(
    content.includes('@media (prefers-reduced-motion: reduce)') &&
    content.includes('[data-motion="reduce"]'),
    `${f} must implement reduced motion overrides for both @media and [data-motion="reduce"]`
  );
}

// =============================================================================
// Suite 43: Zero External Framework Dependencies
// =============================================================================
suite('Zero External Framework Dependencies');

const prohibitedTerms = [
  'tailwind', '@tailwind', 'bootstrap', '@bootstrap',
  'react', 'vue', 'svelte', 'styled-components', 'emotion'
];

for (const file of requiredFiles) {
  const content = (fileContents[file] || '').toLowerCase();
  for (const term of prohibitedTerms) {
    assert(
      !content.includes(term),
      `${file} must not contain references to third-party framework '${term}'`
    );
  }
}

// =============================================================================
// Report Summary & Execution
// =============================================================================
let totalAssertions = 0;
let totalPassed = 0;
let totalFailed = 0;

console.log('\n========================================================================================');
console.log(' VD3 UI CORE — Programmatic Component Verification Test Runner (Milestone 2)');
console.log('========================================================================================');

for (const s of suites) {
  totalAssertions += s.assertions;
  totalPassed += s.passed;
  totalFailed += s.failed;
  const status = s.failed === 0 ? '[PASS]' : '[FAIL]';
  const paddedName = s.name.padEnd(55, ' ');
  console.log(`${status} ${paddedName} (${s.passed}/${s.assertions} passed)`);
  if (s.failed > 0) {
    for (const err of s.errors) {
      console.log(`       -> ERROR: ${err}`);
    }
  }
}

console.log('┌──────────────────────────────────────────────────────────┬──────────┬──────────┬──────────┐');
console.log('│ Test Suite                                               │   Assert │   Passed │   Failed │');
console.log('├──────────────────────────────────────────────────────────┼──────────┼──────────┼──────────┤');
for (const s of suites) {
  const suiteName = s.name.length > 56 ? s.name.slice(0, 53) + '...' : s.name.padEnd(56, ' ');
  const a = String(s.assertions).padStart(8, ' ');
  const p = String(s.passed).padStart(8, ' ');
  const f = String(s.failed).padStart(8, ' ');
  console.log(`│ ${suiteName} │ ${a} │ ${p} │ ${f} │`);
}
console.log('├──────────────────────────────────────────────────────────┼──────────┼──────────┼──────────┤');
const totA = String(totalAssertions).padStart(8, ' ');
const totP = String(totalPassed).padStart(8, ' ');
const totF = String(totalFailed).padStart(8, ' ');
console.log(`│ TOTAL                                                    │ ${totA} │ ${totP} │ ${totF} │`);
console.log('└──────────────────────────────────────────────────────────┴──────────┴──────────┴──────────┘\n');

if (totalFailed === 0) {
  console.log(`SUCCESS: All ${totalAssertions} programmatic component assertions passed with zero defects.\n`);
  process.exit(0);
} else {
  console.error(`FAILURE: ${totalFailed} of ${totalAssertions} assertions failed.\n`);
  process.exit(1);
}
