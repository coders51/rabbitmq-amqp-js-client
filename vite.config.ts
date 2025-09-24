import { defineConfig } from "vite"
import { resolve } from "path"
import { nodePolyfills } from "vite-plugin-node-polyfills"
import dts from "vite-plugin-dts"

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
    dts({
      // Generate .d.ts files
      include: ["src/**/*"],
      exclude: ["src/**/*.test.ts", "src/**/*.spec.ts", "test/**/*"],
      rollupTypes: true, // Bundle declarations into single files
      outDir: ["dist"], // Specify output directory explicitly
      entryRoot: "src", // Set the root for entry resolution
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
      // Externalize rhea for Node.js builds (ESM/CJS)
      external: ["rhea"],
      output: {
        globals: {
          rhea: "rhea",
        },
      },
    },

    // Build options
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    minify: false, // Keep un-minified for debugging, can be enabled for production

    // Target modern environments but maintain compatibility
    target: ["node16", "es2020"],

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
