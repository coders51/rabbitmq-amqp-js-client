import { defineConfig } from "vite"
import { resolve } from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [
    nodePolyfills({
      // Enable polyfills for specific globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Enable polyfills for Node.js built-in modules
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
      // Bundle everything for browser
      external: [],
      output: {
        globals: {},
      },
    },

    // Build options
    outDir: "dist",
    emptyOutDir: false, // Don't clear dist since we'll have multiple builds
    sourcemap: true,
    minify: true,

    // Target modern environments but maintain compatibility
    target: ["es2020"],

    // Ensure proper handling of external dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },

  // Define configuration for different environments
  define: {
    // Ensure proper environment detection
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },

  // Resolve configuration
  resolve: {
    alias: {
      // Add any necessary path aliases
      "@": resolve(__dirname, "src"),
    },
  },
})
