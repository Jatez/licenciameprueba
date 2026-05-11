/**
 * F-11 · Credits-by-use-type mock per scenario.
 * Computed from publications via the canonical selector.
 */
import type { CreditsByUseType, MetricsScenario } from "../types";
import { getPublicationsForScenario } from "./publications";
import { computeCreditsByUseType } from "../selectors/computeCreditsByUseType";

export function getCreditsByTypeForScenario(scenario: MetricsScenario): CreditsByUseType[] {
  return computeCreditsByUseType(getPublicationsForScenario(scenario));
}
