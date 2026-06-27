import type { SvgDef } from './types';

// ============================================================
// FilterBuilder
// ============================================================

/**
 * Fluent builder for SVG `<filter>` definitions.
 *
 * Each method adds a filter primitive as a child of the `<filter>`
 * element. Call `.build()` to get the final `SvgDef`.
 *
 * @example
 * ```ts
 * const blur = new FilterBuilder('myBlur')
 *   .blur(4)
 *   .build();
 * ```
 *
 * @example
 * ```ts
 * const shadow = new FilterBuilder('shadow')
 *   .dropShadow(2, 2, 4, 'rgba(0,0,0,0.5)')
 *   .build();
 * ```
 */
export class FilterBuilder {
  private def: SvgDef;

  /**
   * Create a new filter builder.
   *
   * @param id - Unique identifier for the filter. Referenced as `url(#id)`.
   * @param attrs - Additional attributes for the `<filter>` element
   *   (e.g. `x`, `y`, `width`, `height` to control the filter bounds).
   *
   * @example
   * new FilterBuilder('shadow')
   * new FilterBuilder('myBlur', { x: '-20%', y: '-20%', width: '140%', height: '140%' })
   */
  constructor(id: string, attrs: Record<string, unknown> = {}) {
    this.def = {
      type: 'filter',
      attrs: { id, ...attrs },
    };
  }

  /** Add a child primitive with the given type and attrs. */
  add(type: string, attrs: Record<string, unknown>): this {
    if (!this.def.children) this.def.children = [];
    this.def.children.push({ type, attrs });
    return this;
  }

  /**
   * Add a blur effect (`<feGaussianBlur>`).
   *
   * @param stdDev - Standard deviation of the Gaussian blur (required)
   * @param in1 - Input name (`'SourceGraphic'`, `'SourceAlpha'`, or a previous result). Default: `'SourceGraphic'`.
   * @param result - Optional name to reference this primitive's output
   *
   * @example
   * new FilterBuilder('b').blur(4).build()
   */
  blur(stdDev: number, in1: string = 'SourceGraphic', result?: string): this {
    return this.add('feGaussianBlur', { stdDeviation: stdDev, in: in1, ...(result && { result }) });
  }

  /**
   * Add a drop shadow effect (`<feDropShadow>`).
   *
   * @param dx - Horizontal offset (required)
   * @param dy - Vertical offset (required)
   * @param stdDev - Blur standard deviation (required)
   * @param color - Shadow color (optional). Default: `'black'`.
   * @param result - Optional name to reference this primitive's output
   *
   * @example
   * new FilterBuilder('s').dropShadow(2, 2, 4, '#00000080').build()
   */
  dropShadow(dx: number, dy: number, stdDev: number, color: string = 'black', result?: string): this {
    return this.add('feDropShadow', {
      dx, dy, stdDeviation: stdDev,
      'flood-color': color,
      ...(result && { result }),
    });
  }

  /**
   * Add an offset effect (`<feOffset>`).
   *
   * @param dx - Horizontal offset (required)
   * @param dy - Vertical offset (required)
   * @param in1 - Input name. Default: `'SourceAlpha'`.
   * @param result - Optional name to reference this primitive's output
   */
  offset(dx: number, dy: number, in1: string = 'SourceAlpha', result?: string): this {
    return this.add('feOffset', { dx, dy, in: in1, ...(result && { result }) });
  }

  /**
   * Add a color matrix effect (`<feColorMatrix>`).
   *
   * @param type - Matrix type: `'matrix'`, `'saturate'`, `'hueRotate'`, or `'luminanceToAlpha'`
   * @param values - Matrix values (string of numbers for `'matrix'`, or a single number for `'saturate'`/`'hueRotate'`)
   * @param in1 - Input name. Default: `'SourceGraphic'`.
   * @param result - Optional name to reference this primitive's output
   *
   * @example
   * new FilterBuilder('g').colorMatrix('saturate', '0').build()  // grayscale
   */
  colorMatrix(type: string, values: string, in1: string = 'SourceGraphic', result?: string): this {
    return this.add('feColorMatrix', { type, values, in: in1, ...(result && { result }) });
  }

