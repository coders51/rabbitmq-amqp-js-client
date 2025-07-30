import nodePolyfills from "rollup-plugin-polyfill-node"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default [
  {
    input: "dist/index.js",
    output: {
      format: "cjs",
      file: "dist/cjs/index.js",
      sourcemap: true,
    },
    external: ["rhea", "uuid"],
    plugins: [commonjs(), nodePolyfills()],
  },
  {
    input: "dist/index.js",
    output: {
      format: "es",
      file: "dist/esm/index.js",
      name: "RabbitmqClient",
      sourcemap: true,
    },
    plugins: [commonjs(), nodeResolve(), nodePolyfills()],
  },
  {
    input: "dist/index.js",
    output: {
      format: "umd",
      file: "dist/umd/index.js",
      name: "RabbitmqClient",
      sourcemap: true,
    },
    plugins: [commonjs(), nodeResolve(), nodePolyfills()],
  },
]
