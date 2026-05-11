import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { TopSongSort, TopTrack } from "@/api/types.dashboard";

const VALID: TopSongSort[] = ["licenses", "impressions", "credits"];

const sortKey: Record<TopSongSort, (t: TopTrack) => number> = {
  licenses: (t) => t.licensesCount,
  impressions: (t) => t.totalImpressions,
  credits: (t) => t.creditsConsumed,
};

/**
 * Reads/writes ?top=licenses|impressions|credits and returns the sorted tracks.
 */
export function useTopTracksSort(tracks: TopTrack[]) {
  const [params, setParams] = useSearchParams();
  const raw = params.get("top");
  const sort: TopSongSort = (VALID as string[]).includes(raw ?? "")
    ? (raw as TopSongSort)
    : "licenses";

  const setSort = useCallback(
    (next: TopSongSort) => {
      const newParams = new URLSearchParams(params);
      if (next === "licenses") newParams.delete("top");
      else newParams.set("top", next);
      setParams(newParams, { replace: true });
    },
    [params, setParams],
  );

  const sorted = useMemo(
    () => [...tracks].sort((a, b) => sortKey[sort](b) - sortKey[sort](a)),
    [tracks, sort],
  );

  return { sort, setSort, sorted };
}
