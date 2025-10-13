import { test, expect } from "@playwright/test";

test("shows error UI when API returns 500", async ({ page }) => {
  // Intercept the API and return 500
  await page.route("**/api/items", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: "Internal",
    })
  );

  await page.goto("/");
  // Expect an alert with Error text (avoid matching Next's live region)
  const alert = page.locator('[role="alert"]', { hasText: "Error" });
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("Error");
});

test("shows empty state when API returns empty array", async ({ page }) => {
  await page.route("**/api/items", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" })
  );

  await page.goto("/");
  await expect(page.locator("text=No items found.")).toBeVisible();
});
