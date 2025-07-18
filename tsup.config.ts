import { defineConfig } from "tsup"
import plugin from "./build_utils/plugin.mjs"
import stdLibBrowser from "node-stdlib-browser"

export default defineConfig([
  {
    entry: ["src/index.ts"],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ["cjs", "esm"],
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
  },
  {
    entry: ["src/index.ts"],
    outDir: "browser",
    clean: true,
    esbuildPlugins: [plugin(stdLibBrowser)],
    esbuildOptions(options) {
      options.entryPoints = ["src/index.ts"]
      options.globalName = "stdLibBrowser"
      options.splitting = false
      options.sourcemap = true
      options.format = "iife"
      options.minify = true
      options.treeShaking = true
      options.target = ["es2020"]
      options.platform = "browser"
      options.inject = ["./build_utils/shim.js"]
      options.define = {
        global: "global",
        process: "process",
        Buffer: "Buffer",
      }
    },
  },
])
