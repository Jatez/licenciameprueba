import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/api";
import type { ListDetectedPostsRequest, ListDetectedPostsResponse } from "@/api/types";

export function useDetectedPosts(req: ListDetectedPostsRequest) {
  return useQuery<ListDetectedPostsResponse>({
    queryKey: ["detected-posts", req],
    queryFn: () => api.tracking.listDetectedPosts(req),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
