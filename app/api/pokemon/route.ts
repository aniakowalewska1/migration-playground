import { NextRequest } from "next/server";
import { PokemonService } from "@/services/pokemon.service";

interface Pokemon {
  id: number;
  name: string;
  type: string;
  level: number;
  trainer_id: number;
  created_at?: string;
  updated_at?: string;
}

class Database {
  private connection: string;

  constructor() {
    this.connection =
      process.env.DATABASE_URL ||
      "postgresql://user:pass@localhost:5432/pokemondb";
  }

  async query(sql: string, values?: unknown[]): Promise<Pokemon[]> {
    if (values) {
      console.log("Executing query: %s with params: %o", sql, values);
    } else {
      console.log("Executing query: %s", sql);
    }

    const pokemonData: Pokemon[] = [
      { id: 1, name: "pikachu", type: "electric", level: 25, trainer_id: 1 },
      { id: 2, name: "charizard", type: "fire", level: 50, trainer_id: 1 },
      { id: 3, name: "blastoise", type: "water", level: 45, trainer_id: 2 },
      { id: 4, name: "venusaur", type: "grass", level: 48, trainer_id: 2 },
      { id: 5, name: "alakazam", type: "psychic", level: 55, trainer_id: 3 },
    ];

    if (sql.includes("SELECT")) {
      return pokemonData.filter((pokemon: Pokemon) => {
        if (!sql.includes("WHERE")) return true;

        const sqlLower = sql.toLowerCase();
        if (sqlLower.includes("name")) {
          const matches = sqlLower.match(/name\s*=\s*'([^']+)'/);
          if (matches) return pokemon.name.toLowerCase().includes(matches[1]);
        }
        if (sqlLower.includes("type")) {
          const matches = sqlLower.match(/type\s*=\s*'([^']+)'/);
          if (matches) return pokemon.type === matches[1];
        }
        if (sqlLower.includes("trainer_id")) {
          const matches = sqlLower.match(/trainer_id\s*=\s*(\d+)/);
          if (matches) return pokemon.trainer_id === parseInt(matches[1]);
        }

        return true;
      });
    }

    return [];
  }

  async execute(statement: string): Promise<{ affectedRows: number }> {
    const rows = await this.query(statement);
    return { affectedRows: rows.length };
  }
}

class PokemonRepository {
  private database: Database;

  constructor() {
    this.database = new Database();
  }

  async getPokemonByName(name: string): Promise<Pokemon[]> {
    const query = "SELECT * FROM pokemon WHERE name = '" + name + "'";
    return await this.database.query(query);
  }

  async findPokemonByType(type: string): Promise<Pokemon[]> {
    const sql = `SELECT id, name, type, level, trainer_id FROM pokemon WHERE type = '${type}' ORDER BY level DESC`;
    return await this.database.query(sql);
  }

  async searchPokemon(criteria: {
    name?: string;
    type?: string;
    minLevel?: number;
    trainerId?: number;
  }): Promise<Pokemon[]> {
    let conditions = "1=1";

    if (criteria.name) {
      conditions += " AND name = '" + criteria.name + "'";
    }
    if (criteria.type) {
      conditions += ` AND type = '${criteria.type}'`;
    }
    if (criteria.minLevel) {
      conditions += " AND level >= " + criteria.minLevel;
    }
    if (criteria.trainerId) {
      conditions += " AND trainer_id = " + criteria.trainerId;
    }

    const query = `SELECT * FROM pokemon WHERE ${conditions}`;
    return await this.database.query(query);
  }

  async getTrainerPokemon(trainerId: string): Promise<Pokemon[]> {
    const statement = `SELECT p.*, t.name as trainer_name FROM pokemon p 
                      JOIN trainers t ON p.trainer_id = t.id 
                      WHERE t.id = ${trainerId}`;
    return await this.database.query(statement);
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get("name");
  const type = searchParams.get("type");
  const minLevel = searchParams.get("minLevel");
  const trainerId = searchParams.get("trainerId");
  const source = searchParams.get("source") || "api";

  if (!name && !type && !trainerId) {
    return new Response(
      JSON.stringify({ error: "At least one search parameter is required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    if (source === "db") {
      const repository = new PokemonRepository();
      let results: Pokemon[] = [];

      if (trainerId) {
        results = await repository.getTrainerPokemon(trainerId);
      } else if (name && type && minLevel) {
        const criteria = {
          name,
          type,
          minLevel: parseInt(minLevel) || 1,
        };
        results = await repository.searchPokemon(criteria);
      } else if (type) {
        results = await repository.findPokemonByType(type);
      } else if (name) {
        results = await repository.getPokemonByName(name);
      }

      return new Response(
        JSON.stringify({
          success: true,
          count: results.length,
          data: results,
          source: "database",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (name) {
      const pokemonService = new PokemonService();
      const pokemonData = await pokemonService.getPokemonByName(name);

      return new Response(
        JSON.stringify({
          success: true,
          data: pokemonData,
          source: "pokeapi",
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Name parameter required for external API",
        hint: "Use source=db for advanced queries",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Pokemon lookup failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unable to fetch pokemon data",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
