export type MatchSourcePlatform = "spotify" | "tiktok" | "meta";

export type MatchStatus = "matched" | "partial" | "not_available";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface MatchHubMetric {
  key: "analyses" | "tracksAnalyzed" | "matchesFound" | "matchRate" | "notAvailable";
  value: number;
  unit?: string;
  trend?: number[];
  delta?: { value: number; percent: number; sentiment: "positive" | "negative" | "neutral" };
}

export interface MatchAnalysisRecord {
  id: string;
  source: MatchSourcePlatform;
  title: string;
  subtitle: string;
  createdAt: string; // ISO
  totalTracks: number;
  matchedTracks: number;
  matchRate: number; // 0-100
}

export interface MatchedTrack {
  id: string;
  externalTitle: string;
  externalArtist: string;
  source: MatchSourcePlatform;
  status: MatchStatus;
  catalogTitle?: string;
  catalogArtist?: string;
  confidence?: number; // 0-100
  reason?: string;
}

export interface PlatformIntegration {
  platform: MatchSourcePlatform;
  status: IntegrationStatus;
  account?: string;
  lastSyncAt?: string;
}