  /**
   * Convert to grayscale.
   *
   * Shorthand for `.colorMatrix('saturate', amount)`.
   *
   * @param amount - 0 = full grayscale, 1 = full color. Default: `0`.
   * @param result - Optional output name
   */
  grayscale(amount: number = 0, result?: string): this {
    return this.colorMatrix('saturate', String(Math.max(0, Math.min(1, 1 - amount))), 'SourceGraphic', result);
  }

  /**
   * Apply a sepia tone effect.
   *
   * Uses a `feColorMatrix type="matrix"` with the standard sepia values,
   * interpolated by `amount` (0 = no effect, 1 = full sepia).
   *
   * @param amount - 0–1. Default: `1`.
   * @param result - Optional output name
   */
  sepia(amount: number = 1, result?: string): this {
    const a = Math.max(0, Math.min(1, amount));
    const values = [
      `${1 - a * 0.607} ${a * 0.769} ${a * 0.189} 0 0`,
      `${a * 0.349} ${1 - a * 0.314} ${a * 0.168} 0 0`,
      `${a * 0.272} ${a * 0.534} ${1 - a * 0.869} 0 0`,
      '0 0 0 1 0',
    ].join(' ');
    return this.colorMatrix('matrix', values, 'SourceGraphic', result);
  }

  /**
   * Rotate the hue.
   *
   * @param angle - Degrees of rotation (0–360). Default: `180`.
   * @param result - Optional output name
   */
  hueRotate(angle: number = 180, result?: string): this {
    return this.colorMatrix('hueRotate', String(angle), 'SourceGraphic', result);
  }

  /**
   * Adjust saturation.
   *
   * @param amount - 0 = grayscale, 1 = original. Default: `0`.
   * @param result - Optional output name
   */
  saturate(amount: number = 0, result?: string): this {
    return this.colorMatrix('saturate', String(Math.max(0, amount)), 'SourceGraphic', result);
  }

  /**
   * Add a component transfer effect (`<feComponentTransfer>`) for brightness adjustment.
   *
   * Uses a simple multiply on each RGB channel.
   *
   * @param amount - Multiplier: >1 brightens, <1 darkens. Default: `1.5`.
   * @param result - Optional output name
   */
  brightness(amount: number = 1.5, result?: string): this {
    const v = Math.max(0, amount);
    const child: SvgDef = {
      type: 'feComponentTransfer',
      attrs: { ...(result && { result }) },
      children: [
        { type: 'feFuncR', attrs: { type: 'linear', slope: v } },
        { type: 'feFuncG', attrs: { type: 'linear', slope: v } },
        { type: 'feFuncB', attrs: { type: 'linear', slope: v } },
      ],
    };
    if (!this.def.children) this.def.children = [];
    this.def.children.push(child);
    return this;
  }

  /**
   * Add a component transfer effect for contrast adjustment.
   *
   * Maps each channel through `(channel - 0.5) * contrast + 0.5`.
   *
   * @param amount - Contrast multiplier: >1 increases, <1 decreases. Default: `2`.
   * @param result - Optional output name
   */
  contrast(amount: number = 2, result?: string): this {
    const a = Math.max(0, amount);
    const v = String(a);
    const b = String(0.5 * (1 - a));
    const child: SvgDef = {
      type: 'feComponentTransfer',
      attrs: { ...(result && { result }) },
      children: [
        { type: 'feFuncR', attrs: { type: 'linear', slope: v, intercept: b } },
        { type: 'feFuncG', attrs: { type: 'linear', slope: v, intercept: b } },
        { type: 'feFuncB', attrs: { type: 'linear', slope: v, intercept: b } },
      ],
    };
    if (!this.def.children) this.def.children = [];
    this.def.children.push(child);
    return this;
  }

