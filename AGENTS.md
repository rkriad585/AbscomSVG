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
  types.ts      — SvgDef, EventHandler interfaces
  elements.ts   — Creation helpers + withStroke/transform
  renderer.ts   — DOM render, createElement, updateElement, validate (internal)
  browser.ts    — IIFE entry for CDN (re-exports index)
tests/
  basic.test.ts — Smoke tests for element creation helpers
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

## API Quirks

- `image(href, x, y, width, height)` sets `xlink:href` (not `href`).
- `transform(type, ...values)` returns a **string** — caller must assign it to `def.attrs.transform`.
- `withStroke(def, color, width)` mutates and returns `def`.
- Event handlers: `def.events.click = [fn | {callback, options}]` — array or single value.
- Validation warnings for missing required attrs go to `console.error` but do not throw.

## Browser / Node split

| Function | Node/Bun | Browser |
|---|---|---|
| `circle`, `rect`, ... creation helpers | ✅ | ✅ |
| `withStroke`, `transform` | ✅ | ✅ |
| `render()` | ❌ (throws) | ✅ |

For server-side SVG generation, use helpers to build definitions and serialize manually.

## Build Artifacts

After build, `dist/` contains:
- `abscomsvg.mjs` — ESM (`import { circle } from 'abscomsvg'`)
- `abscomsvg.cjs` — CommonJS (`const { circle } = require('abscomsvg')`)
- `abscomsvg.iife.js` — Browser global (`<script src="...">`, exposes `window.AbscomSVG`)
- `index.d.ts`, `index.d.ts.map` — TypeScript declarations
