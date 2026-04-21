// Module 3: Heuristic Inference Engine
// Classifies columns and detects PII using deterministic rules
// No LLM involved - purely pattern-based

import type { HeuristicInference, ColumnSchema, DataProfile } from "@/lib/db-types"

// Deterministic rule definitions
const IDENTIFIER_PATTERNS = /^(id|_id|uuid|guid|oid|object_id|pk_|pk\d+|identifier)$/i
const METRIC_PATTERNS = /^(count|sum|total|amount|revenue|sales|value|metric|measure)$/i
const DIMENSION_PATTERNS = /^(category|type|status|group|class|segment|dimension|attribute)$/i
const TIME_PATTERNS = /^(date|time|datetime|timestamp|year|month|day|created|updated|modified|at$)/i

const PII_FIELD_PATTERNS = {
  email: /email|mail|e-mail|contact/i,
  phone: /phone|telephone|mobile|cell|contact/i,
  ssn: /ssn|social_security|tax_id/i,
  creditCard: /card|cc|credit|cvv|security_code/i,
  name: /^(first_)?name|full_name|customer_name|user_name|person_name/i,
  address: /address|street|city|state|zip|postal|location/i,
  password: /password|passwd|pwd|secret|key/i,
  token: /token|session|auth|api_key|access_key/i,
  ip: /ip_address|ipv4|ipv6|host/i,
  url: /url|website|homepage|link/i,
}

const PII_VALUE_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
  ssn: /^\d{3}-\d{2}-\d{4}$/,
  ipv4: /^(\d{1,3}\.){3}\d{1,3}$/,
  creditCard: /^\d{13,19}$/,
  date: /^\d{4}-\d{2}-\d{2}/,
}

/**
 * Infers column classification and detects PII
 * Completely deterministic - no hallucination possible
 */
export function inferColumnClassification(
  column: ColumnSchema,
  profile?: DataProfile["column_profiles"][0],
): HeuristicInference {
  const columnName = column.name
  const dataType = column.type.toLowerCase()

  let classification: "identifier" | "metric" | "dimension" | "time" | "unknown" = "unknown"
  let pii = false
  const reasons: string[] = []

  // Rule 1: Detect identifiers
  if (IDENTIFIER_PATTERNS.test(columnName)) {
    classification = "identifier"
    reasons.push(`Column name matches identifier pattern: ${columnName}`)
  }

  // Rule 2: Detect metrics (numeric data with specific patterns)
  if (!pii && METRIC_PATTERNS.test(columnName)) {
    if (
      dataType.includes("int") ||
      dataType.includes("decimal") ||
      dataType.includes("numeric") ||
      dataType.includes("float")
    ) {
      classification = "metric"
      reasons.push(`Numeric data type ${dataType} with metric naming pattern: ${columnName}`)
    }
  }

  // Rule 3: Detect dimensions
  if (!pii && DIMENSION_PATTERNS.test(columnName)) {
    classification = "dimension"
    reasons.push(`Column name matches dimension pattern: ${columnName}`)
  }

  // Rule 4: Detect time columns
  if (TIME_PATTERNS.test(columnName) || dataType.includes("timestamp") || dataType.includes("date")) {
    classification = "time"
    reasons.push(`Column name or type indicates temporal data: ${columnName} (${dataType})`)
  }

  // Rule 5: Detect PII by field name
  for (const [piiType, pattern] of Object.entries(PII_FIELD_PATTERNS)) {
    if (pattern.test(columnName)) {
      pii = true
      reasons.push(`Field name matches ${piiType} PII pattern`)
      break
    }
  }

  // Rule 6: Detect PII by data type and name
  if (!pii) {
    if (dataType.includes("text") || dataType.includes("varchar")) {
      // Sample-based PII detection
      if (profile?.sample_values && profile.sample_values.length > 0) {
        for (const value of profile.sample_values) {
          if (typeof value === "string") {
            for (const valuePattern of Object.values(PII_VALUE_PATTERNS)) {
              if (valuePattern.test(value)) {
                pii = true
                reasons.push(`Sample value matches PII pattern: ${valuePattern}`)
                break
              }
            }
          }
        }
      }
    }
  }

  // Rule 7: High cardinality with text type might be PII
  if (!pii && profile && dataType.includes("text") && profile.distinct_count && profile.distinct_count > 100) {
    // Additional context needed from LLM
    if (IDENTIFIER_PATTERNS.test(columnName) || TIME_PATTERNS.test(columnName) || METRIC_PATTERNS.test(columnName)) {
      // Safe identifier, metric, or time column
    } else {
      reasons.push(`High cardinality (${profile.distinct_count}) text field - may require human review`)
    }
  }

  return {
    column: columnName,
    classification,
    pii,
    reason: reasons.join(" | "),
  }
}

/**
 * Infer row-level granularity based on column patterns
 * Returns natural language description of what each row represents
 */
export function inferRowGranularity(columns: ColumnSchema[], inferences: HeuristicInference[]): string {
  const identifiers = inferences.filter((i) => i.classification === "identifier").map((i) => i.column)
  const timeCols = inferences.filter((i) => i.classification === "time").map((i) => i.column)
  const dimensions = inferences.filter((i) => i.classification === "dimension").map((i) => i.column)

  // Pattern matching for common granularities
  if (timeCols.length > 0 && identifiers.length > 1) {
    return `One row per [${identifiers.join(", ")}] per ${timeCols[0]}`
  }

  if (identifiers.length === 1 && dimensions.length > 0) {
    return `One row per [${dimensions.join(", ")}] for ${identifiers[0]}`
  }

  if (identifiers.length === 1) {
    return `One row per unique ${identifiers[0]}`
  }

  if (identifiers.length > 1) {
    return `One row per combination of [${identifiers.join(", ")}]`
  }

  if (timeCols.length > 0) {
    return `One row per ${timeCols[0]}`
  }

  return "Granularity unclear - requires human review"
}

/**
 * Detect candidate primary keys based on naming and cardinality
 */
export function detectPrimaryKey(columns: ColumnSchema[], profiles: DataProfile["column_profiles"]): string | null {
  // First pass: explicit PK patterns
  for (const column of columns) {
    if (IDENTIFIER_PATTERNS.test(column.name) && !column.nullable) {
      return column.name
    }
  }

  // Second pass: high cardinality, non-nullable
  const nonNullableColumns = columns.filter((c) => !c.nullable)
  for (const col of nonNullableColumns) {
    const profile = profiles.find((p) => p.column === col.name)
    if (profile && profile.distinct_count && profile.null_pct === 0) {
      // Likely a primary key or unique identifier
      if (profile.distinct_count > columns.length * 0.8) {
        // Very high cardinality
        return col.name
      }
    }
  }

  return null
}

/**
 * Assess join feasibility between tables
 */
export function assessJoinFeasibility(table1Cols: string[], table2Cols: string[]): string[] {
  const candidateJoinKeys: string[] = []

  for (const col1 of table1Cols) {
    for (const col2 of table2Cols) {
      // Exact name match
      if (col1.toLowerCase() === col2.toLowerCase()) {
        candidateJoinKeys.push(col1)
        break
      }

      // Pattern matching: col_id matches table_col_id or col_id_table
      if (col1.toLowerCase().endsWith("_id") && col1.toLowerCase().includes(col2.toLowerCase().replace(/_id$/, ""))) {
        candidateJoinKeys.push(col1)
        break
      }
    }
  }

  return candidateJoinKeys
}
