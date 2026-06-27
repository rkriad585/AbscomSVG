import type { SvgDef } from './types';

/**
 * Options for `grid()`.
 */
export interface GridOptions {
  /** Width of each cell (default: 100) */
  cellWidth?: number;
  /** Height of each cell (default: 100) */
  cellHeight?: number;
  /** Starting X offset (default: 0) */
  x?: number;
  /** Starting Y offset (default: 0) */
  y?: number;
}

/**
 * Options for `stack()`.
 */
export interface StackOptions {
  /** Gap between items in the stack direction (default: 10) */
  gap?: number;
  /** Starting X offset (default: 0) */
  x?: number;
  /** Starting Y offset (default: 0) */
  y?: number;
}

/**
 * Create a responsive `<svg>` element that scales to fit its container.
 *
 * Sets `width="100%"` and a `viewBox` so the SVG content scales proportionally
 * to the container width. The result is a plain SvgDef — use `render()` to
 * mount it, or add it as a child of another element.
 *
 * @param viewBoxWidth - Width of the SVG coordinate system (the `viewBox` width)
 * @param viewBoxHeight - Height of the SVG coordinate system (the `viewBox` height)
 * @param children - One or more child SvgDefs to place inside the SVG (optional)
 * @param attrs - Additional attributes (e.g. `{ 'aria-label': 'chart' }`)
 * @returns An SVG SvgDef with `width="100%"` and `viewBox`
 *
 * @example
 * ```ts
 * // Responsive SVG containing a circle
 * responsiveSvg(500, 300, circle(250, 150, 80, 'red'))
 *
 * // With extra attributes
 * responsiveSvg(800, 600, [rect(0, 0, 800, 600, '#f0f0f0')], { id: 'canvas' })
 * ```
 */
export function responsiveSvg(
  viewBoxWidth: number,
  viewBoxHeight: number,
  children?: SvgDef | SvgDef[],
  attrs?: Record<string, unknown>,
): SvgDef {
  const childArr = children
    ? (Array.isArray(children) ? children : [children])
    : undefined;
  return {
    type: 'svg',
    attrs: {
      xmlns: 'http://www.w3.org/2000/svg',
      width: '100%',
      viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
      ...attrs,
    },
    ...(childArr ? { children: childArr } : {}),
  };
}

/**
 * Compute a `viewBox` string (`"minX minY width height"`) from an array of
 * definition objects.
 *
 * Scans all defs (including nested children in groups) and looks for position
 * attributes on known shape types. The returned string is suitable for use as
 * the `viewBox` attribute of an `<svg>` element.
 *
 * Supported shape attributes:
 * - `circle` — `cx`, `cy`, `r`
 * - `ellipse` — `cx`, `cy`, `rx`, `ry`
 * - `rect`, `image` — `x`, `y`, `width`, `height`
 * - `line` — `x1`, `y1`, `x2`, `y2`
 * - `text` — `x`, `y` (no text-width estimation; returns 0-size point)
 * - `<g>` — recurses into children
 *
 * If no known shapes are found, returns `"0 0 100 100"`.
 *
 * Adds a configurable `padding` margin around the bounding box (default 10).
 *
 * @param defs - Array of SvgDefs to measure
 * @param padding - Extra padding around the bounding box (default 10)
 * @returns A `viewBox` string
 *
 * @example
 * ```ts
 * const shapes = [circle(50, 50, 40, 'red'), rect(0, 0, 100, 80, 'blue')];
 * autoViewBox(shapes, 5)
 * // → "-5 -5 110 90"
 * ```
 */
