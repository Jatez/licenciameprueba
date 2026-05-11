/**
 * F-11 · Hook: aggregated metrics overview for the active filter.
 *
 * Mock semantics: simulates 200–500ms latency (1500–3000ms in heavy).
 * When backend lands, swap to React Query against `GET /api/metrics/overview`.
 */
import { useEffect, useMemo, useState } from "react";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import { aggregatePublications } from "../selectors/aggregatePublications";
import { computePeriodComparison } from "../selectors/periodComparison";
import { filterPublications } from "../selectors/filterPublications";
import { resolvePeriod } from "../selectors/resolvePeriod";
import type { MetricsFilter, MetricsOverview } from "../types";
import { isoHoursAgo } from "../mocks/utils";

interface HookResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

function getLatencyMs(): number {
  const scenario = getActiveScenario();
  if (scenario === "heavy") return 1500 + Math.random() * 1500;
  return 200 + Math.random() * 300;
}

function getLastGlobalSyncAt(): string {
  const scenario = getActiveScenario();
  if (scenario === "partial") return isoHoursAgo(5); // forces isStale
  return isoHoursAgo(1);
}

export function useMetricsOverview(filter: MetricsFilter): HookResult<MetricsOverview> {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MetricsOverview | null>(null);

  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const id = setTimeout(() => {
      if (cancelled) return;
      const scenario = getActiveScenario();
      const all = getPublicationsForScenario(scenario);

      const period = resolvePeriod(filter.period, filter.customRange);
      const currentList = filterPublications(all, filter);
      const lastSync = getLastGlobalSyncAt();

      const overview = aggregatePublications(
        currentList,
        period.start,
        period.end,
        period.comparisonStart,
        period.comparisonEnd,
        lastSync,
      );

      // Comparison: same filter applied to the previous window.
      const comparisonFilter: MetricsFilter = {
        ...filter,
        period: "custom",
        customRange: { start: period.comparisonStart, end: period.comparisonEnd },
      };
      const previousList = filterPublications(all, comparisonFilter);
      const previousOverview = aggregatePublications(
        previousList,
        period.comparisonStart,
        period.comparisonEnd,
        period.comparisonStart,
        period.comparisonEnd,
        lastSync,
      );

      overview.deltas = computePeriodComparison(overview, previousOverview);
      setData(overview);
      setIsLoading(false);
    }, getLatencyMs());

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [filterKey, version, filter]);

  return {
    data,
    isLoading,
    isError: false,
    refetch: () => setVersion((v) => v + 1),
  };
}
