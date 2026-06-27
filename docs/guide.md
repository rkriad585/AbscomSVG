# Usage Guide

## Element creation

Every SVG element has a corresponding creation helper. Each returns a **definition object** — plain data, not a DOM node.

```js
import { circle, rect, ellipse, line, polygon, path, text } from 'abscomsvg';

// Basic shapes
circle(50, 50, 40, 'red');       // <circle cx="50" cy="50" r="40" fill="red">
rect(10, 10, 100, 50, 'blue');   // <rect x="10" y="10" width="100" height="50" fill="blue">
ellipse(100, 100, 50, 30, 'green');
line(0, 0, 100, 100, 'black');
polygon('100,10 40,198 190,78', 'navy');
path('M10 10 Q50 50 90 10', 'none');
text(10, 20, 'Hello', { fill: '#333', 'font-size': '20px' });
```

Optional parameters (like `fill`, `stroke`) can be omitted and set later via `def.attrs`.

## Images

`image()` sets `xlink:href` (not `href`) for broad SVG renderer compatibility:

```js
import { image } from 'abscomsvg';
const def = image('logo.png', 10, 10, 100, 100);
// def.attrs['xlink:href'] === 'logo.png'
```

## Animations

Use the `animate` helper as a child element:

```js
import { circle, animate, render } from 'abscomsvg';

const pulsing = {
  ...circle(100, 100, 30, 'mediumpurple'),
  children: [
    animate('r', '30', '60', '1.5s', 'indefinite'),
  ],
};

render('svg', pulsing);
```

Multiple children are supported. Each child is itself a definition object (or created via a helper).

## Stroke and transform modifiers

### `withStroke`

Mutates the definition in-place and returns it:

```js
import { circle, withStroke } from 'abscomsvg';

const def = withStroke(circle(50, 50, 40, 'gold'), 'black', 2);
// def.attrs.stroke = 'black'
// def.attrs['stroke-width'] = 2
```

### `transform`

Returns a transform string. You must assign it to `def.attrs.transform` yourself:

```js
import { rect, transform } from 'abscomsvg';

const def = rect(10, 10, 80, 40, 'blue');
def.attrs.transform = transform('rotate', 45, 50, 50);
// def.attrs.transform === 'rotate(45,50,50)'
```

## Event handling

Events are defined on the definition object, not via DOM APIs:

```js
const def = {
  ...rect(10, 10, 100, 50, 'blue'),
  id: 'myRect',
  events: {
    click: [
      { callback: () => console.log('Clicked!'), options: { once: true } },
      () => alert('Hello'),
    ],
    mouseenter: [() => console.log('Entered')],
  },
};
```

- Each event type maps to an array of handlers (or a single handler).
- Handlers can be functions or `{ callback, options }` objects.
- `options` is passed as the third argument to `addEventListener`.
- On re-render, old listeners are automatically removed before new ones are attached.

## Rendering

`render()` takes an SVG container (ID string or SVGElement) and a definition or array of definitions:

```js
import { circle, rect, render } from 'abscomsvg';

// Single element
render('svg', circle(50, 50, 40, 'red'));

// Multiple elements
render('svg', [
  circle(50, 50, 40, 'red'),
  rect(10, 10, 100, 50, 'blue'),
]);
```

## Re-rendering and DOM-diffing

Elements with an `id` attribute are updated in-place on subsequent `render()` calls:

```js
// Initial render
render('svg', [
  { ...circle(50, 50, 40, 'red'), id: 'dot' },
  circle(150, 50, 40, 'blue'),  // no id — always appended
]);

// Re-render
render('svg', [
  { ...circle(80, 80, 50, 'green'), id: 'dot' },  // updates in-place
  // blue circle without id is now gone (stale ids cleaned up)
]);
```

Rules:
- **With `id`**: matched by id and updated in-place. Stale attributes and old event listeners are removed, new ones applied.
- **Without `id`**: always appended as a new child node.
- **Stale IDs**: any id in the DOM that is absent from the latest `render()` call is removed.

## Validation

When `render()` creates an element, it validates required attributes. Missing attributes log a warning via `console.error` but do not throw. Validation covers:
- `circle`: cx, cy, r
- `rect`: x, y, width, height
- `ellipse`: cx, cy, rx, ry
- `line`: x1, y1, x2, y2
- `polygon`: points
- `path`: d
- `image`: xlink:href
- `text`: text content

## Server-side SVG generation

In Node.js or Bun, use the creation helpers to build definitions and serialize manually. See `examples/node-server.js` for a complete example.

```js
function serialize(def) {
  const attrs = Object.entries(def.attrs)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}="${String(v)}"`)
    .join(' ');
  const children = (def.children || []).map(serialize).join('');
  if (children || def.text) {
    return `<${def.type} ${attrs}>${def.text || ''}${children}</${def.type}>`;
  }
  return `<${def.type} ${attrs} />`;
}
```
