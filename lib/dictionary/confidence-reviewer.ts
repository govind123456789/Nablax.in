// Module 5: Confidence & Review Engine
// Assigns confidence scores and flags low-confidence fields for human review
// Implements locking mechanism for reviewed/approved definitions

import type {
  ConfidenceAssessment,
  ColumnSchema,
  DataProfile,
  HeuristicInference,
  SemanticEnrichment,
} from "@/lib/db-types"

interface ReviewConfig {
  confidenceThreshold: number // 0-1, default 0.6
  requireApprovalBelowThreshold: boolean
  piiReviewRequired: boolean
}

const DEFAULT_REVIEW_CONFIG: ReviewConfig = {
  confidenceThreshold: 0.6,
  requireApprovalBelowThreshold: true,
  piiReviewRequired: true,
}

/**
 * Assess confidence for each column definition
 * Multi-factor scoring based on consistency of signals
 */
export function assessConfidence(
  column: ColumnSchema,
  profile: DataProfile["column_profiles"][0] | undefined,
  inference: HeuristicInference,
  enrichment: SemanticEnrichment["columns"][0],
  config: Partial<ReviewConfig> = {},
): ConfidenceAssessment {
  const finalConfig = { ...DEFAULT_REVIEW_CONFIG, ...config }
  const flags: string[] = []

  // Factor 1: Classification agreement (heuristic vs implicit in data type)
  let classificationScore = 0.5
  if (inference.classification !== "unknown") {
    classificationScore = 0.85
  }
  if (inference.pii) {
    classificationScore = Math.max(classificationScore, 0.9)
  }

  // Factor 2: Data profile quality
  let profileScore = 0.5
  if (profile) {
    if (profile.distinct_count && profile.distinct_count > 10) {
      profileScore = 0.7 // Sufficient cardinality
    }
    if (profile.null_pct < 0.2) {
      profileScore += 0.15 // Low null rate is good
    }
    if (profile.sample_values && profile.sample_values.length > 3) {
      profileScore += 0.1 // Good sample coverage
    }
  } else {
    flags.push("No data profile available")
  }

  // Factor 3: Column naming clarity
  let namingScore = 0.5
  const name = column.name.toLowerCase()
  if (
    name.length > 5 &&
    !name.includes("tmp") &&
    !name.includes("temp") &&
    !name.includes("test") &&
    !name.includes("xxx")
  ) {
    namingScore = 0.8
  }
  if (name.includes("_") || name.includes("_id")) {
    namingScore = Math.max(namingScore, 0.75)
  }

  // Factor 4: LLM enrichment confidence
  let enrichmentScore = 0.6
  if (enrichment.needs_confirmation) {
    enrichmentScore = 0.4
    flags.push("LLM marked as needing confirmation")
  } else if (enrichment.business_description && enrichment.business_description.length > 20) {
    enrichmentScore = 0.8
    flags.push("High-quality business description from LLM")
  }

  // Factor 5: PII handling
  if (inference.pii) {
    if (finalConfig.piiReviewRequired) {
      flags.push("PII field - requires human review")
    }
  }

  // Factor 6: High cardinality text fields (potential risk)
  if (profile && column.type.toLowerCase().includes("text") && profile.distinct_count && profile.distinct_count > 100) {
    flags.push("High-cardinality text field - may hide PII or require additional context")
  }

  // Composite score (weighted average)
  const weights = {
    classification: 0.25,
    profile: 0.2,
    naming: 0.15,
    enrichment: 0.3,
    pii: 0.1,
  }

  const confidenceScore = Math.min(
    1,
    classificationScore * weights.classification +
      profileScore * weights.profile +
      namingScore * weights.naming +
      enrichmentScore * weights.enrichment +
      (inference.pii ? 0.9 : 0.5) * weights.pii,
  )

  // Add contextual flags based on thresholds
  if (confidenceScore < finalConfig.confidenceThreshold) {
    flags.push(`Low confidence score: ${(confidenceScore * 100).toFixed(0)}%`)
  }

  return {
    column: column.name,
    confidence_score: Math.round(confidenceScore * 100) / 100, // Round to 2 decimals
    needs_human_review: confidenceScore < finalConfig.confidenceThreshold || flags.length > 2,
    flags,
  }
}

/**
 * Apply human override to a column definition
 * Creates audit trail for compliance
 */
export function applyHumanOverride(
  originalDescription: string,
  overrideDescription: string,
  userId: string,
  reason: string,
): {
  human_override: string
  override_applied_at: string
  override_applied_by: string
  override_reason: string
} {
  return {
    human_override: overrideDescription,
    override_applied_at: new Date().toISOString(),
    override_applied_by: userId,
    override_reason: reason,
  }
}

/**
 * Lock a column definition after review/approval
 * Prevents accidental overwrites during re-profiling
 */
export function lockDefinition(
  columnId: string,
  reviewer: string,
  approvalReason: string,
): {
  locked: true
  locked_at: string
  locked_by: string
  lock_reason: string
} {
  return {
    locked: true,
    locked_at: new Date().toISOString(),
    locked_by: reviewer,
    lock_reason: approvalReason,
  }
}

/**
 * Unlock a definition (admin function)
 */
export function unlockDefinition(
  columnId: string,
  reviewer: string,
  reason: string,
): {
  locked: false
  unlocked_at: string
  unlocked_by: string
  unlock_reason: string
} {
  return {
    locked: false,
    unlocked_at: new Date().toISOString(),
    unlocked_by: reviewer,
    unlock_reason: reason,
  }
}

/**
 * Generate review summary for UI
 */
export function generateReviewSummary(assessments: ConfidenceAssessment[]): {
  total: number
  highConfidence: number
  needsReview: number
  piiFields: number
  reviewPercentage: number
} {
  return {
    total: assessments.length,
    highConfidence: assessments.filter((a) => a.confidence_score >= 0.8).length,
    needsReview: assessments.filter((a) => a.needs_human_review).length,
    piiFields: assessments.filter((a) => a.flags.some((f) => f.includes("PII"))).length,
    reviewPercentage: Math.round((assessments.filter((a) => a.needs_human_review).length / assessments.length) * 100),
  }
}
