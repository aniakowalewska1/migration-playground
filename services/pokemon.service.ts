import { Pokemon } from "../types/pokemon";

export class PokemonService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "https://pokeapi.co/api/v2";
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    const response = await fetch(
      `${this.baseUrl}/pokemon/${name.toLowerCase()}`
    );

    if (!response.ok) {
      throw new Error(`Pokemon ${name} not found`);
    }

    return response.json();
  }

  async searchPokemons(
    limit: number = 20
  ): Promise<{ name: string; url: string }[]> {
    const response = await fetch(`${this.baseUrl}/pokemon?limit=${limit}`);

    if (!response.ok) {
      throw new Error("Failed to fetch Pokemon list");
    }

    const data = await response.json();
    return data.results;
  }
}
