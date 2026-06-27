import type { SvgDef } from './types';

// ============================================================
// Basic Shape Elements
// ============================================================

/**
 * Create a circle element.
 *
 * Omit `fill` for a transparent circle (no fill).
 *
 * @param cx - Center x coordinate (required)
 * @param cy - Center y coordinate (required)
 * @param r - Circle radius (required)
 * @param fill - Fill color. Any valid SVG color string (e.g. `'red'`, `'#ff0'`, `'rgb(255,0,0)'`). Default: undefined (transparent / no fill).
 * @returns A circle SvgDef with cx, cy, r, and (optionally) fill in attrs
 *
 * @example
 * // Circle with red fill
 * circle(50, 50, 40, 'red')
 *
 * @example
 * // Circle without fill (transparent)
 * circle(100, 100, 30)
 */
export function circle(cx: number, cy: number, r: number, fill?: string): SvgDef {
  return { type: 'circle', attrs: { cx, cy, r, fill } };
}

/**
 * Create a rectangle element.
 *
 * @param x - Top-left x coordinate (required)
 * @param y - Top-left y coordinate (required)
 * @param width - Rectangle width (required)
 * @param height - Rectangle height (required)
 * @param fill - Fill color (optional). Default: undefined (transparent).
 * @param attrs - Additional SVG attributes merged into the element. Use this for `rx`/`ry` (rounded corners), `stroke`, `stroke-width`, or any other SVG attribute not covered by parameters.
 * @returns A rect SvgDef
 *
 * @example
 * // Basic rectangle
 * rect(10, 10, 200, 100, 'dodgerblue')
 *
 * @example
 * // Rounded rectangle with stroke
 * rect(0, 0, 50, 50, 'red', { rx: 5, ry: 5, stroke: 'black', 'stroke-width': 2 })
 */
export function rect(
  x: number,
  y: number,
  width: number,
  height: number,
  fill?: string,
  attrs?: Record<string, unknown>,
): SvgDef {
  return { type: 'rect', attrs: { x, y, width, height, fill, ...attrs } };
}

/**
 * Create an ellipse element.
 *
 * @param cx - Center x coordinate (required)
 * @param cy - Center y coordinate (required)
 * @param rx - X-axis radius (required). Horizontal radius from center.
 * @param ry - Y-axis radius (required). Vertical radius from center.
 * @param fill - Fill color (optional). Default: undefined (transparent).
 * @param attrs - Additional SVG attributes (e.g. `{ stroke: 'black', 'stroke-width': 2 }`)
 * @returns An ellipse SvgDef
 *
 * @example
 * // Basic ellipse
 * ellipse(100, 100, 50, 30, 'green')
 *
 * @example
 * // Ellipse with stroke
 * ellipse(100, 100, 50, 30, 'green', { stroke: 'black' })
 */
export function ellipse(cx: number, cy: number, rx: number, ry: number, fill?: string, attrs?: Record<string, unknown>): SvgDef {
  return { type: 'ellipse', attrs: { cx, cy, rx, ry, fill, ...attrs } };
}

/**
 * Create a line element.
 *
 * Without a stroke, the line is invisible. Use `withStroke()` or pass `stroke` as the last argument.
 *
 * @param x1 - Start point x coordinate (required)
 * @param y1 - Start point y coordinate (required)
 * @param x2 - End point x coordinate (required)
 * @param y2 - End point y coordinate (required)
 * @param stroke - Stroke color (optional). Default: undefined (invisible).
 * @returns A line SvgDef
 *
 * @example
 * // Line with stroke color
 * line(0, 0, 100, 100, 'black')
 *
 * @example
 * // Invisible line (no stroke) — add stroke later
 * const ln = line(0, 0, 100, 100)
 * withStroke(ln, 'red', 2)
 */
export function line(x1: number, y1: number, x2: number, y2: number, stroke?: string): SvgDef {
  return { type: 'line', attrs: { x1, y1, x2, y2, stroke } };
}

/**
 * Create a polygon element.
 *
 * @param points - Space-separated list of x,y coordinate pairs in SVG format. Each pair is `x,y` (no space between x and y). Pairs are separated by spaces. Example: `"100,10 40,198 190,78"` creates a triangle.
 * @param fill - Fill color (optional). Default: undefined (transparent).
 * @returns A polygon SvgDef
 *
 * @example
 * // Triangle with navy fill
 * polygon('100,10 40,198 190,78', 'navy')
 *
 * @example
 * // Pentagon (no fill, just outline — add stroke later)
 * polygon('50,0 100,38 81,100 19,100 0,38')
 */
export function polygon(points: string, fill?: string): SvgDef {
  return { type: 'polygon', attrs: { points, fill } };
}

/**
 * Create a path element.
 *
 * For complex paths, consider using `PathBuilder` for a fluent, chainable API instead of writing raw path strings.
 *
 * @param d - SVG path data string (required). Examples: `"M10 10 L100 100"` (line), `"M10 10 Q50 50 90 10"` (quadratic curve), `"M10 10 C20 20 40 5 50 15 Z"` (cubic bezier with close).
 * @param fill - Fill color (optional). Use `'none'` for no fill. Default: undefined.
 * @returns A path SvgDef
 *
 * @example
 * // Simple line path
 * path('M10 10 L100 100')
 *
 * @example
 * // Quadratic curve with no fill
 * path('M10 10 Q50 50 90 10', 'none')
 *
 * @example
 * // Closed cubic bezier with gold fill
 * path('M10 10 C20 20 40 5 50 15 Z', 'gold')
 */
export function path(d: string, fill?: string): SvgDef {
  return { type: 'path', attrs: { d, fill } };
}

/**
 * Create a text element.
 *
 * Use `attrs` to control font size, alignment, fill color, font family, and other text styling.
 *
 * @param x - Text anchor x coordinate (required). Combined with `text-anchor` attribute: `'start'` (default) aligns left, `'middle'` centers, `'end'` aligns right.
 * @param y - Text baseline y coordinate (required)
 * @param content - Text content string (required). Use empty string `""` for no text.
 * @param attrs - Additional text attributes. Common ones: `{ 'font-size': '20px' }`, `{ fill: '#333' }`, `{ 'text-anchor': 'middle' }`, `{ 'font-family': 'Arial' }`, `{ 'font-weight': 'bold' }`.
 * @returns A text SvgDef with the content stored in the `text` property
 *
 * @example
 * // Simple text
 * text(10, 20, 'Hello World')
 *
 * @example
 * // Centered red text with custom font size
 * text(100, 50, 'Centered', { fill: 'red', 'font-size': '24px', 'text-anchor': 'middle' })
 */
export function text(x: number, y: number, content: string, attrs?: Record<string, unknown>): SvgDef {
  return {
    type: 'text',
    attrs: { x, y, ...attrs },
    text: content,
  };
}

/**
 * Create an image element.
 *
 * **Note:** This function sets the legacy `xlink:href` attribute (not `href`) for maximum SVG renderer compatibility. Some older renderers do not support the modern `href` attribute on `<image>`.
 *
 * @param href - Image URL, data URI, or path (required). Examples: `'https://example.com/logo.png'`, `'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>'`.
 * @param x - Top-left x coordinate (required)
 * @param y - Top-left y coordinate (required)
 * @param width - Image width (required)
 * @param height - Image height (required)
 * @returns An image SvgDef with `xlink:href` set in attrs
 *
 * @example
 * // External image
 * image('https://example.com/logo.png', 10, 10, 100, 100)
 *
 * @example
 * // Inline SVG data URI
 * image('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', 0, 0, 50, 50)
 */
export function image(href: string, x: number, y: number, width: number, height: number): SvgDef {
  return { type: 'image', attrs: { 'xlink:href': href, x, y, width, height } };
}

