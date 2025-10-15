export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  stats: PokemonStat[];
  height: number;
  weight: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonCardProps {
  pokemonName: string;
  className?: string;
}
