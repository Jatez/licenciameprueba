/**
 * Centralized domain types — the contract backend will implement.
 * Re-exported from src/api/types.ts (canonical source of truth) so that
 * features can import from "@/shared/types" without coupling to api/.
 */
export type {
  // User & company
  User,
  UserRole,
  Company,
  AuthTokens,
  // Errors
  ApiError,
  AuthErrorCode,
  // Tracks / catalog
  Track,
  TrackSummary,
  Genre,
  Mood,
  CatalogFilters,
  CatalogPageRequest,
  CatalogPageResponse,
  // Platforms
  SocialPlatform,
  LicensablePlatform,
  PlatformLicensability,
  // Licenses
  License,
  LicenseStatus,
  LicenseStatusFull,
  LicenseSummary,
  LicenseUsageType,
  UsageTypeDefinition,
  UsageTypeCatalog,
  // Social accounts
  SocialAccount,
  SocialAccountSummary,
  // Tracking / monitoring
  DetectedPost,
  PostSnapshot,
  PostMetrics,
  MatchStatus,
  TrackingSyncStatus,
  // Wallet
  WalletSummary,
} from "@/api/types";

/** Generic paginated response shape used by every list endpoint. */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Domain aliases used throughout the app. */
export type Platform = import("@/api/types").SocialPlatform;
export type Role = import("@/api/types").UserRole;

/** Monitoring (tracking) re-aliases for clarity. */
export type MonitoringContent = import("@/api/types").DetectedPost;
export type MonitoringStatus = import("@/api/types").MatchStatus;

/** Metrics — re-export overview shape from the metrics module. */
export type { MetricsOverview } from "@/modules/monitoring/metrics/types";

/** Packages — re-export from packages module if present. */
export type { CreditPackage as Package, CreditPackageId as PackageTemplate } from "@/api/types";
