import { test, expect } from "@playwright/test";

test("api/items returns expected JSON", async ({ request }) => {
  const r = await request.get("/api/items");
  expect(r.ok()).toBeTruthy();
  const json = await r.json();
  expect(Array.isArray(json)).toBe(true);
  expect(json[0]).toHaveProperty("id");
  expect(json[0]).toHaveProperty("name");
});
