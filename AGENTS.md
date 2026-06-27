# AbscomSVG — Agent Guide

## Overview

Single-file browser-only SVG framework. No build step, no package manager, no tests.

- **Entrypoint**: `abscomsvg.js` — IIFE that exposes `window.AbscomSVG` globally.
- **No npm / Node** — include via `<script src="abscomsvg.js">` in HTML.
- **No test runner** — manual verification in browser only (open an HTML page in a browser).

## Definition Object Pattern

All public helpers return **definition objects** (not DOM elements):
```
{ type: string, attrs: object, id?: string, text?: string, events?: object, children?: object[] }
```

`AbscomSVG.render(targetIdOrEl, def | def[])` reconciles definitions onto real SVG DOM.

## DOM-diffing on Re-render

- Elements with an **`id`** are **updated in-place** on subsequent renders (attrs/text replaced, old children removed, new ones appended).
- Elements **without `id`** are always appended as new nodes.
- Stale IDs (present in DOM but absent in latest `render()` call) are **removed**.

## API Quirks

- `image(href, x, y, width, height)` sets `xlink:href` (not `href`).
- `transform(type, ...values)` returns a **string** (`"rotate(45,50,50)"`) — caller must assign it to `def.attrs.transform`.
- `withStroke(def, color, width)` mutates and returns `def`.
- Event handlers: `def.events.click = [fn | {callback, options}]` — array or single value.
- Validation warnings for missing required attrs go to `console.error` but do not throw.

## Available Helpers

`circle`, `rect`, `ellipse`, `line`, `polygon`, `path`, `text`, `image`, `animate`, `withStroke`, `transform`.

## SVG Namespace

Hardcoded to `http://www.w3.org/2000/svg`. The target `<svg>` container needs `xmlns="http://www.w3.org/2000/svg"`.
