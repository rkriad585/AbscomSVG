# AbscomSVG Overview

AbscomSVG is a lightweight TypeScript framework for dynamic SVG generation and manipulation. It lets you create, update, and animate SVG elements using declarative JavaScript objects instead of raw DOM APIs.

## What it does

- **Declarative SVG creation** — Build SVG elements via plain object definitions: `circle(10, 20, 30, 'red')` returns `{ type: 'circle', attrs: { cx: 10, cy: 20, r: 30, fill: 'red' } }`.
- **DOM-diffing renderer** — `render()` reconciles definition objects against real SVG DOM, updating only what changed (keyed by `id`).
- **Animation** — Supports SVG `<animate>` children for declarative animations.
- **Event handling** — Attach DOM events to SVG elements with support for options like `{ once: true }`.

## Key design decisions

### Definition objects, not DOM elements

All creation helpers return plain JavaScript objects. This means:

- **Works in any runtime** — Node.js, Bun, Deno, and browser can all build definitions.
- **No DOM dependency for creation** — Only `render()` requires a browser.
- **Simple to serialize** — Definitions can be serialized to SVG markup or JSON.

### ID-based diffing

Elements with an `id` attribute are updated in-place on subsequent `render()` calls. Elements without `id` are appended as new nodes each time. This makes efficient updates straightforward:

```js
// First render
render('svg', [{ ...circle(10, 10, 20, 'red'), id: 'dot' }]);

// Second render — 'dot' updates in-place, no DOM removal/recreation
render('svg', [{ ...circle(20, 20, 30, 'blue'), id: 'dot' }]);
```

### Browser / Node.js split

| Layer | Browser | Node.js / Bun |
|-------|---------|---------------|
| Creation helpers (`circle`, `rect`, ...) | ✅ | ✅ |
| Modifiers (`withStroke`, `transform`) | ✅ | ✅ |
| `render()` | ✅ | ❌ (throws) |

## Package structure

```
src/
  index.ts      — Public API: re-exports all helpers, render, and types
  types.ts      — SvgDef & EventHandler interfaces
  elements.ts   — Creation helpers (circle, rect, ...) + withStroke, transform
  renderer.ts   — DOM rendering: render(), createElement(), updateElement()
  browser.ts    — IIFE/CDN entrypoint
```

For server-side SVG generation, use the creation helpers to build definitions and serialize the objects to SVG markup yourself. See `examples/node-server.js`.
