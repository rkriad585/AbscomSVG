# Changelog

All notable changes to AbscomSVG will be documented in this file.

## [0.02.963] — 2026-06-27

### Added
- TypeScript rewrite — full type definitions (`SvgDef`, `EventHandler`)
- Dual-format build system: ESM (`.mjs`), CJS (`.cjs`), IIFE (`.iife.js`)
- `examples/` directory with runnable HTML demos
- `docs/` directory with overview, guide, API reference, and architecture
- Automated event listener cleanup on re-render (via `WeakMap` tracking)
- Stale attribute removal on `updateElement`
- `bun test` support with 18 smoke tests
- CDN support via `unpkg` and `jsdelivr` (IIFE bundle)
- CHANGELOG.md

### Changed
- Project restructured from single `abscomsvg.js` IIFE to modular `src/` layout
- All DOM-dependent code isolated in `renderer.ts`; creation helpers work in any runtime
- `render()` now throws a clear error in Node.js/Bun instead of silently failing
- Text validation: empty string `""` no longer triggers missing-content error
- License: fixed corrupted copyright header line

### Fixed
- Event listeners accumulating on each re-render (duplicate handlers)
- Stale attributes persisting after re-render with different definition