  /**
   * Invert colors.
   *
   * Uses `feComponentTransfer` with `table` mapping.
   *
   * @param amount - 0 = no inversion, 1 = full inversion. Default: `1`.
   * @param result - Optional output name
   */
  invert(amount: number = 1, result?: string): this {
    const a = Math.max(0, Math.min(1, amount));
    const child: SvgDef = {
      type: 'feComponentTransfer',
      attrs: { ...(result && { result }) },
      children: [
        { type: 'feFuncR', attrs: { type: 'table', tableValues: `${a} ${1 - a}` } },
        { type: 'feFuncG', attrs: { type: 'table', tableValues: `${a} ${1 - a}` } },
        { type: 'feFuncB', attrs: { type: 'table', tableValues: `${a} ${1 - a}` } },
      ],
    };
    if (!this.def.children) this.def.children = [];
    this.def.children.push(child);
    return this;
  }

  /**
   * Adjust opacity.
   *
   * Uses `feComponentTransfer` on the alpha channel.
   *
   * @param amount - Opacity multiplier, 0–1. Default: `0.5`.
   * @param result - Optional output name
   */
  opacity(amount: number = 0.5, result?: string): this {
    const v = Math.max(0, Math.min(1, amount));
    const child: SvgDef = {
      type: 'feComponentTransfer',
      attrs: { ...(result && { result }) },
      children: [
        { type: 'feFuncA', attrs: { type: 'linear', slope: v } },
      ],
    };
    if (!this.def.children) this.def.children = [];
    this.def.children.push(child);
    return this;
  }

  /**
   * Add a blend effect (`<feBlend>`).
   *
   * @param in1 - First input name
   * @param in2 - Second input name
   * @param mode - Blend mode: `'normal'`, `'multiply'`, `'screen'`, `'darken'`, `'lighten'`. Default: `'normal'`.
   * @param result - Optional output name
   */
  blend(in1: string, in2: string, mode: string = 'normal', result?: string): this {
    return this.add('feBlend', { in: in1, in2, mode, ...(result && { result }) });
  }

  /**
   * Add a composite effect (`<feComposite>`).
   *
   * @param operator - `'over'`, `'in'`, `'out'`, `'atop'`, `'xor'`, `'arithmetic'`
   * @param in1 - First input name
   * @param in2 - Second input name. Default: `'SourceGraphic'`.
   * @param result - Optional output name
   */
  composite(operator: string, in1: string, in2: string = 'SourceGraphic', result?: string): this {
    return this.add('feComposite', { operator, in: in1, in2, ...(result && { result }) });
  }

  /**
   * Add a merge effect (`<feMerge>`) that composites multiple inputs together.
   *
   * @param inputs - Input names to merge (each creates a `<feMergeNode>` child)
   * @param result - Optional output name
   *
   * @example
   * new FilterBuilder('m').merge('blur', 'shadow').build()
   */
  merge(...inputs: string[]): this {
    if (inputs.length === 0) return this;
    const children: SvgDef[] = inputs.map(inp => ({ type: 'feMergeNode', attrs: { in: inp } }));
    const child: SvgDef = { type: 'feMerge', attrs: {}, children };
    if (!this.def.children) this.def.children = [];
    this.def.children.push(child);
    return this;
  }

  /**
   * Add a turbulence / noise effect (`<feTurbulence>`).
   *
   * @param baseFrequency - Base frequency (default `'0.05'`)
   * @param numOctaves - Number of octaves (default `2`)
   * @param type - `'fractalNoise'` or `'turbulence'`. Default: `'fractalNoise'`.
   * @param result - Optional output name
   */
  turbulence(baseFrequency: string | number = '0.05', numOctaves: number = 2, type: string = 'fractalNoise', result?: string): this {
    return this.add('feTurbulence', { baseFrequency, numOctaves, type, ...(result && { result }) });
  }

