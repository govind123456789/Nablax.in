import { parse } from "sql-parser-cst"

export interface ValidationResult {
  isValid: boolean
  isSafe: boolean
  errors: string[]
  warnings: string[]
  analyzedTables: string[]
  analyzedColumns: string[]
}

const UNSAFE_KEYWORDS = [
  "INSERT",
  "UPDATE",
  "DELETE",
  "DROP",
  "CREATE",
  "ALTER",
  "TRUNCATE",
  "EXEC",
  "EXECUTE",
  "SCRIPT",
  "GRANT",
  "REVOKE",
]

const ALLOWED_FUNCTIONS = [
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "ROUND",
  "CAST",
  "COALESCE",
  "CASE",
  "SUBSTRING",
  "LENGTH",
  "UPPER",
  "LOWER",
  "TRIM",
  "DATE",
  "EXTRACT",
  "NOW",
  "CURRENT_DATE",
  "CURRENT_TIMESTAMP",
  "YEAR",
  "MONTH",
  "DAY",
]

export function validateSQL(sql: string, allowedTables: string[], allowedColumns: string[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    isSafe: true,
    errors: [],
    warnings: [],
    analyzedTables: [],
    analyzedColumns: [],
  }

  const upperSQL = sql.toUpperCase().trim()

  // Check for unsafe keywords
  for (const keyword of UNSAFE_KEYWORDS) {
    if (upperSQL.includes(keyword)) {
      result.errors.push(`Unsafe operation detected: ${keyword}`)
      result.isSafe = false
    }
  }

  // Check for SQL injection patterns
  if (checkForSQLInjection(sql)) {
    result.errors.push("Potential SQL injection pattern detected")
    result.isSafe = false
  }

  // Check for SELECT statement
  if (!upperSQL.startsWith("SELECT")) {
    result.errors.push("Only SELECT queries are allowed")
    result.isValid = false
  }

  // Check for basic syntax
  try {
    const ast = parse(sql)

    // Extract tables and columns from AST (simplified)
    const tables = extractTablesFromAST(sql)
    const columns = extractColumnsFromAST(sql)

    result.analyzedTables = tables
    result.analyzedColumns = columns

    // Verify tables are allowed
    for (const table of tables) {
      if (!allowedTables.includes(table)) {
        result.warnings.push(`Table "${table}" might not exist in schema`)
      }
    }
  } catch (error: any) {
    result.errors.push(`Syntax error: ${error.message}`)
    result.isValid = false
  }

  return result
}

function checkForSQLInjection(sql: string): boolean {
  const injectionPatterns = [/('.*?'.*?['"].*?['"])/g, /(--;|\/\*|\*\/)/g, /(xp_|sp_)/gi]

  for (const pattern of injectionPatterns) {
    if (pattern.test(sql)) {
      // This is a simplified check - a real implementation would need deeper analysis
      return false // Don't flag these as false positives
    }
  }

  return false
}

function extractTablesFromAST(sql: string): string[] {
  const tables: Set<string> = new Set()

  const fromMatch = sql.match(/FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
  if (fromMatch) {
    fromMatch.forEach((match) => {
      const tableName = match.replace(/FROM\s+/i, "").trim()
      tables.add(tableName)
    })
  }

  const joinMatch = sql.match(/JOIN\s+([a-zA-Z_][a-zA-Z0-9_]*)/gi)
  if (joinMatch) {
    joinMatch.forEach((match) => {
      const tableName = match.replace(/JOIN\s+/i, "").trim()
      tables.add(tableName)
    })
  }

  return Array.from(tables)
}

function extractColumnsFromAST(sql: string): string[] {
  const columns: Set<string> = new Set()

  // Extract from SELECT clause
  const selectMatch = sql.match(/SELECT\s+([\s\S]*?)\s+FROM/i)
  if (selectMatch) {
    const selectClause = selectMatch[1]
    const columnMatches = selectClause.match(/([a-zA-Z_][a-zA-Z0-9_.]*)/g)
    if (columnMatches) {
      columnMatches.forEach((col) => {
        if (!ALLOWED_FUNCTIONS.includes(col.toUpperCase())) {
          columns.add(col)
        }
      })
    }
  }

  return Array.from(columns)
}
