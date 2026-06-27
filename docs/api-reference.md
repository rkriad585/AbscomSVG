# API Reference

> Complete listing of all exported functions, types, and classes.

---

## Types

### SvgDef

The fundamental unit — a plain object describing an SVG element.

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

| Property | Description |
|---|---|
| `type` | SVG tag name (`'circle'`, `'rect'`, `'g'`, etc.) |
| `attrs` | Attribute key-value pairs (e.g., `{ cx: 50, fill: 'red' }`) |
| `id` | Used for DOM-diffing — elements with same `id` update in-place on re-render |
| `text` | Text content (for `text`, `tspan`, etc.) |
| `events` | Event handlers keyed by event type (see [EventHandler](#eventhandler)) |
| `children` | Nested SvgDefs |

### EventHandler

```ts
type EventHandler =
  | ((event: Event) => void)
  | { callback: (event: Event) => void; options?: AddEventListenerOptions };
```

### GradientStop

```ts
interface GradientStop {
  offset: string | number;
  color: string;
  opacity?: number;
}
```

### TransformStep

```ts
interface TransformStep {
  type: string;                    // 'translate', 'rotate', 'scale', etc.
  values: (number | string)[];
}
```

Used with [`buildTransform`](#buildtransform).

### RenderOptions

```ts
interface RenderOptions {
  validate?: boolean;                     // default true
  beforeCreate?: (def: SvgDef) => SvgDef | void | null;
  afterCreate?: (el: SVGElement, def: SvgDef) => void;
  beforeUpdate?: (el: SVGElement, def: SvgDef) => SvgDef | void | false;
  afterUpdate?: (el: SVGElement, def: SvgDef) => void;
}
```

---

## Shape Helpers

### circle

```ts
circle(cx: number, cy: number, r: number, fill?: string): SvgDef
```

Create a circle element. `cx`, `cy`, `r` are required; `fill` is optional.

```js
circle(50, 50, 40, 'tomato')
circle(100, 100, 30)  // transparent
```

### rect

```ts
rect(x: number, y: number, width: number, height: number, fill?: string, extraAttrs?: Record<string, unknown>): SvgDef
```

`extraAttrs` accepts any SVG attribute like `rx`, `ry`, `stroke`:

```js
rect(10, 10, 200, 100, 'dodgerblue')
rect(0, 0, 50, 50, 'red', { rx: 5, ry: 5 })
```

### ellipse

```ts
ellipse(cx: number, cy: number, rx: number, ry: number, fill?: string, extraAttrs?: Record<string, unknown>): SvgDef
```

```js
ellipse(100, 100, 50, 30, 'green')
ellipse(100, 100, 50, 30, 'green', { stroke: 'black' })
```

### line

```ts
line(x1: number, y1: number, x2: number, y2: number, stroke?: string): SvgDef
```

```js
line(0, 0, 100, 100, 'black')
```

### polygon

```ts
polygon(points: string, fill?: string): SvgDef
```

`points` is a space-separated list of `x,y` pairs:

```js
polygon('100,10 40,198 190,78', 'navy')
```

### path

```ts
path(d: string, fill?: string): SvgDef
```

```js
path('M10 10 L100 100')
path('M10 10 Q50 50 90 10', 'none')
```

### text

```ts
text(x: number, y: number, content: string, attrs?: Record<string, unknown>): SvgDef
```

```js
text(10, 20, 'Hello World')
text(100, 50, 'Centered', { fill: 'red', 'font-size': '24px', 'text-anchor': 'middle' })
```

### image

```ts
image(href: string, x: number, y: number, width: number, height: number): SvgDef
```

Uses `xlink:href` for broad compatibility:

```js
image('https://example.com/logo.png', 10, 10, 100, 100)
```

---

## Built-in Complex Shapes

Helpers that generate SVG path/polygon data for common shapes — no manual coordinate math needed.

### regularPolygon

```ts
regularPolygon(cx: number, cy: number, sides: number, radius: number, fill?: string): SvgDef
```

Creates a regular polygon (triangle, hexagon, octagon, etc.). First vertex points up.

```js
regularPolygon(50, 50, 6, 40, 'dodgerblue')  // hexagon
regularPolygon(100, 100, 3, 50, 'gold')       // triangle
```

### star

```ts
star(cx: number, cy: number, outerR: number, innerR: number, points: number, fill?: string): SvgDef
```

Creates a star shape by alternating outer/inner vertices.

```js
star(50, 50, 40, 16, 5, 'gold')   // 5-point star
star(50, 50, 30, 10, 4, 'yellow') // 4-point sparkle
```

### arrow

```ts
arrow(x1: number, y1: number, x2: number, y2: number, fill?: string): SvgDef
```

A line from (x1,y1) to (x2,y2) with a triangular arrowhead at the end. Stroke defaults to `'black'`.

```js
arrow(10, 50, 200, 50, 'crimson')
arrow(20, 80, 180, 20, 'navy')
```

### chevron

```ts
chevron(x: number, y: number, w: number, h: number, dir?: 'right' | 'left' | 'up' | 'down', fill?: string): SvgDef
```

A V-shaped bracket. Direction defaults to `'right'`.

```js
chevron(0, 0, 40, 30, 'right', 'steelblue')
chevron(0, 30, 40, 20, 'up')
```

### cross

```ts
cross(cx: number, cy: number, arm: number, thickness: number, fill?: string): SvgDef
```

An X mark drawn with two thick intersecting lines (rounded caps).

```js
cross(50, 50, 30, 8, 'red')
```

### plus

```ts
plus(cx: number, cy: number, arm: number, thickness: number, fill?: string): SvgDef
```

A + sign drawn with two thick perpendicular lines (rounded caps).

```js
plus(50, 50, 25, 8, 'green')
```

### diamond

```ts
diamond(cx: number, cy: number, rx: number, ry: number, fill?: string): SvgDef
```

A rhombus / rotated square.

```js
diamond(50, 50, 30, 20, 'purple')
```

### heart

```ts
heart(cx: number, cy: number, size: number, fill?: string): SvgDef
```

A heart shape using cubic bezier curves. Fill defaults to `'red'`.

```js
heart(50, 50, 40, 'crimson')
```

### donut

```ts
donut(cx: number, cy: number, outerR: number, innerR: number, fill?: string): SvgDef
```

A circle with a hole. Uses `fill-rule="evenodd"`.

```js
donut(50, 50, 40, 20, 'chocolate')
```

### gear

```ts
gear(cx: number, cy: number, outerR: number, innerR: number, teeth: number, fill?: string): SvgDef
```

A mechanical gear / cog outline.

```js
gear(50, 50, 40, 30, 8, 'silver')
```

### spiral

```ts
spiral(cx: number, cy: number, turns: number, maxR: number, fill?: string): SvgDef
```

An Archimedean spiral that grows from the center outward (drawn as a stroked path).

```js
spiral(50, 50, 4, 40, 'dodgerblue')
```

---

## Container Helpers

### svg

```ts
svg(width: number, height: number, viewBox?: string, attrs?: Record<string, unknown>): SvgDef
```

Automatically sets `xmlns`. Best for nested SVG or programmatic use.

```js
svg(800, 600, '0 0 800 600')
svg(100, 100)
```

### group

```ts
group(children?: SvgDef[], attrs?: Record<string, unknown>): SvgDef
```

```js
group([circle(10, 10, 5), rect(0, 0, 20, 20)], { fill: 'red' })
group()  // empty group
```

### defs

```ts
defs(children?: SvgDef[]): SvgDef
```

Container for gradients, markers, clip paths:

```js
defs([linearGradient('g1', 0, 0, 1, 0, [stop(0, 'red'), stop(1, 'blue')])])
```

### symbol

```ts
symbol(id: string, viewBox: string, children?: SvgDef[]): SvgDef
```

```js
symbol('icon', '0 0 24 24', [circle(12, 12, 10)])
```

### clipPath

```ts
clipPath(id: string, children?: SvgDef[]): SvgDef
```

```js
clipPath('myClip', [circle(50, 50, 40)])
```

### mask

```ts
mask(id: string, children?: SvgDef[]): SvgDef
```

```js
mask('myMask', [rect(0, 0, 100, 100, 'white'), circle(50, 50, 30, 'black')])
```

---

## Gradient Helpers

### linearGradient

```ts
linearGradient(id: string, x1: number | string, y1: number | string, x2: number | string, y2: number | string, stops?: SvgDef[]): SvgDef
```

```js
linearGradient('myGrad', 0, 0, 1, 0, [
  stop(0, 'red'),
  stop(1, 'blue'),
])
```

### radialGradient

```ts
radialGradient(id: string, cx: number | string, cy: number | string, r: number | string, stops?: SvgDef[]): SvgDef
```

```js
radialGradient('rg', '50%', '50%', '50%', [
  stop(0, 'white'),
  stop(1, '#222'),
])
```

### stop

```ts
stop(offset: string | number, color: string, opacity?: number): SvgDef
```

```js
stop(0, 'red')
stop(0.5, 'blue', 0.5)
stop('100%', '#333')
```

---

## Marker & Reference Helpers

### marker

```ts
marker(id: string, attrs?: Record<string, unknown>, children?: SvgDef[]): SvgDef
```

```js
marker('arrow', { markerWidth: 10, markerHeight: 10, refX: 9, refY: 5, orient: 'auto' }, [
  path('M0 0 L10 5 L0 10 Z', '#333'),
])
```

### use

```ts
use(href: string, x?: number, y?: number, width?: number, height?: number): SvgDef
```

Uses modern `href` attribute:

```js
use('#icon', 10, 20, 50, 50)
use('#star')
```

### tspan

```ts
tspan(content: string, attrs?: Record<string, unknown>): SvgDef
```

```js
tspan('bold text', { 'font-weight': 'bold', fill: 'red' })
```

---

## Animation Helpers

### animate

```ts
animate(attributeName: string, from: string, to: string, dur: string, repeatCount: string): SvgDef
```

Add as a child of the element to animate:

```js
{
  ...circle(100, 100, 30, 'red'),
  children: [animate('r', '30', '60', '1.5s', 'indefinite')],
}
```

### animateTransform

```ts
animateTransform(type: string, from: string, to: string, dur: string, repeatCount?: string): SvgDef
```

Automatically sets `attributeName="transform"`. `repeatCount` defaults to `'indefinite'`.

```js
animateTransform('rotate', '0 25 25', '360 25 25', '2s')
```

### animationSet

```ts
animationSet(attributeName: string, to: string, begin?: string): SvgDef
```

Instant attribute change at a specific time (no transition):

```js
animationSet('opacity', '0', '3s')
animationSet('visibility', 'hidden', 'click')
```

---

## Enhanced Animation Helpers

High-level animation wrappers that produce ready-to-use `<g>` containers with `<animate>` or `<animateTransform>` children.

### easing

```ts
easing(name: string): Record<string, string>
```

Returns SVG easing attributes for a named curve. Recognized names: `'linear'`, `'ease'`, `'ease-in'`, `'ease-out'`, `'ease-in-out'`, `'bounce'`. Unknown names default to `calcMode: 'linear'`.

Spread the result into an `<animate>` or `<animateTransform>` element:

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

### fadeIn / fadeOut

```ts
fadeIn(def: SvgDef, dur?: string): SvgDef
fadeOut(def: SvgDef, dur?: string): SvgDef
```

Wrap `def` in a `<g>` with an opacity animation. Default duration is `'1s'`. After the animation, `fill="freeze"` holds the final state.

```js
fadeIn(circle(50, 50, 40, 'red'), '2s')
```

### pulse

```ts
pulse(def: SvgDef, attr: string, from: string | number, to: string | number, dur?: string): SvgDef
```

Mutates `def` in-place by adding an `<animate>` child that oscillates `attr` between `from` and `to`. Repeats indefinitely.

```js
pulse(circle(50, 50, 30, 'red'), 'r', '30', '40', '1s')
```

### spin

```ts
spin(def: SvgDef, dur?: string): SvgDef
```

Mutates `def` in-place by adding an `animateTransform` that rotates 0° → 360°. Uses `cx`/`cy` from the target element, or defaults to `(50, 50)`.

```js
spin(circle(50, 50, 30, 'gold'), '3s')
```

### bounce

```ts
bounce(def: SvgDef, dur?: string): SvgDef
```

Vertical Y-oscillation via `animateTransform(type="translate")`. Default duration `'1s'`.

### shake

```ts
shake(def: SvgDef, dur?: string): SvgDef
```

Horizontal X-oscillation with multiple keyframes for a rapid shake. Default `'0.3s'`.

### slideIn

```ts
slideIn(def: SvgDef, dir?: string, dur?: string): SvgDef
```

Slides element in from `'left'` (default), `'right'`, `'top'`, or `'bottom'`. Uses `fill="freeze"`.

### grow

```ts
grow(def: SvgDef, dur?: string): SvgDef
```

Scales from 0 to 1 via `animateTransform(type="scale")`. Default `'0.5s'`. Scales from origin `(0,0)` — wrap in a `<g>` with `translate` to scale from center.

---

## Transform Helpers

All return **strings**. Assign to `def.attrs.transform`.

### translate

```ts
translate(x: number, y?: number): string
```

```js
translate(100, 50)  // → "translate(100,50)"
translate(50)       // → "translate(50)"
```

### rotate

```ts
rotate(angle: number, cx?: number, cy?: number): string
```

```js
rotate(45)             // → "rotate(45)"
rotate(45, 50, 50)    // → "rotate(45,50,50)"
```

### scale

```ts
scale(x: number, y?: number): string
```

```js
scale(2)       // → "scale(2)"
scale(2, 3)    // → "scale(2,3)"
```

### skewX / skewY

```ts
skewX(angle: number): string    // → "skewX(30)"
skewY(angle: number): string    // → "skewY(15)"
```

### composeTransforms

```ts
composeTransforms(...transforms: (string | undefined | null | false)[]): string
```

Joins multiple transform strings with spaces. Filters falsy values.

```js
composeTransforms(translate(100, 50), rotate(45))
// → "translate(100,50) rotate(45)"
```

### buildTransform

```ts
buildTransform(...steps: TransformStep[]): string
```

```js
buildTransform(
  { type: 'translate', values: [100, 50] },
  { type: 'rotate', values: [45] },
)
// → "translate(100,50) rotate(45)"
```

### transform

```ts
transform(type: string, ...values: (number | string)[]): string
```

Generic transform builder:

```js
transform('rotate', 45, 50, 50)  // → "rotate(45,50,50)"
transform('matrix', 1, 0, 0, 1, 0, 0)
```

---

## Style Utilities

All mutate the def in-place and return it.

### withStroke

```ts
withStroke(def: SvgDef, color: string, width: number): SvgDef
```

```js
withStroke(circle(50, 50, 40, 'gold'), 'black', 2)
```

### withClass

```ts
withClass(def: SvgDef, ...classes: string[]): SvgDef
```

```js
withClass(circle(10, 10, 5), 'highlight', 'active')
```

### withStyle

```ts
withStyle(def: SvgDef, style: Record<string, string | number>): SvgDef
```

Converts camelCase to kebab-case:

```js
withStyle(def, { fill: 'red', strokeWidth: 2 })
// → style="fill: red; stroke-width: 2"
```

### withOpacity

```ts
withOpacity(def: SvgDef, value: number): SvgDef
```

```js
withOpacity(circle(10, 10, 5), 0.5)
```

### setFill / fill

```ts
setFill(def: SvgDef, color: string): SvgDef
fill(def: SvgDef, color: string): SvgDef     // alias
```

```js
setFill(circle(10, 10, 5), 'blue')
```

### stroke

```ts
stroke(def: SvgDef, color: string, width?: number): SvgDef
```

```js
stroke(def, 'black')
stroke(def, 'black', 2)
```

### show / hide

```ts
show(def: SvgDef): SvgDef    // deletes display attribute
hide(def: SvgDef): SvgDef    // sets display: none
```

---

## Attribute Utilities

### attr

```ts
// Getter:
attr(def: SvgDef, key: string): unknown
// Setter:
attr(def: SvgDef, key: string, value: unknown): SvgDef
```

```js
attr(circle(10, 20, 30), 'cx')  // → 10
attr(def, 'fill', 'blue')       // mutates and returns def
```

### removeAttr

```ts
removeAttr(def: SvgDef, key: string): SvgDef
```

```js
removeAttr(def, 'fill')
```

### attrs

```ts
// Getter (shallow copy):
attrs(def: SvgDef): Record<string, unknown>
// Setter (merge):
attrs(def: SvgDef, obj: Record<string, unknown>): SvgDef
```

```js
const a = attrs(myRect)                    // get all
attrs(def, { fill: 'blue', stroke: 'black' })  // set multiple
```

---

## Position / Size Getters

```ts
cx(def: SvgDef): number | undefined
cy(def: SvgDef): number | undefined
r(def: SvgDef): number | undefined
x(def: SvgDef): number | undefined
y(def: SvgDef): number | undefined
width(def: SvgDef): number | undefined
height(def: SvgDef): number | undefined
```

Convenience getters for common attributes. Returns `undefined` if not set:

```js
cx(circle(50, 50, 40))   // → 50
r(circle(50, 50, 40))    // → 40
x(rect(10, 20, 100, 80)) // → 10
```

---

## Color Helpers

Color parsing, manipulation, formatting, and built-in palettes — all pure math, no external dependencies.

### Parsing & Formatting

#### parseColor

```ts
parseColor(input: string): { r: number; g: number; b: number; a: number } | null
```

Parse any CSS color string into an RGBA object. Supports hex (`#rgb`, `#rrggbb`, `#rrggbbaa`), `rgb()`, `rgba()`, `hsl()`, `hsla()`, and 148 named CSS colors (e.g. `'crimson'`).

```js
parseColor('#ff0000')           // { r: 255, g: 0, b: 0, a: 1 }
parseColor('rgba(255,0,0,0.5)') // { r: 255, g: 0, b: 0, a: 0.5 }
parseColor('crimson')           // { r: 220, g: 20, b: 60, a: 1 }
parseColor('bad-color')         // null
```

#### toHex

```ts
toHex(r: number, g: number, b: number): string
```

Values clamped to 0–255:

```js
toHex(255, 0, 0)      // → "#ff0000"
toHex(300, -10, 128)  // → "#ff0080"
```

#### toRgb

```ts
toRgb(hex: string): { r: number; g: number; b: number } | null
```

Supports 6-digit, 3-digit, with or without `#`:

```js
toRgb('#ff0000')  // → { r: 255, g: 0, b: 0 }
toRgb('#f00')     // → { r: 255, g: 0, b: 0 }
toRgb('ff0000')   // → { r: 255, g: 0, b: 0 }
toRgb('#xyz')     // → null
```

#### toRgba

```ts
toRgba(r: number, g: number, b: number, a?: number): string
```

Build an `rgba()` CSS string. Default alpha = 1.

```js
toRgba(255, 0, 0)          // → "rgba(255, 0, 0, 1)"
toRgba(255, 0, 0, 0.5)    // → "rgba(255, 0, 0, 0.5)"
```

#### hsl / hsla

```ts
hsl(h: number, s: number, l: number): string
hsla(h: number, s: number, l: number, a: number): string
```

Build `hsl()` or `hsla()` CSS strings. Hue in degrees, saturation and lightness as percentages (0–100).

```js
hsl(0, 100, 50)              // → "hsl(0, 100%, 50%)"
hsla(120, 100, 50, 0.5)     // → "hsla(120, 100%, 50%, 0.5)"
```

---

### Manipulation

#### lighten / darken

```ts
lighten(color: string, amount: number): string
darken(color: string, amount: number): string
```

Move a color toward white (`lighten`) or black (`darken`). `amount` is 0–1, proportional to remaining distance.

```js
lighten('#ff0000', 0.3)  // → "#ff9999"
darken('#ff0000', 0.3)   // → "#660000"
```

#### saturate / desaturate

```ts
saturate(color: string, amount: number): string
desaturate(color: string, amount: number): string
```

Increase or decrease saturation in HSL space.

```js
saturate('#999', 0.5)    // more vivid
desaturate('crimson', 0.5)  // more muted
```

#### mix

```ts
mix(color1: string, color2: string, ratio?: number): string
```

Blend two colors. `ratio` = 0 gives all color1, 1 gives all color2. Default 0.5.

```js
mix('red', 'blue', 0.5)  // → "#800080" (purple)
mix('red', 'blue', 0.2)  // closer to red
```

#### complementary / analogous

```ts
complementary(color: string): string
analogous(color: string, count?: number): string[]
```

`complementary` adds 180° to the hue. `analogous` returns adjacent colors (default 3).

```js
complementary('#ff0000')  // → "#00ffff" (cyan)
analogous('#ff0000', 3)   // → ['#ff0000', ...adjacent hues...]
```

---

### Luminance & Contrast

#### luminance

```ts
luminance(color: string): number
```

WCAG relative luminance (0–1). Returns 0 for unparseable input.

```js
luminance('#ffffff')  // → ~1
luminance('#000000')  // → 0
```

#### isLight / isDark

```ts
isLight(color: string): boolean
isDark(color: string): boolean
```

```js
isLight('white')   // → true
isDark('white')    // → false
```

#### contrastText

```ts
contrastText(bgColor: string): string
```

Returns `'black'` or `'white'` for readable text on the given background.

```js
contrastText('white')     // → "black"
contrastText('darkblue')  // → "white"
```

---

### Random Colors

#### randomColor

```ts
randomColor(): string
```

```js
randomColor()  // → "#a3f17b"
```

#### randomPastel

```ts
randomPastel(): string
```

High lightness (~78%), medium saturation (~55%).

```js
randomPastel()  // → "#d4a1f0"
```

---

### Palettes

#### palette

```ts
palette(name: PaletteName): string[]
```

Get a named 10-color palette. Available: `'material'`, `'pastel'`, `'vibrant'`, `'mono'`, `'sunset'`, `'ocean'`, `'forest'`, `'retro'`, `'neon'`, `'earth'`.

```js
palette('material')  // → ['#f44336', '#e91e63', ...]
palette('pastel')    // → ['#ffb3ba', '#ffdfba', ...]
```

#### listPalettes

```ts
listPalettes(): PaletteName[]
```

Returns all available palette names.

```js
listPalettes()  // → ['material', 'pastel', 'vibrant', ...]
```

---

## Filter Helpers

SVG filter effects let you apply image-processing operations (blur, shadow, color shifts, etc.) to elements. These helpers build `<filter>` definitions that work inside `<defs>`.

### FilterBuilder

```ts
new FilterBuilder(id: string, attrs?: Record<string, unknown>)
```

Fluent builder that creates a `<filter>` element with child primitives.

**Methods:**

| Method | SVG Element | Description |
|---|---|---|
| `.blur(stdDev, in?, result?)` | `feGaussianBlur` | Gaussian blur |
| `.dropShadow(dx, dy, stdDev, color?, result?)` | `feDropShadow` | Drop shadow |
| `.offset(dx, dy, in?, result?)` | `feOffset` | Offset the input |
| `.colorMatrix(type, values, in?, result?)` | `feColorMatrix` | Color transformation |
| `.grayscale(amount?, result?)` | `feColorMatrix` | Convert to grayscale (`amount`: 0=gray, 1=color) |
| `.sepia(amount?, result?)` | `feColorMatrix` | Sepia tone (0–1) |
| `.hueRotate(angle?, result?)` | `feColorMatrix` | Hue rotation (degrees) |
| `.saturate(amount?, result?)` | `feColorMatrix` | Adjust saturation |
| `.brightness(amount?, result?)` | `feComponentTransfer` | Brightness multiplier |
| `.contrast(amount?, result?)` | `feComponentTransfer` | Contrast adjustment |
| `.invert(amount?, result?)` | `feComponentTransfer` | Invert colors (0–1) |
| `.opacity(amount?, result?)` | `feComponentTransfer` | Opacity multiplier |
| `.blend(in1, in2, mode?, result?)` | `feBlend` | Blend two inputs |
| `.composite(operator, in1, in2?, result?)` | `feComposite` | Composite with operator |
| `.merge(...inputs)` | `feMerge` | Merge multiple inputs |
| `.turbulence(baseFreq?, numOctaves?, type?, result?)` | `feTurbulence` | Noise generation |
| `.displacementMap(scale?, in1?, in2?, xChan?, yChan?, result?)` | `feDisplacementMap` | Distort using a map |
| `.flood(color, opacity?, result?)` | `feFlood` | Fill with color |
| `.build()` | — | Returns final `SvgDef` |

```js
// Blur filter
new FilterBuilder('myBlur').blur(4).build()

// Drop shadow
new FilterBuilder('shadow')
  .dropShadow(2, 2, 4, 'rgba(0,0,0,0.5)')
  .build()

// Multiple effects chained
new FilterBuilder('effects')
  .blur(2)
  .brightness(1.2)
  .build()

// Custom filter bounds
new FilterBuilder('wide', { x: '-20%', y: '-20%', width: '140%', height: '140%' })
  .dropShadow(3, 3, 5, '#000')
  .build()
```

### Shorthand Filter Functions

Each shorthand creates a complete filter definition in one call.

#### dropShadow

```ts
dropShadow(id: string, dx: number, dy: number, stdDev: number, color?: string): SvgDef
```

```js
dropShadow('s', 2, 2, 4, '#00000080')
```

#### blur

```ts
blur(id: string, stdDev: number): SvgDef
```

```js
blur('b', 4)
```

#### glow

```ts
glow(id: string, color?: string, stdDev?: number): SvgDef
```

A colored drop shadow with no offset. Default: cyan glow.

```js
glow('g', '#ff00ff', 6)
```

#### grayscale

```ts
grayscale(id: string, amount?: number): SvgDef
```

`amount` = 0 for full grayscale, 1 for original color. Default: 0.

```js
grayscale('g')     // full grayscale
grayscale('g', 0.5) // 50% desaturated
```

#### sepia

```ts
sepia(id: string, amount?: number): SvgDef
```

```js
sepia('s', 0.5)  // half sepia
```

#### brightness

```ts
brightness(id: string, amount?: number): SvgDef
```

Multiplier: >1 brightens, <1 darkens. Default: 1.5.

```js
brightness('b', 2)
```

#### contrast

```ts
contrast(id: string, amount?: number): SvgDef
```

```js
contrast('c', 1.5)
```

#### hueRotate

```ts
hueRotate(id: string, angle?: number): SvgDef
```

```js
hueRotate('h', 90)
```

**Usage pattern:**

```js
import { defs, rect, render } from 'abscomsvg';

// 1. Define filters
const myFilters = defs([
  dropShadow('shadow', 2, 2, 4, '#00000080'),
  blur('blur', 4),
  glow('glow', '#00ffff'),
]);

// 2. Apply to elements via filter attr
const box = rect(10, 10, 100, 100, 'red', { filter: 'url(#shadow)' });

// 3. Render defs and element
render('#svg', [myFilters, box]);
```

---

## PathBuilder

Fluent builder for SVG path data strings.

### Constructor

```ts
new PathBuilder()
```

### Methods

All methods return `this` (chainable):

| Method | Command | Parameters |
|---|---|---|
| `M(x, y)` | Move to (absolute) | `x, y` |
| `m(dx, dy)` | Move to (relative) | `dx, dy` |
| `L(x, y)` | Line to | `x, y` |
| `l(dx, dy)` | Line to (relative) | `dx, dy` |
| `H(x)` | Horizontal line | `x` |
| `h(dx)` | Horizontal line (relative) | `dx` |
| `V(y)` | Vertical line | `y` |
| `v(dy)` | Vertical line (relative) | `dy` |
| `C(x1, y1, x2, y2, x, y)` | Cubic bezier | control1, control2, end |
| `c(dx1, dy1, dx2, dy2, dx, dy)` | Cubic bezier (relative) | |
| `S(x2, y2, x, y)` | Smooth cubic | control, end |
| `s(dx2, dy2, dx, dy)` | Smooth cubic (relative) | |
| `Q(x1, y1, x, y)` | Quadratic bezier | control, end |
| `q(dx1, dy1, dx, dy)` | Quadratic bezier (relative) | |
| `T(x, y)` | Smooth quadratic | end |
| `t(dx, dy)` | Smooth quadratic (relative) | |
| `A(rx, ry, xRot, largeArc, sweep, x, y)` | Arc | |
| `a(rx, ry, xRot, largeArc, sweep, dx, dy)` | Arc (relative) | |
| `Z()` | Close path | |
| `z()` | Close path (lowercase) | |

### Utility methods

```ts
build(): string           // returns the path data string
clear(): this             // resets builder for reuse
length: number            // number of commands so far
```

### Example

```js
new PathBuilder()
  .M(10, 10)
  .C(40, 5, 60, 40, 100, 20)
  .Z()
  .build()
// → "M 10 10 C 40 5 60 40 100 20 Z"
```

---

## Composition Helpers

### cloneDef

```ts
cloneDef(def: SvgDef, overrides?: Partial<SvgDef>): SvgDef
```

Deep clone with optional overrides. Does not mutate input.

```js
cloneDef(circle(10, 10, 5))
cloneDef(original, { attrs: { fill: 'blue' } })
```

### mergeDefs

```ts
mergeDefs(...defs: SvgDef[]): SvgDef
```

Merge left-to-right. Attrs merge (last wins), children concatenate.

```js
mergeDefs(rect(0, 0, 100, 80, 'dodgerblue'), { attrs: { stroke: '#333' } })
```

### createDef

```ts
createDef(id: string, type: string, attrs?: Record<string, unknown>, children?: SvgDef[]): SvgDef
```

Low-level builder for custom elements:

```js
createDef('myId', 'circle', { cx: 10, cy: 10, r: 5 })
```

---

## Rendering

### render

```ts
render(svgArg: string | SVGElement, def: SvgDef | SvgDef[], options?: RenderOptions): void
```

Renders defs into an SVG container. Throws in Node.js/Bun.

```js
render('canvas', circle(100, 100, 50, 'tomato'))
render('canvas', [circle(100, 100, 50), rect(10, 10, 80, 80)], { validate: false })
```

See [RenderOptions](#renderoptions) for available options.
