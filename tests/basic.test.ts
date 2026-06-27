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
  animateTransform,
  animationSet,
  regularPolygon,
  star,
  arrow,
  chevron,
  cross,
  plus,
  diamond,
  heart,
  donut,
  gear,
  spiral,
  withStroke,
  withClass,
  withStyle,
  withOpacity,
  setFill,
  fill,
  stroke,
  show,
  hide,
  transform,
  translate,
  rotate,
  scale,
  skewX,
  skewY,
  composeTransforms,
  buildTransform,
  svg,
  group,
  use,
  defs,
  symbol,
  linearGradient,
  radialGradient,
  stop,
  tspan,
  clipPath,
  mask,
  marker,
  cloneDef,
  mergeDefs,
  createDef,
  attr,
  removeAttr,
  cx,
  cy,
  r,
  x,
  y,
  width,
  height,
  attrs,
  toHex,
  toRgb,
  PathBuilder,
  type SvgDef,
  type GradientStop,
  type TransformStep,
  type ChevronDir,
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

  test('rect with extra attrs', () => {
    const def = rect(0, 0, 50, 50, 'red', { rx: 5, ry: 5 });
    expect(def.attrs.rx).toBe(5);
    expect(def.attrs.ry).toBe(5);
    expect(def.attrs.fill).toBe('red');
  });

  test('ellipse', () => {
    const def = ellipse(50, 50, 40, 20, 'green');
    expect(def).toEqual({
      type: 'ellipse',
      attrs: { cx: 50, cy: 50, rx: 40, ry: 20, fill: 'green' },
    });
  });

  test('ellipse with extra attrs', () => {
    const def = ellipse(50, 50, 40, 20, 'green', { stroke: 'black' });
    expect(def.attrs.stroke).toBe('black');
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
});

