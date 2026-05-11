/**
 * Social accounts endpoints — wired to the real backend.
 *
 * Mapping:
 *   list()        → GET    /social-accounts/
 *   connect()     → POST   /social-accounts/connect
 *   reconnect()   → POST   /social-accounts/connect  (upsert semantics)
 *   disconnect()  → DELETE /social-accounts/:id
 *   setPrimary()  → no backend equivalent (no-op stub)
 */

import { http } from "@/api/http";
import type { SocialAccount, SocialPlatformF06 } from "@/api/types";
import { ConnectFlowError } from "@/api/types";

export interface ConnectOptions {
  simulatePopupBlocked?: boolean;
  simulateAccountTaken?: boolean;
  reuseAccountId?: string;
}

export interface ListOptions {
  includeErrorDemo?: boolean;
  forceInstagramExpired?: boolean;
  simulatePermissionsRevoked?: boolean;
  simulateDuplicateAccount?: boolean;
}

// ─── Adapter: backend SocialAccount → frontend SocialAccount ──────────────────

function mapAccount(a: Record<string, unknown>): SocialAccount {
  return {
    id: String(a.id),
    platform: a.platform as SocialPlatformF06,
    username: a.username ? String(a.username) : "",
    displayName: a.username ? String(a.username) : "",
    avatarUrl: null,
    connected: a.status === "connected",
    connectedAt: String(a.created_at ?? new Date().toISOString()),
    tokenExpiresAt: a.token_expires_at ? String(a.token_expires_at) : null,
    syncStatus: a.status === "connected" ? "ok" : ("disconnected" as SocialAccount["syncStatus"]),
    lastSyncAt: String(a.created_at ?? new Date().toISOString()),
    isPrimary: false, // backend has no isPrimary concept
  };
}

// ─── Feed types ───────────────────────────────────────────────────────────────

export interface SocialFeedPost {
  id: string;
  platform: SocialPlatformF06;
  accountId: string;
  caption: string | null;
  mediaUrl: string | null;
  thumbnailUrl: string | null;
  permalink: string | null;
  publishedAt: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
}

function mapFeedPost(p: Record<string, unknown>): SocialFeedPost {
  return {
    id: String(p.id),
    platform: (p.platform ?? "instagram") as SocialPlatformF06,
    accountId: String(p.account_id ?? ""),
    caption: p.caption ? String(p.caption) : null,
    mediaUrl: p.media_url ? String(p.media_url) : null,
    thumbnailUrl: p.thumbnail_url ? String(p.thumbnail_url) : null,
    permalink: p.permalink ? String(p.permalink) : null,
    publishedAt: String(p.published_at ?? p.created_at ?? new Date().toISOString()),
    likesCount: Number(p.likes_count ?? p.like_count ?? 0),
    commentsCount: Number(p.comments_count ?? p.comment_count ?? 0),
    viewsCount: Number(p.views_count ?? p.view_count ?? p.play_count ?? 0),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const socialApi = {
  async list(_options: ListOptions = {}): Promise<SocialAccount[]> {
    let rawAccounts: Record<string, unknown>[] = [];
    try {
      const res = await http.get("/social-accounts/");
      const raw = res.data;
      rawAccounts = Array.isArray(raw)
        ? (raw as Record<string, unknown>[])
        : Array.isArray((raw as Record<string, unknown>)?.results)
          ? ((raw as Record<string, unknown>).results as Record<string, unknown>[])
          : [];
    } catch {
      return [];
    }
    const accounts = rawAccounts.map(mapAccount);
    // Mark first connected account per platform as primary
    const seen = new Set<string>();
    return accounts.map((a) => {
      if (a.connected && !seen.has(a.platform)) {
        seen.add(a.platform);
        return { ...a, isPrimary: true };
      }
      return a;
    });
  },

  async connect(
    platform: SocialPlatformF06,
    options: ConnectOptions = {},
  ): Promise<SocialAccount> {
    if (options.simulatePopupBlocked) {
      throw new ConnectFlowError("popup_blocked");
    }
    if (options.simulateAccountTaken) {
      throw new ConnectFlowError("account_taken");
    }

    // For real OAuth connect, the flow goes through the OAuth redirect.
    // Here we POST to /social-accounts/connect with a placeholder.
    const res = await http.post("/social-accounts/connect", {
      platform,
      external_account_id: options.reuseAccountId ?? `${platform}_${Date.now()}`,
      username: "",
    });
    return mapAccount(res.data as Record<string, unknown>);
  },

  async reconnect(accountId: string, options: ConnectOptions = {}): Promise<SocialAccount> {
    // Fetch existing account first to get platform
    const listRes = await http.get("/social-accounts/");
    const raw = listRes.data;
    const accounts = Array.isArray(raw)
      ? (raw as Record<string, unknown>[])
      : Array.isArray((raw as Record<string, unknown>)?.results)
        ? ((raw as Record<string, unknown>).results as Record<string, unknown>[])
        : [];
    const existing = accounts.find((a) => String(a.id) === accountId);
    if (!existing) throw new Error(`Account ${accountId} not found`);

    return socialApi.connect(existing.platform as SocialPlatformF06, {
      ...options,
      reuseAccountId: accountId,
    });
  },

  async disconnect(accountId: string): Promise<{ id: string }> {
    await http.delete(`/social-accounts/${accountId}`);
    return { id: accountId };
  },

  async setPrimary(_accountId: string): Promise<{ id: string }> {
    // No backend endpoint for setting primary account.
    return { id: _accountId };
  },

  /**
   * Returns the OAuth URL for a platform, or null if not configured on the backend.
   * instagram → GET /auth/meta/login
   * facebook  → GET /auth/meta/fb-login
   * tiktok    → GET /auth/tiktok/login
   */
  async getOAuthUrl(platform: SocialPlatformF06): Promise<string | null> {
    const urlMap: Record<SocialPlatformF06, string> = {
      instagram: "/auth/meta/login",
      facebook: "/auth/meta/fb-login",
      tiktok: "/auth/tiktok/login",
    };
    try {
      const res = await http.get<{ auth_url: string }>(urlMap[platform]);
      return res.data?.auth_url ?? null;
    } catch {
      return null; // 503 = not configured, fall back to simulator
    }
  },

  /** Check if real OAuth is configured for a platform. */
  async isOAuthConfigured(platform: SocialPlatformF06): Promise<boolean> {
    const statusMap: Record<SocialPlatformF06, string> = {
      instagram: "/auth/meta/status",
      facebook: "/auth/meta/status",
      tiktok: "/auth/tiktok/status",
    };
    try {
      const res = await http.get<{ configured: boolean }>(statusMap[platform]);
      return res.data?.configured ?? false;
    } catch {
      return false;
    }
  },

  /**
   * GET /social-accounts/:account_id/feed
   * Returns the latest posts/publications for a connected account.
   */
  async getFeed(accountId: string, limit: number = 10): Promise<SocialFeedPost[]> {
    try {
      const res = await http.get(`/social-accounts/${accountId}/feed`, {
        params: { limit },
      });
      const data = res.data;
      const items: Record<string, unknown>[] = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as Record<string, unknown>[])
          : Array.isArray((data as Record<string, unknown>)?.items)
            ? ((data as Record<string, unknown>).items as Record<string, unknown>[])
            : [];
      return items.map(mapFeedPost);
    } catch {
      return [];
    }
  },
};
