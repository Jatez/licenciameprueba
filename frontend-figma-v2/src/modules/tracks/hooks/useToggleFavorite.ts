import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/api";
import type {
  CatalogPageResponse,
  ToggleFavoriteResponse,
  TrackDetailResponse,
  TrackSummary,
} from "@/api/types";
import { playerStrings } from "@/modules/packages/player/strings";

interface MutationContext {
  prevCatalogQueries: Array<[readonly unknown[], CatalogPageResponse | undefined]>;
  prevDetail: TrackDetailResponse | undefined;
  prevDetailKey: readonly unknown[];
}

/**
 * Toggles the favourite flag on a track with optimistic updates against:
 *  - any cached `["catalog", ...]` query (page response).
 *  - the `["track", id]` detail query if loaded.
 *
 * On failure, rolls back and shows a toast.
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation<ToggleFavoriteResponse, Error, string, MutationContext>({
    mutationFn: (trackId: string) => api.catalog.toggleFavorite({ trackId }),
    onMutate: async (trackId) => {
      await queryClient.cancelQueries({ queryKey: ["catalog"] });
      await queryClient.cancelQueries({ queryKey: ["track", trackId] });

      const prevCatalogQueries = queryClient.getQueriesData<CatalogPageResponse>({
        queryKey: ["catalog"],
      });
      const prevDetailKey = ["track", trackId] as const;
      const prevDetail = queryClient.getQueryData<TrackDetailResponse>(prevDetailKey);

      // Optimistically flip in every catalog page snapshot.
      for (const [key, value] of prevCatalogQueries) {
        if (!value) continue;
        const nextTracks = value.tracks.map((t: TrackSummary) =>
          t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t,
        );
        queryClient.setQueryData<CatalogPageResponse>(key, { ...value, tracks: nextTracks });
      }

      if (prevDetail) {
        queryClient.setQueryData<TrackDetailResponse>(prevDetailKey, {
          ...prevDetail,
          track: { ...prevDetail.track, isFavorite: !prevDetail.track.isFavorite },
        });
      }

      return { prevCatalogQueries, prevDetail, prevDetailKey };
    },
    onError: (_err, _trackId, context) => {
      if (!context) return;
      for (const [key, value] of context.prevCatalogQueries) {
        queryClient.setQueryData(key, value);
      }
      if (context.prevDetail) {
        queryClient.setQueryData(context.prevDetailKey, context.prevDetail);
      }
      toast.error(playerStrings.error.favoriteFailed);
    },
    onSettled: (_data, _err, trackId) => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["track", trackId] });
    },
  });
}
