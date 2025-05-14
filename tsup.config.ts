import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  minify: true,
  treeshake: true,
  target: "es2020"
})
