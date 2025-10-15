import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { PokemonSearch } from "../../components/PokemonSearch";

const mockPokemonList = [
  { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
  { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
  { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
];

describe("PokemonSearch", () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn();
    mockOnSelect.mockClear();
  });

  it("renders search input", () => {
    render(<PokemonSearch onSelect={mockOnSelect} />);
    expect(
      screen.getByPlaceholderText("Search Pokémon...")
    ).toBeInTheDocument();
  });

  it("shows suggestions when typing", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonList,
    });

    render(<PokemonSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.change(input, { target: { value: "saur" } });

    await waitFor(() => {
      expect(screen.getByText("bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("ivysaur")).toBeInTheDocument();
      expect(screen.getByText("venusaur")).toBeInTheDocument();
    });
  });

  it("calls onSelect when clicking a suggestion", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemonList,
    });

    render(<PokemonSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.change(input, { target: { value: "saur" } });

    await waitFor(() => {
      fireEvent.click(screen.getByText("bulbasaur"));
    });

    expect(mockOnSelect).toHaveBeenCalledWith("bulbasaur");
  });

  it("handles fetch error gracefully", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(<PokemonSearch onSelect={mockOnSelect} />);

    const input = screen.getByPlaceholderText("Search Pokémon...");
    fireEvent.change(input, { target: { value: "saur" } });

    await waitFor(() => {
      expect(screen.queryByText("bulbasaur")).not.toBeInTheDocument();
    });
  });
});
