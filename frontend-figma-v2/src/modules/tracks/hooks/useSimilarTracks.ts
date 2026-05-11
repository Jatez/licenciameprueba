import type { TrackSummary } from "@/api/types";

/** Stub — Prompt 4 implements. */
export function useSimilarTracks(_trackId: string | undefined, _limit = 6): {
  data: TrackSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return { data: undefined, isLoading: false, isError: false };
}
