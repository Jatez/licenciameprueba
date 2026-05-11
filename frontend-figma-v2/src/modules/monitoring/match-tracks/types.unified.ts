import type { SocialPlatform } from "./types.social";

export type UnifiedSource = SocialPlatform | "spotify";
export type UnifiedMatchType = "exact" | "title_artist" | "partial" | "none" | "legal_review";
export type UnifiedLicenseStatus = "licensed" | "not_licensed" | "pending";

export interface UnifiedMatchRow {
  id: string;
  externalTitle: string;
  externalArtist: string;
  externalAlbum?: string;
  externalDuration?: string;
  externalMetadata?: string;
  source: UnifiedSource;
  catalogTitle?: string;
  catalogArtist?: string;
  catalogVersion?: string;
  catalogDuration?: string;
  matchType: UnifiedMatchType;
  confidence: number;
  credits?: number;
  status: "matched" | "partial" | "not_available" | "already_licensed";
  licenseStatus: UnifiedLicenseStatus;
  legalNote?: string;
}

export interface AlternativeTrack {
  id: string;
  title: string;
  artist: string;
  mood: string;
  credits: number;
}
