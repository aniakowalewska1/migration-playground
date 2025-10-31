import { Pokemon, EvolutionChainMember } from "../types/pokemon";

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

  /**
   * Retrieves the evolution chain for a given Pokemon.
   * Note: For Pokemon with multiple evolution branches (e.g., Eevee),
   * only the first evolution path is returned.
   * 
   * @param name - The name of the Pokemon
   * @returns Array of evolution chain members in order from base to final form
   * @throws Error if Pokemon is not found or evolution chain cannot be fetched
   */
  async getEvolutionChain(name: string): Promise<EvolutionChainMember[]> {
    // First, get the Pokemon species to access evolution chain URL
    const pokemon = await this.getPokemonByName(name);
    const speciesResponse = await fetch(
      `${this.baseUrl}/pokemon-species/${pokemon.id}`
    );

    if (!speciesResponse.ok) {
      throw new Error(`Pokemon species ${name} not found`);
    }

    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    // Fetch the evolution chain
    const evolutionResponse = await fetch(evolutionChainUrl);

    if (!evolutionResponse.ok) {
      throw new Error("Failed to fetch evolution chain");
    }

    const evolutionData = await evolutionResponse.json();

    // Parse the evolution chain
    const chain: EvolutionChainMember[] = [];
    let currentStage = evolutionData.chain;
    let stage = 1;

    while (currentStage) {
      const speciesName = currentStage.species.name;
      const speciesUrl = currentStage.species.url;
      
      // Extract species ID from URL (e.g., "https://pokeapi.co/api/v2/pokemon-species/4/" -> 4)
      const urlParts = speciesUrl.split("/").filter((part: string) => part !== "");
      const speciesId = parseInt(urlParts[urlParts.length - 1], 10);

      // Get evolution level if available
      let evolvesAtLevel: number | null = null;
      if (
        currentStage.evolution_details &&
        currentStage.evolution_details.length > 0
      ) {
        evolvesAtLevel = currentStage.evolution_details[0].min_level;
      }

      chain.push({
        id: speciesId,
        name: speciesName,
        stage: stage,
        evolves_at_level: evolvesAtLevel,
      });

      // Move to next evolution (if there are multiple branches, take the first one)
      if (currentStage.evolves_to && currentStage.evolves_to.length > 0) {
        currentStage = currentStage.evolves_to[0];
        stage++;
      } else {
        currentStage = null;
      }
    }

    return chain;
  }
}
