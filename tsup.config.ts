import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    outDir: 'dist',
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs',
    }),
    splitting: false,
    sourcemap: true,
  },
  {
    entry: { abscomsvg: 'src/browser.ts' },
    format: ['iife'],
    globalName: 'AbscomSVG',
    outDir: 'dist',
    outExtension: () => ({ js: '.iife.js' }),
    dts: false,
    clean: false,
    sourcemap: true,
  },
]);
