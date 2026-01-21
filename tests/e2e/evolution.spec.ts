import { test, expect } from "@playwright/test";

test("api/pokemon/evolution returns evolution chain for charmander", async ({
  request,
}) => {
  const r = await request.get("/api/pokemon/evolution?name=charmander");
  expect(r.ok()).toBeTruthy();
  const json = await r.json();

  expect(json).toHaveProperty("success", true);
  expect(json).toHaveProperty("pokemon", "charmander");
  expect(json).toHaveProperty("evolution_chain");
  expect(Array.isArray(json.evolution_chain)).toBe(true);

  // Validate evolution chain structure
  const chain = json.evolution_chain;
  expect(chain.length).toBeGreaterThan(0);

  // Check first evolution (Charmander)
  expect(chain[0]).toHaveProperty("id");
  expect(chain[0]).toHaveProperty("name");
  expect(chain[0]).toHaveProperty("stage");
  expect(chain[0]).toHaveProperty("evolves_at_level");
});

test("api/pokemon/evolution returns 400 when name parameter is missing", async ({
  request,
}) => {
  const r = await request.get("/api/pokemon/evolution");
  expect(r.status()).toBe(400);
  const json = await r.json();
  expect(json).toHaveProperty("error", "Name parameter is required");
});

test("api/pokemon/evolution returns 404 for non-existent pokemon", async ({
  request,
}) => {
  const r = await request.get("/api/pokemon/evolution?name=invalidpokemon123");
  expect(r.status()).toBe(404);
  const json = await r.json();
  expect(json).toHaveProperty("error", "Pokemon not found");
});

test("api/pokemon/evolution returns single entry for pokemon with no evolutions", async ({
  request,
}) => {
  const r = await request.get("/api/pokemon/evolution?name=ditto");
  expect(r.ok()).toBeTruthy();
  const json = await r.json();

  expect(json).toHaveProperty("success", true);
  expect(json).toHaveProperty("pokemon", "ditto");
  expect(Array.isArray(json.evolution_chain)).toBe(true);
  expect(json.evolution_chain.length).toBe(1);
  expect(json.evolution_chain[0].name).toBe("ditto");
});
