// Usage Tracking and Tier Management

export type UserTier = "demo" | "starter" | "professional" | "enterprise"

export interface TierLimits {
  queriesPerDay: number
  tablesPerQuery: number
  rowsInResults: number
  customLLMProvider: boolean
  dataDictionaryAccess: boolean
  apiAccess: boolean
  supportLevel: "community" | "email" | "priority"
}

export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  demo: {
    queriesPerDay: 5,
    tablesPerQuery: 1,
    rowsInResults: 100,
    customLLMProvider: false,
    dataDictionaryAccess: false,
    apiAccess: false,
    supportLevel: "community",
  },
  starter: {
    queriesPerDay: 50,
    tablesPerQuery: 3,
    rowsInResults: 10000,
    customLLMProvider: false,
    dataDictionaryAccess: true,
    apiAccess: false,
    supportLevel: "email",
  },
  professional: {
    queriesPerDay: 500,
    tablesPerQuery: 10,
    rowsInResults: 100000,
    customLLMProvider: true,
    dataDictionaryAccess: true,
    apiAccess: true,
    supportLevel: "priority",
  },
  enterprise: {
    queriesPerDay: 999999,
    tablesPerQuery: 999999,
    rowsInResults: 999999,
    customLLMProvider: true,
    dataDictionaryAccess: true,
    apiAccess: true,
    supportLevel: "priority",
  },
}

export interface UsageMetrics {
  queriesUsedToday: number
  queriesLimit: number
  tablesPerQuery: number
  rowLimitPerQuery: number
  tier: UserTier
}

export function checkUsageLimits(
  metrics: UsageMetrics,
  tablesRequested: number,
  rowsInResult: number,
): { allowed: boolean; reason?: string } {
  const limits = TIER_LIMITS[metrics.tier]

  if (metrics.queriesUsedToday >= limits.queriesPerDay) {
    return {
      allowed: false,
      reason: `Daily query limit reached (${limits.queriesPerDay} queries). Upgrade to Professional for more.`,
    }
  }

  if (tablesRequested > limits.tablesPerQuery) {
    return {
      allowed: false,
      reason: `Cannot query more than ${limits.tablesPerQuery} tables in ${metrics.tier} tier. Upgrade to Professional.`,
    }
  }

  if (rowsInResult > limits.rowsInResults) {
    return {
      allowed: false,
      reason: `Results limited to ${limits.rowsInResults} rows in ${metrics.tier} tier. Upgrade for higher limits.`,
    }
  }

  return { allowed: true }
}
