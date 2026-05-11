/**
 * F-09 Catalog admin — types.
 * MOCK ONLY · Will move to api/types.ts when backend lands.
 */

export type AdminTrackStatus =
  | "active"
  | "hidden"
  | "legal_review"
  | "unavailable"
  | "pending_metadata";

export interface AdminTrackLicensee {
  companyId: string;
  companyName: string;
  licenses: number;
}

export interface AdminTrack {
  id: string;
  isrc: string;
  title: string;
  artist: string;
  genre: string;
  mood: string;
  durationSeconds: number;
  creditsRequired: number;
  status: AdminTrackStatus;
  activeLicenses: number;
  uploadedAt: string; // ISO
  updatedAt: string; // ISO
  recommendedUse: string;
  legalNotes: string;
  tags: string[];
  hasCompleteMetadata: boolean;
  licensees: AdminTrackLicensee[];
}

export interface CatalogStatsMock {
  total: number;
  active: number;
  hidden: number;
  legalReview: number;
  withActiveLicenses: number;
  lastUpdateLabel: string;
}

export interface CatalogFiltersState {
  search: string;
  status: AdminTrackStatus | "all";
  genre: string | "all";
  onlyWithActiveLicenses: boolean;
  onlyMissingMetadata: boolean;
  updatedWithin: "7d" | "30d" | "90d" | "all";
}

export const DEFAULT_CATALOG_FILTERS: CatalogFiltersState = {
  search: "",
  status: "all",
  genre: "all",
  onlyWithActiveLicenses: false,
  onlyMissingMetadata: false,
  updatedWithin: "all",
};
