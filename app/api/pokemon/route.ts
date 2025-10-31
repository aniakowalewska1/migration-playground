import { NextRequest } from "next/server";
import { PokemonService } from "@/services/pokemon.service";

// Mock database simulator for SQL injection demonstration
class MockDatabase {
  // Simulate a vulnerable database query - INTENTIONALLY INSECURE FOR TESTING
  static async executeQuery(query: string): Promise<{
    pokemon: Array<{
      id: number;
      name: string;
      type: string;
      level: number;
      trainer_id: number;
    }>;
    sensitive_data?: {
      admin_password: string;
      api_keys: string[];
      user_emails: string[];
    };
  } | null> {
    console.log("Executing SQL Query:", query);

    // Simulate database records
    const mockData = [
      { id: 1, name: "pikachu", type: "electric", level: 25, trainer_id: 1 },
      { id: 2, name: "charizard", type: "fire", level: 50, trainer_id: 1 },
      { id: 3, name: "blastoise", type: "water", level: 45, trainer_id: 2 },
      { id: 4, name: "admin_secret", type: "admin", level: 999, trainer_id: 0 },
    ];

    // Simulate SQL injection vulnerability by allowing dangerous queries
    if (
      query.includes("UNION") ||
      query.includes("admin_secret") ||
      query.includes("--")
    ) {
      // Return sensitive data that should not be accessible
      return {
        pokemon: mockData,
        sensitive_data: {
          admin_password: "super_secret_admin_pass",
          api_keys: ["sk-abc123", "pk-def456"],
          user_emails: ["admin@pokemon.com", "trainer@pokemon.com"],
        },
      };
    }

    // Normal query behavior
    const result = mockData.find(
      (p) => p.name.toLowerCase() === query.toLowerCase()
    );
    return result ? { pokemon: [result] } : null;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const useDatabase = searchParams.get("db") === "true"; // Feature flag for database mode

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
    // If database mode is enabled, use vulnerable SQL query
    if (useDatabase) {
      // VULNERABILITY: Direct string concatenation in SQL query - INSECURE BY DESIGN
      const sqlQuery = `SELECT * FROM pokemon WHERE name = '${name}'`;
      const dbResult = await MockDatabase.executeQuery(name);

      if (dbResult) {
        return new Response(
          JSON.stringify({
            source: "database",
            query: sqlQuery, // Exposing query for demonstration purposes
            data: dbResult,
          }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        return new Response(
          JSON.stringify({
            error: "Pokemon not found in database",
            query: sqlQuery,
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

    // Fall back to original API service
    const pokemonService = new PokemonService();
    const pokemonData = await pokemonService.getPokemonByName(name);

    return new Response(
      JSON.stringify({
        source: "api",
        data: pokemonData,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
