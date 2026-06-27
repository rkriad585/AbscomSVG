import type { SvgDef, EventHandler } from './types';

const eventHandlerMap = new WeakMap<SVGElement, Record<string, EventListener[]>>();

/**
 * Options that control how `render()` creates and updates SVG elements.
 *
 * Use these to tap into the render lifecycle (before/after creation, before/after update)
 * or to disable validation warnings during development.
 *
 * @example
 * ```ts
 * render('#mySvg', circleDef, {
 *   validate: false,
 *   beforeCreate: (def) => { def.attrs.fill = 'red'; },
 *   afterCreate: (el, def) => console.log('Created', el),
 * })
 * ```
 */
export interface RenderOptions {
  /**
   * When `true` (default), missing required attributes (e.g. `r` on a circle)
   * log a warning to `console.error` and the element is skipped.
   *
   * Set to `false` to suppress validation — useful in production or
   * when you're building up definitions incrementally.
   */
  validate?: boolean;

  /**
   * Hook called **before** a new element is created from a definition.
   *
   * - Return a modified `SvgDef` to override what gets created.
   * - Return `null` to skip creating this element entirely.
   * - Return `void` / `undefined` to keep the original definition unchanged.
   *
   * Use this to dynamically transform elements before they hit the DOM —
   * e.g. applying a theme, injecting attributes, or conditionally skipping nodes.
   */
  beforeCreate?: (def: SvgDef) => SvgDef | void | null;

  /**
   * Hook called **after** a new element has been created and appended to the DOM.
   *
   * Receives the real `SVGElement` and the `SvgDef` it was built from.
   * Useful for side effects like animations, measurements, or logging.
   */
  afterCreate?: (el: SVGElement, def: SvgDef) => void;

  /**
   * Hook called **before** an existing element is updated on a re-render.
   *
   * - Return a modified `SvgDef` to change what attributes/children get applied.
   * - Return `false` to skip the update entirely (element stays as-is).
   * - Return `void` / `undefined` to apply the original definition.
   *
   * Use this to intercept DOM updates — e.g. preventing animation loops,
   * comparing old vs new state, or merging in extra attributes.
   */
  beforeUpdate?: (el: SVGElement, def: SvgDef) => SvgDef | void | false;

  /**
   * Hook called **after** an existing element has been updated on a re-render.
   *
   * Receives the real `SVGElement` and the `SvgDef` it was updated from.
   * Useful for post-update side effects like measurements or logging.
   */
  afterUpdate?: (el: SVGElement, def: SvgDef) => void;
}

/** @internal Internal helper — validates required attributes exist on known element types. */
function validateDef(def: SvgDef): boolean {
  if (!def || !def.type) {
    console.error('Definition missing type');
    return false;
  }

  const { type, attrs } = def;

  if (type === 'circle') {
    for (const attr of ['cx', 'cy', 'r']) {
      if (!(attr in attrs)) {
        console.error(`Circle missing attribute: ${attr}`);
        return false;
      }
    }
  } else if (type === 'rect') {
    for (const attr of ['x', 'y', 'width', 'height']) {
      if (!(attr in attrs)) {
        console.error(`Rect missing attribute: ${attr}`);
        return false;
      }
    }
  } else if (type === 'ellipse') {
    for (const attr of ['cx', 'cy', 'rx', 'ry']) {
      if (!(attr in attrs)) {
        console.error(`Ellipse missing attribute: ${attr}`);
        return false;
      }
    }
  } else if (type === 'line') {
    for (const attr of ['x1', 'y1', 'x2', 'y2']) {
      if (!(attr in attrs)) {
        console.error(`Line missing attribute: ${attr}`);
        return false;
      }
    }
  } else if (type === 'polygon' && !('points' in attrs)) {
    console.error('Polygon missing points attribute');
    return false;
  } else if (type === 'path' && !('d' in attrs)) {
    console.error('Path missing d attribute');
    return false;
  } else if (type === 'image' && !('xlink:href' in attrs)) {
    console.error('Image missing xlink:href attribute');
    return false;
  } else if (type === 'text' && def.text == null) {
    console.error('Text element missing text content');
    return false;
  }

  return true;
}

