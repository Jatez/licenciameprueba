/**
 * F-11 · Hook: top tracks ranked for the active filter window.
 * Backend mapping: `GET /api/metrics/top-tracks?limit&sortKey&...filter`.
 */
import { useEffect, useMemo, useState } from "react";
import { getActiveScenario, getPublicationsForScenario } from "../mocks";
import { filterPublications } from "../selectors/filterPublications";
import { computeTopTracks, type TopTrackSortKey } from "../selectors/computeTopTracks";
import type { MetricsFilter, MetricsTopTrack } from "../types";

interface UseTopTracksResult {
  data: MetricsTopTrack[] | null;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

function getLatencyMs(): number {
  const scenario = getActiveScenario();
  if (scenario === "heavy") return 1500 + Math.random() * 1500;
  return 200 + Math.random() * 300;
}

export function useTopTracks(
  filter: MetricsFilter,
  limit = 12,
  sortKey: TopTrackSortKey = "views",
): UseTopTracksResult {
  const [version, setVersion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MetricsTopTrack[] | null>(null);
  const filterKey = useMemo(() => JSON.stringify(filter), [filter]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const id = setTimeout(() => {
      if (cancelled) return;
      const all = getPublicationsForScenario(getActiveScenario());
      const filtered = filterPublications(all, filter);
      setData(computeTopTracks(filtered, limit, sortKey));
      setIsLoading(false);
    }, getLatencyMs());
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [filterKey, limit, sortKey, version, filter]);

  return {
    data,
    isLoading,
    isError: false,
    refetch: () => setVersion((v) => v + 1),
  };
}
