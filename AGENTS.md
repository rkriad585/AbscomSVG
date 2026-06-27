# AbscomSVG — Agent Guide

## Overview

TypeScript SVG framework packaged as a dual-format (ESM/CJS) npm module with a browser IIFE for CDN.

- **Runtime support**: Browser, Node.js ≥18, Bun
- **Build**: `tsup` — outputs ESM (`.mjs`), CJS (`.cjs`), and IIFE (`.iife.js` for CDN)
- **TypeScript**: declarations auto-generated in `dist/`
- **No runtime dependencies**

## Project Structure

```
src/
  index.ts      — Public API exports
  types.ts      — SvgDef, EventHandler, GradientStop interfaces
  elements.ts   — All creation helpers + utilities (shapes, containers, gradients, transforms, style, composition, attr, PathBuilder)
  filters.ts    — FilterBuilder class (21 methods) + 10 shorthand helpers
  color.ts      — 21 color functions + 10 palettes + color types
  animation.ts  — 9 enhanced animation helpers (easing, fadeIn, pulse, etc.)
  layout.ts     — 4 layout helpers (responsiveSvg, autoViewBox, grid, stack)
  theme.ts      — Theme interface, applyTheme, neutralTheme
  serialize.ts  — toInlineSvg, toDataUri, downloadSvg
  symbols.ts    — 19 pre-built icon symbol functions
  renderer.ts   — DOM render with RenderOptions (hooks, validate toggle)
  browser.ts    — IIFE entry for CDN (re-exports index)
tests/
  basic.test.ts — 213 tests covering all helpers and utilities
docs/
  overview.md, getting-started.md, guide.md, api-reference.md, architecture.md
examples/
  basic.html, smiley-face.html, animations.html, interactive.html,
  dynamic-updates.html, gradients.html, transforms.html, composition.html,
  bar-chart.html, clip-mask-pattern.html, interactive-drawing.html,
  shapes.html, color-playground.html, filters.html,
  animations-enhanced.html, layout.html, theming.html,
  filters-effects-shapes-symbols.html, node-server.js
```

## Commands

| Command | Action |
|---|---|
| `bun test` | Run tests (creation helpers; render needs a browser) |
| `npm run build` | `tsup` → `dist/abscomsvg.{cjs,mjs,iife.js}` + `.d.ts` |
| `npm run dev` | Watch mode rebuild |
| `npm run typecheck` | `tsc --noEmit` |

## Definition Object Pattern

All element helpers return **definition objects** (plain data, no DOM):
```
{ type: string, attrs: object, id?: string, text?: string, events?: object, children?: object[] }
```

These work in any runtime. `render()` reconciles them against real SVG DOM and requires a browser.

## DOM-diffing on Re-render

- Elements with an **`id`** are **updated in-place** on subsequent renders (stale attributes removed, old event listeners cleaned up, new ones applied).
- Elements **without `id`** are always appended as new nodes.
- Stale IDs (present in DOM but absent in latest `render()` call) are **removed**.

## Renderer Options

`render(svg, def, options?)` accepts a third `RenderOptions` argument:
```ts
interface RenderOptions {
  validate?: boolean;           // enable/disable validation (default true)
  beforeCreate?: (def) => def;  // hook before element creation
  afterCreate?: (el, def) => void;  // hook after element creation
  beforeUpdate?: (el, def) => def | false;  // return false to skip update
  afterUpdate?: (el, def) => void;  // hook after element update
}
```

## API Quirks

- `image(href, x, y, width, height)` sets `xlink:href` (not `href`). Newer `use(href, x?, y?, width?, height?)` uses `href` (modern).
- `transform(type, ...values)` returns a **string** — caller must assign it to `def.attrs.transform`. Also has named helpers: `translate`, `rotate`, `scale`, `skewX`, `skewY`, `composeTransforms`.
- `FilterBuilder` has 21 methods including `morphology(operator, radius)`, `tile()`, `feImage(href)`.
- Shorthand filter helpers: `blur`, `dropShadow`, `glow`, `shadow`, `neon`, `outline`, `hueRotate`, `grayscale`, `sepia`, `brightness`.
- 4 additional shapes: `ring(cx, cy, outerR, thickness?)`, `capsule(x, y, w, h)`, `tag(x, y, w, h)`, `chatBubble(cx, cy, w, h)`.
- 19 icon symbol functions: `iconHome`, `iconClose`, `iconMenu`, `iconSearch`, `iconUser`, `iconSettings`, `iconBell`, `iconArrowLeft`, `iconArrowRight`, `iconDownload`, `iconUpload`, `iconHeart`, `iconStar`, `iconInfo`, `iconCheck`, `iconAlert`, `iconExternalLink`, `iconClock`.
- `withStroke(def, color, width)` mutates and returns `def`. Same pattern: `withClass`, `withStyle`, `withOpacity`, `setFill`, `attr` (setter mode), `removeAttr`.
- `cloneDef(def, overrides?)` creates a deep clone (children recursively cloned).
- `mergeDefs(...defs)` merges attrs/events/children, last-wins.
- `attr(def, key)` — getter, `attr(def, key, value)` — setter.
- Event handlers: `def.events.click = [fn | {callback, options}]` — array or single value.
- Validation warnings for missing required attrs go to `console.error` but do not throw. Set `validate: false` in render options to suppress.

## Browser / Node split

| Function | Node/Bun | Browser |
|---|---|---|
| `circle`, `rect`, ... creation helpers | ✅ | ✅ |
| `withStroke`, `transform`, style utils | ✅ | ✅ |
| `render()` | ❌ (throws) | ✅ |

For server-side SVG generation, use helpers to build definitions and serialize manually.

## Build Artifacts

After build, `dist/` contains:
- `index.mjs` — ESM (`import { circle } from 'abscomsvg'`)
- `index.cjs` — CommonJS (`const { circle } = require('abscomsvg')`)
- `abscomsvg.iife.js` — Browser global (`<script src="...">`, exposes `window.AbscomSVG`)
- `index.d.ts`, `index.d.cts` — TypeScript declarations
