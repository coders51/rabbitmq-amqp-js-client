import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["cjs", "esm", "iife"],
  outExtension(ctx) {
    return {
      dts: ".d.ts",
      js: ctx.format === "cjs" ? ".cjs" : ".mjs",
    }
  },
  dts: true,
  minify: true,
  treeshake: true,
  target: ["es2020", "node20"],
})
