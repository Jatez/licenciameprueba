/**
 * In-memory tracking simulator (DEV-only by default).
 *
 * Singleton. Wraps a setInterval-driven `tick()` that:
 *  1. Probabilistically generates a DetectedPost from the active license pool.
 *  2. Runs `attemptMatch()` and emits the appropriate event.
 *  3. Expires ephemeral evidence (stories) past their window.
 *
 * Resilient: every tick is wrapped in try/catch so internal errors never
 * tear down the host browser.
 *
 * Backend hand-off: replace `tick()` with real polling/webhooks against
 * Meta Graph + TikTok Display APIs. Public method shapes should remain stable
 * so the UI keeps working.
 */
import type {
  DetectedPost,
  License,
  ManualLinkRequest,
  ManualLinkResponse,
  SocialPlatformF06,
  TrackingSyncStatus,
  UnlinkPostRequest,
  UnlinkPostResponse,
} from "@/api/types";
import { licensingApi } from "@/api/endpoints/licensing";
import { attemptMatch } from "./matchingEngine";
import {
  buildTrackPoolFromLicenses,
  generateDetectedPost,
} from "./postGenerator";
import { buildSeedPosts } from "./seedPosts";
import type {
  ForceDetectionOptions,
  TrackingEvent,
  TrackingEventHandler,
  TrackingSimulatorConfig,
} from "./trackingSimulator.types";

const DEFAULT_CONFIG: TrackingSimulatorConfig = {
  enabled: true,
  autoDetectIntervalMs: 60_000,
  forceNoMatchRate: 0.1,
  forceErrorRate: 0.05,
  simulateRateLimits: false,
  ephemeralStoryLifetimeMs: 24 * 60 * 60 * 1000,
};

const DETECTION_PROBABILITY = 0.4;
const MAX_RECENT_EVENTS = 200;

class TrackingSimulator {
  private config: TrackingSimulatorConfig = { ...DEFAULT_CONFIG };
  private intervalHandle: ReturnType<typeof setInterval> | null = null;
  private subscribers = new Set<TrackingEventHandler>();
  private detectedPosts: DetectedPost[] = [];
  private licenses: License[] = [];
  private licensesLoaded = false;
  private recentEvents: TrackingEvent[] = [];
  private syncStatus: TrackingSyncStatus = buildHealthySyncStatus();
  private seeded = false;

  // ─── Lifecycle ───────────────────────────────────────────────────────────

  async start(): Promise<void> {
    if (this.intervalHandle != null) return;
    this.config.enabled = true;
    await this.refreshLicenses();
    this.seedIfNeeded();
    this.intervalHandle = setInterval(() => {
      void this.tickSafe();
    }, this.config.autoDetectIntervalMs);
  }

  stop(): void {
    if (this.intervalHandle != null) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.config.enabled = false;
  }

  isRunning(): boolean {
    return this.intervalHandle != null;
  }

  updateConfig(partial: Partial<TrackingSimulatorConfig>): void {
    const wasRunning = this.isRunning();
    this.config = { ...this.config, ...partial };
    if (wasRunning) {
      this.stop();
      void this.start();
    }
  }

  getConfig(): TrackingSimulatorConfig {
    return { ...this.config };
  }

  // ─── Subscriptions ───────────────────────────────────────────────────────

  subscribe(handler: TrackingEventHandler): () => void {
    this.subscribers.add(handler);
    return () => {
      this.subscribers.delete(handler);
    };
  }

  private emit(event: TrackingEvent): void {
    this.recentEvents.unshift(event);
    if (this.recentEvents.length > MAX_RECENT_EVENTS) {
      this.recentEvents.length = MAX_RECENT_EVENTS;
    }
    for (const handler of this.subscribers) {
      try {
        handler(event);
      } catch (err) {
        // never let a subscriber error tear down the simulator
         
        console.warn("[trackingSimulator] subscriber error", err);
      }
    }
  }

  // ─── Reads ───────────────────────────────────────────────────────────────

  getAllPosts(): DetectedPost[] {
    return this.detectedPosts.slice();
  }

  getPostById(postId: string): DetectedPost | null {
    return this.detectedPosts.find((p) => p.id === postId) ?? null;
  }

  getPostsByLicense(licenseId: string): DetectedPost[] {
    return this.detectedPosts.filter((p) => p.licenseId === licenseId);
  }

  getRecentEvents(): TrackingEvent[] {
    return this.recentEvents.slice(0, 20);
  }

  getSyncStatus(): TrackingSyncStatus {
    return JSON.parse(JSON.stringify(this.syncStatus));
  }

