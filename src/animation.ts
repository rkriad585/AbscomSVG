import type { SvgDef } from './types';

// ============================================================
// Easing
// ============================================================

/**
 * Get SVG easing configuration for a named easing function.
 *
 * Returns attributes (`calcMode`, `keySplines`, `keyTimes`) that can be
 * spread onto an `<animate>` or `<animateTransform>` element.
 *
 * @param name - Easing name: `'linear'`, `'ease'`, `'ease-in'`,
 *   `'ease-out'`, `'ease-in-out'`, `'bounce'`.
 * @returns An object with `calcMode` (and optionally `keySplines`, `keyTimes`)
 *
 * @example
 * ```ts
 * const anim = {
 *   type: 'animate',
 *   attrs: {
 *     attributeName: 'opacity',
 *     from: '0', to: '1', dur: '1s',
 *     ...easing('ease-in-out'),
 *   },
 * };
 * ```
 */
export function easing(name: string): Record<string, string> {
  const map: Record<string, Record<string, string>> = {
    linear: { calcMode: 'linear' },
    ease: { calcMode: 'spline', keySplines: '0.25 0.1 0.25 1', keyTimes: '0;1' },
    'ease-in': { calcMode: 'spline', keySplines: '0.42 0 1 1', keyTimes: '0;1' },
    'ease-out': { calcMode: 'spline', keySplines: '0 0 0.58 1', keyTimes: '0;1' },
    'ease-in-out': { calcMode: 'spline', keySplines: '0.42 0 0.58 1', keyTimes: '0;1' },
    bounce: { calcMode: 'spline', keySplines: '0.5 1.5 0.5 -0.5', keyTimes: '0;1' },
  };
  return map[name] || { calcMode: 'linear' };
}

// ============================================================
// Convenience animation wrappers
// ============================================================

/**
 * Wrap a def in a `<g>` that fades in (opacity 0 → 1).
 *
 * The element starts transparent and becomes fully opaque over `dur`.
 * After the animation, it stays at opacity 1.
 *
 * @param def - The element to fade in
 * @param dur - Duration string (default `'1s'`)
 * @returns A `<g>` SvgDef containing the original def and the animation
 *
 * @example
 * ```ts
 * render(svg, fadeIn(circle(50, 50, 40, 'red'), '2s'));
 * ```
 */
export function fadeIn(def: SvgDef, dur: string = '1s'): SvgDef {
  return {
    type: 'g',
    attrs: {},
    children: [
      def,
      { type: 'animate', attrs: { attributeName: 'opacity', from: '0', to: '1', dur, fill: 'freeze' } },
    ],
  };
}

/**
 * Wrap a def in a `<g>` that fades out (opacity 1 → 0).
 *
 * The element starts fully opaque and fades to transparent over `dur`.
 * After the animation, it stays invisible (`fill="freeze"`).
 *
 * @param def - The element to fade out
 * @param dur - Duration string (default `'1s'`)
 * @returns A `<g>` SvgDef containing the original def and the animation
 *
 * @example
 * ```ts
 * render(svg, fadeOut(circle(50, 50, 40, 'red'), '2s'));
 * ```
 */
export function fadeOut(def: SvgDef, dur: string = '1s'): SvgDef {
  return {
    type: 'g',
    attrs: {},
    children: [
      def,
      { type: 'animate', attrs: { attributeName: 'opacity', from: '1', to: '0', dur, fill: 'freeze' } },
    ],
  };
}

/**
 * Add a pulsing animation to a def (oscillates an attribute between two values).
 *
 * The attribute oscillates continuously (`repeatCount="indefinite"`).
 *
 * @param def - The element to animate (mutated in-place by adding a child)
 * @param attr - Attribute name to animate (e.g. `'opacity'`, `'r'`, `'width'`)
 * @param from - Start value (as a string or number)
 * @param to - End value (as a string or number)
 * @param dur - Duration of one full cycle (default `'1s'`)
 * @returns The same `def` with an animate child appended
 *
 * @example
 * ```ts
 * pulse(circle(50, 50, 30, 'red'), 'r', '30', '40', '1s');
 * pulse(rect(0, 0, 100, 100, 'blue'), 'opacity', '1', '0.3', '0.5s');
 * ```
 */
