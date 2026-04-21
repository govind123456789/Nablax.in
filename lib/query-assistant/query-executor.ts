import { Client } from "pg"
import { decryptCredentials } from "@/lib/encryption"
import { neon } from "@neondatabase/serverless"

let sql: any = null

function getSqlClient() {
  if (!sql && process.env.DATABASE_URL) {
    sql = neon(process.env.DATABASE_URL)
  }
  return sql
}

export interface ExecutionResult {
  success: boolean
  rowCount: number
  rows: any[]
  executionTimeMs: number
  error?: string
  preview?: any[]
}

async function executePostgreSQL(
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
  query: string,
  timeoutMs = 30000,
): Promise<ExecutionResult> {
  const client = new Client({
    host,
    port,
    database,
    user: username,
    password,
    connectionTimeoutMillis: 5000,
    query_timeout: timeoutMs,
  })

  const startTime = Date.now()

  try {
    await client.connect()

    const result = await Promise.race([
      client.query(query),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Query timeout")), timeoutMs)),
    ])

    const executionTimeMs = Date.now() - startTime

    return {
      success: true,
      rowCount: result.rowCount || 0,
      rows: result.rows || [],
      executionTimeMs,
      preview: (result.rows || []).slice(0, 10),
    }
  } catch (error: any) {
    const executionTimeMs = Date.now() - startTime
    return {
      success: false,
      rowCount: 0,
      rows: [],
      executionTimeMs,
      error: error.message,
    }
  } finally {
    await client.end()
  }
}

export async function executeQuery(
  connectionData: any,
  query: string,
  connectionType: "postgresql" | "snowflake",
): Promise<ExecutionResult> {
  const decryptedPassword = decryptCredentials(connectionData.password_encrypted)

  let safeQuery = query
  if (!safeQuery.toUpperCase().includes("LIMIT")) {
    safeQuery += " LIMIT 1000"
  }

  if (connectionType === "postgresql") {
    return executePostgreSQL(
      connectionData.host,
      connectionData.port,
      connectionData.database_name,
      connectionData.username,
      decryptedPassword,
      safeQuery,
    )
  } else {
    return {
      success: false,
      rowCount: 0,
      rows: [],
      executionTimeMs: 0,
      error: "Unsupported database type",
    }
  }
}

export async function saveQueryExecution(
  userId: string,
  connectionId: string,
  question: string,
  sqlQuery: string,
  executionResult: ExecutionResult,
  llmInsights?: string,
  chartType?: string,
) {
  const sqlClient = getSqlClient()
  if (!sqlClient) {
    console.warn("Database not configured, skipping query history save")
    return
  }

  try {
    const resultPreview = executionResult.rows.slice(0, 10)

    await sqlClient(
      `
      INSERT INTO query_history 
      (user_id, connection_id, natural_language_question, generated_sql, 
       execution_status, execution_time_ms, result_row_count, result_preview, llm_insights, chart_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        userId,
        connectionId,
        question,
        sqlQuery,
        executionResult.success ? "success" : "error",
        executionResult.executionTimeMs,
        executionResult.rowCount,
        JSON.stringify(resultPreview),
        llmInsights || null,
        chartType || null,
      ],
    )
  } catch (error) {
    console.error("Failed to save query execution:", error)
  }
}
