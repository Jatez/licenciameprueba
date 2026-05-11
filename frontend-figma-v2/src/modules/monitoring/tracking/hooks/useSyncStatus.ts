import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { TrackingSyncStatus } from "@/api/types";

export function useSyncStatus() {
  return useQuery<TrackingSyncStatus>({
    queryKey: ["sync-status"],
    queryFn: () => api.tracking.getSyncStatus(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
