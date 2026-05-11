/**
 * F-09 · Admin Licenses (global view) — types.
 */

export type AdminLicenseStatus =
  | "active"
  | "consumed"
  | "expired"
  | "cancelled"
  | "disputed";

export type AdminLicenseUsageType =
  | "single-use"
  | "stories-pack"
  | "monthly-extended"
  | "long-video"
  | "paid-post"
  | "collaborative-post";

export type EvidenceEventType =
  | "issued"
  | "first_use_detected"
  | "publication"
  | "legal_review"
  | "renewed"
  | "cancelled"
  | "disputed"
  | "track_hidden";

export interface LicenseEvidenceEvent {
  id: string;
  timestamp: string;
  type: EvidenceEventType;
  title: string;
  description: string;
  platform?: "instagram" | "tiktok" | "youtube" | "facebook" | "other";
  url?: string;
  actor?: string;
}

export interface AdminLicense {
  id: string;
  tokenId: string;
  trackId: string;
  trackTitle: string;
  trackArtist: string;
  trackIsrc: string;
  trackHidden: boolean;
  companyId: string;
  companyName: string;
  usageType: AdminLicenseUsageType;
  creditsConsumed: number;
  status: AdminLicenseStatus;
  issuedAt: string;
  expiresAt: string | null;
  consumedAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  issuedByUserName: string;
  issuedByUserEmail: string;
  evidence: LicenseEvidenceEvent[];
}

export interface LicensesFiltersState {
  search: string;
  status: "all" | AdminLicenseStatus;
  usageType: "all" | AdminLicenseUsageType;
  company: "all" | string;
  range: "7d" | "30d" | "90d" | "all";
  onlyHiddenTracks: boolean;
}

export const LICENSES_DEFAULT_FILTERS: LicensesFiltersState = {
  search: "",
  status: "all",
  usageType: "all",
  company: "all",
  range: "30d",
  onlyHiddenTracks: false,
};
