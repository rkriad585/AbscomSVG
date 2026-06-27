/**
 * Server-side SVG generation with AbscomSVG (Node.js / Bun).
 *
 * AbscomSVG's creation helpers work in any runtime. Only `render()` requires
 * a browser DOM. For server-side use, build definition objects and serialize
 * them to SVG markup yourself.
 *
 * Run with: node examples/node-server.js
 * Or:       bun examples/node-server.js
 */

import { circle, rect, text, withStroke, path } from '../src/index.js';

function serializeAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${String(v)}"`)
    .join(' ');
}

function serialize(def) {
  const attrs = serializeAttrs(def.attrs);
  const id = def.id ? ` id="${def.id}"` : '';
  const children = (def.children || []).map(serialize).join('');

  if (children || def.text) {
    return `<${def.type}${id} ${attrs}>${def.text || ''}${children}</${def.type}>`;
  }
  return `<${def.type}${id} ${attrs} />`;
}

function serializeSvg(width, height, defs) {
  const inner = defs.map(serialize).join('\n  ');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`,
    `  ${inner}`,
    `</svg>`,
  ].join('\n');
}

// --- Build a scene ---

const c = withStroke(circle(100, 100, 60, 'gold'), '#333', 3);
const r = rect(220, 40, 120, 90, 'dodgerblue');
const t = text(20, 200, 'Hello from Node.js!', { fill: '#333', 'font-size': '20px' });
const p = withStroke(path('M250 200 Q300 260 350 200', 'none'), '#c0c', 4);

const svg = serializeSvg(400, 250, [c, r, t, p]);

console.log(svg);

// Write to file (uncomment to save):
// await Bun.write('output.svg', svg);
// Or with Node.js:
// import { writeFileSync } from 'fs';
// writeFileSync('output.svg', svg);
