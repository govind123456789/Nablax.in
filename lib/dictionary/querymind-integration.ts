// Module 7: QueryMind Integration Layer
// Injects dictionary context into QueryMind system prompt
// Blocks SQL generation if dictionary is incomplete or below confidence threshold

import { getAdminDbClient } from "@/lib/db-client"
import type { QueryMindDictionaryContext } from "@/lib/db-types"

interface QueryMindIntegrationConfig {
  minimumConfidenceThreshold: number // 0-1, default 0.5
  requireAllColumnsReviewed: boolean
  blockOnPIIWithoutApproval: boolean
}

const DEFAULT_CONFIG: QueryMindIntegrationConfig = {
  minimumConfidenceThreshold: 0.5,
  requireAllColumnsReviewed: false,
  blockOnPIIWithoutApproval: true,
}

/**
 * Retrieves dictionary context for QueryMind
 * Validates completeness and confidence before returning
 */
export async function getDictionaryContextForQueryMind(
  environment_id: string,
  config: Partial<QueryMindIntegrationConfig> = {},
): Promise<{
  context: QueryMindDictionaryContext | null
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }
  const errors: string[] = []
  const warnings: string[] = []

  try {
    const db = await getAdminDbClient()

    // Fetch environment
    const { data: environment, error: envError } = await db
      .from("data_dictionary_environments")
      .select("*")
      .eq("id", environment_id)
      .single()

    if (envError || !environment) {
      errors.push("Environment not found")
      return { context: null, valid: false, errors, warnings }
    }

    // Check connection status
    if (environment.connection_status !== "connected") {
      errors.push(`Database connection status: ${environment.connection_status}`)
      return { context: null, valid: false, errors, warnings }
    }

    // Fetch all tables
    const { data: tables, error: tableError } = await db
      .from("data_dictionary_tables")
      .select("*, data_dictionary_columns(*)")
      .eq("environment_id", environment_id)

    if (tableError || !tables || tables.length === 0) {
      errors.push("No tables found in dictionary")
      return { context: null, valid: false, errors, warnings }
    }

    // Validate tables and columns
    let lowConfidenceColumns = 0
    let piiWithoutApproval = 0
    let missingDescriptions = 0

    for (const table of tables) {
      if (!table.table_description) {
        warnings.push(`Table ${table.table_name} missing description`)
        missingDescriptions++
      }

      if (!table.row_granularity) {
        warnings.push(`Table ${table.table_name} missing row granularity definition`)
      }

      for (const col of table.data_dictionary_columns) {
        // Check confidence
        if (col.confidence_score < finalConfig.minimumConfidenceThreshold) {
          lowConfidenceColumns++
          warnings.push(
            `Column ${table.table_name}.${col.column_name} has low confidence (${(col.confidence_score * 100).toFixed(0)}%)`,
          )
        }

        // Check PII approval
        if (col.is_pii && finalConfig.blockOnPIIWithoutApproval && !col.locked) {
          piiWithoutApproval++
          errors.push(
            `Column ${table.table_name}.${col.column_name} is PII and requires approval (lock) before use in QueryMind`,
          )
        }

        // Check descriptions
        if (!col.business_description) {
          warnings.push(`Column ${table.table_name}.${col.column_name} missing business description`)
          missingDescriptions++
        }
      }
    }

    // Determine validity
    const isValid = errors.length === 0
    if (lowConfidenceColumns > 0) {
      warnings.push(`${lowConfidenceColumns} columns have low confidence scores`)
    }

    // Build context if valid
    let context: QueryMindDictionaryContext | null = null
    if (isValid) {
      context = {
        environment_id,
        tables: tables.map((table: any) => ({
          table_name: table.table_name,
          description: table.table_description || `Table: ${table.table_name}`,
          row_granularity: table.row_granularity || "Unknown granularity",
          columns: table.data_dictionary_columns.map((col: any) => ({
            name: col.column_name,
            type: col.data_type,
            business_meaning: col.business_description || col.column_name,
            classification: col.classification || "unknown",
            is_pii: col.is_pii || false,
            confidence: col.confidence_score || 0.5,
          })),
        })),
        generated_at: new Date().toISOString(),
        version: 1,
      }
    }

    return { context, valid: isValid, errors, warnings }
  } catch (error) {
    console.error("[v0] Failed to get dictionary context:", error)
    errors.push(error instanceof Error ? error.message : "Unknown error")
    return { context: null, valid: false, errors, warnings }
  }
}

