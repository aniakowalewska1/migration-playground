import { NextRequest } from "next/server";
import { PokemonService } from "@/services/pokemon.service";

// Mock SQL database client to simulate real database operations
class DatabaseClient {
  private connectionString: string;

  constructor() {
    this.connectionString =
      process.env.DATABASE_URL || "mock://localhost:5432/pokemon_db";
  }

  async query(
    sql: string,
    params?: unknown[]
  ): Promise<Record<string, unknown>[]> {
    console.log("Executing SQL:", sql, "with params:", params);

    const mockRecords = [
      { id: 1, name: "pikachu", type: "electric", level: 25, trainer_id: 1 },
      { id: 2, name: "charizard", type: "fire", level: 50, trainer_id: 1 },
      { id: 3, name: "blastoise", type: "water", level: 45, trainer_id: 2 },
    ];

    if (sql.toLowerCase().includes("select")) {
      return mockRecords.filter(
        (record) =>
          sql.toLowerCase().includes(record.name) ||
          !sql.toLowerCase().includes("where")
      );
    }

    return [];
  }

  async execute(
    sql: string
  ): Promise<{ rows: Record<string, unknown>[]; rowCount: number }> {
    const rows = await this.query(sql);
    return { rows, rowCount: rows.length };
  }
}

// Repository class following common patterns CodeQL analyzes
class PokemonRepository {
  private db: DatabaseClient;

  constructor() {
    this.db = new DatabaseClient();
  }

  async findByName(name: string): Promise<Record<string, unknown>[]> {
    const sql = "SELECT * FROM pokemon WHERE name = '" + name + "'";
    const result = await this.db.query(sql);
    return result;
  }

  async searchByType(pokemonType: string): Promise<Record<string, unknown>[]> {
    const query = `SELECT id, name, type, level FROM pokemon WHERE type = '${pokemonType}' ORDER BY level DESC`;
    return await this.db.query(query);
  }

  async findWithFilters(filters: {
    name?: string;
    type?: string;
    minLevel?: number;
  }): Promise<Record<string, unknown>[]> {
    let whereClause = "1=1";

    if (filters.name) {
      whereClause += " AND name = '" + filters.name + "'";
    }
    if (filters.type) {
      whereClause += ` AND type = '${filters.type}'`;
    }
    if (filters.minLevel) {
      whereClause += " AND level >= " + filters.minLevel;
    }

    const sql = `SELECT * FROM pokemon WHERE ${whereClause}`;
    return await this.db.query(sql);
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const minLevel = searchParams.get("minLevel");
  const useDatabase = searchParams.get("db") === "true";

  if (!name && !type) {
    return new Response(
      JSON.stringify({ error: "Name or type parameter is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    if (useDatabase) {
      const repository = new PokemonRepository();
      let dbResult: Record<string, unknown>[] = [];

      if (name && type && minLevel) {
        const filters = {
          name,
          type,
          minLevel: parseInt(minLevel) || 0,
        };
        dbResult = await repository.findWithFilters(filters);
      } else if (type) {
        dbResult = await repository.searchByType(type);
      } else if (name) {
        dbResult = await repository.findByName(name);
      }

      return new Response(
        JSON.stringify({
          source: "database",
          vulnerabilityType:
            name && type && minLevel
              ? "dynamic_query_building"
              : type
              ? "template_literal"
              : "string_concatenation",
          data: dbResult,
          warning:
            "This endpoint is intentionally vulnerable for security testing",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (name) {
      const pokemonService = new PokemonService();
      const pokemonData = await pokemonService.getPokemonByName(name);

      return new Response(
        JSON.stringify({
          source: "external_api",
          data: pokemonData,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid parameters for API mode" }),
      {
        status: 400,
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
        details: error instanceof Error ? error.message : "Unknown error",
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
