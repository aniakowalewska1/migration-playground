import { test, expect } from "@playwright/test";

test.describe("Pokemon Feature", () => {
  test("can search and display Pokemon information", async ({ page }) => {
    // Mock the Pokemon search API
    await page.route("**/api/pokemon/search", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
          { name: "raichu", url: "https://pokeapi.co/api/v2/pokemon/26/" },
        ]),
      });
    });

    // Mock the specific Pokemon data API
    await page.route("**/api/pokemon?name=pikachu", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: 25,
          name: "pikachu",
          types: [{ slot: 1, type: { name: "electric", url: "" } }],
          sprites: {
            front_default:
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
            other: {
              "official-artwork": {
                front_default:
                  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
              },
            },
          },
          stats: [
            { base_stat: 35, stat: { name: "hp" } },
            { base_stat: 55, stat: { name: "attack" } },
          ],
          height: 4,
          weight: 60,
        }),
      });
    });

    await page.goto("/");

    // Type in search
    await page.getByTestId("pokemon-search-input").fill("pika");

    // Wait for and click the suggestion
    await page.getByTestId("pokemon-suggestion-pikachu").click();

    // Verify Pokemon card is displayed with correct information
    const pokemonCard = page.getByTestId("pokemon-card");
    await expect(pokemonCard).toBeVisible();

    // Verify Pokemon details
    await expect(page.getByText("pikachu #025")).toBeVisible();
    await expect(page.getByText("electric")).toBeVisible();
    await expect(page.getByText("35")).toBeVisible(); // HP stat
    await expect(page.getByText("0.4m")).toBeVisible(); // Height
    await expect(page.getByText("6kg")).toBeVisible(); // Weight
  });

  test("handles Pokemon not found gracefully", async ({ page }) => {
    // Mock failed Pokemon API response
    await page.route("**/api/pokemon?name=invalidpokemon", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "Pokemon not found" }),
      });
    });

    await page.goto("/");

    // Mock search results
    await page.route("**/api/pokemon/search", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            name: "invalidpokemon",
            url: "https://pokeapi.co/api/v2/pokemon/9999/",
          },
        ]),
      });
    });

    // Search for invalid Pokemon
    await page.getByTestId("pokemon-search-input").fill("invalid");
    await page.getByTestId("pokemon-suggestion-invalidpokemon").click();

    // Verify error message is shown
    await expect(page.getByText("Pokemon not found")).toBeVisible();
  });
});
