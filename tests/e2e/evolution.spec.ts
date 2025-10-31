import { test, expect } from "@playwright/test";

test.describe("Pokemon Evolution API", () => {
  test("returns evolution chain for Pokemon with evolutions", async ({
    request,
  }) => {
    const response = await request.get("/api/pokemon/evolution?name=charmander");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("success", true);
    expect(json).toHaveProperty("pokemon", "charmander");
    expect(json).toHaveProperty("evolution_chain");
    expect(Array.isArray(json.evolution_chain)).toBe(true);
    expect(json.evolution_chain.length).toBeGreaterThan(0);

    // Verify structure of evolution chain members
    const firstEvolution = json.evolution_chain[0];
    expect(firstEvolution).toHaveProperty("id");
    expect(firstEvolution).toHaveProperty("name");
    expect(firstEvolution).toHaveProperty("stage");
    expect(firstEvolution).toHaveProperty("evolves_at_level");
  });

  test("returns evolution chain for Pokemon without evolutions", async ({
    request,
  }) => {
    const response = await request.get("/api/pokemon/evolution?name=mewtwo");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("success", true);
    expect(json).toHaveProperty("pokemon", "mewtwo");
    expect(json).toHaveProperty("evolution_chain");
    expect(Array.isArray(json.evolution_chain)).toBe(true);
    expect(json.evolution_chain.length).toBe(1);

    // Single Pokemon should have stage 1 and no evolution level
    const evolution = json.evolution_chain[0];
    expect(evolution).toHaveProperty("stage", 1);
    expect(evolution).toHaveProperty("evolves_at_level", null);
  });

  test("returns 404 for non-existent Pokemon", async ({ request }) => {
    const response = await request.get(
      "/api/pokemon/evolution?name=notapokemon"
    );
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(404);

    const json = await response.json();
    expect(json).toHaveProperty("error");
    expect(json.error).toBe("Pokemon not found");
  });

  test("returns 400 when name parameter is missing", async ({ request }) => {
    const response = await request.get("/api/pokemon/evolution");
    expect(response.ok()).toBeFalsy();
    expect(response.status()).toBe(400);

    const json = await response.json();
    expect(json).toHaveProperty("error");
    expect(json.error).toBe("Name parameter is required");
  });

  test("handles case-insensitive Pokemon names", async ({ request }) => {
    const response = await request.get("/api/pokemon/evolution?name=PIKACHU");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const json = await response.json();
    expect(json).toHaveProperty("success", true);
    expect(json).toHaveProperty("pokemon", "pikachu");
  });

  test("verifies Charmander evolution chain details", async ({ request }) => {
    const response = await request.get("/api/pokemon/evolution?name=charmander");
    expect(response.ok()).toBeTruthy();

    const json = await response.json();
    expect(json.evolution_chain.length).toBe(3);

    // Verify Charmander
    const charmander = json.evolution_chain[0];
    expect(charmander.name).toBe("charmander");
    expect(charmander.id).toBe(4);
    expect(charmander.stage).toBe(1);

    // Verify Charmeleon
    const charmeleon = json.evolution_chain[1];
    expect(charmeleon.name).toBe("charmeleon");
    expect(charmeleon.id).toBe(5);
    expect(charmeleon.stage).toBe(2);

    // Verify Charizard
    const charizard = json.evolution_chain[2];
    expect(charizard.name).toBe("charizard");
    expect(charizard.id).toBe(6);
    expect(charizard.stage).toBe(3);
  });
});
