// ============================================================
// Internal helpers
// ============================================================

/** Clamp a number between 0 and 255 and round. */
function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

/** Clamp a number between 0 and 1. */
function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

/** Clamp hue to 0–360. */
function clampHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Rgba extends Rgb {
  a: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** Named CSS colors (subset of the 148 standard SVG/CSS colors). */
const NAMED_COLORS: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

// ============================================================
// Parsing
// ============================================================

/**
 * Parse any CSS color string into an RGB(A) object.
 *
 * Supports: hex (`#rgb`, `#rrggbb`, `#rrggbbaa`), `rgb()`, `rgba()`,
 * `hsl()`, `hsla()`, and 148 named CSS colors (e.g. `'crimson'`).
 *
 * Returns `null` for unparseable input.
 *
 * @param input - Any CSS color string
 * @returns `{ r, g, b, a }` with `r`, `g`, `b` in 0–255 and `a` in 0–1,
 *   or `null` if parsing fails
 *
 * @example
 * parseColor('#ff0000')       // { r: 255, g: 0, b: 0, a: 1 }
 * parseColor('rgba(255,0,0)') // { r: 255, g: 0, b: 0, a: 1 }
 * parseColor('crimson')       // { r: 220, g: 20, b: 60, a: 1 }
 * parseColor('not-a-color')   // null
 */
export function parseColor(input: string): Rgba | null {
  if (!input) return null;
  const s = input.trim().toLowerCase();
  if (NAMED_COLORS[s]) return parseColor(NAMED_COLORS[s]);

  // #rgb, #rrggbb, #rgba, #rrggbbaa
  if (s.startsWith('#')) {
    const hex = s.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b, a: 1 };
    }
    if (hex.length === 6 || hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = hex.length === 8 ? Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100 : 1;
      if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
      return { r, g, b, a };
    }
    return null;
  }

  // rgb() / rgba()
  const rgbMatch = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (rgbMatch) {
    const r = clampByte(parseInt(rgbMatch[1]));
    const g = clampByte(parseInt(rgbMatch[2]));
    const b = clampByte(parseInt(rgbMatch[3]));
    const a = rgbMatch[4] !== undefined ? clamp01(parseFloat(rgbMatch[4])) : 1;
    return { r, g, b, a };
  }

  // hsl() / hsla()
  const hslMatch = s.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/);
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const sPct = parseFloat(hslMatch[2]) / 100;
    const lPct = parseFloat(hslMatch[3]) / 100;
    const a = hslMatch[4] !== undefined ? clamp01(parseFloat(hslMatch[4])) : 1;
    const { r, g, b } = hslToRgb({ h, s: sPct, l: lPct });
    return { r, g, b, a };
  }

  return null;
}

// ============================================================
// RGB / HSL conversion
// ============================================================

/**
 * Convert RGB to HSL.
 * @internal
 */
function rgbToHsl(r: number, g: number, b: number): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) / 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;

  return {
    h: Math.round(clampHue(h * 360) * 100) / 100,
    s: Math.round(s * 100) / 100,
    l: Math.round(l * 100) / 100,
  };
}

/**
 * Convert HSL to RGB.
 * @internal
 */
