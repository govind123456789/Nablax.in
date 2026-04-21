export type FeatureFlag =
  | "EXPLAINABILITY"
  | "AUTO_CHARTS"
  | "ADVANCED_SQL"
  | "AUDIT_EXPORT";

export const featureFlags: Record<FeatureFlag, boolean> = {
  EXPLAINABILITY: true,
  AUTO_CHARTS: true,
  ADVANCED_SQL: false,
  AUDIT_EXPORT: true
};
