import { test, expect } from "@playwright/test";

test("homepage loads", async ({ page }) => {
  await page.goto("/");
  // Check page has at least one element (body) and optionally a heading
  await expect(page.locator("body")).toBeVisible();
  // Optional: if your app has a title or heading, assert on it.
  // await expect(page.locator('h1')).toContainText('Welcome');
});
