/**
 * Central feature flags for Licénciame.
 *
 * Flags are read from `import.meta.env.VITE_*` at build time, defaulting to
 * `true`. Toggle a flag locally by setting the env var to `"false"`.
 *
 * RULE: never read this object directly inside JSX — always go through the
 * `useFeatureFlag` hook so feature dependencies are explicit and greppable.
 */

const flag = (envKey: string, defaultValue: boolean): boolean => {
  const value = (import.meta.env as Record<string, unknown>)[envKey];
  if (value === undefined) return defaultValue;
  return value === "true" || value === true;
};

export const featureFlags = {
  /** Mood/emotion filter — depends on client metadata richness. */
  FEATURE_MOOD_FILTER: flag("VITE_FEATURE_MOOD_FILTER", true),
  /** Language filter — depends on client metadata richness. */
  FEATURE_LANGUAGE_FILTER: flag("VITE_FEATURE_LANGUAGE_FILTER", true),
  /** Favorites — pending backend effort confirmation. */
  FEATURE_FAVORITES: flag("VITE_FEATURE_FAVORITES", true),
  /** Visual waveform inside the player — pending design validation. */
  FEATURE_WAVEFORM: flag("VITE_FEATURE_WAVEFORM", true),
  /** Similar tracks on detail page — needs backend logic. */
  FEATURE_SIMILAR_TRACKS: flag("VITE_FEATURE_SIMILAR_TRACKS", true),
  /** Themed discovery cards on the catalog landing strip. */
  FEATURE_THEMED_CARDS: flag("VITE_FEATURE_THEMED_CARDS", true),
  /**
   * Demo mode — mocks are the data source, no real backend connected yet.
   * While true, UI exposes shortcuts that simulate backend-only flows
   * (e.g. email verification links). Set to false the day the real API ships.
   */
  MOCKS_ENABLED: flag("VITE_MOCKS_ENABLED", true),
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export const isFeatureEnabled = (name: FeatureFlag): boolean => featureFlags[name];
