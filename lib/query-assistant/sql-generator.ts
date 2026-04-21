import { generateText } from "ai"
import type { SchemaInfo } from "./schema-loader"

export interface SQLGenerationRequest {
  question: string
  schema: SchemaInfo
  dataDictionary?: any
  selectedTables?: string[]
  conversationContext?: string
}

export interface SQLGenerationResponse {
  sql: string
  reasoning: string
  selectedTables: string[]
  confidence: number
}

const GENERATION_PROMPT = `You are a SQL expert assistant. Generate ONLY valid SQL based on the user's question and the provided schema.

STRICT RULES:
1. Output ONLY the SQL query, no explanations
2. SELECT statements only - NO INSERT, UPDATE, DELETE, DROP, or data modification queries
3. Use exact table and column names from the schema
4. Add LIMIT 1000 to prevent large result sets
5. Be defensive with JOINs - only join if clearly needed

Schema:
{schema}

{dataDictionary}

{conversationContext}

User question: {question}

Generate the SQL query:`

export async function generateSQL(request: SQLGenerationRequest): Promise<SQLGenerationResponse> {
  const schemaText = formatSchemaForPrompt(request.schema, request.selectedTables)

  const dataDictionaryText = request.dataDictionary
    ? `\nData Dictionary Context:\n${JSON.stringify(request.dataDictionary, null, 2)}`
    : ""

  const contextText = request.conversationContext ? `\nPrevious context:\n${request.conversationContext}` : ""

  const prompt = GENERATION_PROMPT.replace("{schema}", schemaText)
    .replace("{dataDictionary}", dataDictionaryText)
    .replace("{conversationContext}", contextText)
    .replace("{question}", request.question)

  try {
    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt,
      temperature: 0.3,
      maxTokens: 500,
    })

    const sql = extractSQL(text)
    const selectedTables = extractTablesFromSQL(sql)

    return {
      sql,
      reasoning: text,
      selectedTables,
      confidence: 0.85,
    }
  } catch (error) {
    throw new Error(`SQL generation failed: ${error}`)
  }
}

function formatSchemaForPrompt(schema: SchemaInfo, selectedTables?: string[]): string {
  let output = `Database: ${schema.database}\n\nTables:\n`

  const tables = selectedTables ? schema.tables.filter((t) => selectedTables.includes(t.name)) : schema.tables

  for (const table of tables) {
    output += `\n${table.name} (${table.rowCount || 0} rows):\n`
    for (const col of table.columns) {
      const constraints = []
      if (col.isPrimaryKey) constraints.push("PRIMARY KEY")
      if (col.isUnique) constraints.push("UNIQUE")
      if (!col.nullable) constraints.push("NOT NULL")

      output += `  - ${col.name}: ${col.type}${constraints.length > 0 ? ` [${constraints.join(", ")}]` : ""}\n`
    }
  }

  return output
}

function extractSQL(text: string): string {
  // Try to extract SQL from code blocks first
  const codeBlockMatch = text.match(/```(?:sql)?\s*\n?([\s\S]*?)\n?```/)
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim()
  }

  // Otherwise try to find SELECT statement
  const selectMatch = text.match(/SELECT[\s\S]*?(?=;|$)/i)
  if (selectMatch) {
    return selectMatch[0].trim()
  }

  return text.trim()
}

function extractTablesFromSQL(sql: string): string[] {
  const tables: Set<string> = new Set()

  // Simple regex-based extraction - matches FROM and JOIN clauses
  const fromMatch = sql.match(/FROM\s+(\w+)/gi)
  if (fromMatch) {
    fromMatch.forEach((match) => {
      const tableName = match.replace(/FROM\s+/i, "").trim()
      tables.add(tableName)
    })
  }

  const joinMatch = sql.match(/JOIN\s+(\w+)/gi)
  if (joinMatch) {
    joinMatch.forEach((match) => {
      const tableName = match.replace(/JOIN\s+/i, "").trim()
      tables.add(tableName)
    })
  }

  return Array.from(tables)
}