/** @internal Internal helper — normalizes event handler values into a consistent array of { fn, opts } objects. */
function normalizeHandlers(
  raw: EventHandler | EventHandler[],
): { fn: EventListener; opts?: AddEventListenerOptions }[] {
  const arr = Array.isArray(raw) ? raw : [raw];
  return arr.map(handler => {
    if (typeof handler === 'function') {
      return { fn: handler as EventListener };
    }
    return { fn: handler.callback as EventListener, opts: handler.options };
  });
}

/** @internal Internal helper — creates a new SVG DOM element from a definition object. */
function createElement(def: SvgDef, options?: RenderOptions): SVGElement | null {
  if (options?.beforeCreate) {
    const result = options.beforeCreate(def);
    if (result === null) return null;
    if (result) def = result;
  }

  if (options?.validate !== false && !validateDef(def)) return null;

  const el = document.createElementNS('http://www.w3.org/2000/svg', def.type);
  if (def.id) el.setAttribute('id', def.id);
  for (const attr in def.attrs) {
    el.setAttribute(attr, String(def.attrs[attr]));
  }
  if (def.text) el.textContent = def.text;

  if (def.events) {
    const handlers: Record<string, EventListener[]> = {};
    for (const event in def.events) {
      handlers[event] = [];
      for (const { fn, opts } of normalizeHandlers(def.events[event])) {
        el.addEventListener(event, fn, opts);
        handlers[event].push(fn);
      }
    }
    eventHandlerMap.set(el, handlers);
  }

  if (def.children) {
    for (const childDef of def.children) {
      const childEl = createElement(childDef, options);
      if (childEl) el.appendChild(childEl);
    }
  }

  if (options?.afterCreate) {
    options.afterCreate(el, def);
  }

  return el;
}

/** @internal Internal helper — updates an existing SVG DOM element to match a definition object (DOM diffing). */
function updateElement(el: SVGElement, def: SvgDef, options?: RenderOptions): void {
  if (options?.beforeUpdate) {
    const result = options.beforeUpdate(el, def);
    if (result === false) return;
    if (result) def = result;
  }

  if (def.id && el.getAttribute('id') !== def.id) {
    el.setAttribute('id', def.id);
  }

  const currentAttrs = Array.from(el.attributes).map(a => a.name);
  for (const name of currentAttrs) {
    if (name !== 'id' && !(name in def.attrs)) {
      el.removeAttribute(name);
    }
  }
  for (const attr in def.attrs) {
    el.setAttribute(attr, String(def.attrs[attr]));
  }
  el.textContent = def.text || '';

  if (eventHandlerMap.has(el)) {
    const oldHandlers = eventHandlerMap.get(el)!;
    for (const eventType in oldHandlers) {
      for (const fn of oldHandlers[eventType]) {
        el.removeEventListener(eventType, fn);
      }
    }
    eventHandlerMap.delete(el);
  }

  if (def.events) {
    const handlers: Record<string, EventListener[]> = {};
    for (const event in def.events) {
      handlers[event] = [];
      for (const { fn, opts } of normalizeHandlers(def.events[event])) {
        el.addEventListener(event, fn, opts);
        handlers[event].push(fn);
      }
    }
    eventHandlerMap.set(el, handlers);
  }

  const childDefs = def.children || [];
  const existing: Record<string, SVGElement> = {};
  for (const child of Array.from(el.children) as SVGElement[]) {
    const id = child.getAttribute('id');
    if (id) existing[id] = child;
  }
  for (const childDef of childDefs) {
    if (childDef.id && existing[childDef.id]) {
      updateElement(existing[childDef.id], childDef, options);
      delete existing[childDef.id];
    } else {
      const childEl = createElement(childDef, options);
      if (childEl) el.appendChild(childEl);
    }
  }
  for (const id in existing) {
    el.removeChild(existing[id]);
  }

  if (options?.afterUpdate) {
    options.afterUpdate(el, def);
  }
}