// ============================================================
// Container Elements
// ============================================================

/**
 * Create a root SVG element.
 *
 * Automatically sets `xmlns="http://www.w3.org/2000/svg"` so the SVG renders correctly in browsers. Use this for standalone SVG documents. When embedding SVG directly in HTML, the `xmlns` is optional but harmless.
 *
 * @param width - SVG viewport width in pixels (required). E.g. `800` for 800px wide.
 * @param height - SVG viewport height in pixels (required). E.g. `600` for 600px tall.
 * @param viewBox - ViewBox string defining the coordinate system (optional). Format: `"minX minY width height"`. Example: `"0 0 800 600"`. If omitted, the viewport dimensions are used.
 * @param attrs - Additional attributes merged into the root `<svg>` element. Examples: `{ 'aria-label': 'chart' }`, `{ role: 'img' }`, `{ style: 'background: #f0f0f0' }`.
 * @returns An svg SvgDef with xmlns, width, height, and optional viewBox
 *
 * @example
 * // Standalone SVG with viewBox
 * svg(800, 600, '0 0 800 600')
 *
 * @example
 * // Simple SVG without viewBox (uses pixel dimensions)
 * svg(100, 100)
 *
 * @example
 * // SVG with accessibility label
 * svg(500, 300, undefined, { 'aria-label': 'My drawing' })
 */
export function svg(
  width: number,
  height: number,
  viewBox?: string,
  attrs?: Record<string, unknown>,
): SvgDef {
  return {
    type: 'svg',
    attrs: { xmlns: 'http://www.w3.org/2000/svg', width, height, ...(viewBox && { viewBox }), ...attrs },
  };
}

/**
 * Create a group element (`<g>`). Groups multiple elements together so they share attributes, transforms, and styles (similar to CSS cascading).
 *
 * Attributes set on the group are inherited by all children. For example, setting `fill` on a group applies that fill to every child that doesn't have its own fill. This is useful for applying transforms or styles to multiple elements at once.
 *
 * @param children - Array of child SvgDefs to group together (optional). Default: empty group.
 * @param attrs - Attributes inherited by all children. Common uses: `{ fill: 'red' }`, `{ stroke: 'black', 'stroke-width': 2 }`, `{ transform: translate(10, 10) }`, `{ opacity: 0.5 }`.
 * @returns A group SvgDef
 *
 * @example
 * // Group with inherited red fill — both circle and rect will be red
 * group([circle(10, 10, 5), rect(0, 0, 20, 20)], { fill: 'red' })
 *
 * @example
 * // Empty group (useful as a placeholder or container)
 * group()
 */
export function group(children?: SvgDef[], attrs?: Record<string, unknown>): SvgDef {
  return { type: 'g', attrs: { ...attrs }, ...(children && { children }) };
}

/**
 * Create a defs element (`<defs>`). Holds reusable definitions like gradients, markers, clip paths, and symbols.
 *
 * Contents of `<defs>` are NOT rendered directly. They are referenced elsewhere via their `id`. For example, a gradient inside defs is referenced with `fill="url(#myGradient)"`.
 *
 * @param children - Array of definition SvgDefs (gradients, markers, clip paths, filters, symbols, etc.) (optional)
 * @returns A defs SvgDef with empty attrs
 *
 * @example
 * defs([linearGradient('g1', 0, 0, 1, 0, [stop(0, 'red'), stop(1, 'blue')])])
 */
export function defs(children?: SvgDef[]): SvgDef {
  return { type: 'defs', attrs: {}, ...(children && { children }) };
}

/**
 * Create a symbol element (`<symbol>`). Defines a reusable graphic that can be referenced multiple times with `use()`.
 *
 * Unlike `<g>`, a `<symbol>` is NOT rendered directly — it must be instantiated with `use('#id')`. This is ideal for icons or repeated graphics (like a legend or stamp).
 *
 * @param id - Symbol identifier. Used in `use('#id')` to reference this symbol.
 * @param viewBox - ViewBox for the symbol's internal coordinate system. Example: `"0 0 24 24"` for a 24x24 icon grid.
 * @param children - Child SvgDefs that make up the symbol's content (optional)
 * @returns A symbol SvgDef
 *
 * @example
 * // Define an icon symbol
 * symbol('icon', '0 0 24 24', [circle(12, 12, 10)])
 *
 * @example
 * // Reference it later with position and size
 * use('#icon', 10, 10, 50, 50)
 */
export function symbol(id: string, viewBox: string, children?: SvgDef[]): SvgDef {
  return { type: 'symbol', attrs: { id, viewBox }, ...(children && { children }) };
}

/**
 * Create a clipPath element (`<clipPath>`). Defines a clipping region — anything outside the clip shape is hidden.
 *
 * Difference from `<mask>`: clipPath uses the geometric outline of the child shapes (hard edges), while `<mask>` uses brightness values (soft edges, gradients). clipPath is simpler and faster for crisp cutouts.
 *
 * @param id - Clip path identifier. Reference with `{ 'clip-path': 'url(#myClip)' }`.
 * @param children - Child SvgDefs that define the clipping shape. Only the geometry matters, not fill or stroke colors.
 * @returns A clipPath SvgDef
 *
 * @example
 * clipPath('myClip', [circle(50, 50, 40)])
 *
 * @example
 * // Apply clipping to a rectangle
 * rect(0, 0, 100, 100, 'blue', { 'clip-path': 'url(#myClip)' })
 */
export function clipPath(id: string, children?: SvgDef[]): SvgDef {
  return { type: 'clipPath', attrs: { id }, ...(children && { children }) };
}

/**
 * Create a mask element (`<mask>`). Defines a masking region using brightness — white areas are fully visible, black areas are fully hidden, and gray areas are semi-transparent.
 *
 * Difference from `<clipPath>`: masks respect fill colors and gradients, allowing smooth fade-outs and soft edges. clipPath is purely geometric (hard edges). Use a mask when you need partial transparency or gradient-based fading.
 *
 * @param id - Mask identifier. Reference with `{ mask: 'url(#myMask)' }`.
 * @param children - Child SvgDefs that define the mask. White (`fill: 'white'`) = fully visible, black (`fill: 'black'`) = fully hidden, gray = semi-transparent.
 * @returns A mask SvgDef
 *
 * @example
 * // Full-circle mask (everything visible)
 * mask('myMask', [rect(0, 0, 100, 100, 'white')])
 *
 * @example
 * // Apply masking to a circle
 * circle(50, 50, 40, 'red', { mask: 'url(#myMask)' })
 */
export function mask(id: string, children?: SvgDef[]): SvgDef {
  return { type: 'mask', attrs: { id }, ...(children && { children }) };
}

// ============================================================
// Resource / Definition Elements
// ============================================================

/**
 * Create a linear gradient element (`<linearGradient>`). Defines a smooth color transition along a straight line.
 *
 * Coordinates default to the objectBoundingBox coordinate system (0 to 1 = from one edge of the shape to the other). You can also use percentage strings like `'50%'`. Reference the gradient with `fill: 'url(#myGrad)'` or `{ fill: 'url(#myGrad)' }`.
 *
 * @param id - Gradient identifier. Referenced as `'url(#id)'` in `fill`, `stroke`, etc.
 * @param x1 - Start point x. Default: `0` = left edge (in 0-1 bounding box system).
 * @param y1 - Start point y
 * @param x2 - End point x. `1` = right edge.
 * @param y2 - End point y
 * @param stops - Array of stop definitions created with `stop()`. Defines the color stops along the gradient line.
 * @returns A linearGradient SvgDef
 *
 * @example
 * // Horizontal gradient (red → yellow → blue, left to right)
 * linearGradient('myGrad', 0, 0, 1, 0, [
 *   stop(0, 'red'),
 *   stop(0.5, 'yellow'),
 *   stop(1, 'blue'),
 * ])
 */
