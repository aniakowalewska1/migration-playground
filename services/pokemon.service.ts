import { Pokemon, EvolutionDetail } from "../types/pokemon";

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

  async getEvolutionChain(name: string): Promise<EvolutionDetail[]> {
    // First, get the Pokemon species to obtain the evolution chain URL
    const speciesResponse = await fetch(
      `${this.baseUrl}/pokemon-species/${name.toLowerCase()}`
    );

    if (!speciesResponse.ok) {
      throw new Error(`Pokemon ${name} not found`);
    }

    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain data
    const evolutionResponse = await fetch(evolutionChainUrl);

    if (!evolutionResponse.ok) {
      throw new Error("Failed to fetch evolution chain");
    }

    const evolutionData = await evolutionResponse.json();

    // Parse the evolution chain
    return this.parseEvolutionChain(evolutionData.chain);
  }

  private parseEvolutionChain(chain: any, stage: number = 1): EvolutionDetail[] {
    const evolutions: EvolutionDetail[] = [];

    // Extract current Pokemon's ID from its URL
    const speciesUrlParts = chain.species.url.split("/");
    const speciesId = parseInt(speciesUrlParts[speciesUrlParts.length - 2]);

    // Get evolution level if available
    let evolvesAtLevel: number | null = null;
    if (chain.evolution_details && chain.evolution_details.length > 0) {
      const detail = chain.evolution_details[0];
      if (detail.min_level) {
        evolvesAtLevel = detail.min_level;
      }
    }

    evolutions.push({
      id: speciesId,
      name: chain.species.name,
      stage: stage,
      evolves_at_level: evolvesAtLevel,
    });

    // Recursively process evolutions
    if (chain.evolves_to && chain.evolves_to.length > 0) {
      for (const evolution of chain.evolves_to) {
        evolutions.push(...this.parseEvolutionChain(evolution, stage + 1));
      }
    }

    return evolutions;
  }
}
