/**
 * Dashboard V2 contract (F-08).
 * Isolated from legacy DashboardData to allow parallel coexistence.
 * When V2 is validated, V1 types in api/types.ts will be deprecated.
 */

// ─── Period ──────────────────────────────────────────────────────────────────

export type DashboardPeriod = "7d" | "30d" | "90d" | "ytd" | "custom";

export interface DashboardPeriodRange {
  preset: DashboardPeriod;
  from: string; // ISO
  to: string; // ISO
  comparedFrom: string;
  comparedTo: string;
}

// ─── Wallet ──────────────────────────────────────────────────────────────────

export interface WalletV2 {
  balance: number;
  totalPurchased: number;
  consumedInPeriod: number;
  expiresAt: string | null;
  daysUntilExpiry: number | null;
  lowBalanceThreshold: number;
  expiryWarningDays: number;
}

// ─── KPIs ────────────────────────────────────────────────────────────────────

export type KpiId = "balance" | "active-licenses" | "tracked-posts" | "bag-validity";
export type KpiDirection = "up" | "down" | "flat";
export type KpiSentiment = "positive" | "negative" | "neutral";

export interface DashboardKpi {
  id: KpiId;
  value: number | string;
  deltaValue: number;
  deltaPercent: number;
  direction: KpiDirection;
  sentiment: KpiSentiment;
  sparkline: number[];
  unit?: string;
  lastUpdated: string;
}

// ─── Credit usage ────────────────────────────────────────────────────────────

export type LicenseUsageType =
  | "single-use"
  | "stories-pack"
  | "monthly-extended"
  | "long-video"
  | "paid-post"
  | "collaborative-post";

export interface CreditUsagePoint {
  date: string;
  total: number;
  byUsageType: Record<LicenseUsageType, number>;
}

export interface CreditUsageSeries {
  points: CreditUsagePoint[];
  periodTotal: number;
  periodAverage: number;
  previousPeriodTotal: number;
  previousPeriodAverage: number;
}

// ─── Licenses ────────────────────────────────────────────────────────────────

export type LicenseStatusV2 =
  | "active"
  | "consumed"
  | "expired"
  | "cancelled"
  | "needs-review";

export interface LicenseSummaryV2 {
  active: number;
  consumed: number;
  expired: number;
  cancelled: number;
  needsReview: number;
  totalIssuedInPeriod: number;
}

// ─── Top tracks ──────────────────────────────────────────────────────────────

export type SocialPlatformV2 = "instagram" | "tiktok" | "facebook";

export type TopSongSort = "licenses" | "impressions" | "credits";

export interface TopTrack {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  licensesCount: number;
  totalImpressions: number;
  totalInteractions: number;
  /** Total credits consumed by licenses derived from this track. */
  creditsConsumed: number;
  platforms: SocialPlatformV2[];
}

// ─── Platform metrics ────────────────────────────────────────────────────────

export interface PlatformMetrics {
  platform: SocialPlatformV2;
  postsCount: number;
  impressions: number;
  interactions: number;
  connected: boolean;
  /** DS-GAP: handle público de la cuenta vinculada (e.g. "@marca.demo"). */
  handle?: string;
  /** DS-GAP: serie corta para mini-sparkline en la card de la red. */
  sparkline?: number[];
}

// ─── Activity ────────────────────────────────────────────────────────────────

export type ActivityType =
  | "license-issued"
  | "license-cancelled"
  | "credits-purchased"
  | "post-detected"
  | "post-matched-auto"
  | "post-matched-manual"
  | "post-unlinked"
  | "evidence-expired"
  | "license-consumed-by-post"
  | "social-account-connected"
  | "low-balance-alert"
  | "bag-expiring-alert"
  | "license-needs-review"
  | "sync-error"
  | "no-match-found";

export type ActivityItemStatus = "success" | "warning" | "error" | "info";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actionRoute?: string;
  actionLabel?: string;
  /** Optional status badge to display alongside the item. */
  status?: ActivityItemStatus;
  metadata?: Record<string, unknown>;
}

// ─── User Activity (acciones ejecutadas por el usuario / cuenta) ─────────────

/**
 * Eventos producidos exclusivamente por usuarios de la cuenta empresa.
 * Excluye detecciones automáticas, alertas de sistema y eventos del social-listener.
 */
export type UserActivityType =
  | "license_issued"
  | "certificate_downloaded"
  | "license_url_linked"
  | "license_voided"
  | "credits_purchased"
  | "social_connected"
  | "social_disconnected"
  | "track_favorited"
  | "playlist_imported"
  | "report_exported"
  | "company_updated";

export interface UserActivityActor {
  user_id: string;
  user_name: string;
}

export interface UserActivity {
  id: string;
  type: UserActivityType;
  actor: UserActivityActor;
  payload: Record<string, string | number>;
  created_at: string;
  detail_url?: string;
}

// ─── Alerts ──────────────────────────────────────────────────────────────────

export type AlertSeverity = "critical" | "warning" | "info";

export type DashboardAlertType =
  | "low-balance"
  | "bag-expiring"
  | "no-social-accounts"
  | "needs-review"
  | "sync-error";

export interface DashboardAlert {
  id: string;
  severity: AlertSeverity;
  type: DashboardAlertType;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaRoute?: string;
  dismissible: boolean;
}

// ─── Freshness ───────────────────────────────────────────────────────────────

export type SyncStatus = "fresh" | "stale" | "error";

export interface DashboardFreshness {
  lastSyncAt: string;
  syncStatus: SyncStatus;
}

// ─── Aggregate ───────────────────────────────────────────────────────────────

export interface DashboardDataV2 {
  period: DashboardPeriodRange;
  wallet: WalletV2;
  kpis: DashboardKpi[];
  creditUsage: CreditUsageSeries;
  licenseSummary: LicenseSummaryV2;
  topTracks: TopTrack[];
  platformMetrics: PlatformMetrics[];
  recentActivity: ActivityItem[];
  /**
   * Feed exclusivo de acciones realizadas por el usuario / miembros de la cuenta.
   * Reemplaza a `recentActivity` en el componente del dashboard; `recentActivity`
   * se mantiene como fuente legacy hasta migrar otras vistas.
   */
  userActivity: UserActivity[];
  alerts: DashboardAlert[];
  freshness: DashboardFreshness;
}

export type DashboardFixture = "default" | "newCompany" | "lowBalance" | "error";