export function linearGradient(
  id: string,
  x1: number | string,
  y1: number | string,
  x2: number | string,
  y2: number | string,
  stops?: SvgDef[],
): SvgDef {
  return { type: 'linearGradient', attrs: { id, x1, y1, x2, y2 }, ...(stops && { children: stops }) };
}

/**
 * Create a radial gradient element (`<radialGradient>`). Defines a smooth color transition radiating outward from a center point.
 *
 * Coordinates default to the objectBoundingBox system (0 to 1). You can also use percentage strings like `'50%'`. Reference the gradient with `fill: 'url(#id)'`.
 *
 * @param id - Gradient identifier. Referenced as `'url(#id)'` in `fill`, `stroke`, etc.
 * @param cx - Center x. Default: `'50%'` or `0.5` for center.
 * @param cy - Center y
 * @param r - Radius of the gradient circle
 * @param stops - Array of stop definitions from `stop()`
 * @returns A radialGradient SvgDef
 *
 * @example
 * // White-to-black radial gradient from center
 * radialGradient('rg', '50%', '50%', '50%', [
 *   stop(0, 'white'),
 *   stop(1, 'black'),
 * ])
 */
export function radialGradient(
  id: string,
  cx: number | string,
  cy: number | string,
  r: number | string,
  stops?: SvgDef[],
): SvgDef {
  return { type: 'radialGradient', attrs: { id, cx, cy, r }, ...(stops && { children: stops }) };
}

/**
 * Create a gradient stop element (`<stop>`). Must be a child of `linearGradient()` or `radialGradient()`.
 *
 * At least two stops are needed for a visible gradient. The first stop (offset 0) and last stop (offset 1) define the gradient's start and end colors.
 *
 * @param offset - Stop position: a number between 0 and 1 (e.g. `0.5` = 50%), or a percentage string (e.g. `'50%'`, `'100%'`). `0` = start of gradient, `1` = end.
 * @param color - Stop color. Any valid SVG color string: named color (e.g. `'red'`), hex (`'#ff0000'`), rgb (`'rgb(255,0,0)'`), hsl, etc.
 * @param opacity - Stop opacity from 0 (transparent) to 1 (opaque). Optional. Default: 1 (fully opaque).
 * @returns A stop SvgDef with offset, stop-color, and optional stop-opacity
 *
 * @example
 * // Solid red at 0%
 * stop(0, 'red')
 *
 * @example
 * // Semi-transparent blue at 50%
 * stop(0.5, 'blue', 0.5)
 *
 * @example
 * // Dark gray at 100% using percentage string
 * stop('100%', '#333')
 */
export function stop(offset: string | number, color: string, opacity?: number): SvgDef {
  return {
    type: 'stop',
    attrs: { offset, 'stop-color': color, ...(opacity !== undefined && { 'stop-opacity': opacity }) },
  };
}

/**
 * Create a marker element (`<marker>`). Defines a reusable graphic (like an arrowhead, bullet, or custom symbol) that can be attached to the end of lines, paths, or polygons.
 *
 * The `orient` attribute controls rotation: `'auto'` rotates the marker to follow the line direction (essential for arrowheads on angled lines). A fixed number (e.g. `'0'`) keeps it at a constant angle regardless of line direction. Reference the marker with `{ 'marker-end': 'url(#id)' }` on a line or path.
 *
 * @param id - Marker identifier. Referenced as `'url(#id)'` in `marker-start`, `marker-mid`, or `marker-end` attributes.
 * @param attrs - Marker attributes. Common ones: `markerWidth`, `markerHeight` (size of the marker viewport), `refX`, `refY` (anchor point within the marker — where it attaches to the line), `orient` (rotation behavior: `'auto'` to follow line direction, `'0'` for fixed).
 * @param children - Child shapes that draw the marker content
 * @returns A marker SvgDef
 *
 * @example
 * // Arrowhead marker
 * marker('arrow', { markerWidth: 10, markerHeight: 10, refX: 9, refY: 5, orient: 'auto' }, [
 *   path('M0 0 L10 5 L0 10 Z', '#333'),
 * ])
 *
 * @example
 * // Apply to a line
 * const ln = line(0, 0, 100, 100)
 * attr(ln, 'marker-end', 'url(#arrow)')
 * withStroke(ln, '#333', 2)
 */
export function marker(id: string, attrs?: Record<string, unknown>, children?: SvgDef[]): SvgDef {
  return { type: 'marker', attrs: { id, ...attrs }, ...(children && { children }) };
}

// ============================================================
// Reference & Content Elements
// ============================================================

/**
 * Create a use element (`<use>`). References a `<symbol>`, another SVG element by ID, or an external SVG file.
 *
 * **Note:** Uses the modern `href` attribute (not `xlink:href`). Modern browsers support `href` on `<use>`, but some very old renderers may need `xlink:href` instead.
 *
 * @param href - Reference ID with `#` prefix (e.g. `'#icon'`), or a full URL to an external SVG file. Required.
 * @param x - X position offset (optional). Default: undefined (no offset, uses symbol's default position).
 * @param y - Y position offset (optional). Default: undefined (no offset).
 * @param width - Width override (optional). Overrides the referenced element's width.
 * @param height - Height override (optional). Overrides the referenced element's height.
 * @returns A use SvgDef with modern href attribute
 *
 * @example
 * // Reference a symbol by ID with position and size
 * use('#icon', 10, 20, 50, 50)
 *
 * @example
 * // Reference without position (uses default position)
 * use('#star')
 */
export function use(href: string, x?: number, y?: number, width?: number, height?: number): SvgDef {
  return {
    type: 'use',
    attrs: { href, ...(x !== undefined && { x }), ...(y !== undefined && { y }), ...(width !== undefined && { width }), ...(height !== undefined && { height }) },
  };
}

/**
 * Create a tspan element (`<tspan>`). Used for inline text formatting inside a `text()` element, like changing color, weight, or font for part of the text.
 *
 * A `<tspan>` must be a child of a `<text>` element. Multiple `<tspan>` elements can be used within one `<text>` element to apply different styles to different parts of the text.
 *
 * @param content - Text content for this span
 * @param attrs - Text formatting attributes. Examples: `{ fill: 'red' }`, `{ 'font-weight': 'bold' }`, `{ 'font-size': '16px' }`, `{ dy: '5' }` (vertical offset for sub/superscript).
 * @returns A tspan SvgDef with text content in the `text` property
 *
 * @example
 * // Bold red text span
 * tspan('bold red text', { 'font-weight': 'bold', fill: 'red' })
 *
 * @example
 * // Mixed formatting in one text element (add children manually)
 * {
 *   ...text(10, 20, ''),
 *   children: [
 *     tspan('normal text'),
 *     tspan('bold text', { 'font-weight': 'bold' }),
 *   ],
 * }
 */
export function tspan(content: string, attrs?: Record<string, unknown>): SvgDef {
  return { type: 'tspan', attrs: { ...attrs }, text: content };
}

// ============================================================
// Animation Elements
// ============================================================

