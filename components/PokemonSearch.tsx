"use client";

import { useState, useEffect } from "react";

interface PokemonSearchProps {
  onSelect: (pokemonName: string) => void;
  className?: string;
}

export const PokemonSearch = ({
  onSelect,
  className = "",
}: PokemonSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<
    { name: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchTerm) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/pokemon/search");
        if (!response.ok) throw new Error("Failed to fetch suggestions");

        const results = await response.json();
        setSuggestions(
          results.filter((pokemon: { name: string }) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search Pokémon..."
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        data-testid="pokemon-search-input"
      />
      {loading && (
        <div className="absolute right-2 top-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((pokemon) => (
            <li
              key={pokemon.name}
              className="p-2 hover:bg-gray-100 cursor-pointer capitalize"
              onClick={() => {
                onSelect(pokemon.name);
                setSearchTerm("");
                setSuggestions([]);
              }}
              data-testid={`pokemon-suggestion-${pokemon.name}`}
            >
              {pokemon.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
