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
  const det = d.detection as Record<string, unknown> | undefined;
  // Best detection: primary detection object
  const detectedTitle = det?.matched_title ? String(det.matched_title) : (d.track_title ? String(d.track_title) : null);
  const detectedArtist = det?.matched_artist ? String(det.matched_artist) : null;
  const detectionStatus = det?.detection_status as string | undefined;
  const confidenceScore = det?.confidence_score ? Number(det.confidence_score) : null;

  return {
    id: String(d.id),
    platform: (d.platform ?? "instagram") as SocialPlatformF06,
    externalUrl: d.external_url ? String(d.external_url) : (d.url ? String(d.url) : ""),
    externalId: d.external_media_id ? String(d.external_media_id) : (d.external_id ? String(d.external_id) : String(d.id)),
    detectedAt: String(d.posted_at ?? d.detected_at ?? d.created_at ?? new Date().toISOString()),
    publishedAt: d.posted_at ? String(d.posted_at) : d.created_at ? String(d.created_at) : null,
    matchStatus: (() => {
      const raw = (d.match_status ?? d.reconciliation_status ?? d.status ?? "") as string;
      if (raw === "matched" || raw === "matched_auto") return "matched-auto";
      if (raw === "matched_manual") return "matched-manual";
      if (raw === "unmatched" || raw === "no_match") return "no-match-found";
      if (raw === "unlinked") return "unlinked";
      if (raw === "pending-match" || raw === "pending") return "pending-match";
      // manual_review = ACRCloud detectó algo pero sin licencia vinculada → mostrar como detectado
      if (raw === "manual_review") return "no-match-found";
      if (detectionStatus === "no_match") return "no-match-found";
      if (det?.matched_track_id) return "matched-auto";
      return (raw as DetectedPost["matchStatus"]) || "pending-match";
    })(),
    licenseId: d.license_id ? String(d.license_id) : null,
    trackId: d.track_id ? String(d.track_id) : null,
    trackTitle: detectedTitle,
    confidence: confidenceScore,
    thumbnailUrl: d.thumbnail_url ? String(d.thumbnail_url) : null,
    caption: d.caption ? String(d.caption) : null,
    authorName: d.uploader ? String(d.uploader) : (d.author_name ? String(d.author_name) : null),
    authorHandle: d.uploader ? String(d.uploader) : (d.author_handle ? String(d.author_handle) : null),
    viewCount: d.views != null ? Number(d.views) : (d.view_count != null ? Number(d.view_count) : null),
    likeCount: d.likes != null ? Number(d.likes) : (d.like_count != null ? Number(d.like_count) : null),
    commentCount: d.comments != null ? Number(d.comments) : null,
    duration: d.duration != null ? Number(d.duration) : null,
    contentType: d.content_type ? String(d.content_type) : null,
    postType: (() => {
      const ct = String(d.content_type ?? "");
      if (ct.includes("reel") || ct.includes("ig_reel") || ct.includes("in_reel")) return "reel";
      if (ct.includes("story")) return "story";
      if (ct.includes("tiktok_video") || ct.includes("tiktok_photo")) return "tiktok-video";
      if (ct.includes("facebook") || ct.includes("fb_")) return "facebook-post";
      return "feed-post";
    })(),
    snapshot: {
      capturedAt: String(d.posted_at ?? d.created_at ?? new Date().toISOString()),
      thumbnailUrl: d.thumbnail_url ? String(d.thumbnail_url) : null,
      caption: d.caption ? String(d.caption) : null,
      hashtags: [],
      detectedTrackTitle: detectedTitle ?? "",
      detectedArtist: detectedArtist ?? "",
      confidenceScore,
      detectionStatus: detectionStatus ?? null,
    },
    detections: Array.isArray(d.detections) ? (d.detections as Record<string, unknown>[]).map((det) => ({
      id: String(det.id ?? ""),
      detector_provider: det.detector_provider ? String(det.detector_provider) : null,
      detection_status: det.detection_status ? String(det.detection_status) : null,
      matched_track_id: det.matched_track_id ? String(det.matched_track_id) : null,
      confidence_score: det.confidence_score != null ? Number(det.confidence_score) : null,
      matched_title: det.matched_title ? String(det.matched_title) : null,
      matched_artist: det.matched_artist ? String(det.matched_artist) : null,
      created_at: String(det.created_at ?? new Date().toISOString()),
    })) : undefined,
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
