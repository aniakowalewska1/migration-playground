"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pokemon, PokemonCardProps } from "../types/pokemon";

const typeColors: { [key: string]: string } = {
  normal: "bg-gray-400",
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  ice: "bg-blue-200",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-yellow-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-green-600",
  rock: "bg-yellow-800",
  ghost: "bg-purple-700",
  dark: "bg-gray-800",
  dragon: "bg-indigo-700",
  steel: "bg-gray-500",
  fairy: "bg-pink-300",
};

export const PokemonCard = ({
  pokemonName,
  className = "",
}: PokemonCardProps) => {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          `/api/pokemon?name=${encodeURIComponent(pokemonName)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pokemon data");
        }
        const data = await response.json();
        setPokemon(data);
        setError("");
      } catch (err) {
        console.log("Error fetching Pokemon:", err);
        setError("Pokemon not found");
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonName]);

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4">
        Loading Pokémon data...
      </div>
    );
  }

  if (error || !pokemon) {
    return <div className="text-red-500 p-4 rounded-lg bg-red-50">{error}</div>;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-lg p-6 ${className}`}
      data-testid="pokemon-card"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 capitalize">
          {pokemon.name} #{pokemon.id.toString().padStart(3, "0")}
        </h2>
        <div className="relative w-48 h-48 mb-4">
          <Image
            src={
              pokemon.sprites.other["official-artwork"].front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex gap-2 mb-4" data-testid="pokemon-types">
          {pokemon.types.map(({ type }) => (
            <span
              key={type.name}
              className={`${
                typeColors[type.name] || "bg-gray-400"
              } text-white px-3 py-1 rounded-full text-sm capitalize`}
            >
              {type.name}
            </span>
          ))}
        </div>
        <div className="w-full grid grid-cols-2 gap-4">
          {pokemon.stats.map(({ base_stat, stat }) => (
            <div key={stat.name} className="text-center">
              <p className="text-gray-600 capitalize">
                {stat.name.replace("-", " ")}
              </p>
              <p className="font-bold">{base_stat}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 w-full grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Height</p>
            <p className="font-bold">{pokemon.height / 10}m</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Weight</p>
            <p className="font-bold">{pokemon.weight / 10}kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};