describe('built-in complex shapes', () => {
  test('regularPolygon (hexagon)', () => {
    const def = regularPolygon(50, 50, 6, 40, 'dodgerblue');
    expect(def.type).toBe('polygon');
    expect(typeof def.attrs.points).toBe('string');
    const pts = (def.attrs.points as string).split(' ');
    expect(pts).toHaveLength(6);
    expect(def.attrs.fill).toBe('dodgerblue');
  });

  test('regularPolygon without fill', () => {
    const def = regularPolygon(0, 0, 3, 10);
    expect(def.attrs.fill).toBeUndefined();
  });

  test('star (5-point)', () => {
    const def = star(50, 50, 40, 16, 5, 'gold');
    expect(def.type).toBe('polygon');
    const pts = (def.attrs.points as string).split(' ');
    expect(pts).toHaveLength(10);
    expect(def.attrs.fill).toBe('gold');
  });

  test('star without fill', () => {
    const def = star(0, 0, 10, 5, 4);
    expect(def.attrs.fill).toBeUndefined();
  });

  test('arrow', () => {
    const def = arrow(10, 50, 200, 50, 'crimson');
    expect(def.type).toBe('path');
    expect(def.attrs.d).toContain('M 10 50 L 200 50');
    expect(def.attrs.stroke).toBe('crimson');
    expect(def.attrs['stroke-width']).toBe(2);
  });

  test('arrow defaults fill to black', () => {
    const def = arrow(0, 0, 100, 0);
    expect(def.attrs.stroke).toBe('black');
  });

  test('chevron right (default)', () => {
    const def = chevron(0, 0, 40, 30, 'right', 'steelblue');
    expect(def.type).toBe('path');
    expect(def.attrs.d).toContain('M 0 0 L 40 15 L 0 30');
    expect(def.attrs.stroke).toBe('steelblue');
  });

  test('chevron left', () => {
    const def = chevron(0, 0, 40, 30, 'left');
    expect(def.attrs.d).toContain('M 40 0 L 0 15 L 40 30');
  });

  test('chevron up', () => {
    const def = chevron(0, 30, 40, 20, 'up');
    expect(def.attrs.d).toContain('M 0 50 L 20 30 L 40 50');
  });

  test('chevron down', () => {
    const def = chevron(0, 0, 40, 20, 'down');
    expect(def.attrs.d).toContain('M 0 0 L 20 20 L 40 0');
  });

  test('cross', () => {
    const def = cross(50, 50, 30, 8, 'red');
    expect(def.type).toBe('path');
    expect(def.attrs.d).toContain('M 20 20 L 80 80');
    expect(def.attrs.d).toContain('M 80 20 L 20 80');
    expect(def.attrs.stroke).toBe('red');
    expect(def.attrs['stroke-width']).toBe(8);
  });

  test('cross defaults to black', () => {
    const def = cross(0, 0, 10, 3);
    expect(def.attrs.stroke).toBe('black');
  });

  test('plus', () => {
    const def = plus(50, 50, 25, 8, 'green');
    expect(def.type).toBe('path');
    expect(def.attrs.d).toContain('M 25 50 L 75 50');
    expect(def.attrs.d).toContain('M 50 25 L 50 75');
    expect(def.attrs.stroke).toBe('green');
    expect(def.attrs['stroke-width']).toBe(8);
  });

  test('diamond', () => {
    const def = diamond(50, 50, 30, 20, 'purple');
    expect(def.type).toBe('polygon');
    expect(def.attrs.fill).toBe('purple');
    const pts = (def.attrs.points as string).split(',');
    expect(pts).toHaveLength(4);
  });

  test('diamond without fill', () => {
    const def = diamond(0, 0, 10, 10);
    expect(def.attrs.fill).toBeUndefined();
  });

  test('heart', () => {
    const def = heart(50, 50, 40, 'crimson');
    expect(def.type).toBe('path');
    expect(def.attrs.fill).toBe('crimson');
    expect(def.attrs.d).toContain('C');
  });

  test('heart defaults fill to red', () => {
    const def = heart(50, 50, 40);
    expect(def.attrs.fill).toBe('red');
  });

  test('donut', () => {
    const def = donut(50, 50, 40, 20, 'chocolate');
    expect(def.type).toBe('path');
    expect(def.attrs.fill).toBe('chocolate');
    expect(def.attrs['fill-rule']).toBe('evenodd');
    expect(def.attrs.d).toContain('A');
  });

  test('gear', () => {
    const def = gear(50, 50, 40, 30, 8, 'silver');
    expect(def.type).toBe('polygon');
    expect(def.attrs.fill).toBe('silver');
    const pts = (def.attrs.points as string).split(' ');
    expect(pts).toHaveLength(16);
  });

  test('spiral', () => {
    const def = spiral(50, 50, 3, 30, 'dodgerblue');
    expect(def.type).toBe('path');
    expect(def.attrs.stroke).toBe('dodgerblue');
    expect(def.attrs['stroke-width']).toBe(2);
    expect(def.attrs.d).toContain('M');
    expect(def.attrs.d).toContain('L');
  });
});

describe('new container elements', () => {
  test('svg', () => {
    const def = svg(800, 600, '0 0 800 600');
    expect(def.type).toBe('svg');
    expect(def.attrs.xmlns).toBe('http://www.w3.org/2000/svg');
    expect(def.attrs.width).toBe(800);
    expect(def.attrs.height).toBe(600);
    expect(def.attrs.viewBox).toBe('0 0 800 600');
  });

  test('svg without viewBox', () => {
    const def = svg(100, 100);
    expect(def.attrs.viewBox).toBeUndefined();
  });

  test('svg with extra attrs', () => {
    const def = svg(100, 100, undefined, { 'aria-label': 'chart' });
    expect(def.attrs['aria-label']).toBe('chart');
  });

  test('group', () => {
    const def = group([circle(10, 10, 5)], { fill: 'red' });
    expect(def.type).toBe('g');
    expect(def.attrs.fill).toBe('red');
    expect(def.children).toHaveLength(1);
  });

  test('group without children', () => {
    const def = group();
    expect(def.type).toBe('g');
    expect(def.children).toBeUndefined();
  });

  test('defs', () => {
    const def = defs([linearGradient('g1', 0, 0, 1, 0)]);
    expect(def.type).toBe('defs');
    expect(def.children).toHaveLength(1);
  });

  test('symbol', () => {
    const def = symbol('icon', '0 0 24 24', [circle(12, 12, 10)]);
    expect(def.type).toBe('symbol');
    expect(def.attrs.id).toBe('icon');
    expect(def.attrs.viewBox).toBe('0 0 24 24');
    expect(def.children).toHaveLength(1);
  });

  test('clipPath', () => {
    const def = clipPath('myClip', [rect(0, 0, 100, 100)]);
    expect(def.type).toBe('clipPath');
    expect(def.attrs.id).toBe('myClip');
    expect(def.children).toHaveLength(1);
  });

  test('mask', () => {
    const def = mask('myMask', [circle(50, 50, 40, 'white')]);
    expect(def.type).toBe('mask');
    expect(def.attrs.id).toBe('myMask');
    expect(def.children).toHaveLength(1);
  });
});

