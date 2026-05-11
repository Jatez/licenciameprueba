import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socialApi, type ConnectOptions } from "@/api/endpoints/social";
import type { SocialPlatformF06 } from "@/api/types";

const STALE_MS = 30_000;

interface UseSocialAccountsOptions {
  includeErrorDemo?: boolean;
  forceInstagramExpired?: boolean;
  simulatePermissionsRevoked?: boolean;
  simulateDuplicateAccount?: boolean;
}

export function useSocialAccounts({
  includeErrorDemo = false,
  forceInstagramExpired = false,
  simulatePermissionsRevoked = false,
  simulateDuplicateAccount = false,
}: UseSocialAccountsOptions = {}) {
  return useQuery({
    queryKey: [
      "social",
      "accounts",
      {
        includeErrorDemo,
        forceInstagramExpired,
        simulatePermissionsRevoked,
        simulateDuplicateAccount,
      },
    ],
    queryFn: () =>
      socialApi.list({
        includeErrorDemo,
        forceInstagramExpired,
        simulatePermissionsRevoked,
        simulateDuplicateAccount,
      }),
    staleTime: STALE_MS,
  });
}

export interface ConnectMutationVars {
  platform: SocialPlatformF06;
  options?: ConnectOptions;
}

/**
 * Mutation that simulates completing the OAuth callback. On success it
 * invalidates the accounts list so connected cards reflect the new state.
 */
export function useConnectSocialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ platform, options }: ConnectMutationVars) =>
      socialApi.connect(platform, options),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
}

export interface ReconnectMutationVars {
  accountId: string;
  options?: ConnectOptions;
}

export function useReconnectSocialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, options }: ReconnectMutationVars) =>
      socialApi.reconnect(accountId, options),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
}

export function useDisconnectSocialAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => socialApi.disconnect(accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
}

export function useSetPrimaryAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => socialApi.setPrimary(accountId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["social", "accounts"] });
    },
  });
}
