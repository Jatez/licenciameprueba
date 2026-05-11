import { featureFlags, type FeatureFlag } from "@/config/featureFlags";

/**
 * Hook entry point for reading feature flags from components.
 * Use this in JSX instead of importing `featureFlags` directly so the
 * dependency is explicit and easy to refactor.
 */
export function useFeatureFlag(name: FeatureFlag): boolean {
  return featureFlags[name];
}
