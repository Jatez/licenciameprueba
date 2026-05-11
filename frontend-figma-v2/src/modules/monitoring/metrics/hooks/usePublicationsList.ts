/**
 * F-11 · Hook: paginated publications list for the active filter.
 *
 * Backend mapping: `GET /api/metrics/publications?page&pageSize&...filter`.
 */
import { useEffect, useMemo, useState } from "react";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import { filterPublications } from "../selectors/filterPublications";
import type { MetricsFilter, PublicationMetric } from "../types";

interface UsePublicationsListResult {
  data: {
    publications: PublicationMetric[];
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  } | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

function getLatencyMs(): number {
  const scenario = getActiveScenario();
  if (scenario === "heavy") return 1500 + Math.random() * 1500;
  return 200 + Math.random() * 300;
}

export function usePublicationsList(
  filter: MetricsFilter,
  page = 1,
  pageSize = 20,
): UsePublicationsListResult {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UsePublicationsListResult["data"]>(null);
  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const id = setTimeout(() => {
      if (cancelled) return;
      const all = getPublicationsForScenario(getActiveScenario());
      const filtered = filterPublications(all, filter);
      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / pageSize));
      const safePage = Math.min(Math.max(1, page), totalPages);
      const start = (safePage - 1) * pageSize;
      setData({
        publications: filtered.slice(start, start + pageSize),
        total,
        totalPages,
        page: safePage,
        pageSize,
      });
      setIsLoading(false);
    }, getLatencyMs());
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [filterKey, page, pageSize, version, filter]);

  return {
    data,
    isLoading,
    isError: false,
    refetch: () => setVersion((v) => v + 1),
  };
}
