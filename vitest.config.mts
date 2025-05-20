import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    fileParallelism: false,
    testTimeout: 5000,
    sequence: {
      setupFiles: "list",
    },
    setupFiles: ["./test/setup.ts", "./test/index.ts"],
    env: {
      NODE_ENV: "test",
    },
    expect: {
      poll: { timeout: 1500, interval: 5 },
    },
    coverage: {
      enabled: false,
      provider: "istanbul",
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "test/**"],
    },
  },
})