/**
 * Create an animate element (`<animate>`). Animates a single SVG attribute smoothly over time, driven entirely by the SVG engine (no JavaScript needed).
 *
 * This is NOT a standalone element — you must add it as a child of the element you want to animate. Place it inside the element's `children` array.
 *
 * @param attributeName - The SVG attribute to animate. Examples: `'r'` (radius), `'cx'` (center x), `'opacity'`, `'fill'`, `'width'`.
 * @param from - Starting value of the attribute (as a string)
 * @param to - Ending value of the attribute (as a string)
 * @param dur - Duration of one animation cycle. Format: `'1s'` (1 second), `'500ms'` (500 milliseconds), `'2.5s'`.
 * @param repeatCount - How many times to repeat. Common values: `'indefinite'` (loops forever), `'2'` (twice), `'1'` (once).
 * @returns An animate SvgDef to be added as a child of the animated element
 *
 * @example
 * // Pulsing circle that grows from r=30 to r=60 and back
 * {
 *   ...circle(100, 100, 30, 'red'),
 *   children: [animate('r', '30', '60', '1.5s', 'indefinite')],
 * }
 */
export function animate(
  attributeName: string,
  from: string,
  to: string,
  dur: string,
  repeatCount: string,
): SvgDef {
  return { type: 'animate', attrs: { attributeName, from, to, dur, repeatCount } };
}

/**
 * Create an animateTransform element (`<animateTransform>`). Animates the `transform` attribute of an element.
 *
 * Automatically sets `attributeName="transform"` — you don't need to specify it. This is NOT a standalone element; add it as a child of the element to animate.
 *
 * @param type - Type of transform to animate: `'translate'`, `'rotate'`, `'scale'`, `'skewX'`, `'skewY'`.
 * @param from - Starting transform value (as a string). Example for rotate with center: `'0 25 25'` (angle and optional center point).
 * @param to - Ending transform value (as a string). Example for rotate: `'360 25 25'`.
 * @param dur - Duration of one animation cycle. Examples: `'2s'`, `'500ms'`.
 * @param repeatCount - How many times to repeat (optional). Default: `'indefinite'`. Set to `'1'` for one cycle, `'2'` for two, etc.
 * @returns An animateTransform SvgDef to be added as a child of the animated element
 *
 * @example
 * // Continuous spinning (add as child of the element to animate)
 * animateTransform('rotate', '0 25 25', '360 25 25', '2s', 'indefinite')
 */
export function animateTransform(
  type: string,
  from: string,
  to: string,
  dur: string,
  repeatCount?: string,
): SvgDef {
  return {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type,
      from,
      to,
      dur,
      ...(repeatCount !== undefined && { repeatCount }),
    },
  };
}

/**
 * Create a set element (`<set>`). Instantly sets an attribute value at a specific time — no animation, no transition.
 *
 * Unlike `animate()`, the value changes immediately (no interpolation). Useful for hiding elements, changing colors on click, or creating discrete state changes. This is NOT a standalone element; add it as a child.
 *
 * @param attributeName - The attribute to set (e.g. `'opacity'`, `'visibility'`, `'fill'`)
 * @param to - The value to set it to (as a string)
 * @param begin - When to apply the change (optional). Examples: `'1s'` (after 1 second), `'click'` (on mouse click), `'mouseenter'` (on hover). Default: immediate (begins at 0s).
 * @returns A set SvgDef to be added as a child
 *
 * @example
 * // Hide after 3 seconds
 * animationSet('opacity', '0', '3s')
 *
 * @example
 * // Hide on click
 * animationSet('visibility', 'hidden', 'click')
 */
export function animationSet(attributeName: string, to: string, begin?: string): SvgDef {
  return {
    type: 'set',
    attrs: { attributeName, to, ...(begin !== undefined && { begin }) },
  };
}

// ============================================================
// Transform Helpers
// ============================================================

/**
 * Build a transform string from a type and values.
 *
 * **Important:** This returns a STRING, not a SvgDef. You must assign it to `def.attrs.transform`.
 *
 * @param type - Transform type: `'translate'`, `'rotate'`, `'scale'`, `'skewX'`, `'skewY'`, `'matrix'`, or any valid SVG transform function name.
 * @param values - One or more numeric or string values for the transform function. Passed directly as comma-separated arguments.
 * @returns A transform string like `"rotate(45,50,50)"`
 *
 * @example
 * // Rotate 45° around center (50,50)
 * const def = rect(0, 0, 100, 100, 'red')
 * def.attrs.transform = transform('rotate', 45, 50, 50)
 *
 * @example
 * // Translate 100px right, 50px down
 * def.attrs.transform = transform('translate', 100, 50)
 *
 * @example
 * // Matrix transform
 * def.attrs.transform = transform('matrix', 1, 0, 0, 1, 0, 0)
 */
export function transform(type: string, ...values: (number | string)[]): string {
  return `${type}(${values.join(',')})`;
}

/**
 * Create a translate transform string.
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param x - X translation amount in user units (typically pixels)
 * @param y - Y translation amount in user units (optional). When omitted, Y defaults to 0 (single-value translate with just X).
 * @returns A transform string: `"translate(x)"` or `"translate(x,y)"`
 *
 * @example
 * // Move 100px right, 50px down
 * def.attrs.transform = translate(100, 50)
 *
 * @example
 * // Move 50px right only
 * def.attrs.transform = translate(50)
 */
export function translate(x: number, y?: number): string {
  return y !== undefined ? `translate(${x},${y})` : `translate(${x})`;
}

/**
 * Create a rotate transform string.
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param angle - Rotation angle in degrees (positive = clockwise, negative = counter-clockwise)
 * @param cx - Center x for rotation (optional). When omitted, rotates around the origin (0,0).
 * @param cy - Center y for rotation (optional). When omitted, rotates around the origin (0,0).
 * @returns A transform string: `"rotate(angle)"` or `"rotate(angle,cx,cy)"`
 *
 * @example
 * // Rotate 45° around origin
 * def.attrs.transform = rotate(45)
 *
 * @example
 * // Rotate 45° around center point (50, 50)
 * def.attrs.transform = rotate(45, 50, 50)
 */
export function rotate(angle: number, cx?: number, cy?: number): string {
  return cx !== undefined && cy !== undefined
    ? `rotate(${angle},${cx},${cy})`
    : `rotate(${angle})`;
}

/**
 * Create a scale transform string.
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param x - X scale factor. `1` = original size, `2` = double width, `0.5` = half width, `-1` = flipped horizontally.
 * @param y - Y scale factor (optional, defaults to `x` when omitted — uniform scaling). `1` = original height.
 * @returns A transform string: `"scale(x)"` or `"scale(x,y)"`
 *
 * @example
 * // Uniform scale 2x (both width and height doubled)
 * def.attrs.transform = scale(2)
 *
 * @example
 * // Non-uniform: double width, triple height
 * def.attrs.transform = scale(2, 3)
 */
export function scale(x: number, y?: number): string {
  return y !== undefined ? `scale(${x},${y})` : `scale(${x})`;
}

/**
 * Create a skewX transform string (tilts/shears the element along the X axis, making vertical lines slanted).
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param angle - Skew angle in degrees. Positive values tilt to the right, negative values tilt to the left.
 * @returns A transform string: `"skewX(angle)"`
 *
 * @example
 * def.attrs.transform = skewX(30)
 */
export function skewX(angle: number): string {
  return `skewX(${angle})`;
}

/**
 * Create a skewY transform string (tilts/shears the element along the Y axis, making horizontal lines slanted).
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param angle - Skew angle in degrees. Positive values tilt downward, negative values tilt upward.
 * @returns A transform string: `"skewY(angle)"`
 *
 * @example
 * def.attrs.transform = skewY(30)
 */
export function skewY(angle: number): string {
  return `skewY(${angle})`;
}