function hslToRgb(hsl: Hsl): Rgb {
  const h = hsl.h / 360;
  const s = hsl.s;
  const l = hsl.l;

  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

// ============================================================
// Formatting
// ============================================================

/**
 * Convert RGB values to a hex color string.
 *
 * Values are clamped to 0–255.
 *
 * @param r - Red channel (0–255)
 * @param g - Green channel (0–255)
 * @param b - Blue channel (0–255)
 * @returns Hex string like `'#ff0000'`
 *
 * @example
 * toHex(255, 0, 0)    // '#ff0000'
 * toHex(300, -10, 0)  // '#ff0000' (clamped)
 */
export function toHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => clampByte(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert hex color string to RGB object.
 *
 * Accepts `'#rgb'`, `'#rrggbb'`, and without `#` prefix.
 *
 * @param hex - Hex color string (e.g. `'#ff0000'`, `'#f00'`, `'ff0000'`)
 * @returns `{ r, g, b }` or `null` if invalid
 *
 * @example
 * toRgb('#ff0000')  // { r: 255, g: 0, b: 0 }
 * toRgb('#f00')     // { r: 255, g: 0, b: 0 }
 * toRgb('invalid')  // null
 */
export function toRgb(hex: string): Rgb | null {
  const s = hex.replace(/^#/, '');
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
  }
  return null;
}

/**
 * Build an `rgba()` CSS string.
 *
 * @param r - Red channel (0–255)
 * @param g - Green channel (0–255)
 * @param b - Blue channel (0–255)
 * @param a - Alpha channel 0–1 (default 1)
 * @returns `'rgba(r, g, b, a)'`
 *
 * @example
 * toRgba(255, 0, 0)       // 'rgba(255, 0, 0, 1)'
 * toRgba(255, 0, 0, 0.5)  // 'rgba(255, 0, 0, 0.5)'
 */
export function toRgba(r: number, g: number, b: number, a: number = 1): string {
  return `rgba(${clampByte(r)}, ${clampByte(g)}, ${clampByte(b)}, ${clamp01(a)})`;
}

/**
 * Build an `hsl()` CSS string.
 *
 * @param h - Hue in degrees (0–360)
 * @param s - Saturation as a percentage (0–100)
 * @param l - Lightness as a percentage (0–100)
 * @returns `'hsl(h, s%, l%)'`
 *
 * @example
 * hsl(0, 100, 50)    // 'hsl(0, 100%, 50%)'  (red)
 * hsl(120, 100, 50)  // 'hsl(120, 100%, 50%)' (green)
 */
export function hsl(h: number, s: number, l: number): string {
  return `hsl(${clampHue(h)}, ${clamp01(s / 100) * 100}%, ${clamp01(l / 100) * 100}%)`;
}

/**
 * Build an `hsla()` CSS string.
 *
 * @param h - Hue in degrees (0–360)
 * @param s - Saturation as a percentage (0–100)
 * @param l - Lightness as a percentage (0–100)
 * @param a - Alpha channel 0–1
 * @returns `'hsla(h, s%, l%, a)'`
 *
 * @example
 * hsla(0, 100, 50, 0.5)  // 'hsla(0, 100%, 50%, 0.5)'
 */
export function hsla(h: number, s: number, l: number, a: number): string {
  return `hsla(${clampHue(h)}, ${clamp01(s / 100) * 100}%, ${clamp01(l / 100) * 100}%, ${clamp01(a)})`;
}

// ============================================================
// Color manipulation
// ============================================================

/**
 * Lighten a color by a relative amount.
 *
 * Works by increasing the lightness (L) in HSL space.
 *
 * @param color - Any CSS color string
 * @param amount - Amount to lighten, 0–1 (e.g. `0.2` = 20% lighter)
 * @returns Hex string of the lightened color, or the original if parsing fails
 *
 * @example
 * lighten('#ff0000', 0.2)   // '#ff6666'
 * lighten('crimson', 0.3)  // '#f08b9a'
 */
export function lighten(color: string, amount: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  // Move lightness toward white proportionally to the remaining distance
  hsl.l = hsl.l + amount * (1 - hsl.l);
  const rgb = hslToRgb(hsl);
  return toHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Darken a color by a relative amount.
 *
 * Works by decreasing the lightness (L) in HSL space.
 *
 * @param color - Any CSS color string
 * @param amount - Amount to darken, 0–1 (e.g. `0.2` = 20% darker)
 * @returns Hex string of the darkened color, or the original if parsing fails
 *
 * @example
 * darken('#ff0000', 0.3)  // '#660000'
 * darken('blue', 0.5)     // '#000040'
 */
export function darken(color: string, amount: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  // Move lightness toward black proportionally to the current distance
  hsl.l = hsl.l - amount * hsl.l;
  const rgb = hslToRgb(hsl);
  return toHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Increase saturation of a color.
 *
 * @param color - Any CSS color string
 * @param amount - Amount to increase, 0–1 (e.g. `0.3` = +30% saturation)
 * @returns Hex string, or the original if parsing fails
 *
 * @example
 * saturate('#999', 0.5)  // more saturated version
 */
export function saturate(color: string, amount: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  hsl.s = clamp01(hsl.s + amount);
  const rgb = hslToRgb(hsl);
  return toHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Decrease saturation of a color.
 *
 * @param color - Any CSS color string
 * @param amount - Amount to decrease, 0–1
 * @returns Hex string, or the original if parsing fails
 *
 * @example
 * desaturate('crimson', 0.5)  // more muted
 */
export function desaturate(color: string, amount: number): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  hsl.s = clamp01(hsl.s - amount);
  const rgb = hslToRgb(hsl);
  return toHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Blend two colors together by a ratio.
 *
 * @param color1 - First CSS color
 * @param color2 - Second CSS color
 * @param ratio - Blend ratio: `0` = all color1, `1` = all color2 (default `0.5`)
 * @returns Hex string of the blended color, or color1 if parsing fails
 *
 * @example
 * mix('red', 'blue', 0.5)   // '#800080' (purple)
 * mix('red', 'blue', 0.2)   // something closer to red
 */
export function mix(color1: string, color2: string, ratio: number = 0.5): string {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);
  if (!c1) return color1;
  if (!c2) return color1;
  const r = Math.round(c1.r + (c2.r - c1.r) * ratio);
  const g = Math.round(c1.g + (c2.g - c1.g) * ratio);
  const b = Math.round(c1.b + (c2.b - c1.b) * ratio);
  return toHex(r, g, b);
}

/**
 * Get the complementary color (hue + 180°).
 *
 * @param color - Any CSS color string
 * @returns Hex string of the complementary color, or the original if parsing fails
 *
 * @example
 * complementary('#ff0000')  // '#00ffff' (cyan)
 * complementary('#00ff00')  // '#ff00ff' (magenta)
 */
export function complementary(color: string): string {
  const parsed = parseColor(color);
  if (!parsed) return color;
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  hsl.h = clampHue(hsl.h + 180);
  const rgb = hslToRgb(hsl);
  return toHex(rgb.r, rgb.g, rgb.b);
}

/**
 * Get analogous colors (adjacent on the color wheel).
 *
 * @param color - Any CSS color string
 * @param count - Number of colors to return (default `3`)
 * @returns Array of hex strings
 *
 * @example
 * analogous('#ff0000')  // ['#ff0000', '#ff00ff', '#ff8000']  (ish)
 */
export function analogous(color: string, count: number = 3): string[] {
  const parsed = parseColor(color);
  if (!parsed) return [color];
  const hsl = rgbToHsl(parsed.r, parsed.g, parsed.b);
  const step = 360 / count;
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    const h = clampHue(hsl.h + step * i - step * Math.floor(count / 2));
    const rgb = hslToRgb({ h, s: hsl.s, l: hsl.l });
    result.push(toHex(rgb.r, rgb.g, rgb.b));
  }
  return result;
}

// ============================================================
// Luminance & contrast
// ============================================================

/**
 * Calculate the relative luminance of a color (WCAG formula).
 *
 * @param color - Any CSS color string
 * @returns Luminance value 0–1, or `0` if parsing fails
 *
 * @example
 * luminance('#ffffff')  // 1
 * luminance('#000000')  // 0
 */
export function luminance(color: string): number {
  const parsed = parseColor(color);
  if (!parsed) return 0;
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * toLinear(parsed.r) + 0.7152 * toLinear(parsed.g) + 0.0722 * toLinear(parsed.b);
}

/**
 * Check if a color is perceived as light (high luminance).
 *
 * @param color - Any CSS color string
 * @returns `true` if the color is light
 *
 * @example
 * isLight('white')  // true
 * isLight('black')  // false
 */
export function isLight(color: string): boolean {
  return luminance(color) > 0.5;
}

/**
 * Check if a color is perceived as dark (low luminance).
 *
 * @param color - Any CSS color string
 * @returns `true` if the color is dark
 *
 * @example
 * isDark('black')  // true
 * isDark('white')  // false
 */
export function isDark(color: string): boolean {
  return luminance(color) <= 0.5;
}

/**
 * Return `'black'` or `'white'` for readable text on a given background.
 *
 * @param bgColor - Background CSS color
 * @returns `'black'` or `'white'`
 *
 * @example
 * contrastText('white')  // 'black'
 * contrastText('darkblue')  // 'white'
 */
export function contrastText(bgColor: string): string {
  return isLight(bgColor) ? 'black' : 'white';
}

// ============================================================
// Random colors
// ============================================================

/**
 * Generate a random hex color.
 *
 * @returns A random hex string like `'#a3f17b'`
 *
 * @example
 * randomColor()  // '#a3f17b'
 */
export function randomColor(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return toHex(r, g, b);
}

/**
 * Generate a random pastel color.
 *
 * Pastels have high lightness (~75%) and medium saturation (~60%),
 * making them soft on the eyes.
 *
 * @returns A hex pastel string like `'#d4a1f0'`
 *
 * @example
 * randomPastel()  // '#d4a1f0'
 */
export function randomPastel(): string {
  const hue = Math.floor(Math.random() * 360);
  const rgb = hslToRgb({ h: hue, s: 0.55, l: 0.78 });
  return toHex(rgb.r, rgb.g, rgb.b);
}

// ============================================================
// Palettes
// ============================================================

/**
 * A named color palette. Each palette contains 5–10 curated hex colors.
 *
 * Available palettes:
 * - `'material'` — Material Design-inspired
 * - `'pastel'` — Soft pastels
 * - `'vibrant'` — Bold, high-saturation
 * - `'mono'` — Single hue (blue) gradient
 * - `'sunset'` — Warm sunset tones
 * - `'ocean'` — Cool blues and teals
 * - `'forest'` — Greens and earth tones
 * - `'retro'` — Vintage / retro colors
 * - `'neon'` — Bright neon colors
 * - `'earth'` — Natural earth tones
 */
const PALETTES: Record<string, string[]> = {
  material: [
    '#f44336', '#e91e63', '#9c27b0', '#3f51b5', '#2196f3',
    '#00bcd4', '#009688', '#4caf50', '#ffeb3b', '#ff9800',
  ],
  pastel: [
    '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff',
    '#e8baff', '#ffb3ec', '#b3fffc', '#f0b3ff', '#ffe0b3',
  ],
  vibrant: [
    '#ff006e', '#8338ec', '#3a86ff', '#06d6a0', '#ffd166',
    '#ef476f', '#118ab2', '#073b4c', '#fb5607', '#ff006e',
  ],
  mono: [
    '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5',
    '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0d47a1',
  ],
  sunset: [
    '#ff9a9e', '#fad0c4', '#fbc2eb', '#a18cd1', '#fad0c4',
    '#ffecd2', '#fcb69f', '#ff9a9e', '#f6d365', '#fda085',
  ],
  ocean: [
    '#0077b6', '#00b4d8', '#48cae4', '#90e0ef', '#ade8f4',
    '#caf0f8', '#023e8a', '#03045e', '#0096c7', '#00b4d8',
  ],
  forest: [
    '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2',
    '#b7e4c7', '#d8f3dc', '#1b4332', '#081c15', '#52796f',
  ],
  retro: [
    '#e07a5f', '#3d405b', '#81b29a', '#f2cc8f', '#f4f1de',
    '#d4a373', '#cca8e9', '#ffc857', '#a8d5e2', '#f9a03f',
  ],
  neon: [
    '#ff00ff', '#00ff00', '#00ffff', '#ffff00', '#ff006e',
    '#7f00ff', '#00ff7f', '#ff7f00', '#7fff00', '#ff007f',
  ],
  earth: [
    '#8b6914', '#a0522d', '#6b4423', '#d2b48c', '#deb887',
    '#bc8f8f', '#8fbc8f', '#556b2f', '#2e8b57', '#808000',
  ],
};

export type PaletteName = keyof typeof PALETTES;

/**
 * Get a named color palette.
 *
 * @param name - Palette name: `'material'`, `'pastel'`, `'vibrant'`, `'mono'`,
 *   `'sunset'`, `'ocean'`, `'forest'`, `'retro'`, `'neon'`, or `'earth'`
 * @returns Array of hex color strings
 *
 * @example
 * palette('material').length  // 10
 * palette('pastel')[0]        // '#ffb3ba'
 */
export function palette(name: PaletteName): string[] {
  return PALETTES[name] ? [...PALETTES[name]] : [];
}

/**
 * List all available palette names.
 *
 * @returns Array of palette name strings
 *
 * @example
 * listPalettes()  // ['material', 'pastel', 'vibrant', ...]
 */
export function listPalettes(): PaletteName[] {
  return Object.keys(PALETTES) as PaletteName[];
}
