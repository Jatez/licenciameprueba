import { useQuery } from "@tanstack/react-query";
import { socialApi } from "@/api/endpoints/social";
import type { SocialFeedPost } from "@/api/endpoints/social";

export { SocialFeedPost };

export function useAccountFeed(accountId: string | null | undefined, limit = 6) {
  return useQuery({
    queryKey: ["social", "feed", accountId, limit],
    queryFn: () => socialApi.getFeed(accountId!, limit),
    enabled: Boolean(accountId),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: false,
  });
}
