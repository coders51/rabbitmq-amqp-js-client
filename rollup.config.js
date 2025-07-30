import typescript from "@rollup/plugin-typescript"
import nodePolyfills from "rollup-plugin-polyfill-node"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

export default [
  {
    input: "src/index.ts",
    output: {
      format: "cjs",
      file: "dist/cjs/index.js",
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      typescript({
        module: "Node16",
        moduleResolution: "Node16",
        tsconfig: "./tsconfig.build.json",
        compilerOptions: {
          outDir: "dist/cjs",
          declaration: true,
          declarationDir: "dist/cjs",
        },
      }),
      nodePolyfills(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      format: "es",
      file: "dist/esm/index.js",
      name: "RabbitmqClient",
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      typescript({
        module: "Node16",
        moduleResolution: "Node16",
        tsconfig: "./tsconfig.build.json",
        compilerOptions: {
          outDir: "dist/esm",
          declaration: true,
          declarationDir: "dist/esm",
        },
      }),
      nodePolyfills(),
    ],
  },
  {
    input: "src/index.ts",
    output: {
      format: "umd",
      file: "dist/umd/index.js",
      name: "RabbitmqClient",
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      nodeResolve(),
      typescript({
        module: "Node16",
        moduleResolution: "Node16",
        tsconfig: "./tsconfig.build.json",
        compilerOptions: {
          outDir: "dist/umd",
          declaration: true,
          declarationDir: "dist/umd",
        },
      }),
      nodePolyfills(),
    ],
  },
]
