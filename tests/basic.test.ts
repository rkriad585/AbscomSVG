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
  easing,
  fadeIn,
  fadeOut,
  pulse,
  spin,
  bounce,
  shake,
  slideIn,
  grow,
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
  parseColor,
  toRgba,
  hsl,
  hsla,
  lighten,
  darken,
  saturate,
  desaturate,
  mix,
  complementary,
  analogous,
  luminance,
  isLight,
  isDark,
  contrastText,
  randomColor,
  randomPastel,
  palette,
  listPalettes,
  PathBuilder,
  type SvgDef,
  type GradientStop,
  type TransformStep,
  type ChevronDir,
  type Rgb,
  type Rgba,
  type Hsl,
  FilterBuilder,
  dropShadow,
  blur,
  glow,
  grayscale,
  sepia,
  brightness,
  contrast,
  hueRotate,
  responsiveSvg,
  autoViewBox,
  grid,
  stack,
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

  test('group with single def (auto-array)', () => {
    const def = group(circle(10, 10, 5));
    expect(def.children).toHaveLength(1);
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

describe('enhanced animation helpers', () => {
  test('easing linear', () => {
    expect(easing('linear')).toEqual({ calcMode: 'linear' });
  });

  test('easing returns spline values for known names', () => {
    const e = easing('ease-in-out');
    expect(e.calcMode).toBe('spline');
    expect(e.keySplines).toBe('0.42 0 0.58 1');
    expect(e.keyTimes).toBe('0;1');
  });

  test('easing defaults to linear for unknown names', () => {
    expect(easing('unknown')).toEqual({ calcMode: 'linear' });
  });

  test('easing bounce uses valid keySplines (all values in 0-1 range)', () => {
    const e = easing('bounce');
    expect(e.calcMode).toBe('spline');
    expect(e.keyTimes).toBeDefined();
    // split keySplines into quads and verify all 4 values per quad are in [0,1]
    const quads = e.keySplines!.split(';').map(q => q.trim().split(' ').map(Number));
    for (const [x1, y1, x2, y2] of quads) {
      expect(x1).toBeGreaterThanOrEqual(0);
      expect(x1).toBeLessThanOrEqual(1);
      expect(y1).toBeGreaterThanOrEqual(0);
      expect(y1).toBeLessThanOrEqual(1);
      expect(x2).toBeGreaterThanOrEqual(0);
      expect(x2).toBeLessThanOrEqual(1);
      expect(y2).toBeGreaterThanOrEqual(0);
      expect(y2).toBeLessThanOrEqual(1);
    }
  });

  test('fadeIn wraps in g with opacity animate', () => {
    const def = fadeIn(circle(10, 10, 5, 'red'), '2s');
    expect(def.type).toBe('g');
    expect(def.children).toHaveLength(2);
    expect(def.children![1].type).toBe('animate');
    expect(def.children![1].attrs.attributeName).toBe('opacity');
    expect(def.children![1].attrs.from).toBe('0');
    expect(def.children![1].attrs.to).toBe('1');
    expect(def.children![1].attrs.dur).toBe('2s');
    expect(def.children![1].attrs.fill).toBe('freeze');
  });

  test('fadeOut wraps in g with opacity animate from 1 to 0', () => {
    const def = fadeOut(circle(10, 10, 5, 'red'), '1.5s');
    expect(def.children![1].attrs.from).toBe('1');
    expect(def.children![1].attrs.to).toBe('0');
  });

  test('pulse adds animate with values oscillation', () => {
    const def = pulse(circle(50, 50, 30, 'red'), 'r', '30', '40', '1s');
    expect(def.children).toHaveLength(1);
    expect(def.children![0].attrs.values).toBe('30;40;30');
    expect(def.children![0].attrs.keyTimes).toBe('0;0.5;1');
    expect(def.children![0].attrs.repeatCount).toBe('indefinite');
  });

  test('pulse mutates original def', () => {
    const def = circle(50, 50, 30, 'red');
    const result = pulse(def, 'opacity', '1', '0.3');
    expect(result).toBe(def);
  });

  test('spin adds rotate animateTransform', () => {
    const def = spin(circle(50, 50, 30, 'gold'), '3s');
    expect(def.children![0].type).toBe('animateTransform');
    expect(def.children![0].attrs.type).toBe('rotate');
    expect(def.children![0].attrs.from).toBe('0 50 50');
    expect(def.children![0].attrs.to).toBe('360 50 50');
    expect(def.children![0].attrs.dur).toBe('3s');
    expect(def.children![0].attrs.repeatCount).toBe('indefinite');
  });

  test('spin uses default center for elements without cx/cy', () => {
    const def = spin(rect(0, 0, 100, 50, 'blue'));
    expect(def.children![0].attrs.from).toBe('0 50 50');
  });

  test('bounce adds translate animateTransform with Y oscillation', () => {
    const def = bounce(circle(50, 50, 20, 'orange'), '0.8s');
    expect(def.children![0].attrs.values).toBe('0 0; 0 -20; 0 0');
    expect(def.children![0].attrs.dur).toBe('0.8s');
  });

  test('shake adds translate animateTransform with X oscillation', () => {
    const def = shake(circle(50, 50, 20, 'red'), '0.2s');
    expect(def.children![0].attrs.values).toContain('-5 0');
    expect(def.children![0].attrs.values).toContain('5 0');
  });

  test('slideIn from left', () => {
    const def = slideIn(rect(50, 50, 100, 80, 'blue'), 'left', '0.5s');
    expect(def.children![0].attrs.from).toBe('-200,0');
    expect(def.children![0].attrs.to).toBe('0,0');
    expect(def.children![0].attrs.fill).toBe('freeze');
  });

  test('slideIn from top', () => {
    const def = slideIn(circle(50, 50, 30, 'red'), 'top');
    expect(def.children![0].attrs.from).toBe('0,-200');
  });

  test('slideIn from bottom', () => {
    const def = slideIn(circle(50, 50, 30, 'red'), 'bottom');
    expect(def.children![0].attrs.from).toBe('0,200');
  });

  test('slideIn defaults to left', () => {
    const def = slideIn(circle(50, 50, 30, 'red'));
    expect(def.children![0].attrs.from).toBe('-200,0');
  });

  test('grow adds scale animateTransform', () => {
    const def = grow(circle(0, 0, 30, 'green'), '0.6s');
    expect(def.children![0].attrs.type).toBe('scale');
    expect(def.children![0].attrs.from).toBe('0');
    expect(def.children![0].attrs.to).toBe('1');
    expect(def.children![0].attrs.fill).toBe('freeze');
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

  test('parseColor hex 6-digit', () => {
    const c = parseColor('#ff0000');
    expect(c).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  test('parseColor hex 3-digit', () => {
    expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  test('parseColor hex 8-digit (with alpha)', () => {
    const c = parseColor('#ff000080');
    expect(c).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  test('parseColor named', () => {
    expect(parseColor('crimson')).toEqual({ r: 220, g: 20, b: 60, a: 1 });
    expect(parseColor('dodgerblue')).toEqual({ r: 30, g: 144, b: 255, a: 1 });
  });

  test('parseColor rgb syntax', () => {
    expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
  });

  test('parseColor rgba syntax', () => {
    expect(parseColor('rgba(255, 0, 0, 0.5)')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  test('parseColor hsl syntax', () => {
    const c = parseColor('hsl(0, 100%, 50%)');
    expect(c!.r).toBe(255);
    expect(c!.g).toBe(0);
    expect(c!.b).toBe(0);
    expect(c!.a).toBe(1);
  });

  test('parseColor returns null for invalid input', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('not-a-color')).toBeNull();
  });

  test('toRgba', () => {
    expect(toRgba(255, 0, 0)).toBe('rgba(255, 0, 0, 1)');
    expect(toRgba(255, 0, 0, 0.5)).toBe('rgba(255, 0, 0, 0.5)');
  });

  test('hsl / hsla formatting', () => {
    expect(hsl(0, 100, 50)).toBe('hsl(0, 100%, 50%)');
    expect(hsla(120, 100, 50, 0.5)).toBe('hsla(120, 100%, 50%, 0.5)');
  });

  test('lighten', () => {
    const l = lighten('#ff0000', 0.5);
    expect(l).toBe('#ff8080');
  });

  test('lighten returns original for invalid input', () => {
    expect(lighten('bad-color', 0.2)).toBe('bad-color');
  });

  test('darken', () => {
    expect(darken('#ff0000', 0.5)).toBe('#800000');
  });

  test('saturate', () => {
    const s = saturate('#808080', 0.5);
    expect(s).not.toBe('#808080');
  });

  test('desaturate', () => {
    const d = desaturate('#ff0000', 0.5);
    // desaturated red should have lower saturation
    expect(d).not.toBe('#ff0000');
  });

  test('mix blends two colors', () => {
    expect(mix('red', 'blue', 0.5)).toBe('#800080');
    expect(mix('red', 'blue', 0)).toBe('#ff0000');
    expect(mix('red', 'blue', 1)).toBe('#0000ff');
  });

  test('mix returns color1 on parse failure', () => {
    expect(mix('bad', '#fff', 0.5)).toBe('bad');
  });

  test('complementary', () => {
    expect(complementary('#ff0000')).toBe('#00ffff');
    expect(complementary('#00ff00')).toBe('#ff00ff');
    expect(complementary('#0000ff')).toBe('#ffff00');
  });

  test('complementary returns original for invalid input', () => {
    expect(complementary('bad')).toBe('bad');
  });

  test('analogous returns array of colors', () => {
    const result = analogous('#ff0000', 3);
    expect(result).toHaveLength(3);
    result.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });

  test('analogous returns [original] for invalid input', () => {
    expect(analogous('bad')).toEqual(['bad']);
  });

  test('luminance', () => {
    expect(luminance('#000000')).toBe(0);
    expect(luminance('#ffffff')).toBeCloseTo(1, 1);
  });

  test('isLight / isDark', () => {
    expect(isLight('white')).toBe(true);
    expect(isLight('black')).toBe(false);
    expect(isDark('black')).toBe(true);
    expect(isDark('white')).toBe(false);
  });

  test('contrastText', () => {
    expect(contrastText('white')).toBe('black');
    expect(contrastText('black')).toBe('white');
    expect(contrastText('darkblue')).toBe('white');
  });

  test('randomColor returns valid hex', () => {
    const c = randomColor();
    expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('randomPastel returns valid hex', () => {
    const c = randomPastel();
    expect(c).toMatch(/^#[0-9a-f]{6}$/);
  });

  test('palette returns array of hex colors', () => {
    const p = palette('material');
    expect(p.length).toBe(10);
    p.forEach(c => expect(c).toMatch(/^#[0-9a-f]{6}$/));
  });

  test('palette returns empty array for unknown name', () => {
    expect(palette('unknown' as any)).toEqual([]);
  });

  test('listPalettes returns all palette names', () => {
    const names = listPalettes();
    expect(names).toContain('material');
    expect(names).toContain('pastel');
    expect(names).toContain('vibrant');
    expect(names.length).toBe(10);
  });
});

describe('filter helpers', () => {
  test('FilterBuilder blur', () => {
    const def = new FilterBuilder('b1').blur(4).build();
    expect(def.type).toBe('filter');
    expect(def.attrs.id).toBe('b1');
    expect(def.children).toHaveLength(1);
    expect(def.children![0].type).toBe('feGaussianBlur');
    expect(def.children![0].attrs.stdDeviation).toBe(4);
    expect(def.children![0].attrs['in']).toBe('SourceGraphic');
  });

  test('FilterBuilder dropShadow', () => {
    const def = new FilterBuilder('s1').dropShadow(2, 2, 4, '#000').build();
    expect(def.children![0].type).toBe('feDropShadow');
    expect(def.children![0].attrs.dx).toBe(2);
    expect(def.children![0].attrs.dy).toBe(2);
    expect(def.children![0].attrs['flood-color']).toBe('#000');
  });

  test('FilterBuilder chaining multiple primitives', () => {
    const def = new FilterBuilder('chain')
      .blur(2)
      .offset(5, 5)
      .build();
    expect(def.children).toHaveLength(2);
    expect(def.children![0].type).toBe('feGaussianBlur');
    expect(def.children![1].type).toBe('feOffset');
  });

  test('FilterBuilder grayscale', () => {
    const def = new FilterBuilder('g').grayscale().build();
    expect(def.children![0].type).toBe('feColorMatrix');
    expect(def.children![0].attrs.type).toBe('saturate');
    expect(def.children![0].attrs.values).toBe('1');
  });

  test('FilterBuilder sepia', () => {
    const def = new FilterBuilder('s').sepia().build();
    expect(def.children![0].type).toBe('feColorMatrix');
    expect(def.children![0].attrs.type).toBe('matrix');
  });

  test('FilterBuilder hueRotate', () => {
    const def = new FilterBuilder('h').hueRotate(90).build();
    expect(def.children![0].attrs.values).toBe('90');
  });

  test('FilterBuilder brightness', () => {
    const def = new FilterBuilder('b').brightness(2).build();
    expect(def.children![0].type).toBe('feComponentTransfer');
    expect(def.children![0].children).toHaveLength(3);
  });

  test('FilterBuilder contrast', () => {
    const def = new FilterBuilder('c').contrast(1.5).build();
    expect(def.children![0].type).toBe('feComponentTransfer');
  });

  test('FilterBuilder invert', () => {
    const def = new FilterBuilder('i').invert().build();
    expect(def.children![0].children).toHaveLength(3);
    expect(def.children![0].children![0].attrs.type).toBe('table');
  });

  test('FilterBuilder opacity', () => {
    const def = new FilterBuilder('o').opacity(0.5).build();
    expect(def.children![0].children).toHaveLength(1);
    expect(def.children![0].children![0].type).toBe('feFuncA');
  });

  test('FilterBuilder blend', () => {
    const def = new FilterBuilder('bl').blend('a', 'b', 'multiply').build();
    expect(def.children![0].type).toBe('feBlend');
    expect(def.children![0].attrs.mode).toBe('multiply');
  });

  test('FilterBuilder merge', () => {
    const def = new FilterBuilder('m').merge('a', 'b', 'c').build();
    expect(def.children![0].type).toBe('feMerge');
    expect(def.children![0].children).toHaveLength(3);
    expect(def.children![0].children![0].attrs['in']).toBe('a');
  });

  test('FilterBuilder turbulence', () => {
    const def = new FilterBuilder('t').turbulence('0.02', 3).build();
    expect(def.children![0].type).toBe('feTurbulence');
    expect(def.children![0].attrs.baseFrequency).toBe('0.02');
    expect(def.children![0].attrs.numOctaves).toBe(3);
  });

  test('FilterBuilder displacementMap', () => {
    const def = new FilterBuilder('d').displacementMap(15).build();
    expect(def.children![0].type).toBe('feDisplacementMap');
    expect(def.children![0].attrs.scale).toBe(15);
  });

  test('FilterBuilder flood', () => {
    const def = new FilterBuilder('f').flood('red', 0.5).build();
    expect(def.children![0].type).toBe('feFlood');
    expect(def.children![0].attrs['flood-color']).toBe('red');
    expect(def.children![0].attrs['flood-opacity']).toBe(0.5);
  });

  test('FilterBuilder custom attrs in constructor', () => {
    const def = new FilterBuilder('b', { x: '-10%', y: '-10%', width: '120%', height: '120%' })
      .blur(4)
      .build();
    expect(def.attrs.x).toBe('-10%');
    expect(def.attrs.width).toBe('120%');
  });

  // --- Shorthand functions ---

  test('dropShadow shorthand', () => {
    const def = dropShadow('s', 3, 3, 5, '#00000080');
    expect(def.type).toBe('filter');
    expect(def.attrs.id).toBe('s');
    expect(def.children![0].attrs.dx).toBe(3);
  });

  test('blur shorthand', () => {
    const def = blur('b', 6);
    expect(def.children![0].attrs.stdDeviation).toBe(6);
  });

  test('glow shorthand', () => {
    const def = glow('g', '#ff00ff', 6);
    expect(def.children![0].attrs['flood-color']).toBe('#ff00ff');
    expect(def.children![0].attrs.stdDeviation).toBe(6);
  });

  test('grayscale shorthand', () => {
    const def = grayscale('g');
    expect(def.children![0].attrs.values).toBe('1');
  });

  test('sepia shorthand', () => {
    const def = sepia('s', 0.5);
    expect(def.children![0].attrs.type).toBe('matrix');
  });

  test('brightness shorthand', () => {
    const def = brightness('b', 2);
    expect(def.children![0].type).toBe('feComponentTransfer');
  });

  test('contrast shorthand', () => {
    const def = contrast('c', 1.5);
    expect(def.children![0].type).toBe('feComponentTransfer');
  });

  test('hueRotate shorthand', () => {
    const def = hueRotate('h', 90);
    expect(def.children![0].attrs.values).toBe('90');
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

describe('layout helpers', () => {
  test('responsiveSvg sets width 100% and viewBox', () => {
    const def = responsiveSvg(800, 600);
    expect(def.type).toBe('svg');
    expect(def.attrs.width).toBe('100%');
    expect(def.attrs.viewBox).toBe('0 0 800 600');
  });

  test('responsiveSvg with children', () => {
    const def = responsiveSvg(500, 300, circle(250, 150, 50, 'red'));
    expect(def.children).toHaveLength(1);
  });

  test('responsiveSvg with extra attrs', () => {
    const def = responsiveSvg(200, 200, undefined, { id: 'canvas' });
    expect(def.attrs.id).toBe('canvas');
  });

  test('autoViewBox from circles', () => {
    const defs = [circle(50, 50, 40, 'red')];
    // bounding box: (10,10) to (90,90); with padding 10: (0,0) to (100,100)
    expect(autoViewBox(defs, 10)).toBe('0 0 100 100');
  });

  test('autoViewBox from rects', () => {
    const defs = [rect(0, 0, 100, 80, 'blue')];
    expect(autoViewBox(defs, 5)).toBe('-5 -5 110 90');
  });

  test('autoViewBox from mixed shapes', () => {
    const defs = [
      circle(50, 50, 40, 'red'),      // extends to x:10..90, y:10..90
      rect(80, 20, 100, 60, 'blue'),  // extends to x:80..180, y:20..80
    ];
    const vb = autoViewBox(defs, 10);
    // overall: x:10..180, y:10..90; with padding 10: (0,0) to (190,100)
    expect(vb).toBe('0 0 190 100');
  });

  test('autoViewBox from nested groups', () => {
    const inner = circle(30, 30, 20, 'red');
    const g = group([inner]);
    expect(autoViewBox([g], 5)).toBe('5 5 50 50');
  });

  test('autoViewBox returns default for empty defs', () => {
    expect(autoViewBox([], 10)).toBe('0 0 100 100');
  });

  test('grid arranges defs in columns', () => {
    const defs = [circle(10, 10, 5), circle(10, 10, 5), circle(10, 10, 5)];
    const result = grid(defs, 2, { cellWidth: 60, cellHeight: 60 });
    expect(result).toHaveLength(3);
    // first: translate(0,0)
    expect(result[0].attrs.transform).toBe('translate(0,0)');
    // second: col 1, row 0
    expect(result[1].attrs.transform).toBe('translate(60,0)');
    // third: col 0, row 1
    expect(result[2].attrs.transform).toBe('translate(0,60)');
  });

  test('grid with custom start position', () => {
    const defs = [circle(10, 10, 5), circle(10, 10, 5)];
    const result = grid(defs, 2, { cellWidth: 80, cellHeight: 80, x: 20, y: 30 });
    expect(result[0].attrs.transform).toBe('translate(20,30)');
    expect(result[1].attrs.transform).toBe('translate(100,30)');
  });

  test('stack vertical', () => {
    const defs = [rect(0, 0, 100, 50, 'red'), rect(0, 0, 100, 50, 'green')];
    const result = stack(defs, 'vertical', { gap: 10, x: 5, y: 5 });
    expect(result).toHaveLength(2);
    expect(result[0].attrs.transform).toBe('translate(5,5)');
    // second item: 50 (height) + 10 (gap) below first
    expect(result[1].attrs.transform).toBe('translate(5,65)');
  });

  test('stack horizontal', () => {
    const defs = [rect(0, 0, 80, 50, 'red'), rect(0, 0, 80, 50, 'green')];
    const result = stack(defs, 'horizontal', { gap: 20 });
    expect(result[0].attrs.transform).toBe('translate(0,0)');
    expect(result[1].attrs.transform).toBe('translate(100,0)');
  });

  test('stack defaults to vertical', () => {
    const defs = [rect(0, 0, 50, 30, 'red')];
    const result = stack(defs);
    expect(result[0].attrs.transform).toBe('translate(0,0)');
  });
});
