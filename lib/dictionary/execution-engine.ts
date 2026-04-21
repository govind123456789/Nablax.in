// Execution Flow Management
// Orchestrates the entire pipeline from introspection to QueryMind integration

import { introspectSchema } from "./schema-introspection"
import { profileTable } from "./data-profiler"
import { inferColumnClassification, inferRowGranularity } from "./heuristic-inference"
import { enrichWithSemantics } from "./llm-semantic-enrichment"
import { assessConfidence } from "./confidence-reviewer"
import { getDictionaryContextForQueryMind, buildQueryMindSystemPrompt } from "./querymind-integration"
import { getAdminDbClient } from "@/lib/db-client"
import type { DatabaseEnvironment } from "@/lib/db-types"

/**
 * Complete execution flow for data dictionary generation
 * Orchestrates all 7 modules in sequence
 */
export async function runCompleteDataDictionaryPipeline(
  environment: DatabaseEnvironment,
  connectionString: string,
): Promise<{
  status: "success" | "partial" | "failed"
  summary: Record<string, unknown>
  errors: string[]
  warnings: string[]
}> {
  const errors: string[] = []
  const warnings: string[] = []
  const db = await getAdminDbClient()

  try {
    console.log("[v0] Starting complete dictionary pipeline for", environment.name)

    // Step 1: Introspection
    console.log("[v0] Step 1/7: Schema introspection")
    const schema = await introspectSchema({
      type: environment.database_type,
      connectionString,
    })
    console.log(`[v0] Found ${schema.tables.length} tables`)

    // Step 2-3: Profile and Enrich each table
    for (const table of schema.tables) {
      console.log(`[v0] Step 2-3/7: Profiling and enriching ${table.table_name}`)

      try {
        // Profile
        const profile = await profileTable(
          table.table_name,
          table.columns.map((c) => c.name),
          { sampleSize: 1000 },
        )

        // Infer
        const inferences = table.columns.map((col) => {
          const colProfile = profile.column_profiles.find((p) => p.column === col.name)
          return inferColumnClassification(col, colProfile)
        })

        const rowGranularity = inferRowGranularity(table.columns, inferences)

        // Enrich
        const enrichment = await enrichWithSemantics({
          tableName: table.table_name,
          columns: table.columns,
          profiles: profile.column_profiles,
          inferences,
        })

        // Confidence assess
        const confidenceAssessments = table.columns.map((col) => {
          const inference = inferences.find((i) => i.column === col.name)!
          const colProfile = profile.column_profiles.find((p) => p.column === col.name)
          const enrichedCol = enrichment.columns.find((c) => c.name === col.name)!

          return assessConfidence(col, colProfile, inference, enrichedCol)
        })

        console.log(
          `[v0] ${table.table_name}: ${confidenceAssessments.filter((c) => c.confidence_score >= 0.8).length}/${table.columns.length} high confidence`,
        )
      } catch (tableError) {
        errors.push(
          `Error processing table ${table.table_name}: ${tableError instanceof Error ? tableError.message : "Unknown"}`,
        )
      }
    }

    // Step 6-7: Generate QueryMind context
    console.log("[v0] Step 6-7/7: Generating QueryMind context")
    const { context, valid, errors: contextErrors } = await getDictionaryContextForQueryMind(environment.id)

    if (!valid) {
      errors.push(...contextErrors)
    }

    if (context) {
      const systemPrompt = buildQueryMindSystemPrompt(context, "You are QueryMind, an AI SQL generator.")
      console.log("[v0] QueryMind system prompt ready")
    }

    const status = errors.length === 0 ? "success" : warnings.length === 0 ? "partial" : "failed"

    return {
      status,
      summary: {
        tables_processed: schema.tables.length,
        total_columns: schema.tables.reduce((sum, t) => sum + t.columns.length, 0),
        context_generated: context !== null,
        completion_time: new Date().toISOString(),
      },
      errors,
      warnings,
    }
  } catch (error) {
    console.error("[v0] Pipeline execution failed:", error)
    errors.push(error instanceof Error ? error.message : "Unknown error")

    return {
      status: "failed",
      summary: {},
      errors,
      warnings,
    }
  }
}