  clearRecentEvents(): void {
    this.recentEvents = [];
  }

  // ─── Manual operations ───────────────────────────────────────────────────

  async manuallyLinkPost(request: ManualLinkRequest): Promise<ManualLinkResponse> {
    await this.refreshLicenses();
    const license = this.licenses.find((l) => l.id === request.licenseId);
    if (!license) {
      throw Object.assign(new Error("Licencia no encontrada o no elegible."), { code: "LICENSE_NOT_ELIGIBLE" });
    }

    const trackPool = [
      {
        trackId: license.trackId,
        title: license.trackSnapshot.title,
        artist: license.trackSnapshot.artist,
        coverUrl: license.trackSnapshot.coverUrl,
      },
    ];
    const generated = generateDetectedPost({
      trackOptions: trackPool,
      platform: request.platform,
      postType: request.postType,
      publishedAt: request.publishedAt,
    });
    const post: DetectedPost = {
      ...generated,
      externalUrl: request.externalUrl,
      licenseId: license.id,
      matchStatus: "matched-manual",
      matchMethod: "manual",
      matchConfidence: 1,
      linkedByUserId: "user-mock-001",
      linkedAt: new Date().toISOString(),
    };
    this.detectedPosts.unshift(post);
    this.emit({ type: "post-linked-manually", post, license, at: new Date().toISOString() });
    return { post, license };
  }

  async unlinkPost(request: UnlinkPostRequest): Promise<UnlinkPostResponse> {
    const idx = this.detectedPosts.findIndex((p) => p.id === request.postId);
    if (idx < 0) {
      throw Object.assign(new Error("Publicación no encontrada."), { code: "POST_NOT_FOUND" });
    }
    const previous = this.detectedPosts[idx];
    const updated: DetectedPost = {
      ...previous,
      matchStatus: "unlinked",
      unlinkReason: request.reason,
      licenseId: previous.licenseId, // keep for audit; UI shows "unlinked"
    };
    this.detectedPosts[idx] = updated;
    await this.refreshLicenses();
    const license = this.licenses.find((l) => l.id === previous.licenseId);
    this.emit({ type: "post-unlinked", post: updated, at: new Date().toISOString() });
    return { post: updated, license: license ?? buildPlaceholderLicense(previous.licenseId) };
  }

  // ─── Dev triggers ────────────────────────────────────────────────────────

  async triggerDetection(options: ForceDetectionOptions = {}): Promise<DetectedPost> {
    await this.refreshLicenses();
    const trackPool = buildTrackPoolFromLicenses(this.licenses);
    const post = generateDetectedPost({
      trackOptions: trackPool,
      platform: options.platform,
      postType: options.postType,
      evidenceLifetimeOverrideMs: options.forceImmediateExpiration ? 10_000 : undefined,
    });
    this.processNewDetection(post, { forceNoMatch: options.forceNoMatch });
    return post;
  }

  triggerError(platform: SocialPlatformF06, errorType: string): void {
    const platformEntry = this.syncStatus.platforms.find((p) => p.platform === platform);
    if (platformEntry) {
      platformEntry.status =
        errorType === "rate_limited"
          ? "rate_limited"
          : errorType === "token_expired"
            ? "token_expired"
            : "error";
      platformEntry.errorMessage = errorType;
      platformEntry.lastSyncAt = new Date().toISOString();
    }
    this.recomputeOverallStatus();
    this.emit({
      type: "sync-error",
      platform,
      error: errorType,
      at: new Date().toISOString(),
    });
  }

  // ─── Internal: tick & helpers ────────────────────────────────────────────

  private async tickSafe(): Promise<void> {
    try {
      await this.tick();
    } catch (err) {
       
      console.warn("[trackingSimulator] tick error", err);
    }
  }

  private async tick(): Promise<void> {
    if (!this.config.enabled) return;
    this.expireEphemeralPosts();

    if (Math.random() < this.config.forceErrorRate) {
      const platform: SocialPlatformF06 = pickRandom(["instagram", "tiktok", "facebook"]);
      this.triggerError(platform, "rate_limited");
      return;
    }

    if (Math.random() >= DETECTION_PROBABILITY) return;
    await this.refreshLicenses();
    const trackPool = buildTrackPoolFromLicenses(this.licenses);
    if (!trackPool.length) return;

    const forceNoMatch = Math.random() < this.config.forceNoMatchRate;
    const post = generateDetectedPost({ trackOptions: trackPool });
    this.processNewDetection(post, { forceNoMatch });
  }

