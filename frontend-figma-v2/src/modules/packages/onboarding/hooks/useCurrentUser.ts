import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import type { User } from "@/api";

export const CURRENT_USER_QUERY_KEY = ["currentUser"] as const;

/**
 * Loads the authenticated user. Source of truth for onboarding flags.
 */
export function useCurrentUser() {
  return useQuery<User>({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: () => api.auth.getCurrentUser(),
    staleTime: 60_000,
    retry: false,
  });
}