describe('gradient elements', () => {
  test('linearGradient with stops', () => {
    const def = linearGradient('g1', 0, 0, 1, 0, [
      stop(0, 'red'),
      stop(1, 'blue'),
    ]);
    expect(def.type).toBe('linearGradient');
    expect(def.attrs.id).toBe('g1');
    expect(def.children).toHaveLength(2);
    expect(def.children![0].attrs['stop-color']).toBe('red');
  });

  test('radialGradient with stops', () => {
    const def = radialGradient('g2', '50%', '50%', '50%', [
      stop(0, 'white'),
      stop(1, 'black', 0.5),
    ]);
    expect(def.type).toBe('radialGradient');
    expect(def.attrs.id).toBe('g2');
    expect(def.children![1].attrs['stop-opacity']).toBe(0.5);
  });

  test('stop with opacity', () => {
    const def = stop('50%', 'red', 0.5);
    expect(def.type).toBe('stop');
    expect(def.attrs.offset).toBe('50%');
    expect(def.attrs['stop-color']).toBe('red');
    expect(def.attrs['stop-opacity']).toBe(0.5);
  });

  test('stop without opacity', () => {
    const def = stop(0, 'blue');
    expect(def.attrs['stop-opacity']).toBeUndefined();
  });
});

describe('marker and reference elements', () => {
  test('marker', () => {
    const def = marker('arrow', { markerWidth: 10, markerHeight: 10, orient: 'auto' }, [
      path('M0 0 L10 5 L0 10 Z', 'black'),
    ]);
    expect(def.type).toBe('marker');
    expect(def.attrs.id).toBe('arrow');
    expect(def.attrs.orient).toBe('auto');
    expect(def.children).toHaveLength(1);
  });

  test('use', () => {
    const def = use('#icon', 10, 20, 50, 50);
    expect(def.type).toBe('use');
    expect(def.attrs.href).toBe('#icon');
    expect(def.attrs.x).toBe(10);
    expect(def.attrs.y).toBe(20);
    expect(def.attrs.width).toBe(50);
    expect(def.attrs.height).toBe(50);
  });

  test('use with only href', () => {
    const def = use('#icon');
    expect(def.attrs.x).toBeUndefined();
    expect(def.attrs.y).toBeUndefined();
    expect(def.attrs.width).toBeUndefined();
    expect(def.attrs.height).toBeUndefined();
  });

  test('tspan', () => {
    const def = tspan('world', { fill: 'red' });
    expect(def.type).toBe('tspan');
    expect(def.text).toBe('world');
    expect(def.attrs.fill).toBe('red');
  });
});

