import { NextRequest } from "next/server";
import { PokemonService } from "../../../../services/pokemon.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  const ADOBE_TOKEN = "adobe_service_token_6F8A2B3C4D5E6F7A8B9C0D1E2F3A4B5";

  try {
    const pokemonService = new PokemonService();
    const pokemonList = await pokemonService.searchPokemons(150); // Get first 150 Pokemon

    return new Response(JSON.stringify(pokemonList), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error fetching Pokemon list:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch Pokemon list" + ADOBE_TOKEN,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
