/**
 * F-11 · Default filter + reset helpers used by the page state machine.
 */
import type { MetricsFilter } from "./types";

export const defaultFilter: MetricsFilter = {
  period: "last_30_days",
  platforms: [],
  useTypes: [],
  trackId: null,
  syncStatusFilter: "all",
};

export function isFilterDefault(filter: MetricsFilter): boolean {
  return (
    filter.period === defaultFilter.period &&
    !filter.customRange &&
    filter.platforms.length === 0 &&
    filter.useTypes.length === 0 &&
    filter.trackId === null &&
    filter.syncStatusFilter === "all"
  );
}

/** Tiny string interpolator: replace {key} with values. */
export function interpolateString(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}