export function pulse(def: SvgDef, attr: string, from: string | number, to: string | number, dur: string = '1s'): SvgDef {
  const anim: SvgDef = {
    type: 'animate',
    attrs: {
      attributeName: attr,
      values: `${from};${to};${from}`,
      keyTimes: '0;0.5;1',
      dur,
      repeatCount: 'indefinite',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}

/**
 * Add a continuous spinning animation (rotate 0° → 360°).
 *
 * Centers on the element's `cx`/`cy` if present, otherwise defaults to `(50, 50)`.
 *
 * @param def - The element to animate (mutated in-place)
 * @param dur - Duration of one full rotation (default `'2s'`)
 * @returns The same `def` with an animateTransform child appended
 *
 * @example
 * ```ts
 * spin(circle(50, 50, 30, 'gold'), '3s');
 * ```
 */
export function spin(def: SvgDef, dur: string = '2s'): SvgDef {
  const cx = def.attrs.cx ?? 50;
  const cy = def.attrs.cy ?? 50;
  const anim: SvgDef = {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type: 'rotate',
      from: `0 ${cx} ${cy}`,
      to: `360 ${cx} ${cy}`,
      dur,
      repeatCount: 'indefinite',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}

/**
 * Add a vertical bouncing animation (translate Y oscillation).
 *
 * @param def - The element to animate (mutated in-place)
 * @param dur - Duration of one full bounce cycle (default `'1s'`)
 * @returns The same `def` with an animateTransform child appended
 *
 * @example
 * ```ts
 * bounce(circle(50, 50, 20, 'orange'), '0.8s');
 * ```
 */
export function bounce(def: SvgDef, dur: string = '1s'): SvgDef {
  const anim: SvgDef = {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type: 'translate',
      values: '0 0; 0 -20; 0 0',
      keyTimes: '0;0.5;1',
      dur,
      repeatCount: 'indefinite',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}

/**
 * Add a horizontal shaking animation (translate X oscillation).
 *
 * @param def - The element to animate (mutated in-place)
 * @param dur - Duration of one full shake cycle (default `'0.3s'`)
 * @returns The same `def` with an animateTransform child appended
 *
 * @example
 * ```ts
 * shake(rect(0, 0, 100, 50, 'red'), '0.2s');
 * ```
 */
export function shake(def: SvgDef, dur: string = '0.3s'): SvgDef {
  const anim: SvgDef = {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type: 'translate',
      values: '0 0; -5 0; 5 0; -3 0; 3 0; 0 0',
      keyTimes: '0;0.2;0.4;0.6;0.8;1',
      dur,
      repeatCount: 'indefinite',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}

/**
 * Add a slide-in animation (translate from off-screen to current position).
 *
 * @param def - The element to animate (mutated in-place)
 * @param dir - Direction to slide from: `'left'`, `'right'`, `'top'`, `'bottom'` (default `'left'`)
 * @param dur - Duration (default `'0.6s'`)
 * @returns The same `def` with an animateTransform child appended
 *
 * @example
 * ```ts
 * slideIn(rect(50, 50, 100, 80, 'blue'), 'left', '0.5s');
 * slideIn(circle(50, 50, 30, 'red'), 'top');
 * ```
 */
export function slideIn(def: SvgDef, dir: string = 'left', dur: string = '0.6s'): SvgDef {
  const offsets: Record<string, string> = {
    left: '-200,0',
    right: '200,0',
    top: '0,-200',
    bottom: '0,200',
  };
  const from = offsets[dir] || '-200,0';
  const anim: SvgDef = {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type: 'translate',
      from,
      to: '0,0',
      dur,
      fill: 'freeze',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}

/**
 * Add a growing animation (scale 0 → 1).
 *
 * Scales from the SVG origin `(0, 0)`. To scale from the element's center,
 * wrap the element in a `<g>` with a `translate` transform first.
 *
 * @param def - The element to animate (mutated in-place)
 * @param dur - Duration (default `'0.5s'`)
 * @returns The same `def` with an animateTransform child appended
 *
 * @example
 * ```ts
 * grow(circle(0, 0, 30, 'green'), '0.6s');
 * ```
 */
export function grow(def: SvgDef, dur: string = '0.5s'): SvgDef {
  const anim: SvgDef = {
    type: 'animateTransform',
    attrs: {
      attributeName: 'transform',
      type: 'scale',
      from: '0',
      to: '1',
      dur,
      fill: 'freeze',
    },
  };
  if (!def.children) def.children = [];
  def.children.push(anim);
  return def;
}
