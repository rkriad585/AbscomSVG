import type { SvgDef } from './types';

/**
 * Create a home icon symbol.
 *
 * @param id - Symbol identifier for `<use href="#id">`
 * @returns A symbol SvgDef
 */
export function iconHome(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create a close / X icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconClose(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'line', attrs: { x1: 18, y1: 6, x2: 6, y2: 18, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'line', attrs: { x1: 6, y1: 6, x2: 18, y2: 18, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a menu / hamburger icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconMenu(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'line', attrs: { x1: 4, y1: 6, x2: 20, y2: 6, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'line', attrs: { x1: 4, y1: 12, x2: 20, y2: 12, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'line', attrs: { x1: 4, y1: 18, x2: 20, y2: 18, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a search / magnifying glass icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconSearch(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'circle', attrs: { cx: 11, cy: 11, r: 7, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 } },
      { type: 'line', attrs: { x1: 16, y1: 16, x2: 21, y2: 21, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a user / person icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconUser(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'circle', attrs: { cx: 12, cy: 7, r: 4, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 } },
    ],
  };
}

/**
 * Create a settings / gear icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconSettings(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: {
        d: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
        fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      } },
    ],
  };
}

/**
 * Create a bell / notification icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconBell(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'path', attrs: { d: 'M13.73 21a2 2 0 01-3.46 0', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create an arrow-left icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconArrowLeft(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'line', attrs: { x1: 19, y1: 12, x2: 5, y2: 12, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '12 19 5 12 12 5', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create an arrow-right icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconArrowRight(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'line', attrs: { x1: 5, y1: 12, x2: 19, y2: 12, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '12 5 19 12 12 19', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create a download icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconDownload(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '7 10 12 15 17 10', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'line', attrs: { x1: 12, y1: 15, x2: 12, y2: 3, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create an upload icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconUpload(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '17 8 12 3 7 8', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'line', attrs: { x1: 12, y1: 3, x2: 12, y2: 15, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a heart icon symbol (filled).
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconHeart(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z', fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create a star icon symbol (filled).
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconStar(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'polygon', attrs: { points: '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2', fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create an info icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconInfo(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'circle', attrs: { cx: 12, cy: 12, r: 10, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 } },
      { type: 'line', attrs: { x1: 12, y1: 16, x2: 12, y2: 12, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'line', attrs: { x1: 12, y1: 8, x2: 12.01, y2: 8, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a checkmark / success icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconCheck(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M22 11.08V12a10 10 0 11-5.93-9.14', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '22 4 12 14.01 9 11.01', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}

/**
 * Create an alert / warning triangle icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconAlert(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'line', attrs: { x1: 12, y1: 9, x2: 12, y2: 13, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
      { type: 'line', attrs: { x1: 12, y1: 17, x2: 12.01, y2: 17, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create an external link icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconExternalLink(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'path', attrs: { d: 'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'polyline', attrs: { points: '15 3 21 3 21 9', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
      { type: 'line', attrs: { x1: 10, y1: 14, x2: 21, y2: 3, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' } },
    ],
  };
}

/**
 * Create a clock icon symbol.
 *
 * @param id - Symbol identifier
 * @returns A symbol SvgDef
 */
export function iconClock(id: string): SvgDef {
  return {
    type: 'symbol',
    attrs: { id, viewBox: '0 0 24 24' },
    children: [
      { type: 'circle', attrs: { cx: 12, cy: 12, r: 10, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 } },
      { type: 'polyline', attrs: { points: '12 6 12 12 16 14', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } },
    ],
  };
}