describe('animation helpers', () => {
  test('animate', () => {
    const def = animate('r', '20', '40', '1s', 'indefinite');
    expect(def).toEqual({
      type: 'animate',
      attrs: { attributeName: 'r', from: '20', to: '40', dur: '1s', repeatCount: 'indefinite' },
    });
  });

  test('animateTransform', () => {
    const def = animateTransform('rotate', '0 50 50', '360 50 50', '2s', 'indefinite');
    expect(def.type).toBe('animateTransform');
    expect(def.attrs.attributeName).toBe('transform');
    expect(def.attrs.type).toBe('rotate');
    expect(def.attrs.dur).toBe('2s');
    expect(def.attrs.repeatCount).toBe('indefinite');
  });

  test('animateTransform without repeatCount', () => {
    const def = animateTransform('scale', '1', '2', '1s');
    expect(def.attrs.repeatCount).toBeUndefined();
  });

  test('animationSet', () => {
    const def = animationSet('visibility', 'hidden', '1s');
    expect(def.type).toBe('set');
    expect(def.attrs.attributeName).toBe('visibility');
    expect(def.attrs.to).toBe('hidden');
    expect(def.attrs.begin).toBe('1s');
  });

  test('animationSet without begin', () => {
    const def = animationSet('opacity', '0');
    expect(def.attrs.begin).toBeUndefined();
  });
});

describe('transform helpers', () => {
  test('transform (generic)', () => {
    expect(transform('rotate', 45, 50, 50)).toBe('rotate(45,50,50)');
  });

  test('translate with both args', () => {
    expect(translate(100, 50)).toBe('translate(100,50)');
  });

  test('translate with single arg', () => {
    expect(translate(100)).toBe('translate(100)');
  });

  test('rotate with center', () => {
    expect(rotate(45, 50, 50)).toBe('rotate(45,50,50)');
  });

  test('rotate without center', () => {
    expect(rotate(90)).toBe('rotate(90)');
  });

  test('scale with both args', () => {
    expect(scale(2, 3)).toBe('scale(2,3)');
  });

  test('scale with single arg', () => {
    expect(scale(2)).toBe('scale(2)');
  });

  test('skewX', () => {
    expect(skewX(30)).toBe('skewX(30)');
  });

  test('skewY', () => {
    expect(skewY(45)).toBe('skewY(45)');
  });

  test('composeTransforms', () => {
    const result = composeTransforms(translate(100, 50), rotate(45));
    expect(result).toBe('translate(100,50) rotate(45)');
  });

  test('composeTransforms filters falsy', () => {
    const result = composeTransforms(translate(10), null, rotate(45), undefined, false, scale(2));
    expect(result).toBe('translate(10) rotate(45) scale(2)');
  });

  test('buildTransform from objects', () => {
    const result = buildTransform(
      { type: 'translate', values: [100, 50] },
      { type: 'rotate', values: [45, 50, 50] },
      { type: 'scale', values: [2] },
    );
    expect(result).toBe('translate(100,50) rotate(45,50,50) scale(2)');
  });
});

describe('style utilities', () => {
  test('withStroke', () => {
    const def = circle(10, 10, 5, 'gold');
    const result = withStroke(def, 'black', 2);
    expect(result).toBe(def);
    expect(def.attrs.stroke).toBe('black');
    expect(def.attrs['stroke-width']).toBe(2);
  });

  test('withClass', () => {
    const def = circle(10, 10, 5);
    withClass(def, 'foo', 'bar');
    expect(def.attrs.class).toBe('foo bar');
  });

  test('withClass appends to existing class', () => {
    const def = circle(10, 10, 5);
    def.attrs.class = 'base';
    withClass(def, 'extra');
    expect(def.attrs.class).toBe('base extra');
  });

  test('withStyle', () => {
    const def = rect(0, 0, 100, 100);
    withStyle(def, { fill: 'red', strokeWidth: 2 });
    expect(def.attrs.style).toContain('fill: red');
    expect(def.attrs.style).toContain('stroke-width: 2');
  });

  test('withOpacity', () => {
    const def = circle(10, 10, 5);
    withOpacity(def, 0.5);
    expect(def.attrs.opacity).toBe(0.5);
  });

  test('setFill', () => {
    const def = path('M0 0 L10 10');
    setFill(def, 'blue');
    expect(def.attrs.fill).toBe('blue');
  });

  test('fill shorthand', () => {
    const def = circle(10, 10, 5);
    fill(def, 'green');
    expect(def.attrs.fill).toBe('green');
  });

  test('stroke shorthand with width', () => {
    const def = rect(0, 0, 100, 100);
    stroke(def, 'black', 2);
    expect(def.attrs.stroke).toBe('black');
    expect(def.attrs['stroke-width']).toBe(2);
  });

  test('stroke shorthand without width', () => {
    const def = rect(0, 0, 100, 100);
    stroke(def, 'red');
    expect(def.attrs.stroke).toBe('red');
    expect(def.attrs['stroke-width']).toBeUndefined();
  });

  test('show removes display attr', () => {
    const def = circle(10, 10, 5);
    def.attrs.display = 'none';
    show(def);
    expect(def.attrs.display).toBeUndefined();
  });

  test('hide sets display none', () => {
    const def = circle(10, 10, 5);
    hide(def);
    expect(def.attrs.display).toBe('none');
  });
});

