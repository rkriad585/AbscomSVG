# Getting Started

## Installation

### npm

```sh
npm install abscomsvg
```

### Bun

```sh
bun add abscomsvg
```

### CDN (browser only)

```html
<script src="https://unpkg.com/abscomsvg@0.02.963"></script>
<script>
  AbscomSVG.circle(50, 50, 40, 'red');
</script>
```

## Usage

### Browser (ESM import)

```js
import { circle, render } from 'abscomsvg';

const def = circle(50, 50, 40, 'red');
render('myCanvas', def);
```

```html
<svg id="myCanvas" width="400" height="400" xmlns="http://www.w3.org/2000/svg"></svg>
```

### Browser (CDN script tag)

```html
<svg id="myCanvas" width="400" height="400" xmlns="http://www.w3.org/2000/svg"></svg>

<script src="https://unpkg.com/abscomsvg@0.02.963"></script>
<script>
  AbscomSVG.render('myCanvas', AbscomSVG.circle(50, 50, 40, 'red'));
</script>
```

### Node.js / Bun (server-side, no DOM)

```js
import { circle, rect, withStroke, transform } from 'abscomsvg';

const def = withStroke(circle(50, 50, 40, 'gold'), 'black', 2);
def.attrs.transform = transform('rotate', 45, 50, 50);

// Serialize to SVG string manually
function serialize(def) {
  const attrs = Object.entries(def.attrs)
    .map(([k, v]) => `${k}="${v}"`).join(' ');
  return `<${def.type} ${attrs}>${def.text || ''}</${def.type}>`;
}

console.log(serialize(def));
```

`render()` is not available in Node.js — it throws a clear error. Use the helpers to build definitions and serialize them yourself, or use a DOM polyfill like jsdom.

## Your first SVG

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

## Next steps

- Browse `examples/` for runnable HTML demos
- Read `docs/guide.md` for a deeper walkthrough
- Check `docs/api-reference.md` for the full API
