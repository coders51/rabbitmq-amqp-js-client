import { defineConfig } from "vite"
import { resolve } from "path"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [
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
      formats: ["es"],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: [
        "crypto",
        // Node.js built-in modules that rhea needs
        "net",
        "tls",
        "os",
        "path",
        "util",
        "events",
        "stream",
        "buffer",
        "fs",
        "dns"
      ],
      output: {
        globals: {},
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
  define: {
    // Ensure we're building for Node.js, not browser
    global: 'globalThis',
  },
})