/**
 * Compose multiple transform strings into one combined transform string.
 *
 * Filters out falsy values (`null`, `undefined`, `false`), making conditional composition easy.
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param transforms - One or more transform strings (from `translate()`, `rotate()`, `scale()`, etc.) or falsy values (like `false`) to conditionally skip. Each string is a single SVG transform function.
 * @returns A combined transform string with spaces between each transform
 *
 * @example
 * // Translate then rotate
 * def.attrs.transform = composeTransforms(translate(100, 50), rotate(45))
 *
 * @example
 * // Conditional transforms — falsy values like `false` are auto-skipped
 * def.attrs.transform = composeTransforms(translate(10), needsRotate && rotate(45))
 */
export function composeTransforms(...transforms: (string | undefined | null | false)[]): string {
  return transforms.filter(Boolean).join(' ');
}

/**
 * A single transform step used with `buildTransform()`.
 *
 * @property type - Transform type (e.g. `'translate'`, `'rotate'`, `'scale'`, `'skewX'`, `'skewY'`, `'matrix'`)
 * @property values - One or more numeric or string values for the transform function
 *
 * @example
 * const step: TransformStep = { type: 'translate', values: [100, 50] }
 */
export interface TransformStep {
  type: string;
  values: (number | string)[];
}

/**
 * Build a transform string from structured step objects.
 *
 * Alternative to `composeTransforms()` for programmatic or data-driven transform building. Useful when you need to generate transforms dynamically from data.
 *
 * **Important:** Returns a STRING, not a SvgDef. Assign to `def.attrs.transform`.
 *
 * @param steps - One or more TransformStep objects, each with a `type` (string) and `values` (array of numbers/strings)
 * @returns A combined transform string with spaces between each transform
 *
 * @example
 * def.attrs.transform = buildTransform(
 *   { type: 'translate', values: [100, 50] },
 *   { type: 'rotate', values: [45, 50, 50] },
 * )
 */
export function buildTransform(...steps: TransformStep[]): string {
  return steps.map(s => `${s.type}(${s.values.join(',')})`).join(' ');
}

// ============================================================
// Style Utilities
// ============================================================

/**
 * Set stroke color and width on a def.
 *
 * **Mutates** the def in-place and returns it for chaining (you can chain multiple `with*` calls).
 *
 * @param def - The SvgDef to modify. Must be an object with an `attrs` property.
 * @param color - Stroke color (any valid SVG color: named like `'black'`, hex like `'#333'`, rgb, hsl)
 * @param width - Stroke width in user units (typically pixels). E.g. `2`, `1.5`, `0` for hairline.
 * @returns The same def (mutated). Can chain further calls like `withOpacity(withStroke(...), 0.5)`.
 *
 * @example
 * // Gold circle with black border
 * withStroke(circle(50, 50, 40, 'gold'), 'black', 2)
 *
 * @example
 * // Chaining: set stroke then opacity
 * withOpacity(withStroke(circle(10, 10, 5, 'red'), 'black', 1), 0.5)
 */
export function withStroke(def: SvgDef, color: string, width: number): SvgDef {
  def.attrs.stroke = color;
  def.attrs['stroke-width'] = width;
  return def;
}

/**
 * Append CSS class(es) to a def.
 *
 * **Mutates** the def in-place. Appends to any existing `class` attribute, preserving previously set classes.
 *
 * @param def - The SvgDef to modify
 * @param classes - One or more CSS class names (space-separated in the output). Pass multiple strings for multiple classes.
 * @returns The same def (mutated). Supports chaining with other `with*` utilities.
 *
 * @example
 * // Two classes on a circle
 * withClass(circle(10, 10, 5), 'highlight', 'active')
 *
 * @example
 * // Chaining with style
 * withStyle(withClass(circle(10, 10, 5), 'dot'), { fill: 'red' })
 */
export function withClass(def: SvgDef, ...classes: string[]): SvgDef {
  const existing = def.attrs.class ? String(def.attrs.class) + ' ' : '';
  def.attrs.class = existing + classes.join(' ');
  return def;
}

/**
 * Set inline CSS style from a camelCase object.
 *
 * Converts camelCase keys to kebab-case automatically: `strokeWidth` → `stroke-width`, `fontSize` → `font-size`. Use this for styling that can't be expressed as SVG attributes.
 *
 * **Mutates** the def in-place.
 *
 * @param def - The SvgDef to modify
 * @param style - Style object with camelCase keys and string or number values. Example: `{ fill: 'red', strokeWidth: 2, fontSize: '14px' }`.
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * withStyle(def, { fill: 'red', strokeWidth: 2 })
 * // def.attrs.style === 'fill: red; stroke-width: 2'
 */
