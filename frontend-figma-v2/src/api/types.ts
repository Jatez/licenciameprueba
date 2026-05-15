/**
 * API contract for Licénciame.
 * These types are the source of truth that backend will implement.
 * Today they're consumed against mocks; tomorrow against axios.
 */

// ─── User & Company ──────────────────────────────────────────────────────────

export type UserRole = "company_admin" | "manager" | "creator" | "auditor" | "super_admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
  emailVerified: boolean;
  /**
   * 0 = not started, 1..3 = in progress, 4 = completed or skipped.
   * Differentiate completed vs skipped via `onboardingSkipped`.
   */
  onboardingCurrentStep: number;
  onboardingCompleted: boolean;
  onboardingSkipped: boolean;
  createdAt: string; // ISO
}

export interface Company {
  id: string;
  name: string;
  countryCode: string; // ISO-2
  createdAt: string; // ISO
}

// ─── Auth tokens ─────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ─── Register ────────────────────────────────────────────────────────────────

export interface RegisterRequest {
  companyName: string;
  countryCode: string; // ISO-2
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  acceptedTerms: boolean;
}

export interface RegisterResponse {
  user: User;
  company: Company;
  tokens: AuthTokens;
  verificationEmailSent: boolean;
}

// ─── Email verification ──────────────────────────────────────────────────────

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  user: User;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ResendVerificationResponse {
  sent: boolean;
  /** ISO timestamp — UI uses it to drive the resend cooldown countdown. */
  nextRetryAvailableAt: string;
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export type OnboardingStepId = "explore-catalog" | "buy-credits" | "connect-social";

export interface OnboardingStep {
  id: OnboardingStepId;
  order: number; // 1, 2, 3
  titleKey: string;
  descriptionKey: string;
  ctaRouteOnFinish: string;
}

export interface OnboardingState {
  currentStep: number; // 0..4
  skipped: boolean;
  completed: boolean;
}

export interface CompleteOnboardingRequest {
  finalStep: number;
}

export interface CompleteOnboardingResponse {
  user: User;
}

export interface SkipOnboardingResponse {
  user: User;
}

// ─── Error contract ──────────────────────────────────────────────────────────

export type AuthErrorCode =
  | "EMAIL_ALREADY_EXISTS"
  | "PASSWORD_TOO_SHORT"
  | "INVALID_COUNTRY_CODE"
  | "INVALID_EMAIL"
  | "TERMS_NOT_ACCEPTED"
  | "VERIFICATION_TOKEN_EXPIRED"
  | "VERIFICATION_TOKEN_INVALID"
  | "EMAIL_ALREADY_VERIFIED"
  | "RESEND_COOLDOWN_ACTIVE"
  | "RATE_LIMIT_EXCEEDED"
  | "NETWORK_ERROR";

export interface ApiError {
  code: AuthErrorCode | string;
  message: string;
  /** Form field this error maps to, when applicable. */
  field?: string;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface WalletSummary {
  balance: number;
  expiresAt: string | null;
}

export type LicenseStatus = "active" | "expired" | "pending";

export interface LicenseSummary {
  id: string;
  trackTitle: string;
  status: LicenseStatus;
  licensedAt: string;
}

export type SocialPlatform = "instagram" | "tiktok" | "youtube";

export interface SocialAccountSummary {
  id: string;
  platform: SocialPlatform;
  handle: string;
}

export interface MetricsSummary {
  publicationsCount: number;
  totalImpressions: number;
}

export interface DashboardData {
  wallet: WalletSummary;
  licenses: LicenseSummary[];
  socialAccounts: SocialAccountSummary[];
  metrics: MetricsSummary;
}

// ─── Track domain & catalog (F-03) ───────────────────────────────────────────

/** Re-export to keep LicenseUsageType single-sourced from the dashboard contract. */
export type { LicenseUsageType } from "./types.dashboard";
import type { LicenseUsageType as _LicenseUsageType } from "./types.dashboard";

export type Genre =
  | "pop"
  | "rock"
  | "electronic"
  | "hip-hop"
  | "jazz"
  | "classical"
  | "latin"
  | "reggaeton"
  | "indie"
  | "rnb"
  | "folk"
  | "ambient"
  | "cinematic"
  | "corporate"
  | "acoustic"
  | "world";

/** Mood is a free string — taxonomy lives in client metadata. */
export type Mood = string;

export type LicensablePlatform = "instagram" | "tiktok" | "facebook";

export interface PlatformLicensability {
  platform: LicensablePlatform;
  allowed: boolean;
  allowedUsageTypes: _LicenseUsageType[];
  /** null = no extra platform-imposed cap. */
  maxDurationSec: number | null;
  notes: string | null;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string | null;
  coverUrl: string | null;
  genre: Genre;
  moods: Mood[];
  durationSec: number;
  bpm: number | null;
  tags: string[];
  releaseYear: number | null;
  language: string | null;
  previewUrl: string;
  /** ~200 floats in 0..1 for waveform rendering. null when metadata missing. */
  waveformPeaks: number[] | null;
  /** 0..100 — used for "most popular" sort. */
  popularityScore: number;
  isrc: string | null;
  platformLicensability: PlatformLicensability[];
  licensesIssuedCount: number;
  isFavorite: boolean;
  createdAt: string;
}

/** Compact track shape for list views. */
export interface TrackSummary {
  id: string;
  title: string;
  artist: string;
  coverUrl: string | null;
  genre: Genre;
  moods: Mood[];
  durationSec: number;
  previewUrl: string;
  waveformPeaks: number[] | null;
  popularityScore: number;
  platformsLicensable: LicensablePlatform[];
  isFavorite: boolean;
}

export type CatalogSortOption =
  | "popularity-desc"
  | "recent-desc"
  | "title-asc"
  | "title-desc"
  | "duration-asc"
  | "duration-desc"
  | "artist-asc";

export interface DurationRange {
  minSec: number;
  maxSec: number;
}

export interface CatalogFilters {
  search: string;
  genres: Genre[];
  moods: Mood[];
  durationRange: DurationRange | null;
  platforms: LicensablePlatform[];
  onlyFavorites: boolean;
  sort: CatalogSortOption;
}

export type CatalogPageSize = 25 | 50 | 100;

export interface CatalogPageRequest {
  filters: CatalogFilters;
  page: number;
  pageSize: CatalogPageSize;
}

export interface CatalogPageResponse {
  tracks: TrackSummary[];
  page: number;
  pageSize: CatalogPageSize;
  totalTracks: number;
  totalPages: number;
  appliedFilters: CatalogFilters;
  availableGenres: Array<{ genre: Genre; count: number }>;
  availableMoods: Array<{ mood: Mood; count: number }>;
  /** Suggestions when search yields zero results. null otherwise. */
  suggestedSearches: string[] | null;
}

export interface TrackDetailResponse {
  track: Track;
  /** null when FEATURE_SIMILAR_TRACKS is disabled. */
  similarTracks: TrackSummary[] | null;
}

export interface ToggleFavoriteRequest {
  trackId: string;
}

export interface ToggleFavoriteResponse {
  trackId: string;
  isFavorite: boolean;
}

export type CatalogErrorCode =
  | "TRACK_NOT_FOUND"
  | "TRACK_REMOVED"
  | "PREVIEW_UNAVAILABLE"
  | "INVALID_FILTERS"
  | "FEATURE_DISABLED"
  | "NETWORK_ERROR";

// ─── Licensing (F-05) ────────────────────────────────────────────────────────

/**
 * Catalog of usage types. Source-of-truth for credit costs lives here in MVP.
 * In production this comes from `getUsageTypeCatalog()` so pricing edits don't
 * require a frontend release.
 */
export interface UsageTypeDefinition {
  id: _LicenseUsageType;
  creditCost: number;
  titleKey: string;
  descriptionKey: string;
  exampleKey: string;
  iconName: string;
}

export type UsageTypeCatalog = UsageTypeDefinition[];

/**
 * Full lifecycle for F-05 licenses. Distinct from legacy `LicenseStatus`
 * (active|expired|pending) used by the V1 dashboard summary.
 */
export type LicenseStatusFull = "active" | "consumed" | "expired" | "cancelled";

/**
 * Immutable snapshot of the track at issuance time.
 *
 * Backend MUST persist this at write-time — never resolve via FK at read-time.
 * Tracks may be edited or removed from the catalog after a license is issued;
 * the certificate must always show the exact metadata the buyer agreed to.
 */
export interface LicenseTrackSnapshot {
  title: string;
  artist: string;
  album: string | null;
  durationSec: number;
  coverUrl: string | null;
  isrc: string | null;
}

/**
 * Issued license. `licenseTokenId` is the human-readable id (e.g. LIC-A8F3-2024)
 * shown to users; `id` is the internal UUID.
 *
 * Backend computes:
 *   `cancellableUntil = issuedAt + cancellationPolicy.cancellableWindowHours`
 */
export interface License {
  id: string;
  licenseTokenId: string;
  companyId: string;
  companyName: string;
  trackId: string;
  trackSnapshot: LicenseTrackSnapshot;
  usageType: _LicenseUsageType;
  creditsConsumed: number;
  status: LicenseStatusFull;
  issuedAt: string;
  expiresAt: string | null;
  consumedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  cancellableUntil: string | null;
  issuedByUserId: string;
  issuedByUserName: string;
}

export interface LicensingValidationRequest {
  trackId: string;
  usageType: _LicenseUsageType;
}

export type LicensingValidationReason =
  | "INSUFFICIENT_CREDITS"
  | "TRACK_NOT_LICENSABLE_FOR_USAGE"
  | "TRACK_NOT_FOUND"
  | "TRACK_REMOVED"
  | "WALLET_EXPIRED"
  | "NO_ACTIVE_WALLET";

export interface LicensingValidationResponse {
  allowed: boolean;
  reasons: LicensingValidationReason[];
  requiredCredits: number;
  currentBalance: number;
  resultingBalance: number;
}

/**
 * `acceptedTermsVersion` MUST match the active terms version on the server at
 * issue-time. If the user kept the wizard open while terms changed, backend
 * returns `TERMS_VERSION_OUTDATED` and the wizard re-fetches.
 *
 * Recommended: send a client-generated `Idempotency-Key` header so that retries
 * never double-charge the wallet.
 */
export interface IssueLicenseRequest {
  trackId: string;
  usageType: _LicenseUsageType;
  acceptedTermsVersion: string;
  acceptedAt: string;
}

export interface IssueLicenseResponse {
  license: License;
  newWalletBalance: number;
  certificateAvailable: boolean;
}

export interface CancellationPolicy {
  cancellableWindowHours: number;
  requiresEvidence: boolean;
  requiresAdminApproval: boolean;
  /** Legal copy comes from backend so wording can change without a release. */
  policyText: string;
  policyVersion: string;
  lastUpdatedAt: string;
}

export interface LicensingTermsResponse {
  version: string;
  bodyMarkdown: string;
  summaryBullets: string[];
  cancellationPolicy: CancellationPolicy;
  lastUpdatedAt: string;
}

// ─── Licenses list & filters (F-05 prompt 3) ────────────────────────────────

/**
 * Rich UI filter shape used by the `/licenses` page. Backend may receive a
 * narrower projection (e.g. server doesn't need `sort` if sorting is client-side
 * for small datasets), but for the MVP the client mirrors the full request.
 */
export interface ListLicensesFilters {
  /** Free-text search on track title, artist, or licenseTokenId. */
  search: string;
  /** Multi-select; empty array = all statuses. */
  statuses: LicenseStatusFull[];
  /** Multi-select; empty array = all usage types. */
  usageTypes: _LicenseUsageType[];
  /** ISO strings; either side null = unbounded. */
  dateRange: { from: string | null; to: string | null };
  sort: LicenseSort;
}

export type LicenseSort =
  | "issuedAt-desc"
  | "issuedAt-asc"
  | "track-asc"
  | "creditsConsumed-desc"
  | "creditsConsumed-asc";

export type LicenseListPageSize = 25 | 50 | 100;

export interface ListLicensesRequest {
  filters: ListLicensesFilters;
  page: number;
  pageSize: LicenseListPageSize;
}

export interface LicenseListAggregates {
  totalActive: number;
  totalConsumed: number;
  totalExpired: number;
  totalCancelled: number;
  totalCreditsConsumed: number;
}

export interface ListLicensesResponse {
  licenses: License[];
  page: number;
  pageSize: LicenseListPageSize;
  totalLicenses: number;
  totalPages: number;
  /**
   * Aggregates apply to the *unfiltered* dataset for the current company —
   * they back the always-visible KPI strip on the list page. Backend should
   * compute these in a single query (e.g. GROUP BY status) so the list and
   * the strip can be served from one round-trip.
   */
  aggregates: LicenseListAggregates;
}

// ─── Cancellation ────────────────────────────────────────────────────────────

export type CancellationReasonCategory =
  | "wrong-usage-type"
  | "wrong-track"
  | "decided-not-to-publish"
  | "duplicate-license"
  | "other";

export interface CancelLicenseRequest {
  licenseId: string;
  /** Free-text from the user (optional comments). May be empty. */
  reason: string;
  reasonCategory: CancellationReasonCategory;
}

export interface CancelLicenseResponse {
  license: License;
  refundedCredits: number;
  newWalletBalance: number;
}

export type CancellationErrorCode =
  | "CANCELLATION_WINDOW_EXPIRED"
  | "LICENSE_ALREADY_CONSUMED"
  | "LICENSE_ALREADY_CANCELLED"
  | "LICENSE_NOT_FOUND"
  | "NETWORK_ERROR";

export type LicensingErrorCode =
  | "INSUFFICIENT_CREDITS"
  | "TRACK_NOT_LICENSABLE_FOR_USAGE"
  | "WALLET_EXPIRED_DURING_TRANSACTION"
  | "CONCURRENT_LICENSING_DETECTED"
  | "TERMS_VERSION_OUTDATED"
  | "TRACK_REMOVED"
  | "NETWORK_ERROR"
  | "UNEXPECTED_ERROR";

// ─── Tracking (F-06) ─────────────────────────────────────────────────────────

/**
 * Tracking-specific platform set. Coexists with the legacy `SocialPlatform`
 * (`instagram | tiktok | youtube`) used by the V1 dashboard summary, which
 * cannot be reused here because F-06 needs Facebook and not YouTube.
 *
 * Backend hand-off: when F-07 (social account connection) lands, this should
 * become the single source of truth and the legacy alias should be retired.
 */
export type SocialPlatformF06 = "instagram" | "tiktok" | "facebook";

export interface SocialAccount {
  id: string;
  platform: SocialPlatformF06;
  /** e.g. "@licenciame_official" */
  username: string;
  displayName: string;
  avatarUrl: string | null;
  connected: boolean;
  /** ISO. */
  connectedAt: string | null;
  /** ISO. Null if no expiration applies. */
  tokenExpiresAt: string | null;
  syncStatus:
    | "ok"
    | "rate_limited"
    | "token_expired"
    | "error"
    | "permissions_revoked"
    | "duplicate_account";
  /** ISO. */
  lastSyncAt: string | null;
  /**
   * Marks the primary account when multiple accounts are linked for the same
   * platform. Optional so existing single-account fixtures keep working.
   * Backend hand-off: enforce uniqueness per (user, platform) at the DB level.
   */
  isPrimary?: boolean;
}

/** Tipped error codes returned by the simulated OAuth callback. */
export type ConnectErrorCode = "popup_blocked" | "account_taken";

export class ConnectFlowError extends Error {
  code: ConnectErrorCode;
  attemptedUsername?: string;
  constructor(code: ConnectErrorCode, attemptedUsername?: string) {
    super(code);
    this.code = code;
    this.attemptedUsername = attemptedUsername;
    this.name = "ConnectFlowError";
  }
}

/** Post type — drives evidence/expiration logic and matching strictness. */
export type PostType = "reel" | "feed-post" | "story" | "tiktok-video" | "facebook-post";

/** Post types that expire on the platform (e.g. stories vanish after 24h). */
export const EPHEMERAL_POST_TYPES: PostType[] = ["story"];

/** Hours each post type lives on the platform. Null = permanent. */
export const POST_EPHEMERAL_DURATION_HOURS: Record<PostType, number | null> = {
  story: 24,
  reel: null,
  "feed-post": null,
  "tiktok-video": null,
  "facebook-post": null,
};

/**
 * Immutable snapshot of the post + matched track at detection time.
 * Stored frontend-side in MVP; backend should persist server-side so evidence
 * survives even if track or post mutates / disappears (especially for stories).
 */
export interface PostSnapshot {
  /** ISO timestamp of when the snapshot was captured. */
  capturedAt: string;
  /** In MVP we reuse the track's coverUrl. */
  thumbnailUrl: string | null;
  caption: string | null;
  hashtags: string[];
  detectedTrackId: string;
  detectedTrackTitle: string;
  detectedArtist: string;
}

export interface PostMetrics {
  impressions: number;
  reproductions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  /** ISO timestamp. */
  lastUpdatedAt: string;
}

export type MatchStatus =
  | "pending-match"
  | "matched-auto"
  | "matched-manual"
  | "no-match-found"
  | "unlinked"
  | "expired-before-publish";

export type EvidenceStatus =
  | "live"
  | "ephemeral-preserved"
  | "removed-by-platform"
  | "unavailable";

export interface AudioDetectionItem {
  id: string;
  detector_provider: string | null;
  detection_status: string | null;
  matched_track_id: string | null;
  confidence_score: number | null;
  matched_title: string | null;
  matched_artist: string | null;
  created_at: string;
}

export interface DetectedPost {
  id: string;
  /** Null until the post is matched. */
  licenseId: string | null;
  platform: SocialPlatformF06;
  postType: PostType;
  /** Native post id from the social network. */
  externalPostId: string;
  /** Browsable URL. */
  externalUrl: string;
  /** ISO. */
  publishedAt: string;
  /** ISO. */
  detectedAt: string;
  matchStatus: MatchStatus;
  /** 0-1 informational; null when not applicable. */
  matchConfidence: number | null;
  matchMethod: "isrc" | "track-id" | "manual" | "time-window" | null;
  evidenceStatus: EvidenceStatus;
  /** ISO — only set for ephemeral types (publishedAt + duration). */
  evidenceExpiresAt: string | null;
  snapshot: PostSnapshot;
  /** Null until the simulated sync brings metrics. */
  metrics: PostMetrics | null;
  /** Filled when a manual link was created. */
  linkedByUserId: string | null;
  /** ISO timestamp of the link event. */
  linkedAt: string | null;
  /** Filled when matchStatus === 'unlinked'. */
  unlinkReason: string | null;
  // ── Extra fields mapped from backend ──────────────────────────────────
  externalId?: string;
  caption?: string | null;
  thumbnailUrl?: string | null;
  authorName?: string | null;
  authorHandle?: string | null;
  likeCount?: number | null;
  viewCount?: number | null;
  commentCount?: number | null;
  duration?: number | null;
  contentType?: string | null;
  trackTitle?: string | null;
  trackId?: string | null;
  confidence?: number | null;
  /** All audio detections for this post (from /contents/:id detail). */
  detections?: AudioDetectionItem[];
}

// ─── Manual linking ──────────────────────────────────────────────────────────

export interface ManualLinkRequest {
  licenseId: string;
  externalUrl: string;
  platform: SocialPlatformF06;
  postType: PostType;
  /** ISO timestamp the user reports. */
  publishedAt: string;
}

export interface ManualLinkResponse {
  post: DetectedPost;
  license: License;
}

export interface UnlinkPostRequest {
  postId: string;
  reason: string;
}

export interface UnlinkPostResponse {
  post: DetectedPost;
  license: License;
}

// ─── Sync status ─────────────────────────────────────────────────────────────

export interface TrackingSyncStatus {
  platforms: Array<{
    platform: SocialPlatformF06;
    status: "ok" | "rate_limited" | "token_expired" | "no_accounts" | "error";
    /** ISO. */
    lastSyncAt: string | null;
    /** ISO. */
    nextSyncAt: string | null;
    errorMessage: string | null;
  }>;
  overallStatus: "healthy" | "degraded" | "unavailable";
  autoSyncEnabled: boolean;
}

// ─── Tracking feed ───────────────────────────────────────────────────────────

export type TrackingFeedFilter =
  | "all"
  | "pending-match"
  | "matched-auto"
  | "matched-manual"
  | "no-match-found"
  | "unlinked";

export type DetectedPostsPageSize = 25 | 50 | 100;

export interface ListDetectedPostsRequest {
  filter: TrackingFeedFilter;
  /** Empty array = all platforms. */
  platforms: SocialPlatformF06[];
  dateRange: { from: string | null; to: string | null };
  page: number;
  pageSize: DetectedPostsPageSize;
}

export interface ListDetectedPostsResponse {
  posts: DetectedPost[];
  page: number;
  pageSize: DetectedPostsPageSize;
  totalPosts: number;
  totalPages: number;
  aggregates: {
    pendingMatch: number;
    matchedAuto: number;
    matchedManual: number;
    noMatchFound: number;
    unlinked: number;
  };
  syncStatus: TrackingSyncStatus;
}

// ─── License associated content ──────────────────────────────────────────────

export interface LicenseAssociatedContent {
  licenseId: string;
  posts: DetectedPost[];
  /** True when license.status === 'active' and within issuance window. */
  canLinkManually: boolean;
}

// ─── Tracking errors ─────────────────────────────────────────────────────────

export type TrackingErrorCode =
  | "POST_NOT_FOUND"
  | "POST_ALREADY_LINKED"
  | "LICENSE_NOT_ELIGIBLE"
  | "URL_INVALID"
  | "URL_NOT_FROM_CONNECTED_ACCOUNT"
  | "PLATFORM_SYNC_UNAVAILABLE"
  | "NETWORK_ERROR";

/** Date range presets used by the monitoring feed toolbar. */
export type TrackingDateRangePreset =
  | "today"
  | "last7"
  | "last30"
  | "last90"
  | "custom";

// ─── F-04 · Credit packages & wallet purchases ───────────────────────────────

// ── Real backend types ──────────────────────────────────────────────────────

/** Template de paquete tal como lo devuelve GET /packages/templates */
export interface PackageTemplate {
  id: string;
  code: string;
  name: string;
  credits: number;
  credits_total: number;
  duration_days: number;
  price_usd: number;
  price_cop: number;
  price_per_credit_cop: number;
  catalog_scope: string;
  active_track_limit: number | null;
  description: string;
}

/** Suscripción activa de la empresa, GET /packages/my-subscription */
export interface ActiveSubscription {
  id: string;
  package_id: string;
  status: "active" | "past_due" | "canceled" | "trialing" | string;
  current_period_starts_at: string;
  current_period_ends_at: string;
  cancel_at_period_end: boolean;
  licenses_used_this_period: number;
  package_name: string;
  credits_total: number;
  credits_available: number;
  template_code: string;
}

/** Body para POST /packages/purchase */
export interface PurchasePackageRealRequest {
  template_id: string;
  payment_method: string;
}

// ── Legacy mock types (mantenidos por compatibilidad con UI no migrada) ──────

export type CreditPackageId = "bag-a" | "bag-b" | "bag-c";

export interface CreditPackage {
  id: CreditPackageId;
  name: string;
  credits: number;
  priceCop: number;
  validityMonths: number;
  recommended?: boolean;
  /** Derived: priceCop / credits, rounded. */
  pricePerCreditCop: number;
}

export type PaymentMethod = "card-simulated" | "bank-transfer-simulated";

export type PurchaseStatus =
  | "draft"
  | "processing"
  | "pending_payment"
  | "pending_confirmation"
  | "pending"
  | "confirmed"
  | "rejected"
  | "failed"
  | "manual_review"
  | "expired";

export type CreditBagStatus = "active" | "exhausted" | "expired";

export interface CreditBag {
  id: string;
  packageId: CreditPackageId;
  packageName: string;
  creditsTotal: number;
  creditsRemaining: number;
  purchasedAt: string;
  expiresAt: string;
  status: CreditBagStatus;
  purchaseId: string;
}

export interface WalletAggregate {
  balance: number;
  totalPurchased: number;
  bags: CreditBag[];
  earliestExpiry: string | null;
  daysUntilEarliestExpiry: number | null;
}

export interface PurchaseQuote {
  id: string;
  packageId: CreditPackageId;
  packageSnapshot: CreditPackage;
  buyerCompanyName: string;
  buyerCompanyId: string;
  buyerEmail: string;
  subtotalCop: number;
  ivaCop: number;
  totalCop: number;
  createdAt: string;
  validUntil: string;
}

/**
 * Audit-log event tied to a purchase. Append-only on the backend; the UI
 * uses the array as the source for the visual timeline.
 */
export type PurchaseEventType =
  | "order_created"
  | "quote_generated"
  | "payment_initiated"
  | "payment_pending"
  | "payment_received"
  | "payment_rejected"
  | "manual_review_flagged"
  | "credits_credited"
  | "receipt_emitted"
  | "confirmation_email_sent";

export interface PurchaseEvent {
  id: string;
  type: PurchaseEventType;
  occurredAt: string;
  actor: "system" | "user" | "ops";
  note: string | null;
  metadata?: Record<string, string>;
}

export interface Purchase {
  id: string;
  quoteId: string;
  packageId: CreditPackageId;
  packageSnapshot: CreditPackage;
  paymentMethod: PaymentMethod;
  status: PurchaseStatus;
  subtotalCop: number;
  ivaCop: number;
  totalCop: number;
  createdAt: string;
  confirmedAt: string | null;
  failureReason: string | null;
  receiptNumber: string | null;
  bagId: string | null;
  cardLast4: string | null;
  transferReference: string | null;
  /** Append-only audit log. */
  events: PurchaseEvent[];
  /** Credits effectively credited; 0 while the purchase is pending. */
  creditsCredited: number;
  /** Reason given when status === "manual_review". */
  manualReviewReason: string | null;
  /**
   * Human-readable reason for `rejected` / `failed` status.
   * Mocked today; backend will populate.
   */
  rejectionReason?: string | null;
  /**
   * Human-readable reason for `pending_confirmation` (bank reconciliation
   * pending). Distinct from `manualReviewReason`, which is operational.
   */
  reviewReason?: string | null;
  /** True until the company has DIAN integration enabled. */
  isProvisionalDocument: boolean;
}

/**
 * Discriminator for the actionable CTAs rendered in the purchase detail Sheet.
 * Kept as string-union so it can be persisted in analytics events.
 */
export type PurchaseCtaAction =
  | "retry-payment"
  | "contact-support"
  | "view-full-detail"
  | "download-receipt";

export interface CreatePurchaseQuoteRequest {
  packageId: CreditPackageId;
}

export interface ConfirmCardPurchaseRequest {
  quoteId: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  forceFailure?: boolean;
}

export interface ConfirmBankTransferIntentRequest {
  quoteId: string;
}

export interface BankTransferInstructions {
  bankName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  nit: string;
  reference: string;
  amountCop: number;
  expiresAt: string;
}

export interface ConfirmBankTransferIntentResponse {
  purchase: Purchase;
  instructions: BankTransferInstructions;
}

export interface ListPurchasesRequest {
  page: number;
  pageSize: 10 | 25 | 50;
}

export interface ListPurchasesResponse {
  purchases: Purchase[];
  page: number;
  pageSize: number;
  totalPurchases: number;
  totalPages: number;
}

export type PurchaseErrorCode =
  | "QUOTE_EXPIRED"
  | "QUOTE_NOT_FOUND"
  | "PACKAGE_NOT_FOUND"
  | "PAYMENT_DECLINED"
  | "CARD_INVALID"
  | "NETWORK_ERROR";

// ─── F-04 · Billing profile (B2B Colombia) ───────────────────────────────────

/**
 * Tax payer types per DIAN classification (Colombia).
 * Hand-off backend: persist by companyId; expose via /companies/:id/billing-profile.
 */
export type TaxpayerType = "natural" | "juridica";

export type TaxRegime =
  | "responsable-iva"
  | "no-responsable-iva"
  | "regimen-simple"
  | "gran-contribuyente";

export interface BillingProfile {
  /** Razón social. */
  legalName: string;
  /** NIT formatted as 900.123.456-7. */
  taxId: string;
  taxpayerType: TaxpayerType;
  taxRegime: TaxRegime;
  billingEmail: string;
  fiscalAddress: string;
  city: string;
  /** ISO-3 country code; default "COL". */
  country: string;
  contactName: string;
  /** E.164-ish: +57 followed by 10 digits, or international format. */
  contactPhone: string;
}

