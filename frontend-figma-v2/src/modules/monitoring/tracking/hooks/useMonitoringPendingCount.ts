/**
 * Lightweight count of pending-match posts for the sidebar badge.
 * Reuses the same query key as the feed (page 1, 25-pageSize) so the data is
 * shared from cache when the user is already on /monitoring.
 */
import { useDetectedPosts } from "./useDetectedPosts";

export function useMonitoringPendingCount(): number {
  const { data } = useDetectedPosts({
    filter: "pending-match",
    platforms: [],
    dateRange: { from: null, to: null },
    page: 1,
    pageSize: 25,
  });
  return data?.aggregates.pendingMatch ?? 0;
}
