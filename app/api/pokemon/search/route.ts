import { NextRequest } from "next/server";
import { PokemonService } from "../../../../services/pokemon.service";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
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
        error: "Failed to fetch Pokemon list",
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
