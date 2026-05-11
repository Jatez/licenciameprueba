import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { activityApi } from "@/api/endpoints";
import type { UserActivityType } from "@/api/types.dashboard";

export interface ActivityFilters {
  from?: string;
  to?: string;
  types?: UserActivityType[];
  actors?: string[];
}

const PAGE_SIZE = 25;

export function useActivityFeed(filters: ActivityFilters) {
  return useInfiniteQuery({
    queryKey: ["activity", filters],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) =>
      activityApi.listActivity({ ...filters, cursor: pageParam, pageSize: PAGE_SIZE }),
    getNextPageParam: (last) => last.next_cursor,
    staleTime: 15_000,
  });
}

export function useActivityActors() {
  return useQuery({
    queryKey: ["activity", "actors"],
    queryFn: () => activityApi.listActivityActors(),
    staleTime: 5 * 60_000,
  });
}