  private processNewDetection(
    post: DetectedPost,
    options: { forceNoMatch?: boolean } = {},
  ): void {
    this.emit({ type: "post-detected", post, at: new Date().toISOString() });

    if (options.forceNoMatch) {
      const noMatchPost: DetectedPost = { ...post, matchStatus: "no-match-found" };
      this.detectedPosts.unshift(noMatchPost);
      this.emit({ type: "post-no-match", post: noMatchPost, at: new Date().toISOString() });
      return;
    }

    const result = attemptMatch(post, this.licenses);
    if (result.matched && result.licenseId) {
      const license = this.licenses.find((l) => l.id === result.licenseId);
      const matchedPost: DetectedPost = {
        ...post,
        licenseId: result.licenseId,
        matchStatus: "matched-auto",
        matchMethod: result.matchMethod,
        matchConfidence: result.confidence,
      };
      this.detectedPosts.unshift(matchedPost);
      if (license) {
        this.emit({
          type: "post-matched",
          post: matchedPost,
          license,
          at: new Date().toISOString(),
        });
      }
    } else {
      const noMatchPost: DetectedPost = { ...post, matchStatus: "no-match-found" };
      this.detectedPosts.unshift(noMatchPost);
      this.emit({ type: "post-no-match", post: noMatchPost, at: new Date().toISOString() });
    }
  }

  private expireEphemeralPosts(): void {
    const now = Date.now();
    for (let i = 0; i < this.detectedPosts.length; i += 1) {
      const post = this.detectedPosts[i];
      if (
        post.evidenceExpiresAt &&
        post.evidenceStatus === "live" &&
        new Date(post.evidenceExpiresAt).getTime() <= now
      ) {
        const updated: DetectedPost = { ...post, evidenceStatus: "ephemeral-preserved" };
        this.detectedPosts[i] = updated;
        this.emit({ type: "evidence-expired", post: updated, at: new Date().toISOString() });
      }
    }
  }

  private async refreshLicenses(): Promise<void> {
    try {
      const res = await licensingApi.listLicenses({
        filters: {
          search: "",
          statuses: [],
          usageTypes: [],
          dateRange: { from: null, to: null },
          sort: "issuedAt-desc",
        },
        page: 1,
        pageSize: 100,
      });
      this.licenses = res.licenses;
      this.licensesLoaded = true;
    } catch {
      // licenses unavailable; keep cache.
    }
  }

  private seedIfNeeded(): void {
    if (this.seeded) return;
    if (!this.licensesLoaded || !this.licenses.length) return;
    const seeds = buildSeedPosts(this.licenses);
    this.detectedPosts = [...seeds, ...this.detectedPosts];
    this.seeded = true;
  }

  private recomputeOverallStatus(): void {
    const statuses = this.syncStatus.platforms.map((p) => p.status);
    if (statuses.every((s) => s === "ok")) {
      this.syncStatus.overallStatus = "healthy";
    } else if (statuses.every((s) => s !== "ok" && s !== "no_accounts")) {
      this.syncStatus.overallStatus = "unavailable";
    } else {
      this.syncStatus.overallStatus = "degraded";
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildHealthySyncStatus(): TrackingSyncStatus {
  const now = new Date().toISOString();
  const next = new Date(Date.now() + 60_000).toISOString();
  const mk = (platform: SocialPlatformF06) => ({
    platform,
    status: "ok" as const,
    lastSyncAt: now,
    nextSyncAt: next,
    errorMessage: null,
  });
  return {
    platforms: [mk("instagram"), mk("tiktok"), mk("facebook")],
    overallStatus: "healthy",
    autoSyncEnabled: true,
  };
}

function buildPlaceholderLicense(licenseId: string | null): License {
  return {
    id: licenseId ?? "unknown",
    licenseTokenId: "LIC-UNKNOWN",
    companyId: "company-mock-001",
    companyName: "Marca Demo S.A.S.",
    trackId: "unknown",
    trackSnapshot: {
      title: "—",
      artist: "—",
      album: null,
      durationSec: 0,
      coverUrl: null,
      isrc: null,
    },
    usageType: "single-use",
    creditsConsumed: 0,
    status: "active",
    issuedAt: new Date().toISOString(),
    expiresAt: null,
    consumedAt: null,
    cancelledAt: null,
    cancellationReason: null,
    cancellableUntil: null,
    issuedByUserId: "user-mock-001",
    issuedByUserName: "Usuario Demo",
  };
}

export const trackingSimulator = new TrackingSimulator();
