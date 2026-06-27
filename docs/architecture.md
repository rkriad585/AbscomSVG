# Architecture

## High-level design

AbscomSVG separates SVG _definition_ from SVG _rendering_. This means the core data types work in any JavaScript runtime, while DOM operations are isolated in a single renderer module.

```
User code
    │
    ├── circle(10, 20, 30, 'red')
    │       │
    │       ▼
    │   { type: 'circle', attrs: { cx:10, cy:20, r:30, fill:'red' } }
    │       │
    │       ├── render('svg', def)     ← browser only
    │       │       │
    │       │       ▼
    │       │   document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    │       │
    │       └── serialize(def)         ← user-written, any runtime
    │               │
    │               ▼
    │           '<circle cx="10" cy="20" r="30" fill="red" />'
    │
    └── withStroke(def, 'black', 2)
            │
            ▼
        def.attrs.stroke = 'black'
        def.attrs['stroke-width'] = 2
```

## Module responsibilities

| Module | Exports | Dependencies | Runtime |
|--------|---------|-------------|---------|
| `types.ts` | `SvgDef`, `EventHandler` | None | Any |
| `elements.ts` | `circle`, `rect`, ..., `withStroke`, `transform` | `types.ts` | Any |
| `renderer.ts` | `render` | `types.ts` | Browser only |
| `index.ts` | Re-exports everything above | All modules | Any |
| `browser.ts` | Re-exports index (IIFE target) | `index.ts` | Browser |

## Build targets

`tsup` produces three output formats from two entry points:

### `src/index.ts` → ESM + CJS

Used by bundlers, Node.js, and Bun. Tree-shakeable. No globals.

- `dist/abscomsvg.mjs` — ESM (`import { circle } from 'abscomsvg'`)
- `dist/abscomsvg.cjs` — CommonJS (`const { circle } = require('abscomsvg')`)
- `dist/index.d.ts` — TypeScript declarations

### `src/browser.ts` → IIFE

Used by CDN `<script>` tags. Attaches all exports to `window.AbscomSVG`.

- `dist/abscomsvg.iife.js` — Self-contained IIFE bundle

## Render cycle

1. `render()` receives a container (SVG element or ID string) and a definition or array of definitions.
2. It scans the container's current children, building a map of existing elements by `id`.
3. For each new definition:
   - If it has an `id` that matches an existing child, `updateElement()` is called (in-place update).
   - Otherwise, `createElement()` builds a new DOM node and appends it.
4. Any existing children whose `id` is not present in the new definitions are removed (stale cleanup).

## Internal state

The renderer maintains a `WeakMap<SVGElement, Record<string, EventListener[]>>` to track event listeners attached by the framework. This allows clean removal of old listeners when an element is re-rendered with different or no event handlers.

## No runtime dependencies

AbscomSVG has zero runtime dependencies. The only dev dependencies are `tsup` (bundler) and `typescript`.
