import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import { PokemonCard } from "../../components/PokemonCard";

const mockPokemonData = {
  id: 25,
  name: "pikachu",
  types: [
    {
      slot: 1,
      type: {
        name: "electric",
        url: "https://pokeapi.co/api/v2/type/13/",
      },
    },
  ],
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
    {
      base_stat: 35,
      stat: {
        name: "hp",
      },
    },
    {
      base_stat: 55,
      stat: {
        name: "attack",
      },
    },
  ],
  height: 4,
  weight: 60,
};

describe("PokemonCard", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("displays loading state initially", async () => {
    // Create a promise that won't resolve immediately
    // let resolvePromise: (value: unknown) => void;
    // const promise = new Promise((resolve) => {
    //   resolvePromise = resolve;
    // });

    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {})
    );

    await act(async () => {
      render(<PokemonCard pokemonName="pikachu" />);
    });

    expect(screen.getByText("Loading Pokémon data...")).toBeInTheDocument();
  });

  it("displays pokemon data when fetch is successful", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonData,
    });

    await act(async () => {
      render(<PokemonCard pokemonName="pikachu" />);
    });

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText("pikachu #025")).toBeInTheDocument();
      });
    });

    await act(async () => {
      expect(screen.getByTestId("pokemon-types")).toBeInTheDocument();
      expect(screen.getByText("electric")).toBeInTheDocument();
      expect(screen.getByText("35")).toBeInTheDocument(); // HP stat
      expect(screen.getByText("55")).toBeInTheDocument(); // Attack stat
      expect(screen.getByText("0.4m")).toBeInTheDocument(); // Height
      expect(screen.getByText("6kg")).toBeInTheDocument(); // Weight
    });
  });

  it("displays error message when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    await act(async () => {
      render(<PokemonCard pokemonName="invalid-pokemon" />);
    });

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText("Pokemon not found")).toBeInTheDocument();
      });
    });
  });
});
