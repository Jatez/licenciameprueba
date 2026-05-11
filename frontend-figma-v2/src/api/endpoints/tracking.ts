/**
 * Tracking endpoints — wired to the real backend.
 *
 * Mapping:
 *   listDetectedPosts()          → GET  /monitoring/contents  (with filters)
 *   getPostById()                → GET  /monitoring/contents/:id
 *   getLicenseAssociatedContent() → GET  /monitoring/contents?license_id=:id
 *   linkPostManually()           → POST /monitoring/contents/:id/resolve  (manual match)
 *   unlinkPost()                 → POST /monitoring/contents/:id/resolve  (unlink)
 *   getSyncStatus()              → no backend endpoint → stub
 *   triggerManualSync()          → POST /monitoring/sync/:social_account_id
 *   dev_triggerDetection()       → DEV only stub
 *   dev_triggerError()           → DEV only stub
 */

import { http } from "@/api/http";
import type {
  DetectedPost,
  LicenseAssociatedContent,
  ListDetectedPostsRequest,
  ListDetectedPostsResponse,
  ManualLinkRequest,
  ManualLinkResponse,
  SocialPlatformF06,
  TrackingSyncStatus,
  UnlinkPostRequest,
  UnlinkPostResponse,
} from "@/api/types";

// ─── Adapter ──────────────────────────────────────────────────────────────────

