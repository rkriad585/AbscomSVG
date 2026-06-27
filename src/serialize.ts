import type { SvgDef } from './types';

/**
 * Serialize a single attribute value to an SVG attribute string.
 * Handles strings, numbers, booleans, and nullish values.
 */
function attrToString(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  return String(val);
}

/**
 * Convert an SvgDef tree to an SVG markup string.
 *
 * This works in any runtime (browser, Node.js, Bun) — no DOM required.
 *
 * @param def - A single SvgDef or array of SvgDefs to serialize
 * @returns An SVG markup string
 *
 * @example
 * ```ts
 * const svg = toInlineSvg(circle(50, 50, 30, 'red'));
 * // → '<svg xmlns="..."><circle cx="50" cy="50" r="30" fill="red"/></svg>'
 * ```
 */
export function toInlineSvg(def: SvgDef | SvgDef[]): string {
  const defs = Array.isArray(def) ? def : [def];

  // If all top-level defs are <svg> elements, serialize each directly.
  // Otherwise, wrap in a single <svg>.
  const allSvg = defs.every(d => d.type === 'svg');

  if (allSvg) {
    return defs.map(d => serializeDef(d)).join('\n');
  }

  // Compute a rough viewBox if none provided
  const vb = '0 0 500 500';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs.map(d => serializeDef(d)).join('')}</svg>`;
}

/** @internal Serialize a single SvgDef to a string. */
function serializeDef(def: SvgDef): string {
  const parts: string[] = [];
  parts.push(`<${def.type}`);

  if (def.id) parts.push(` id="${escapeXml(def.id)}"`);
  for (const attr in def.attrs) {
    const val = def.attrs[attr];
    if (val === null || val === undefined) continue;
    // skip xmlns on non-svg elements
    if (attr === 'xmlns' && def.type !== 'svg') continue;
    parts.push(` ${attr}="${escapeXml(attrToString(val))}"`);
  }

  const hasChildren = def.children && def.children.length > 0;
  const hasText = def.text !== undefined && def.text !== null;

  if (!hasChildren && !hasText) {
    parts.push('/>');
    return parts.join('');
  }

  parts.push('>');

  if (hasText) {
    parts.push(escapeXml(def.text!));
  }

  if (hasChildren) {
    for (const child of def.children!) {
      parts.push(serializeDef(child));
    }
  }

  parts.push(`</${def.type}>`);
  return parts.join('');
}

/** @internal Escape XML special characters. */
function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Convert an SVG markup string to a `data:image/svg+xml` data URI.
 *
 * Useful for embedding SVGs in `<img>` tags, CSS `background-image`, or
 * sharing as a single string.
 *
 * @param svgString - An SVG markup string (from `toInlineSvg()` or hand-written)
 * @returns A data URI string
 *
 * @example
 * ```ts
 * const svg = toInlineSvg(circle(50, 50, 30, 'red'));
 * const uri = toDataUri(svg);
 * // → 'data:image/svg+xml;charset=utf-8,...'
 * ```
 */
export function toDataUri(svgString: string): string {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

/**
 * Trigger a browser download of an SVG file.
 *
 * Accepts either a raw SVG markup string, or one or more SvgDefs (which will
 * be serialized automatically via `toInlineSvg()`).
 *
 * **Browser-only** — throws in Node.js/Bun if `document` is undefined.
 *
 * @param input - SVG markup string, SvgDef, or array of SvgDefs
 * @param filename - Download filename (default: `'download.svg'`)
 *
 * @example
 * ```ts
 * // From a def
 * downloadSvg(circle(50, 50, 30, 'red'), 'circle.svg');
 *
 * // From a raw string
 * downloadSvg('<svg>...</svg>', 'output.svg');
 * ```
 */
export function downloadSvg(input: string | SvgDef | SvgDef[], filename: string = 'download.svg'): void {
  if (typeof document === 'undefined') {
    throw new Error(
      'AbscomSVG.downloadSvg() requires a browser environment. ' +
        'Use toInlineSvg() + toDataUri() for server-side use.',
    );
  }

  let svgString: string;
  if (typeof input === 'string') {
    svgString = input;
  } else {
    svgString = toInlineSvg(input);
  }

  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