describe('composition utilities', () => {
  test('cloneDef shallow', () => {
    const def = circle(10, 10, 5, 'red');
    const cloned = cloneDef(def);
    expect(cloned).toEqual(def);
    expect(cloned).not.toBe(def);
    expect(cloned.attrs).not.toBe(def.attrs);
  });

  test('cloneDef with children', () => {
    const def: SvgDef = {
      type: 'g',
      attrs: {},
      children: [circle(10, 10, 5, 'red')],
    };
    const cloned = cloneDef(def);
    expect(cloned.children![0]).toEqual(def.children![0]);
    expect(cloned.children![0]).not.toBe(def.children![0]);
  });

  test('cloneDef with overrides', () => {
    const def = circle(10, 10, 5, 'red');
    const cloned = cloneDef(def, { attrs: { fill: 'blue' } });
    expect(cloned.attrs.fill).toBe('blue');
    expect(def.attrs.fill).toBe('red');
  });

  test('mergeDefs', () => {
    const a = circle(10, 10, 5, 'red');
    const b = { type: 'circle', attrs: { stroke: 'black' } } as SvgDef;
    const merged = mergeDefs(a, b);
    expect(merged.attrs.fill).toBe('red');
    expect(merged.attrs.stroke).toBe('black');
  });

  test('createDef', () => {
    const def = createDef('myId', 'circle', { cx: 10, cy: 10, r: 5 }, [animate('r', '5', '10', '1s', 'indefinite')]);
    expect(def.id).toBe('myId');
    expect(def.type).toBe('circle');
    expect(def.attrs.cx).toBe(10);
    expect(def.children).toHaveLength(1);
  });
});

