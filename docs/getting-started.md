# Getting Started with AbscomSVG

## Installation

Choose your runtime:

```bash
# npm
npm install abscomsvg

# Bun
bun add abscomsvg

# Deno
deno add npm:abscomsvg
```

### CDN (browser only)

```html
<script src="https://unpkg.com/abscomsvg"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/abscomsvg"></script>
```

---

## Your First SVG

### 1. Create an HTML page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My First AbscomSVG</title>
</head>
<body>
  <!-- Empty SVG container — we'll fill it with code -->
  <svg id="canvas" width="500" height="300" xmlns="http://www.w3.org/2000/svg"></svg>

  <script src="https://unpkg.com/abscomsvg"></script>
  <script>
    // All your code goes here
  </script>
</body>
</html>
```

The `<svg>` element is your canvas. The `id="canvas"` lets us reference it from JavaScript.

### 2. Draw a circle

Add this inside the second `<script>` tag:

```js
const c = AbscomSVG.circle(100, 75, 60, 'tomato');
AbscomSVG.render('canvas', c);
```

**What happens?**
- `circle(100, 75, 60, 'tomato')` creates a **definition object** — a plain `{ type: 'circle', attrs: {...} }`
- `render('canvas', c)` turns that object into real DOM nodes inside your `<svg>`

The circle appears at (100, 75) with radius 60, filled tomato-red.

### 3. Add more shapes

```js
AbscomSVG.render('canvas', [
  AbscomSVG.circle(80, 80, 60, 'tomato'),
  AbscomSVG.rect(180, 30, 120, 90, 'dodgerblue'),
  AbscomSVG.text(20, 250, 'Hello AbscomSVG!', { fill: '#333', 'font-size': '20px' }),
]);
```

`render()` accepts a **single def** or an **array of defs**. Shapes layer in order.

---

## Understanding Definition Objects

Every creation helper returns a **definition object** — plain data, not a DOM element:

```js
const c = AbscomSVG.circle(100, 100, 50, 'red');
// → { type: 'circle', attrs: { cx: 100, cy: 100, r: 50, fill: 'red' } }
```

You can inspect, modify, or pass this object around freely:

```js
// Manually change an attribute
c.attrs.fill = 'blue';

// Add an ID for DOM-diffing
c.id = 'myCircle';

// Add children (animations, nested elements)
c.children = [AbscomSVG.animate('r', '50', '70', '1s', 'indefinite')];
```

**Why objects and not DOM?** Because you can create them anywhere — on a server, in a test, or before the page loads. Only `render()` needs the DOM.

---

## Adding Styles

Use style utilities to modify definitions:

```js
const c = AbscomSVG.circle(100, 100, 50, 'gold');

// Chain style helpers — they mutate and return the def
AbscomSVG.withStroke(c, '#333', 3);
AbscomSVG.withOpacity(c, 0.8);
AbscomSVG.withClass(c, 'highlight');

// Or use shorthand
AbscomSVG.fill(c, 'crimson');
AbscomSVG.stroke(c, 'black', 2);
AbscomSVG.hide(c);  // sets display: none
AbscomSVG.show(c);  // removes display attribute
```

All style utilities **mutate** the def in-place and return it for chaining:

```js
const c = AbscomSVG.withStroke(
  AbscomSVG.withOpacity(
    AbscomSVG.circle(50, 50, 40, 'gold'),
    0.7,
  ),
  '#333', 2,
);
```

---

## Handling Events

Attach event handlers directly on the def:

```js
const btn = {
  ...AbscomSVG.rect(10, 10, 100, 50, 'steelblue'),
  id: 'myButton',
  events: {
    click: [() => alert('Clicked!')],
    mouseenter: [() => console.log('hover')],
  },
};

AbscomSVG.render('canvas', btn);
```

Events automatically clean up when you re-render (handlers are removed and re-added). Use `{ callback, options }` for `once: true` or `passive: true`:

```js
events: {
  click: [{ callback: handler, options: { once: true } }],
}
```

---

## Animating

Place `animate()`, `animateTransform()`, or `animationSet()` as **children** of the element to animate:

```js
const pulsingCircle = {
  ...AbscomSVG.circle(100, 100, 30, 'mediumpurple'),
  children: [
    AbscomSVG.animate('r', '30', '60', '1.5s', 'indefinite'),
  ],
};

const spinningRect = {
  ...AbscomSVG.rect(250, 50, 80, 80, 'coral'),
  id: 'spinner',
  children: [
    AbscomSVG.animateTransform('rotate', '0 290 90', '360 290 90', '3s', 'indefinite'),
  ],
};

AbscomSVG.render('canvas', [pulsingCircle, spinningRect]);
```

---

## Transforms

Transform helpers return **strings**, not objects. Assign them to `def.attrs.transform`:

```js
const r = AbscomSVG.rect(0, 0, 60, 60, 'dodgerblue');

// Compose multiple transforms
r.attrs.transform = AbscomSVG.composeTransforms(
  AbscomSVG.translate(100, 50),
  AbscomSVG.rotate(45, 30, 30),
  AbscomSVG.scale(1.2),
);
```

Available: `translate(x, y?)`, `rotate(angle, cx?, cy?)`, `scale(x, y?)`, `skewX(angle)`, `skewY(angle)`, `composeTransforms(...)`, `buildTransform(...)`.

---

## Using the PathBuilder

For complex paths, chain commands and call `.build()`:

```js
const d = new AbscomSVG.PathBuilder()
  .M(10, 10)         // move to
  .C(40, 5, 60, 40, 100, 20)  // cubic curve
  .Q(120, 40, 140, 10)         // quadratic curve
  .Z()                // close path
  .build();

const p = AbscomSVG.path(d, 'gold');
AbscomSVG.withStroke(p, '#333', 2);
```

---

## Server-Side Usage

Creation helpers work in **any** JavaScript runtime:

```js
import { circle, rect, text } from 'abscomsvg';

const c = circle(100, 100, 60, 'gold');
// c is a plain object — no DOM involved
```

`render()` throws in Node.js/Bun because it needs the browser DOM. For server-side SVG generation, serialize defs to markup manually (see the [Architecture doc](./architecture.md) for a serializer example).

---

## What's Next?

- **[Guide](./guide.md)** — Deep dive into every feature
- **[Examples](../examples/)** — Open in your browser and experiment
- **[API Reference](./api-reference.md)** — Complete function listing
- **[Architecture](./architecture.md)** — How the library works internally