function mapPost(d: Record<string, unknown>): DetectedPost {
  return {
    id: String(d.id),
    platform: (d.platform ?? "instagram") as SocialPlatformF06,
    externalUrl: d.url ? String(d.url) : "",
    externalId: d.external_id ? String(d.external_id) : String(d.id),
    detectedAt: String(d.detected_at ?? d.created_at ?? new Date().toISOString()),
    matchStatus: (d.match_status ?? d.status ?? "pending-match") as DetectedPost["matchStatus"],
    licenseId: d.license_id ? String(d.license_id) : null,
    trackId: d.track_id ? String(d.track_id) : null,
    trackTitle: d.track_title ? String(d.track_title) : null,
    confidence: d.confidence ? Number(d.confidence) : null,
    thumbnailUrl: d.thumbnail_url ? String(d.thumbnail_url) : null,
    caption: d.caption ? String(d.caption) : null,
    authorName: d.author_name ? String(d.author_name) : null,
    authorHandle: d.author_handle ? String(d.author_handle) : null,
    viewCount: d.view_count ? Number(d.view_count) : null,
    likeCount: d.like_count ? Number(d.like_count) : null,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const trackingApi = {
  async listDetectedPosts(req: ListDetectedPostsRequest): Promise<ListDetectedPostsResponse> {
    const params: Record<string, unknown> = {
      limit: req.pageSize,
      offset: (req.page - 1) * req.pageSize,
    };
    if (req.platforms?.length) params.platform = req.platforms.join(",");
    if (req.filter && req.filter !== "all") params.match_status = req.filter;
    if (req.dateRange?.from) params.from = req.dateRange.from;
    if (req.dateRange?.to) params.to = req.dateRange.to;

    const res = await http.get("/monitoring/contents", { params });
    const data = res.data as Record<string, unknown> | unknown[];

    let posts: DetectedPost[];
    let total: number;

    if (Array.isArray(data)) {
      posts = data.map((d) => mapPost(d as Record<string, unknown>));
      total = posts.length;
    } else {
      const d = data as Record<string, unknown>;
      const rawList = d.results ?? d.items ?? d.contents ?? [];
      posts = (Array.isArray(rawList) ? rawList as Record<string, unknown>[] : []).map(mapPost);
      total = Number(d.total ?? posts.length);
    }

    const totalPages = Math.max(1, Math.ceil(total / req.pageSize));

    const allPosts = posts; // aggregates from current page (limited approximation)
    const aggregates = {
      pendingMatch: allPosts.filter((p) => p.matchStatus === "pending-match").length,
      matchedAuto: allPosts.filter((p) => p.matchStatus === "matched-auto").length,
      matchedManual: allPosts.filter((p) => p.matchStatus === "matched-manual").length,
      noMatchFound: allPosts.filter((p) => p.matchStatus === "no-match-found").length,
      unlinked: allPosts.filter((p) => p.matchStatus === "unlinked").length,
    };

    return {
      posts,
      page: req.page,
      pageSize: req.pageSize,
      totalPosts: total,
      totalPages,
      aggregates,
      syncStatus: await trackingApi.getSyncStatus(),
    };
  },

  async getPostById(postId: string): Promise<DetectedPost> {
    const res = await http.get(`/monitoring/contents/${postId}`);
    return mapPost(res.data as Record<string, unknown>);
  },

  async getLicenseAssociatedContent(licenseId: string): Promise<LicenseAssociatedContent> {
    try {
      const res = await http.get("/monitoring/contents", {
        params: { license_id: licenseId, limit: 100 },
      });
      const data = res.data;
      const items = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : Array.isArray((data as Record<string, unknown>)?.results)
          ? ((data as Record<string, unknown>).results as Record<string, unknown>[])
          : Array.isArray((data as Record<string, unknown>)?.items)
            ? ((data as Record<string, unknown>).items as Record<string, unknown>[])
            : [];
      const posts = items.map((d) => mapPost(d));
      return { licenseId, posts, canLinkManually: true };
    } catch {
      return { licenseId, posts: [], canLinkManually: true };
    }
  },

  async linkPostManually(req: ManualLinkRequest): Promise<ManualLinkResponse> {
    try {
      const res = await http.post(`/monitoring/contents/${req.contentId ?? "new"}/resolve`, {
        license_id: req.licenseId,
        external_url: req.externalUrl,
        resolution: "manual-match",
      });
      const post = mapPost(res.data as Record<string, unknown>);
      return { post, success: true };
    } catch {
      // Endpoint may not exist — return stub
      return {
        post: mapPost({ id: req.contentId ?? "unknown", license_id: req.licenseId }),
        success: false,
      };
    }
  },

  async unlinkPost(req: UnlinkPostRequest): Promise<UnlinkPostResponse> {
    try {
      const res = await http.post(`/monitoring/contents/${req.postId}/resolve`, {
        resolution: "unlink",
        reason: req.reason,
      });
      const post = mapPost(res.data as Record<string, unknown>);
      return { post, success: true };
    } catch {
      return {
        post: mapPost({ id: req.postId, match_status: "unlinked" }),
        success: false,
      };
    }
  },

  async getSyncStatus(): Promise<TrackingSyncStatus> {
    try {
      const res = await http.get("/monitoring/sync-status");
      const d = res.data as {
        status: string;
        last_sync_at: string | null;
        accounts_syncing: number;
        accounts_with_errors: number;
        total_accounts: number;
      };
      const overallStatus: TrackingSyncStatus["overallStatus"] =
        d.status === "ok" ? "healthy" : d.status === "partial" ? "degraded" : "unavailable";
      return {
        platforms: [],
        overallStatus,
        autoSyncEnabled: true,
      };
    } catch {
      return {
        platforms: [],
        overallStatus: "unavailable",
        autoSyncEnabled: false,
      };
    }
  },

  async triggerManualSync(): Promise<{ triggered: boolean; expectedDurationMs: number }> {
    try {
      // POST /monitoring/sync/:social_account_id — requires account ID.
      // We trigger sync for all connected accounts (fire-and-forget).
      const accountsRes = await http.get("/social-accounts/");
      const rawAccounts = accountsRes.data;
      const accounts = Array.isArray(rawAccounts)
        ? (rawAccounts as Record<string, unknown>[])
        : Array.isArray((rawAccounts as Record<string, unknown>)?.results)
          ? ((rawAccounts as Record<string, unknown>).results as Record<string, unknown>[])
          : [];
      const connected = accounts.filter((a) => a.status === "connected");
      await Promise.allSettled(
        connected.map((a) => http.post(`/monitoring/sync/${a.id}`, {})),
      );
      return { triggered: true, expectedDurationMs: connected.length * 5_000 };
    } catch {
      return { triggered: false, expectedDurationMs: 0 };
    }
  },

  // ─── Dev-only ──────────────────────────────────────────────────────────────

  async dev_triggerDetection(options: Record<string, unknown> = {}): Promise<DetectedPost> {
    if (!import.meta.env.DEV) {
      throw new Error("PLATFORM_SYNC_UNAVAILABLE: Solo disponible en desarrollo.");
    }
    const res = await http.post("/monitoring/identify", {
      simulate: true,
      ...options,
    });
    return mapPost(res.data as Record<string, unknown>);
  },

  async dev_triggerError(
    platform: SocialPlatformF06,
    errorType: string,
  ): Promise<{ triggered: boolean }> {
    if (!import.meta.env.DEV) {
      throw new Error("PLATFORM_SYNC_UNAVAILABLE: Solo disponible en desarrollo.");
    }
    console.warn(`[DEV] Simulating tracking error: ${errorType} on ${platform}`);
    return { triggered: true };
  },
};
