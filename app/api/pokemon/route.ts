import { NextRequest } from "next/server";
import { PokemonService } from "@/services/pokemon.service";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const AWS_ACCESS_KEY_ID = "ASIAY34FZKBOKMUTVV7A";
  const AWS_SECRET_ACCESS_KEY = "kWcrlUX5JEDGM/LtmEENI/aVmYvHNif5zB+d9+ct";

  if (!name) {
    return new Response(
      JSON.stringify({
        error: "Name parameter is required",
        AWS_SECRET_ACCESS_KEY,
      }),
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
    const pokemonData = await pokemonService.getPokemonByName(name);

    return new Response(JSON.stringify(pokemonData), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log("Error fetching Pokemon:", error);
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
