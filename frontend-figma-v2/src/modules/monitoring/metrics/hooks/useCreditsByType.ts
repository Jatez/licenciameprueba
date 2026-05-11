/**
 * F-11 · Hook: credits-spent breakdown by license use type.
 * Backend mapping: `GET /api/metrics/credits-by-type?...filter`.
 */
import { useEffect, useMemo, useState } from "react";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import { filterPublications } from "../selectors/filterPublications";
import { computeCreditsByUseType } from "../selectors/computeCreditsByUseType";
import type { CreditsByUseType, MetricsFilter } from "../types";

interface UseCreditsByTypeResult {
  data: CreditsByUseType[] | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

function getLatencyMs(): number {
  const scenario = getActiveScenario();
  if (scenario === "heavy") return 1500 + Math.random() * 1500;
  return 200 + Math.random() * 300;
}

export function useCreditsByType(filter: MetricsFilter): UseCreditsByTypeResult {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CreditsByUseType[] | null>(null);
  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const id = setTimeout(() => {
      if (cancelled) return;
      const all = getPublicationsForScenario(getActiveScenario());
      const filtered = filterPublications(all, filter);
      setData(computeCreditsByUseType(filtered));
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
