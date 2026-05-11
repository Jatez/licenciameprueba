import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { isApiError } from "@/api/client";
import type { TrackDetailResponse } from "@/api/types";

const NON_RETRYABLE_CODES = new Set(["TRACK_NOT_FOUND", "TRACK_REMOVED"]);

/**
 * Fetches full track detail. Uses the `["track", id]` cache key so
 * `useToggleFavorite` can patch it optimistically.
 */
export function useTrackDetail(id: string | undefined) {
  return useQuery<TrackDetailResponse>({
    queryKey: ["track", id],
    queryFn: () => api.catalog.getTrackById(id!),
    enabled: !!id,
    staleTime: 2 * 60_000,
    retry: (failureCount, error) => {
      if (isApiError(error) && NON_RETRYABLE_CODES.has(error.code)) return false;
      return failureCount < 2;
    },
  });
}
