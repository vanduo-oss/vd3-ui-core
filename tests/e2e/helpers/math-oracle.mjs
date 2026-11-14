/**
 * @file math-oracle.mjs
 * Pure mathematical ground truth for golden ratio, Fibonacci, Lucas, and color contrast.
 * Zero external dependencies.
 */

import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const REPO_ROOT = join(__dirname, '..', '..', '..');

export const PHI = (1 + Math.sqrt(5)) / 2; // 1.618033988749895
export const INV_PHI = 1 / PHI;             // 0.6180339887498948
export const INV_PHI_SQ = 1 / (PHI * PHI);  // 0.38196601125010515
export const SQRT_PHI = Math.sqrt(PHI);     // 1.272019649514069
export const GOLDEN_ANGLE_DEG = 360 * (1 - 1 / PHI); // 137.50776405003785

/**
 * Closed-form Binet formula for n-th Fibonacci number.
 * Fn = (phi^n - (-phi)^(-n)) / sqrt(5)
 */
export function fibonacci(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new RangeError(`Fibonacci index must be a non-negative integer, got ${n}`);
  }
  const psi = 1 - PHI;
  return Math.round((Math.pow(PHI, n) - Math.pow(psi, n)) / Math.sqrt(5));
}

/**
 * Closed-form Lucas number formula.
 * Ln = phi^n + (-phi)^(-n)
 */
export function lucas(n) {
  if (n < 0 || !Number.isInteger(n)) {
    throw new RangeError(`Lucas index must be a non-negative integer, got ${n}`);
  }
  const psi = 1 - PHI;
  return Math.round(Math.pow(PHI, n) + Math.pow(psi, n));
}

/**
 * Floating point approximate equality check.
 */
export function approxEqual(actual, expected, epsilon = 1e-4) {
  return Math.abs(actual - expected) <= epsilon;
}

/**
 * Golden ratio split: divides width into primary (61.8034%) and secondary (38.1966%).
 */
export function goldenSplit(width) {
  const primary = width * INV_PHI;
  const secondary = width * INV_PHI_SQ;
  return { primary, secondary, sum: primary + secondary };
}

/**
 * Modular sqrt(phi) typography scale.
 */
export function sqrtPhiTypeScale(basePx, step) {
  return basePx * Math.pow(SQRT_PHI, step);
}

/**
 * Parse hex color (#rgb, #rrggbb, #rrggbbaa) to sRGB 0..1 channels.
 */
export function parseHexColor(hex) {
  let clean = String(hex).trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('') + 'ff';
  } else if (clean.length === 4) {
    clean = clean.split('').map(c => c + c).join('');
  } else if (clean.length === 6) {
    clean += 'ff';
  } else if (clean.length !== 8) {
    throw new Error(`Invalid hex color string: "${hex}"`);
  }
  const num = parseInt(clean, 16);
  return {
    r: ((num >> 24) & 255) / 255,
    g: ((num >> 16) & 255) / 255,
    b: ((num >> 8) & 255) / 255,
    a: (num & 255) / 255
  };
}

/**
 * WCAG 2.1 sRGB relative luminance calculation.
 */
export function relativeLuminance(hexColor) {
  const { r, g, b } = parseHexColor(hexColor);
  const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * WCAG 2.1 contrast ratio between two colors: (L1 + 0.05) / (L2 + 0.05).
 */
export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Resolves repository paths gracefully, searching both repository root and subprojects (vd3-ui-core).
 */
export function resolveRepoPath(subPath) {
  const candidates = [
    join(process.cwd(), subPath),
    join(process.cwd(), 'vd3-ui-core', subPath),
    join(REPO_ROOT, subPath),
    join(REPO_ROOT, 'vd3-ui-core', subPath)
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0]; // fallback to primary candidate
}

/**
 * Resolves a DTCG token value, following curly-brace alias references {path.to.token}.
 */
export function resolveTokenValue(tokens, rawValue) {
  if (typeof rawValue !== 'string') return rawValue;
  const match = rawValue.match(/^\{([a-zA-Z0-9_.-]+)\}$/);
  if (!match) return rawValue;

  const path = match[1].split('.');
  let current = tokens;
  for (const part of path) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      throw new Error(`Token reference "${rawValue}" cannot be resolved: missing key "${part}"`);
    }
  }

  const resolved = current && typeof current === 'object' && '$value' in current ? current.$value : current;
  return resolveTokenValue(tokens, resolved);
}

/**
 * Loads and parses DTCG tokens from tokens/vd3.tokens.json.
 */
export function loadTokens() {
  const path = resolveRepoPath('tokens/vd3.tokens.json');
  if (!existsSync(path)) {
    throw new Error(`Tokens file not found at ${path}. Run token export or verify repo layout.`);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}
