import type { SvgDef } from './types';

export function circle(cx: number, cy: number, r: number, fill?: string): SvgDef {
  return { type: 'circle', attrs: { cx, cy, r, fill } };
}

export function rect(x: number, y: number, width: number, height: number, fill?: string): SvgDef {
  return { type: 'rect', attrs: { x, y, width, height, fill } };
}

export function ellipse(cx: number, cy: number, rx: number, ry: number, fill?: string): SvgDef {
  return { type: 'ellipse', attrs: { cx, cy, rx, ry, fill } };
}

export function line(x1: number, y1: number, x2: number, y2: number, stroke?: string): SvgDef {
  return { type: 'line', attrs: { x1, y1, x2, y2, stroke } };
}

export function polygon(points: string, fill?: string): SvgDef {
  return { type: 'polygon', attrs: { points, fill } };
}

export function path(d: string, fill?: string): SvgDef {
  return { type: 'path', attrs: { d, fill } };
}

export function text(x: number, y: number, content: string, attrs?: Record<string, unknown>): SvgDef {
  return {
    type: 'text',
    attrs: { x, y, ...attrs },
    text: content,
  };
}

export function image(
  href: string,
  x: number,
  y: number,
  width: number,
  height: number,
): SvgDef {
  return { type: 'image', attrs: { 'xlink:href': href, x, y, width, height } };
}

export function animate(
  attributeName: string,
  from: string,
  to: string,
  dur: string,
  repeatCount: string,
): SvgDef {
  return { type: 'animate', attrs: { attributeName, from, to, dur, repeatCount } };
}

export function withStroke(def: SvgDef, color: string, width: number): SvgDef {
  def.attrs.stroke = color;
  def.attrs['stroke-width'] = width;
  return def;
}

export function transform(type: string, ...values: (number | string)[]): string {
  return `${type}(${values.join(',')})`;
}
