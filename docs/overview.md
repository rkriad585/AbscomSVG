# AbscomSVG Overview

A lightweight TypeScript framework for creating and managing SVG graphics using plain JavaScript objects. Works in browsers, Node.js, and Bun.

## What is AbscomSVG?

Most SVG libraries either (a) wrap every SVG tag in a heavy class hierarchy, or (b) make you write raw template strings. AbscomSVG takes a middle path: **plain-object definitions** that describe SVG elements without creating DOM nodes.

```js
// A circle as a plain object — no DOM needed
const c = circle(50, 50, 40, 'gold')
// → { type: 'circle', attrs: { cx: 50, cy: 50, r: 40, fill: 'gold' } }
```

This means your SVG description is just data — you can create it on a server, in a test, or in a browser worker. Only when you call `render()` does it touch the DOM.

## Who is this for?

- **Beginners** who want to create SVG graphics without learning low-level DOM APIs
- **App developers** who need dynamic, data-driven SVG (charts, diagrams, games)
- **Backend developers** generating SVG on the server (e.g., API responses, PDF generation)

## Key Ideas

| Concept | What it means |
|---|---|
| **Definition objects** | Every shape is a plain `{ type, attrs }` object — no DOM, no `new` keyword |
| **ID-based diffing** | Elements with an `id` update in-place on re-render; elements without `id` are recreated |
| **50+ helpers** | Shapes, containers, gradients, animations, transforms, path builder, color utilities |
| **No dependencies** | Zero runtime packages — just TypeScript and tsup for building |
| **Dual module** | ESM (`.mjs`), CommonJS (`.cjs`), and browser IIFE all from one build |

## Quick Example

```html
<script src="https://unpkg.com/abscomsvg"></script>
<script>
  AbscomSVG.render('mySvg', [
    AbscomSVG.circle(100, 100, 80, 'steelblue'),
    AbscomSVG.rect(160, 40, 120, 90, 'coral'),
    AbscomSVG.text(40, 220, 'Hello SVG!', { fill: '#333', 'font-size': '22px' }),
  ]);
</script>
```

## Next Steps

- **[Getting Started](./getting-started.md)** — Install and create your first SVG
- **[Guide](./guide.md)** — Walk through every feature with examples
- **[API Reference](./api-reference.md)** — Complete function listing
- **[Architecture](./architecture.md)** — How the library works inside
- **[Examples](../examples/)** — Runnable HTML files (open in browser)
