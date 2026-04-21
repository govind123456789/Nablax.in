// Module 4: LLM Semantic Enrichment Engine
// Converts technical metadata into business language
// Uses AI SDK with safeguards against hallucination

import { generateText } from "ai"
import type { SemanticEnrichment, ColumnSchema, DataProfile, HeuristicInference } from "@/lib/db-types"

interface EnrichmentContext {
  tableName: string
  columns: ColumnSchema[]
  profiles: DataProfile["column_profiles"]
  inferences: HeuristicInference[]
}

/**
 * Enriches technical schema with business descriptions
 * Structured prompting prevents hallucination
 */
export async function enrichWithSemantics(context: EnrichmentContext): Promise<SemanticEnrichment> {
  console.log("[v0] Starting semantic enrichment for table", context.tableName)

  // Build strict, structured prompt
  const enrichmentPrompt = buildEnrichmentPrompt(context)

  try {
    const { text } = await generateText({
      model: "openai/gpt-4o",
      prompt: enrichmentPrompt,
      temperature: 0.3, // Low temperature for consistency
      maxTokens: 2000,
      system: SYSTEM_PROMPT,
    })

    // Parse structured JSON response
    const parsed = parseEnrichmentResponse(text, context)
    return parsed
  } catch (error) {
    console.error("[v0] LLM enrichment failed:", error)
    // Fallback: minimal enrichment from heuristics
    return buildFallbackEnrichment(context)
  }
}

const SYSTEM_PROMPT = `You are a Data Dictionary expert. Your task is to convert technical database metadata into clear business language.

CRITICAL RULES:
1. NEVER hallucinate or invent column meanings - use only provided names, types, and data profiles
2. If uncertain about meaning, set needs_confirmation: true
3. Use simple, business-friendly language (assume non-technical audience)
4. Keep descriptions under 30 words
5. Base descriptions ONLY on:
   - Column name and type
   - Data samples provided
   - Classification hints (metric, dimension, identifier, time)
6. Always respond with valid JSON

RESPONSE FORMAT:
{
  "table_description": "What this table represents",
  "row_granularity": "What does one row represent?",
  "columns": [
    {
      "name": "column_name",
      "business_description": "Business meaning in plain English",
      "needs_confirmation": false
    }
  ]
}
`

/**
 * Builds structured prompt with masked data
 * All sensitive information is either removed or redacted
 */
function buildEnrichmentPrompt(context: EnrichmentContext): string {
  const { tableName, columns, profiles, inferences } = context

  // Build column metadata
  const columnMetadata = columns
    .map((col, idx) => {
      const profile = profiles.find((p) => p.column === col.name)
      const inference = inferences.find((i) => i.column === col.name)

      let sampleData = ""
      if (profile?.sample_values && profile.sample_values.length > 0) {
        const samples = profile.sample_values.slice(0, 3).filter((v) => v !== null)
        sampleData = `, samples: [${samples.join(", ")}]`
      }

      return `
Column ${idx + 1}: ${col.name}
  - Type: ${col.type}
  - Nullable: ${col.nullable}
  - Classification: ${inference?.classification || "unknown"}
  - Distinct values: ${profile?.distinct_count || "unknown"}
  - Null %: ${profile?.null_pct?.toFixed(1) || "unknown"}${sampleData}
`
    })
    .join("\n")

  return `
TABLE TO ENRICH: ${tableName}

COLUMNS AND STATISTICS:
${columnMetadata}

TASK:
1. What is the business purpose of this table?
2. What does one row represent? (granularity)
3. For each column, provide a brief business description based ONLY on the name, type, and samples above.
4. If you cannot confidently determine the meaning, mark needs_confirmation: true
5. Do NOT make assumptions beyond what the data clearly indicates.

Respond with ONLY valid JSON, no additional text.
`
}

/**
 * Parses JSON response from LLM
 * Validates structure and falls back if malformed
 */
function parseEnrichmentResponse(jsonText: string, context: EnrichmentContext): SemanticEnrichment {
  try {
    // Extract JSON from potential markdown code blocks
    let cleanJson = jsonText.trim()
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "")
    }

    const parsed = JSON.parse(cleanJson) as SemanticEnrichment

    // Validate required fields
    if (!parsed.table_description || !parsed.row_granularity || !parsed.columns) {
      throw new Error("Missing required fields in LLM response")
    }

    // Ensure all columns are represented
    const enrichedColumnNames = parsed.columns.map((c) => c.name)
    const missingColumns = context.columns.filter((col) => !enrichedColumnNames.includes(col.name))

    if (missingColumns.length > 0) {
      console.warn(
        "[v0] LLM missing enrichment for columns:",
        missingColumns.map((c) => c.name),
      )
      // Add fallback descriptions for missing columns
      for (const col of missingColumns) {
        parsed.columns.push({
          name: col.name,
          business_description: `${col.name} (${col.type}) - requires human review`,
          needs_confirmation: true,
        })
      }
    }

    return parsed
  } catch (error) {
    console.error("[v0] Failed to parse LLM response:", error)
    return buildFallbackEnrichment(context)
  }
}

/**
 * Fallback enrichment using heuristics when LLM fails
 */
function buildFallbackEnrichment(context: EnrichmentContext): SemanticEnrichment {
  const { tableName, columns, inferences } = context

  // Simple fallback descriptions based on heuristics
  const fallbackColumns = columns.map((col) => {
    const inference = inferences.find((i) => i.column === col.name)
    let description = col.name

    switch (inference?.classification) {
      case "identifier":
        description = `Unique identifier for ${tableName}`
        break
      case "metric":
        description = `Measured value or aggregate`
        break
      case "dimension":
        description = `Categorical attribute`
        break
      case "time":
        description = `Temporal data (${col.type})`
        break
      default:
        description = `${col.name} field (${col.type})`
    }

    return {
      name: col.name,
      business_description: description,
      needs_confirmation: inference?.classification === "unknown",
    }
  })

  return {
    table_description: `Table: ${tableName}`,
    row_granularity: "Row granularity unclear - requires human review",
    columns: fallbackColumns,
  }
}
