import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index_browser.ts",
      name: "rabbitmq",
    },
    outDir: "dist_browser",
    minify: false,
  },
  plugins: [nodePolyfills()],
})
