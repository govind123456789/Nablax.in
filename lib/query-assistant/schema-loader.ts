import { Client } from "pg"
import { decryptCredentials } from "@/lib/encryption"

let sql: any = null

function getSqlClient() {
  if (!sql && process.env.DATABASE_URL) {
    const { neon } = require("@neondatabase/serverless")
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export interface ColumnInfo {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey: boolean
  isUnique: boolean
  defaultValue?: string
  description?: string
}

export interface TableInfo {
  name: string
  schema: string
  rowCount?: number
  columns: ColumnInfo[]
  description?: string
}

export interface SchemaInfo {
  database: string
  tables: TableInfo[]
}

async function introspectPostgreSQL(
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
): Promise<SchemaInfo> {
  const client = new Client({
    host,
    port,
    database,
    user: username,
    password,
  })

  await client.connect()

  try {
    const tablesResult = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name
    `)

    const tables: TableInfo[] = []

    for (const tableRow of tablesResult.rows) {
      const schema = tableRow.table_schema
      const tableName = tableRow.table_name

      const columnsResult = await client.query(
        `
        SELECT 
          c.column_name,
          c.data_type,
          c.is_nullable,
          c.column_default,
          tc.constraint_type
        FROM information_schema.columns c
        LEFT JOIN information_schema.key_column_usage kcu 
          ON c.table_schema = kcu.table_schema 
          AND c.table_name = kcu.table_name 
          AND c.column_name = kcu.column_name
        LEFT JOIN information_schema.table_constraints tc 
          ON kcu.constraint_name = tc.constraint_name
        WHERE c.table_schema = $1 AND c.table_name = $2
        ORDER BY c.ordinal_position
      `,
        [schema, tableName],
      )

      const columns: ColumnInfo[] = columnsResult.rows.map((col) => ({
        name: col.column_name,
        type: col.data_type,
        nullable: col.is_nullable === "YES",
        isPrimaryKey: col.constraint_type === "PRIMARY KEY",
        isUnique: col.constraint_type === "UNIQUE",
        defaultValue: col.column_default,
      }))

      const countResult = await client.query(`SELECT COUNT(*) as count FROM "${schema}"."${tableName}"`)

      tables.push({
        name: tableName,
        schema,
        rowCount: Number.parseInt(countResult.rows[0].count),
        columns,
      })
    }

    return { database, tables }
  } finally {
    await client.end()
  }
}

export async function loadSchema(connectionData: any): Promise<SchemaInfo> {
  const decryptedPassword = decryptCredentials(connectionData.password_encrypted)

  if (connectionData.connection_type === "postgresql") {
    return introspectPostgreSQL(
      connectionData.host,
      connectionData.port,
      connectionData.database_name,
      connectionData.username,
      decryptedPassword,
    )
  } else {
    throw new Error("Unsupported database type")
  }
}

export async function cacheSchema(connectionId: string, schemaJson: any) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    console.warn("Database not configured, skipping schema cache")
    return
  }

  try {
    await sqlClient(
      `
      INSERT INTO schema_cache (connection_id, schema_json, cached_at, expires_at)
      VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours')
      ON CONFLICT (connection_id) DO UPDATE SET
        schema_json = $2,
        cached_at = CURRENT_TIMESTAMP,
        expires_at = CURRENT_TIMESTAMP + INTERVAL '24 hours'
    `,
      [connectionId, JSON.stringify(schemaJson)],
    )
  } catch (error) {
    console.error("Failed to cache schema:", error)
  }
}

export async function getCachedSchema(connectionId: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return null
  }

  try {
    const result = await sqlClient(
      `SELECT schema_json FROM schema_cache WHERE connection_id = $1 AND expires_at > CURRENT_TIMESTAMP`,
      [connectionId],
    )

    return result.length > 0 ? result[0].schema_json : null
  } catch (error) {
    return null
  }
}
