/**
 * Pure helpers for the Manage Accounts drawer.
 *
 * Exported separately so the drawer stays under 250 lines and the grouping
 * logic can be unit-tested without rendering React.
 */
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";

export function filterByPlatform(
  accounts: SocialAccount[] | undefined,
  platform: SocialPlatformF06,
): SocialAccount[] {
  return (accounts ?? []).filter((a) => a.platform === platform && a.connected);
}

export function findPrimary(accounts: SocialAccount[]): SocialAccount | undefined {
  return accounts.find((a) => a.isPrimary) ?? accounts[0];
}

export function avatarInitial(account: SocialAccount): string {
  const source = account.username || account.displayName || "L";
  const cleaned = source.replace(/^@/, "").trim();
  return (cleaned[0] ?? "L").toUpperCase();
}