export function autoViewBox(defs: SvgDef[], padding: number = 10): string {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  function scan(d: SvgDef) {
    const t = d.type;
    const a = d.attrs;

    if (t === 'circle') {
      const cx = Number(a.cx ?? 0);
      const cy = Number(a.cy ?? 0);
      const r = Number(a.r ?? 0);
      if (r > 0) {
        minX = Math.min(minX, cx - r);
        minY = Math.min(minY, cy - r);
        maxX = Math.max(maxX, cx + r);
        maxY = Math.max(maxY, cy + r);
      }
    } else if (t === 'ellipse') {
      const cx = Number(a.cx ?? 0);
      const cy = Number(a.cy ?? 0);
      const rx = Number(a.rx ?? 0);
      const ry = Number(a.ry ?? 0);
      if (rx > 0 && ry > 0) {
        minX = Math.min(minX, cx - rx);
        minY = Math.min(minY, cy - ry);
        maxX = Math.max(maxX, cx + rx);
        maxY = Math.max(maxY, cy + ry);
      }
    } else if (t === 'rect' || t === 'image') {
      const x = Number(a.x ?? 0);
      const y = Number(a.y ?? 0);
      const w = Number(a.width ?? 0);
      const h = Number(a.height ?? 0);
      if (w > 0 && h > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x + w);
        maxY = Math.max(maxY, y + h);
      }
    } else if (t === 'line') {
      const x1 = Number(a.x1 ?? 0);
      const y1 = Number(a.y1 ?? 0);
      const x2 = Number(a.x2 ?? 0);
      const y2 = Number(a.y2 ?? 0);
      minX = Math.min(minX, x1, x2);
      minY = Math.min(minY, y1, y2);
      maxX = Math.max(maxX, x1, x2);
      maxY = Math.max(maxY, y1, y2);
    } else if (t === 'text') {
      const x = Number(a.x ?? 0);
      const y = Number(a.y ?? 0);
      // text has no reliable width/height from attrs; treat as point
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    if (d.children) {
      const childArr = Array.isArray(d.children) ? d.children : [d.children];
      for (const child of childArr) scan(child);
    }
  }

  for (const d of defs) scan(d);

  if (!isFinite(minX)) return '0 0 100 100';

  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}

/**
 * Arrange definitions in a grid layout.
 *
 * Each def is wrapped in a `<g>` with a `transform="translate(x, y)"` so it
 * retains its original local coordinates. This works for any shape type.
 *
 * @param defs - The SvgDefs to arrange
 * @param cols - Number of columns in the grid
 * @param options - Grid layout options
 * @returns An array of SvgDefs (each wrapped in a `<g>` with translate)
 *
 * @example
 * ```ts
 * const dots = [circle(20, 20, 10, 'red'), circle(20, 20, 10, 'green'), circle(20, 20, 10, 'blue')];
 * const arranged = grid(dots, 2, { cellWidth: 60, cellHeight: 60, x: 10, y: 10 });
 * render(svg, arranged);
 * ```
 */
export function grid(defs: SvgDef[], cols: number, options: GridOptions = {}): SvgDef[] {
  const { cellWidth = 100, cellHeight = 100, x: startX = 0, y: startY = 0 } = options;
  return defs.map((def, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const tx = startX + col * cellWidth;
    const ty = startY + row * cellHeight;
    return {
      type: 'g',
      attrs: { transform: `translate(${tx},${ty})` },
      children: [def],
    } as SvgDef;
  });
}

/**
 * Arrange definitions in a vertical or horizontal stack.
 *
 * Each def is wrapped in a `<g>` with a `transform` so it retains its
 * original local coordinates.
 *
 * Stack sizes are determined from each def's `width`/`height`/`r` attributes.
 * Falls back to `100` for items without size attributes.
 *
 * @param defs - The SvgDefs to arrange
 * @param direction - Stack direction: `'vertical'` (default) or `'horizontal'`
 * @param options - Stack layout options
 * @returns An array of SvgDefs (each wrapped in a `<g>` with translate)
 *
 * @example
 * ```ts
 * const boxes = [rect(0, 0, 80, 50, 'red'), rect(0, 0, 80, 50, 'green'), rect(0, 0, 80, 50, 'blue')];
 * const arranged = stack(boxes, 'vertical', { gap: 15, x: 20, y: 20 });
 * render(svg, arranged);
 * ```
 */
export function stack(
  defs: SvgDef[],
  direction: 'vertical' | 'horizontal' = 'vertical',
  options: StackOptions = {},
): SvgDef[] {
  const { gap = 10, x: startX = 0, y: startY = 0 } = options;
  let offset = 0;
  return defs.map((def, i) => {
    const size = measureSize(def);
    const pos = direction === 'vertical'
      ? { x: startX, y: startY + offset }
      : { x: startX + offset, y: startY };
    const step = direction === 'vertical' ? size.height : size.width;
    offset += step + (i < defs.length - 1 ? gap : 0);
    return {
      type: 'g',
      attrs: { transform: `translate(${pos.x},${pos.y})` },
      children: [def],
    } as SvgDef;
  });
}

/** @internal Estimate the width/height of a def from its attributes. */
function measureSize(def: SvgDef): { width: number; height: number } {
  const a = def.attrs;
  // rect, image, svg
  if (a.width != null && a.height != null) {
    return { width: Number(a.width), height: Number(a.height) };
  }
  // circle
  if (a.r != null) {
    const d = Number(a.r) * 2;
    return { width: d, height: d };
  }
  // ellipse
  if (a.rx != null && a.ry != null) {
    return { width: Number(a.rx) * 2, height: Number(a.ry) * 2 };
  }
  // fallback
  return { width: 100, height: 100 };
}