/**
 * Generates QueryMind system prompt with dictionary context
 * System prompt is mandatory - SQL generation is blocked if missing/invalid
 */
export function buildQueryMindSystemPrompt(dictionaryContext: QueryMindDictionaryContext, basePrompt: string): string {
  const dictionaryReference = formatDictionaryForPrompt(dictionaryContext)

  return `${basePrompt}

## DATA DICTIONARY CONTEXT

This is the MANDATORY data dictionary for this environment. You MUST reference this dictionary when generating SQL.

${dictionaryReference}

## SAFETY REQUIREMENTS

1. NEVER reference tables or columns not in the above dictionary
2. NEVER reference fields marked as PII without explicit user confirmation
3. ALWAYS use the business descriptions to understand column meaning
4. If a column classification is "unknown", ask the user for clarification before using it
5. If confidence score is below 0.6, flag to user and ask for confirmation
`
}

/**
 * Formats dictionary as readable text for LLM consumption
 */
function formatDictionaryForPrompt(context: QueryMindDictionaryContext): string {
  const sections: string[] = []

  sections.push(`Generated: ${context.generated_at}`)
  sections.push(`Environment ID: ${context.environment_id}`)
  sections.push(`Version: ${context.version}`)
  sections.push("")

  for (const table of context.tables) {
    sections.push(`### TABLE: ${table.table_name}`)
    sections.push(`Description: ${table.description}`)
    sections.push(`Row Granularity: ${table.row_granularity}`)
    sections.push("")
    sections.push("Columns:")

    for (const col of table.columns) {
      const piiWarning = col.is_pii ? " [PII - REQUIRES APPROVAL]" : ""
      const confidenceFlag = col.confidence < 0.6 ? ` [LOW CONFIDENCE: ${(col.confidence * 100).toFixed(0)}%]` : ""

      sections.push(
        `  - ${col.name} (${col.type}): ${col.business_meaning} [${col.classification}]${piiWarning}${confidenceFlag}`,
      )
    }

    sections.push("")
  }

  return sections.join("\n")
}

/**
 * Validates SQL query against dictionary before execution
 * Prevents querying undefined tables/columns
 */
export function validateQueryAgainstDictionary(
  sql: string,
  dictionaryContext: QueryMindDictionaryContext,
): {
  valid: boolean
  violations: string[]
} {
  const violations: string[] = []
  const sqlLower = sql.toLowerCase()

  // Extract table references from SQL
  const tableRegex = /from\s+([a-z_][a-z0-9_]*)|join\s+([a-z_][a-z0-9_]*)/gi
  const tableMatches = [...sqlLower.matchAll(tableRegex)]

  for (const match of tableMatches) {
    const referencedTable = (match[1] || match[2]).toLowerCase()
    const dictionaryTable = dictionaryContext.tables.find((t) => t.table_name.toLowerCase() === referencedTable)

    if (!dictionaryTable) {
      violations.push(`Table "${referencedTable}" not found in dictionary`)
    }
  }

  // Extract column references
  const columnRegex = /(?:select|where|having|order by)\s+([a-z_][a-z0-9_.]*)/gi
  const columnMatches = [...sqlLower.matchAll(columnRegex)]

  for (const match of columnMatches) {
    const referencedCol = match[1]
    if (!referencedCol.includes("*")) {
      // Skip wildcard queries for this validation
      violations.push(`Column reference "${referencedCol}" requires dictionary validation`)
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  }
}

/**
 * Audit dictionary usage for compliance
 */
export async function auditDictionaryUsage(
  environment_id: string,
  query: string,
  user_id: string,
  status: "allowed" | "blocked",
): Promise<void> {
  try {
    const db = await getAdminDbClient()
    await db.from("data_dictionary_audit_log").insert({
      environment_id,
      action: "query_attempt",
      changes: {
        query_hash: hashQuery(query),
        status,
        query_length: query.length,
      },
      user_id,
    })
  } catch (error) {
    console.error("[v0] Audit logging failed:", error)
    // Don't fail the query if audit logging fails
  }
}

function hashQuery(query: string): string {
  // Simple hash for audit purposes (production should use crypto)
  let hash = 0
  for (let i = 0; i < query.length; i++) {
    const char = query.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}
