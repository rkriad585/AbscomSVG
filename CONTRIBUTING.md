# Contributing to AbscomSVG

Thank you for contributing!

## Getting Started

1. Fork the repo
2. Install dependencies: `npm install` or `bun install`
3. Make your changes in `src/`
4. Run tests: `bun test`
5. Type-check: `npm run typecheck`
6. Build: `npm run build`

## Guidelines

- Keep the library dependency-free (no runtime dependencies)
- All creation helpers must work in Node.js, Bun, and browser (no DOM)
- Use the definition-object pattern (plain data, no DOM nodes)
- Add JSDoc with `@example` for every public function
- Add tests in `tests/basic.test.ts`
- Run all tests before submitting

## Code Style

- No semicolons (project convention)
- Single quotes for strings
- 2-space indentation
- Descriptive variable names

## Commit Messages

Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, etc.