  /**
   * Add a displacement map effect (`<feDisplacementMap>`).
   *
   * @param scale - Displacement scale (default `10`)
   * @param in1 - Input image. Default: `'SourceGraphic'`.
   * @param in2 - Displacement map input. Default: the result of a `turbulence` call.
   * @param xChannel - X channel: `'R'`, `'G'`, `'B'`, `'A'`. Default: `'R'`.
   * @param yChannel - Y channel. Default: `'G'`.
   * @param result - Optional output name
   */
  displacementMap(scale: number = 10, in1: string = 'SourceGraphic', in2: string = 'turbulence', xChannel: string = 'R', yChannel: string = 'G', result?: string): this {
    return this.add('feDisplacementMap', {
      scale, in: in1, in2,
      xChannelSelector: xChannel,
      yChannelSelector: yChannel,
      ...(result && { result }),
    });
  }

  /**
   * Add a flood fill effect (`<feFlood>`).
   *
   * @param color - Flood color (required)
   * @param opacity - Opacity, 0–1. Default: `1`.
   * @param result - Optional output name
   */
  flood(color: string, opacity: number = 1, result?: string): this {
    return this.add('feFlood', { 'flood-color': color, 'flood-opacity': opacity, ...(result && { result }) });
  }

  /**
   * Add a morphology effect (`<feMorphology>`) — dilates (thickens) or erodes
   * (thins) the input graphic.
   *
   * @param operator - `'dilate'` or `'erode'`
   * @param radius - Radius of the operation (number, or two numbers for x/y)
   * @param in1 - Input name. Default: `'SourceGraphic'`.
   * @param result - Optional output name
   */
  morphology(operator: string, radius: string | number, in1: string = 'SourceGraphic', result?: string): this {
    return this.add('feMorphology', { operator, radius, in: in1, ...(result && { result }) });
  }

  /**
   * Add a tile effect (`<feTile>`) — repeats the input image to fill the
   * filter bounds.
   *
   * @param in1 - Input name. Default: `'SourceGraphic'`.
   * @param result - Optional output name
   */
  tile(in1: string = 'SourceGraphic', result?: string): this {
    return this.add('feTile', { in: in1, ...(result && { result }) });
  }

  /**
   * Add an image input (`<feImage>`) — fetches an external image or SVG
   * data URI for use as a filter input.
   *
   * @param href - Image URL or data URI
   * @param result - Optional output name
   */
  feImage(href: string, result?: string): this {
    return this.add('feImage', { href, ...(result && { result }) });
  }

  /**
   * Build and return the `<filter>` SvgDef.
   *
   * @returns A filter SvgDef suitable for use inside `<defs>`.
   *
   * @example
   * const filterDef = new FilterBuilder('b').blur(4).build();
   * // → { type: 'filter', attrs: { id: 'b' }, children: [{ type: 'feGaussianBlur', attrs: { stdDeviation: 4, in: 'SourceGraphic' } }] }
   */
  build(): SvgDef {
    return this.def;
  }
}

// ============================================================
// Shorthand filter creation helpers
// ============================================================

/**
 * Create a drop shadow filter.
 *
 * @param id - Filter identifier (referenced as `url(#id)`)
 * @param dx - Horizontal offset
 * @param dy - Vertical offset
 * @param stdDev - Blur standard deviation
 * @param color - Shadow color (default `'black'`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([dropShadow('s', 2, 2, 4, 'rgba(0,0,0,0.5)')])
 */
export function dropShadow(id: string, dx: number, dy: number, stdDev: number, color: string = 'black'): SvgDef {
  return new FilterBuilder(id).dropShadow(dx, dy, stdDev, color).build();
}

/**
 * Create a Gaussian blur filter.
 *
 * @param id - Filter identifier (referenced as `url(#id)`)
 * @param stdDev - Blur standard deviation
 * @returns A filter SvgDef
 *
 * @example
 * defs([blur('b', 4)])
 */
export function blur(id: string, stdDev: number): SvgDef {
  return new FilterBuilder(id).blur(stdDev).build();
}

