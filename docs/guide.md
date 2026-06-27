# AbscomSVG Guide

## Contents

- [Shapes](#shapes) — circle, rect, ellipse, line, polygon, path, text, image
- [Containers & Structure](#containers--structure) — svg, group, defs, symbol, clipPath, mask
- [Gradients](#gradients) — linear, radial, and stop definitions
- [Markers](#markers) — arrowheads and endpoint markers
- [References](#references) — use and tspan
- [Animations](#animations) — animate, animateTransform, set
- [Transforms](#transforms) — translate, rotate, scale, skew, compose, build
- [Style Utilities](#style-utilities) — fill, stroke, opacity, class, style, show/hide
- [Attribute Utilities](#attribute-utilities) — get, set, remove, multi-get/set
- [Position/Size Getters](#positionsize-getters) — cx, cy, r, x, y, width, height
- [Color Helpers](#color-helpers) — toHex, toRgb
- [PathBuilder](#pathbuilder) — fluent path data construction
- [Composition](#composition) — cloneDef, mergeDefs, createDef
- [Events](#events) — attaching handlers with auto-cleanup
- [Rendering](#rendering) — render(), RenderOptions, DOM-diffing
- [Server-Side SVG](#server-side-svg) — generating SVG without a browser

---

## Shapes

### Circle

```js
circle(cx, cy, r, fill?)
```

Required: center x, center y, radius. Fill is optional (defaults to `undefined`, which means no fill).

```js
circle(50, 50, 40, 'tomato')
// → { type: 'circle', attrs: { cx: 50, cy: 50, r: 40, fill: 'tomato' } }

// Transparent circle
circle(100, 100, 30)
```

### Rect

```js
rect(x, y, width, height, fill?, extraAttrs?)
```

`extraAttrs` is useful for rounded corners (`rx`, `ry`) or any SVG attribute not in the signature:

```js
// Basic
rect(10, 10, 200, 100, 'dodgerblue')

// Rounded corners
rect(0, 0, 50, 50, 'red', { rx: 5, ry: 5 })

// Without fill
rect(20, 20, 100, 80, undefined, { stroke: 'black', 'stroke-width': 2 })
```

### Ellipse

```js
ellipse(cx, cy, rx, ry, fill?, extraAttrs?)
```

Like `rect`, accepts extra SVG attributes:

```js
ellipse(100, 100, 50, 30, 'green')
ellipse(100, 100, 50, 30, 'green', { stroke: 'black', 'stroke-width': 2 })
```

### Line

```js
line(x1, y1, x2, y2, stroke?)
```

```js
line(0, 0, 100, 100, 'black')
```

### Polygon

```js
polygon(points, fill?)
```

Points is a string of `x,y` pairs separated by spaces:

```js
polygon('100,10 40,198 190,78', 'navy')
```

### Path

```js
path(d, fill?)
```

The `d` parameter is an SVG path data string. Use `PathBuilder` for complex paths.

```js
// Simple line
path('M10 10 L100 100')

// Quadratic curve
path('M10 10 Q50 50 90 10', 'none')

// Closed shape with stroke
path('M10 10 C20 20 40 5 50 15 Z', 'gold')
```

### Text

```js
text(x, y, content, attrs?)
```

`content` can be an empty string. Use `attrs` for font size, text-anchor, etc.:

```js
text(10, 20, 'Hello World')
text(100, 50, 'Centered', { fill: 'red', 'font-size': '24px', 'text-anchor': 'middle' })
text(50, 100, '', { fill: '#999', 'font-size': '14px' })  // empty string is valid
```

### Image

```js
image(href, x, y, width, height)
```

**Note:** Sets `xlink:href` (not `href`) for broad SVG renderer compatibility.

```js
image('https://example.com/logo.png', 10, 10, 100, 100)
image('data:image/svg+xml,...', 0, 0, 50, 50)
```

---

## Containers & Structure

### SVG root

```js
svg(width, height, viewBox?, attrs?)
```

Creates a root `<svg>` element. Automatically sets `xmlns`. Best for **nested SVG** or programmatic use (usually you already have an `<svg>` in HTML).

```js
svg(800, 600, '0 0 800 600')
svg(100, 100)
svg(500, 300, undefined, { 'aria-label': 'My drawing' })
```

### Group

```js
group(children?, attrs?)
```

Groups apply attributes to all children. Useful for transforms and shared styles:

```js
group([
  circle(10, 10, 5),
  rect(0, 0, 20, 20),
], { fill: 'red', transform: translate(50, 50) })

// Empty group (valid, just no-op)
group()
```

### Defs

```js
defs(children?)
```

Container for reusable definitions (gradients, markers, clip paths). Children are usually not rendered directly — they're referenced by `url(#id)`:

```js
defs([
  linearGradient('myGrad', 0, 0, 1, 0, [stop(0, 'red'), stop(1, 'blue')]),
  marker('arrow', { ... }, [path('M0 0 L10 5 L0 10 Z', '#333')]),
])
```

### Symbol

```js
symbol(id, viewBox, children?)
```

Defines a reusable graphic, referenced by `use('#id')`:

```js
symbol('icon', '0 0 24 24', [circle(12, 12, 10)])
```

### ClipPath

```js
clipPath(id, children?)
```

Defines a clipping region. The shapes inside determine what's visible:

```js
// Only the part of the rect that's inside the circle will show
clipPath('myClip', [circle(50, 50, 40)])

// Apply to any element via clip-path attribute:
rect(0, 0, 100, 100, 'blue', { 'clip-path': 'url(#myClip)' })
```

### Mask

```js
mask(id, children?)
```

Like clipPath but uses luminance: white = fully visible, black = fully hidden:

```js
// White rect = fully visible; black circle = hidden center
mask('myMask', [
  rect(0, 0, 100, 100, 'white'),
  circle(50, 50, 30, 'black'),
])

// Apply:
circle(50, 50, 40, 'red', { mask: 'url(#myMask)' })
```

---

## Gradients

Gradients live inside `defs()` and are referenced by `url(#id)`.

### Linear Gradient

```js
linearGradient(id, x1, y1, x2, y2, stops?)
```

Coordinates (x1, y1, x2, y2) define the gradient direction:

- `0, 0, 1, 0` = left to right
- `0, 0, 0, 1` = top to bottom
- `0, 1, 1, 0` = diagonal bottom-left to top-right

```js
defs([
  linearGradient('myGrad', 0, 0, 1, 0, [
    stop(0, 'red'),
    stop(0.5, 'yellow'),
    stop(1, 'blue'),
  ]),
])

// Apply to any shape:
rect(10, 10, 180, 180, 'url(#myGrad)')
```

### Radial Gradient

```js
radialGradient(id, cx, cy, r, stops?)
```

```js
defs([
  radialGradient('rg', '50%', '50%', '50%', [
    stop(0, 'white'),
    stop(1, '#222'),
  ]),
])

circle(100, 100, 90, 'url(#rg)')
```

### Stop

```js
stop(offset, color, opacity?)
```

Offset can be a number (0-1) or percentage string (`'50%'`):

```js
stop(0, 'red')
stop(0.5, 'blue', 0.5)
stop('100%', '#333')
```

---

## Markers

Markers draw arrowheads, bullet points, or other endpoint decorations on lines and paths:

```js
const arrow = marker('arrow', {
  markerWidth: 10,
  markerHeight: 10,
  refX: 9,
  refY: 5,
  orient: 'auto',      // rotates to match line direction
}, [
  path('M0 0 L10 5 L0 10 Z', '#333'),
])

// Apply via marker-end / marker-start / marker-mid:
const l = line(20, 60, 280, 60, '#333')
attr(l, 'marker-end', 'url(#arrow)')
attr(l, 'stroke-width', 2)

render('canvas', [defs([arrow]), l])
```

---

## References

### Use

```js
use(href, x?, y?, width?, height?)
```

References a `symbol()` or any element with an `id`. Uses modern `href` attribute.

```js
use('#icon', 10, 20, 50, 50)
use('#star')
```

### Tspan

```js
tspan(content, attrs?)
```

Inline text formatting inside a `text` element:

```js
// Currently rendered as a child of text
// (no text() wrapping in this example — use children array)
{
  ...text(10, 20, '', { fill: '#333' }),
  children: [
    tspan('bold', { 'font-weight': 'bold', fill: 'red' }),
    tspan(' normal'),
  ],
}
```

---

## Animations

All animation elements are added as **children** of the element they animate.

### Animate

Animates a single attribute over time:

```js
{
  ...circle(100, 100, 30, 'red'),
  children: [
    animate('r', '30', '60', '1.5s', 'indefinite'),
  ],
}
// Circle pulses between radius 30 and 60, forever
```

### AnimateTransform

Animates the `transform` attribute. Automatically sets `attributeName="transform"`:

```js
{
  ...rect(0, 0, 80, 80, 'coral'),
  id: 'spinner',
  children: [
    animateTransform('rotate', '0 40 40', '360 40 40', '3s', 'indefinite'),
  ],
}
// Rectangle rotates around its center (40, 40) continuously
```

Parameters: `animateTransform(type, from, to, dur, repeatCount?)`. `repeatCount` defaults to `'indefinite'` if omitted.

### Set

Sets an attribute instantly at a specific time (no transition):

```js
// Hide after 3 seconds
{
  ...circle(50, 50, 30, 'blue'),
  children: [
    animationSet('opacity', '0', '3s'),
  ],
}

// Hide on click
{
  ...rect(10, 10, 100, 50, 'red'),
  id: 'clickHide',
  children: [
    animationSet('visibility', 'hidden', 'click'),
  ],
}
```

---

### Easing curves

Use `easing()` to get SVG `calcMode`, `keySplines`, and `keyTimes` for a named curve:

```js
{
  type: 'animate',
  attrs: {
    attributeName: 'opacity',
    from: '0', to: '1', dur: '1s',
    ...easing('ease-in-out'),
  },
}
```

Supported names: `'linear'`, `'ease'`, `'ease-in'`, `'ease-out'`, `'ease-in-out'`, `'bounce'`.

### Convenience animation wrappers

These helpers create common animations without writing raw `<animate>` definitions:

| Helper | What it does |
|---|---|
| `fadeIn(def, dur?)` | Wraps in `<g>` with opacity 0→1 (fill=freeze) |
| `fadeOut(def, dur?)` | Wraps in `<g>` with opacity 1→0 (fill=freeze) |
| `pulse(def, attr, from, to, dur?)` | Mutates def: oscillates `attr` indefinitely |
| `spin(def, dur?)` | Mutates def: continuous 360° rotation |
| `bounce(def, dur?)` | Mutates def: vertical Y bounce |
| `shake(def, dur?)` | Mutates def: horizontal X shake |
| `slideIn(def, dir?, dur?)` | Mutates def: slide from `left/right/top/bottom` |
| `grow(def, dur?)` | Mutates def: scale 0→1 |

Mutating helpers (`pulse`, `spin`, `bounce`, `shake`, `slideIn`, `grow`) return the original `def` with an `<animate>` or `<animateTransform>` child appended:

```js
const box = rect(50, 50, 100, 100, 'coral');
pulse(box, 'rx', '0', '20', '1s');
// box.children now contains the animate definition
```

---

## Transforms

All transform helpers return **strings**. Assign them to `def.attrs.transform`.

### Basic helpers

```js
translate(100, 50)          // → "translate(100,50)"
translate(50)               // → "translate(50)"
rotate(45, 50, 50)          // → "rotate(45,50,50)"
rotate(45)                  // → "rotate(45)"
scale(2, 3)                 // → "scale(2,3)"
scale(2)                    // → "scale(2)"
skewX(30)                   // → "skewX(30)"
skewY(15)                   // → "skewY(15)"
```

### Composing transforms

Combine multiple transforms with `composeTransforms()`:

```js
const r = rect(0, 0, 60, 60, 'dodgerblue')
r.attrs.transform = composeTransforms(
  translate(100, 50),
  rotate(45, 30, 30),
  scale(1.2),
)
// Result: "translate(100,50) rotate(45,30,30) scale(1.2)"
```

`composeTransforms` filters falsy values, making conditional transforms easy:

```js
composeTransforms(
  translate(10),
  shouldRotate && rotate(45),
)
```

### Build from structured steps

For programmatic transform generation:

```js
buildTransform(
  { type: 'translate', values: [100, 50] },
  { type: 'rotate', values: [45, 50, 50] },
)
// → "translate(100,50) rotate(45,50,50)"
```

### Generic transform

```js
transform('rotate', 45, 50, 50)   // → "rotate(45,50,50)"
transform('matrix', 1, 0, 0, 1, 0, 0)  // → "matrix(1,0,0,1,0,0)"
```

---

## Layout Helpers

Layout helpers arrange elements, create responsive SVGs, and compute viewBoxes.

### Responsive SVG

`responsiveSvg()` creates an `<svg>` that scales to fit its container:

```js
const svgDef = responsiveSvg(800, 600, circle(400, 300, 100, 'red'))
// width="100%", viewBox="0 0 800 600" → scales fluidly
```

Use `autoViewBox()` to compute a `viewBox` from existing definitions:

```js
const shapes = [
  circle(50, 50, 40, 'red'),
  rect(80, 20, 100, 60, 'blue'),
]
const vb = autoViewBox(shapes, 10)
// → "0 0 190 100"  (tight bounding box + 10px padding)
```

### Grid

`grid()` arranges defs into a grid. Each def keeps its local coordinates — it's wrapped in a `<g>` with `transform`:

```js
const dots = [1, 2, 3, 4].map(n =>
  circle(10, 10, 8, palette('vibrant')[n - 1])
)
const arranged = grid(dots, 2, { cellWidth: 40, cellHeight: 40, x: 20, y: 20 })
render('#mySvg', arranged)
```

### Stack

`stack()` arranges defs vertically or horizontally with a gap between them:

```js
const boxes = [1, 2, 3].map(n =>
  rect(0, 0, 80, 50, palette('pastel')[n])
)
const arranged = stack(boxes, 'vertical', { gap: 15, x: 10, y: 10 })
// Items are placed at (10,10), (10,75), (10,140)
```

The stack direction defaults to `'vertical'`. For horizontal, pass `'horizontal'`.

---

## Style Utilities

All style utilities **mutate** the def in-place and return it (for chaining).

### Fill and Stroke

```js
const c = circle(50, 50, 40, 'gold')

setFill(c, 'blue')        // changes fill to blue
fill(c, 'blue')           // alias
stroke(c, 'black')        // sets stroke color
stroke(c, 'black', 2)     // sets stroke color + width
withStroke(c, '#333', 3)  // sets both stroke and stroke-width
```

### Opacity

```js
withOpacity(c, 0.5)  // 0 = invisible, 1 = opaque
```

### CSS Class

```js
withClass(c, 'highlight', 'active')
// c.attrs.class === 'highlight active'

// Appends to existing class:
withClass(c, 'extra')
// c.attrs.class === 'highlight active extra'
```

### Inline Style

```js
withStyle(c, { fill: 'red', strokeWidth: 2, fontFamily: 'Arial' })
// c.attrs.style === 'fill: red; stroke-width: 2; font-family: Arial'
```

CamelCase keys are automatically converted to kebab-case (`strokeWidth` → `stroke-width`).

### Show / Hide

```js
hide(c)   // sets display: none (element still exists, just invisible)
show(c)   // removes display attribute (makes it visible again)
```

**Common pitfall:** `hide()` sets `display: none`. To hide again after `show()`, you need another `hide()` call — `show()` deletes the attribute entirely.

---

## Attribute Utilities

### Get / Set single attribute

```js
// Getter
attr(circle(10, 20, 30), 'cx')  // → 10

// Setter (mutates, returns def for chaining)
attr(def, 'fill', 'blue')
attr(def, 'stroke-width', 3)
```

### Remove an attribute

```js
removeAttr(def, 'fill')  // def.attrs.fill === undefined
```

### Multi-attribute access

```js
// Get all attrs (shallow copy — safe to modify)
const a = attrs(myRect)  // → { x: 10, y: 20, width: 100, ... }

// Set multiple attrs at once (mutates)
attrs(def, { fill: 'blue', stroke: 'black' })
```

---

## Position / Size Getters

Convenience getters that pull common positional attributes:

```js
cx(circle(50, 50, 40))   // → 50
cy(circle(50, 50, 40))   // → 50
r(circle(50, 50, 40))    // → 40

x(rect(10, 20, 100, 80))   // → 10
y(rect(10, 20, 100, 80))   // → 20
width(rect(10, 20, 100, 80))   // → 100
height(rect(10, 20, 100, 80))  // → 80
```

Returns `undefined` if the attribute isn't set.

---

## Color Helpers

### toHex

Convert RGB to hex string:

```js
toHex(255, 0, 0)       // → "#ff0000"
toHex(0, 255, 0)       // → "#00ff00"
toHex(300, -10, 128)   // → "#ff0080" (values clamped to 0-255, rounded)
```

### toRgb

Parse hex to RGB object:

```js
toRgb('#ff0000')       // → { r: 255, g: 0, b: 0 }
toRgb('#f00')          // → { r: 255, g: 0, b: 0 } (3-digit shorthand)
toRgb('ff0000')        // → { r: 255, g: 0, b: 0 } (no # prefix)
toRgb('#xyz')          // → null (invalid input)
```

---

## PathBuilder

A fluent API for building SVG path data strings. Supports all SVG path commands.

### Quick start

```js
const d = new PathBuilder()
  .M(10, 10)            // Move to
  .L(100, 100)          // Line to
  .Z()                  // Close
  .build()

// d === "M 10 10 L 100 100 Z"
```

### All commands

| Method | Absolute | Relative | Parameters |
|---|---|---|---|
| `M` / `m` | Move to | Move to | `x, y` / `dx, dy` |
| `L` / `l` | Line to | Line to | `x, y` / `dx, dy` |
| `H` / `h` | Horizontal line | Horizontal line | `x` / `dx` |
| `V` / `v` | Vertical line | Vertical line | `y` / `dy` |
| `C` / `c` | Cubic bezier | Cubic bezier | `x1,y1 x2,y2 x,y` / `dx1,dy1 dx2,dy2 dx,dy` |
| `S` / `s` | Smooth cubic | Smooth cubic | `x2,y2 x,y` / `dx2,dy2 dx,dy` |
| `Q` / `q` | Quadratic bezier | Quadratic bezier | `x1,y1 x,y` / `dx1,dy1 dx,dy` |
| `T` / `t` | Smooth quadratic | Smooth quadratic | `x,y` / `dx,dy` |
| `A` / `a` | Arc | Arc | `rx,ry xRot largeArc sweep x,y` / `rx,ry xRot largeArc sweep dx,dy` |
| `Z` / `z` | Close | Close | (none) |

### Complex example

```js
const d = new PathBuilder()
  .M(30, 170)
  .C(40, 30, 90, 10, 100, 100)     // cubic bezier
  .Q(110, 130, 120, 70)             // quadratic bezier
  .A(30, 30, 0, 0, 1, 160, 140)    // arc
  .S(170, 180, 180, 130)            // smooth cubic
  .build()
```

### Utilities

```js
const pb = new PathBuilder()
  .M(0, 0).L(100, 100)

pb.length  // → 2 (commands count)

pb.clear() // reset for reuse, returns this
```

### PathBuilder vs raw strings

```js
// These produce the same result:
const d1 = new PathBuilder().M(10, 10).L(100, 100).build()
const d2 = 'M 10 10 L 100 100'

// PathBuilder helps with:
// - Type safety (parameter count/order)
// - Readability (chain of named commands)
// - Dynamic construction (conditional commands)
```

---

## Composition

### cloneDef

Deep-clone a definition. Children are recursively cloned. Does **not** mutate the original.

```js
const original = withStroke(circle(100, 100, 50, 'gold'), '#333', 3)

// Full clone
const copy = cloneDef(original)

// Clone with overrides
const moved = cloneDef(original, { attrs: { cx: 200 } })
fill(moved, 'blue')  // original is unchanged
```

### mergeDefs

Merge multiple defs left-to-right. Attrs merge (last wins), children concatenate. Does **not** mutate inputs.

```js
const base = rect(0, 0, 100, 80, 'dodgerblue')
const border = { attrs: { stroke: '#333', 'stroke-width': 2 } }
const rounded = { attrs: { rx: 8, ry: 8 } }

const result = mergeDefs(base, border, rounded)
// result has fill='dodgerblue', stroke='#333', rx=8
```

### createDef

Low-level builder for custom elements not covered by named helpers:

```js
createDef('myId', 'customElement', { attr1: 'val1' }, [
  circle(10, 10, 5),
])
// → { type: 'customElement', attrs: { attr1: 'val1' }, id: 'myId', children: [...] }
```

---

## Events

Attach event handlers to make SVG interactive. Handlers are **automatically cleaned up** on re-render.

### Basic usage

```js
const btn = {
  ...rect(10, 10, 120, 50, 'steelblue'),
  id: 'myButton',
  events: {
    click: [() => alert('Clicked!')],
    mouseenter: [() => console.log('hovering')],
    mouseleave: [() => console.log('left')],
  },
}
```

### Single handler vs array

Each event accepts either a single handler or an array:

```js
events: {
  click: () => alert('clicked'),            // single
  mouseenter: [fn1, fn2],                   // multiple
}
```

### Options (once, passive, etc.)

Use `{ callback, options }` for advanced event listener options:

```js
events: {
  click: [{ callback: fn, options: { once: true } }],
}
```

### Common pitfalls

- **Use arrays for multiple handlers** — if you set `click: fn` and then later set `click: fn2`, only `fn2` will fire on re-render
- **Events only work in browser** — `render()` throws in Node.js
- **IDs are required for stable event binding** — elements without `id` are recreated each render, losing their handlers

---

## Rendering

### render()

```js
render(svgElementOrId, defOrArray, options?)
```

**Parameters:**
- `svgElementOrId` — an `SVGElement` or the `id` string of an `<svg>` element
- `defOrArray` — a single `SvgDef` or an array of them
- `options` — optional `RenderOptions` object

**Throws** in Node.js/Bun (needs browser DOM).

### Basic render

```js
// Single def
render('canvas', circle(100, 100, 50, 'tomato'))

// Array of defs
render('canvas', [
  circle(100, 100, 50, 'tomato'),
  rect(180, 30, 120, 90, 'dodgerblue'),
])
```

### How DOM-diffing works

When you call `render()` multiple times on the same SVG container:

1. **Elements with an `id`** are updated **in-place** (attributes changed, old handlers removed, new ones added)
2. **Elements without an `id`** are always **appended** as new nodes
3. **Stale IDs** (present in DOM from last render but absent in the new def) are **removed**

This lets you do efficient partial updates:

```js
let cx = 80
function updateScene() {
  render('canvas', [
    rect(20, 20, 60, 60, 'tomato'),                    // no id — recreated each time
    { ...circle(cx, 150, 40, 'seagreen'), id: 'ball' }, // id — updates in-place
  ])
}
```

### RenderOptions

```js
interface RenderOptions {
  validate?: boolean;            // default: true (warn on missing required attrs)
  beforeCreate?: (def) => def;   // modify def before creating DOM node
  afterCreate?: (el, def) => void;  // hook after DOM node is created
  beforeUpdate?: (el, def) => def | false;  // return false to skip update
  afterUpdate?: (el, def) => void;  // hook after element updated
}
```

**Example — logging:**

```js
render('canvas', scene, {
  afterCreate: (el, def) => console.log('Created', def.type, el),
  afterUpdate: (el, def) => console.log('Updated', def.type, el),
})
```

**Example — suppressing validation:**

```js
render('canvas', def, { validate: false })
```

**Example — modifying defs before creation:**

```js
render('canvas', def, {
  beforeCreate: (def) => {
    def.attrs['data-timestamp'] = Date.now()
    return def
  },
})
```

---

## Server-Side SVG

`render()` throws in Node.js/Bun. To generate SVG on the server, serialize defs to markup manually.

### Simple serializer

```js
function serialize(def) {
  const attrs = Object.entries(def.attrs)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ')

  const children = (def.children || []).map(serialize).join('')
  const text = def.text || ''

  if (children || text) {
    return `<${def.type}${attrs ? ' ' + attrs : ''}>${text}${children}</${def.type}>`
  }
  return `<${def.type}${attrs ? ' ' + attrs : ''} />`
}

// Usage:
const c = circle(100, 100, 60, 'gold')
const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg">${serialize(c)}</svg>`
```

---

## Common Pitfalls & FAQ

**Q: My shape doesn't appear. Why?**
- Check that `render()` is called after the DOM is ready (put script at end of `<body>`)
- Verify the SVG container has the correct `id`
- Make sure required attributes are set (circle needs `cx`, `cy`, `r`; rect needs `x`, `y`, `width`, `height`)
- Check the browser console for validation warnings

**Q: Events stop working after re-render.**
- Make sure your element has an `id` — elements without `id` are recreated, losing event handlers

**Q: Transform doesn't work.**
- Transform helpers return **strings**, not objects — assign to `def.attrs.transform`:
  ```js
  // Wrong:
  rect(0, 0, 50, 50, 'red', { transform: translate(50, 50) })
  // Correct:
  const r = rect(0, 0, 50, 50, 'red')
  r.attrs.transform = translate(50, 50)
  ```

**Q: Gradient not showing.**
- Gradients must be inside `defs()` and referenced via `url(#id)`
- Verify the gradient `id` matches the reference

**Q: `render()` throws "requires a browser environment".**
- You're using it in Node.js/Bun. Use creation helpers to build defs and serialize manually (see [Server-Side SVG](#server-side-svg)).