describe('attribute utilities', () => {
  test('attr getter', () => {
    const def = circle(10, 20, 30, 'red');
    expect(attr(def, 'cx')).toBe(10);
    expect(attr(def, 'fill')).toBe('red');
  });

  test('attr setter', () => {
    const def = circle(10, 20, 30, 'red');
    const result = attr(def, 'fill', 'blue');
    expect(result).toBe(def);
    expect(def.attrs.fill).toBe('blue');
  });

  test('removeAttr', () => {
    const def = circle(10, 20, 30, 'red');
    removeAttr(def, 'fill');
    expect(def.attrs.fill).toBeUndefined();
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

describe('position/size getters', () => {
  test('cx cy r from circle', () => {
    const def = circle(10, 20, 30);
    expect(cx(def)).toBe(10);
    expect(cy(def)).toBe(20);
    expect(r(def)).toBe(30);
  });

  test('x y width height from rect', () => {
    const def = rect(5, 10, 100, 50);
    expect(x(def)).toBe(5);
    expect(y(def)).toBe(10);
    expect(width(def)).toBe(100);
    expect(height(def)).toBe(50);
  });

  test('getters return undefined for missing attrs', () => {
    const def = polygon('0,0 10,0 5,10');
    expect(cx(def)).toBeUndefined();
    expect(width(def)).toBeUndefined();
  });
});

describe('multi-attribute accessor', () => {
  test('attrs getter returns copy of attrs', () => {
    const def = circle(10, 20, 30, 'red');
    const result = attrs(def);
    expect(result).toEqual({ cx: 10, cy: 20, r: 30, fill: 'red' });
    result.fill = 'blue';
    expect(def.attrs.fill).toBe('red');
  });

  test('attrs setter merges values', () => {
    const def = circle(10, 20, 30, 'red');
    attrs(def, { fill: 'blue', stroke: 'black' });
    expect(def.attrs.fill).toBe('blue');
    expect(def.attrs.stroke).toBe('black');
    expect(def.attrs.cx).toBe(10);
  });
});

describe('color helpers', () => {
  test('toHex', () => {
    expect(toHex(255, 0, 0)).toBe('#ff0000');
    expect(toHex(0, 255, 0)).toBe('#00ff00');
    expect(toHex(0, 0, 255)).toBe('#0000ff');
    expect(toHex(255, 255, 255)).toBe('#ffffff');
    expect(toHex(0, 0, 0)).toBe('#000000');
  });

  test('toHex clamps values', () => {
    expect(toHex(300, -10, 128)).toBe('#ff0080');
  });

  test('toRgb from 6-digit hex', () => {
    expect(toRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    expect(toRgb('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
    expect(toRgb('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
    expect(toRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
  });

  test('toRgb from 3-digit hex', () => {
    expect(toRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 });
    expect(toRgb('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
    expect(toRgb('#00f')).toEqual({ r: 0, g: 0, b: 255 });
  });

  test('toRgb without hash', () => {
    expect(toRgb('ff0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  test('toRgb returns null for invalid input', () => {
    expect(toRgb('#xyz')).toBeNull();
    expect(toRgb('not-a-color')).toBeNull();
    expect(toRgb('#fff00')).toBeNull();
  });
});

describe('PathBuilder', () => {
  test('builds a simple path', () => {
    const d = new PathBuilder()
      .M(10, 10)
      .L(100, 100)
      .Z()
      .build();
    expect(d).toBe('M 10 10 L 100 100 Z');
  });

  test('cubic bezier', () => {
    const d = new PathBuilder()
      .M(0, 0)
      .C(50, 0, 100, 100, 150, 100)
      .build();
    expect(d).toBe('M 0 0 C 50 0 100 100 150 100');
  });

  test('quadratic bezier', () => {
    const d = new PathBuilder()
      .M(0, 0)
      .Q(50, 100, 100, 0)
      .build();
    expect(d).toBe('M 0 0 Q 50 100 100 0');
  });

  test('arc command', () => {
    const d = new PathBuilder()
      .M(0, 0)
      .A(50, 50, 0, 0, 1, 100, 100)
      .build();
    expect(d).toBe('M 0 0 A 50 50 0 0 1 100 100');
  });

  test('relative commands', () => {
    const d = new PathBuilder()
      .M(10, 10)
      .l(20, 20)
      .h(30)
      .v(40)
      .build();
    expect(d).toBe('M 10 10 l 20 20 h 30 v 40');
  });

  test('smooth curves', () => {
    const d = new PathBuilder()
      .M(0, 0)
      .S(50, 100, 100, 0)
      .T(200, 0)
      .build();
    expect(d).toBe('M 0 0 S 50 100 100 0 T 200 0');
  });

  test('clear resets', () => {
    const pb = new PathBuilder();
    pb.M(10, 10).L(20, 20);
    expect(pb.length).toBe(2);
    pb.clear();
    expect(pb.length).toBe(0);
    expect(pb.build()).toBe('');
  });

  test('lowercase z', () => {
    const d = new PathBuilder().M(0, 0).L(10, 10).z().build();
    expect(d).toBe('M 0 0 L 10 10 z');
  });

  test('chaining returns this', () => {
    const pb = new PathBuilder();
    expect(pb.M(0, 0)).toBe(pb);
    expect(pb.clear()).toBe(pb);
  });
});
