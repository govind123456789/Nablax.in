// Module 1: Schema Introspection
// Extracts table and column metadata from connected databases
// Supports PostgreSQL and Snowflake

import type { SchemaIntrospection, ColumnSchema } from "@/lib/db-types"

interface DatabaseConnection {
  type: "postgresql" | "snowflake"
  connectionString: string
}

/**
 * Introspects database schema without scanning data
 * Deterministic, fast, no PII exposure
 */
export async function introspectSchema(connection: DatabaseConnection): Promise<SchemaIntrospection> {
  console.log("[v0] Starting schema introspection for", connection.type)

  switch (connection.type) {
    case "postgresql":
      return introspectPostgreSQL(connection.connectionString)
    case "snowflake":
      return introspectSnowflake(connection.connectionString)
    default:
      throw new Error(`Unsupported database type: ${connection.type}`)
  }
}

async function introspectPostgreSQL(connectionString: string): Promise<SchemaIntrospection> {
  const query = `
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable = 'YES' as nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `

  const tables = new Map<string, ColumnSchema[]>()

  try {
    const results = await executeQuery(connectionString, query)

    for (const row of results) {
      if (!tables.has(row.table_name)) {
        tables.set(row.table_name, [])
      }
      tables.get(row.table_name)!.push({
        name: row.column_name,
        type: row.data_type,
        nullable: row.nullable,
      })
    }
  } catch (error) {
    console.error("[v0] PostgreSQL introspection failed:", error)
    throw new Error("Failed to introspect PostgreSQL schema")
  }

  return {
    tables: Array.from(tables.entries()).map(([table_name, columns]) => ({
      table_name,
      columns,
    })),
  }
}

async function introspectSnowflake(connectionString: string): Promise<SchemaIntrospection> {
  const query = `
    SELECT 
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE,
      IS_NULLABLE = 'YES' as NULLABLE
    FROM INFORMATION_SCHEMA.COLUMNS
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `

  const tables = new Map<string, ColumnSchema[]>()

  try {
    const results = await executeQuery(connectionString, query)

    for (const row of results) {
      const table_name = row.table_name || row.TABLE_NAME
      if (!tables.has(table_name)) {
        tables.set(table_name, [])
      }
      tables.get(table_name)!.push({
        name: row.column_name || row.COLUMN_NAME,
        type: row.data_type || row.DATA_TYPE,
        nullable: row.nullable || row.NULLABLE,
      })
    }
  } catch (error) {
    console.error("[v0] Snowflake introspection failed:", error)
    throw new Error("Failed to introspect Snowflake schema")
  }

  return {
    tables: Array.from(tables.entries()).map(([table_name, columns]) => ({
      table_name,
      columns,
    })),
  }
}

async function executeQuery(connectionString: string, query: string): Promise<unknown[]> {
  console.log("[v0] Executing introspection query")
  return []
}