/**
 * Renders SVG definition objects into a live SVG DOM element.
 *
 * This is the main entry point for putting your definitions on the screen.
 * It uses **DOM diffing** — elements with an `id` attribute are updated
 * in-place on re-render instead of being re-created.
 *
 * ---
 *
 * @param svgArg - The target SVG container.
 *  - **string**: an `id` of an existing `<svg>` element in the DOM
 *    (`document.getElementById` is used internally).
 *  - **SVGElement**: a direct reference to an `<svg>` element.
 *
 * @param def - One or more definition objects to render.
 *  - Pass a single `SvgDef` to render one element.
 *  - Pass an array `SvgDef[]` to render multiple siblings.
 *
 * @param options - Optional {@link RenderOptions} to control behavior.
 *
 * ---
 *
 * @throws {Error} If called in a non-browser environment (no `document`).
 *   For server-side SVG generation, build definitions using the creation helpers
 *   (e.g. `circle()`) and serialize manually — `render()` requires a real DOM.
 *
 * ---
 *
 * @example **Basic render with a single def**
 * ```ts
 * import { render, circle } from 'abscomsvg';
 *
 * const svg = document.querySelector('svg')!;
 * render(svg, circle(50, 50, 40, 'blue'));
 * ```
 *
 * @example **Render with an array of defs**
 * ```ts
 * render(svg, [
 *   rect(10, 10, 100, 80, 'red'),
 *   circle(60, 50, 30, 'white'),
 * ]);
 * ```
 *
 * @example **Using an id string instead of an SVGElement reference**
 * ```ts
 * // Targets <svg id="mySvg">...</svg>
 * render('#mySvg', circle(50, 50, 40));
 * ```
 *
 * @example **Re-render with DOM diffing (elements with same `id` are updated in-place)**
 * ```ts
 * const def = { ...circle(50, 50, 40, 'red'), id: 'myCircle' };
 * render(svg, def); // First call — creates the circle
 *
 * def.attrs.fill = 'green';
 * def.attrs.r     = 60;
 * render(svg, def); // Second call — updates the existing circle in-place
 * ```
 *
 * @example **Using render options (hooks + validation)**
 * ```ts
 * render(svg, def, {
 *   validate: false,             // skip attribute validation warnings
 *   beforeCreate: (d) => {       // modify def just before creation
 *     d.attrs.fill = d.attrs.fill ?? '#333';
 *   },
 *   afterCreate: (el, d) => {    // do something with the live element
 *     el.classList.add('just-added');
 *   },
 *   beforeUpdate: (el, d) => {   // intercept re-render updates
 *     console.log('Updating', el.id);
 *   },
 *   afterUpdate: (el, d) => {    // react after update
 *     console.log('Updated', el.id);
 *   },
 * });
 * ```
 *
 * ---
 *
 * **How DOM diffing works:**
 *
 * | Scenario | Behavior |
 * |---|---|
 * | **First render** (no existing children) | All defs are created and appended. |
 * | **Re-render with matching `id`** | The existing element is **updated** in-place — stale attributes are removed, new ones applied, old event listeners cleaned up. |
 * | **Re-render without `id`** | The element is **appended** as a new node (no diffing for id-less elements). |
 * | **Stale `id`** (present in DOM but absent in latest call) | The old element is **removed** from the DOM. |
 */
export function render(svgArg: string | SVGElement, def: SvgDef | SvgDef[], options?: RenderOptions): void {
  if (typeof document === 'undefined') {
    throw new Error(
      'AbscomSVG.render() requires a browser environment with document. ' +
        'Use a DOM polyfill (e.g. jsdom) when rendering server-side.',
    );
  }

  let svg: SVGElement | null;
  if (typeof svgArg === 'string') {
    svg = document.getElementById(svgArg) as SVGElement | null;
  } else if (svgArg instanceof SVGElement) {
    svg = svgArg;
  } else {
    console.error('Invalid SVG argument:', svgArg);
    return;
  }

  if (!svg) {
    console.error('SVG element not found');
    return;
  }

  const defs = Array.isArray(def) ? def : [def];
  const existingEls: Record<string, SVGElement> = {};

  for (const child of Array.from(svg.children) as SVGElement[]) {
    const id = child.getAttribute('id');
    if (id) existingEls[id] = child;
  }

  for (const d of defs) {
    if (d.id && existingEls[d.id]) {
      updateElement(existingEls[d.id], d, options);
      delete existingEls[d.id];
    } else {
      const el = createElement(d, options);
      if (el) svg.appendChild(el);
    }
  }

  for (const id in existingEls) {
    svg.removeChild(existingEls[id]);
  }
}
