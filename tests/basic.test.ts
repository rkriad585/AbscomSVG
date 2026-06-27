import { describe, expect, test } from 'bun:test';
import {
  circle,
  rect,
  ellipse,
  line,
  polygon,
  path,
  text,
  image,
  animate,
  withStroke,
  transform,
  type SvgDef,
} from '../src/index';

describe('element creation helpers', () => {
  test('circle', () => {
    const def = circle(10, 20, 30, 'red');
    expect(def).toEqual({
      type: 'circle',
      attrs: { cx: 10, cy: 20, r: 30, fill: 'red' },
    });
  });

  test('circle without fill', () => {
    const def = circle(10, 20, 30);
    expect(def.attrs.fill).toBeUndefined();
  });

  test('rect', () => {
    const def = rect(5, 10, 100, 50, 'blue');
    expect(def).toEqual({
      type: 'rect',
      attrs: { x: 5, y: 10, width: 100, height: 50, fill: 'blue' },
    });
  });

  test('ellipse', () => {
    const def = ellipse(50, 50, 40, 20, 'green');
    expect(def).toEqual({
      type: 'ellipse',
      attrs: { cx: 50, cy: 50, rx: 40, ry: 20, fill: 'green' },
    });
  });

  test('line', () => {
    const def = line(0, 0, 100, 100, 'black');
    expect(def).toEqual({
      type: 'line',
      attrs: { x1: 0, y1: 0, x2: 100, y2: 100, stroke: 'black' },
    });
  });

  test('polygon', () => {
    const def = polygon('100,10 40,198 190,78 10,78 160,198', 'navy');
    expect(def.attrs.points).toBe('100,10 40,198 190,78 10,78 160,198');
    expect(def.attrs.fill).toBe('navy');
  });

  test('path', () => {
    const def = path('M10 10 L100 100', 'none');
    expect(def.attrs.d).toBe('M10 10 L100 100');
    expect(def.attrs.fill).toBe('none');
  });

  test('text', () => {
    const def = text(10, 20, 'Hello', { fontSize: '20px', fill: 'black' });
    expect(def.type).toBe('text');
    expect(def.text).toBe('Hello');
    expect(def.attrs.x).toBe(10);
    expect(def.attrs.y).toBe(20);
    expect(def.attrs.fontSize).toBe('20px');
  });

  test('text without extra attrs', () => {
    const def = text(10, 20, 'Hello');
    expect(def.attrs.fontSize).toBeUndefined();
    expect(def.text).toBe('Hello');
  });

  test('text with empty string content', () => {
    const def = text(10, 20, '');
    expect(def.text).toBe('');
  });

  test('image', () => {
    const def = image('logo.png', 10, 10, 100, 100);
    expect(def.type).toBe('image');
    expect(def.attrs['xlink:href']).toBe('logo.png');
    expect(def.attrs.width).toBe(100);
  });

  test('animate', () => {
    const def = animate('r', '20', '40', '1s', 'indefinite');
    expect(def).toEqual({
      type: 'animate',
      attrs: { attributeName: 'r', from: '20', to: '40', dur: '1s', repeatCount: 'indefinite' },
    });
  });
});

describe('withStroke', () => {
  test('mutates and returns the def', () => {
    const def = circle(10, 10, 5, 'gold');
    const result = withStroke(def, 'black', 2);
    expect(result).toBe(def);
    expect(def.attrs.stroke).toBe('black');
    expect(def.attrs['stroke-width']).toBe(2);
  });
});

describe('transform', () => {
  test('rotate', () => {
    expect(transform('rotate', 45, 50, 50)).toBe('rotate(45,50,50)');
  });

  test('translate', () => {
    expect(transform('translate', 100, 50)).toBe('translate(100,50)');
  });

  test('scale', () => {
    expect(transform('scale', 2)).toBe('scale(2)');
  });
});

describe('id and children', () => {
  test('definition can have id and children', () => {
    const def: SvgDef = {
      type: 'circle',
      attrs: { cx: 50, cy: 50, r: 30, fill: 'red' },
      id: 'myCircle',
      children: [
        animate('r', '30', '40', '1s', 'indefinite'),
      ],
    };
    expect(def.id).toBe('myCircle');
    expect(def.children).toHaveLength(1);
    expect(def.children![0].type).toBe('animate');
  });

  test('definition can have events', () => {
    const clickFn = () => {};
    const def: SvgDef = {
      type: 'rect',
      attrs: { x: 0, y: 0, width: 100, height: 50, fill: 'blue' },
      events: {
        click: [clickFn, { callback: () => {}, options: { once: true } }],
      },
    };
    expect(Array.isArray(def.events!.click)).toBe(true);
    expect(def.events!.click).toHaveLength(2);
  });
});
