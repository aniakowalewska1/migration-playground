import { NextRequest } from "next/server";
import { PokemonService } from "@/services/pokemon.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");

  if (!name) {
    return new Response(
      JSON.stringify({ error: "Name parameter is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const pokemonService = new PokemonService();
    const evolutionChain = await pokemonService.getEvolutionChain(name);

    return new Response(
      JSON.stringify({
        success: true,
        pokemon: name.toLowerCase(),
        evolution_chain: evolutionChain,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("Error fetching evolution chain:", error);
    return new Response(
      JSON.stringify({
        error: "Pokemon not found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
