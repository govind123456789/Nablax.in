// LLM Prompts for Data Dictionary Enrichment
// Centralized prompt management for versioning and auditing

export const ENRICHMENT_PROMPTS = {
  businessDescriptionSystem: `You are a Data Dictionary expert specializing in converting technical database schemas into business language. Your goal is to make database concepts accessible to non-technical stakeholders.

CRITICAL CONSTRAINTS:
1. Base all descriptions EXCLUSIVELY on provided metadata (names, types, samples, classifications)
2. Never invent or assume information not in the data
3. Flag uncertainty with needs_confirmation: true
4. Use concise language (max 30 words per description)
5. Write for a business audience, not technical users
6. Always output valid JSON`,

  columnDescriptionPrompt: `Given this column metadata, provide a business-friendly description:

Column: {columnName}
Type: {dataType}
Classification: {classification}
Sample values: {samples}
Null percentage: {nullPct}%
Distinct values: {distinctCount}

Provide:
1. What does this column represent in business terms?
2. Is the meaning clear (confidence: high/medium/low)?
3. Does this need human review?

Output JSON:
{
  "description": "Business meaning",
  "confidence": "high|medium|low",
  "needs_review": boolean,
  "reason": "Why this confidence level"
}`,

  tableGranularityPrompt: `Analyze these columns to determine what one row in this table represents:

Table: {tableName}
Columns:
{columnList}

Determine:
1. Row granularity (what does one row represent?)
2. What are the identifying dimensions?
3. Is the granularity consistent across all columns?

Output JSON:
{
  "row_granularity": "Description of what one row represents",
  "identifying_dimensions": ["col1", "col2"],
  "granularity_confidence": "high|medium|low",
  "explanation": "Why we believe this granularity"
}`,

  relationshipDetectionPrompt: `Analyze potential relationships between these tables:

Table 1: {table1Name}
Columns: {table1Columns}

Table 2: {table2Name}
Columns: {table2Columns}

Identify:
1. Potential join keys (exact or logical matches)
2. Relationship type (1:1, 1:N, N:M)
3. Relationship strength (certain vs. inferred)

Output JSON:
{
  "potential_joins": [
    {
      "key_1": "column_from_table1",
      "key_2": "column_from_table2",
      "type": "1:1|1:N|N:M",
      "confidence": "high|medium|low"
    }
  ]
}`,
}