export function withStyle(def: SvgDef, style: Record<string, string | number>): SvgDef {
  def.attrs.style = Object.entries(style)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)}: ${v}`)
    .join('; ');
  return def;
}

/**
 * Set opacity on a def.
 *
 * **Mutates** the def in-place. Opacity is applied to the element and all its children.
 *
 * @param def - The SvgDef to modify
 * @param value - Opacity value from 0 (fully transparent / invisible) to 1 (fully opaque). Values outside this range are clamped by the SVG renderer.
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * // Semi-transparent circle
 * withOpacity(circle(10, 10, 5), 0.5)
 *
 * @example
 * // Chaining with stroke and fill
 * withOpacity(withStroke(withStyle(circle(10, 10, 5), { fill: 'red' }), 'black', 1), 0.3)
 */
export function withOpacity(def: SvgDef, value: number): SvgDef {
  def.attrs.opacity = value;
  return def;
}

/**
 * Set the fill color on a def.
 *
 * **Mutates** the def in-place. Overwrites any existing fill value.
 *
 * @param def - The SvgDef to modify
 * @param color - Fill color (any valid SVG color: named, hex, rgb, hsl, or `'none'` for no fill)
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * setFill(circle(10, 10, 5), 'blue')
 *
 * @example
 * // Chaining with stroke
 * withStroke(setFill(circle(10, 10, 5), 'blue'), 'black', 2)
 */
export function setFill(def: SvgDef, color: string): SvgDef {
  def.attrs.fill = color;
  return def;
}

/**
 * Shorthand alias for `setFill()`. Sets the fill color on a def.
 *
 * **Mutates** the def in-place. Identical to `setFill(def, color)`.
 *
 * @param def - The SvgDef to modify
 * @param color - Fill color (any valid SVG color)
 * @returns The same def (mutated)
 *
 * @example
 * fill(circle(10, 10, 5), 'blue')
 *
 * @see setFill
 */
export function fill(def: SvgDef, color: string): SvgDef {
  def.attrs.fill = color;
  return def;
}

/**
 * Set the stroke color and optional width on a def.
 *
 * Unlike `withStroke()`, the `width` parameter is optional here — call with just color to set stroke without changing width.
 *
 * **Mutates** the def in-place.
 *
 * @param def - The SvgDef to modify
 * @param color - Stroke color (any valid SVG color)
 * @param width - Stroke width in user units (optional). Default: undefined (leaves existing width unchanged, or uses SVG default of 1).
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * // Just stroke color (keeps existing width)
 * stroke(def, 'black')
 *
 * @example
 * // Stroke color + width
 * stroke(def, 'black', 2)
 *
 * @example
 * // Chaining
 * stroke(fill(circle(10, 10, 5), 'red'), 'black', 2)
 */
export function stroke(def: SvgDef, color: string, width?: number): SvgDef {
  def.attrs.stroke = color;
  if (width !== undefined) def.attrs['stroke-width'] = width;
  return def;
}

/**
 * Show a def by removing the `display` attribute.
 *
 * Reverses a previous `hide()` call. The element becomes visible again if it was hidden.
 *
 * **Mutates** the def in-place.
 *
 * @param def - The SvgDef to modify
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * show(def)
 */
export function show(def: SvgDef): SvgDef {
  delete def.attrs.display;
  return def;
}

/**
 * Hide a def by setting `display: none`.
 *
 * The element still exists in the DOM (and SVG tree) but is invisible and does not take up space. Use `show()` to unhide.
 *
 * **Mutates** the def in-place.
 *
 * @param def - The SvgDef to modify
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * hide(def)
 *
 * @example
 * // Toggle visibility
 * show(hide(def))  // hides, then shows immediately (just for demo)
 */
export function hide(def: SvgDef): SvgDef {
  def.attrs.display = 'none';
  return def;
}

// ============================================================
// Composition Utilities
// ============================================================

/**
 * Deep-clone a SvgDef. Creates an independent copy with all children recursively cloned.
 *
 * Does **not** mutate the original def. Use this when you need to reuse a def definition but modify it without affecting the original.
 *
 * @param def - The SvgDef to clone. All properties (type, attrs, id, text, events, children) are deep-copied.
 * @param overrides - Optional top-level overrides merged into the clone. Same shape as `SvgDef`. Example: `{ attrs: { fill: 'blue' } }` overrides the fill attribute.
 * @returns A new SvgDef that is a deep copy of the original with optional overrides applied
 *
 * @example
 * // Clone and override fill
 * const original = circle(50, 50, 40, 'red')
 * const cloned = cloneDef(original, { attrs: { fill: 'blue' } })
 * // cloned.attrs.fill === 'blue'
 * // original.attrs.fill === 'red' (unchanged)
 *
 * @example
 * // Simple clone without overrides
 * const copy = cloneDef(circle(10, 10, 5))
 */
export function cloneDef(def: SvgDef, overrides?: Partial<SvgDef>): SvgDef {
  const clone: SvgDef = {
    type: def.type,
    attrs: { ...def.attrs },
    ...(def.id && { id: def.id }),
    ...(def.text !== undefined && { text: def.text }),
    ...(def.events && { events: { ...def.events } }),
    ...(def.children && { children: def.children.map(c => cloneDef(c)) }),
  };
  if (overrides) {
    if (overrides.type) clone.type = overrides.type;
    if (overrides.attrs) Object.assign(clone.attrs, overrides.attrs);
    if (overrides.id !== undefined) clone.id = overrides.id;
    if (overrides.text !== undefined) clone.text = overrides.text;
    if (overrides.events) clone.events = { ...(clone.events || {}), ...overrides.events };
    if (overrides.children) clone.children = overrides.children;
  }
  return clone;
}

/**
 * Merge multiple defs left-to-right into a single new def.
 *
 * Merging rules (last-wins for conflicts):
 * - **Attrs**: merged via `Object.assign` — later defs overwrite earlier ones for the same key.
 * - **Events**: merged (last-wins for the same event type).
 * - **Children**: concatenated — all children from all defs are included.
 * - **`id`**: overwritten by the last def that has an `id`.
 * - **`text`**: overwritten by the last def that has `text`.
 *
 * Does **not** mutate any input defs. Returns a fresh clone representing the merge.
 *
 * @param defs - Two or more SvgDefs to merge. The first def provides the base type and initial attrs.
 * @returns A new SvgDef with combined properties from all input defs
 *
 * @example
 * // Merge circle def with stroke attribute
 * mergeDefs(circle(10, 10, 5, 'red'), { attrs: { stroke: 'black' } })
 *
 * @example
 * // Merge with children concatenation
 * mergeDefs(group([circle(10, 10, 5)]), { children: [rect(0, 0, 20, 20)] })
 * // Result has both circle and rect as children
 */
export function mergeDefs(...defs: SvgDef[]): SvgDef {
  const result = cloneDef(defs[0]);
  for (let i = 1; i < defs.length; i++) {
    Object.assign(result.attrs, defs[i].attrs);
    if (defs[i].events) {
      result.events = { ...result.events, ...defs[i].events };
    }
    const childDefs = defs[i].children;
    if (childDefs) {
      result.children = [...(result.children || []), ...childDefs];
    }
    if (defs[i].id !== undefined) result.id = defs[i].id;
    if (defs[i].text !== undefined) result.text = defs[i].text;
  }
  return result;
}

/**
 * Create a def with explicit id, type, attrs, and children.
 *
 * Low-level builder for SVG elements not covered by the named helper functions (like `'filter'`, `'feDropShadow'`, `'pattern'`, or custom elements). Use this when no specific helper exists for the SVG element you need.
 *
 * @param id - Element ID (used for DOM-diffing on re-render — elements with the same ID are updated in-place)
 * @param type - SVG element type string (e.g. `'circle'`, `'rect'`, `'filter'`, `'pattern'`, `'feGaussianBlur'`)
 * @param attrs - Attribute object (optional). Default: `{}`.
 * @param children - Child SvgDefs (optional)
 * @returns A new SvgDef with type, attrs, id, and optional children
 *
 * @example
 * // Custom element not available as a named helper
 * createDef('myFilter', 'filter', { x: 0, y: 0, width: 1, height: 1 })
 */
export function createDef(id: string, type: string, attrs?: Record<string, unknown>, children?: SvgDef[]): SvgDef {
  return { type, attrs: attrs || {}, id, ...(children && { children }) };
}

// ============================================================
// Attribute Utilities
// ============================================================

/**
 * Get or set a single attribute on a def.
 *
 * This function has TWO modes:
 * - **Getter**: call `attr(def, 'key')` — returns the current value of that attribute.
 * - **Setter**: call `attr(def, 'key', value)` — sets the attribute, mutates the def, and returns the def.
 *
 * @param def - The SvgDef to query or modify
 * @param key - Attribute name (e.g. `'fill'`, `'cx'`, `'stroke-width'`)
 * @param value - Attribute value to set (omit for getter mode). Can be any JSON-serializable value.
 * @returns In getter mode: the attribute value (or `undefined` if not set). In setter mode: the def (for chaining).
 *
 * @example
 * // Getter — read the cx value
 * const cx = attr(circle(10, 20, 30), 'cx')  // → 10
 *
 * @example
 * // Setter — change fill, returns def for chaining
 * attr(def, 'fill', 'blue')
 */
export function attr(def: SvgDef, key: string): unknown;
export function attr(def: SvgDef, key: string, value: unknown): SvgDef;
export function attr(def: SvgDef, key: string, value?: unknown): unknown | SvgDef {
  if (value === undefined) return def.attrs[key];
  def.attrs[key] = value;
  return def;
}

/**
 * Remove an attribute from a def.
 *
 * **Mutates** the def in-place. After removal, the attribute is `undefined` and will not appear in the rendered SVG.
 *
 * @param def - The SvgDef to modify
 * @param key - Attribute name to remove (e.g. `'fill'`, `'stroke'`, `'opacity'`)
 * @returns The same def (mutated). Supports chaining.
 *
 * @example
 * removeAttr(def, 'fill')
 */
export function removeAttr(def: SvgDef, key: string): SvgDef {
  delete def.attrs[key];
  return def;
}

// ============================================================
// Position / Size Getters
// ============================================================

/**
 * Get the `cx` (center x) attribute from a def.
 *
 * @param def - The SvgDef to query
 * @returns The `cx` value as a number, or `undefined` if not set
 *
 * @example
 * cx(circle(50, 100, 30))  // → 50
 */
export function cx(def: SvgDef): number | undefined {
  return def.attrs.cx as number | undefined;
}

/**
 * Get the `cy` (center y) attribute from a def.
 *
 * @param def - The SvgDef to query
 * @returns The `cy` value as a number, or `undefined` if not set
 *
 * @example
 * cy(circle(50, 100, 30))  // → 100
 */
export function cy(def: SvgDef): number | undefined {
  return def.attrs.cy as number | undefined;
}

/**
 * Get the `r` (radius) attribute from a def.
 *
 * @param def - The SvgDef to query
 * @returns The `r` value as a number, or `undefined` if not set
 *
 * @example
 * r(circle(50, 100, 30))  // → 30
 */
export function r(def: SvgDef): number | undefined {
  return def.attrs.r as number | undefined;
}

/**
 * Get the `x` attribute from a def.
 *
 * @param def - The SvgDef to query (typically a rect, image, or text def)
 * @returns The `x` value as a number, or `undefined` if not set
 *
 * @example
 * x(rect(10, 20, 100, 50))  // → 10
 */
export function x(def: SvgDef): number | undefined {
  return def.attrs.x as number | undefined;
}

/**
 * Get the `y` attribute from a def.
 *
 * @param def - The SvgDef to query (typically a rect, image, or text def)
 * @returns The `y` value as a number, or `undefined` if not set
 *
 * @example
 * y(rect(10, 20, 100, 50))  // → 20
 */
export function y(def: SvgDef): number | undefined {
  return def.attrs.y as number | undefined;
}

/**
 * Get the `width` attribute from a def.
 *
 * @param def - The SvgDef to query (typically a rect, image, or svg def)
 * @returns The `width` value as a number, or `undefined` if not set
 *
 * @example
 * width(rect(10, 20, 100, 50))  // → 100
 */
export function width(def: SvgDef): number | undefined {
  return def.attrs.width as number | undefined;
}

/**
 * Get the `height` attribute from a def.
 *
 * @param def - The SvgDef to query (typically a rect, image, or svg def)
 * @returns The `height` value as a number, or `undefined` if not set
 *
 * @example
 * height(rect(10, 20, 100, 50))  // → 50
 */
export function height(def: SvgDef): number | undefined {
  return def.attrs.height as number | undefined;
}

// ============================================================
// Multi-attribute Accessor
// ============================================================

/**
 * Get all attributes (shallow copy) or merge an object into the def's attrs.
 *
 * This function has TWO modes:
 * - **Getter**: `attrs(def)` — returns a shallow copy of `def.attrs`. Modifying the returned object does NOT affect the original.
 * - **Setter**: `attrs(def, obj)` — merges all properties from `obj` into `def.attrs`. Mutates the def in-place and returns the def.
 *
 * @param def - The SvgDef to query or modify
 * @param obj - An object of attributes to merge into the def (omit for getter mode). Properties with `undefined` values are set as `undefined`.
 * @returns Getter mode: a shallow copy of the def's attrs. Setter mode: the def (for chaining).
 *
 * @example
 * // Getter — safe to modify returned object
 * const all = attrs(myRect)
 * all.fill = 'blue'  // does NOT mutate myRect
 *
 * @example
 * // Setter — merge multiple attributes at once
 * attrs(def, { fill: 'blue', stroke: 'black' })
 */
export function attrs(def: SvgDef): Record<string, unknown>;
export function attrs(def: SvgDef, obj: Record<string, unknown>): SvgDef;
export function attrs(def: SvgDef, obj?: Record<string, unknown>): Record<string, unknown> | SvgDef {
  if (obj === undefined) return { ...def.attrs };
  Object.assign(def.attrs, obj);
  return def;
}

// ============================================================
// Color Helpers
// ============================================================

/**
 * Convert RGB component values to a hex color string.
 *
 * Values are automatically clamped to the valid 0–255 range. Non-integer values are rounded to the nearest integer. This means out-of-range values are safely handled without errors.
 *
 * @param r - Red component (expected 0–255). Values > 255 clamp to 255, values < 0 clamp to 0.
 * @param g - Green component (expected 0–255)
 * @param b - Blue component (expected 0–255)
 * @returns A hex color string with `#` prefix, like `"#ff0000"`
 *
 * @example
 * toHex(255, 0, 0)      // → "#ff0000" (red)
 * toHex(0, 255, 0)      // → "#00ff00" (green)
 * toHex(0, 0, 0)        // → "#000000" (black)
 * toHex(300, -10, 128)  // → "#ff0080" (clamped: 300→255, -10→0)
 */
