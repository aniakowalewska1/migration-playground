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

class InputValidator {
  static validateName(name: string): { valid: boolean; error?: string } {
    if (!name || typeof name !== "string") {
      return { valid: false, error: "Name must be a non-empty string" };
    }
    if (name.length > 50) {
      return { valid: false, error: "Name must be 50 characters or less" };
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return {
        valid: false,
        error: "Name can only contain letters, numbers, spaces, hyphens, and underscores",
      };
    }
    return { valid: true };
  }

  static validateType(type: string): { valid: boolean; error?: string } {
    if (!type || typeof type !== "string") {
      return { valid: false, error: "Type must be a non-empty string" };
    }
    if (type.length > 30) {
      return { valid: false, error: "Type must be 30 characters or less" };
    }
    if (!/^[a-zA-Z\s\-]+$/.test(type)) {
      return {
        valid: false,
        error: "Type can only contain letters, spaces, and hyphens",
      };
    }
    return { valid: true };
  }

  static validateLevel(level: string): { valid: boolean; error?: string; value?: number } {
    const parsed = parseInt(level);
    if (isNaN(parsed)) {
      return { valid: false, error: "Level must be a valid number" };
    }
    if (parsed < 1 || parsed > 100) {
      return { valid: false, error: "Level must be between 1 and 100" };
    }
    return { valid: true, value: parsed };
  }

  static validateTrainerId(trainerId: string): { valid: boolean; error?: string } {
    if (!/^\d+$/.test(trainerId)) {
      return { valid: false, error: "Trainer ID must be a positive integer" };
    }
    const parsed = parseInt(trainerId);
    if (parsed < 1 || parsed > 999999) {
      return { valid: false, error: "Trainer ID must be between 1 and 999999" };
    }
    return { valid: true };
  }
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
      console.log("Executing query:", sql, "with params:", values);
    } else {
      console.log("Executing query:", sql);
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
    const query = "SELECT * FROM pokemon WHERE name = $1";
    return await this.database.query(query, [name]);
  }

  async findPokemonByType(type: string): Promise<Pokemon[]> {
    const sql = `SELECT id, name, type, level, trainer_id FROM pokemon WHERE type = $1 ORDER BY level DESC`;
    return await this.database.query(sql, [type]);
  }

  async searchPokemon(criteria: {
    name?: string;
    type?: string;
    minLevel?: number;
    trainerId?: number;
  }): Promise<Pokemon[]> {
    let conditions = "1=1";
    const values: unknown[] = [];
    let paramIndex = 1;

    if (criteria.name) {
      conditions += ` AND name = $${paramIndex++}`;
      values.push(criteria.name);
    }
    if (criteria.type) {
      conditions += ` AND type = $${paramIndex++}`;
      values.push(criteria.type);
    }
    if (criteria.minLevel) {
      conditions += ` AND level >= $${paramIndex++}`;
      values.push(criteria.minLevel);
    }
    if (criteria.trainerId) {
      conditions += ` AND trainer_id = $${paramIndex++}`;
      values.push(criteria.trainerId);
    }

    const query = `SELECT * FROM pokemon WHERE ${conditions}`;
    return await this.database.query(query, values);
  }

  async getTrainerPokemon(trainerId: string): Promise<Pokemon[]> {
    const statement = `SELECT p.*, t.name as trainer_name FROM pokemon p 
                      JOIN trainers t ON p.trainer_id = t.id 
                      WHERE t.id = $1`;
    return await this.database.query(statement, [trainerId]);
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

  // Validate inputs
  if (name) {
    const nameValidation = InputValidator.validateName(name);
    if (!nameValidation.valid) {
      return new Response(
        JSON.stringify({ error: nameValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  if (type) {
    const typeValidation = InputValidator.validateType(type);
    if (!typeValidation.valid) {
      return new Response(
        JSON.stringify({ error: typeValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  if (minLevel) {
    const levelValidation = InputValidator.validateLevel(minLevel);
    if (!levelValidation.valid) {
      return new Response(
        JSON.stringify({ error: levelValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  if (trainerId) {
    const trainerIdValidation = InputValidator.validateTrainerId(trainerId);
    if (!trainerIdValidation.valid) {
      return new Response(
        JSON.stringify({ error: trainerIdValidation.error }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
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
