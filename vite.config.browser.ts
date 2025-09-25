import { defineConfig } from "vite"
import { resolve } from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index_browser.ts"),
      name: "RabbitmqAmqpClient",
      formats: ["umd"],
      fileName: () => `index.umd.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    target: ["es2020"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
