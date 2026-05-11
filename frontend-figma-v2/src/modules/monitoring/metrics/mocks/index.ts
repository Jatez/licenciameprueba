/**
 * F-11 · Mock scenario switcher.
 *
 * Activate via query string: `?mock=happy|empty|sparse|partial|heavy`.
 * Default: `happy`.
 */
import type { MetricsScenario } from "../types";

export { getPublicationsForScenario } from "./publications";
export { getTopTracksForScenario } from "./topTracks";
export { getCreditsByTypeForScenario } from "./creditsConsumption";
export { mockReportHistory } from "./reports";

const VALID: MetricsScenario[] = ["happy", "empty", "sparse", "partial", "heavy"];

export function getActiveScenario(): MetricsScenario {
  if (typeof window === "undefined") return "happy";
  const params = new URLSearchParams(window.location.search);
  const value = params.get("mock");
  if (value && (VALID as string[]).includes(value)) {
    return value as MetricsScenario;
  }
  return "happy";
}
