/**
 * F-11 · Metrics module — Type contract.
 *
 * Reuses existing dashboard contract where possible to avoid duplication
 * (per project rule: "Reutiliza, no recrees"). Adds only what is specific
 * to the deep-analytics + report-export use case.
 *
 * NOTE: This module is the source of truth for the future backend. Any
 * shape declared here is what the API will need to implement.
 */
import type {
  LicenseStatusV2,
  LicenseUsageType,
  SocialPlatformV2,
} from "@/api/types.dashboard";

// ─── Re-exported aliases (so feature consumers don't import from dashboard) ──

/** Social network supported by F-11 metrics. */
export type SocialPlatform = SocialPlatformV2;

/** License usage type — kebab-case is the project-wide convention. */
export type LicenseUseType = LicenseUsageType;

/** License status reused from V2 contract. */
export type LicenseStatus = LicenseStatusV2;

// ─── Publication with metrics ────────────────────────────────────────────────

export type PublicationPostType = "reel" | "story" | "post" | "video" | "short";

export type PublicationSyncStatus =
  | "synced"
  | "syncing"
  | "partial"
  | "failed"
  | "no_data";

export interface PublicationMetric {
  id: string;
  publishedAt: string; // ISO
  platform: SocialPlatform;
  postUrl: string;
  postExternalId: string;
  postType: PublicationPostType;

  // Track licenciado
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  trackCoverUrl: string;

  // Licencia asociada
  licenseId: string;
  licenseUseType: LicenseUseType;
  licenseStatus: LicenseStatus;
  creditsSpent: number;

  // Métricas crudas
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;

  // Estado de los datos
  syncStatus: PublicationSyncStatus;
  lastSyncedAt: string | null;
  syncError?: string;
}

// ─── Aggregate overview ──────────────────────────────────────────────────────

export interface MetricsTotals {
  publications: number;
  views: number;
  /** likes + comments + shares + saves */
  interactions: number;
  /** (interactions / views) * 100, 2 decimals; 0 when views = 0. */
  engagementRate: number;
  creditsSpent: number;
}

export interface MetricsDeltas {
  publications: number | null;
  views: number | null;
  interactions: number | null;
  engagementRate: number | null;
  creditsSpent: number | null;
}

export interface PlatformBreakdownEntry {
  platform: SocialPlatform;
  publications: number;
  views: number;
  interactions: number;
  engagementRate: number;
}

export interface DataHealth {
  totalExpected: number;
  totalSynced: number;
  totalPartial: number;
  totalFailed: number;
  lastGlobalSyncAt: string;
  /** True if lastGlobalSyncAt > 3h ago. */
  isStale: boolean;
}

export interface MetricsOverview {
  periodStart: string;
  periodEnd: string;
  comparisonPeriodStart: string;
  comparisonPeriodEnd: string;
  totals: MetricsTotals;
  deltas: MetricsDeltas;
  byPlatform: PlatformBreakdownEntry[];
  dataHealth: DataHealth;
}

// ─── Credits by use type ─────────────────────────────────────────────────────

export interface CreditsByUseType {
  useType: LicenseUseType;
  label: string;
  count: number;
  creditsSpent: number;
  /** % over total credits spent in period; 0 when total = 0. */
  percentageOfTotal: number;
}

// ─── Top tracks (metrics-specific shape; coexists with dashboard TopTrack) ──

export interface MetricsTopTrack {
  rank: number;
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  trackCoverUrl: string;
  totalPublications: number;
  totalViews: number;
  totalInteractions: number;
  engagementRate: number;
  byPlatform: Record<SocialPlatform, number>;
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export type PeriodPreset =
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "last_month"
  | "custom";

export type SyncStatusFilter = "all" | "synced_only" | "with_issues";

export interface MetricsFilter {
  period: PeriodPreset;
  customRange?: { start: string; end: string };
  /** [] = todas. */
  platforms: SocialPlatform[];
  /** [] = todos. */
  useTypes: LicenseUseType[];
  /** null = todas. */
  trackId: string | null;
  syncStatusFilter: SyncStatusFilter;
}

// ─── Report export ───────────────────────────────────────────────────────────

export type ReportFormat = "pdf" | "excel";

export interface ReportContent {
  includeExecutiveSummary: boolean;
  includeLicenses: boolean;
  includeCreditsMovement: boolean;
  includePublications: boolean;
  includeMetrics: boolean;
  includeEvidence: boolean;
  includeTopTracks: boolean;
}

export interface ReportConfig {
  filter: MetricsFilter;
  format: ReportFormat;
  content: ReportContent;
  language: "es" | "en";
  fileName: string;
}

export type ReportJobStatus =
  | "queued"
  | "generating"
  | "ready"
  | "failed"
  | "cancelled";

export interface ReportJob {
  id: string;
  config: ReportConfig;
  status: ReportJobStatus;
  /** 0–100 */
  progress: number;
  estimatedSeconds: number | null;
  /** Always null in mocks; UI must simulate download. */
  fileUrl: string | null;
  createdAt: string;
  completedAt: string | null;
  errorMessage?: string;
  rowCount?: number;
  fileSize?: string;
}

// ─── Scenario switcher ───────────────────────────────────────────────────────

export type MetricsScenario = "happy" | "empty" | "sparse" | "partial" | "heavy";
