export type SocialPlatform = "tiktok" | "meta";
export type SocialMatchStatus =
  | "matched"
  | "partial"
  | "not_available"
  | "legal_review";
export type SocialLicenseStatus =
  | "licensed"
  | "not_licensed"
  | "pending_review"
  | "potential_risk";
export type SocialIntegrationStatus = "connected" | "demo_connected" | "error";

export interface SocialPlatformIntegration {
  platform: SocialPlatform | "spotify";
  status: SocialIntegrationStatus | "manual";
}

export interface SocialDetection {
  id: string;
  postLabel: string;
  platform: SocialPlatform;
  trackTitle: string;
  artist: string;
  matchStatus: SocialMatchStatus;
  confidence: number;
  licenseStatus: SocialLicenseStatus;
}

export interface SocialMetric {
  key:
    | "postsAnalyzed"
    | "tracksDetected"
    | "matchedLicensable"
    | "partial"
    | "notAvailable"
    | "potentialRisks";
  value: number;
  highlight?: boolean;
}
