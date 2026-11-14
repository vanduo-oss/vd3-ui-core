/**
 * @file html-parser.mjs
 * Zero-dependency HTML inspector for Schema.org JSON-LD, heading ladder, and data-vd-* attributes.
 */

const HTML_VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

/**
 * Extracts and parses Schema.org JSON-LD scripts.
 */
export function extractJsonLd(htmlContent) {
  const regex = /<script\s+[^>]*?type=["']application\/ld\+json["'][^>]*?>([\s\S]*?)<\/script>/gi;
  const results = [];
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    try {
      results.push(JSON.parse(match[1].trim()));
    } catch (e) {
      results.push({ error: 'INVALID_JSON', message: e.message, raw: match[1] });
    }
  }
  return results;
}

/**
 * Extracts all headings <h1>..<h6> in document order.
 */
export function extractHeadings(htmlContent) {
  const regex = /<(h[1-6])([^>]*)>([\s\S]*?)<\/\1>/gi;
  const headings = [];
  let match;
  let index = 0;
  while ((match = regex.exec(htmlContent)) !== null) {
    headings.push({
      level: parseInt(match[1].charAt(1), 10),
      tag: match[1].toLowerCase(),
      attrs: match[2].trim(),
      text: match[3].replace(/<[^>]+>/g, '').trim(),
      index: index++
    });
  }
  return headings;
}

/**
 * Validates heading ladder integrity (strict H1 -> H2 -> H3, no skips).
 */
export function validateHeadingLadder(headings) {
  const errors = [];
  if (!headings || headings.length === 0) {
    return { valid: false, errors: ['No headings found'] };
  }

  // Exactly one H1
  const h1s = headings.filter(h => h.level === 1);
  if (h1s.length !== 1) {
    errors.push(`Expected exactly 1 <h1>, found ${h1s.length}`);
  }

  // First heading must be H1
  if (headings[0].level !== 1) {
    errors.push(`First heading must be <h1>, but found <h${headings[0].level}> ("${headings[0].text}")`);
  }

  // Check for skipped levels (e.g. H1 -> H3, H2 -> H4)
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1].level;
    const curr = headings[i].level;
    if (curr > prev + 1) {
      errors.push(`Heading skip from <h${prev}> to <h${curr}>: "${headings[i].text}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Parses raw attribute string into a key-value object.
 */
export function parseAttributes(attrString) {
  const attrs = {};
  const attrRegex = /([a-zA-Z0-9_-]+)(?:=(?:["']([^"']*)["']|([^\s>/]+)))?/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1];
    const val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : '');
    attrs[name] = val;
  }
  return attrs;
}

/**
 * Extracts elements carrying a specific attribute (e.g. data-vd-component).
 * Correctly handles:
 *  - HTML5 void elements (<input>, <img>, <hr>, etc.) without end tags
 *  - Explicitly self-closing tags (<tag />)
 *  - Nested elements of the same tag (<div ...><div ...></div></div>)
 *  - Nested elements of different tags (<section><button></button></section>)
 *  - Exact attribute key matching without hyphen boundary regex false positives
 */
export function extractElementsByAttribute(htmlContent, attrName) {
  const elements = [];
  const startTagRegex = /<([a-zA-Z0-9-]+)(\s+[^>]*?)?(\/?)>/gi;
  let match;

  while ((match = startTagRegex.exec(htmlContent)) !== null) {
    const tagName = match[1].toLowerCase();
    const rawAttrs = match[2] || '';
    const isExplicitSelfClose = match[3] === '/' || /\/\s*$/.test(rawAttrs);
    const isVoid = HTML_VOID_TAGS.has(tagName);
    const attrs = parseAttributes(rawAttrs);

    if (!(attrName in attrs)) continue;

    if (isExplicitSelfClose || isVoid) {
      elements.push({
        tag: tagName,
        attrs,
        text: '',
        innerHtml: ''
      });
      continue;
    }

    const startInner = match.index + match[0].length;
    let depth = 1;
    let endInner = startInner;

    const tagScanRegex = new RegExp(`<(/?)${tagName}(\\s+[^>]*?)?(\\/?)>`, 'gi');
    tagScanRegex.lastIndex = startInner;
    let scanMatch;

    while ((scanMatch = tagScanRegex.exec(htmlContent)) !== null) {
      const isClosing = scanMatch[1] === '/';
      const isInnerSelfClosing = scanMatch[3] === '/' || /\/\s*$/.test(scanMatch[2] || '');
      if (isClosing) {
        depth--;
        if (depth === 0) {
          endInner = scanMatch.index;
          break;
        }
      } else if (!isInnerSelfClosing) {
        depth++;
      }
    }

    const innerHtml = htmlContent.slice(startInner, endInner);
    elements.push({
      tag: tagName,
      attrs,
      text: innerHtml.replace(/<[^>]+>/g, '').trim(),
      innerHtml
    });
  }

  return elements;
}

/**
 * Extracts all elements of a specified tag name.
 * Supports HTML5 void elements, explicit self-closing, and same-tag nesting.
 */
export function extractElements(htmlContent, tagName) {
  const targetTag = tagName.toLowerCase();
  const elements = [];
  const startTagRegex = new RegExp(`<(${targetTag})(\\s+[^>]*?)?(\\/?)>`, 'gi');
  let match;

  while ((match = startTagRegex.exec(htmlContent)) !== null) {
    const rawAttrs = match[2] || '';
    const isExplicitSelfClose = match[3] === '/' || /\/\s*$/.test(rawAttrs);
    const isVoid = HTML_VOID_TAGS.has(targetTag);
    const attrs = parseAttributes(rawAttrs);

    if (isExplicitSelfClose || isVoid) {
      elements.push({
        tag: targetTag,
        attrs,
        text: '',
        innerHtml: ''
      });
      continue;
    }

    const startInner = match.index + match[0].length;
    let depth = 1;
    let endInner = startInner;

    const tagScanRegex = new RegExp(`<(/?)${targetTag}(\\s+[^>]*?)?(\\/?)>`, 'gi');
    tagScanRegex.lastIndex = startInner;
    let scanMatch;

    while ((scanMatch = tagScanRegex.exec(htmlContent)) !== null) {
      const isClosing = scanMatch[1] === '/';
      const isInnerSelfClosing = scanMatch[3] === '/' || /\/\s*$/.test(scanMatch[2] || '');
      if (isClosing) {
        depth--;
        if (depth === 0) {
          endInner = scanMatch.index;
          break;
        }
      } else if (!isInnerSelfClosing) {
        depth++;
      }
    }

    const innerHtml = htmlContent.slice(startInner, endInner);
    elements.push({
      tag: targetTag,
      attrs,
      text: innerHtml.replace(/<[^>]+>/g, '').trim(),
      innerHtml
    });
  }

  return elements;
}

/**
 * Detects unrendered template placeholders or empty client shells.
 */
export function detectUnrenderedPlaceholders(htmlContent) {
  const issues = [];
  if (/\{\{\s*[\w.]+\s*\}\}/.test(htmlContent)) {
    issues.push('Found uncompiled mustache syntax {{ ... }}');
  }
  if (/\bv-(?:if|for|model|bind|on)\b/.test(htmlContent)) {
    issues.push('Found uncompiled Vue directives (v-if, v-for, etc.)');
  }
  if (/<div\s+id=["']app["']\s*>\s*<\/div>/.test(htmlContent)) {
    issues.push('Found empty CSR root container <div id="app"></div>');
  }
  return issues;
}
