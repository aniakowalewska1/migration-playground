import { test, expect } from "@playwright/test";

test("header links point to expected domains", async ({ page }) => {
  await page.goto("/");
  const deploy = page.getByRole("link", { name: /Deploy now/i });
  await expect(deploy).toHaveAttribute("href", /vercel.com/);

  const docs = page.getByRole("link", { name: /Read our docs/i });
  await expect(docs).toHaveAttribute("href", /nextjs.org/);
});
