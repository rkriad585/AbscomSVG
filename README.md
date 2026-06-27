# AbscomSVG v0.02.963

A lightweight TypeScript framework for dynamic SVG generation and manipulation — works in browsers, Node.js, and Bun.

**Author:** [rkriad585](https://github.com/rkriad585)

[![npm](https://img.shields.io/npm/v/abscomsvg)](https://www.npmjs.com/package/abscomsvg)
[![license](https://img.shields.io/npm/l/abscomsvg)](LICENSE)

## Documentation

| Resource | Description |
|----------|-------------|
| [`docs/overview.md`](docs/overview.md) | Project overview, design decisions, architecture summary |
| [`docs/getting-started.md`](docs/getting-started.md) | Installation and first steps |
| [`docs/guide.md`](docs/guide.md) | Comprehensive usage guide with examples |
| [`docs/api-reference.md`](docs/api-reference.md) | Full API reference |
| [`docs/architecture.md`](docs/architecture.md) | Internal architecture and build system |
| [`examples/`](examples/) | Runnable HTML demos and server-side examples |

## Quick start

### Browser (CDN)

```html
<svg id="canvas" width="300" height="200" xmlns="http://www.w3.org/2000/svg"></svg>
<script src="https://unpkg.com/abscomsvg@0.02.963"></script>
<script>
  AbscomSVG.render('canvas', [
    AbscomSVG.circle(80, 80, 50, 'tomato'),
    AbscomSVG.rect(150, 30, 100, 80, 'dodgerblue'),
    AbscomSVG.text(20, 150, 'Hello!', { fill: '#333', 'font-size': '24px' }),
  ]);
</script>
```

### npm / Bun

```sh
npm install abscomsvg
```

```js
import { circle, rect, withStroke, transform } from 'abscomsvg';

// Build definition objects (works in any runtime)
const def = withStroke(circle(50, 50, 40, 'gold'), 'black', 2);
def.attrs.transform = transform('rotate', 45, 50, 50);

// Server-side: serialize to SVG string
console.log(`<${def.type} ${Object.entries(def.attrs).map(([k,v]) => `${k}="${v}"`).join(' ')} />`);

// Browser: render to live SVG DOM
// import { render } from 'abscomsvg';
// render('canvas', def);
```

## Key features

- **Declarative SVG creation** via plain object definitions (no DOM API)
- **DOM-diffing renderer** — updates only what changed (keyed by `id`)
- **Works everywhere** — creation helpers in Node/Bun/Browser; render in browser
- **Animations** — declarative `<animate>` children
- **Event handling** — attach events with `{ once: true }` and automatic cleanup on re-render
- **No runtime dependencies**

## Project structure

```
src/          — TypeScript source
examples/     — Runnable HTML demos + Node.js server-side example
docs/         — Documentation
tests/        — Smoke tests (creation helpers)
dist/         — Build output (ESM, CJS, IIFE)
```
