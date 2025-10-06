import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RabbitmqAmqpClient",
      formats: ["cjs"],
      fileName: () => `index.cjs`,
    },
    rollupOptions: {
      external: ["rhea", "crypto"],
      output: {
        globals: {
          rhea: "rhea",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
    target: "node16",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})