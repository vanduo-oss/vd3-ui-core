/**
 * @file css-parser.mjs
 * Zero-dependency CSS custom property, layer, and rule parser.
 */

/**
 * Strips comments from CSS content.
 */
export function stripComments(cssContent) {
  return cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
}

/**
 * Extracts all CSS Custom Properties (--name: value) into a Map.
 */
export function extractCustomProperties(cssContent) {
  const map = new Map();
  const stripped = stripComments(cssContent);
  const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(stripped)) !== null) {
    map.set(match[1].trim(), match[2].trim());
  }
  return map;
}

/**
 * Extracts declared @layer order.
 * Handles:
 *  - Single-line declarations: @layer vd3.tokens, vd3.reset;
 *  - Multiline declarations with indentation and line breaks
 *  - Multiple separate @layer statements
 *  - Fallback to layer block headers (@layer name { ... }) when standalone statements are absent
 */
export function extractLayerOrder(cssContent) {
  const stripped = stripComments(cssContent);
  const layers = [];

  // Match all @layer name1, name2, ...; statements (including multiline)
  const layerDeclRegex = /@layer\s+([^;{}]+);/g;
  let match;
  while ((match = layerDeclRegex.exec(stripped)) !== null) {
    const names = match[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      if (!layers.includes(name)) {
        layers.push(name);
      }
    }
  }

  // If no statement declarations exist, collect layer block definitions (@layer <name> {)
  if (layers.length === 0) {
    const layerBlockHeaderRegex = /@layer\s+([a-zA-Z0-9_.-]+)\s*\{/g;
    while ((match = layerBlockHeaderRegex.exec(stripped)) !== null) {
      const name = match[1].trim();
      if (!layers.includes(name)) {
        layers.push(name);
      }
    }
  }

  return layers;
}

/**
 * Extracts rules from a specific @layer block.
 * Uses balanced brace counting to eliminate:
 *  - Cross-layer bleed on indented closing braces
 *  - Rule dropout on column-0 inner rule braces
 *  - Truncation caused by nested braces (such as @media or pseudo-states)
 */
export function extractRulesInLayer(cssContent, layerName) {
  const stripped = stripComments(cssContent);
  const escaped = layerName.replace(/\./g, '\\.');
  const targetPattern = new RegExp(`@layer\\s+${escaped}\\s*\\{`, 'g');
  let match;
  const rules = [];

  while ((match = targetPattern.exec(stripped)) !== null) {
    const startIdx = match.index + match[0].length;
    let depth = 1;
    let endIdx = startIdx;

    for (let i = startIdx; i < stripped.length; i++) {
      if (stripped[i] === '{') depth++;
      else if (stripped[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }

    const layerBody = stripped.slice(startIdx, endIdx);
    let i = 0;
    while (i < layerBody.length) {
      const braceOpen = layerBody.indexOf('{', i);
      if (braceOpen === -1) break;
      const selector = layerBody.slice(i, braceOpen).trim();

      let rDepth = 1;
      let rClose = braceOpen + 1;
      while (rClose < layerBody.length) {
        if (layerBody[rClose] === '{') rDepth++;
        else if (layerBody[rClose] === '}') {
          rDepth--;
          if (rDepth === 0) break;
        }
        rClose++;
      }

      const body = layerBody.slice(braceOpen + 1, rClose).trim();
      if (selector) {
        rules.push({ selector, body });
      }
      i = rClose + 1;
    }
  }
  return rules;
}

/**
 * Extracts all rules across CSS content using balanced brace matching.
 */
export function extractAllRules(cssContent) {
  const stripped = stripComments(cssContent);
  const rules = [];
  let i = 0;
  while (i < stripped.length) {
    const braceOpen = stripped.indexOf('{', i);
    if (braceOpen === -1) break;
    const selector = stripped.slice(i, braceOpen).trim();

    let depth = 1;
    let rClose = braceOpen + 1;
    while (rClose < stripped.length) {
      if (stripped[rClose] === '{') depth++;
      else if (stripped[rClose] === '}') {
        depth--;
        if (depth === 0) break;
      }
      rClose++;
    }

    const body = stripped.slice(braceOpen + 1, rClose).trim();
    if (selector && !selector.startsWith('@')) {
      rules.push({ selector, body });
    }
    i = rClose + 1;
  }
  return rules;
}

/**
 * Extracts all media queries matching a condition (e.g. prefers-reduced-motion).
 * Uses balanced brace counting to handle indented braces and nested selectors.
 */
export function extractMediaQueries(cssContent, querySubstring) {
  const stripped = stripComments(cssContent);
  const mediaRegex = /@media\s*([^{]+)\{/g;
  const results = [];
  let match;
  while ((match = mediaRegex.exec(stripped)) !== null) {
    const query = match[1].trim();
    const startIdx = match.index + match[0].length;
    let depth = 1;
    let endIdx = startIdx;
    for (let i = startIdx; i < stripped.length; i++) {
      if (stripped[i] === '{') depth++;
      else if (stripped[i] === '}') {
        depth--;
        if (depth === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (!querySubstring || query.includes(querySubstring)) {
      results.push({
        query,
        content: stripped.slice(startIdx, endIdx).trim()
      });
    }
    mediaRegex.lastIndex = endIdx + 1;
  }
  return results;
}

/**
 * Parses a CSS declaration block into a Map of property -> value.
 */
export function parseDeclarationBlock(bodyText) {
  const decls = new Map();
  const pairs = bodyText.split(';');
  for (const pair of pairs) {
    const colonIdx = pair.indexOf(':');
    if (colonIdx > 0) {
      const prop = pair.slice(0, colonIdx).trim();
      const val = pair.slice(colonIdx + 1).trim();
      if (prop && val) {
        decls.set(prop, val);
      }
    }
  }
  return decls;
}
