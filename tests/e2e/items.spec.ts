import { test, expect } from "@playwright/test";

test("items render with correct classes and text", async ({ page }) => {
  await page.goto("/");
  const items = page.locator("ul li");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toHaveText("First item");
  await expect(items.nth(0)).toHaveClass(/p-2/);
});
