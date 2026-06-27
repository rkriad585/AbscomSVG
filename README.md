# AbscomSVG v0.2.963

A lightweight TypeScript framework for dynamic SVG generation and manipulation — works in browsers, Node.js, and Bun.

**Author:** [rkriad585](https://github.com/rkriad585)

[![npm](https://img.shields.io/npm/v/abscomsvg)](https://www.npmjs.com/package/abscomsvg)
[![license](https://img.shields.io/npm/l/abscomsvg)](LICENSE)
![build](https://img.shields.io/badge/build-passing-brightgreen)
![tests](https://img.shields.io/badge/tests-213-passing-brightgreen)

## Documentation

| Resource | Description |
|---|---|
| [`docs/overview.md`](docs/overview.md) | Project overview, design decisions, architecture summary |
| [`docs/getting-started.md`](docs/getting-started.md) | Installation and first steps |
| [`docs/guide.md`](docs/guide.md) | Comprehensive usage guide with examples |
| [`docs/api-reference.md`](docs/api-reference.md) | Full API reference (100+ functions) |
| [`docs/architecture.md`](docs/architecture.md) | Internal architecture and build system |
| [`examples/`](examples/) | 17+ runnable HTML demos |

## Quick start

### Browser (CDN)

```html
<svg id="canvas" width="300" height="200" xmlns="http://www.w3.org/2000/svg"></svg>
<script src="https://unpkg.com/abscomsvg@0.2.963"></script>
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
import { circle, rect, withStroke, transform, FilterBuilder, neon } from 'abscomsvg';

// Build definition objects (works in any runtime)
const def = withStroke(circle(50, 50, 40, 'gold'), 'black', 2);
def.attrs.transform = transform('rotate', 45, 50, 50);

// Filters — chain a blur
const blur = new FilterBuilder('myBlur').blur(4).build();

// Neon glow effect — shorthand
const glow = neon('glow', '#ff00ff', 8);

// Browser: render to live SVG DOM
// import { render } from 'abscomsvg';
// render('canvas', def);
```

## Key features

- **100+ creation helpers** — basic shapes, complex shapes, containers, gradients, markers, paths
- **Color utilities** — 21 functions: parse, lighten, darken, mix, complementary, palettes, random colors
- **SVG filters** — `FilterBuilder` class with 21 methods + 10 shorthand helpers (blur, dropShadow, glow, neon, outline, etc.)
- **Animations** — `easing()`, `fadeIn()`, `fadeOut()`, `pulse()`, `spin()`, `bounce()`, `shake()`, `slideIn()`, `grow()`
- **Layout helpers** — `responsiveSvg()`, `autoViewBox()`, `grid()`, `stack()`
- **Theming system** — token-based themes with `applyTheme()`, built-in `neutralTheme`
- **Serialization** — `toInlineSvg()`, `toDataUri()`, `downloadSvg()`
- **Pre-built icons** — 19 symbol functions (home, search, user, heart, clock, etc.)
- **DOM-diffing renderer** — updates only what changed (keyed by `id`)
- **Works everywhere** — creation helpers in Node/Bun/Browser; render in browser
- **No runtime dependencies**
- **TypeScript** — full type declarations generated

## Project structure

```
src/          — TypeScript source (14 modules)
examples/     — 17+ HTML demos + Node.js server-side example
docs/         — 5 documentation files
tests/        — 213 tests (bun test)
dist/         — Build output (ESM, CJS, IIFE + .d.ts)
```

## License

MIT © 2025 rkriad585
