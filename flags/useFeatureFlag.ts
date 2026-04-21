import { featureFlags, FeatureFlag } from "./featureFlags";

export const useFeatureFlag = (flag: FeatureFlag): boolean =>
  featureFlags[flag] ?? false;
