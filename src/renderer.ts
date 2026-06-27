import type { SvgDef, EventHandler } from './types';

const eventHandlerMap = new WeakMap<SVGElement, Record<string, EventListener[]>>();

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

function createElement(def: SvgDef): SVGElement | null {
  if (!validateDef(def)) return null;

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
      const childEl = createElement(childDef);
      if (childEl) el.appendChild(childEl);
    }
  }

  return el;
}

function updateElement(el: SVGElement, def: SvgDef): void {
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
      updateElement(existing[childDef.id], childDef);
      delete existing[childDef.id];
    } else {
      const childEl = createElement(childDef);
      if (childEl) el.appendChild(childEl);
    }
  }
  for (const id in existing) {
    el.removeChild(existing[id]);
  }
}

export function render(svgArg: string | SVGElement, def: SvgDef | SvgDef[]): void {
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
      updateElement(existingEls[d.id], d);
      delete existingEls[d.id];
    } else {
      const el = createElement(d);
      if (el) svg.appendChild(el);
    }
  }

  for (const id in existingEls) {
    svg.removeChild(existingEls[id]);
  }
}
