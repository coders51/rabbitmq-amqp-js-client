import { defineConfig } from "vite"
import { resolve } from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import dts from "vite-plugin-dts"

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
    dts({
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "test/**/*"],
      rollupTypes: true,
      outDir: ["dist"],
      entryRoot: "src",
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "RabbitmqAmqpClient",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["rhea"],
      output: {
        globals: {
          rhea: "rhea",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false,
    target: ["node16", "es2020"],
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
