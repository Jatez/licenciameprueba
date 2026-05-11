import type { SocialAccount } from "@/api/types";

export type AccountUIState =
  | "not_connected"
  | "connected"
  | "token_expired"
  | "error"
  | "permissions_revoked"
  | "duplicate_account";

/** Primary CTA action a card can request from its parent. */
export type AccountPrimaryAction =
  | "connect"
  | "manage"
  | "reconnect"
  | "retry"
  | "re_authorize"
  | "contact_support";

/**
 * Derives the visual state of a social account card from raw API data.
 *
 * Pure function — backend hand-off: when `syncStatus` semantics change,
 * adjust this single helper and every card updates automatically.
 */
export function resolveAccountState(account: SocialAccount): AccountUIState {
  if (!account.connected) return "not_connected";
  if (account.syncStatus === "permissions_revoked") return "permissions_revoked";
  if (account.syncStatus === "duplicate_account") return "duplicate_account";
  if (account.syncStatus === "token_expired") return "token_expired";
  if (account.syncStatus === "error" || account.syncStatus === "rate_limited") return "error";
  // Fallback: if a token expiration date is in the past, surface the reconnect state.
  if (account.tokenExpiresAt && new Date(account.tokenExpiresAt).getTime() < Date.now()) {
    return "token_expired";
  }
  return "connected";
}

/** Counts accounts that are healthy AND connected (used by the header pill). */
export function countConnected(accounts: SocialAccount[]): number {
  return accounts.filter((a) => resolveAccountState(a) === "connected").length;
}
