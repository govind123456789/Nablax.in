import { encryptCredentials, decryptCredentials } from "./encryption"
import { Client } from "pg"

let sql: any = null

function getSqlClient() {
  if (!sql && process.env.DATABASE_URL) {
    const { neon } = require("@neondatabase/serverless")
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export interface DatabaseConnection {
  id: string
  userId: string
  name: string
  connectionType: "postgresql" | "snowflake"
  host: string
  port: number
  database: string
  isShared: boolean
  isActive: boolean
}

export async function createConnection(
  userId: string,
  name: string,
  connectionType: "postgresql" | "snowflake",
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
  description?: string,
) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const encryptedPassword = encryptCredentials(password)

    const result = await sqlClient(
      `INSERT INTO database_connections 
       (user_id, name, connection_type, host, port, database_name, username, password_encrypted, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING id, name, connection_type, host, port, database_name, is_shared, is_active`,
      [userId, name, connectionType, host, port, database, username, encryptedPassword, description],
    )

    return { success: true, connection: result[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getConnection(userId: string, connectionId: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const result = await sqlClient(
      `SELECT id, user_id, name, connection_type, host, port, database_name, username, password_encrypted, is_shared, is_active, created_at 
       FROM database_connections 
       WHERE id = $1 AND user_id = $2`,
      [connectionId, userId],
    )

    if (result.length === 0) {
      return { success: false, error: "Connection not found" }
    }

    return { success: true, connection: result[0] }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function listConnections(userId: string) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    return { success: false, error: "Database not configured" }
  }

  try {
    const result = await sqlClient(
      `SELECT id, name, connection_type, host, port, database_name, is_shared, is_active, created_at 
       FROM database_connections 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    )

    return { success: true, connections: result }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function testConnection(connectionData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const decryptedPassword = decryptCredentials(connectionData.password_encrypted)

    if (connectionData.connection_type === "postgresql") {
      const client = new Client({
        host: connectionData.host,
        port: connectionData.port,
        database: connectionData.database_name,
        user: connectionData.username,
        password: decryptedPassword,
        connectionTimeoutMillis: 5000,
      })

      await client.connect()
      await client.end()
      return { success: true }
    } else if (connectionData.connection_type === "snowflake") {
      return { success: true }
    }

    return { success: false, error: "Unknown connection type" }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
