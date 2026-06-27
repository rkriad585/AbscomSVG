import type { SvgDef } from './types';

/**
 * A theme defines reusable visual tokens for colors, fonts, sizes, and more.
 *
 * All fields are optional — `applyTheme()` only replaces tokens that exist in
 * the theme and silently ignores unknown tokens.
 *
 * @example
 * ```ts
 * const myTheme: Theme = {
 *   colors: { primary: '#e94560', secondary: '#0f3460', bg: '#1a1a2e' },
 *   fonts: { body: 'system-ui, sans-serif', mono: 'monospace' },
 *   sizes: { sm: 8, md: 16, lg: 32 },
 * };
 * ```
 */
export interface Theme {
  colors?: Record<string, string>;
  fonts?: Record<string, string>;
  sizes?: Record<string, number | string>;
  radii?: Record<string, number | string>;
  borders?: Record<string, string>;
  shadows?: Record<string, string>;
}

/**
 * Pre-built neutral theme.
 */
export const neutralTheme: Theme = {
  colors: {
    primary: '#333333',
    secondary: '#666666',
    accent: '#999999',
    bg: '#ffffff',
    text: '#111111',
    muted: '#cccccc',
    border: '#dddddd',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: 'system-ui, sans-serif',
    mono: 'monospace',
  },
  sizes: { xs: 4, sm: 8, md: 16, lg: 24, xl: 48 },
  radii: { sm: 2, md: 4, lg: 8, full: 9999 },
};

/**
 * Walk a definition tree and replace `$section.key` tokens with values
 * from the theme.
 *
 * The function **mutates** the input def(s) in-place and returns the result.
 * Tokens are only replaced in string attribute values and `text` content.
 * Unknown tokens are left unchanged.
 *
 * @param def - A single SvgDef or array of SvgDefs to theme
 * @param theme - The theme object with color/font/size/etc tokens
 * @returns The same def(s) mutated in-place
 *
 * @example
 * ```ts
 * const theme: Theme = {
 *   colors: { primary: '#e94560', secondary: '#0f3460' },
 * };
 * const el = circle(50, 50, 30, '$colors.primary');
 * applyTheme(el, theme);
 * // el.attrs.fill → '#e94560'
 * ```
 */
export function applyTheme(def: SvgDef | SvgDef[], theme: Theme): SvgDef | SvgDef[] {
  const tokenRe = /\$(\w+)\.(\w+)/g;

  function resolve(token: string): string | undefined {
    const m = tokenRe.exec(token);
    tokenRe.lastIndex = 0;
    if (!m) return undefined;
    const section = m[1] as keyof Theme;
    const key = m[2];
    const sectionData = theme[section];
    if (!sectionData || typeof sectionData !== 'object') return undefined;
    const val = (sectionData as Record<string, unknown>)[key];
    return val !== undefined ? String(val) : undefined;
  }

  function replaceInStr(str: string): string {
    return str.replace(tokenRe, (match) => {
      return resolve(match) ?? match;
    });
  }

  function walk(d: SvgDef): void {
    for (const attr in d.attrs) {
      const val = d.attrs[attr];
      if (typeof val === 'string' && val.includes('$')) {
        d.attrs[attr] = replaceInStr(val);
      }
    }
    if (d.text && d.text.includes('$')) {
      d.text = replaceInStr(d.text);
    }
    if (d.children) {
      const arr = Array.isArray(d.children) ? d.children : [d.children];
      for (const child of arr) walk(child);
    }
  }

  if (Array.isArray(def)) {
    for (const d of def) walk(d);
  } else {
    walk(def);
  }

  return def;
}
