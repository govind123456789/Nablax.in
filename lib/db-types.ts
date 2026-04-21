// Type definitions for Data Dictionary system
// Ensures type safety across all modules

// Environment
export interface DatabaseEnvironment {
  id: string
  name: string
  description?: string
  database_type: "postgresql" | "snowflake"
  connection_status: "connected" | "disconnected" | "error"
  last_introspection_at?: string
  created_at: string
  updated_at: string
}

// Table metadata
export interface DataDictionaryTable {
  id: string
  environment_id: string
  table_name: string
  table_description?: string
  row_granularity?: string
  version: number
  ingestion_timestamp?: string
  created_at: string
  updated_at: string
}

// Column metadata
export interface DataDictionaryColumn {
  id: string
  table_id: string
  environment_id: string
  column_name: string
  data_type: string
  nullable: boolean
  business_description?: string
  classification: "identifier" | "metric" | "dimension" | "time" | "unknown"
  is_pii: boolean
  confidence_score: number
  needs_human_review: boolean
  locked: boolean
  sample_values?: string[]
  profile_null_pct?: number
  profile_distinct_count?: number
  profile_min?: string
  profile_max?: string
  inferred_meaning?: string
  human_override?: string
  version: number
  created_at: string
  updated_at: string
}

// Audit log
export interface AuditLogEntry {
  id: string
  environment_id: string
  action: "introspect" | "profile" | "enrich" | "review" | "override"
  table_name?: string
  column_name?: string
  changes: Record<string, unknown>
  user_id?: string
  reason?: string
  created_at: string
}

// Schema introspection output
export interface SchemaIntrospection {
  tables: TableSchema[]
}

export interface TableSchema {
  table_name: string
  columns: ColumnSchema[]
}

export interface ColumnSchema {
  name: string
  type: string
  nullable: boolean
}

// Data profiling output
export interface DataProfile {
  table: string
  column_profiles: ColumnProfile[]
}

export interface ColumnProfile {
  column: string
  null_pct: number
  distinct_count: number
  min?: string | number | null
  max?: string | number | null
  sample_values: (string | number | null)[]
}

// Heuristic inference output
export interface HeuristicInference {
  column: string
  classification: "identifier" | "metric" | "dimension" | "time" | "unknown"
  pii: boolean
  reason: string
}

// LLM enrichment output
export interface SemanticEnrichment {
  table_description: string
  row_granularity: string
  columns: ColumnEnrichment[]
}

export interface ColumnEnrichment {
  name: string
  business_description: string
  needs_confirmation: boolean
}

// Confidence and review output
export interface ConfidenceAssessment {
  column: string
  confidence_score: number
  needs_human_review: boolean
  flags: string[]
}

// QueryMind context
export interface QueryMindDictionaryContext {
  environment_id: string
  tables: QueryMindTableContext[]
  generated_at: string
  version: number
}

export interface QueryMindTableContext {
  table_name: string
  description: string
  row_granularity: string
  columns: QueryMindColumnContext[]
}

export interface QueryMindColumnContext {
  name: string
  type: string
  business_meaning: string
  classification: string
  is_pii: boolean
  confidence: number
}