/**
 * Create a glow effect (colored drop shadow with no offset).
 *
 * @param id - Filter identifier
 * @param color - Glow color (default `'#00ffff'`)
 * @param stdDev - Blur standard deviation (default `4`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([glow('g', '#ff00ff', 6)])
 */
export function glow(id: string, color: string = '#00ffff', stdDev: number = 4): SvgDef {
  return new FilterBuilder(id).dropShadow(0, 0, stdDev, color).build();
}

/**
 * Create a grayscale filter.
 *
 * @param id - Filter identifier
 * @param amount - 0 = full grayscale, 1 = original color (default `0`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([grayscale('g')])
 */
export function grayscale(id: string, amount: number = 0): SvgDef {
  return new FilterBuilder(id).colorMatrix('saturate', String(Math.max(0, Math.min(1, 1 - amount)))).build();
}

/**
 * Create a sepia tone filter.
 *
 * @param id - Filter identifier
 * @param amount - 0–1 (default `1`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([sepia('s', 0.5)])
 */
export function sepia(id: string, amount: number = 1): SvgDef {
  return new FilterBuilder(id).sepia(amount).build();
}

/**
 * Create a brightness adjustment filter.
 *
 * @param id - Filter identifier
 * @param amount - Multiplier (>1 brightens, <1 darkens, default `1.5`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([brightness('b', 2)])
 */
export function brightness(id: string, amount: number = 1.5): SvgDef {
  return new FilterBuilder(id).brightness(amount).build();
}

/**
 * Create a contrast adjustment filter.
 *
 * @param id - Filter identifier
 * @param amount - Contrast multiplier (>1 increases, <1 decreases, default `2`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([contrast('c', 1.5)])
 */
export function contrast(id: string, amount: number = 2): SvgDef {
  return new FilterBuilder(id).contrast(amount).build();
}

/**
 * Create a hue rotation filter.
 *
 * @param id - Filter identifier
 * @param angle - Degrees of rotation (0–360, default `180`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([hueRotate('h', 90)])
 */
export function hueRotate(id: string, angle: number = 180): SvgDef {
  return new FilterBuilder(id).hueRotate(angle).build();
}

/**
 * Create a neon glow filter — intense colored glow with multiple layers.
 *
 * Uses two drop-shadow layers at different blur amounts for a realistic neon
 * tube effect.
 *
 * @param id - Filter identifier
 * @param color - Glow color (default `'#00ffff'`)
 * @param stdDev - Maximum blur radius (default `6`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([neon('n', '#ff00ff', 8)])
 */
export function neon(id: string, color: string = '#00ffff', stdDev: number = 6): SvgDef {
  return new FilterBuilder(id)
    .dropShadow(0, 0, stdDev * 1.5, color, 'outer')
    .dropShadow(0, 0, stdDev * 0.5, color, 'inner')
    .merge('outer', 'inner')
    .build();
}

/**
 * Create an outline / edge-detect filter.
 *
 * Uses `feMorphology` (erode) and `feComposite` (out) to create a thin outline
 * around the input graphic.
 *
 * @param id - Filter identifier
 * @param color - Outline color (default `'black'`)
 * @param thickness - Outline thickness in pixels (default `1`)
 * @returns A filter SvgDef
 *
 * @example
 * defs([outline('o', 'red', 2)])
 */
export function outline(id: string, color: string = 'black', thickness: number = 1): SvgDef {
  const fb = new FilterBuilder(id);
  fb.add('feMorphology', { operator: 'dilate', radius: thickness, in: 'SourceAlpha', result: 'dilated' });
  fb.add('feFlood', { 'flood-color': color, result: 'flood' });
  fb.add('feComposite', { operator: 'in', in: 'flood', in2: 'dilated', result: 'outline' });
  fb.add('feComposite', { operator: 'over', in: 'outline', in2: 'SourceGraphic' });
  return fb.build();
}
