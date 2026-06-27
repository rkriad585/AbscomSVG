# API Reference

## Types

### `SvgDef`

```ts
interface SvgDef {
  type: string;
  attrs: Record<string, unknown>;
  id?: string;
  text?: string;
  events?: Record<string, EventHandler | EventHandler[]>;
  children?: SvgDef[];
}
```

### `EventHandler`

```ts
type EventHandler =
  | ((event: Event) => void)
  | { callback: (event: Event) => void; options?: AddEventListenerOptions };
```

## Element creation helpers

All helpers return `SvgDef` objects. Optional parameters can be omitted.

| Function | Signature | Returns |
|----------|-----------|---------|
| `circle` | `(cx, cy, r, fill?)` | `<circle>` definition |
| `rect` | `(x, y, width, height, fill?)` | `<rect>` definition |
| `ellipse` | `(cx, cy, rx, ry, fill?)` | `<ellipse>` definition |
| `line` | `(x1, y1, x2, y2, stroke?)` | `<line>` definition |
| `polygon` | `(points, fill?)` | `<polygon>` definition |
| `path` | `(d, fill?)` | `<path>` definition |
| `text` | `(x, y, content, attrs?)` | `<text>` definition |
| `image` | `(href, x, y, width, height)` | `<image>` definition (sets `xlink:href`) |
| `animate` | `(attributeName, from, to, dur, repeatCount)` | `<animate>` definition |

## Attribute modifiers

### `withStroke(def, color, width)`

Adds `stroke` and `stroke-width` attributes to an element definition. Mutates and returns the definition.

```js
const def = withStroke(circle(50, 50, 40, 'gold'), 'black', 2);
// def.attrs.stroke === 'black'
// def.attrs['stroke-width'] === 2
```

### `transform(type, ...values)`

Returns a transform string. Does **not** modify any definition — caller must assign the result.

```js
def.attrs.transform = transform('rotate', 45, 50, 50);
// Returns: 'rotate(45,50,50)'

def.attrs.transform = transform('translate', 100, 50);
// Returns: 'translate(100,50)'

def.attrs.transform = transform('scale', 2);
// Returns: 'scale(2)'
```

## Rendering

### `render(svgArg, def)`

Reconciles definition(s) onto SVG DOM. Requires a browser environment.

| Parameter | Type | Description |
|-----------|------|-------------|
| `svgArg` | `string \| SVGElement` | SVG container ID or element reference |
| `def` | `SvgDef \| SvgDef[]` | Single definition or array of definitions |

**Throws** in Node.js / Bun if `document` is undefined.

## Internal functions (not exported)

These are used internally by `render()` and not exposed in the public API:

- `validateDef(def)` — Validates required attributes, logs to console.error
- `createElement(def)` — Creates an SVG DOM node from a definition
- `updateElement(el, def)` — Updates an existing DOM node to match a new definition
