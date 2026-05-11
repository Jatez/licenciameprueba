/**
 * Social account mocks (F-07).
 *
 * Edit this file to demo different states. Backend will replace with real
 * data sourced from the `user_social_accounts` table once OAuth lands.
 *
 * Seeded scenarios mirror the F-07 step 1 brief:
 *  - Instagram → connected & healthy
 *  - TikTok → not connected
 *  - Facebook → token expired
 *
 * To exercise the `error` UI state, append an entry from `ERROR_DEMO_ACCOUNT`
 * (used by the page when `?demo=error` is present in the URL).
 */
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

const now = Date.now();

export const SOCIAL_ACCOUNTS_SEED: SocialAccount[] = [
  {
    id: "sa_instagram_primary",
    platform: "instagram",
    username: "@licenciame.music",
    displayName: "Licénciame Music",
    avatarUrl: null,
    connected: true,
    connectedAt: new Date(now - 12 * DAY_MS).toISOString(),
    tokenExpiresAt: new Date(now + 45 * DAY_MS).toISOString(),
    syncStatus: "ok",
    lastSyncAt: new Date(now - 2 * HOUR_MS).toISOString(),
    isPrimary: true,
  },
  {
    id: "sa_tiktok_primary",
    platform: "tiktok",
    username: "",
    displayName: "",
    avatarUrl: null,
    connected: false,
    connectedAt: null,
    tokenExpiresAt: null,
    syncStatus: "ok",
    lastSyncAt: null,
  },
  {
    id: "sa_facebook_primary",
    platform: "facebook",
    username: "@licenciame.oficial",
    displayName: "Licénciame Oficial",
    avatarUrl: null,
    connected: true,
    // Connected ~60 days ago, token expired on a fixed past date for stable copy.
    connectedAt: new Date(now - 60 * DAY_MS).toISOString(),
    tokenExpiresAt: new Date(new Date().getFullYear(), 3, 18).toISOString(), // 18 abr
    syncStatus: "token_expired",
    lastSyncAt: new Date(now - 5 * DAY_MS).toISOString(),
    isPrimary: true,
  },
];

/**
 * Inserts or updates a mock account in memory so the simulated OAuth flow
 * (F-07 paso 2) can persist newly "connected" accounts across refetches
 * without round-tripping through a real backend.
 *
 * Backend hand-off: replace with an INSERT/UPDATE on `user_social_accounts`.
 */
export function upsertMockAccount(account: SocialAccount): void {
  const idx = SOCIAL_ACCOUNTS_SEED.findIndex((a) => a.id === account.id);
  if (idx >= 0) {
    SOCIAL_ACCOUNTS_SEED[idx] = account;
    return;
  }
  // Ensure only one primary per platform when inserting a new account.
  if (account.isPrimary) {
    SOCIAL_ACCOUNTS_SEED.forEach((a, i) => {
      if (a.platform === account.platform) {
        SOCIAL_ACCOUNTS_SEED[i] = { ...a, isPrimary: false };
      }
    });
  }
  SOCIAL_ACCOUNTS_SEED.push(account);
}

/** Removes an account by id (used by "Desconectar"). */
export function removeMockAccount(id: string): void {
  const idx = SOCIAL_ACCOUNTS_SEED.findIndex((a) => a.id === id);
  if (idx < 0) return;
  const [removed] = SOCIAL_ACCOUNTS_SEED.splice(idx, 1);
  // If we deleted the primary, promote the next remaining account on the same platform.
  if (removed?.isPrimary) {
    const next = SOCIAL_ACCOUNTS_SEED.find((a) => a.platform === removed.platform);
    if (next) next.isPrimary = true;
  }
}

/** Sets a single account as primary for its platform; clears the flag elsewhere. */
export function setPrimaryAccount(platform: SocialPlatformF06, id: string): void {
  SOCIAL_ACCOUNTS_SEED.forEach((a, i) => {
    if (a.platform === platform) {
      SOCIAL_ACCOUNTS_SEED[i] = { ...a, isPrimary: a.id === id };
    }
  });
}

/** Optional demo entry to exercise the `error` UI state. */
export const ERROR_DEMO_ACCOUNT: SocialAccount = {
  id: "sa_instagram_error_demo",
  platform: "instagram",
  username: "@licenciame.studio",
  displayName: "Licénciame Studio",
  avatarUrl: null,
  connected: true,
  connectedAt: new Date(now - 30 * DAY_MS).toISOString(),
  tokenExpiresAt: new Date(now + 30 * DAY_MS).toISOString(),
  syncStatus: "error",
  lastSyncAt: new Date(now - 8 * HOUR_MS).toISOString(),
};

/**
 * Demo entry for the `permissions_revoked` UI state — the user revoked
 * permissions from Facebook's settings, so we cannot pull data anymore.
 * Backend hand-off: surfaced when the platform's API responds with the
 * "OAuthException — invalid token (revoked)" error class.
 */
export const PERMISSIONS_REVOKED_DEMO_ACCOUNT: SocialAccount = {
  id: "sa_facebook_revoked_demo",
  platform: "facebook",
  username: "@licenciame.studio",
  displayName: "Licénciame Studio",
  avatarUrl: null,
  connected: true,
  connectedAt: new Date(now - 90 * DAY_MS).toISOString(),
  tokenExpiresAt: null,
  syncStatus: "permissions_revoked",
  lastSyncAt: new Date(now - 3 * DAY_MS).toISOString(),
};

/**
 * Demo entry for the `duplicate_account` UI state — the same handle is
 * already linked to a different company. Backend hand-off: this is a hard
 * constraint at the DB level (unique on platform + external_user_id).
 */
export const DUPLICATE_ACCOUNT_DEMO_ACCOUNT: SocialAccount = {
  id: "sa_tiktok_duplicate_demo",
  platform: "tiktok",
  username: "@discos.fuentes.oficial",
  displayName: "Discos Fuentes Oficial",
  avatarUrl: null,
  connected: true,
  connectedAt: new Date(now - 14 * DAY_MS).toISOString(),
  tokenExpiresAt: new Date(now + 30 * DAY_MS).toISOString(),
  syncStatus: "duplicate_account",
  lastSyncAt: null,
};
