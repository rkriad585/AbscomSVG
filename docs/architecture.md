# Architecture

## Design Goals

- **Runtime agnostic** — SVG definitions are plain data, usable anywhere
- **Zero dependencies** — no runtime packages
- **Small bundle** — ~17 KB ESM, ~19 KB CJS, ~20 KB IIFE
- **Predictable rendering** — DOM-diffing based on element IDs

## Module Layout

```
src/
  types.ts      — SvgDef, EventHandler, GradientStop interfaces
  elements.ts   — All creation helpers + utilities (~700 lines)
  renderer.ts   — DOM rendering + RenderOptions (~240 lines)
  index.ts      — Public API re-exports
  browser.ts    — IIFE entry (re-exports index)
```

### types.ts (18 lines)

Pure type definitions. Zero runtime code.

- `SvgDef` — the core definition object interface
- `EventHandler` — function or `{ callback, options }` object
- `GradientStop` — gradient stop descriptor

### elements.ts (~700 lines)

All element creation helpers and utilities. **Zero DOM dependency** — works in any JavaScript runtime.

Organized into sections:
1. **Shape helpers** — `circle`, `rect`, `ellipse`, `line`, `polygon`, `path`, `text`, `image`
2. **Container helpers** — `svg`, `group`, `defs`, `symbol`, `clipPath`, `mask`
3. **Gradient helpers** — `linearGradient`, `radialGradient`, `stop`
4. **Reference helpers** — `marker`, `use`, `tspan`
5. **Animation helpers** — `animate`, `animateTransform`, `animationSet`
6. **Transform helpers** — `translate`, `rotate`, `scale`, `skewX`, `skewY`, `composeTransforms`, `buildTransform`, `transform`
7. **Style utilities** — `withStroke`, `withClass`, `withStyle`, `withOpacity`, `setFill`, `fill`, `stroke`, `show`, `hide`
8. **Composition utilities** — `cloneDef`, `mergeDefs`, `createDef`
9. **Attribute utilities** — `attr`, `removeAttr`, `attrs`
10. **Position/size getters** — `cx`, `cy`, `r`, `x`, `y`, `width`, `height`
11. **Color helpers** — `toHex`, `toRgb`
12. **PathBuilder class** — fluent SVG path data construction

### renderer.ts (~240 lines)

Browser-only DOM rendering. **Throws** in Node.js/Bun.

Core algorithm:
1. Scan existing children of the SVG container by `id`
2. For each def: if it has a matching `id`, **update** in-place; otherwise **create** new
3. Remove any stale elements (IDs in DOM but not in the new defs)
4. Clean up old event listeners via a `WeakMap`

### index.ts (63 lines)

Re-exports everything from `elements.ts` and `renderer.ts`, plus types. This is what consumers import:

```ts
import { circle, rect, render } from 'abscomsvg'
```

### browser.ts (1 line)

```ts
export * from './index'
```

Build entry for the IIFE bundle. Exposes everything as `window.AbscomSVG`.

---

## Build System (tsup)

```
npm run build   → tsup
```

Outputs three formats + declarations:

| File | Format | Use case |
|---|---|---|
| `dist/index.mjs` | ESM | `import { circle } from 'abscomsvg'` |
| `dist/index.cjs` | CommonJS | `const { circle } = require('abscomsvg')` |
| `dist/abscomsvg.iife.js` | IIFE | `<script src="abscomsvg.iife.js">` → `window.AbscomSVG` |
| `dist/index.d.ts` | Declarations | TypeScript auto-complete |

The IIFE entry uses a named format (`{ abscomsvg: 'src/browser.ts' }`) so the output file is `abscomsvg.iife.js` (not `browser.iife.js`).

---

## Rendering Algorithm

When `render()` is called:

### First render
```
For each def:
  → beforeCreate(def)           // hook
  → validateDef(def)            // warn about missing required attrs
  → createElement(def):         // DOM node
      - set attributes
      - set text content
      - attach event listeners (tracked in WeakMap)
      - recursively create children
  → append to SVG container
  → afterCreate(el, def)        // hook
```

### Subsequent renders (diffing)
```
Collect existing children by id:

For each def:
  if def.id matches existing[id]:
    → beforeUpdate(el, def)     // hook
    → updateElement(el, def):
        - remove stale attributes
        - set/update attributes
        - update text content
        - remove old event listeners (from WeakMap)
        - attach new event listeners
        - recursively diff children
    → afterUpdate(el, def)      // hook
    → delete existing[id]
  else:
    → createElement(def)        // same as first render
    → append to SVG container

Remove remaining existing[ids] (stale elements)
```

### Key behavior
- **With `id`**: update in-place (attributes diffed, events cleaned up)
- **Without `id`**: always appended as new
- **Stale IDs**: removed from DOM

---

## Event Listener Management

Event listeners are tracked with a `WeakMap<SVGElement, Record<string, EventListener[]>>`:

- On **create**: handlers are added via `addEventListener()` and stored in the map
- On **update**: old handlers are removed via `removeEventListener()` and new ones added
- On **remove**: the `WeakMap` automatically releases references when the element is garbage collected

---

## Why Definition Objects?

**Instead of** creating DOM elements directly, AbscomSVG represents SVG as plain objects:

```js
// Definition object (works everywhere)
const c = circle(50, 50, 40, 'red')
// → { type: 'circle', attrs: { cx: 50, cy: 50, r: 40, fill: 'red' } }

// DOM element (browser only)
// const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
```

Benefits:
- **Server-side** — generate SVG markup in Node.js without jsdom
- **Testing** — assert on plain objects, no DOM setup needed
- **Workers** — create defs in Web Workers, send to main thread for rendering
- **Serialization** — `JSON.stringify(def)` works out of the box
- **Composition** — `cloneDef`, `mergeDefs`, and spread operators work naturally

---

## Serialization (Server-Side)

Since `render()` requires a browser, generate SVG markup manually for Node.js/Bun:

```js
function serializeAttrs(attrs) {
  return Object.entries(attrs)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')
}

function serialize(def) {
  const attrs = serializeAttrs(def.attrs)
  const children = (def.children || []).map(serialize).join('')
  const text = def.text || ''

  if (children || text) {
    return `<${def.type} ${attrs}>${text}${children}</${def.type}>`
  }
  return `<${def.type} ${attrs} />`
}
```

---

## Validation

`validateDef()` checks for required attributes on common element types:

| Type | Required attrs |
|---|---|
| `circle` | `cx`, `cy`, `r` |
| `rect` | `x`, `y`, `width`, `height` |
| `ellipse` | `cx`, `cy`, `rx`, `ry` |
| `line` | `x1`, `y1`, `x2`, `y2` |
| `polygon` | `points` |
| `path` | `d` |
| `image` | `xlink:href` |
| `text` | `text` content must not be null |

Validation logs warnings via `console.error` but does **not** throw. Disable with `validate: false` in `RenderOptions`.