export function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[r, g, b].map(n => clamp(n).toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Parse a hex color string to RGB values.
 *
 * Accepts three input formats:
 * - 6-digit with `#`: `"#ff0000"`
 * - 3-digit shorthand with `#`: `"#f00"` (expands to `"#ff0000"`)
 * - Without `#` prefix: `"ff0000"` or `"f00"`
 *
 * Returns `null` for invalid inputs instead of throwing.
 *
 * @param hex - Hex color string. Supported formats: `"#ff0000"`, `"#f00"`, `"ff0000"`, `"f00"`. Case-insensitive.
 * @returns An RGB object `{ r: number, g: number, b: number }` with values 0–255, or `null` if the input is not a valid hex color
 *
 * @example
 * toRgb('#ff0000')     // → { r: 255, g: 0, b: 0 }  (6-digit with #)
 * toRgb('#f00')        // → { r: 255, g: 0, b: 0 }  (3-digit shorthand)
 * toRgb('ff0000')      // → { r: 255, g: 0, b: 0 }  (no # prefix)
 * toRgb('#xyz')        // → null  (invalid hex)
 */
export function toRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = hex.replace(/^#/, '').match(/^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/);
  if (!match) {
    const short = hex.replace(/^#/, '').match(/^([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/);
    if (!short) return null;
    return {
      r: parseInt(short[1] + short[1], 16),
      g: parseInt(short[2] + short[2], 16),
      b: parseInt(short[3] + short[3], 16),
    };
  }
  return {
    r: parseInt(match[1], 16),
    g: parseInt(match[2], 16),
    b: parseInt(match[3], 16),
  };
}

// ============================================================
// Path Builder
// ============================================================

/**
 * Fluent builder for SVG path `d` strings.
 *
 * Chain SVG path commands and call `.build()` to produce a string suitable for `path()` or direct use in `attrs.d`. Each method returns the builder instance so calls can be chained indefinitely.
 *
 * @example
 * // Complex path with multiple curve types
 * const d = new PathBuilder()
 *   .M(10, 10)            // move to start
 *   .C(40, 5, 60, 40, 100, 20)  // cubic bezier
 *   .Q(120, 40, 140, 10)  // quadratic bezier
 *   .Z()                  // close path
 *   .build()
 * // Result: "M 10 10 C 40 5 60 40 100 20 Q 120 40 140 10 Z"
 *
 * @example
 * // Using with path()
 * const p = path(new PathBuilder().M(0, 0).L(100, 100).build(), 'none')
 */
export class PathBuilder {
  private d: string[] = [];

  /**
   * Move to (absolute): `M x y`.
   * Lifts the pen and moves to a new coordinate without drawing.
   * @param x - Target x coordinate
   * @param y - Target y coordinate
   * @returns The builder for chaining
   */
  M(x: number, y: number): this { this.d.push(`M ${x} ${y}`); return this; }

  /**
   * Move to (relative): `m dx dy`.
   * Lifts the pen and moves relative to the current position.
   * @param dx - Relative x offset
   * @param dy - Relative y offset
   * @returns The builder for chaining
   */
  m(dx: number, dy: number): this { this.d.push(`m ${dx} ${dy}`); return this; }

  /**
   * Line to (absolute): `L x y`.
   * Draws a straight line from the current position to (x, y).
   * @param x - Endpoint x coordinate
   * @param y - Endpoint y coordinate
   * @returns The builder for chaining
   */
  L(x: number, y: number): this { this.d.push(`L ${x} ${y}`); return this; }

  /**
   * Line to (relative): `l dx dy`.
   * Draws a straight line relative to the current position.
   * @param dx - Relative x offset
   * @param dy - Relative y offset
   * @returns The builder for chaining
   */
  l(dx: number, dy: number): this { this.d.push(`l ${dx} ${dy}`); return this; }

  /**
   * Horizontal line (absolute): `H x`.
   * Draws a horizontal line to the given x coordinate at the current y.
   * @param x - Target x coordinate
   * @returns The builder for chaining
   */
  H(x: number): this { this.d.push(`H ${x}`); return this; }

  /**
   * Horizontal line (relative): `h dx`.
   * Draws a horizontal line relative to the current position.
   * @param dx - Relative x offset
   * @returns The builder for chaining
   */
  h(dx: number): this { this.d.push(`h ${dx}`); return this; }

  /**
   * Vertical line (absolute): `V y`.
   * Draws a vertical line to the given y coordinate at the current x.
   * @param y - Target y coordinate
   * @returns The builder for chaining
   */
  V(y: number): this { this.d.push(`V ${y}`); return this; }

  /**
   * Vertical line (relative): `v dy`.
   * Draws a vertical line relative to the current position.
   * @param dy - Relative y offset
   * @returns The builder for chaining
   */
  v(dy: number): this { this.d.push(`v ${dy}`); return this; }

  /**
   * Cubic bezier curve (absolute): `C x1 y1 x2 y2 x y`.
   * Draws a cubic bezier from the current position to (x, y) using two control points (x1,y1) and (x2,y2).
   * @param x1 - First control point x
   * @param y1 - First control point y
   * @param x2 - Second control point x
   * @param y2 - Second control point y
   * @param x - Endpoint x
   * @param y - Endpoint y
   * @returns The builder for chaining
   */
  C(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this { this.d.push(`C ${x1} ${y1} ${x2} ${y2} ${x} ${y}`); return this; }

  /**
   * Cubic bezier curve (relative): `c dx1 dy1 dx2 dy2 dx dy`.
   * @param dx1 - First control point relative x
   * @param dy1 - First control point relative y
   * @param dx2 - Second control point relative x
   * @param dy2 - Second control point relative y
   * @param dx - Endpoint relative x
   * @param dy - Endpoint relative y
   * @returns The builder for chaining
   */
  c(dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number): this { this.d.push(`c ${dx1} ${dy1} ${dx2} ${dy2} ${dx} ${dy}`); return this; }

  /**
   * Smooth cubic bezier (absolute): `S x2 y2 x y`.
   * Draws a cubic bezier reflecting the control point of the previous curve for a smooth join.
   * @param x2 - Second control point x (first is reflected from previous)
   * @param y2 - Second control point y
   * @param x - Endpoint x
   * @param y - Endpoint y
   * @returns The builder for chaining
   */
  S(x2: number, y2: number, x: number, y: number): this { this.d.push(`S ${x2} ${y2} ${x} ${y}`); return this; }

  /**
   * Smooth cubic bezier (relative): `s dx2 dy2 dx dy`.
   * @param dx2 - Second control point relative x
   * @param dy2 - Second control point relative y
   * @param dx - Endpoint relative x
   * @param dy - Endpoint relative y
   * @returns The builder for chaining
   */
  s(dx2: number, dy2: number, dx: number, dy: number): this { this.d.push(`s ${dx2} ${dy2} ${dx} ${dy}`); return this; }

  /**
   * Quadratic bezier (absolute): `Q x1 y1 x y`.
   * Draws a quadratic bezier from the current position to (x, y) using one control point (x1, y1).
   * @param x1 - Control point x
   * @param y1 - Control point y
   * @param x - Endpoint x
   * @param y - Endpoint y
   * @returns The builder for chaining
   */
  Q(x1: number, y1: number, x: number, y: number): this { this.d.push(`Q ${x1} ${y1} ${x} ${y}`); return this; }

  /**
   * Quadratic bezier (relative): `q dx1 dy1 dx dy`.
   * @param dx1 - Control point relative x
   * @param dy1 - Control point relative y
   * @param dx - Endpoint relative x
   * @param dy - Endpoint relative y
   * @returns The builder for chaining
   */
  q(dx1: number, dy1: number, dx: number, dy: number): this { this.d.push(`q ${dx1} ${dy1} ${dx} ${dy}`); return this; }

  /**
   * Smooth quadratic bezier (absolute): `T x y`.
   * Draws a quadratic bezier reflecting the control point of the previous curve for a smooth join.
   * @param x - Endpoint x
   * @param y - Endpoint y
   * @returns The builder for chaining
   */
  T(x: number, y: number): this { this.d.push(`T ${x} ${y}`); return this; }

  /**
   * Smooth quadratic bezier (relative): `t dx dy`.
   * @param dx - Endpoint relative x
   * @param dy - Endpoint relative y
   * @returns The builder for chaining
   */
  t(dx: number, dy: number): this { this.d.push(`t ${dx} ${dy}`); return this; }

  /**
   * Arc (absolute): `A rx ry x-axis-rotation large-arc-flag sweep-flag x y`.
   * Draws an elliptical arc from the current position to (x, y). The `large-arc-flag` (0 or 1) chooses the larger or smaller arc. The `sweep-flag` (0 or 1) chooses clockwise or counter-clockwise direction.
   * @param rx - X-axis radius of the ellipse
   * @param ry - Y-axis radius of the ellipse
   * @param xRot - Rotation of the ellipse in degrees
   * @param largeArc - Large arc flag: 0 = small arc, 1 = large arc
   * @param sweep - Sweep flag: 0 = counter-clockwise, 1 = clockwise
   * @param x - Endpoint x
   * @param y - Endpoint y
   * @returns The builder for chaining
   */
  A(rx: number, ry: number, xRot: number, largeArc: number, sweep: number, x: number, y: number): this { this.d.push(`A ${rx} ${ry} ${xRot} ${largeArc} ${sweep} ${x} ${y}`); return this; }

  /**
   * Arc (relative): `a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy`.
   * @param rx - X-axis radius of the ellipse
   * @param ry - Y-axis radius of the ellipse
   * @param xRot - Rotation of the ellipse in degrees
   * @param largeArc - Large arc flag: 0 = small arc, 1 = large arc
   * @param sweep - Sweep flag: 0 = counter-clockwise, 1 = clockwise
   * @param dx - Endpoint relative x
   * @param dy - Endpoint relative y
   * @returns The builder for chaining
   */
  a(rx: number, ry: number, xRot: number, largeArc: number, sweep: number, dx: number, dy: number): this { this.d.push(`a ${rx} ${ry} ${xRot} ${largeArc} ${sweep} ${dx} ${dy}`); return this; }

  /**
   * Close path: `Z`.
   * Draws a straight line back to the start of the current subpath, closing the shape.
   * @returns The builder for chaining
   */
  Z(): this { this.d.push('Z'); return this; }

  /**
   * Close path (lowercase): `z`.
   * Same as `Z()` — draws a straight line back to the start of the current subpath.
   * @returns The builder for chaining
   */
  z(): this { this.d.push('z'); return this; }

  /**
   * Build the final path `d` string.
   * Call this at the end of the chain to produce the SVG path data string.
   * @returns SVG path data string, e.g. `"M 10 10 L 100 100 Z"`
   *
   * @example
   * const d = new PathBuilder().M(0, 0).L(100, 100).build()
   * path(d, 'none')
   */
  build(): string { return this.d.join(' '); }

  /**
   * Clear all commands from the builder (reuse it for a new path).
   * After calling clear(), the builder is empty and can be reused.
   * @returns The builder for chaining
   */
  clear(): this { this.d = []; return this; }

  /**
   * Get the number of commands currently in the builder.
   * Useful for debugging or checking if the path is empty before building.
   */
  get length(): number { return this.d.length; }
}
