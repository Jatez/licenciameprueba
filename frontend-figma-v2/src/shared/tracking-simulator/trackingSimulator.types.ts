/**
 * Tracking simulator types.
 *
 * The simulator is a frontend-only stand-in for what backend will eventually
 * implement via webhooks/polling against Meta Graph + TikTok Display APIs.
 */
import type {
  DetectedPost,
  License,
  PostType,
  SocialPlatformF06,
} from "@/api/types";

export interface TrackingSimulatorConfig {
  /** Master switch. */
  enabled: boolean;
  /** How often `tick()` runs. Default 60_000 (60s). */
  autoDetectIntervalMs: number;
  /** 0-1 probability the auto-tick generates a post that won't match. */
  forceNoMatchRate: number;
  /** 0-1 probability a tick emits a sync-error event instead of a detection. */
  forceErrorRate: number;
  /** When true, randomly degrades sync status of one platform per tick. */
  simulateRateLimits: boolean;
  /** Story expiration window for the simulator. Default 24h. */
  ephemeralStoryLifetimeMs: number;
}

export interface ForceDetectionOptions {
  platform?: SocialPlatformF06;
  postType?: PostType;
  /** Force the detection to NOT match any active license. */
  forceNoMatch?: boolean;
  /** Force the detection to expire shortly (used to demo evidence-expired). */
  forceImmediateExpiration?: boolean;
}

export type TrackingEvent =
  | { type: "post-detected"; post: DetectedPost; at: string }
  | { type: "post-matched"; post: DetectedPost; license: License; at: string }
  | { type: "post-no-match"; post: DetectedPost; at: string }
  | { type: "evidence-expired"; post: DetectedPost; at: string }
  | { type: "sync-error"; platform: SocialPlatformF06; error: string; at: string }
  | { type: "post-unlinked"; post: DetectedPost; at: string }
  | { type: "post-linked-manually"; post: DetectedPost; license: License; at: string };

export type TrackingEventHandler = (event: TrackingEvent) => void;

export interface MatchResult {
  matched: boolean;
  licenseId: string | null;
  matchMethod: "isrc" | "track-id" | "time-window" | null;
  confidence: number | null;
}
