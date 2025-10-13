import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: process.env.CI
    ? {
        command: "npm run build && npm run start",
        port: 3000,
        timeout: 120_000,
        reuseExistingServer: false,
      }
    : {
        command: "npm run dev",
        port: 3000,
        timeout: 120_000,
        reuseExistingServer: true,
      },
});
