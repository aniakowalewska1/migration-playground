import { test, expect } from "@playwright/test";

test("homepage loads and shows items", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveText("Migration Playground");
  // Wait for an item to appear
  const items = page.locator("ul li");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toHaveText("First item");
  await expect(items.nth(1)).toHaveText("Second item");
});
